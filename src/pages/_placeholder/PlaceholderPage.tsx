import { Card } from '@/components/ui'
import './PlaceholderPage.css'

type PlaceholderPageProps = {
  title: string
  owner: string
}

export function PlaceholderPage({ title, owner }: PlaceholderPageProps) {
  return (
    <div className="un-placeholder">
      <h1 className="un-placeholder__title">{title}</h1>
      <Card variant="bordered">
        <p className="un-placeholder__lead">Coming soon</p>
        <p className="un-placeholder__owner">
          Owned by ticket <strong>{owner}</strong>. Replace this file with the real screen.
        </p>
      </Card>
    </div>
  )
}
