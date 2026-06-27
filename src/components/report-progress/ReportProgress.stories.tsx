import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReportProgress } from './ReportProgress'
import { Card } from '../ui'

const meta = {
  title: 'Reports/ReportProgress',
  component: ReportProgress,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Card style={{ width: 400, padding: 32 }}>
        <Story />
      </Card>
    ),
  ],
} satisfies Meta<typeof ReportProgress>

export default meta
type Story = StoryObj<typeof meta>

export const Submitted: Story = {
  args: {
    status: 'submitted',
  },
}

export const InProgress: Story = {
  args: {
    status: 'in-progress',
  },
}

export const Resolved: Story = {
  args: {
    status: 'resolved',
  },
}
