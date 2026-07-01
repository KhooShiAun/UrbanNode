import { Card } from '@/components/ui'
import { formatDateTime } from '@/pages/resident/reportFormat'

interface TimelineEvent {
  label: string
  at: string
  actor: string
}

interface TicketTimelineProps {
  events?: TimelineEvent[]
}

export function TicketTimeline({ events }: TicketTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <Card variant="bordered" className="ticket-card ticket-timeline-card">
        <h2 className="ticket-card__title">Status Timeline</h2>
        <p className="ticket-timeline__empty">No status timeline available.</p>
      </Card>
    )
  }

  const lastIndex = events.length - 1

  return (
    <Card variant="bordered" className="ticket-card ticket-timeline-card">
      <h2 className="ticket-card__title">Status Timeline</h2>
      <ol className="ticket-timeline">
        {events.map((event, index) => {
          const isCurrent = index === lastIndex
          return (
            <li
              key={index}
              className={`ticket-timeline__item ${isCurrent ? 'ticket-timeline__item--current' : ''}`}
            >
              <span className="ticket-timeline__dot" aria-hidden="true" />
              <div className="ticket-timeline__content">
                <span className="ticket-timeline__event">{event.label}</span>
                <span className="ticket-timeline__meta">
                  {formatDateTime(event.at)}
                  <span className="ticket-timeline__actor">{event.actor}</span>
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}
