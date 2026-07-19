import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Tag, Avatar, Spinner, useToast, type BadgeVariant } from '@/components/ui'
import { AlertCircle, ChevronDown, ChevronRight, ArrowLeft } from '@/components/icons'
import './AllReports.css'

type Report = {
  id: number
  description: string
  location_text: string | null
  severity: string
  status: string
  sla_deadline: string | null
  assignee_id: number | null
  created_at: string
}

interface Worker {
  id: number
  full_name: string
}

export function AllReports() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeFilter, setActiveFilter] = useState('All')
  const [reports, setReports] = useState<Report[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [now] = useState(() => Date.now())

  useEffect(() => {
    async function fetchData() {
      try {
        const [reportsRes, workersRes] = await Promise.all([
          fetch('/api/reports/all', { credentials: 'include' }),
          fetch('/api/users/workers', { credentials: 'include' }),
        ])
        if (!reportsRes.ok || !workersRes.ok) {
          throw new Error('Failed to fetch reports or workers')
        }
        const reportsData = await reportsRes.json()
        const workersData = await workersRes.json()
        setReports(reportsData)
        setWorkers(workersData)
      } catch {
        showToast('Error loading reports', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [showToast])

  const filteredReports = reports.filter((report) => {
    if (activeFilter === 'Overdue') {
      return report.sla_deadline && new Date(report.sla_deadline).getTime() < now
    }
    if (activeFilter === 'High Priority') {
      return report.severity === 'urgent' || report.severity === 'critical'
    }
    if (activeFilter === 'Unassigned') {
      // In this schema, all reports are technically unassigned as there's no assignee_id
      return true
    }
    return true
  })

  const overdueCount = reports.filter((r) => r.sla_deadline && new Date(r.sla_deadline).getTime() < now).length
  const highPriorityCount = reports.filter((r) => r.severity === 'urgent' || r.severity === 'critical').length
  const unassignedCount = reports.length // No assignee_id in schema currently

  const filters = [
    { label: 'All', count: reports.length },
    { label: 'Overdue', count: overdueCount },
    { label: 'High Priority', count: highPriorityCount },
    { label: 'Unassigned', count: unassignedCount },
  ]

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    const formatted = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
    
    // Split into date and time
    const [date, time] = formatted.split(', ')
    return { date: date + ',', time }
  }

  const formatLocation = (loc: string | null) => {
    if (!loc) return { line1: 'Unknown', line2: '' }
    const parts = loc.split(', ')
    if (parts.length > 1) {
      return { line1: parts[0], line2: parts.slice(1).join(', ') }
    }
    const words = loc.split(' ')
    if (words.length > 1) {
      return { line1: words[0], line2: words.slice(1).join(' ') }
    }
    return { line1: loc, line2: '' }
  }

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return 'No deadline'
    const ms = new Date(deadline).getTime() - now
    const hours = Math.round(ms / (1000 * 60 * 60))
    if (hours < 0) return `${Math.abs(hours)} hrs ago`
    return `in ${hours} hrs`
  }

  const getWorkerName = (assigneeId?: number | null) => {
    if (!assigneeId) return 'Unassigned'
    const worker = workers.find((w) => w.id === assigneeId)
    return worker ? worker.full_name : 'Unknown Worker'
  }

  return (
    <div className="un-reports-page">
      <div className="un-reports-header">
        <h1 className="un-reports-title">All Reports</h1>
        
        <div className="un-reports-filters">
          {filters.map((filter) => (
            <Tag
              key={filter.label}
              active={activeFilter === filter.label}
              onClick={() => setActiveFilter(filter.label)}
            >
              {filter.label} ({filter.count})
            </Tag>
          ))}
        </div>
      </div>

      <div className="un-reports-card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <Spinner />
          </div>
        ) : (
          <div className="un-reports-table-wrapper">
            <table className="un-reports-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th className="sortable-col">
                    SLA Deadline <span style={{ fontSize: '1.2em' }}>&uarr;</span>
                  </th>
                  <th>Assignee</th>
                  <th>Date Logged</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => {
                  const { date, time } = formatDate(report.created_at)
                  const { line1, line2 } = formatLocation(report.location_text)
                  const isOverdue = report.sla_deadline && new Date(report.sla_deadline).getTime() < now

                  return (
                    <tr key={report.id} onClick={() => navigate(`/worker/tickets/${report.id}`)}>
                      <td className="un-reports-id">#REP-{report.id}</td>
                      <td>{report.description.length > 30 ? report.description.substring(0, 30) + '...' : report.description}</td>
                      <td className="un-reports-location">
                        <div className="un-reports-location-text">
                          <span style={{ display: 'block' }}>{line1}</span>
                          {line2 && (
                            <span style={{ display: 'block', color: 'var(--color-on-surface-variant)' }}>
                              {line2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge variant={report.severity as BadgeVariant}>
                          {report.severity === 'urgent' ? 'critical' : report.severity}
                        </Badge>
                      </td>
                      <td>
                        <Badge 
                          variant={report.status === 'new' ? 'open' : report.status.replace('_', '-') as BadgeVariant} 
                          className={report.status === 'new' ? 'un-badge--open' : ''}
                        >
                          {report.status === 'new' ? 'Open' : report.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td>
                        <span className="un-reports-deadline" style={{ color: isOverdue ? 'var(--color-error)' : 'var(--color-on-surface-variant)' }}>
                          {isOverdue && <AlertCircle className="un-reports-deadline-icon" />}
                          {formatDeadline(report.sla_deadline)}
                        </span>
                      </td>
                      <td>
                        <div className="un-reports-assignee">
                          <Avatar name={getWorkerName(report.assignee_id)} size="sm" />
                          <span>{getWorkerName(report.assignee_id)}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ color: 'var(--color-on-surface)' }}>{date}</div>
                          <div style={{ color: 'var(--color-on-surface-variant)' }}>{time}</div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '32px' }}>
                      No reports found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="un-reports-footer">
          <div>Showing 1 to {filteredReports.length} of {reports.length} reports</div>
          <div className="un-reports-footer-right">
            <div className="un-reports-rows-selector">
              Rows per page: 10 <ChevronDown size={16} />
            </div>
            <div className="un-reports-pagination">
              <button className="un-reports-page-btn" disabled>
                <ArrowLeft size={16} />
              </button>
              <button className="un-reports-page-btn un-reports-page-btn--active">1</button>
              <button className="un-reports-page-btn" disabled>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
