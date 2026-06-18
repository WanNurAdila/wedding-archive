import { useEffect, useRef, useState } from 'react'

export default function Camera({ onCapture, onClose }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [capturedBlob, setCapturedBlob] = useState(null)
  const [capturedUrl, setCapturedUrl] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function startStream() {
      stopStream()
      setError(null)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('Camera error', err)
        setError(
          err.name === 'NotAllowedError'
            ? 'Camera access was denied. Please allow camera permission and try again.'
            : 'Could not access the camera on this device.',
        )
      }
    }

    if (!capturedBlob) {
      startStream()
    }

    return () => {
      cancelled = true
    }
  }, [facingMode, capturedBlob])

  useEffect(() => stopStream, [])

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  function handleCapture() {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)

    canvas.toBlob(
      (blob) => {
        stopStream()
        setCapturedBlob(blob)
        setCapturedUrl(URL.createObjectURL(blob))
      },
      'image/jpeg',
      0.9,
    )
  }

  function handleRetake() {
    setCapturedUrl((url) => {
      if (url) URL.revokeObjectURL(url)
      return null
    })
    setCapturedBlob(null)
  }

  function handleSave() {
    if (capturedBlob) onCapture(capturedBlob)
  }

  function handleClose() {
    stopStream()
    onClose()
  }

  return (
    <div className="camera-overlay">
      <div className="camera-frame">
        {error && (
          <div className="camera-error">
            <p>{error}</p>
            <button type="button" onClick={handleClose}>
              Close
            </button>
          </div>
        )}

        {!error && !capturedUrl && (
          <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
        )}

        {!error && capturedUrl && (
          <img src={capturedUrl} alt="Captured preview" className="camera-video" />
        )}

        {!error && (
          <div className="camera-controls">
            {!capturedUrl ? (
              <>
                <button type="button" className="camera-close" onClick={handleClose}>
                  Cancel
                </button>
                <button type="button" className="camera-shutter" onClick={handleCapture} aria-label="Take photo" />
                <button
                  type="button"
                  className="camera-flip"
                  onClick={() => setFacingMode((mode) => (mode === 'environment' ? 'user' : 'environment'))}
                  aria-label="Flip camera"
                >
                  ⟲
                </button>
              </>
            ) : (
              <>
                <button type="button" className="camera-close" onClick={handleRetake}>
                  Retake
                </button>
                <button type="button" className="camera-save" onClick={handleSave}>
                  Use photo
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
