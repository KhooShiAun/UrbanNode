import type { HTMLAttributes } from 'react'
import { StatCard } from '../ui/StatCard'
import { ProgressBar } from '../ui/ProgressBar'
import { BearAvatar } from './BearAvatar'
import { GearGrid } from './GearGrid'
import type { GearItem } from './GearGrid'
import './CommunityBearProfile.css'

export type CommunityBearProfileProps = HTMLAttributes<HTMLDivElement> & {
  submitted: number
  resolved: number
  currentLevel: string
  /** Number of resolved reports needed to reach the next level */
  nextLevelThreshold: number
  /** Name of the next level to unlock */
  nextLevelName: string
  /** Collection of gear items */
  gear: GearItem[]
}

export function CommunityBearProfile({
  submitted,
  resolved,
  currentLevel,
  nextLevelThreshold,
  nextLevelName,
  gear,
  className,
  ...rest
}: CommunityBearProfileProps) {
  const remaining = Math.max(0, nextLevelThreshold - resolved)

  const classes = ['un-community-bear', className ?? ''].filter(Boolean).join(' ')

  return (
    <div className={classes} {...rest}>
      {/* Stat cards */}
      <div className="un-community-bear__stats">
        <StatCard label="Submitted" value={submitted} icon="📝" staggerMs={0} />
        <StatCard label="Resolved" value={resolved} icon="✅" staggerMs={100} />
        <StatCard label="Current Level" value={currentLevel} icon="🏅" staggerMs={200} />
      </div>

      {/* Progress to next level */}
      <ProgressBar
        value={resolved}
        max={nextLevelThreshold}
        indicator="🐻"
        caption={
          remaining > 0 ? (
            <>
              <strong>{remaining}</strong> more resolved to unlock{' '}
              <strong>{nextLevelName}</strong>
            </>
          ) : (
            'Level unlocked! 🎉'
          )
        }
      />

      {/* Bear avatar */}
      <div className="un-community-bear__avatar-row">
        <BearAvatar level={currentLevel} />
        <div className="un-community-bear__avatar-info">
          <span className="un-community-bear__level-label">{currentLevel} Bear</span>
          <span className="un-community-bear__level-subtitle">Community contributor</span>
        </div>
      </div>

      {/* Gear collection */}
      <h3 className="un-community-bear__section-title">Gear Collection</h3>
      <GearGrid items={gear} />
    </div>
  )
}
