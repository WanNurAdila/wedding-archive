export function isIOS() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || navigator.vendor || ''
  if (/iPad|iPhone|iPod/.test(ua)) return true
  // iPadOS 13+ identifies as "MacIntel" but is touch-capable, unlike a real Mac
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
}

export function getMapLinks(query) {
  const q = encodeURIComponent(query)
  return {
    waze: `https://waze.com/ul?q=${q}&navigate=yes`,
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
    apple: `https://maps.apple.com/?q=${q}`,
  }
}
