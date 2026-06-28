// Mock derivation of a report's expanded detail (AI assessment + status timeline).
//
// The expanded "My Reports" card shows an AI Assessment and a rich Status
// Timeline that the database does not yet store. Until those are persisted,
// this module derives plausible values from the fields we *do* have. It is the
// single seam to replace with a real `GET /api/reports/:id` fetch later — the
// page calls `buildReportDetail` lazily, only when a card is first expanded.

export type Report = {
  id: number
  user_id: number
  description: string
  location_text: string | null
  location_lat: string | null
  location_lng: string | null
  photo_url: string | null
  severity: string
  status: string
  sla_deadline: string | null
  created_at: string
  timeline?: TimelineEvent[]
}

export type TimelineEvent = {
  label: string
  /** ISO timestamp for the event. */
  at: string
  /** Who performed it: "System", "AI Helper", or a worker's name. */
  actor: string
}

export type ReportDetail = {
  aiAssessment: string
  slaDeadline: string | null
  timeline: TimelineEvent[]
}

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

const AI_ASSESSMENT_BY_SEVERITY: Record<string, string> = {
  urgent: 'High risk to public safety',
  routine: 'Moderate risk — schedule routine repair',
  low: 'Low risk — monitor and address when convenient',
  uncategorised: 'Pending assessment',
}

// Placeholder worker name for synthesized "Assigned"/"In Progress" events.
const ASSIGNED_WORKER = 'Ahmad bin Ali'

function iso(base: number, offset: number): string {
  return new Date(base + offset).toISOString()
}

export function buildReportDetail(report: Report): ReportDetail {
  const base = new Date(report.created_at).getTime()

  const timeline: TimelineEvent[] = [
    { label: 'Submitted', at: iso(base, 0), actor: 'System' },
    { label: 'AI Triaged', at: iso(base, 1 * MINUTE), actor: 'AI Helper' },
  ]

  if (report.status === 'in_progress' || report.status === 'resolved') {
    timeline.push(
      { label: 'Assigned', at: iso(base, 1 * HOUR), actor: ASSIGNED_WORKER },
      { label: 'In Progress', at: iso(base, 5 * HOUR), actor: ASSIGNED_WORKER },
    )
  }

  if (report.status === 'resolved') {
    timeline.push({ label: 'Resolved', at: iso(base, 2 * 24 * HOUR), actor: ASSIGNED_WORKER })
  }

  return {
    aiAssessment: AI_ASSESSMENT_BY_SEVERITY[report.severity] ?? 'Pending assessment',
    slaDeadline: report.sla_deadline,
    timeline,
  }
}
