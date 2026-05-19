import { useMemo, useState } from 'react'
import BottomSheet from './BottomSheet.jsx'
import { QUEST_TEMPLATES, REPEAT_OPTIONS } from '../utils/defaults.js'
import { XP_TABLE } from '../utils/xp.js'


export default function AddQuestModal({ quests = [], categories, questToEdit = null, onAdd, onUpdate, onClose }) {
  const hasCategories = categories.length > 0
  const isEditing = Boolean(questToEdit)
  const hasCurrentCategory = hasCategories && categories.some((cat) => cat.id === questToEdit?.categoryId)
  const initialCategoryId = hasCurrentCategory
    ? questToEdit.categoryId
    : isEditing
      ? ''
      : categories[0]?.id ?? ''
  const [mode, setMode] = useState('custom')
  const [templateCat, setTemplateCat] = useState('all')
  const [title, setTitle] = useState(questToEdit?.title ?? '')
  const [categoryId, setCategoryId] = useState(initialCategoryId)
  const [difficulty, setDifficulty] = useState(questToEdit?.difficulty ?? 'normal')
  const [repeat, setRepeat] = useState(questToEdit?.repeat ?? 'daily')

  const categoryById = useMemo(() => {
    return Object.fromEntries(categories.map((cat) => [cat.id, cat]))
  }, [categories])

  const filteredTemplates = useMemo(() => {
    return QUEST_TEMPLATES.filter((template) => {
      const categoryExists = Boolean(categoryById[template.categoryId])
      const categoryMatches = templateCat === 'all' || template.categoryId === templateCat
      return categoryExists && categoryMatches
    })
  }, [categoryById, templateCat])

  const existingTitles = useMemo(() => {
    return new Set(quests.map((quest) => quest.title.trim()))
  }, [quests])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!hasCategories) return
    if (!title.trim()) return
    if (!categoryId) return
    const payload = { title: title.trim(), categoryId, difficulty, repeat }
    if (isEditing) {
      onUpdate?.(questToEdit.id, payload)
    } else {
      onAdd(payload)
    }
    onClose()
  }

  const handleTemplateAdd = (template) => {
    if (existingTitles.has(template.title)) return
    onAdd({
      title: template.title,
      categoryId: categoryById[template.categoryId] ? template.categoryId : categories[0]?.id ?? '',
      difficulty: template.difficulty,
      repeat: template.repeat,
    })
    onClose()
  }

  if (!hasCategories) {
    return (
      <BottomSheet title={isEditing ? '퀘스트 수정' : '새 퀘스트'} onClose={onClose}>
        <div className="px-5 pb-8">
          <div className="quest-empty-category">
            <div className="quest-empty-icon">📂</div>
            <div className="quest-empty-title">카테고리가 먼저 필요해요</div>
            <div className="quest-empty-copy">
              퀘스트는 카테고리에 연결됩니다. 카테고리 탭에서 건강, 학습 같은 목표 그룹을 만든 뒤 퀘스트를 추가하세요.
            </div>
            <button type="button" className="quest-empty-button" onClick={onClose}>
              확인
            </button>
          </div>
        </div>
      </BottomSheet>
    )
  }

  return (
    <BottomSheet title={isEditing ? '퀘스트 수정' : '새 퀘스트'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="px-5 pb-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isEditing && (
            <div className="quest-mode-tabs">
              {[
                { value: 'custom', label: '직접 만들기' },
                { value: 'template', label: '추천' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`quest-mode-tab ${mode === item.value ? 'active' : ''}`}
                  onClick={() => setMode(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

            {!isEditing && mode === 'template' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="template-filter-row">
                  <button
                    type="button"
                    className={`template-filter-chip ${templateCat === 'all' ? 'active' : ''}`}
                    onClick={() => setTemplateCat('all')}
                  >
                    전체
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`template-filter-chip ${templateCat === cat.id ? 'active' : ''}`}
                      onClick={() => setTemplateCat(cat.id)}
                    >
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>
                <div className="quest-template-list">
                  {filteredTemplates.map((template) => {
                    const cat = categoryById[template.categoryId]
                    const exists = existingTitles.has(template.title)
                    return (
                      <button
                        key={`${template.categoryId}-${template.title}`}
                        type="button"
                        className={`quest-template-card ${exists ? 'added' : ''}`}
                        disabled={exists}
                        onClick={() => handleTemplateAdd(template)}
                      >
                        <span className="quest-template-title">{template.title}</span>
                        <span className="quest-template-meta">
                          {cat?.emoji} {cat?.name} · {REPEAT_OPTIONS.find((item) => item.value === template.repeat)?.label}
                        </span>
                        <span className={`quest-template-difficulty ${template.difficulty}`}>
                          {exists ? '추가됨' : `+${XP_TABLE[template.difficulty]}xp`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <>
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
                  {isEditing && !hasCurrentCategory && (
                    <div style={{ marginBottom: '8px', fontSize: '12px', color: '#f5c542', fontFamily: '"Noto Sans KR", sans-serif', lineHeight: 1.5 }}>
                      기존 카테고리가 삭제되었습니다. 저장하려면 새 카테고리를 선택하세요.
                    </div>
                  )}
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
                      { value: 'easy',   stars: 1, color: '#7fdbca' },
                      { value: 'normal', stars: 2, color: '#f5c542' },
                      { value: 'hard',   stars: 3, color: '#ff6b6b' },
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
                          +{XP_TABLE[d.value]}xp
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
                  disabled={!title.trim() || !categoryId}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: title.trim() && categoryId ? '#7fdbca' : '#2a2640',
                    color: title.trim() && categoryId ? '#1e1a2e' : '#3d3858',
                    border: `2px solid ${title.trim() && categoryId ? '#000' : '#3d3858'}`,
                    boxShadow: title.trim() && categoryId ? '3px 3px 0px #000' : 'none',
                    borderRadius: '8px',
                    fontFamily: '"Press Start 2P", cursive',
                    fontSize: '11px',
                    cursor: title.trim() && categoryId ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s',
                    minHeight: '52px',
                  }}
                  onMouseDown={(e) => {
                    if (title.trim() && categoryId) {
                      e.currentTarget.style.transform = 'translate(2px, 2px)'
                      e.currentTarget.style.boxShadow = '1px 1px 0px #000'
                    }
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.boxShadow = title.trim() && categoryId ? '3px 3px 0px #000' : 'none'
                  }}
                >
                  {isEditing ? '수정 완료' : '퀘스트 등록'}
                </button>
              </>
            )}
        </form>
    </BottomSheet>
  )
}
