import { useEffect, useRef, useState } from 'react'
import Camera from './components/Camera'
import Gallery from './components/Gallery'
import Details from './components/Details'
import Wishes from './components/Wishes'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import { fetchPhotos, resizeImage, uploadPhoto } from './api'
import './App.css'

function App() {
  const [page, setPage] = useState('details')
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)

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

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  function flash(message) {
    setToast(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2200)
  }

  async function handleRefresh() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPhotos()
      setPhotos(data)
      flash('Gallery refreshed')
    } catch {
      setError('Could not load photos. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUploadOne(blob, fileName) {
    const resized = await resizeImage(blob)
    const finalName =
      resized.type === 'image/jpeg' && resized !== blob
        ? fileName.replace(/\.\w+$/, '') + '.jpg'
        : fileName
    const photo = await uploadPhoto(resized, finalName)
    setPhotos((prev) => [photo, ...prev])
  }

  async function handleUpload(files) {
    setUploading(true)
    try {
      for (const file of files) {
        await handleUploadOne(file, file.name)
      }
      flash(files.length > 1 ? `${files.length} photos added` : '1 photo added')
    } catch {
      setError('Could not upload photo. Please try again.')
      flash('Could not upload photo')
    } finally {
      setUploading(false)
    }
  }

  async function handleCameraCapture(blob) {
    setShowCamera(false)
    setUploading(true)
    try {
      await handleUploadOne(blob, `photo-${Date.now()}.jpg`)
      flash('1 photo added')
    } catch {
      setError('Could not upload photo. Please try again.')
      flash('Could not upload photo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="phone">
      <div className="phone-inner">
        <div className="scroll-area">
          {page === 'details' && <Details />}
          {page === 'wishes' && <Wishes onToast={flash} />}
          {page === 'gallery' && (
            <Gallery
              photos={photos}
              loading={loading}
              error={error}
              uploading={uploading}
              onUpload={handleUpload}
              onRefresh={handleRefresh}
              onOpenCamera={() => setShowCamera(true)}
              onToast={flash}
            />
          )}
        </div>

        <BottomNav page={page} onChange={setPage} />

        <Toast message={toast} />
      </div>

      {showCamera && (
        <Camera onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />
      )}
    </div>
  )
}

export default App
