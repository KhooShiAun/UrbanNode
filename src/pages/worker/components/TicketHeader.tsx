import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui'
import { ArrowLeft } from '@/components/icons'
import { formatCode } from '@/pages/resident/reportFormat'
import { SEVERITY_CONFIG, STATUS_CONFIG } from '../ticketConfig'

interface TicketHeaderProps {
  reportId: number
  severity: string
  status: string
}

export function TicketHeader({ reportId, severity, status }: TicketHeaderProps) {
  const navigate = useNavigate()

  const sev = SEVERITY_CONFIG[severity] || { variant: 'uncategorised', label: severity }
  const stat = STATUS_CONFIG[status] || { variant: 'uncategorised', label: status }

  return (
    <div className="ticket-header">
      <button
        type="button"
        className="ticket-header__back"
        onClick={() => navigate('/worker/kanban')}
      >
        <ArrowLeft size={16} />
        Back to Kanban Board
      </button>

      <div className="ticket-header__main">
        <h1 className="ticket-header__title">{formatCode(reportId)}</h1>
        <div className="ticket-header__badges">
          <Badge variant={sev.variant}>{sev.label}</Badge>
          <Badge variant={stat.variant}>{stat.label}</Badge>
        </div>
      </div>
    </div>
  )
}
