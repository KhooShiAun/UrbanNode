export interface User {
  id: number
  full_name: string
  email: string
  role: 'resident' | 'worker'
  position?: string | null
  department?: string | null
  created_at?: string
}

export interface Report {
  id: number
  user_id: number | null
  description: string
  location_text?: string | null
  location_lat?: string | null
  location_lng?: string | null
  photo_url?: string | null
  resolved_photo_url?: string | null
  severity: 'urgent' | 'routine' | 'low' | 'uncategorised'
  status: 'new' | 'in_progress' | 'resolved' | 'uncategorised'
  sla_deadline?: string | null
  assignee_id?: number | null
  resolution_notes?: string | null
  ai_assessment?: string | null
  timeline?: Array<{ label: string; at: string; actor: string }>
  created_at?: string
}

export interface TimelineEntry {
  id: number
  report_id: number
  status: string
  changed_by: number | null
  changed_at?: string
  notes?: string | null
}

export interface Notification {
  id: number
  user_id: number
  message: string
  is_read: boolean
  created_at?: string
}
