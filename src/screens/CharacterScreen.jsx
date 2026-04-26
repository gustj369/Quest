import { useMemo } from 'react'
import CharacterSprite from '../components/CharacterSprite.jsx'
import { ALL_BADGES } from '../utils/defaults.js'
import { loadHistory } from '../utils/storage.js'
import { formatDateKey } from '../utils/date.js'

function GrassCalendar() {
  const history = loadHistory()
  const today = new Date()

  const cells = useMemo(() => {
    const result = []
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = formatDateKey(d)
      const count = (history[key] ?? []).length
      let level = 0
      if (count >= 1) level = 1
      if (count >= 3) level = 2
      if (count >= 5) level = 3
      if (count >= 8) level = 4
      result.push({ key, count, level, date: d })
    }
    return result
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const months = useMemo(() => {
    const seen = new Set()
    return cells.map((c) => {
      const m = c.date.toLocaleDateString('ko-KR', { month: 'short' })
      if (!seen.has(m) && c.date.getDate() <= 7) { seen.add(m); return m }
      return null
    })
  }, [cells])

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(35, 1fr)', gap: '3px', marginBottom: '4px' }}>
        {months.map((m, i) => (
          <div key={i} style={{ fontSize: '9px', color: '#8a8499', fontFamily: '"Noto Sans KR"', textAlign: 'center' }}>
            {m ?? ''}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(35, 1fr)', gap: '3px' }}>
        {cells.map((c) => (
          <div
            key={c.key}
            title={`${c.key}: ${c.count}개`}
            className={`grass-cell level-${c.level}`}
            style={{ aspectRatio: '1' }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span style={{ fontSize: '10px', color: '#8a8499', fontFamily: '"Noto Sans KR"' }}>적음</span>
        {[0,1,2,3,4].map((l) => (
          <div key={l} className={`grass-cell level-${l}`} style={{ width: '12px', height: '12px' }} />
        ))}
        <span style={{ fontSize: '10px', color: '#8a8499', fontFamily: '"Noto Sans KR"' }}>많음</span>
      </div>
    </div>
  )
}

export default function CharacterScreen({ character, level, xpInfo, earnedBadgeIds, quests }) {
  const todayCompleted = quests.filter((q) => q.completedToday).length

  const rankTitle = level < 5 ? '견습 모험가'
    : level < 10 ? '숙련 전사'
    : level < 20 ? '정예 기사'
    : '전설의 영웅'

  return (
    <div className="flex-1 overflow-y-auto" style={{ paddingBottom: '80px' }}>
      <div className="px-5 pt-5 pb-2">
        <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '12px', color: '#f0ece8' }}>
          CHARACTER
        </span>
      </div>

      {/* 캐릭터 카드 */}
      <div className="px-5 mb-4">
        <div className="quest-card" style={{ padding: '24px 20px', textAlign: 'center' }}>
          <div className="flex justify-center mb-4">
            <CharacterSprite size={80} level={level} animate />
          </div>
          <div style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '20px', color: '#f5c542', marginBottom: '4px', textShadow: '2px 2px 0 #000' }}>
            Lv. {level}
          </div>
          <div style={{ fontFamily: '"Noto Sans KR", sans-serif', fontSize: '14px', color: '#8a8499', marginBottom: '20px' }}>
            {rankTitle}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {[
              { label: '총 완료', value: character.totalCompleted, color: '#7fdbca' },
              { label: '오늘',    value: todayCompleted,           color: '#f5c542' },
              { label: '총 XP',  value: character.totalXp,        color: '#a78bfa' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: '#1e1a2e',
                  borderRadius: '8px',
                  border: '1px solid #3d3858',
                  padding: '12px 8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '14px', color: stat.color, marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: '"Noto Sans KR", sans-serif', fontSize: '11px', color: '#8a8499' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 잔디 달력 */}
      <div className="px-5 mb-4">
        <div className="quest-card" style={{ padding: '20px' }}>
          <div style={{ fontFamily: '"Noto Sans KR", sans-serif', fontSize: '14px', fontWeight: 700, color: '#f0ece8', marginBottom: '16px' }}>
            📅 활동 기록
          </div>
          <GrassCalendar />
        </div>
      </div>

      {/* 뱃지 */}
      <div className="px-5 mb-4">
        <div className="quest-card" style={{ padding: '20px' }}>
          <div style={{ fontFamily: '"Noto Sans KR", sans-serif', fontSize: '14px', fontWeight: 700, color: '#f0ece8', marginBottom: '16px' }}>
            🏅 업적 뱃지
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {ALL_BADGES.map((badge) => {
              const earned = earnedBadgeIds.includes(badge.id)
              return (
                <div key={badge.id} className={`badge-item ${earned ? '' : 'locked'}`} title={badge.desc}>
                  <span style={{ fontSize: '24px', lineHeight: 1 }}>{badge.emoji}</span>
                  <span style={{ fontSize: '9px', fontFamily: '"Noto Sans KR", sans-serif', color: earned ? '#f0ece8' : '#3d3858', textAlign: 'center', lineHeight: 1.3 }}>
                    {badge.name}
                  </span>
                  {earned && (
                    <span style={{ fontSize: '8px', color: '#7fdbca', fontFamily: '"Noto Sans KR"' }}>✓ 획득</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
