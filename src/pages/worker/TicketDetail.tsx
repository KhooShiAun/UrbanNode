import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiGet, apiSend } from '@/lib/api'
import { Button, Spinner, useToast } from '@/components/ui'
import { Check } from '@/components/icons'
import { type Report, type User } from '@/types'

import { TicketHeader } from './components/TicketHeader'
import { DescriptionCard } from './components/DescriptionCard'
import { LocationCard } from './components/LocationCard'
import { AiAssessmentCard } from './components/AiAssessmentCard'
import { SlaCard } from './components/SlaCard'
import { AssigneeStatusForm } from './components/AssigneeStatusForm'
import { TicketTimeline } from './components/TicketTimeline'

import './TicketDetail.css'

interface Worker {
  id: number
  full_name: string
}

interface StatusOption {
  id: string
  label: string
}

export function TicketDetail() {
  const { id } = useParams()
  const { showToast } = useToast()

  const [report, setReport] = useState<Report | null>(null)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [statuses, setStatuses] = useState<StatusOption[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form Controlled State
  const [assigneeId, setAssigneeId] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [severity, setSeverity] = useState<string>('')
  const [slaDeadline, setSlaDeadline] = useState<string>('')

  const formatForDateTimeInput = (dateString?: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return ''
    const offsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
  }

  // Initial concurrent load
  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    Promise.all([
      apiGet<Report>(`/api/reports/${id}`),
      apiGet<Worker[]>('/api/users/workers'),
      apiGet<StatusOption[]>('/api/reports/statuses'),
      apiGet<User>('/api/auth/me'),
    ])
      .then(([reportData, workersData, statusesData, userData]) => {
        if (active) {
          setReport(reportData)
          setWorkers(workersData)
          setStatuses(statusesData)
          setCurrentUser(userData)
          
          // Initialise form states
          setAssigneeId(reportData.assignee_id ? String(reportData.assignee_id) : '')
          setStatus(reportData.status)
          setNotes(reportData.resolution_notes ?? '')
          setSeverity(reportData.severity)
          setSlaDeadline(formatForDateTimeInput(reportData.sla_deadline))
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Could not fetch ticket details.')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [id])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)

    try {
      const targetAssigneeId = assigneeId === '' ? null : Number(assigneeId)
      const parsedSla = slaDeadline ? new Date(slaDeadline).toISOString() : null

      await apiSend<Report>(`/api/reports/${id}`, 'PATCH', {
        assignee_id: targetAssigneeId,
        status,
        resolution_notes: notes,
        severity,
        sla_deadline: parsedSla,
      })

      showToast('Changes saved successfully', 'success')

      // Refetch report to update timeline and derived fields
      const updated = await apiGet<Report>(`/api/reports/${id}`)
      setReport(updated)
      setAssigneeId(updated.assignee_id ? String(updated.assignee_id) : '')
      setStatus(updated.status)
      setNotes(updated.resolution_notes ?? '')
      setSeverity(updated.severity)
      setSlaDeadline(formatForDateTimeInput(updated.sla_deadline))
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save changes.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleResolve = async () => {
    setSaving(true)
    const isResolved = report?.status === 'resolved'
    const nextStatus = isResolved ? 'in_progress' : 'resolved'

    try {
      const targetAssigneeId = assigneeId === '' ? null : Number(assigneeId)
      await apiSend<Report>(`/api/reports/${id}`, 'PATCH', {
        assignee_id: targetAssigneeId,
        status: nextStatus,
        resolution_notes: notes || (isResolved ? '' : 'Ticket marked as resolved.'),
      })

      showToast(isResolved ? 'Ticket re-opened' : 'Ticket marked as resolved', 'success')

      // Refetch report to update timeline and state
      const updated = await apiGet<Report>(`/api/reports/${id}`)
      setReport(updated)
      setAssigneeId(updated.assignee_id ? String(updated.assignee_id) : '')
      setStatus(updated.status)
      setNotes(updated.resolution_notes ?? '')
      setSeverity(updated.severity)
      setSlaDeadline(formatForDateTimeInput(updated.sla_deadline))
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update resolution status.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleClaim = async () => {
    if (!currentUser) return
    setSaving(true)
    try {
      await apiSend<Report>(`/api/reports/${id}`, 'PATCH', {
        assignee_id: currentUser.id,
      })
      showToast('You have claimed this ticket', 'success')
      
      const updated = await apiGet<Report>(`/api/reports/${id}`)
      setReport(updated)
      setAssigneeId(String(currentUser.id))
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to claim ticket.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleUnclaim = async () => {
    setSaving(true)
    try {
      await apiSend<Report>(`/api/reports/${id}`, 'PATCH', {
        assignee_id: null,
      })
      showToast('Ticket unclaimed successfully', 'success')
      
      const updated = await apiGet<Report>(`/api/reports/${id}`)
      setReport(updated)
      setAssigneeId('')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to unclaim ticket.', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="ticket-loading">
        <Spinner />
        <p style={{ marginTop: 12, color: 'var(--color-on-surface-variant)' }}>
          Loading ticket details...
        </p>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="ticket-error">
        <h2 className="ticket-error__title">Error Loading Ticket</h2>
        <p className="ticket-error__desc">{error || 'Ticket not found.'}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  const isResolved = report.status === 'resolved'

  return (
    <div className="ticket-page">
      <TicketHeader
        reportId={report.id}
        severity={report.severity}
        status={report.status}
      />

      <div className="ticket-page__grid">
        <div className="ticket-page__main">
          <DescriptionCard
            description={report.description}
            createdAt={report.created_at}
          />
          <LocationCard
            locationText={report.location_text}
            locationLat={report.location_lat}
            locationLng={report.location_lng}
          />
        </div>

        <div className="ticket-page__side">
          <AiAssessmentCard aiAssessment={report.ai_assessment} />
          
          <SlaCard slaDeadline={report.sla_deadline} />

          <AssigneeStatusForm
            assigneeId={assigneeId}
            status={status}
            setStatus={setStatus}
            notes={notes}
            setNotes={setNotes}
            workers={workers}
            statuses={statuses}
            onSave={handleSave}
            loading={saving}
            currentUserId={currentUser?.id}
            onClaim={handleClaim}
            onUnclaim={handleUnclaim}
            severity={severity}
            setSeverity={setSeverity}
            slaDeadline={slaDeadline}
            setSlaDeadline={setSlaDeadline}
          />

          <TicketTimeline events={report.timeline} />

          <div className="ticket-resolve-btn-container">
            <Button
              variant={isResolved ? 'secondary' : 'primary'}
              onClick={handleToggleResolve}
              loading={saving}
              fullWidth
              iconLeft={!isResolved && <Check size={18} />}
            >
              {isResolved ? 'Re-open Ticket' : 'Mark as Resolved'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
