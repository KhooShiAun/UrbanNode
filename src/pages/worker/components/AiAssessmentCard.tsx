import { Card } from '@/components/ui'
import { AlertCircle } from '@/components/icons'

interface AiAssessmentCardProps {
  aiAssessment?: string | null
}

export function AiAssessmentCard({ aiAssessment }: AiAssessmentCardProps) {
  return (
    <Card variant="bordered" className="ticket-card ticket-ai-card">
      <h2 className="ticket-card__title">
        <AlertCircle size={18} className="ticket-ai-card__icon" />
        AI Assessment
      </h2>
      <p className="ticket-card__text ticket-ai-card__text">
        {aiAssessment ?? 'Pending assessment'}
      </p>
    </Card>
  )
}
