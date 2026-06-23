export async function fetchPhotos() {
  const res = await fetch('/api/photos')
  if (!res.ok) throw new Error('Failed to load photos')
  const { photos } = await res.json()
  return photos
}

export async function resizeImage(blob, maxDimension = 1600, quality = 0.8) {
  try {
    const bitmap = await createImageBitmap(blob)
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
    if (scale === 1) return blob

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)

    const resized = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
    return resized ?? blob
  } catch {
    return blob
  }
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

export async function fetchWishes() {
  const res = await fetch('/api/wishes')
  if (!res.ok) throw new Error('Failed to load wishes')
  const { wishes } = await res.json()
  return wishes
}

export async function postWish(name, msg) {
  const res = await fetch('/api/wishes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, msg }),
  })
  if (!res.ok) throw new Error('Failed to send wish')
  const { wish } = await res.json()
  return wish
}

export async function postEmail(email) {
  const res = await fetch('/api/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error('Failed to send email')
}
