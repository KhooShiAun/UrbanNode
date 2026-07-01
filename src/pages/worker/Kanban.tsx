import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui'
import './Kanban.css'

type ReportStatus = 'new' | 'in_progress' | 'resolved' | 'uncategorised'
type ReportSeverity = 'urgent' | 'routine' | 'low' | 'uncategorised'

type Report = {
  id: number
  description: string
  location_text: string | null
  severity: ReportSeverity
  status: ReportStatus
  sla_deadline: string | null
}

const COLUMNS: {
  key: ReportStatus
  title: string
}[] = [
  { key: 'new', title: 'New' },
  { key: 'in_progress', title: 'In Progress' },
  { key: 'resolved', title: 'Resolved' },
  { key: 'uncategorised', title: 'Uncategorised' },
]

function formatSeverity(severity: ReportSeverity) {
  switch (severity) {
    case 'urgent':
      return 'Urgent'
    case 'routine':
      return 'Routine'
    case 'low':
      return 'Low'
    default:
      return 'Uncategorised'
  }
}

function formatStatus(status: ReportStatus) {
  switch (status) {
    case 'in_progress':
      return 'In Progress'
    default:
      return status.charAt(0).toUpperCase() + status.slice(1)
  }
}

function getSlaLabel(slaDeadline: string | null) {
  if (!slaDeadline) return 'No SLA'

  const now = new Date().getTime()
  const deadline = new Date(slaDeadline).getTime()
  const diffMs = deadline - now

  if (Number.isNaN(deadline)) return 'No SLA'
  if (diffMs <= 0) return 'Overdue'

  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
  if (diffHours < 24) return `${diffHours}h left`

  const diffDays = Math.ceil(diffHours / 24)
  return `${diffDays}d left`
}

export function Kanban() {
  const navigate = useNavigate()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<number | null>(null)

  useEffect(() => {
    let active = true

    fetch('/api/reports', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch reports')
        }
        return res.json()
      })
      .then((data: Report[]) => {
        if (!active) return
        setReports(data)
      })
      .catch(() => {
        if (!active) return
        setError('Unable to load reports right now.')
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const groupedReports = useMemo(() => {
    return {
      new: reports.filter((report) => report.status === 'new'),
      in_progress: reports.filter((report) => report.status === 'in_progress'),
      resolved: reports.filter((report) => report.status === 'resolved'),
      uncategorised: reports.filter((report) => report.status === 'uncategorised'),
    }
  }, [reports])

  const updateReportStatus = async (reportId: number, nextStatus: ReportStatus) => {
    const previousReports = reports

    setReports((current) =>
      current.map((report) =>
        report.id === reportId ? { ...report, status: nextStatus } : report
      )
    )

    try {
      const res = await fetch(`/api/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: nextStatus }),
      })

      if (!res.ok) {
        throw new Error('Failed to update report status')
      }
    } catch (err) {
      console.error(err)
      setReports(previousReports)
      alert('Failed to update ticket status. Please try again.')
    }
  }

  const handleDragStart = (reportId: number) => {
    setDraggingId(reportId)
  }

  const handleDrop = (nextStatus: ReportStatus) => {
    if (draggingId == null) return

    const draggedReport = reports.find((report) => report.id === draggingId)
    setDraggingId(null)

    if (!draggedReport || draggedReport.status === nextStatus) return
    updateReportStatus(draggingId, nextStatus)
  }

  if (loading) {
    return (
      <div className="kanban-page">
        <div className="kanban-header">
          <h1>City Workers Kanban Board</h1>
          <p>Loading report board...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="kanban-page">
        <div className="kanban-header">
          <h1>City Workers Kanban Board</h1>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="kanban-page">
      <div className="kanban-header">
        <div>
          <span className="kanban-badge">City Workers</span>
          <h1>Kanban Board</h1>
          <p>
            Track hazard reports, move tickets across workflow stages, and
            prioritise infrastructure issues more efficiently.
          </p>
        </div>
      </div>

      <div className="kanban-board">
        {COLUMNS.map((column) => {
          const items = groupedReports[column.key]

          return (
            <section
              key={column.key}
              className="kanban-column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(column.key)}
            >
              <div className="kanban-column-header">
                <h2>{column.title}</h2>
                <span className="kanban-count">{items.length}</span>
              </div>

              <div className="kanban-column-body">
                {items.length === 0 ? (
                  <div className="kanban-empty">
                    No {column.title.toLowerCase()} tickets
                  </div>
                ) : (
                  items.map((report) => (
                    <article
                      key={report.id}
                      className="kanban-card"
                      draggable
                      onDragStart={() => handleDragStart(report.id)}
                      onClick={() => navigate(`/worker/tickets/${report.id}`)}
                    >
                      <div className="kanban-card-top">
                        <span
                          className={`severity-badge severity-${report.severity}`}
                        >
                          {formatSeverity(report.severity)}
                        </span>

                        <span className="status-pill">
                          {formatStatus(report.status)}
                        </span>
                      </div>

                      <p className="kanban-description">{report.description}</p>

                      <div className="kanban-meta">
                        <div>
                          <span className="meta-label">Location</span>
                          <p>{report.location_text || 'Location not provided'}</p>
                        </div>

                        <div>
                          <span className="meta-label">SLA</span>
                          <p>{getSlaLabel(report.sla_deadline)}</p>
                        </div>
                      </div>

                      <div className="kanban-card-footer">
                        <div className="kanban-assignee">
                          <Avatar name="City Worker" size="sm" />
                          <span>Assigned Worker</span>
                        </div>

                        {report.status === 'uncategorised' && (
                          <span
                            className="categorise-link"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/worker/tickets/${report.id}`);
                            }}
                          >
                            Categorise
                          </span>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}