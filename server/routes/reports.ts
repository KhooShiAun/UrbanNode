import { Router } from 'express'
import { eq, desc } from 'drizzle-orm'
import { db } from '../db.ts'
import { reports, report_timeline } from '../schema.ts'
import { requireAuth, requireResident } from '../middleware.ts'
import { refreshBearProgress } from './gamification.ts'

const router = Router()

// ── GET /api/reports ────────────────────────────────────────────────
// List all reports for the logged-in user, newest first.

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.session.userId!

    const rows = await db
      .select()
      .from(reports)
      .where(eq(reports.user_id, userId))
      .orderBy(desc(reports.created_at))

    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// ── POST /api/reports ───────────────────────────────────────────────
// Create a new report. After inserting, refresh bear progress so any
// gear based on "Submit X reports" gets unlocked automatically.

router.post('/', requireResident, async (req, res, next) => {
  try {
    const userId = req.session.userId!
    const { description, location_text, location_lat, location_lng, photo_url, severity } =
      req.body ?? {}

    if (!description) {
      return res.status(400).json({ error: 'description is required' })
    }

    const [report] = await db
      .insert(reports)
      .values({
        user_id: userId,
        description,
        location_text: location_text ?? null,
        location_lat: location_lat ?? null,
        location_lng: location_lng ?? null,
        photo_url: photo_url ?? null,
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
