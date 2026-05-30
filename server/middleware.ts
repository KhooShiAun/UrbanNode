import type { NextFunction, Request, Response } from 'express'
import 'express-session'

// Augment the session so TypeScript knows about our custom fields.
declare module 'express-session' {
  interface SessionData {
    userId: number
    role: string
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  next()
}

export function requireResident(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  if (req.session.role !== 'resident') {
    return res.status(403).json({ error: 'Residents only' })
  }
  next()
}

export function requireWorker(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  if (req.session.role !== 'worker') {
    return res.status(403).json({ error: 'Workers only' })
  }
  next()
}
