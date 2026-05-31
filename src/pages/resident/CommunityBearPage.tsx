import { Avatar } from '@/components/ui'
import { CommunityBearProfile } from '@/components/community-bear'
import type { GearItem } from '@/components/community-bear'
import './CommunityBearPage.css'

// ── Mock data (replace with API call later) ──────────────────────────

const MOCK_PROFILE = {
  name: 'Testing Name',
  email: 'testing@gmail.com',
  joined: 'March 2026',
}

const MOCK_STATS = {
  submitted: 42,
  resolved: 28,
  currentLevel: 'Silver',
  nextLevelThreshold: 50,
  nextLevelName: 'Gold',
}

const MOCK_GEAR: GearItem[] = [
  { id: 'hard-hat', name: 'Hard Hat', icon: '🪖', unlocked: true },
  { id: 'safety-vest', name: 'Safety Vest', icon: '🦺', unlocked: true },
  { id: 'wrench', name: 'Wrench', icon: '🔧', unlocked: true },
  { id: 'shield', name: 'Shield', icon: '🛡️', unlocked: false },
  { id: 'flashlight', name: 'Flashlight', icon: '🔦', unlocked: false },
  { id: 'megaphone', name: 'Megaphone', icon: '📣', unlocked: false },
  { id: 'clipboard', name: 'Clipboard', icon: '📋', unlocked: false },
  { id: 'gold-badge', name: 'Gold Badge', icon: '🎖️', unlocked: false },
]

// ── Page component ───────────────────────────────────────────────────

export function CommunityBearPage() {
  return (
    <div className="un-community-page">
      {/* Page header */}
      <div className="un-community-page__header">
        <h1 className="un-community-page__title">Community Bear</h1>
        <p className="un-community-page__subtitle">
          Track your contributions and unlock gear for your bear
        </p>
      </div>

      <hr className="un-community-page__divider" />

      {/* Profile summary */}
      <div className="un-community-page__profile">
        <Avatar name={MOCK_PROFILE.name} size="lg" />
        <div className="un-community-page__profile-info">
          <span className="un-community-page__profile-name">{MOCK_PROFILE.name}</span>
          <span className="un-community-page__profile-meta">
            {MOCK_PROFILE.email} · Joined {MOCK_PROFILE.joined}
          </span>
        </div>
      </div>

      {/* Community Bear profile with stats, progress, avatar & gear */}
      <CommunityBearProfile
        submitted={MOCK_STATS.submitted}
        resolved={MOCK_STATS.resolved}
        currentLevel={MOCK_STATS.currentLevel}
        nextLevelThreshold={MOCK_STATS.nextLevelThreshold}
        nextLevelName={MOCK_STATS.nextLevelName}
        gear={MOCK_GEAR}
      />
    </div>
  )
}
