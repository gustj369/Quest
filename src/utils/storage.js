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
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Storage write failed', e)
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
    spriteId: typeof value.spriteId === 'string' && value.spriteId.trim() ? value.spriteId : defaults.spriteId,
  }
}

export function loadQuests() {
  return normalizeQuests(load(KEYS.QUESTS, []))
}
export function saveQuests(quests) {
  save(KEYS.QUESTS, quests)
}

export function loadCategories() {
  return normalizeCategories(load(KEYS.CATEGORIES, null))
}
export function saveCategories(cats) {
  save(KEYS.CATEGORIES, cats)
}

export function loadCharacter() {
  return load(KEYS.CHARACTER, null)
}
export function saveCharacter(char) {
  save(KEYS.CHARACTER, char)
}

export function loadLastReset() {
  return load(KEYS.LAST_RESET, null)
}
export function saveLastReset(date) {
  save(KEYS.LAST_RESET, date)
}

export function loadBadges() {
  return load(KEYS.BADGES, [])
}
export function saveBadges(badges) {
  save(KEYS.BADGES, badges)
}

export function loadHistory() {
  return load(KEYS.HISTORY, {})
}
export function saveHistory(history) {
  save(KEYS.HISTORY, history)
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
