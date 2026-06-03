import type { TimelineEvent } from './reportDetail.mock'
import { formatDateTime } from './reportFormat'
import './ReportTimeline.css'

export function ReportTimeline({ events }: { events: TimelineEvent[] }) {
  const lastIndex = events.length - 1

  return (
    <ol className="timeline">
      {events.map((event, index) => (
        <li
          key={index}
          className={[
            'timeline__item',
            index === lastIndex ? 'timeline__item--current' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="timeline__dot" aria-hidden="true" />
          <div className="timeline__content">
            <span className="timeline__event">{event.label}</span>
            <span className="timeline__meta">
              {formatDateTime(event.at)} • {event.actor}
            </span>
          </div>
        </li>
      ))}
    </ol>
  )
}
