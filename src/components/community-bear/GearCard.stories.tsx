import type { Meta, StoryObj } from '@storybook/react-vite'
import { GearCard } from './GearCard'

const meta = {
  title: 'CommunityBear/GearCard',
  component: GearCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 180 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GearCard>

export default meta
type Story = StoryObj<typeof meta>

export const Unlocked: Story = {
  args: {
    name: 'Hard Hat',
    icon: '🪖',
    unlocked: true,
  },
}

export const Locked: Story = {
  args: {
    name: 'Safety Vest',
    icon: '🦺',
    unlocked: false,
  },
}

export const UnlockedTool: Story = {
  name: 'Unlocked — Wrench',
  args: {
    name: 'Wrench',
    icon: '🔧',
    unlocked: true,
  },
}

export const LockedShield: Story = {
  name: 'Locked — Shield',
  args: {
    name: 'Shield',
    icon: '🛡️',
    unlocked: false,
  },
}
