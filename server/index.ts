import 'dotenv/config'
import express from 'express'
import { pool } from './db.ts'

const app = express()
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  const { rows } = await pool.query('SELECT NOW() as now')
  res.json({ status: 'ok', db_time: rows[0].now })
})

const port = Number(process.env.PORT) || 3001
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
