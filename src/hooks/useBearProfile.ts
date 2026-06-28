import { useState, useEffect, useCallback } from 'react'
import type { GearItem } from '@/components/community-bear'

// ── Types ───────────────────────────────────────────────────────────

export type BearProfileData = {
  submitted: number
  resolved: number
  currentLevel: string
  nextLevelName: string
  nextLevelThreshold: number
  gear: GearItem[]
}

type UseBearProfileResult = {
  data: BearProfileData | null
  loading: boolean
  error: string | null
  refetch: () => void
  mutate: import('react').Dispatch<import('react').SetStateAction<BearProfileData | null>>
}

// ── Raw API response shape ──────────────────────────────────────────

type ApiResponse = {
  submitted: number
  resolved: number
  level: {
    current: string
    next: string
    threshold: number
  }
  gear: {
    id: string
    name: string
    icon: string
    unlocked: boolean
    unlockCondition: string
  }[]
}

// ── Hook ─────────────────────────────────────────────────────────────

export function useBearProfile(): UseBearProfileResult {
  const [data, setData] = useState<BearProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    let ignore = false

    const doFetch = async () => {
      try {
        const res = await fetch('/api/gamification/profile', {
          credentials: 'include', // send session cookie
        })

        if (ignore) return

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error ?? `Server responded with ${res.status}`)
        }

        const json: ApiResponse = await res.json()
        if (ignore) return

        setData({
          submitted: json.submitted,
          resolved: json.resolved,
          currentLevel: json.level.current,
          nextLevelName: json.level.next,
          nextLevelThreshold: json.level.threshold,
          gear: json.gear.map((g) => ({
            id: g.id,
            name: g.name,
            icon: g.icon,
            unlocked: g.unlocked,
            unlockCondition: g.unlockCondition,
          })),
        })
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load bear profile')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    doFetch()

    return () => {
      ignore = true
    }
  }, [trigger])

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    setTrigger(t => t + 1)
  }, [])

  return { data, loading, error, refetch, mutate: setData }
}