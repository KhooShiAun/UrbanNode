import { Router } from 'express'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { db } from '../db.ts'
import { bear_progress, users } from '../schema.ts'
import { requireAuth } from '../middleware.ts'

const router = Router()

const SALT_ROUNDS = 10

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { full_name, email, password, role } = req.body ?? {}

    if (!full_name || !email || !password || !role) {
      return res
        .status(400)
        .json({ error: 'full_name, email, password and role are required' })
    }

    const existing = await db.select().from(users).where(eq(users.email, email))
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS)

    const [user] = await db
      .insert(users)
      .values({ full_name, email, password_hash, role })
      .returning({
        id: users.id,
        full_name: users.full_name,
        email: users.email,
        role: users.role,
      })

    // Every resident starts a gamification (bear) progress row.
    if (role === 'resident') {
      await db.insert(bear_progress).values({ user_id: user.id })
    }

    req.session.userId = user.id
    req.session.role = user.role

    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/signin
router.post('/signin', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {}

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' })
    }

    const [user] = await db.select().from(users).where(eq(users.email, email))
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    req.session.userId = user.id
    req.session.role = user.role

    res.status(200).json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/signout
router.post('/signout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err)
    res.clearCookie('connect.sid')
    res.status(200).json({ message: 'Signed out' })
  })
})

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        full_name: users.full_name,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, req.session.userId!))

    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
})

export default router
