import { useEffect, useRef } from 'react'
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

  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!mapContainerRef.current || !hasCoords) return

    const targetLat = Number(locationLat)
    const targetLng = Number(locationLng)

    if (Number.isNaN(targetLat) || Number.isNaN(targetLng)) return

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: false,
    }).setView([targetLat, targetLng], 15)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    L.marker([targetLat, targetLng]).addTo(map)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [locationLat, locationLng, hasCoords])

  return (
    <Card variant="bordered" className="ticket-card ticket-location-card">
      <h2 className="ticket-card__title">Location</h2>
      <p className="ticket-location-text">
        <MapPin size={18} />
        {locationText ?? 'No address description provided.'}
      </p>
      
      {hasCoords ? (
        <div className="ticket-map" ref={mapContainerRef} />
      ) : (
        <div className="ticket-map ticket-map--no-coords" role="img" aria-label="No location map">
          <div className="ticket-map__marker">
            <MapPin size={40} />
          </div>
          <span className="ticket-map__coords">No coordinates provided</span>
        </div>
      )}
    </Card>
  )
}
