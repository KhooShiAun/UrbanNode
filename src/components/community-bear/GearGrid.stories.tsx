import type { Meta, StoryObj } from '@storybook/react-vite'
import { GearGrid } from './GearGrid'
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
  title: 'CommunityBear/GearGrid',
  component: GearGrid,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GearGrid>

export default meta
type Story = StoryObj<typeof meta>

export const MixedCollection: Story = {
  args: {
    items: sampleGear,
  },
}

export const AllUnlocked: Story = {
  args: {
    items: sampleGear.map((g) => ({ ...g, unlocked: true })),
  },
}

export const AllLocked: Story = {
  args: {
    items: sampleGear.map((g) => ({ ...g, unlocked: false })),
  },
}

export const FewItems: Story = {
  name: 'Small Collection',
  args: {
    items: sampleGear.slice(0, 3),
  },
}
