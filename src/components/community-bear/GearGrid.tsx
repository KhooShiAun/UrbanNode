import type { HTMLAttributes, ReactNode } from 'react'
import { GearCard } from './GearCard'
import './GearGrid.css'

export type GearItem = {
  id: string
  name: string
  icon: ReactNode
  unlocked: boolean
}

export type GearGridProps = HTMLAttributes<HTMLDivElement> & {
  items: GearItem[]
}

export function GearGrid({ items, className, ...rest }: GearGridProps) {
  const classes = ['un-gear-grid', className ?? ''].filter(Boolean).join(' ')

  return (
    <div className={classes} {...rest}>
      {items.map((gear, i) => (
        <GearCard
          key={gear.id}
          name={gear.name}
          icon={gear.icon}
          unlocked={gear.unlocked}
          index={i}
        />
      ))}
    </div>
  )
}
