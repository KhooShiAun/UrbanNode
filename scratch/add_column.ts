import 'dotenv/config'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  console.log('Connecting to database and running ALTER TABLE...')
  try {
    await pool.query('ALTER TABLE reports ADD COLUMN IF NOT EXISTS resolved_photo_url text;')
    console.log('Success! Column resolved_photo_url added or already exists.')
  } catch (err) {
    console.error('Error adding column:', err)
  } finally {
    await pool.end()
  }
}

run()
