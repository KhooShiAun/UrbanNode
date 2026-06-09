import type { Meta, StoryObj } from '@storybook/react-vite'
import { CommunityBearProfile } from './CommunityBearProfile'
import type { GearItem } from './GearGrid'

const sampleGear: GearItem[] = [
  { id: 'hard-hat', name: 'Hard Hat', icon: '🪖', unlocked: true },
  { id: 'safety-vest', name: 'Safety Vest', icon: '🦺', unlocked: true },
  { id: 'wrench', name: 'Wrench', icon: '🔧', unlocked: true },
  { id: 'shield', name: 'Shield', icon: '🛡️', unlocked: false },
  { id: 'flashlight', name: 'Flashlight', icon: '🔦', unlocked: false },
  { id: 'megaphone', name: 'Megaphone', icon: '📣', unlocked: false },
  { id: 'clipboard', name: 'Clipboard', icon: '📋', unlocked: false },
  { id: 'badge', name: 'Gold Badge', icon: '🎖️', unlocked: false },
]

const meta = {
  title: 'CommunityBear/CommunityBearProfile',
  component: CommunityBearProfile,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof CommunityBearProfile>

export default meta
type Story = StoryObj<typeof meta>

export const SilverLevel: Story = {
  args: {
    submitted: 42,
    resolved: 28,
    currentLevel: 'Silver',
    nextLevelThreshold: 50,
    nextLevelName: 'Gold',
    gear: sampleGear,
  },
}

export const BronzeStarter: Story = {
  name: 'Bronze — Just Starting',
  args: {
    submitted: 5,
    resolved: 3,
    currentLevel: 'Bronze',
    nextLevelThreshold: 10,
    nextLevelName: 'Silver',
    gear: sampleGear.map((g) => ({ ...g, unlocked: false })),
  },
}

export const GoldAlmostPlatinum: Story = {
  name: 'Gold — Almost Platinum',
  args: {
    submitted: 98,
    resolved: 98,
    currentLevel: 'Gold',
    nextLevelThreshold: 100,
    nextLevelName: 'Platinum',
    gear: sampleGear.map((g) => ({ ...g, unlocked: true })),
  },
}

export const MaxedOut: Story = {
  name: 'Diamond — Fully Maxed',
  args: {
    submitted: 200,
    resolved: 200,
    currentLevel: 'Diamond',
    nextLevelThreshold: 200,
    nextLevelName: 'Diamond',
    gear: sampleGear.map((g) => ({ ...g, unlocked: true })),
  },
}
