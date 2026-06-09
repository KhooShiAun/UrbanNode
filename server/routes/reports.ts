import { Router } from 'express'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '../db.ts'
import { reports, report_timeline } from '../schema.ts'
import { requireAuth, requireResident } from '../middleware.ts'
import { refreshBearProgress } from './gamification.ts'

const router = Router()

// Numeric (lat/lng) columns are stored as text by drizzle's `numeric` type.
// Accept a finite number, otherwise store null.
function toNumericString(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  const num = Number(value)
  return Number.isFinite(num) ? String(num) : null
}

// GET /api/reports — the caller's own reports, newest first.
router.get('/', requireResident, async (req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(reports)
      .where(eq(reports.user_id, req.session.userId!))
      .orderBy(desc(reports.created_at))

    res.status(200).json(rows)
  } catch (err) {
    next(err)
  }
})

// GET /api/reports/:id — a single report the caller owns.
router.get('/:id', requireResident, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid report id' })
    }

    const [report] = await db
      .select()
      .from(reports)
      .where(and(eq(reports.id, id), eq(reports.user_id, req.session.userId!)))

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    res.status(200).json(report)
  } catch (err) {
    next(err)
  }
})

// POST /api/reports — a resident files a new report.
// After inserting, refresh bear progress so any gear based on "Submit X reports" gets unlocked automatically.
router.post('/', requireResident, async (req, res, next) => {
  try {
    const userId = req.session.userId!
    const { description, location_text, location_lat, location_lng, photo_url, severity } =
      req.body ?? {}

    if (typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ error: 'A description is required' })
    }

    const [report] = await db
      .insert(reports)
      .values({
        user_id: userId,
        description: description.trim(),
        location_text:
          typeof location_text === 'string' && location_text.trim()
            ? location_text.trim()
            : null,
        location_lat: toNumericString(location_lat),
        location_lng: toNumericString(location_lng),
        photo_url: typeof photo_url === 'string' && photo_url ? photo_url : null,
        severity: severity ?? 'uncategorised',
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

// ── PATCH /api/reports/:id/status ───────────────────────────────────
// Update a report's status (e.g. new → in_progress → resolved).
// When a report is resolved, the reporter's bear progress is
// automatically updated (resolved count, level, gear).

router.patch('/:id/status', requireAuth, async (req, res, next) => {
  try {
    const reportId = Number(req.params.id)
    const { status, notes } = req.body ?? {}

    if (!status) {
      return res.status(400).json({ error: 'status is required' })
    }

    // Fetch the report to get the owner's user_id
    const [report] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    // Update the report status
    const [updated] = await db
      .update(reports)
      .set({ status })
      .where(eq(reports.id, reportId))
      .returning()

    // Add timeline entry
    await db.insert(report_timeline).values({
      report_id: reportId,
      status,
      changed_by: req.session.userId!,
      notes: notes ?? null,
    })

    // If report was just resolved, refresh the reporter's bear progress
    if (status === 'resolved' && report.user_id) {
      await refreshBearProgress(report.user_id)
    }

    res.json(updated)
  } catch (err) {
    next(err)
  }
})

export default router
