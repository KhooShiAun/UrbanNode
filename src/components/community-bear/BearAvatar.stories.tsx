import type { Meta, StoryObj } from '@storybook/react-vite'
import { BearAvatar } from './BearAvatar'

const meta = {
  title: 'CommunityBear/BearAvatar',
  component: BearAvatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof BearAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Bronze: Story = {
  args: { level: 'bronze' },
}

export const Silver: Story = {
  args: { level: 'silver' },
}

export const Gold: Story = {
  args: { level: 'gold' },
}

export const Platinum: Story = {
  args: { level: 'platinum' },
}

export const Diamond: Story = {
  args: { level: 'diamond' },
}

export const UnknownLevel: Story = {
  name: 'Unknown (fallback)',
  args: { level: 'mythic' },
}
