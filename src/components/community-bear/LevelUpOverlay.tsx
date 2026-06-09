import { useEffect } from 'react'
import { Button } from '../ui'
import { LEVEL_EMOJI } from './constants'
import './LevelUpOverlay.css'

export type LevelUpOverlayProps = {
  /** The new level achieved */
  level: string
  /** Callback fired when the user clicks continue */
  onClose: () => void
}

export function LevelUpOverlay({ level, onClose }: LevelUpOverlayProps) {
  const emoji = LEVEL_EMOJI[level.toLowerCase()] ?? '🐻'

  // Prevent scrolling on the body while the overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="un-level-up-overlay">
      <div className="un-level-up-overlay__content">
        <div className="un-level-up-overlay__icon-wrapper">{emoji}</div>
        
        <h2 className="un-level-up-overlay__title">Congratulations!</h2>
        
        <p className="un-level-up-overlay__subtitle">
          You've reached the <strong>{level} Bear</strong> tier.
        </p>

        <div className="un-level-up-overlay__actions">
          <Button variant="primary" fullWidth onClick={onClose} size="lg">
            Awesome!
          </Button>
        </div>
      </div>
    </div>
  )
}
