import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressBar } from './ProgressBar'

const meta = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 28,
    max: 50,
    caption: (
      <>
        <strong>22</strong> more resolved to unlock <strong>Gold</strong>
      </>
    ),
  },
}

export const WithBearIndicator: Story = {
  name: 'With Bear Indicator',
  args: {
    value: 28,
    max: 50,
    indicator: '🐻',
    caption: (
      <>
        <strong>22</strong> more resolved to unlock <strong>Gold</strong>
      </>
    ),
  },
}

export const BearAlmostDone: Story = {
  name: 'Bear — Almost Complete',
  args: {
    value: 48,
    max: 50,
    indicator: '🐼',
    caption: (
      <>
        <strong>2</strong> more resolved to unlock <strong>Gold</strong>
      </>
    ),
  },
}

export const BearComplete: Story = {
  name: 'Bear — Level Unlocked',
  args: {
    value: 50,
    max: 50,
    indicator: '🧸',
    caption: 'Level unlocked! 🎉',
  },
}

export const AlmostComplete: Story = {
  args: {
    value: 48,
    max: 50,
    caption: (
      <>
        <strong>2</strong> more resolved to unlock <strong>Gold</strong>
      </>
    ),
  },
}

export const Complete: Story = {
  args: {
    value: 50,
    max: 50,
    caption: 'Level unlocked! 🎉',
  },
}

export const Empty: Story = {
  args: {
    value: 0,
    max: 50,
    caption: (
      <>
        <strong>50</strong> more resolved to unlock <strong>Silver</strong>
      </>
    ),
  },
}

export const NoCaptionBar: Story = {
  name: 'Without Caption',
  args: {
    value: 15,
    max: 30,
  },
}
