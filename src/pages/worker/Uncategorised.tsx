import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiGet } from '@/lib/api'
import { Badge, Button, Card, Spinner, useToast } from '@/components/ui'
import { AlertCircle, Calendar, MapPin } from '@/components/icons'
import { type Report } from '@/types'
import './Uncategorised.css'

export function Uncategorised() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await apiGet<Report[]>('/api/reports?severity=uncategorised')
        if (active) {
          setReports(data)
        }
      } catch (err) {
        if (active) {
          showToast('Could not load uncategorised reports.', 'error')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }
    load()
    return () => {
      active = false
    }
  }, [showToast])

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  }

  const formatCode = (id: number) => {
    return `UR-${String(id).padStart(3, '0')}`
  }

  if (loading) {
    return (
      <div className="uncategorised-loading">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="uncategorised-page">
      <div className="uncategorised-alert">
        <AlertCircle className="uncategorised-alert__icon" size={24} />
        <div className="uncategorised-alert__content">
          <h2 className="uncategorised-alert__title">Manual Review Required</h2>
          <p className="uncategorised-alert__desc">
            These reports could not be automatically categorised by the AI Helper and require manual review. Please assign a severity level and SLA to each report.
          </p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="uncategorised-empty">
          No uncategorised reports requiring review.
        </div>
      ) : (
        <div className="uncategorised-list">
          {reports.map((report) => (
            <Card key={report.id} variant="bordered" className="uncategorised-card">
              <div className="uncategorised-card__header">
                <span className="uncategorised-card__id">{formatCode(report.id)}</span>
                <Badge variant="uncategorised">Uncategorised</Badge>
              </div>

              <blockquote className="uncategorised-card__quote">
                &ldquo;{report.description}&rdquo;
              </blockquote>

              <div className="uncategorised-card__meta">
                <span className="uncategorised-card__meta-item">
                  <MapPin size={16} />
                  {report.location_text ?? 'Unknown'}
                </span>
                <span className="uncategorised-card__meta-item">
                  <Calendar size={16} />
                  {formatDateTime(report.created_at)}
                </span>
              </div>

              <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate(`/worker/tickets/${report.id}`)}
              >
                Review & Categorise
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
