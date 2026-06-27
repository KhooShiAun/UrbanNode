import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import { pool } from './db.ts'
import authRouter from './routes/auth.ts'
import meRouter from './routes/me.ts'
import reportsRouter from './routes/reports.ts'
import notificationsRouter from './routes/notifications.ts'
import gamificationRouter from './routes/gamification.ts'
import usersRouter from './routes/users.ts'

if (!process.env.SESSION_SECRET) {
  console.warn('[server] SESSION_SECRET is not set — using a dev-only fallback')
}

const app = express()
// Reports may carry a base64-encoded photo in the JSON body, which exceeds
// Express's default 100kb limit.
app.use(express.json({ limit: '8mb' }))

const PgSession = connectPgSimple(session)
app.use(
  session({
    store: new PgSession({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pool: pool as any,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET ?? 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      // Set to true in production behind HTTPS.
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
)

app.get('/api/health', async (_req, res) => {
  const { rows } = await pool.query('SELECT NOW() as now')
  res.json({ status: 'ok', db_time: rows[0].now })
})

app.use('/api/auth', authRouter)
app.use('/api/me', meRouter)
app.use('/api/reports', reportsRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/gamification', gamificationRouter)
app.use('/api/users', usersRouter)

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[server] unhandled error', err)
  res.status(500).json({ error: 'Internal server error' })
})

const port = Number(process.env.PORT) || 3001
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
