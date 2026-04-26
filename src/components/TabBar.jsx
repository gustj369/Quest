import { Home, Grid, User } from 'lucide-react'

const TABS = [
  { id: 'home',       label: '홈',      Icon: Home },
  { id: 'categories', label: '카테고리', Icon: Grid },
  { id: 'character',  label: '캐릭터',  Icon: User },
]

export default function TabBar({ current, onChange }) {
  return (
    <nav className="tab-bar" style={{ position: 'sticky', bottom: 0, zIndex: 30 }}>
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`tab-item ${current === id ? 'active' : ''}`}
          onClick={() => onChange(id)}
          aria-label={label}
        >
          <Icon size={22} strokeWidth={current === id ? 2.5 : 1.8} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
