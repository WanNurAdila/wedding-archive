import { useEffect, useState } from 'react'
import { fetchWishes, postWish } from '../api'
import { FlowerIcon, FooterMark, WishFlowerIcon } from './decor'

export default function Wishes({ onToast }) {
  const [wishes, setWishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [draftName, setDraftName] = useState('')
  const [draftMsg, setDraftMsg] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let ignore = false
    fetchWishes()
      .then((data) => {
        if (!ignore) setWishes(data)
      })
      .catch(() => {
        if (!ignore) setError('Could not load wishes. Please try again later.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  async function handleSubmit() {
    const msg = draftMsg.trim()
    if (!msg) {
      onToast('Please write a little note first')
      return
    }
    setSending(true)
    try {
      const wish = await postWish(draftName, msg)
      setWishes((prev) => [wish, ...prev])
      setDraftName('')
      setDraftMsg('')
      onToast('Your wish has been sent')
    } catch {
      onToast('Could not send your wish. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="wishes-page">
      <div className="wishes-header">
        <FlowerIcon size={26} />
        <h1>Notes &amp; Wishes</h1>
        <p>Leave a little message for the couple</p>
      </div>

      <div className="wishes-form">
        <input
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          placeholder="Your name"
        />
        <textarea
          value={draftMsg}
          onChange={(e) => setDraftMsg(e.target.value)}
          placeholder="Write your wish here…"
          rows={3}
        />
        <button type="button" onClick={handleSubmit} disabled={sending}>
          {sending ? 'Sending…' : 'Send your wish'}
        </button>
      </div>

      <div className="wishes-divider">
        <span className="line" />
        <span>Recent wishes</span>
        <span className="line" />
      </div>

      {loading && <p className="gallery-status">Loading wishes…</p>}
      {error && <p className="gallery-status gallery-error">{error}</p>}
      {!loading && !error && wishes.length === 0 && (
        <p className="gallery-status">No wishes yet — be the first to write one!</p>
      )}

      <div className="wishes-list">
        {wishes.map((wish) => (
          <div className="wish-card" key={wish.id}>
            <div className="wish-card-head">
              <WishFlowerIcon />
              <span>{wish.name}</span>
            </div>
            <p>{wish.msg}</p>
          </div>
        ))}
      </div>

      <FooterMark />
    </div>
  )
}
