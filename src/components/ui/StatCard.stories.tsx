import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatCard } from './StatCard'

const meta = {
  title: 'UI/StatCard',
  component: StatCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Submitted: Story = {
  args: {
    icon: '📝',
    label: 'Submitted',
    value: 42,
  },
}

export const Resolved: Story = {
  args: {
    icon: '✅',
    label: 'Resolved',
    value: 28,
  },
}

export const CurrentLevel: Story = {
  args: {
    icon: '🏅',
    label: 'Current Level',
    value: 'Silver',
  },
}

export const ZeroValue: Story = {
  args: {
    icon: '📝',
    label: 'Submitted',
    value: 0,
  },
}

export const WithoutIcon: Story = {
  args: {
    label: 'Reports',
    value: 15,
  },
}
