export function Wreath() {
  return (
    <svg width="300" height="66" viewBox="0 0 300 66" fill="none" stroke="#9DAB90" strokeWidth="1.1" strokeLinecap="round">
      <path d="M30 56 Q150 8 270 56" />
      <g fill="#B8C4AC" stroke="none">
        <ellipse cx="62" cy="44" rx="7.5" ry="3" transform="rotate(38 62 44)" />
        <ellipse cx="92" cy="32" rx="7.5" ry="3" transform="rotate(26 92 32)" />
        <ellipse cx="122" cy="23" rx="7.5" ry="3" transform="rotate(15 122 23)" />
        <ellipse cx="178" cy="23" rx="7.5" ry="3" transform="rotate(-15 178 23)" />
        <ellipse cx="208" cy="32" rx="7.5" ry="3" transform="rotate(-26 208 32)" />
        <ellipse cx="238" cy="44" rx="7.5" ry="3" transform="rotate(-38 238 44)" />
      </g>
      <g fill="#EAEFE2" stroke="#9DAB90" strokeWidth="1">
        <ellipse cx="150" cy="14" rx="1.8" ry="3.1" />
        <ellipse cx="150" cy="14" rx="1.8" ry="3.1" transform="rotate(60 150 19)" />
        <ellipse cx="150" cy="14" rx="1.8" ry="3.1" transform="rotate(120 150 19)" />
        <ellipse cx="150" cy="14" rx="1.8" ry="3.1" transform="rotate(180 150 19)" />
        <ellipse cx="150" cy="14" rx="1.8" ry="3.1" transform="rotate(240 150 19)" />
        <ellipse cx="150" cy="14" rx="1.8" ry="3.1" transform="rotate(300 150 19)" />
      </g>
      <circle cx="150" cy="19" r="2.1" fill="#C7B06A" />
    </svg>
  )
}

export function Divider() {
  return (
    <svg width="170" height="16" viewBox="0 0 170 16" fill="none" stroke="#9DAB90" strokeWidth="1" strokeLinecap="round">
      <path d="M8 8 H70" />
      <path d="M100 8 H162" />
      <g fill="#B8C4AC" stroke="none">
        <ellipse cx="44" cy="8" rx="6" ry="2.3" transform="rotate(20 44 8)" />
        <ellipse cx="126" cy="8" rx="6" ry="2.3" transform="rotate(-20 126 8)" />
      </g>
      <circle cx="85" cy="8" r="2" fill="#C7B06A" />
    </svg>
  )
}

export function FlowerIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ margin: '0 auto' }} aria-hidden="true">
      <g fill="#EAEFE2" stroke="#9DAB90" strokeWidth="1">
        <ellipse cx="12" cy="5" rx="2" ry="3.4" />
        <ellipse cx="12" cy="5" rx="2" ry="3.4" transform="rotate(45 12 12)" />
        <ellipse cx="12" cy="5" rx="2" ry="3.4" transform="rotate(90 12 12)" />
        <ellipse cx="12" cy="5" rx="2" ry="3.4" transform="rotate(135 12 12)" />
        <ellipse cx="12" cy="5" rx="2" ry="3.4" transform="rotate(180 12 12)" />
        <ellipse cx="12" cy="5" rx="2" ry="3.4" transform="rotate(225 12 12)" />
        <ellipse cx="12" cy="5" rx="2" ry="3.4" transform="rotate(270 12 12)" />
        <ellipse cx="12" cy="5" rx="2" ry="3.4" transform="rotate(315 12 12)" />
      </g>
      <circle cx="12" cy="12" r="2.4" fill="#C7B06A" />
    </svg>
  )
}

export function WishFlowerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" style={{ flex: 'none' }} aria-hidden="true">
      <g fill="#EAEFE2" stroke="#9DAB90" strokeWidth="1.2">
        <ellipse cx="12" cy="5.5" rx="2.4" ry="4" />
        <ellipse cx="12" cy="5.5" rx="2.4" ry="4" transform="rotate(72 12 12)" />
        <ellipse cx="12" cy="5.5" rx="2.4" ry="4" transform="rotate(144 12 12)" />
        <ellipse cx="12" cy="5.5" rx="2.4" ry="4" transform="rotate(216 12 12)" />
        <ellipse cx="12" cy="5.5" rx="2.4" ry="4" transform="rotate(288 12 12)" />
      </g>
      <circle cx="12" cy="12" r="2.6" fill="#C7B06A" />
    </svg>
  )
}

export function FooterMark() {
  return (
    <div className="footer-mark">
      <FlowerIcon size={20} />
      <p>Built with ❤️ by Wan Nur Adila</p>
    </div>
  )
}
