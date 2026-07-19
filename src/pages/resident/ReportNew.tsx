import { useRef, useState, useEffect, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiSend } from '@/lib/api'
import { Button, Card, Input, Stepper, TextArea, useToast } from '@/components/ui'
import { ArrowLeft, ArrowRight, Camera, Check, MapPin, X } from '@/components/icons'
import './ReportNew.css'

const STEPS = [
  { title: 'Describe', caption: 'Tell us what happened' },
  { title: 'Location', caption: 'Where is it?' },
  { title: 'Review', caption: 'Confirm details' },
]

const MAX_PHOTO_BYTES = 5 * 1024 * 1024

type GeoStatus = 'idle' | 'loading' | 'success' | 'error'

type Errors = {
  description?: string
  photo?: string
  locationText?: string
}

export function ReportNew() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  const [step, setStep] = useState(0)
  const [description, setDescription] = useState('')
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)
  const [photoName, setPhotoName] = useState<string | null>(null)
  const [locationText, setLocationText] = useState('')
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, photo: 'Please choose an image file.' }))
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setErrors((prev) => ({ ...prev, photo: 'Image must be 5MB or smaller.' }))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setPhotoDataUrl(reader.result as string)
      setPhotoName(file.name)
      setErrors((prev) => ({ ...prev, photo: undefined }))
    }
    reader.onerror = () => {
      setErrors((prev) => ({ ...prev, photo: 'Could not read that file. Try another.' }))
    }
    reader.readAsDataURL(file)
  }

  function removePhoto() {
    setPhotoDataUrl(null)
    setPhotoName(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function useCurrentLocation() {
    if (!('geolocation' in navigator)) {
      setGeoStatus('error')
      return
    }
    setGeoStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentLat = pos.coords.latitude
        const currentLng = pos.coords.longitude
        setLat(currentLat)
        setLng(currentLng)
        setGeoStatus('success')

        if (mapRef.current) {
          mapRef.current.setView([currentLat, currentLng], 15)
          if (markerRef.current) {
            markerRef.current.setLatLng([currentLat, currentLng])
          } else {
            const marker = L.marker([currentLat, currentLng], { draggable: true }).addTo(mapRef.current)
            markerRef.current = marker
            marker.on('dragend', () => {
              const position = marker.getLatLng()
              setLat(position.lat)
              setLng(position.lng)
            })
          }
        }
      },
      () => setGeoStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  useEffect(() => {
    if (step !== 1 || !mapContainerRef.current) {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
      return
    }

    const defaultLat = lat ?? 3.140853
    const defaultLng = lng ?? 101.693207

    const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 14)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    if (lat !== null && lng !== null) {
      const marker = L.marker([lat, lng], { draggable: true }).addTo(map)
      markerRef.current = marker
      marker.on('dragend', () => {
        const position = marker.getLatLng()
        setLat(position.lat)
        setLng(position.lng)
      })
    }

    map.on('click', (e: any) => {
      const { lat: clickLat, lng: clickLng } = e.latlng
      setLat(clickLat)
      setLng(clickLng)
      
      if (markerRef.current) {
        markerRef.current.setLatLng([clickLat, clickLng])
      } else {
        const marker = L.marker([clickLat, clickLng], { draggable: true }).addTo(map)
        markerRef.current = marker
        marker.on('dragend', () => {
          const position = marker.getLatLng()
          setLat(position.lat)
          setLng(position.lng)
        })
      }
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, [step])

  function validateStep(target: number): boolean {
    const next: Errors = {}
    if (target === 0 && !description.trim()) {
      next.description = 'Please describe what you saw.'
    }
    if (target === 1) {
      const hasPin = lat !== null && lng !== null
      if (!hasPin && !locationText.trim()) {
        next.locationText = 'Please tell us where this is.'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function goNext() {
    if (!validateStep(step)) return
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function goBack() {
    setErrors({})
    setStep((s) => Math.max(s - 1, 0))
  }

  function goToStep(target: number) {
    setErrors({})
    setStep(target)
  }

  async function handleSubmit() {
    // Re-validate the data-bearing steps before sending.
    if (!description.trim()) {
      setStep(0)
      setErrors({ description: 'Please describe what you saw.' })
      return
    }
    const hasPin = lat !== null && lng !== null
    if (!hasPin && !locationText.trim()) {
      setStep(1)
      setErrors({ locationText: 'Please tell us where this is.' })
      return
    }

    setSubmitting(true)
    try {
      await apiSend('/api/reports', 'POST', {
        description: description.trim(),
        location_text: locationText.trim(),
        location_lat: lat,
        location_lng: lng,
        photo_url: photoDataUrl,
      })

      showToast('Report submitted. Thank you for helping out!', 'success')
      navigate('/reports')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Network error. Please check your connection and try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="report-new">
      <h1 className="report-new__page-title">Submit a Report</h1>

      <Stepper steps={STEPS} current={step} />

      <Card className="report-new__card">
        {step === 0 && (
          <div className="report-new__step">
            <header className="report-new__step-head">
              <h2 className="report-new__step-title">Describe the hazard</h2>
              <p className="report-new__step-sub">
                Tell us what you saw in your own words. Be as specific as possible.
              </p>
            </header>

            <TextArea
              label="Description"
              placeholder="e.g. There is broken glass near the swing set at Taman Tugu"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
            />
            <p className="report-new__counter">{description.length} characters</p>

            <div className="report-new__photo">
              <span className="report-new__photo-label">Photo (optional)</span>
              {photoDataUrl ? (
                <div className="report-new__photo-preview">
                  <img src={photoDataUrl} alt="Selected hazard" />
                  <div className="report-new__photo-meta">
                    <span className="report-new__photo-name">{photoName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconLeft={<X size={16} />}
                      onClick={removePhoto}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  iconLeft={<Camera size={18} />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Add a photo
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                aria-label="Upload a photo"
                className="report-new__file-input"
                onChange={handlePhotoChange}
              />
              {errors.photo && <span className="un-field__error">{errors.photo}</span>}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="report-new__step">
            <header className="report-new__step-head">
              <h2 className="report-new__step-title">Where is it?</h2>
              <p className="report-new__step-sub">
                Add a landmark or address so the team can find the spot.
              </p>
            </header>

            <Input
              label="Location"
              placeholder="e.g. Taman Tugu, near the playground entrance"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              error={errors.locationText}
              helperText={lat !== null && lng !== null ? "Location is optional because you pinned a spot on the map." : undefined}
              iconLeft={<MapPin size={18} />}
            />

            <div className="report-new__geo">
              <Button
                variant="secondary"
                iconLeft={<MapPin size={18} />}
                loading={geoStatus === 'loading'}
                onClick={useCurrentLocation}
              >
                Use my current location
              </Button>
              {geoStatus === 'success' && lat !== null && lng !== null && (
                <span className="report-new__geo-status report-new__geo-status--ok">
                  <Check size={16} /> Pinned at {lat.toFixed(5)}, {lng.toFixed(5)}
                </span>
              )}
              {geoStatus === 'error' && (
                <span className="report-new__geo-status report-new__geo-status--err">
                  Couldn&apos;t get your location. You can still type it above.
                </span>
              )}
            </div>

            <div className="report-new__map-container" ref={mapContainerRef} />
          </div>
        )}

        {step === 2 && (
          <div className="report-new__step">
            <header className="report-new__step-head">
              <h2 className="report-new__step-title">Review your report</h2>
              <p className="report-new__step-sub">
                Check the details below, then submit when you&apos;re ready.
              </p>
            </header>

            <dl className="report-new__review">
              <div className="report-new__review-row">
                <dt>Description</dt>
                <dd>
                  <span>{description || '—'}</span>
                  <button type="button" className="report-new__edit" onClick={() => goToStep(0)}>
                    Edit
                  </button>
                </dd>
              </div>

              <div className="report-new__review-row">
                <dt>Photo</dt>
                <dd>
                  {photoDataUrl ? (
                    <img
                      src={photoDataUrl}
                      alt="Selected hazard"
                      className="report-new__review-photo"
                    />
                  ) : (
                    <span>No photo added</span>
                  )}
                  <button type="button" className="report-new__edit" onClick={() => goToStep(0)}>
                    Edit
                  </button>
                </dd>
              </div>

              <div className="report-new__review-row">
                <dt>Location</dt>
                <dd>
                  <span>
                    {locationText || '—'}
                    {lat !== null && lng !== null && (
                      <span className="report-new__review-coords">
                        {' '}
                        ({lat.toFixed(5)}, {lng.toFixed(5)})
                      </span>
                    )}
                  </span>
                  <button type="button" className="report-new__edit" onClick={() => goToStep(1)}>
                    Edit
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        )}

        <div className="report-new__actions">
          <Button
            variant="ghost"
            iconLeft={<ArrowLeft size={18} />}
            onClick={goBack}
            disabled={step === 0}
          >
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button iconRight={<ArrowRight size={18} />} onClick={goNext}>
              Next
            </Button>
          ) : (
            <Button
              iconRight={<Check size={18} />}
              loading={submitting}
              onClick={handleSubmit}
            >
              Submit Report
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
