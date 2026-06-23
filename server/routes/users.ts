import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../db.ts'
import { users } from '../schema.ts'
import { requireAuth } from '../middleware.ts'

const router = Router()

// GET /api/users/workers - list all workers
router.get('/workers', requireAuth, async (_req, res, next) => {
  try {
    const list = await db
      .select({
        id: users.id,
        full_name: users.full_name,
        email: users.email,
        position: users.position,
        department: users.department,
      })
      .from(users)
      .where(eq(users.role, 'worker'))

    res.status(200).json(list)
  } catch (err) {
    next(err)
  }
})

export default router
