import { sql } from 'drizzle-orm'
import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  full_name: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  // 'resident' | 'worker'
  role: text('role').notNull(),
  created_at: timestamp('created_at').defaultNow(),
})

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  description: text('description').notNull(),
  location_text: text('location_text'),
  location_lat: numeric('location_lat'),
  location_lng: numeric('location_lng'),
  photo_url: text('photo_url'),
  // 'urgent' | 'routine' | 'low' | 'uncategorised'
  severity: text('severity').notNull().default('uncategorised'),
  // 'new' | 'in_progress' | 'resolved' | 'uncategorised'
  status: text('status').notNull().default('new'),
  sla_deadline: timestamp('sla_deadline'),
  created_at: timestamp('created_at').defaultNow(),
})

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  message: text('message').notNull(),
  is_read: boolean('is_read').default(false),
  created_at: timestamp('created_at').defaultNow(),
})

export const bear_progress = pgTable('bear_progress', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .references(() => users.id)
    .unique(),
  level: integer('level').default(1),
  total_resolved: integer('total_resolved').default(0),
  gear_unlocked: text('gear_unlocked')
    .array()
    .default(sql`'{}'::text[]`),
})

export const gear_items = pgTable('gear_items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  unlock_condition: text('unlock_condition').notNull(),
  asset_url: text('asset_url'),
})

export const report_timeline = pgTable('report_timeline', {
  id: serial('id').primaryKey(),
  report_id: integer('report_id').references(() => reports.id),
  status: text('status').notNull(),
  changed_by: integer('changed_by').references(() => users.id),
  changed_at: timestamp('changed_at').defaultNow(),
  notes: text('notes'),
})
