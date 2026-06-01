import { useState, useEffect } from 'react'
import { Avatar, Button } from '@/components/ui'
import { CommunityBearProfile, LevelUpOverlay } from '@/components/community-bear'
import type { GearItem } from '@/components/community-bear'
import './CommunityBearPage.css'

// ── Dev mock data ───────────────────────────────────────────────────

const MOCK_PROFILE = {
  name: 'Testing Name',
  email: 'testing@gmail.com',
  joined: 'March 2026',
}

const INITIAL_GEAR: GearItem[] = [
  { id: 'hard-hat', name: 'Safety Helmet', icon: '🪖', unlocked: false, unlockCondition: 'Submit 1 report' },
  { id: 'safety-vest', name: 'Utility Vest', icon: '🦺', unlocked: false, unlockCondition: 'Submit 5 reports' },
  { id: 'safety-gloves', name: 'Safety Gloves', icon: '🧤', unlocked: false, unlockCondition: 'Submit 10 reports' },
  { id: 'shield', name: 'Shield', icon: '🛡️', unlocked: false, unlockCondition: 'Submit 15 reports' },
  { id: 'flashlight', name: 'Flashlight', icon: '🔦', unlocked: false, unlockCondition: 'Submit 20 reports' },
  { id: 'megaphone', name: 'Megaphone', icon: '📣', unlocked: false, unlockCondition: 'Submit 25 reports' },
  { id: 'clipboard', name: 'Clipboard', icon: '📋', unlocked: false, unlockCondition: 'Submit 30 reports' },
  { id: 'gold-badge', name: 'Gold Badge', icon: '🎖️', unlocked: false, unlockCondition: 'Submit 50 reports' },
  { id: 'tool-belt', name: 'Tool Belt', icon: '🧰', unlocked: false, unlockCondition: 'Submit 100 reports' },
]

// ── Level Logic ──────────────────────────────────────────────────────

function calculateLevel(resolved: number) {
  if (resolved >= 100) return { current: 'Diamond', next: 'Diamond', threshold: 100 }
  if (resolved >= 50) return { current: 'Platinum', next: 'Diamond', threshold: 100 }
  if (resolved >= 25) return { current: 'Gold', next: 'Platinum', threshold: 50 }
  if (resolved >= 10) return { current: 'Silver', next: 'Gold', threshold: 25 }
  return { current: 'Bronze', next: 'Silver', threshold: 10 }
}

function calculateGear(resolved: number): GearItem[] {
  // Mock logic: unlock a gear item for every 5 resolved reports
  const unlockedCount = Math.floor(resolved / 5)
  return INITIAL_GEAR.map((gear, index) => ({
    ...gear,
    unlocked: index < unlockedCount,
  }))
}

// ── Page component ───────────────────────────────────────────────────

export function CommunityBearPage() {
  const [submitted, setSubmitted] = useState(0)
  const [resolved, setResolved] = useState(0)
  
  // State for overlay
  const [prevResolved, setPrevResolved] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState(false)

  // Derived state
  const { current: currentLevel, next: nextLevelName, threshold: nextLevelThreshold } = calculateLevel(resolved)
  const gear = calculateGear(resolved)

  // Detect level ups
  useEffect(() => {
    if (resolved > prevResolved) {
      const oldLevel = calculateLevel(prevResolved).current
      const newLevel = calculateLevel(resolved).current
      if (newLevel !== oldLevel) {
        setShowLevelUp(true)
      }
    }
    setPrevResolved(resolved)
  }, [resolved, prevResolved])

  return (
    <div className="un-community-page">
      {showLevelUp && (
        <LevelUpOverlay 
          level={currentLevel} 
          onClose={() => setShowLevelUp(false)} 
        />
      )}

      {/* Dev Controls - Temporary for testing */}
      <div
        style={{
          background: 'var(--color-surface-container-low)',
          padding: '16px',
          borderRadius: '8px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '16px',
          border: '1px dashed var(--color-outline)',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Dev Controls:</span>
        <Button variant="outline" size="sm" onClick={() => setSubmitted((s) => s + 1)}>
          +1 Submitted
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSubmitted((s) => Math.max(s, resolved + 1))
            setResolved((r) => r + 1)
          }}
        >
          +1 Resolved
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSubmitted((s) => Math.max(s, resolved + 5))
            setResolved((r) => r + 5)
          }}
        >
          +5 Resolved
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { setSubmitted(0); setResolved(0) }}>
          Reset
        </Button>
      </div>

      {/* Page header */}
      <div className="un-community-page__header" style={{ marginBottom: '24px' }}>
        <h1 className="un-community-page__title">Community Bear</h1>
      </div>

      {/* Community Bear profile with stats, progress, avatar & gear */}
      <CommunityBearProfile
        submitted={submitted}
        resolved={resolved}
        currentLevel={currentLevel}
        nextLevelThreshold={nextLevelThreshold}
        nextLevelName={nextLevelName}
        gear={gear}
      />
    </div>
  )
}
