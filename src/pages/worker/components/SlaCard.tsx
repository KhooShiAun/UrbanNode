import { useEffect, useState } from 'react'
import { Card } from '@/components/ui'
import { Clock } from '@/components/icons'
import { formatDateTime } from '@/pages/resident/reportFormat'

interface SlaCardProps {
  slaDeadline?: string | null
}

export function SlaCard({ slaDeadline }: SlaCardProps) {
  const [timeLeft, setTimeLeft] = useState<{ text: string; overdue: boolean } | null>(null)

  useEffect(() => {
    if (!slaDeadline) {
      setTimeLeft(null)
      return
    }

    function update() {
      const deadline = new Date(slaDeadline!)
      const diffMs = deadline.getTime() - Date.now()
      const overdue = diffMs < 0
      const absMs = Math.abs(diffMs)

      const totalHours = Math.floor(absMs / (1000 * 60 * 60))
      const minutes = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((absMs % (1000 * 60)) / 1000)

      let text = ''
      if (overdue) {
        text = `-${totalHours}h ${minutes}m ${seconds}s remaining`
      } else {
        text = `${totalHours}h ${minutes}m ${seconds}s remaining`
      }
      setTimeLeft({ text, overdue })
    }

    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [slaDeadline])

  return (
    <Card variant="bordered" className="ticket-card ticket-sla-card">
      <h2 className="ticket-card__title">
        <Clock size={18} className="ticket-sla-card__icon" />
        SLA Deadline
      </h2>
      <p className="ticket-sla-deadline">
        {slaDeadline ? formatDateTime(slaDeadline) : 'Not set'}
      </p>
      {timeLeft && (
        <p className={`ticket-sla-countdown ${timeLeft.overdue ? 'ticket-sla-countdown--overdue' : ''}`}>
          {timeLeft.text}
        </p>
      )}
    </Card>
  )
}
