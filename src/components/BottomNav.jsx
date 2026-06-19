const TABS = [
  {
    id: 'details',
    label: 'Details',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9.5" cy="12" r="4.5" />
        <circle cx="14.5" cy="12" r="4.5" />
      </svg>
    ),
  },
  {
    id: 'wishes',
    label: 'Wishes',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 4h10l4 4v12H5z" />
        <path d="M15 4v4h4" />
        <path d="M8 12h7" />
        <path d="M8 16h5" />
      </svg>
    ),
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="M5 17l4.5-4 3 2.5L16 12l3 3.5" />
      </svg>
    ),
  },
]

export default function BottomNav({ page, onChange }) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <button
          type="button"
          key={tab.id}
          className={`nav-button${page === tab.id ? ' active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
