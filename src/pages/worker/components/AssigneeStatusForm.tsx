import { Button, Card, TextArea } from '@/components/ui'

interface Worker {
  id: number
  full_name: string
}

interface StatusOption {
  id: string
  label: string
}

interface AssigneeStatusFormProps {
  assigneeId: string
  status: string
  setStatus: (val: string) => void
  notes: string
  setNotes: (val: string) => void
  workers: Worker[]
  statuses: StatusOption[]
  onSave: (e: React.FormEvent) => void
  loading: boolean
  currentUserId?: number | null
  onClaim?: () => void
  onUnclaim?: () => void
  severity: string
  setSeverity: (val: string) => void
  slaDeadline: string
  setSlaDeadline: (val: string) => void
}

export function AssigneeStatusForm({
  assigneeId,
  status,
  setStatus,
  notes,
  setNotes,
  workers,
  statuses,
  onSave,
  loading,
  currentUserId,
  onClaim,
  onUnclaim,
  severity,
  setSeverity,
  slaDeadline,
  setSlaDeadline,
}: AssigneeStatusFormProps) {
  const handleSeverityChange = (newSev: string) => {
    setSeverity(newSev)
    const now = new Date()
    let defaultDeadline: Date | null = null
    if (newSev === 'urgent') {
      defaultDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    } else if (newSev === 'routine') {
      defaultDeadline = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    } else if (newSev === 'low') {
      defaultDeadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    }
    
    if (defaultDeadline) {
      const offsetMs = defaultDeadline.getTimezoneOffset() * 60000;
      const localISODate = new Date(defaultDeadline.getTime() - offsetMs).toISOString().slice(0, 16);
      setSlaDeadline(localISODate)
    } else {
      setSlaDeadline('')
    }
  }
  const getAssigneeName = () => {
    if (!assigneeId) return 'Unassigned'
    const worker = workers.find((w) => String(w.id) === assigneeId)
    return worker ? worker.full_name : 'Unknown Worker'
  }

  return (
    <Card variant="bordered" className="ticket-card ticket-form-card">
      <form onSubmit={onSave} className="ticket-form">
        <div className="ticket-form__field">
          <span className="ticket-form__label">
            Assignee
          </span>
          <div
            className="ticket-form__select"
            style={{
              backgroundColor: 'var(--color-surface-container-low)',
              cursor: 'default',
              display: 'flex',
              alignItems: 'center',
              minHeight: '38px',
              boxSizing: 'border-box',
            }}
          >
            {getAssigneeName()}
          </div>
          {currentUserId && (
            <div style={{ marginTop: '8px' }}>
              {assigneeId === String(currentUserId) ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onUnclaim}
                  disabled={loading}
                  fullWidth
                >
                  Unclaim Ticket
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onClaim}
                  disabled={loading}
                  fullWidth
                >
                  Claim Ticket
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="ticket-form__field">
          <label htmlFor="status-select" className="ticket-form__label">
            Status
          </label>
          <div className="ticket-form__select-wrapper">
            <select
              id="status-select"
              className="ticket-form__select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="ticket-form__field">
          <label htmlFor="severity-select" className="ticket-form__label">
            Severity
          </label>
          <div className="ticket-form__select-wrapper">
            <select
              id="severity-select"
              className="ticket-form__select"
              value={severity}
              onChange={(e) => handleSeverityChange(e.target.value)}
              disabled={loading}
            >
              <option value="uncategorised">Uncategorised</option>
              <option value="low">Low</option>
              <option value="routine">Routine</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="ticket-form__field">
          <label htmlFor="sla-deadline-input" className="ticket-form__label">
            SLA Deadline
          </label>
          <input
            id="sla-deadline-input"
            type="datetime-local"
            className="ticket-form__select"
            value={slaDeadline}
            onChange={(e) => setSlaDeadline(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="ticket-form__field">
          <label htmlFor="resolution-notes-input" className="ticket-form__label">
            Resolution Notes
          </label>
          <TextArea
            id="resolution-notes-input"
            placeholder="Add notes about how this issue was resolved..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
            rows={3}
          />
        </div>

        <Button type="submit" variant="primary" loading={loading} fullWidth>
          Save Changes
        </Button>
      </form>
    </Card>
  )
}
