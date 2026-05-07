import { useMemo } from 'react'

export default function CategoryTabs({ categories, selected, onSelect, questCounts }) {
  const allCount = useMemo(
    () => Object.values(questCounts).reduce((a, b) => a + b, 0),
    [questCounts]
  )

  return (
    <div
      className="flex gap-2 pl-5 pb-4 overflow-x-auto"
      style={{ paddingRight: '28px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
    >
      {/* 전체 탭 */}
      <button
        className={`cat-chip ${selected === 'all' ? 'active' : ''}`}
        onClick={() => onSelect('all')}
      >
        전체
        <span
          className="ml-2 inline-flex items-center justify-center"
          style={{
            background: selected === 'all' ? 'rgba(0,0,0,0.15)' : '#3d3858',
            borderRadius: '10px',
            fontSize: '11px',
            minWidth: '20px',
            height: '20px',
            padding: '0 6px',
            fontFamily: '"Noto Sans KR", sans-serif',
            fontWeight: 700,
          }}
        >
          {allCount}
        </span>
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`cat-chip ${selected === cat.id ? 'active' : ''}`}
          onClick={() => onSelect(cat.id)}
        >
          <span className="mr-1">{cat.emoji}</span>
          {cat.name}
          <span
            className="ml-2 inline-flex items-center justify-center"
            style={{
              background: selected === cat.id ? 'rgba(0,0,0,0.15)' : '#3d3858',
              borderRadius: '10px',
              fontSize: '11px',
              minWidth: '20px',
              height: '20px',
              padding: '0 6px',
              fontFamily: '"Noto Sans KR", sans-serif',
              fontWeight: 700,
            }}
          >
            {questCounts[cat.id] ?? 0}
          </span>
        </button>
      ))}
      <div style={{ flex: '0 0 24px' }} aria-hidden="true" />
    </div>
  )
}
