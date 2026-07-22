import { Card } from '@/components/ui'
import { Camera } from '@/components/icons'
import './BeforeAfterCard.css'

interface BeforeAfterCardProps {
  beforePhotoUrl?: string | null
  afterPhotoUrl?: string | null
  isWorker?: boolean
}

export function BeforeAfterCard({ beforePhotoUrl, afterPhotoUrl, isWorker = false }: BeforeAfterCardProps) {
  return (
    <Card variant="bordered" className="ticket-card before-after-card">
      <h2 className="ticket-card__title">
        <Camera size={18} style={{ marginRight: '8px' }} />
        Resolution Evidence (Before & After)
      </h2>
      
      <div className="before-after-grid">
        {/* Before Photo */}
        <div className="photo-container before-photo">
          <div className="photo-badge before-badge">BEFORE</div>
          {beforePhotoUrl ? (
            <img 
              src={beforePhotoUrl} 
              alt="Before - Reported Hazard" 
              className="evidence-image" 
              onClick={() => {
                const w = window.open()
                w?.document.write(`<img src="${beforePhotoUrl}" style="max-width:100%; max-height:100%; display:block; margin:auto;" />`)
              }}
            />
          ) : (
            <div className="photo-placeholder">
              <Camera size={36} className="placeholder-icon" />
              <span>No "Before" photo provided by resident</span>
            </div>
          )}
          <span className="photo-label">Reported Hazard</span>
        </div>

        {/* After Photo */}
        <div className="photo-container after-photo">
          <div className="photo-badge after-badge">AFTER</div>
          {afterPhotoUrl ? (
            <img 
              src={afterPhotoUrl} 
              alt="After - Resolved Site" 
              className="evidence-image"
              onClick={() => {
                const w = window.open()
                w?.document.write(`<img src="${afterPhotoUrl}" style="max-width:100%; max-height:100%; display:block; margin:auto;" />`)
              }}
            />
          ) : (
            <div className="photo-placeholder after-empty">
              <Camera size={36} className="placeholder-icon" />
              <span>No "After" photo attached yet</span>
              {isWorker ? (
                <p className="placeholder-desc">Use the status form to upload a resolution photo</p>
              ) : (
                <p className="placeholder-desc">The city worker will upload a photo showing the resolved site.</p>
              )}
            </div>
          )}
          <span className="photo-label">Resolved Site</span>
        </div>
      </div>
    </Card>
  )
}
