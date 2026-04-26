import { useState, useMemo } from 'react'
import { Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PixelMonster from '../components/PixelMonster.jsx'

const EMOJI_OPTIONS = ['⚡','🌿','🎯','💡','🎨','🏃','🍎','🧪','📝','🎵','🌙','🔥','❄️','🌊','🦋']
const COLOR_OPTIONS = ['#7fdbca','#a78bfa','#f5c542','#ff9f7f','#6bdfff','#6bff9c','#ff6b6b','#ffb6c1']

export default function CategoriesScreen({ categories, quests, onAddCategory }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('⚡')
  const [newColor, setNewColor] = useState('#7fdbca')

  // 카테고리별 통계를 한 번에 계산 (O(n) 한 번)
  const catStats = useMemo(() => {
    const stats = {}
    quests.forEach((q) => {
      if (!stats[q.categoryId]) stats[q.categoryId] = { total: 0, done: 0 }
      stats[q.categoryId].total++
      if (q.completedToday) stats[q.categoryId].done++
    })
    return stats
  }, [quests])

  const handleAdd = () => {
    if (!newName.trim()) return
    onAddCategory({ name: newName.trim(), emoji: newEmoji, color: newColor })
    setNewName('')
    setNewEmoji('⚡')
    setNewColor('#7fdbca')
    setShowAdd(false)
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{ paddingBottom: '80px' }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '12px', color: '#f0ece8' }}>
          CATEGORY
        </span>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: '#7fdbca',
            border: '2px solid #000',
            boxShadow: '2px 2px 0 #000',
            borderRadius: '8px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: '"Noto Sans KR", sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            color: '#1e1a2e',
            cursor: 'pointer',
            minHeight: '44px',
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          추가
        </button>
      </div>

      {/* 카테고리 리스트 */}
      <div className="px-5" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: '#8a8499', fontFamily: '"Noto Sans KR"', fontSize: '14px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📂</div>
            <div>카테고리가 없습니다</div>
          </div>
        ) : categories.map((cat, i) => {
          const { total = 0, done = 0 } = catStats[cat.id] ?? {}
          const progress = total > 0 ? Math.round((done / total) * 100) : 0

          return (
            <div
              key={cat.id}
              className="quest-card stagger-item"
              style={{ padding: '16px 20px', animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${cat.color}22`,
                    border: `1px solid ${cat.color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: 0,
                  }}
                >
                  {cat.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontFamily: '"Noto Sans KR", sans-serif', fontSize: '15px', fontWeight: 700, color: '#f0ece8' }}>
                      {cat.name}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: '"Press Start 2P", cursive',
                        color: cat.color,
                        background: `${cat.color}22`,
                        border: `1px solid ${cat.color}44`,
                        borderRadius: '4px',
                        padding: '3px 8px',
                      }}
                    >
                      {done}/{total}
                    </span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', background: '#1e1a2e', overflow: 'hidden', border: '1px solid #3d3858' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: cat.color,
                        borderRadius: '3px',
                        transition: 'width 0.5s ease',
                        boxShadow: `0 0 6px ${cat.color}66`,
                      }}
                    />
                  </div>
                  {total === 0 && (
                    <div style={{ fontSize: '11px', color: '#8a8499', marginTop: '4px', fontFamily: '"Noto Sans KR"' }}>
                      퀘스트 없음
                    </div>
                  )}
                </div>

                <PixelMonster categoryId={cat.id} size={28} />
              </div>
            </div>
          )
        })}
      </div>

      {/* 카테고리 추가 모달 */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            className="bottom-sheet-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              className="bottom-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#3d3858' }} />
              </div>

              <div className="flex items-center justify-between px-5 py-3">
                <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '11px', color: '#f0ece8' }}>
                  카테고리 추가
                </span>
                <button onClick={() => setShowAdd(false)} style={{ color: '#8a8499', padding: '8px', minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={20} />
                </button>
              </div>

              <div className="px-5 pb-8" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  className="pixel-input"
                  placeholder="카테고리 이름 (최대 8자)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                  maxLength={8}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />

                <div>
                  <div style={{ fontSize: '12px', color: '#8a8499', fontFamily: '"Noto Sans KR"', marginBottom: '8px' }}>이모지</div>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setNewEmoji(em)}
                        style={{
                          width: '44px', height: '44px', fontSize: '20px',
                          borderRadius: '8px',
                          border: `2px solid ${newEmoji === em ? '#7fdbca' : '#3d3858'}`,
                          background: newEmoji === em ? '#7fdbca22' : 'transparent',
                          cursor: 'pointer',
                          transition: 'border-color 0.15s, background 0.15s',
                        }}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: '#8a8499', fontFamily: '"Noto Sans KR"', marginBottom: '8px' }}>색상</div>
                  <div className="flex gap-3 flex-wrap">
                    {COLOR_OPTIONS.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setNewColor(col)}
                        style={{
                          width: '36px', height: '36px',
                          borderRadius: '8px',
                          background: col,
                          border: newColor === col ? '3px solid #fff' : '2px solid #000',
                          boxShadow: newColor === col ? `0 0 8px ${col}` : 'none',
                          cursor: 'pointer',
                          transition: 'border 0.15s, box-shadow 0.15s',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  style={{
                    width: '100%', padding: '16px',
                    background: newName.trim() ? '#7fdbca' : '#2a2640',
                    color: newName.trim() ? '#1e1a2e' : '#3d3858',
                    border: `2px solid ${newName.trim() ? '#000' : '#3d3858'}`,
                    boxShadow: newName.trim() ? '3px 3px 0px #000' : 'none',
                    borderRadius: '8px',
                    fontFamily: '"Press Start 2P", cursive',
                    fontSize: '11px',
                    cursor: newName.trim() ? 'pointer' : 'not-allowed',
                    minHeight: '52px',
                    transition: 'all 0.15s',
                  }}
                >
                  추가하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
