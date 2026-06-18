export async function fetchPhotos() {
  const res = await fetch('/api/photos')
  if (!res.ok) throw new Error('Failed to load photos')
  const { photos } = await res.json()
  return photos
}

export async function uploadPhoto(blob, fileName) {
  const res = await fetch('/api/photos/upload', {
    method: 'POST',
    headers: {
      'Content-Type': blob.type || 'image/jpeg',
      'X-File-Name': encodeURIComponent(fileName),
    },
    body: blob,
  })
  if (!res.ok) throw new Error('Failed to upload photo')
  const { photo } = await res.json()
  return photo
}

export function photoViewUrl(id) {
  return `/api/photos/${id}`
}

export function photoDownloadUrl(id) {
  return `/api/photos/${id}?download=1`
}
