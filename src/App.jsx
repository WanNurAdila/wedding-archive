import { useEffect, useRef, useState } from 'react'
import Camera from './components/Camera'
import Gallery from './components/Gallery'
import { fetchPhotos, uploadPhoto } from './api'
import './App.css'

function App() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    let ignore = false

    fetchPhotos()
      .then((data) => {
        if (!ignore) setPhotos(data)
      })
      .catch(() => {
        if (!ignore) setError('Could not load photos. Please try again later.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  async function handleUpload(blob, fileName) {
    setUploading(true)
    try {
      const photo = await uploadPhoto(blob, fileName)
      setPhotos((prev) => [photo, ...prev])
    } catch {
      setError('Could not upload photo. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function handleCameraCapture(blob) {
    setShowCamera(false)
    await handleUpload(blob, `photo-${Date.now()}.jpg`)
  }

  async function handleFileChange(event) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    for (const file of files) {
      await handleUpload(file, file.name)
    }
  }

  return (
    <>
      <header className="site-header">
        <h1>Wedding Archive</h1>
        <p>Capture and share your favourite moments from the day</p>
      </header>

      <main>
        {uploading && <p className="gallery-status">Uploading photo…</p>}
        <Gallery photos={photos} loading={loading} error={error} />
      </main>

      <div className="action-bar">
        <button type="button" className="action-button" onClick={() => setShowCamera(true)}>
          Take Photo
        </button>
        <button type="button" className="action-button secondary" onClick={() => fileInputRef.current?.click()}>
          Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileChange}
        />
      </div>

      {showCamera && (
        <Camera onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />
      )}
    </>
  )
}

export default App
