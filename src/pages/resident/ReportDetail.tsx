import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, Card, EmptyState, Spinner, useToast } from '@/components/ui'
import { AlertCircle, ArrowLeft, Clock, MapPin } from '@/components/icons'
import { buildReportDetail, type Report } from './reportDetail.mock'
import { ReportTimeline } from './ReportTimeline'
import { formatCode, formatDateTime, severityBadge, slaRemaining, statusBadge } from './reportFormat'
import './ReportDetail.css'

function formatCoord(value: string | null): string | null {
  if (value === null || value === '') return null
  const num = Number(value)
  return Number.isFinite(num) ? num.toFixed(4) : null
}

export function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(`/api/reports/${id}`, { credentials: 'include' })
        if (res.status === 404) {
          if (!cancelled) setNotFound(true)
          return
        }
        if (!res.ok) throw new Error('Failed to load report')
        const data: Report = await res.json()
        if (!cancelled) setReport(data)
      } catch {
        if (!cancelled) {
          setNotFound(true)
          showToast('Could not load this report. Please try again.', 'error')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id, showToast])

  const detail = useMemo(() => (report ? buildReportDetail(report) : null), [report])

  function backToList() {
    navigate('/reports')
  }

  if (loading) {
    return (
      <div className="report-page">
        <Spinner />
      </div>
    )
  }

  if (notFound || !report || !detail) {
    return (
      <div className="report-page">
        <EmptyState
          title="Report not found"
          description="We couldn't find that report, or it doesn't belong to your account."
          action={<Button onClick={backToList}>Back to My Reports</Button>}
        />
      </div>
    )
  }

  const severity = severityBadge(report.severity)
  const status = statusBadge(report.status)
  const lat = formatCoord(report.location_lat)
  const lng = formatCoord(report.location_lng)
  const hasCoords = lat !== null && lng !== null
  const sla = report.sla_deadline ? slaRemaining(report.sla_deadline) : null

  return (
    <div className="report-page">
      <button type="button" className="report-page__back" onClick={backToList}>
        <ArrowLeft size={18} />
        Back to My Reports
      </button>

      <div className="report-page__head">
        <div className="report-page__title">
          <h1>{formatCode(report.id)}</h1>
          <Badge variant={severity.variant}>{severity.label}</Badge>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <span className="report-page__submitted">
          Submitted on {formatDateTime(report.created_at)}
        </span>
      </div>

      <div className="report-page__grid">
        <div className="report-page__main">
          <Card variant="bordered" className="report-section">
            <h2 className="report-section__title">Description</h2>
            <p className="report-section__text">{report.description}</p>
            <p className="report-section__footnote">
              Submitted on {formatDateTime(report.created_at)}
            </p>
          </Card>

          <Card variant="bordered" className="report-section">
            <h2 className="report-section__title">Location</h2>
            <p className="report-section__location">
              <MapPin size={18} />
              {report.location_text ?? '—'}
            </p>
            <div className="report-map" role="img" aria-label="Map placeholder">
              <MapPin size={40} className="report-map__pin" />
              <span className="report-map__label">Map would display here</span>
              {hasCoords ? (
                <span className="report-map__coords">
                  Coordinates: {lat}, {lng}
                </span>
              ) : (
                <span className="report-map__coords">No coordinates provided</span>
              )}
            </div>
          </Card>
        </div>

        <aside className="report-page__side">
          <Card variant="bordered" className="report-aside">
            <h2 className="report-aside__title">
              <AlertCircle size={18} className="report-aside__icon report-aside__icon--alert" />
              AI Assessment
            </h2>
            <p className="report-aside__text">{detail.aiAssessment}</p>
          </Card>

          <Card variant="bordered" className="report-aside">
            <h2 className="report-aside__title">
              <Clock size={18} className="report-aside__icon report-aside__icon--clock" />
              SLA Deadline
            </h2>
            <p className="report-aside__text">
              {report.sla_deadline ? formatDateTime(report.sla_deadline) : 'Not set'}
            </p>
            {sla && (
              <p
                className={[
                  'report-aside__remaining',
                  sla.overdue ? 'report-aside__remaining--overdue' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {sla.text}
              </p>
            )}
          </Card>

          <Card variant="bordered" className="report-aside">
            <h2 className="report-aside__title">Status Timeline</h2>
            <ReportTimeline events={detail.timeline} />
          </Card>
        </aside>
      </div>
    </div>
  )
}
