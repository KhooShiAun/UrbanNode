import { Card } from '@/components/ui'
import { MapPin } from '@/components/icons'

interface LocationCardProps {
  locationText?: string | null
  locationLat?: string | null
  locationLng?: string | null
}

function formatCoord(value?: string | null): string | null {
  if (!value) return null
  const num = Number(value)
  return Number.isFinite(num) ? num.toFixed(4) : null
}

export function LocationCard({ locationText, locationLat, locationLng }: LocationCardProps) {
  const lat = formatCoord(locationLat)
  const lng = formatCoord(locationLng)
  const hasCoords = lat !== null && lng !== null

  return (
    <Card variant="bordered" className="ticket-card ticket-location-card">
      <h2 className="ticket-card__title">Location</h2>
      <p className="ticket-location-text">
        <MapPin size={18} />
        {locationText ?? 'No address description provided.'}
      </p>
      
      <div className="ticket-map" role="img" aria-label="Map placeholder">
        <div className="ticket-map__marker">
          <MapPin size={40} />
        </div>
        <span className="ticket-map__label">Map would display here</span>
        {hasCoords ? (
          <span className="ticket-map__coords">
            Coordinates: {lat}, {lng}
          </span>
        ) : (
          <span className="ticket-map__coords">No coordinates provided</span>
        )}
      </div>
    </Card>
  )
}
