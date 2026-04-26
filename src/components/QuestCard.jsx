import { useState, useRef, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import PixelMonster from './PixelMonster.jsx'
import { XP_TABLE } from '../utils/xp.js'

const DIFFICULTY_COLOR = { easy: '#7fdbca', normal: '#f5c542', hard: '#ff6b6b' }
const DIFFICULTY_STARS = { easy: 1, normal: 2, hard: 3 }

// 애니메이션 타이밍 상수 (ms)
const TIMING = {
  MONSTER_HIT_DURATION: 280,   // 몬스터 타격 이펙트 길이
  SLIDE_DELAY: 240,            // 타격 후 슬라이드 시작까지 대기
  COMPLETE_DELAY: 520,         // 슬라이드 시작 후 상태 업데이트까지 대기
}

export default function QuestCard({ quest, category, onComplete, onDelete, index = 0 }) {
  const [animating, setAnimating] = useState(false)
  const [sliding, setSliding] = useState(false)
  const [monsterHit, setMonsterHit] = useState(false)
  const cardRef = useRef(null)
  // 예약된 타이머 ID를 추적하여 언마운트 시 일괄 정리
  const timeoutsRef = useRef([])

  // 부모가 completedToday를 true로 업데이트하면 애니메이션 상태 리셋
  useEffect(() => {
    if (quest.completedToday) {
      setSliding(false)
      setAnimating(false)
      setMonsterHit(false)
    }
  }, [quest.completedToday])

  // 언마운트 시 남은 타이머 전부 취소
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  const handleComplete = () => {
    if (quest.completedToday || animating) return

    setAnimating(true)
    setMonsterHit(true)

    timeoutsRef.current = [
      setTimeout(() => setMonsterHit(false), TIMING.MONSTER_HIT_DURATION),
      setTimeout(() => setSliding(true), TIMING.SLIDE_DELAY),
      setTimeout(() => onComplete(quest.id), TIMING.COMPLETE_DELAY),
    ]
  }

  const stars = DIFFICULTY_STARS[quest.difficulty] ?? 1

  return (
    <div
      ref={cardRef}
      className={`quest-card ${quest.completedToday ? 'completed' : ''} ${sliding ? 'slide-out' : ''} stagger-item`}
      style={{
        marginBottom: sliding ? 0 : '12px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animationDelay: `${index * 0.05}s`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 완료 버튼 */}
      <button
        onClick={handleComplete}
        disabled={quest.completedToday}
        aria-label="퀘스트 완료"
        style={{
          width: '44px',
          height: '44px',
          minWidth: '44px',
          border: `2px solid ${quest.completedToday ? '#7fdbca' : '#3d3858'}`,
          borderRadius: '8px',
          background: quest.completedToday ? '#7fdbca22' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: quest.completedToday ? 'default' : 'pointer',
          transition: 'border-color 0.15s, background 0.15s',
          flexShrink: 0,
        }}
      >
        {quest.completedToday ? (
          <svg width="20" height="20" viewBox="0 0 5 5" style={{ imageRendering: 'pixelated' }}>
            <rect x="0" y="3" width="1" height="1" fill="#7fdbca"/>
            <rect x="1" y="4" width="1" height="1" fill="#7fdbca"/>
            <rect x="2" y="3" width="1" height="1" fill="#7fdbca"/>
            <rect x="3" y="2" width="1" height="1" fill="#7fdbca"/>
            <rect x="4" y="1" width="1" height="1" fill="#7fdbca"/>
          </svg>
        ) : (
          <div style={{ width: '12px', height: '12px', border: '2px solid #3d3858', borderRadius: '3px' }} />
        )}
      </button>

      {/* 퀘스트 정보 */}
      <div className="flex-1 min-w-0">
        <div
          style={{
            fontFamily: '"Noto Sans KR", sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            color: quest.completedToday ? '#8a8499' : '#f0ece8',
            textDecoration: quest.completedToday ? 'line-through' : 'none',
            lineHeight: 1.4,
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {quest.title}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {category && (
            <span style={{ fontSize: '12px', color: '#8a8499', fontFamily: '"Noto Sans KR", sans-serif' }}>
              {category.emoji} {category.name}
            </span>
          )}
          <span style={{ fontSize: '11px', color: DIFFICULTY_COLOR[quest.difficulty] }}>
            {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
          </span>
          <span
            style={{
              fontSize: '9px',
              fontFamily: '"Press Start 2P", cursive',
              color: DIFFICULTY_COLOR[quest.difficulty],
              background: `${DIFFICULTY_COLOR[quest.difficulty]}22`,
              border: `1px solid ${DIFFICULTY_COLOR[quest.difficulty]}44`,
              borderRadius: '4px',
              padding: '2px 6px',
            }}
          >
            +{XP_TABLE[quest.difficulty]}xp
          </span>
          {/* 반복 주기 뱃지 (daily 제외) */}
          {quest.repeat && quest.repeat !== 'daily' && (
            <span style={{
              fontSize: '9px',
              fontFamily: '"Noto Sans KR", sans-serif',
              color: '#8a8499',
              background: '#1e1a2e',
              border: '1px solid #3d3858',
              borderRadius: '4px',
              padding: '2px 6px',
            }}>
              {{ weekday:'평일', weekend:'주말', weekly:'매주' }[quest.repeat]}
            </span>
          )}
        </div>
      </div>

      {/* 픽셀 몬스터 */}
      <PixelMonster
        categoryId={quest.categoryId}
        size={32}
        animate={monsterHit}
      />

      {/* 삭제 버튼 */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(quest.id) }}
        style={{
          padding: '8px',
          color: '#3d3858',
          minHeight: '44px',
          minWidth: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b6b')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#3d3858')}
        aria-label="퀘스트 삭제"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
