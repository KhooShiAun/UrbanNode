import { Router } from 'express'
import { and, desc, eq, or, ilike, isNull, asc, sql } from 'drizzle-orm'
import { db } from '../db.ts'
import { reports, report_timeline, users } from '../schema.ts'
import { requireAuth, requireResident, requireWorker } from '../middleware.ts'
import { refreshBearProgress } from './gamification.ts'
import { classifyReport } from '../utils/ai.ts'
import { calculateDeadline } from '../utils/deadline.ts'

const router = Router()

// Numeric (lat/lng) columns are stored as text by drizzle's `numeric` type.
// Accept a finite number, otherwise store null.
function toNumericString(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  const num = Number(value)
  return Number.isFinite(num) ? String(num) : null
}

// GET /api/reports/all — all reports for workers
router.get('/all', requireWorker, async (_req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(reports)
      .orderBy(desc(reports.created_at))

    res.status(200).json(rows)
  } catch (err) {
    next(err)
  }
})

// GET /api/reports — retrieve reports (filtered/paginated for workers, owned-only for residents)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const conditions = []
    const role = req.session.role

    // Resident filtering: own reports only
    if (role === 'resident') {
      conditions.push(eq(reports.user_id, req.session.userId!))
    }

    // Worker filtering: query parameters
    if (role === 'worker') {
      const { status, severity, assignee_id, search } = req.query

      if (typeof status === 'string' && status) {
        conditions.push(eq(reports.status, status))
      }
      if (typeof severity === 'string' && severity) {
        conditions.push(eq(reports.severity, severity))
      }
      if (typeof assignee_id === 'string' && assignee_id) {
        if (assignee_id === 'unassigned' || assignee_id === 'null') {
          conditions.push(isNull(reports.assignee_id))
        } else {
          conditions.push(eq(reports.assignee_id, Number(assignee_id)))
        }
      }
      if (typeof search === 'string' && search.trim()) {
        const searchPattern = `%${search.trim()}%`
        const searchConditions = [
          ilike(reports.description, searchPattern),
          ilike(reports.location_text, searchPattern)
        ]
        
        // If search is a valid integer, try searching by report ID as well
        const searchNum = Number(search.trim())
        if (Number.isInteger(searchNum)) {
          searchConditions.push(eq(reports.id, searchNum))
        }
        
        conditions.push(or(...searchConditions))
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    let orderByClause = desc(reports.created_at)
    if (req.query.sort === 'sla_deadline_asc') {
      orderByClause = asc(reports.sla_deadline)
    } else if (req.query.sort === 'sla_deadline_desc') {
      orderByClause = desc(reports.sla_deadline)
    }

    const page = req.query.page ? Number(req.query.page) : undefined
    const limit = req.query.limit ? Number(req.query.limit) : 10

    if (page !== undefined && Number.isInteger(page) && page > 0) {
      const offset = (page - 1) * limit
      
      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(reports)
        .where(whereClause)
      
      const total = Number(countResult?.count || 0)
      
      const data = await db
        .select()
        .from(reports)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset)
        
      return res.status(200).json({
        data,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      })
    } else {
      const rows = await db
        .select()
        .from(reports)
        .where(whereClause)
        .orderBy(orderByClause)

      return res.status(200).json(rows)
    }
  } catch (err) {
    next(err)
  }
})

// GET /api/reports/statuses - list all valid status keys and labels
router.get('/statuses', requireAuth, async (_req, res, next) => {
  try {
    const list = [
      { id: 'new', label: 'Submitted' },
      { id: 'in_progress', label: 'In Progress' },
      { id: 'resolved', label: 'Resolved' },
      { id: 'uncategorised', label: 'Pending Triage' }
    ]
    res.status(200).json(list)
  } catch (err) {
    next(err)
  }
})

// GET /api/reports/:id — retrieve a single report (owned-only for residents, any for workers)
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid report id' })
    }

    const whereConditions = [eq(reports.id, id)]
    if (req.session.role === 'resident') {
      whereConditions.push(eq(reports.user_id, req.session.userId!))
    }

    const [report] = await db
      .select()
      .from(reports)
      .where(and(...whereConditions))

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    const timelineRows = await db
      .select({
        status: report_timeline.status,
        changed_at: report_timeline.changed_at,
        notes: report_timeline.notes,
        actor_name: users.full_name,
        actor_role: users.role,
      })
      .from(report_timeline)
      .leftJoin(users, eq(report_timeline.changed_by, users.id))
      .where(eq(report_timeline.report_id, id))
      .orderBy(asc(report_timeline.changed_at))

    const friendlyStatusLabels: Record<string, string> = {
      new: 'Submitted',
      in_progress: 'In Progress',
      resolved: 'Resolved',
      uncategorised: 'Pending Triage',
    }

    const timeline = timelineRows.map((row) => {
      const label = friendlyStatusLabels[row.status] || row.status
      return {
        label,
        at: row.changed_at ? row.changed_at.toISOString() : new Date().toISOString(),
        actor: row.actor_name || 'System',
      }
    })

    let ai_assessment = 'Pending assessment'
    if (report.severity === 'urgent') {
      if (report.description.toLowerCase().includes('children') ||
          report.description.toLowerCase().includes('playground') ||
          report.description.toLowerCase().includes('swing')) {
        ai_assessment = 'High risk to children - immediate attention required'
      } else {
        ai_assessment = 'High risk to public safety - immediate attention required'
      }
    } else if (report.severity === 'routine') {
      ai_assessment = 'Moderate risk — schedule routine repair'
    } else if (report.severity === 'low') {
      ai_assessment = 'Low risk — monitor and address when convenient'
    }

    res.status(200).json({
      ...report,
      ai_assessment,
      timeline,
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/reports — a resident files a new report.
// After inserting, refresh bear progress so any gear based on "Submit X reports" gets unlocked automatically.
router.post('/', requireResident, async (req, res, next) => {
  try {
    const userId = req.session.userId!
    const { description, location_text, location_lat, location_lng, photo_url } =
      req.body ?? {}

    if (typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ error: 'A description is required' })
    }

    const cleanDescription = description.trim()
    const resolvedSeverity = await classifyReport(cleanDescription)
    const slaDeadline = calculateDeadline(resolvedSeverity)

    const [report] = await db
      .insert(reports)
      .values({
        user_id: userId,
        description: cleanDescription,
        location_text:
          typeof location_text === 'string' && location_text.trim()
            ? location_text.trim()
            : null,
        location_lat: toNumericString(location_lat),
        location_lng: toNumericString(location_lng),
        photo_url: typeof photo_url === 'string' && photo_url ? photo_url : null,
        severity: resolvedSeverity,
        sla_deadline: slaDeadline,
      })
      .returning()

    // Add initial timeline entry
    await db.insert(report_timeline).values({
      report_id: report.id,
      status: 'new',
      changed_by: userId,
      notes: 'Report submitted.',
    })

    // Auto-refresh bear progress (gear unlocks for submitted count)
    await refreshBearProgress(userId)

    res.status(201).json(report)
  } catch (err) {
    next(err)
  }
})

// ── PATCH /api/reports/:id ──────────────────────────────────────────
// Update a report's properties (severity, status, assignee, SLA, notes).
// Resolving a ticket triggers bear progress refresh.
router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const reportId = Number(req.params.id)
    if (!Number.isInteger(reportId)) {
      return res.status(400).json({ error: 'Invalid report id' })
    }

    const { severity, status, assignee_id, sla_deadline, resolution_notes, notes } = req.body ?? {}

    // Fetch the report to get owner's user_id and existing status
    const [report] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    const updates: Record<string, unknown> = {}
    if (severity !== undefined) updates.severity = severity
    if (status !== undefined) updates.status = status
    if (assignee_id !== undefined) {
      updates.assignee_id = assignee_id === null || assignee_id === 'null' ? null : Number(assignee_id)
    }
    if (sla_deadline !== undefined) {
      updates.sla_deadline = sla_deadline ? new Date(sla_deadline) : null
    }
    if (resolution_notes !== undefined) {
      updates.resolution_notes = resolution_notes
    }

    // Update report
    const [updated] = await db
      .update(reports)
      .set(updates)
      .where(eq(reports.id, reportId))
      .returning()

    // Add timeline entry
    const statusChanged = status !== undefined && status !== report.status
    if (statusChanged || notes || resolution_notes) {
      await db.insert(report_timeline).values({
        report_id: reportId,
        status: status ?? report.status,
        changed_by: req.session.userId!,
        notes: notes || resolution_notes || 'Ticket updated.',
      })
    }

    // If report was just resolved, refresh the reporter's bear progress
    if (status === 'resolved' && report.status !== 'resolved' && report.user_id) {
      await refreshBearProgress(report.user_id)
    }

    res.json(updated)
  } catch (err) {
    next(err)
  }
})

// ── PATCH /api/reports/:id/status ───────────────────────────────────
// Update status only (kept for backward compatibility).
router.patch('/:id/status', requireAuth, async (req, res, next) => {
  try {
    const reportId = Number(req.params.id)
    const { status, notes } = req.body ?? {}

    if (!status) {
      return res.status(400).json({ error: 'status is required' })
    }

    const [report] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    const [updated] = await db
      .update(reports)
      .set({ status })
      .where(eq(reports.id, reportId))
      .returning()

    await db.insert(report_timeline).values({
      report_id: reportId,
      status,
      changed_by: req.session.userId!,
      notes: notes ?? null,
    })

    if (status === 'resolved' && report.status !== 'resolved' && report.user_id) {
      await refreshBearProgress(report.user_id)
    }

    res.json(updated)
  } catch (err) {
    next(err)
  }
})

export default router
