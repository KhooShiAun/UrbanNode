import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../db.ts'
import { reports } from '../schema.ts'

const router = Router()

const VALID_STATUSES = ['new', 'in_progress', 'resolved', 'uncategorised']

router.get('/', async (_req, res) => {
  try {
    const allReports = await db.select().from(reports).orderBy(reports.created_at)
    res.json(allReports)
  } catch (error) {
    console.error('Failed to fetch reports:', error)
    res.status(500).json({ error: 'Failed to fetch reports' })
  }
})

router.patch('/:id/status', async (req, res) => {
  try {
    const reportId = Number(req.params.id)
    const { status } = req.body

    if (!Number.isInteger(reportId)) {
      return res.status(400).json({ error: 'Invalid report id' })
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid report status' })
    }

    const updatedReport = await db
      .update(reports)
      .set({ status })
      .where(eq(reports.id, reportId))
      .returning()

    if (updatedReport.length === 0) {
      return res.status(404).json({ error: 'Report not found' })
    }

    res.json(updatedReport[0])
  } catch (error) {
    console.error('Failed to update report status:', error)
    res.status(500).json({ error: 'Failed to update report status' })
  }
})

export default router