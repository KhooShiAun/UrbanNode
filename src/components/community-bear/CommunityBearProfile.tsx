import type { HTMLAttributes } from 'react'
import { FileText, Trophy, CircleCheck } from 'lucide-react'
import { StatCard } from '../ui/StatCard'
import { ProgressBar } from '../ui/ProgressBar'
import { Card, Badge } from '../ui'
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
  
 
  const levelDisplay = currentLevel // show the level 

  const classes = ['un-community-bear', className ?? ''].filter(Boolean).join(' ')

  return (
    <div className={classes} {...rest}>
      {/* Stat cards */}
      <div className="un-community-bear__stats">
        <StatCard label="Total Submitted" value={submitted} icon={<FileText size={32} strokeWidth={2} color='#2D6A4F' />} staggerMs={0} />
        <StatCard label="Total Resolved" value={resolved} icon={<CircleCheck size={32} strokeWidth={2} color='#74C69D' />} staggerMs={100} />
        <StatCard 
          label="Current Level" 
          value={levelDisplay} 
          icon={<Trophy size={32} strokeWidth={2} color={
            currentLevel.toLowerCase() === 'bronze' ? '#cd7f32' :
            currentLevel.toLowerCase() === 'silver' ? '#a6a6a6' :
            currentLevel.toLowerCase() === 'gold' ? '#f59e0b' :
            currentLevel.toLowerCase() === 'platinum' ? '#8b5cf6' :
            currentLevel.toLowerCase() === 'diamond' ? '#0ea5e9' :
            'var(--color-primary)'
          } />} 
          staggerMs={200} 
        />
      </div>

      {/* Progress to next level */}
      <Card variant="elevated" className="un-community-bear__progress-card">
        <div className="un-community-bear__progress-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Progress to Next Level</h3>
          <Badge variant="resolved">
            {resolved} / {nextLevelThreshold} resolved
          </Badge>
        </div>
        <ProgressBar
          value={resolved}
          max={nextLevelThreshold}
          indicator="🐻"
          style={{ '--un-progress-height': '12px' } as React.CSSProperties}
        />
        <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
          {remaining > 0 ? (
            <>{remaining} more resolved reports to unlock <strong>{nextLevelName}</strong></>
          ) : (
            'Level unlocked! 🎉'
          )}
        </p>
      </Card>

      {/* Bear avatar Card */}
      <Card 
        variant="elevated" 
        className="un-community-bear__avatar-card"
      >
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--color-on-surface)' }}>Your Community Bear</h2>
        <BearAvatar level={currentLevel} style={{ fontSize: '120px', marginBottom: '24px' }} />
        <span style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
          {currentLevel} Community Bear
        </span>
      </Card>

      {/* Gear collection */}
      <div className="un-community-bear__gear-section">
        <h3 className="un-community-bear__section-title" style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 600 }}>Gear Collection</h3>
        <GearGrid items={gear} />
      </div>
    </div>
  )
}
