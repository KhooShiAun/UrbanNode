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
}: AssigneeStatusFormProps) {
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
