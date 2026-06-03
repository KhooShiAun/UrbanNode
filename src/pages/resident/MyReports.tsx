import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Spinner,
  Tag,
  useToast,
  type BadgeVariant,
} from '@/components/ui'
import { Calendar, ChevronDown, Clipboard, MapPin, Search } from '@/components/icons'
import { buildReportDetail, type Report } from './reportDetail.mock'
import './MyReports.css'

type StatusFilter = 'all' | 'new' | 'in_progress' | 'resolved'

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
]

function formatCode(id: number): string {
  return `UR-${String(id).padStart(3, '0')}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString()
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString()
}

function statusBadge(status: string): { variant: BadgeVariant; label: string } {
  switch (status) {
    case 'in_progress':
      return { variant: 'in-progress', label: 'In Progress' }
    case 'resolved':
      return { variant: 'resolved', label: 'Resolved' }
    case 'uncategorised':
      return { variant: 'uncategorised', label: 'Uncategorised' }
    case 'new':
    default:
      return { variant: 'new', label: 'New' }
  }
}

function severityBadge(severity: string): { variant: BadgeVariant; label: string } {
  switch (severity) {
    case 'urgent':
      return { variant: 'urgent', label: 'Urgent' }
    case 'routine':
      return { variant: 'routine', label: 'Routine' }
    case 'low':
      return { variant: 'low', label: 'Low' }
    case 'uncategorised':
    default:
      return { variant: 'uncategorised', label: 'Uncategorised' }
  }
}

export function MyReports() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/reports', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to load reports')
        const data: Report[] = await res.json()
        if (!cancelled) setReports(data)
      } catch {
        if (!cancelled) {
          setLoadError(true)
          showToast('Could not load your reports. Please try again.', 'error')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [showToast])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return reports.filter((report) => {
      if (activeFilter !== 'all' && report.status !== activeFilter) return false
      if (!q) return true
      const haystack = [
        report.description,
        report.location_text ?? '',
        formatCode(report.id),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [reports, activeFilter, query])

  function toggleExpand(id: number) {
    setExpandedId((current) => (current === id ? null : id))
  }

  if (loading) {
    return (
      <div className="my-reports">
        <h1 className="my-reports__title">My Reports</h1>
        <Spinner />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="my-reports">
        <h1 className="my-reports__title">My Reports</h1>
        <EmptyState
          title="Couldn't load your reports"
          description="Something went wrong while fetching your reports. Refresh the page to try again."
          action={
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="my-reports">
      <h1 className="my-reports__title">My Reports</h1>

      <div className="my-reports__controls">
        <div className="my-reports__filters" role="group" aria-label="Filter by status">
          {FILTERS.map((filter) => (
            <Tag
              key={filter.value}
              active={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </Tag>
          ))}
        </div>
        <Input
          type="search"
          placeholder="Search reports..."
          aria-label="Search reports"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          iconLeft={<Search size={18} />}
          className="my-reports__search"
        />
      </div>

      {reports.length === 0 ? (
        <EmptyState
          icon={<Clipboard size={32} />}
          title="No reports yet"
          description="When you submit a report, it'll show up here so you can track its progress."
          action={<Button onClick={() => navigate('/reports/new')}>Report Issue</Button>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No reports match your filters"
          description="Try a different status or clear your search."
        />
      ) : (
        <ul className="my-reports__list">
          {filtered.map((report) => {
            const expanded = expandedId === report.id
            const severity = severityBadge(report.severity)
            const status = statusBadge(report.status)

            return (
              <li key={report.id}>
                <Card variant="bordered" className="report-card">
                  <button
                    type="button"
                    className="report-card__header"
                    aria-expanded={expanded}
                    onClick={() => toggleExpand(report.id)}
                  >
                    <div className="report-card__body">
                      <div className="report-card__top">
                        <span className="report-card__code">{formatCode(report.id)}</span>
                        <Badge variant={severity.variant}>{severity.label}</Badge>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="report-card__desc">{report.description}</p>
                      <div className="report-card__meta">
                        <span className="report-card__meta-item">
                          <MapPin size={16} />
                          {report.location_text ?? '—'}
                        </span>
                        <span className="report-card__meta-item">
                          <Calendar size={16} />
                          {formatDate(report.created_at)}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={[
                        'report-card__chevron',
                        expanded ? 'report-card__chevron--open' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    />
                  </button>

                  {expanded && <ReportCardDetail report={report} onView={() => navigate(`/reports/${report.id}`)} />}
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function ReportCardDetail({ report, onView }: { report: Report; onView: () => void }) {
  // Lazily derive expanded detail only when the card is open. This is the seam
  // to swap for a real GET /api/reports/:id fetch later.
  const detail = useMemo(() => buildReportDetail(report), [report])

  return (
    <div className="report-detail">
      <div className="report-detail__grid">
        <div className="report-detail__field">
          <h3 className="report-detail__label">AI Assessment</h3>
          <p className="report-detail__value">{detail.aiAssessment}</p>
        </div>
        <div className="report-detail__field">
          <h3 className="report-detail__label">SLA Deadline</h3>
          <p className="report-detail__value">
            {detail.slaDeadline ? formatDateTime(detail.slaDeadline) : 'Not set'}
          </p>
        </div>
      </div>

      <div className="report-detail__field">
        <h3 className="report-detail__label">Status Timeline</h3>
        <ol className="timeline">
          {detail.timeline.map((event, index) => (
            <li key={index} className="timeline__item">
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
      </div>

      <Button fullWidth onClick={onView}>
        View Full Details
      </Button>
    </div>
  )
}
