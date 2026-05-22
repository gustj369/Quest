const KEYS = {
  // Quest data
  QUESTS: 'quest_quests',
  CATEGORIES: 'quest_categories',
  // Character progression
  CHARACTER: 'quest_character',
  BADGES: 'quest_badges',
  // Daily reset and completion history
  LAST_RESET: 'quest_last_reset',
  HISTORY: 'quest_history',
  // Browser feature preferences
  NOTIF_ENABLED: 'quest_notif_enabled',
  NOTIF_TIME: 'quest_notif_time',
  INSTALL_DISMISSED: 'quest_install_dismissed',
}

const VALID_DIFFICULTIES = new Set(['easy', 'normal', 'hard'])
const VALID_REPEATS = new Set(['daily', 'weekday', 'weekend', 'weekly'])

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    // raw !== null 으로 체크: "null" 문자열이 저장된 경우에도 JSON.parse 시도하되
    // 결과가 null이면 fallback을 반환해 pruneHistory 등 후속 처리 오류를 방지
    if (raw === null) return fallback
    const parsed = JSON.parse(raw)
    return parsed !== null ? parsed : fallback
  } catch {
    // localStorage 접근 차단(SecurityError 등) 또는 JSON 파싱 실패 시 fallback 반환
    return fallback
  }
}

/**
 * localStorage에 값을 저장한다.
 * @returns {boolean} 저장 성공 여부 (QuotaExceededError 등 실패 시 false)
 */
export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.error('[Storage] 저장 공간 초과 — 데이터가 저장되지 않았습니다.', key)
    } else {
      console.error('[Storage] 저장 실패', key, e)
    }
    return false
  }
}

export function normalizeQuest(quest, index = 0) {
  if (!quest || typeof quest !== 'object') return null
  const id = typeof quest.id === 'string' && quest.id.trim() ? quest.id : null
  const title = typeof quest.title === 'string' && quest.title.trim() ? quest.title.trim() : null
  if (!id || !title) return null

  const categoryId = typeof quest.categoryId === 'string' && quest.categoryId.trim()
    ? quest.categoryId
    : null

  return {
    ...quest,
    id,
    title,
    categoryId,
    difficulty: VALID_DIFFICULTIES.has(quest.difficulty) ? quest.difficulty : 'normal',
    repeat: VALID_REPEATS.has(quest.repeat) ? quest.repeat : 'daily',
    completedToday: Boolean(quest.completedToday),
    createdAt: Number.isFinite(quest.createdAt) ? quest.createdAt : Date.now() + index,
  }
}

export function normalizeQuests(value) {
  if (!Array.isArray(value)) return []
  return value.map(normalizeQuest).filter(Boolean)
}

export function normalizeCategory(category) {
  if (!category || typeof category !== 'object') return null
  const id = typeof category.id === 'string' && category.id.trim() ? category.id : null
  const name = typeof category.name === 'string' && category.name.trim() ? category.name.trim() : null
  if (!id || !name) return null

  return {
    ...category,
    id,
    name,
    emoji: typeof category.emoji === 'string' && category.emoji.trim() ? category.emoji : '📂',
    color: typeof category.color === 'string' && category.color.trim() ? category.color : '#7fdbca',
  }
}

export function normalizeCategories(value) {
  if (!Array.isArray(value)) return null
  return value.map(normalizeCategory).filter(Boolean)
}

export function normalizeCharacter(value, defaults) {
  if (!value || typeof value !== 'object') return null
  return {
    ...defaults,
    ...value,
    name: typeof value.name === 'string' && value.name.trim() ? value.name.trim() : defaults.name,
    totalXp: Number.isFinite(value.totalXp) && value.totalXp >= 0 ? value.totalXp : defaults.totalXp,
    totalCompleted: Number.isFinite(value.totalCompleted) && value.totalCompleted >= 0 ? value.totalCompleted : defaults.totalCompleted,
    hardCompleted: Number.isFinite(value.hardCompleted) && value.hardCompleted >= 0 ? value.hardCompleted : defaults.hardCompleted,
    spriteId: typeof value.spriteId === 'string' && value.spriteId.trim() ? value.spriteId : defaults.spriteId, // TODO: 캐릭터 선택 기능 시 활용
  }
}

export function loadQuests() {
  return normalizeQuests(load(KEYS.QUESTS, []))
}
export function saveQuests(quests) {
  return save(KEYS.QUESTS, quests)
}

export function loadCategories() {
  return normalizeCategories(load(KEYS.CATEGORIES, null))
}
export function saveCategories(cats) {
  return save(KEYS.CATEGORIES, cats)
}

export function loadCharacter() {
  return load(KEYS.CHARACTER, null)
}
export function saveCharacter(char) {
  return save(KEYS.CHARACTER, char)
}

export function loadLastReset() {
  return load(KEYS.LAST_RESET, null)
}
export function saveLastReset(date) {
  return save(KEYS.LAST_RESET, date)
}

export function loadBadges() {
  return load(KEYS.BADGES, [])
}
export function saveBadges(badges) {
  return save(KEYS.BADGES, badges)
}

export function loadHistory() {
  return load(KEYS.HISTORY, {})
}
export function saveHistory(history) {
  return save(KEYS.HISTORY, history)
}

/**
 * keepDays일 이전 기록을 제거한 새 history 객체를 반환.
 * YYYY-MM-DD 문자열은 사전 순 비교로 날짜 대소 판단 가능.
 */
export function pruneHistory(history, keepDays = 90) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - keepDays)
  const cutoffKey = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, '0')}-${String(cutoff.getDate()).padStart(2, '0')}`
  const pruned = {}
  Object.keys(history).forEach((key) => {
    if (key >= cutoffKey) pruned[key] = history[key]
  })
  return pruned
}

export function loadNotificationEnabled() {
  return load(KEYS.NOTIF_ENABLED, true)
}
export function saveNotificationEnabled(enabled) {
  save(KEYS.NOTIF_ENABLED, enabled)
}
export function loadNotificationTime() {
  return load(KEYS.NOTIF_TIME, '09:00')
}
export function saveNotificationTime(time) {
  save(KEYS.NOTIF_TIME, time)
}

export function loadInstallDismissed() {
  return load(KEYS.INSTALL_DISMISSED, false)
}
export function saveInstallDismissed(dismissed) {
  save(KEYS.INSTALL_DISMISSED, dismissed)
}
