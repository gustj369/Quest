import { useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const REPEAT_OPTIONS = [
  { value: 'daily',   label: '매일' },
  { value: 'weekday', label: '평일' },
  { value: 'weekend', label: '주말' },
  { value: 'weekly',  label: '매주' },
]

export default function AddQuestModal({ categories, onAdd, onClose }) {
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [difficulty, setDifficulty] = useState('normal')
  const [repeat, setRepeat] = useState('daily')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), categoryId, difficulty, repeat })
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        className="bottom-sheet-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bottom-sheet"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 핸들 */}
          <div className="flex justify-center pt-3 pb-1">
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#3d3858' }} />
          </div>

          {/* 헤더 */}
          <div className="flex items-center justify-between px-5 py-3">
            <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '11px', color: '#f0ece8' }}>
              새 퀘스트
            </span>
            <button
              onClick={onClose}
              style={{ color: '#8a8499', padding: '8px', minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-5 pb-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 퀘스트명 */}
            <div>
              <label style={{ fontSize: '12px', color: '#8a8499', fontFamily: '"Noto Sans KR", sans-serif', display: 'block', marginBottom: '8px' }}>
                퀘스트 이름
              </label>
              <input
                className="pixel-input"
                placeholder="예: 물 2L 마시기"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                maxLength={40}
              />
            </div>

            {/* 카테고리 선택 */}
            <div>
              <label style={{ fontSize: '12px', color: '#8a8499', fontFamily: '"Noto Sans KR", sans-serif', display: 'block', marginBottom: '8px' }}>
                카테고리
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${categoryId === cat.id ? cat.color : '#3d3858'}`,
                      background: categoryId === cat.id ? `${cat.color}22` : 'transparent',
                      color: categoryId === cat.id ? cat.color : '#8a8499',
                      fontSize: '13px',
                      fontFamily: '"Noto Sans KR", sans-serif',
                      fontWeight: 500,
                      minHeight: '44px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {cat.emoji} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 난이도 */}
            <div>
              <label style={{ fontSize: '12px', color: '#8a8499', fontFamily: '"Noto Sans KR", sans-serif', display: 'block', marginBottom: '8px' }}>
                난이도
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'easy',   stars: 1, color: '#7fdbca', xp: '10xp' },
                  { value: 'normal', stars: 2, color: '#f5c542', xp: '25xp' },
                  { value: 'hard',   stars: 3, color: '#ff6b6b', xp: '50xp' },
                ].map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDifficulty(d.value)}
                    style={{
                      flex: 1,
                      padding: '12px 8px',
                      borderRadius: '8px',
                      border: `1px solid ${difficulty === d.value ? d.color : '#3d3858'}`,
                      background: difficulty === d.value ? `${d.color}22` : 'transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      minHeight: '64px',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: d.color }}>
                      {'★'.repeat(d.stars)}{'☆'.repeat(3 - d.stars)}
                    </span>
                    <span style={{ fontSize: '9px', fontFamily: '"Press Start 2P", cursive', color: d.color }}>
                      {d.xp}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 반복 주기 */}
            <div>
              <label style={{ fontSize: '12px', color: '#8a8499', fontFamily: '"Noto Sans KR", sans-serif', display: 'block', marginBottom: '8px' }}>
                반복 주기
              </label>
              <div className="flex gap-2 flex-wrap">
                {REPEAT_OPTIONS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRepeat(r.value)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${repeat === r.value ? '#7fdbca' : '#3d3858'}`,
                      background: repeat === r.value ? '#7fdbca22' : 'transparent',
                      color: repeat === r.value ? '#7fdbca' : '#8a8499',
                      fontSize: '13px',
                      fontFamily: '"Noto Sans KR", sans-serif',
                      minHeight: '44px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 등록 버튼 */}
            <button
              type="submit"
              disabled={!title.trim()}
              style={{
                width: '100%',
                padding: '16px',
                background: title.trim() ? '#7fdbca' : '#2a2640',
                color: title.trim() ? '#1e1a2e' : '#3d3858',
                border: `2px solid ${title.trim() ? '#000' : '#3d3858'}`,
                boxShadow: title.trim() ? '3px 3px 0px #000' : 'none',
                borderRadius: '8px',
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '11px',
                cursor: title.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
                minHeight: '52px',
              }}
              onMouseDown={(e) => {
                if (title.trim()) {
                  e.currentTarget.style.transform = 'translate(2px, 2px)'
                  e.currentTarget.style.boxShadow = '1px 1px 0px #000'
                }
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = title.trim() ? '3px 3px 0px #000' : 'none'
              }}
            >
              퀘스트 등록
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
