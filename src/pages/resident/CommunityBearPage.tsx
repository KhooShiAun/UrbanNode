import { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import { CommunityBearProfile, LevelUpOverlay } from '@/components/community-bear'
import { useBearProfile } from '@/hooks/useBearProfile'
import './CommunityBearPage.css'

// ── Page component ───────────────────────────────────────────────────

export function CommunityBearPage() {
  const { data, loading, error, refetch } = useBearProfile()

  // State for level-up overlay
  const [prevLevel, setPrevLevel] = useState<string | null>(null)
  const [showLevelUp, setShowLevelUp] = useState(false)

  // Detect level-ups when data changes (e.g. after refetch)
  useEffect(() => {
    if (!data) return

    if (prevLevel && prevLevel !== data.currentLevel) {
      setShowLevelUp(true)
    }
    setPrevLevel(data.currentLevel)
  }, [data, prevLevel])

  // ── Loading state ──────────────────────────────────────────────────

  if (loading && !data) {
    return (
      <div className="un-community-page">
        <div className="un-community-page__header" style={{ marginBottom: '24px' }}>
          <h1 className="un-community-page__title">Community Bear</h1>
        </div>
        <div className="un-community-page__loading" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '64px 0',
          color: 'var(--color-on-surface-variant)',
        }}>
          <div className="un-community-page__spinner" style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--color-surface-container)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '14px' }}>Loading your bear profile…</p>
        </div>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="un-community-page">
        <div className="un-community-page__header" style={{ marginBottom: '24px' }}>
          <h1 className="un-community-page__title">Community Bear</h1>
        </div>
        <div style={{
          background: 'var(--color-error-container, #fce4ec)',
          color: 'var(--color-on-error-container, #b71c1c)',
          padding: '16px 20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div>
            <strong>Couldn't load your profile</strong>
            <p style={{ margin: '4px 0 0', fontSize: '14px' }}>{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={refetch} style={{ marginLeft: 'auto' }}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!data) return null

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="un-community-page">
      {showLevelUp && (
        <LevelUpOverlay
          level={data.currentLevel}
          onClose={() => setShowLevelUp(false)}
        />
      )}

      {/* Page header */}
      <div className="un-community-page__header" style={{ marginBottom: '24px' }}>
        <h1 className="un-community-page__title">Community Bear</h1>
      </div>

      {/* Community Bear profile with stats, progress, avatar & gear */}
      <CommunityBearProfile
        submitted={data.submitted}
        resolved={data.resolved}
        currentLevel={data.currentLevel}
        nextLevelThreshold={data.nextLevelThreshold}
        nextLevelName={data.nextLevelName}
        gear={data.gear}
      />
    </div>
  )
}
