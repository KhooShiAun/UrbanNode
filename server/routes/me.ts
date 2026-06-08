import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../db.ts'
import { users } from '../schema.ts'

const router = Router()

router.put('/', async (req, res) => {
  const userId = req.session.userId
  if (!userId) return res.status(401).json({ error: 'Not logged in' })

  const { full_name, email } = req.body

  await db
    .update(users)
    .set({ full_name, email })
    .where(eq(users.id, userId))

  res.json({ success: true })
})

export default router