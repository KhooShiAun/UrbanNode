import { Router } from 'express'
import { eq, sql } from 'drizzle-orm'
import { db } from '../db.ts'
import { bear_progress, gear_items, reports } from '../schema.ts'
import { requireResident } from '../middleware.ts'

const router = Router()

// ── Level thresholds (single source of truth) ───────────────────────
// These match the original frontend calculateLevel() function.

type LevelInfo = { current: string; next: string; threshold: number }

function calculateLevel(resolved: number): LevelInfo {
  if (resolved >= 100) return { current: 'Diamond', next: 'Diamond', threshold: 100 }
  if (resolved >= 50) return { current: 'Platinum', next: 'Diamond', threshold: 100 }
  if (resolved >= 25) return { current: 'Gold', next: 'Platinum', threshold: 50 }
  if (resolved >= 10) return { current: 'Silver', next: 'Gold', threshold: 25 }
  return { current: 'Bronze', next: 'Silver', threshold: 10 }
}

function levelFromNumber(level: number): LevelInfo {
  switch (level) {
    case 5: return { current: 'Diamond', next: 'Diamond', threshold: 100 }
    case 4: return { current: 'Platinum', next: 'Diamond', threshold: 100 }
    case 3: return { current: 'Gold', next: 'Platinum', threshold: 50 }
    case 2: return { current: 'Silver', next: 'Gold', threshold: 25 }
    default: return { current: 'Bronze', next: 'Silver', threshold: 10 }
  }
}

// ── Gear unlock thresholds ──────────────────────────────────────────
// Maps unlock_condition strings (from gear_items table) to the number
// of submitted reports required. This lets us check programmatically.

const UNLOCK_THRESHOLDS: Record<string, number> = {
  'Submit 1 report': 1,
  'Submit 5 reports': 5,
  'Submit 10 reports': 10,
  'Submit 15 reports': 15,
  'Submit 20 reports': 20,
  'Submit 25 reports': 25,
  'Submit 30 reports': 30,
  'Submit 50 reports': 50,
  'Submit 100 reports': 100,
  'Resolve 5 reports': -5,   // negative = resolved-based
  'Resolve 15 reports': -15,
}

// ── GET /api/gamification/profile ───────────────────────────────────
// Returns everything the Community Bear page needs in one request.

router.get('/profile', requireResident, async (req, res, next) => {
  try {
    const userId = req.session.userId!

    // 1. Fetch the bear_progress row (all stats live here)
    const [progress] = await db
      .select()
      .from(bear_progress)
      .where(eq(bear_progress.user_id, userId))

    // 2. Read counts from bear_progress; fall back to live query
    //    for users who don't have a row yet.
    let submitted: number
    let resolved: number

    if (progress) {
      submitted = progress.total_submitted ?? 0
      resolved = progress.total_resolved ?? 0
    } else {
      const [counts] = await db
        .select({
          submitted: sql<number>`count(*)::int`,
          resolved: sql<number>`count(*) filter (where ${reports.status} = 'resolved')::int`,
        })
        .from(reports)
        .where(eq(reports.user_id, userId))
      submitted = counts?.submitted ?? 0
      resolved = counts?.resolved ?? 0
    }

    // 3. Use the higher of the stored level and the level computed
    //    from total_resolved — so completing the progress bar
    //    auto-levels-up, and manual DB level edits are also honoured.
    const computedLevel = calculateLevel(resolved)
    const storedLevel = progress ? levelFromNumber(progress.level ?? 1) : computedLevel

    const LEVEL_RANK: Record<string, number> = {
      Bronze: 1, Silver: 2, Gold: 3, Platinum: 4, Diamond: 5,
    }
    const level =
      LEVEL_RANK[computedLevel.current]! >= LEVEL_RANK[storedLevel.current]!
        ? computedLevel
        : storedLevel

    const unlockedNames = progress?.gear_unlocked ?? []

    // 4. Fetch all gear items and mark which ones are unlocked.
    //    A gear item is unlocked if it's in the stored array OR
    //    if the current counts meet its threshold (auto-unlock).
    const allGear = await db.select().from(gear_items)

    const gear = allGear.map((g) => {
      const manuallyUnlocked = unlockedNames.includes(g.name)
      const threshold = UNLOCK_THRESHOLDS[g.unlock_condition]
      const autoUnlocked =
        threshold !== undefined &&
        ((threshold > 0 && submitted >= threshold) ||
         (threshold < 0 && resolved >= Math.abs(threshold)))

      return {
        id: String(g.id),
        name: g.name,
        icon: gearNameToEmoji(g.name),
        unlocked: manuallyUnlocked || autoUnlocked,
        unlockCondition: g.unlock_condition,
      }
    })

    // 5. Return combined response
    res.json({
      submitted,
      resolved,
      level,
      gear,
    })
  } catch (err) {
    next(err)
  }
})

// ── POST /api/gamification/dev-update ───────────────────────────────
// Developer endpoint to artificially bump stats for testing UI.

router.post('/dev-update', requireResident, async (req, res, next) => {
  try {
    const userId = req.session.userId!
    const { action } = req.body

    const [progress] = await db
      .select()
      .from(bear_progress)
      .where(eq(bear_progress.user_id, userId))

    let submitted = progress?.total_submitted ?? 0
    let resolved = progress?.total_resolved ?? 0

    if (action === 'add_submitted') {
      submitted += 10
    } else if (action === 'add_resolved') {
      // Typically resolving implies submitting
      submitted += 10
      resolved += 10
    } else if (action === 'reset') {
      submitted = 0
      resolved = 0
    }

    const levelInfo = calculateLevel(resolved)
    const levelNumber =
      levelInfo.current === 'Diamond' ? 5 :
      levelInfo.current === 'Platinum' ? 4 :
      levelInfo.current === 'Gold' ? 3 :
      levelInfo.current === 'Silver' ? 2 : 1

    const allGear = await db.select().from(gear_items)
    const newlyUnlocked: string[] = []

    for (const g of allGear) {
      const threshold = UNLOCK_THRESHOLDS[g.unlock_condition]
      if (threshold === undefined) continue
      if (threshold > 0 && submitted >= threshold) newlyUnlocked.push(g.name)
      if (threshold < 0 && resolved >= Math.abs(threshold)) newlyUnlocked.push(g.name)
    }

    if (progress) {
      await db
        .update(bear_progress)
        .set({
          level: levelNumber,
          total_submitted: submitted,
          total_resolved: resolved,
          gear_unlocked: newlyUnlocked,
        })
        .where(eq(bear_progress.user_id, userId))
    } else {
      await db.insert(bear_progress).values({
        user_id: userId,
        level: levelNumber,
        total_submitted: submitted,
        total_resolved: resolved,
        gear_unlocked: newlyUnlocked,
      })
    }

    res.json({ success: true, submitted, resolved })
  } catch (err) {
    next(err)
  }
})

// ── Helper: map gear name → emoji (matches the frontend constants) ──

function gearNameToEmoji(name: string): string {
  const map: Record<string, string> = {
    'Safety Helmet': '🪖',
    'Utility Vest': '🦺',
    'Safety Gloves': '🧤',
    'Shield': '🛡️',
    'Flashlight': '🔦',
    'Megaphone': '📣',
    'Clipboard': '📋',
    'Gold Badge': '🎖️',
    'Tool Belt': '🧰',
    'Safety Goggles': '🥽',
  }
  return map[name] ?? '🎁'
}

// ── Exported helper so reports route can call it ─────────────────────
// After a report is submitted or resolved, call this to auto-unlock
// any newly earned gear items.

export async function refreshBearProgress(userId: number) {
  // Count reports
  const [counts] = await db
    .select({
      submitted: sql<number>`count(*)::int`,
      resolved: sql<number>`count(*) filter (where ${reports.status} = 'resolved')::int`,
    })
    .from(reports)
    .where(eq(reports.user_id, userId))

  const submitted = counts?.submitted ?? 0
  const resolved = counts?.resolved ?? 0

  // Determine which gear should be unlocked
  const allGear = await db.select().from(gear_items)
  const newlyUnlocked: string[] = []

  for (const g of allGear) {
    const threshold = UNLOCK_THRESHOLDS[g.unlock_condition]
    if (threshold === undefined) continue
    if (threshold > 0 && submitted >= threshold) newlyUnlocked.push(g.name)
    if (threshold < 0 && resolved >= Math.abs(threshold)) newlyUnlocked.push(g.name)
  }

  // Calculate level number for storage
  const levelInfo = calculateLevel(resolved)
  const levelNumber =
    levelInfo.current === 'Diamond' ? 5 :
    levelInfo.current === 'Platinum' ? 4 :
    levelInfo.current === 'Gold' ? 3 :
    levelInfo.current === 'Silver' ? 2 : 1

  // Upsert bear_progress
  const [existing] = await db
    .select()
    .from(bear_progress)
    .where(eq(bear_progress.user_id, userId))

  if (existing) {
    await db
      .update(bear_progress)
      .set({
        level: levelNumber,
        total_submitted: submitted,
        total_resolved: resolved,
        gear_unlocked: newlyUnlocked,
      })
      .where(eq(bear_progress.user_id, userId))
  } else {
    await db.insert(bear_progress).values({
      user_id: userId,
      level: levelNumber,
      total_submitted: submitted,
      total_resolved: resolved,
      gear_unlocked: newlyUnlocked,
    })
  }
}

export default router
