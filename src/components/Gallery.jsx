import { useEffect, useRef, useState } from 'react'
import { photoDownloadUrl, photoViewUrl, postEmail } from '../api'
import { FooterMark } from './decor'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function CameraIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 16V5" />
      <path d="M7 10l5-5 5 5" />
      <path d="M5 19h14" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20 11a8 8 0 0 0-14-4.5L4 8" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14 4.5L20 16" />
      <path d="M20 20v-4h-4" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function ChevronIcon({ dir }) {
  const d = dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d={d} />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 4v12" />
      <path d="M7 11l5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

export default function Gallery({
  photos,
  loading,
  error,
  uploading,
  onUpload,
  onRefresh,
  onOpenCamera,
  onToast,
}) {
  const fileInputRef = useRef(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [draftEmail, setDraftEmail] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const active = lightboxIndex !== null ? photos[lightboxIndex] : null

  useEffect(() => {
    if (lightboxIndex === null) return
    function onKey(e) {
      if (e.key === 'ArrowRight') nav(1)
      else if (e.key === 'ArrowLeft') nav(-1)
      else if (e.key === 'Escape') setLightboxIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, photos.length])

  function nav(dir) {
    setLightboxIndex((i) => (i === null ? null : (i + dir + photos.length) % photos.length))
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (files.length) onUpload(files)
  }

  async function handleEmailSubmit() {
    const email = draftEmail.trim()
    if (!EMAIL_RE.test(email)) {
      onToast?.('Please enter a valid email')
      return
    }
    setSendingEmail(true)
    try {
      await postEmail(email)
      setDraftEmail('')
      onToast?.('Thank you — we’ll share the album soon')
    } catch {
      onToast?.('Could not save your email. Please try again.')
    } finally {
      setSendingEmail(false)
    }
  }

  async function handleDownload(photo) {
    setDownloading(true)
    try {
      const res = await fetch(photoDownloadUrl(photo.id))
      const blob = await res.blob()
      const file = new File([blob], photo.name, { type: blob.type || 'image/jpeg' })

      // On iOS/Android, the native share sheet's "Save Image"/"Save to Photos"
      // option is the only way a web page can save into the photo gallery.
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] })
        return
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = photo.name
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      if (err?.name !== 'AbortError') window.open(photoDownloadUrl(photo.id), '_blank')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h1>Our Gallery</h1>
        <p>Share &amp; relive the moments</p>
      </div>

      <div className="gallery-actions">
        <button type="button" className="gallery-action-btn primary" onClick={onOpenCamera}>
          <CameraIcon /> Take Photo
        </button>
        <button type="button" className="gallery-action-btn primary" onClick={() => fileInputRef.current?.click()}>
          <UploadIcon /> Upload
        </button>
        <button type="button" className="gallery-action-btn secondary" onClick={onRefresh} disabled={loading}>
          <RefreshIcon /> Refresh
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFileChange}
      />

      <div className="gallery-email-card">
        <div className="gallery-email-card-head">
          <MailIcon />
          <h3>Want every photo?</h3>
        </div>
        <p>Leave your email and we&rsquo;ll share the full Google Drive album with all the high-resolution images.</p>
        <input
          value={draftEmail}
          onChange={(e) => setDraftEmail(e.target.value)}
          type="email"
          inputMode="email"
          placeholder="your@email.com"
        />
        <button type="button" onClick={handleEmailSubmit} disabled={sendingEmail}>
          <SendIcon />
          {sendingEmail ? 'Sending…' : 'Send me the album'}
        </button>
        <div className="gallery-email-note">
          <ClockIcon />
          <p>
            The album will be shared within <span>one week after the wedding</span>.
          </p>
        </div>
      </div>

      {uploading && <p className="gallery-status">Uploading photo…</p>}
      {loading && <p className="gallery-status">Loading photos…</p>}
      {error && <p className="gallery-status gallery-error">{error}</p>}
      {!loading && !error && photos.length === 0 && (
        <p className="gallery-status">No photos yet — be the first to add one!</p>
      )}

      {!loading && !error && photos.length > 0 && (
        <div className="gallery-grid">
          {photos.map((photo, i) => (
            <button
              type="button"
              key={photo.id}
              className="gallery-item"
              onClick={() => setLightboxIndex(i)}
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
      )}

      <FooterMark />

      {active && (
        <div className="lightbox">
          <div className="lightbox-top">
            <span>
              {lightboxIndex + 1} / {photos.length}
            </span>
            <button type="button" className="lightbox-icon-btn" onClick={() => setLightboxIndex(null)}>
              <CloseIcon />
            </button>
          </div>
          <div className="lightbox-stage">
            <img src={photoViewUrl(active.id)} alt={active.name} />
          </div>
          <div className="lightbox-bottom">
            <button type="button" className="lightbox-icon-btn" onClick={() => nav(-1)}>
              <ChevronIcon dir="prev" />
            </button>
            <button
              type="button"
              className="lightbox-download"
              onClick={() => handleDownload(active)}
              disabled={downloading}
            >
              <DownloadIcon />
              {downloading ? 'Saving…' : 'Download'}
            </button>
            <button type="button" className="lightbox-icon-btn" onClick={() => nav(1)}>
              <ChevronIcon dir="next" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
