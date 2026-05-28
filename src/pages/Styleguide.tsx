import { useState } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  Input,
  Tag,
} from '@/components/ui'
import type { BadgeVariant } from '@/components/ui'
import './styleguide.css'

const STATUS_BADGES: BadgeVariant[] = [
  'urgent',
  'critical',
  'high',
  'routine',
  'low',
  'new',
  'in-progress',
  'resolved',
  'uncategorised',
]

export function Styleguide() {
  const [activeTag, setActiveTag] = useState<'all' | 'new' | 'in-progress' | 'resolved'>('all')
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="sg">
      <header className="sg-header">
        <h1>UrbanNode Design System</h1>
        <p>Reusable primitives and tokens. Use this page to verify visual consistency.</p>
      </header>

      <Section title="Typography">
        <div className="sg-stack">
          <span style={{ fontSize: 'var(--text-4xl)', fontWeight: 700 }}>Display 4xl</span>
          <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>Heading 3xl</span>
          <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 600 }}>Heading 2xl</span>
          <span style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>Title xl</span>
          <span style={{ fontSize: 'var(--text-lg)' }}>Subtitle lg</span>
          <span style={{ fontSize: 'var(--text-base)' }}>Body base</span>
          <span style={{ fontSize: 'var(--text-sm)' }}>Small sm</span>
          <span style={{ fontSize: 'var(--text-xs)' }}>Caption xs</span>
        </div>
      </Section>

      <Section title="Color tokens">
        <div className="sg-swatches">
          <Swatch token="--color-primary" />
          <Swatch token="--color-primary-container" />
          <Swatch token="--color-surface" />
          <Swatch token="--color-surface-container-low" />
          <Swatch token="--color-on-surface" />
          <Swatch token="--color-on-surface-variant" />
          <Swatch token="--color-outline" />
          <Swatch token="--color-outline-variant" />
          <Swatch token="--color-error" />
          <Swatch token="--color-status-urgent-bg" />
          <Swatch token="--color-status-routine-bg" />
          <Swatch token="--color-status-low-bg" />
          <Swatch token="--color-status-resolved-bg" />
        </div>
      </Section>

      <Section title="Button — variants">
        <div className="sg-row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="primary" loading>
            Loading
          </Button>
        </div>
      </Section>

      <Section title="Button — sizes & icons">
        <div className="sg-row">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button iconLeft={<span aria-hidden>+</span>}>With icon left</Button>
          <Button iconRight={<span aria-hidden>→</span>}>With icon right</Button>
        </div>
        <div style={{ maxWidth: 320, marginTop: 16 }}>
          <Button fullWidth iconRight={<span aria-hidden>→</span>}>
            Full width
          </Button>
        </div>
      </Section>

      <Section title="IconButton">
        <div className="sg-row">
          <IconButton aria-label="Notifications" variant="ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10 21a2 2 0 0 0 4 0" />
            </svg>
          </IconButton>
          <IconButton aria-label="Add" variant="primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 5v14M5 12h14" />
            </svg>
          </IconButton>
          <IconButton aria-label="More" variant="secondary">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </IconButton>
        </div>
      </Section>

      <Section title="Input">
        <div className="sg-stack" style={{ maxWidth: 360 }}>
          <Input
            label="Email Address"
            placeholder="jane@example.com"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Input
            label="With helper text"
            placeholder="Type here…"
            helperText="Must be at least 8 characters long."
          />
          <Input
            label="With error"
            placeholder="jane@example.com"
            defaultValue="not-an-email"
            error="Enter a valid email address."
          />
          <Input
            label="With icon"
            placeholder="Search…"
            iconLeft={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            }
          />
        </div>
      </Section>

      <Section title="Badge — status & severity">
        <div className="sg-row">
          {STATUS_BADGES.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="Tag — filter pills">
        <div className="sg-row">
          {(['all', 'new', 'in-progress', 'resolved'] as const).map((value) => (
            <Tag key={value} active={activeTag === value} onClick={() => setActiveTag(value)}>
              {value === 'all' ? 'All' : value === 'in-progress' ? 'In Progress' : value === 'new' ? 'New' : 'Resolved'}
            </Tag>
          ))}
        </div>
      </Section>

      <Section title="Avatar">
        <div className="sg-row" style={{ alignItems: 'center' }}>
          <Avatar name="Ahmad bin Ali" size="sm" />
          <Avatar name="Ahmad bin Ali" size="md" />
          <Avatar name="Ahmad bin Ali" size="lg" />
          <Avatar name="John Doe" />
        </div>
      </Section>

      <Section title="Card — variants & accents">
        <div className="sg-grid">
          <Card>
            <strong>Default card</strong>
            <p style={{ marginTop: 8, color: 'var(--color-on-surface-variant)' }}>
              A regular card with a bordered outline.
            </p>
          </Card>
          <Card variant="elevated">
            <strong>Elevated card</strong>
            <p style={{ marginTop: 8, color: 'var(--color-on-surface-variant)' }}>
              Uses a subtle shadow instead of a border.
            </p>
          </Card>
          <Card variant="bordered" accentColor="urgent">
            <strong>Urgent accent</strong>
            <p style={{ marginTop: 8, color: 'var(--color-on-surface-variant)' }}>
              Left-border severity indicator.
            </p>
          </Card>
          <Card accentColor="routine">
            <strong>Routine accent</strong>
            <p style={{ marginTop: 8, color: 'var(--color-on-surface-variant)' }}>
              Used on kanban / list cards.
            </p>
          </Card>
          <Card accentColor="low">
            <strong>Low accent</strong>
            <p style={{ marginTop: 8, color: 'var(--color-on-surface-variant)' }}>
              Lowest severity tier.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="EmptyState">
        <Card>
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            }
            title="No reports yet"
            description="Submit your first report to start tracking maintenance in your area."
            action={<Button>Report an issue</Button>}
          />
        </Card>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="sg-section">
      <h2>{title}</h2>
      <div className="sg-section-body">{children}</div>
    </section>
  )
}

function Swatch({ token }: { token: string }) {
  return (
    <div className="sg-swatch">
      <div className="sg-swatch__color" style={{ background: `var(${token})` }} />
      <code>{token}</code>
    </div>
  )
}
