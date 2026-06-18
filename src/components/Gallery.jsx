import { useState } from 'react'
import { photoDownloadUrl, photoViewUrl } from '../api'

export default function Gallery({ photos, loading, error }) {
  const [active, setActive] = useState(null)

  if (loading) return <p className="gallery-status">Loading photos…</p>
  if (error) return <p className="gallery-status gallery-error">{error}</p>
  if (photos.length === 0) {
    return <p className="gallery-status">No photos yet — be the first to add one!</p>
  }

  return (
    <>
      <div className="gallery-grid">
        {photos.map((photo) => (
          <button
            type="button"
            key={photo.id}
            className="gallery-item"
            onClick={() => setActive(photo)}
          >
            <img
              src={photo.thumbnailLink ?? photoViewUrl(photo.id)}
              alt={photo.name}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </button>
        ))}
      </div>

      {active && (
        <div className="lightbox" onClick={() => setActive(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={photoViewUrl(active.id)} alt={active.name} />
            <div className="lightbox-actions">
              <a href={photoDownloadUrl(active.id)} download={active.name}>
                Download
              </a>
              <button type="button" onClick={() => setActive(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
