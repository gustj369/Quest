import { useMemo } from 'react'
import CharacterSprite from '../components/CharacterSprite.jsx'
import { ALL_BADGES } from '../utils/defaults.js'
import { formatDateKey } from '../utils/date.js'


function GrassCalendar({ history }) {
  const cells = useMemo(() => {
    const today = new Date()
    const dow = today.getDay() // 0=일, 6=토
    // 이번 주 토요일을 끝으로 35칸(5주) 구성 → 항상 일요일 시작, 열이 완전한 1주 단위
    const end = new Date(today)
    end.setDate(today.getDate() + (6 - dow))
    const result = []
    for (let i = 34; i >= 0; i--) {
      const d = new Date(end)
      d.setDate(end.getDate() - i)
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
  }, [history])

  const weekTotal = useMemo(() => {
    // 이번 주 일요일(index 28)~오늘까지만 합산 — 미래 날짜 제외
    const todayDow = new Date().getDay()
    return cells.slice(28, 29 + todayDow).reduce((sum, c) => sum + c.count, 0)
  }, [cells])

  return (
    <div>
      <div className="character-section-header">
        <span>📅 활동 기록</span>
        <span className="section-pill">이번 주 {weekTotal}회</span>
      </div>
      <div className="grass-grid">
        {cells.map((c) => (
          <div
            key={c.key}
            title={`${c.key}: ${c.count}개`}
            className={`grass-cell level-${c.level}`}
            style={{ aspectRatio: '1' }}
          />
        ))}
      </div>
      <div className="grass-legend">
        <span>적음</span>
        {[0,1,2,3,4].map((l) => (
          <div key={l} className={`grass-cell level-${l}`} style={{ width: '12px', height: '12px' }} />
        ))}
        <span>많음</span>
      </div>
    </div>
  )
}

export default function CharacterScreen({ character, level, xpInfo, earnedBadgeIds, quests, history }) {
  const todayCompleted = quests.filter((q) => q.completedToday).length
  const nextLevelXp = xpInfo.remaining

  const rankTitle = level < 5 ? '견습 모험가'
    : level < 10 ? '숙련 전사'
    : level < 20 ? '정예 기사'
    : '전설의 영웅'

  return (
    <div className="flex-1 overflow-y-auto" style={{ paddingBottom: '128px' }}>
      <div className="px-5 pt-5 pb-2">
        <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '12px', color: '#f0ece8' }}>
          CHARACTER
        </span>
      </div>

      {/* 캐릭터 카드 */}
      <div className="px-5" style={{ marginBottom: '24px' }}>
        <div className="quest-card character-hero-card">
          <div className="character-sprite-frame">
            <CharacterSprite size={96} level={level} animate />
          </div>
          <div className="character-level">
            Lv. {level}
          </div>
          <div className="character-rank">
            {rankTitle}
          </div>
          <div className="character-next-xp">
            다음 레벨까지 {nextLevelXp} XP
          </div>

          <div className="character-stat-grid">
            {[
              { label: '총 완료', value: character.totalCompleted, color: '#7fdbca', icon: '✓' },
              { label: '오늘',    value: todayCompleted,           color: '#f5c542', icon: '◆' },
              { label: '총 XP',  value: character.totalXp,        color: '#a78bfa', icon: 'XP' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="character-stat-card"
              >
                <div className="character-stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                <div className="character-stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="character-stat-label">
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
          <GrassCalendar history={history} />
        </div>
      </div>

      {/* 뱃지 */}
      <div className="px-5 mb-4">
        <div className="quest-card" style={{ padding: '20px' }}>
          <div className="character-section-header">
            <span>🏅 업적 뱃지</span>
            <span className="section-pill">{earnedBadgeIds.length}/{ALL_BADGES.length}</span>
          </div>
          <div className="badge-grid">
            {ALL_BADGES.map((badge) => {
              const earned = earnedBadgeIds.includes(badge.id)
              return (
                <div key={badge.id} className={`badge-item ${earned ? '' : 'locked'}`} title={badge.desc}>
                  <span style={{ fontSize: '24px', lineHeight: 1 }}>{badge.emoji}</span>
                  <span className="badge-name">
                    {badge.name}
                  </span>
                  <span className={`badge-status ${earned ? 'earned' : ''}`}>
                    {earned ? '획득' : badge.hint}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
