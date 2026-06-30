import { Card } from '@/components/ui'
import { formatDateTime } from '@/pages/resident/reportFormat'

interface DescriptionCardProps {
  description: string
  createdAt?: string
}

export function DescriptionCard({ description, createdAt }: DescriptionCardProps) {
  return (
    <Card variant="bordered" className="ticket-card ticket-description-card">
      <h2 className="ticket-card__title">Citizen Description</h2>
      <p className="ticket-card__text">{description}</p>
      {createdAt && (
        <p className="ticket-card__footnote">
          Submitted on {formatDateTime(createdAt)}
        </p>
      )}
    </Card>
  )
}
