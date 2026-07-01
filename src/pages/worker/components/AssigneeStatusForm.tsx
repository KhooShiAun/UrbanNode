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
  setAssigneeId: (val: string) => void
  status: string
  setStatus: (val: string) => void
  notes: string
  setNotes: (val: string) => void
  workers: Worker[]
  statuses: StatusOption[]
  onSave: (e: React.FormEvent) => void
  loading: boolean
}

export function AssigneeStatusForm({
  assigneeId,
  setAssigneeId,
  status,
  setStatus,
  notes,
  setNotes,
  workers,
  statuses,
  onSave,
  loading,
}: AssigneeStatusFormProps) {
  return (
    <Card variant="bordered" className="ticket-card ticket-form-card">
      <form onSubmit={onSave} className="ticket-form">
        <div className="ticket-form__field">
          <label htmlFor="assignee-select" className="ticket-form__label">
            Assignee
          </label>
          <div className="ticket-form__select-wrapper">
            <select
              id="assignee-select"
              className="ticket-form__select"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              disabled={loading}
            >
              <option value="">Unassigned</option>
              {workers.map((w) => (
                <option key={w.id} value={String(w.id)}>
                  {w.full_name}
                </option>
              ))}
            </select>
          </div>
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
