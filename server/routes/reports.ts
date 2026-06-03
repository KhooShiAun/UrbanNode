import { Router } from 'express'
import { desc, eq } from 'drizzle-orm'
import { db } from '../db.ts'
import { reports } from '../schema.ts'
import { requireResident } from '../middleware.ts'

const router = Router()

// Numeric (lat/lng) columns are stored as text by drizzle's `numeric` type.
// Accept a finite number, otherwise store null.
function toNumericString(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  const num = Number(value)
  return Number.isFinite(num) ? String(num) : null
}

// POST /api/reports — a resident files a new report.
router.post('/', requireResident, async (req, res, next) => {
  try {
    const { description, location_text, location_lat, location_lng, photo_url } =
      req.body ?? {}

    if (typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ error: 'A description is required' })
    }

    const [report] = await db
      .insert(reports)
      .values({
        user_id: req.session.userId!,
        description: description.trim(),
        location_text:
          typeof location_text === 'string' && location_text.trim()
            ? location_text.trim()
            : null,
        location_lat: toNumericString(location_lat),
        location_lng: toNumericString(location_lng),
        photo_url: typeof photo_url === 'string' && photo_url ? photo_url : null,
        // severity ('uncategorised') and status ('new') use schema defaults —
        // workers triage severity later.
      })
      .returning()

    res.status(201).json(report)
  } catch (err) {
    next(err)
  }
})

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

export default router
