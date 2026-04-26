import { nanoid } from './nanoid.js'

export const DEFAULT_CATEGORIES = [
  { id: 'health',    name: '건강',   emoji: '💪', color: '#7fdbca' },
  { id: 'study',     name: '학습',   emoji: '📚', color: '#a78bfa' },
  { id: 'mindset',   name: '마음',   emoji: '🧘', color: '#f5c542' },
  { id: 'social',    name: '관계',   emoji: '👥', color: '#ff9f7f' },
  { id: 'hobby',     name: '취미',   emoji: '🎮', color: '#6bdfff' },
  { id: 'finance',   name: '재정',   emoji: '💰', color: '#6bff9c' },
]

export const DEFAULT_CHARACTER = {
  name: '용사',
  totalXp: 0,
  totalCompleted: 0,
  hardCompleted: 0,
  spriteId: 'warrior',
}

export const DEFAULT_QUESTS = [
  { id: nanoid(), title: '물 2L 마시기', categoryId: 'health', difficulty: 'easy',   repeat: 'daily', completedToday: false, createdAt: Date.now() },
  { id: nanoid(), title: '30분 운동하기',  categoryId: 'health', difficulty: 'normal', repeat: 'daily', completedToday: false, createdAt: Date.now() },
  { id: nanoid(), title: '책 20페이지 읽기',categoryId: 'study',  difficulty: 'easy',   repeat: 'daily', completedToday: false, createdAt: Date.now() },
  { id: nanoid(), title: '명상 10분',       categoryId: 'mindset',difficulty: 'easy',   repeat: 'daily', completedToday: false, createdAt: Date.now() },
  { id: nanoid(), title: '새 언어 단어 10개',categoryId: 'study', difficulty: 'normal', repeat: 'daily', completedToday: false, createdAt: Date.now() },
]

export const ALL_BADGES = [
  { id: 'first_quest',    name: '첫 퀘스트',   emoji: '⚔️',  desc: '첫 퀘스트 완료',           condition: (c) => c.totalCompleted >= 1 },
  { id: 'ten_quests',     name: '베테랑',       emoji: '🛡️',  desc: '누적 10개 완료',            condition: (c) => c.totalCompleted >= 10 },
  { id: 'fifty_quests',   name: '영웅',         emoji: '🏆',  desc: '누적 50개 완료',            condition: (c) => c.totalCompleted >= 50 },
  { id: 'hundred_quests', name: '전설',         emoji: '👑',  desc: '누적 100개 완료',           condition: (c) => c.totalCompleted >= 100 },
  { id: 'level_5',        name: '레벨 5',       emoji: '⭐',  desc: '레벨 5 달성',               condition: (c, lvl) => lvl >= 5 },
  { id: 'level_10',       name: '레벨 10',      emoji: '🌟',  desc: '레벨 10 달성',              condition: (c, lvl) => lvl >= 10 },
  { id: 'hard_quest',     name: '용감한 자',    emoji: '🔥',  desc: '어려움 퀘스트 첫 완료',    condition: (c) => c.hardCompleted >= 1 },
]
