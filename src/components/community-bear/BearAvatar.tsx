import type { HTMLAttributes } from 'react'
import './BearAvatar.css'

import { LEVEL_EMOJI } from './constants'

export type BearAvatarProps = HTMLAttributes<HTMLDivElement> & {
  /** Current community level, determines which emoji is displayed */
  level: string
}

export function BearAvatar({ level, className, ...rest }: BearAvatarProps) {
  const emoji = LEVEL_EMOJI[level.toLowerCase()] ?? '🐻'
  const classes = ['un-bear-avatar', className ?? ''].filter(Boolean).join(' ')

  return (
    <div className={classes} role="img" aria-label={`${level} bear`} {...rest}>
      {emoji}
    </div>
  )
}
