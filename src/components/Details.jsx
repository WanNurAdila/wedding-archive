import { Divider, FlowerIcon, FooterMark, Wreath } from './decor'
import { useCountdown } from '../useCountdown'
import {
  COUPLE_NAME,
  VENUE_LOCATION,
  VENUE_MAPS_URL,
  VENUE_NAME,
  WEDDING_DATE_LABEL,
  WEDDING_TARGET_ISO,
} from '../wedding'

export default function Details() {
  const cd = useCountdown(WEDDING_TARGET_ISO)
  const dayMode = cd.isPast

  return (
    <div className="details-page">
      <div className="details-banner">
        <Wreath />
      </div>
      <p className="details-eyebrow">
        {dayMode ? 'The day is here · Welcome' : 'Together with their families'}
      </p>
      <h1 className="details-title">{COUPLE_NAME}</h1>
      <p className="details-subtitle">
        {dayMode ? 'are celebrating their wedding today' : 'are getting married'}
      </p>

      <div className="details-divider">
        <Divider />
      </div>
      <p className="details-date">
        {dayMode ? `TODAY · ${WEDDING_DATE_LABEL.toUpperCase()}` : WEDDING_DATE_LABEL.toUpperCase()}
      </p>

      {!dayMode && (
        <div className="countdown-card">
          <p className="countdown-label">counting down to forever</p>
          <div className="countdown-grid">
            <div className="countdown-unit">
              <div className="countdown-value">{cd.days}</div>
              <div className="countdown-unit-label">Days</div>
            </div>
            <div className="countdown-unit">
              <div className="countdown-value">{cd.hours}</div>
              <div className="countdown-unit-label">Hrs</div>
            </div>
            <div className="countdown-unit">
              <div className="countdown-value">{cd.mins}</div>
              <div className="countdown-unit-label">Min</div>
            </div>
            <div className="countdown-unit">
              <div className="countdown-value">{cd.secs}</div>
              <div className="countdown-unit-label">Sec</div>
            </div>
          </div>
        </div>
      )}

      {dayMode && (
        <div className="welcome-card">
          <FlowerIcon size={22} />
          <h3>You’re here</h3>
          <p>
            Thank you for being part of our special day. Please find your place, settle in, and
            celebrate with us.
          </p>
        </div>
      )}

      <div className="venue-card">
        <p className="venue-eyebrow">{dayMode ? 'Happening today' : 'When & Where'}</p>
        <h3 className="venue-title">Akad Nikah &amp; Reception</h3>
        <div className="venue-rows">
          <div className="venue-row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9DAB90" strokeWidth="1.4">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7 v5 l3.5 2" />
            </svg>
            <div>
              <div className="venue-row-title">
                {dayMode ? 'Underway from 11:00 AM' : '11:00 AM onwards'}
              </div>
              <div className="venue-row-sub">Lunch reception to follow</div>
            </div>
          </div>
          <div className="venue-row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9DAB90" strokeWidth="1.4">
              <path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <div>
              <div className="venue-row-title">{VENUE_NAME}</div>
              <div className="venue-row-sub">
                {VENUE_LOCATION}
                {dayMode ? ' · so glad you made it' : ''}
              </div>
            </div>
          </div>
        </div>
        <a href={VENUE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="venue-cta">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          Open in Maps
        </a>
      </div>

      <FooterMark />
    </div>
  )
}
