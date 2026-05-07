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

export const QUEST_TEMPLATES = [
  { title: '물 2L 마시기', categoryId: 'health', difficulty: 'easy', repeat: 'daily' },
  { title: '아침 스트레칭 5분', categoryId: 'health', difficulty: 'easy', repeat: 'daily' },
  { title: '20분 걷기', categoryId: 'health', difficulty: 'normal', repeat: 'daily' },
  { title: '책 10페이지 읽기', categoryId: 'study', difficulty: 'easy', repeat: 'daily' },
  { title: '강의 1개 듣기', categoryId: 'study', difficulty: 'normal', repeat: 'weekday' },
  { title: '복습 노트 정리', categoryId: 'study', difficulty: 'normal', repeat: 'weekday' },
  { title: '명상 10분', categoryId: 'mindset', difficulty: 'easy', repeat: 'daily' },
  { title: '감사한 일 3개 쓰기', categoryId: 'mindset', difficulty: 'easy', repeat: 'daily' },
  { title: '잠들기 전 휴대폰 내려놓기', categoryId: 'mindset', difficulty: 'normal', repeat: 'daily' },
  { title: '가족에게 안부 묻기', categoryId: 'social', difficulty: 'easy', repeat: 'weekly' },
  { title: '친구에게 연락하기', categoryId: 'social', difficulty: 'easy', repeat: 'weekly' },
  { title: '칭찬 한마디 하기', categoryId: 'social', difficulty: 'easy', repeat: 'daily' },
  { title: '취미 20분 즐기기', categoryId: 'hobby', difficulty: 'easy', repeat: 'daily' },
  { title: '작은 작품 하나 만들기', categoryId: 'hobby', difficulty: 'hard', repeat: 'weekend' },
  { title: '새로운 것 하나 시도하기', categoryId: 'hobby', difficulty: 'normal', repeat: 'weekly' },
  { title: '오늘 지출 기록하기', categoryId: 'finance', difficulty: 'easy', repeat: 'daily' },
  { title: '구독 서비스 점검하기', categoryId: 'finance', difficulty: 'normal', repeat: 'weekly' },
  { title: '저축 목표 확인하기', categoryId: 'finance', difficulty: 'easy', repeat: 'weekly' },
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
