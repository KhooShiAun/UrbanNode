import 'dotenv/config'
import bcrypt from 'bcrypt'
import { db, pool } from './db.ts'
import {
  bear_progress,
  gear_items,
  notifications,
  report_timeline,
  reports,
  users,
} from './schema.ts'

const DAY = 1000 * 60 * 60 * 24

async function main() {
  console.log('🌱 Seeding UrbanNode database...\n')

  // 1. Clear all tables in foreign-key-safe order (children first).
  console.log('🧹 Clearing existing data...')
  await db.delete(report_timeline)
  await db.delete(notifications)
  await db.delete(bear_progress)
  await db.delete(reports)
  await db.delete(gear_items)
  await db.delete(users)

  // 2. Users — all demo accounts share the password "demo1234".
  console.log('👤 Inserting users...')
  const password_hash = await bcrypt.hash('demo1234', 10)

  const insertedUsers = await db
    .insert(users)
    .values([
      { full_name: 'Sarah Lim', email: 'resident1@demo.com', password_hash, role: 'resident' },
      { full_name: 'Amir Hassan', email: 'resident2@demo.com', password_hash, role: 'resident' },
      { full_name: 'Ahmad bin Ali', email: 'worker1@demo.com', password_hash, role: 'worker', position: 'Senior Maintenance Worker', department: 'Public Works Department' },
      { full_name: 'M. Chen', email: 'worker2@demo.com', password_hash, role: 'worker', position: 'Maintenance Worker', department: 'Public Works Department' },
    ])
    .returning({ id: users.id, email: users.email })

  const sarah = insertedUsers.find((u) => u.email === 'resident1@demo.com')!
  const ahmad = insertedUsers.find((u) => u.email === 'worker1@demo.com')!
  const chen = insertedUsers.find((u) => u.email === 'worker2@demo.com')!
  console.log(`   → ${insertedUsers.length} users (2 residents, 2 workers)`)

  // 3. Gear items (inserted regardless of other data).
  console.log('🎒 Inserting gear items...')
  await db.insert(gear_items).values([
    { name: 'Safety Helmet', unlock_condition: 'Submit 1 report', asset_url: '/gear/helmet.svg' },
    { name: 'Utility Vest', unlock_condition: 'Submit 5 reports', asset_url: '/gear/vest.svg' },
    { name: 'Safety Gloves', unlock_condition: 'Submit 10 reports', asset_url: '/gear/gloves.svg' },
    { name: 'Tool Belt', unlock_condition: 'Resolve 15 reports', asset_url: '/gear/belt.svg' },
    { name: 'Safety Goggles', unlock_condition: 'Resolve 5 reports', asset_url: '/gear/goggles.svg' },
  ])
  console.log('   → 5 gear items')

  // 4. Reports (all assigned to Sarah) — Kuala Lumpur public infrastructure.
  console.log('📋 Inserting reports...')
  const now = Date.now()
  const insertedReports = await db
    .insert(reports)
    .values([
      {
        user_id: sarah.id,
        description: 'Broken glass scattered across the pedestrian walkway outside the LRT exit.',
        location_text: 'Jalan Bukit Bintang, near Pavilion KL',
        location_lat: '3.1490',
        location_lng: '101.7100',
        severity: 'urgent',
        status: 'resolved',
        sla_deadline: new Date(now - 5 * DAY),
        assignee_id: ahmad.id,
        resolution_notes: 'Fallen tree cleared, walkway swept and reopened.',
        created_at: new Date(now - 8 * DAY),
      },
      {
        user_id: sarah.id,
        description: 'A large tree has fallen across the road and is blocking one lane of traffic.',
        location_text: 'Jalan Ampang, near the KLCC underpass',
        location_lat: '3.1580',
        location_lng: '101.7120',
        severity: 'urgent',
        status: 'in_progress',
        sla_deadline: new Date(now + 1 * DAY),
        assignee_id: ahmad.id,
        created_at: new Date(now - 1 * DAY),
      },
      {
        user_id: sarah.id,
        description: 'Rubbish bin is overflowing and attracting pests near the playground.',
        location_text: 'Taman Tasik Perdana (Lake Gardens)',
        location_lat: '3.1430',
        location_lng: '101.6860',
        severity: 'routine',
        status: 'resolved',
        sla_deadline: new Date(now - 2 * DAY),
        assignee_id: chen.id,
        resolution_notes: 'Bin emptied and area disinfected.',
        created_at: new Date(now - 7 * DAY),
      },
      {
        user_id: sarah.id,
        description: 'Public bench has a broken slat and is unsafe to sit on.',
        location_text: 'KLCC Park, central walkway',
        location_lat: '3.1570',
        location_lng: '101.7130',
        severity: 'routine',
        status: 'new',
        sla_deadline: new Date(now + 5 * DAY),
        assignee_id: null,
        created_at: new Date(now - 2 * DAY),
      },
      {
        user_id: sarah.id,
        description: 'Clogged storm drain is causing water to pond on the footpath after rain.',
        location_text: 'Jalan Tun Razak, near Hospital Kuala Lumpur',
        location_lat: '3.1720',
        location_lng: '101.7050',
        severity: 'routine',
        status: 'in_progress',
        sla_deadline: new Date(now + 3 * DAY),
        assignee_id: chen.id,
        created_at: new Date(now - 3 * DAY),
      },
      {
        user_id: sarah.id,
        description: 'Street light has been out for several nights, leaving the junction very dark.',
        location_text: 'Jalan Pudu, near Pudu Sentral',
        location_lat: '3.1410',
        location_lng: '101.7030',
        severity: 'routine',
        status: 'resolved',
        sla_deadline: new Date(now - 4 * DAY),
        assignee_id: ahmad.id,
        resolution_notes: 'Bulb replaced, function restored.',
        created_at: new Date(now - 9 * DAY),
      },
      {
        user_id: sarah.id,
        description: 'Pedestrian crossing paint is badly faded and hard to see for drivers.',
        location_text: 'Jalan Sultan Ismail, near Concorde Hotel',
        location_lat: '3.1540',
        location_lng: '101.7080',
        severity: 'low',
        status: 'new',
        assignee_id: null,
        created_at: new Date(now - 4 * DAY),
      },
      {
        user_id: sarah.id,
        description: 'Minor crack in the pavement, not urgent but worth patching before it spreads.',
        location_text: 'Brickfields, Jalan Tun Sambanthan',
        location_lat: '3.1290',
        location_lng: '101.6860',
        severity: 'low',
        status: 'resolved',
        assignee_id: chen.id,
        resolution_notes: 'Pavement crack patched with asphalt.',
        created_at: new Date(now - 10 * DAY),
      },
      {
        user_id: sarah.id,
        description: 'Graffiti sprayed across the bus stop shelter.',
        location_text: 'Bangsar, Jalan Maarof',
        location_lat: '3.1280',
        location_lng: '101.6710',
        severity: 'low',
        status: 'new',
        assignee_id: null,
        created_at: new Date(now - 1 * DAY),
      },
      {
        user_id: sarah.id,
        description: 'Something looks off near the park entrance, not sure what exactly.',
        location_text: 'Near Perdana Botanical Garden',
        severity: 'uncategorised',
        status: 'uncategorised',
        assignee_id: null,
        created_at: new Date(now - 6 * DAY),
      },
      {
        user_id: sarah.id,
        description: 'Storm drain inspection needed due to local minor flooding.',
        location_text: 'River District, Kuala Lumpur',
        location_lat: '3.1350',
        location_lng: '101.6920',
        severity: 'urgent',
        status: 'in_progress',
        sla_deadline: new Date(now - 1.5 * DAY),
        assignee_id: ahmad.id,
        created_at: new Date(now - 3 * DAY),
      },
    ])
    .returning({ id: reports.id, status: reports.status })
  console.log(`   → ${insertedReports.length} reports (3 urgent, 4 routine, 3 low, 1 uncategorised)`)

  // 5. Bear progress for Sarah.
  console.log('🐻 Inserting bear progress...')
  await db.insert(bear_progress).values({
    user_id: sarah.id,
    level: 1,
    total_submitted: 11,
    total_resolved: 4,
    gear_unlocked: ['Safety Helmet', 'Utility Vest', 'Safety Gloves'],
  })
  console.log('   → Sarah: level 1 (Bronze), 11 submitted, 4 resolved, 3 gear unlocked')

  // 6. Report timeline — status progression for the resolved reports.
  console.log('🕓 Inserting report timeline entries...')
  const resolvedReports = insertedReports.filter((r) => r.status === 'resolved').slice(0, 3)
  const timelineRows = resolvedReports.flatMap((report, i) => {
    const base = now - (9 - i) * DAY
    return [
      {
        report_id: report.id,
        status: 'new',
        changed_by: ahmad.id,
        changed_at: new Date(base),
        notes: 'Report received and logged.',
      },
      {
        report_id: report.id,
        status: 'in_progress',
        changed_by: ahmad.id,
        changed_at: new Date(base + 1 * DAY),
        notes: 'Crew dispatched to assess the issue.',
      },
      {
        report_id: report.id,
        status: 'resolved',
        changed_by: ahmad.id,
        changed_at: new Date(base + 2 * DAY),
        notes: 'Issue fixed and verified on site.',
      },
    ]
  })
  await db.insert(report_timeline).values(timelineRows)
  console.log(`   → ${timelineRows.length} timeline entries across ${resolvedReports.length} resolved reports`)

  // 7. Notifications for Sarah (1 unread, 2 read) and Ahmad (2 notifications).
  console.log('🔔 Inserting notifications...')
  await db.insert(notifications).values([
    {
      user_id: sarah.id,
      message: 'Your report on Jalan Bukit Bintang has been resolved. Thank you!',
      is_read: true,
      created_at: new Date(now - 5 * DAY),
    },
    {
      user_id: sarah.id,
      message: 'A worker has been assigned to your fallen-tree report on Jalan Ampang.',
      is_read: true,
      created_at: new Date(now - 1 * DAY),
    },
    {
      user_id: sarah.id,
      message: 'Your clogged-drain report on Jalan Tun Razak is now in progress.',
      is_read: false,
      created_at: new Date(now - 2 * DAY),
    },
    {
      user_id: ahmad.id,
      message: 'New Urgent report submitted near Taman Tugu - requires immediate attention',
      is_read: false,
      created_at: new Date(now - 1 * DAY),
    },
    {
      user_id: ahmad.id,
      message: 'Report UR-043 has been assigned to you',
      is_read: false,
      created_at: new Date(now - 2 * DAY),
    },
  ])
  console.log('   → 5 notifications (3 for resident, 2 for worker)')

  console.log('\n✅ Seed complete.')
  console.log('   Resident login: resident1@demo.com / demo1234')
  console.log('   Worker login:   worker1@demo.com / demo1234')
}

main()
  .then(async () => {
    await pool.end()
    process.exit(0)
  })
  .catch(async (err) => {
    console.error('\n❌ Seed failed:', err)
    await pool.end()
    process.exit(1)
  })
