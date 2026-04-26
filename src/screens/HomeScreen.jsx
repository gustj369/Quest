import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import Header from '../components/Header.jsx'
import XPBar from '../components/XPBar.jsx'
import CategoryTabs from '../components/CategoryTabs.jsx'
import QuestCard from '../components/QuestCard.jsx'
import AddQuestModal from '../components/AddQuestModal.jsx'

export default function HomeScreen({ quests, categories, level, xpInfo, onComplete, onAdd, onDelete, onSettings }) {
  const [selectedCat, setSelectedCat] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  // 카테고리별 퀘스트 수
  const questCounts = useMemo(() => {
    const counts = {}
    quests.forEach((q) => {
      counts[q.categoryId] = (counts[q.categoryId] ?? 0) + 1
    })
    return counts
  }, [quests])

  // 필터링 + 완료된 것 뒤로
  const filtered = useMemo(() => {
    const base = selectedCat === 'all' ? quests : quests.filter((q) => q.categoryId === selectedCat)
    return [...base].sort((a, b) => {
      if (a.completedToday === b.completedToday) return a.createdAt - b.createdAt
      return a.completedToday ? 1 : -1
    })
  }, [quests, selectedCat])

  const completedCount = quests.filter((q) => q.completedToday).length
  const allDone = quests.length > 0 && completedCount === quests.length

  // 빈 상태 메시지 구분
  const emptyMessage = useMemo(() => {
    if (quests.length === 0) {
      return { icon: '⚔️', title: '아직 퀘스트가 없어요', sub: '아래 + 버튼으로 첫 퀘스트를 추가하세요' }
    }
    if (selectedCat !== 'all' && filtered.length === 0) {
      const cat = categories.find((c) => c.id === selectedCat)
      return { icon: cat?.emoji ?? '📂', title: `${cat?.name ?? '이 카테고리'}에 퀘스트가 없어요`, sub: '+ 버튼으로 이 카테고리에 퀘스트를 추가하세요' }
    }
    return null
  }, [quests.length, selectedCat, filtered.length, categories])

  return (
    <>
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: '80px' }}>
        <Header level={level} onSettings={onSettings} />
        <XPBar xpInfo={xpInfo} level={level} />
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
            <div style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '9px', color: '#7fdbca', lineHeight: 1.6 }}>
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
            filtered.map((quest, i) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                category={categories.find((c) => c.id === quest.categoryId)}
                onComplete={onComplete}
                onDelete={onDelete}
                index={i}
              />
            ))
          )}
        </div>

        {/* 하단 완료 카운트 */}
        {quests.length > 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '16px',
              fontSize: '12px',
              color: '#8a8499',
              fontFamily: '"Noto Sans KR", sans-serif',
            }}
          >
            완료한 퀘스트:{' '}
            <span style={{ color: '#7fdbca', fontWeight: 700 }}>{completedCount}</span>
            /{quests.length}
          </div>
        )}
      </div>

      {/* 퀘스트 추가 FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '24px',
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

      {showAddModal && (
        <AddQuestModal
          categories={categories}
          onAdd={onAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  )
}
