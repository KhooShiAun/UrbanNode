import type { HTMLAttributes } from 'react'
import './Avatar.css'

type AvatarSize = 'sm' | 'md' | 'lg'

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  name: string
  src?: string
  size?: AvatarSize
  alt?: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({
  name,
  src,
  size = 'md',
  alt,
  className,
  ...rest
}: AvatarProps) {
  const classes = ['un-avatar', `un-avatar--${size}`, className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} role="img" aria-label={alt ?? name} {...rest}>
      {src ? (
        <img src={src} alt="" className="un-avatar__img" />
      ) : (
        <span className="un-avatar__initials" aria-hidden="true">
          {getInitials(name)}
        </span>
      )}
    </span>
  )
}
