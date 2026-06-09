import type { BadgeVariant } from '@/components/ui'

export function formatCode(id: number): string {
  return `UR-${String(id).padStart(3, '0')}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString()
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString()
}

export function statusBadge(status: string): { variant: BadgeVariant; label: string } {
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

export function severityBadge(severity: string): { variant: BadgeVariant; label: string } {
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

// Human-readable time left until an SLA deadline. Past deadlines read as a
// negative "-Nh remaining" and flag `overdue` so the UI can show it in red.
export function slaRemaining(deadlineIso: string): { text: string; overdue: boolean } {
  const diffMs = new Date(deadlineIso).getTime() - Date.now()
  const overdue = diffMs < 0
  const totalHours = Math.round(diffMs / (60 * 60 * 1000))

  if (Math.abs(totalHours) >= 48) {
    const days = Math.round(totalHours / 24)
    return { text: `${days}d remaining`, overdue }
  }
  return { text: `${totalHours}h remaining`, overdue }
}
