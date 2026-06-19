import { useEffect, useState } from 'react'

export function useCountdown(targetIso) {
  const target = new Date(targetIso).getTime()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  let diff = Math.max(0, target - now)
  const days = Math.floor(diff / 86400000)
  diff -= days * 86400000
  const hours = Math.floor(diff / 3600000)
  diff -= hours * 3600000
  const mins = Math.floor(diff / 60000)
  diff -= mins * 60000
  const secs = Math.floor(diff / 1000)
  const pad = (n) => String(n).padStart(2, '0')

  return {
    days,
    hours: pad(hours),
    mins: pad(mins),
    secs: pad(secs),
    isPast: target - now <= 0,
  }
}
