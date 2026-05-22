import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Plus, ChevronDown } from 'lucide-react'
import Header from '../components/Header.jsx'
import XPBar from '../components/XPBar.jsx'
import CategoryTabs from '../components/CategoryTabs.jsx'
import QuestCard from '../components/QuestCard.jsx'
import AddQuestModal from '../components/AddQuestModal.jsx'
import { XP_TABLE } from '../utils/xp.js'

export default function HomeScreen({ quests, categories, level, xpInfo, streak = 0, onComplete, onAdd, onUpdate, onDelete, onSettings }) {
  const [selectedCat, setSelectedCat] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingQuest, setEditingQuest] = useState(null)
  // 완료된 퀘스트 섹션 펼침 여부 — 기본 접힘으로 미완료 퀘스트에 집중
  const [showCompleted, setShowCompleted] = useState(false)
  // XP 획득 팝업 목록 — { id, amount } 복수 동시 지원
  const [xpPopups, setXpPopups] = useState([])
  const popupTimersRef = useRef([])

  // 언마운트 시 팝업 타이머 전체 정리
  useEffect(() => {
    return () => { popupTimersRef.current.forEach(clearTimeout) }
  }, [])

  // 선택된 카테고리가 삭제된 경우 'all'로 복귀
  useEffect(() => {
    if (selectedCat !== 'all' && !categories.some((c) => c.id === selectedCat)) {
      setSelectedCat('all')
    }
  }, [categories, selectedCat])

  // 퀘스트 완료 시 XP 팝업 트리거
  const handleComplete = useCallback((id) => {
    const quest = quests.find((q) => q.id === id && !q.completedToday)
    if (quest) {
      const amount = XP_TABLE[quest.difficulty] ?? 10
      const popupId = Date.now() + Math.random()
      setXpPopups((prev) => [...prev, { id: popupId, amount }])
      const timer = setTimeout(() => {
        setXpPopups((prev) => prev.filter((p) => p.id !== popupId))
      }, 1100)
      popupTimersRef.current.push(timer)
    }
    onComplete(id)
  }, [quests, onComplete])

  // O(1) 카테고리 조회용 Map
  const categoryById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  )

  // 카테고리별 퀘스트 수
  const questCounts = useMemo(() => {
    const counts = {}
    quests.forEach((q) => {
      counts[q.categoryId] = (counts[q.categoryId] ?? 0) + 1
    })
    return counts
  }, [quests])

  // 카테고리 필터링 후 미완료/완료 분리 (각각 createdAt 순)
  const { pending, done } = useMemo(() => {
    const base = selectedCat === 'all' ? quests : quests.filter((q) => q.categoryId === selectedCat)
    const sorted = [...base].sort((a, b) => a.createdAt - b.createdAt)
    return {
      pending: sorted.filter((q) => !q.completedToday),
      done:    sorted.filter((q) =>  q.completedToday),
    }
  }, [quests, selectedCat])

  const completedCount = quests.filter((q) => q.completedToday).length
  const allDone = quests.length > 0 && completedCount === quests.length

  // 빈 상태 메시지 구분
  const emptyMessage = useMemo(() => {
    if (quests.length === 0) {
      return { icon: '⚔️', title: '아직 퀘스트가 없어요', sub: '아래 + 버튼으로 첫 퀘스트를 추가하세요' }
    }
    if (selectedCat !== 'all' && pending.length === 0 && done.length === 0) {
      const cat = categories.find((c) => c.id === selectedCat)
      return { icon: cat?.emoji ?? '📂', title: `${cat?.name ?? '이 카테고리'}에 퀘스트가 없어요`, sub: '+ 버튼으로 이 카테고리에 퀘스트를 추가하세요' }
    }
    return null
  }, [quests.length, selectedCat, pending.length, done.length, categories])

  return (
    <>
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: '112px' }}>
        <Header level={level} onSettings={onSettings} />
        <XPBar xpInfo={xpInfo} level={level} />

        {/* 스트릭 배지 — 1일 이상일 때만 표시 */}
        {streak > 0 && (
          <div className="px-5 pb-3">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f5c54218',
              border: '1px solid #f5c54240',
              borderRadius: '20px',
              padding: '5px 12px',
            }}>
              <span style={{ fontSize: '14px', lineHeight: 1 }}>🔥</span>
              <span style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '10px',
                color: '#f5c542',
              }}>
                {streak}일
              </span>
              <span style={{
                fontFamily: '"Noto Sans KR", sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                color: '#8a8499',
              }}>
                연속 달성
              </span>
            </div>
          </div>
        )}

        <CategoryTabs
          categories={categories}
          selected={selectedCat}
          onSelect={setSelectedCat}
          questCounts={questCounts}
        />

        {/* 오늘 모두 완료 배너 */}
        {allDone && (
          <div
            style={{
              margin: '0 20px 16px',
              padding: '14px 16px',
              background: '#7fdbca1a',
              border: '1px solid #7fdbca44',
              borderRadius: '12px',
              boxShadow: '2px 2px 0 #000',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '18px', marginBottom: '4px' }}>🎉</div>
            <div style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px', color: '#7fdbca', lineHeight: 1.6 }}>
              ALL CLEAR!
            </div>
            <div style={{ fontFamily: '"Noto Sans KR", sans-serif', fontSize: '12px', color: '#8a8499', marginTop: '4px' }}>
              오늘의 모든 퀘스트를 완료했습니다
            </div>
          </div>
        )}

        {/* 퀘스트 리스트 */}
        <div className="px-5">
          {emptyMessage ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                color: '#8a8499',
                fontFamily: '"Noto Sans KR", sans-serif',
                fontSize: '14px',
                lineHeight: 1.7,
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{emptyMessage.icon}</div>
              <div style={{ fontWeight: 600, color: '#f0ece8' }}>{emptyMessage.title}</div>
              <div style={{ fontSize: '12px', marginTop: '6px' }}>{emptyMessage.sub}</div>
            </div>
          ) : (
            <>
              {/* 미완료 퀘스트 */}
              {pending.map((quest, i) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  category={categoryById[quest.categoryId]}
                  onComplete={handleComplete}
                  onEdit={setEditingQuest}
                  onDelete={onDelete}
                  index={i}
                />
              ))}

              {/* 완료 섹션 토글 헤더 */}
              {done.length > 0 && (
                <button
                  onClick={() => setShowCompleted((prev) => !prev)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 0',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ flex: 1, height: '1px', background: '#3d3858' }} />
                  <span style={{
                    fontFamily: '"Noto Sans KR", sans-serif',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#8a8499',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    ✓ 완료됨 · {done.length}개
                    <ChevronDown
                      size={14}
                      color="#8a8499"
                      style={{
                        transform: showCompleted ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </span>
                  <div style={{ flex: 1, height: '1px', background: '#3d3858' }} />
                </button>
              )}

              {/* 완료된 퀘스트 — 토글 시 표시 */}
              {showCompleted && done.map((quest, i) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  category={categoryById[quest.categoryId]}
                  onComplete={handleComplete}
                  onEdit={setEditingQuest}
                  onDelete={onDelete}
                  index={i}
                />
              ))}

              {/* 완료 섹션 하단 여백 */}
              {done.length > 0 && <div style={{ height: '8px' }} />}
            </>
          )}
        </div>
      </div>

      {/* XP 획득 팝업 */}
      {xpPopups.map((popup) => (
        <div
          key={popup.id}
          className="xp-popup"
          style={{
            position: 'fixed',
            top: '108px',
            right: 'max(20px, calc((100vw - 390px) / 2 + 20px))',
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '13px',
            color: '#f5c542',
            textShadow: '2px 2px 0 #000, 0 0 12px rgba(245,197,66,0.6)',
            pointerEvents: 'none',
            zIndex: 30,
            whiteSpace: 'nowrap',
          }}
        >
          +{popup.amount} XP
        </div>
      ))}

      {/* 퀘스트 추가 FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: 'max(24px, calc((100vw - 390px) / 2 + 24px))',
          width: '56px',
          height: '56px',
          background: '#7fdbca',
          border: '2px solid #000',
          boxShadow: '3px 3px 0px #000',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          transition: 'transform 0.1s, box-shadow 0.1s',
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translate(2px,2px)'
          e.currentTarget.style.boxShadow = '1px 1px 0px #000'
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = ''
          e.currentTarget.style.boxShadow = '3px 3px 0px #000'
        }}
        aria-label="퀘스트 추가"
      >
        <Plus size={24} color="#1e1a2e" strokeWidth={2.5} />
      </button>

      <AnimatePresence>
        {showAddModal && (
          <AddQuestModal
            key="add-quest"
            quests={quests}
            categories={categories}
            onAdd={onAdd}
            onClose={() => setShowAddModal(false)}
          />
        )}
        {editingQuest && (
          <AddQuestModal
            key="edit-quest"
            quests={quests}
            categories={categories}
            questToEdit={editingQuest}
            onUpdate={onUpdate}
            onClose={() => setEditingQuest(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
