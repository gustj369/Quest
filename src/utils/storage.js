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
}

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

export function loadQuests() {
  return load(KEYS.QUESTS, [])
}
export function saveQuests(quests) {
  save(KEYS.QUESTS, quests)
}

export function loadCategories() {
  return load(KEYS.CATEGORIES, null)
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
