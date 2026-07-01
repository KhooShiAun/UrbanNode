import type { BadgeVariant } from '@/components/ui'

export interface BadgeConfig {
  variant: BadgeVariant
  label: string
}

export const SEVERITY_CONFIG: Record<string, BadgeConfig> = {
  urgent: { variant: 'urgent', label: 'Urgent' },
  routine: { variant: 'routine', label: 'Routine' },
  low: { variant: 'low', label: 'Low' },
  uncategorised: { variant: 'uncategorised', label: 'Uncategorised' },
}

export const STATUS_CONFIG: Record<string, BadgeConfig> = {
  new: { variant: 'new', label: 'Submitted' },
  in_progress: { variant: 'in-progress', label: 'In Progress' },
  resolved: { variant: 'resolved', label: 'Resolved' },
  uncategorised: { variant: 'uncategorised', label: 'Pending Triage' },
}
