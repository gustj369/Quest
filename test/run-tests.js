import assert from 'node:assert/strict'
import {
  normalizeCategories,
  normalizeCharacter,
  normalizeQuests,
} from '../src/utils/storage.js'
import { DEFAULT_CHARACTER } from '../src/utils/defaults.js'
import { formatDateKey, shouldResetToday } from '../src/utils/date.js'
import { levelFromTotalXp, xpProgressInLevel } from '../src/utils/xp.js'

function run(name, fn) {
  try {
    fn()
    console.log(`ok - ${name}`)
  } catch (error) {
    console.error(`not ok - ${name}`)
    throw error
  }
}

run('normalizeQuests keeps valid quests and fills safe defaults', () => {
  const quests = normalizeQuests([
    {
      id: 'q1',
      title: '  물 마시기  ',
      categoryId: '',
      difficulty: 'unknown',
      repeat: undefined,
      completedToday: 1,
      createdAt: Number.NaN,
    },
    { id: '', title: 'invalid' },
  ])

  assert.equal(quests.length, 1)
  assert.equal(quests[0].title, '물 마시기')
  assert.equal(quests[0].categoryId, null)
  assert.equal(quests[0].difficulty, 'normal')
  assert.equal(quests[0].repeat, 'daily')
  assert.equal(quests[0].completedToday, true)
  assert.equal(typeof quests[0].createdAt, 'number')
})

run('normalizeQuests preserves deleted-category null state', () => {
  const quests = normalizeQuests([
    {
      id: 'q-null',
      title: '카테고리 삭제 후 남은 퀘스트',
      categoryId: null,
      difficulty: 'hard',
      repeat: 'weekly',
      completedToday: false,
      createdAt: 123,
    },
  ])

  assert.equal(quests.length, 1)
  assert.equal(quests[0].categoryId, null)
  assert.equal(quests[0].difficulty, 'hard')
  assert.equal(quests[0].repeat, 'weekly')
})

run('normalizeQuests drops empty titles and non-object entries', () => {
  const quests = normalizeQuests([
    { id: 'empty-title', title: '   ', categoryId: 'health' },
    null,
    'not-a-quest',
    { id: 'valid', title: '정상 퀘스트', categoryId: 'health' },
  ])

  assert.equal(quests.length, 1)
  assert.equal(quests[0].id, 'valid')
})

run('normalizeCategories drops invalid categories and fills display defaults', () => {
  const categories = normalizeCategories([
    { id: 'health', name: ' 건강 ', emoji: '', color: '' },
    { id: 'bad', name: '' },
  ])

  assert.equal(categories.length, 1)
  assert.equal(categories[0].name, '건강')
  assert.equal(categories[0].emoji, '📂')
  assert.equal(categories[0].color, '#7fdbca')
})

run('normalizeCategories returns null for non-array values', () => {
  assert.equal(normalizeCategories({ id: 'bad', name: '잘못된 값' }), null)
  assert.equal(normalizeCategories(null), null)
})

run('normalizeCharacter clamps invalid progression values to defaults', () => {
  const character = normalizeCharacter({
    name: '  모험가  ',
    totalXp: -10,
    totalCompleted: Number.NaN,
    hardCompleted: 2,
    spriteId: '',
  }, DEFAULT_CHARACTER)

  assert.equal(character.name, '모험가')
  assert.equal(character.totalXp, DEFAULT_CHARACTER.totalXp)
  assert.equal(character.totalCompleted, DEFAULT_CHARACTER.totalCompleted)
  assert.equal(character.hardCompleted, 2)
  assert.equal(character.spriteId, DEFAULT_CHARACTER.spriteId)
})

run('normalizeCharacter rejects invalid hard completed counts', () => {
  const character = normalizeCharacter({
    totalXp: 120,
    totalCompleted: 3,
    hardCompleted: -1,
  }, DEFAULT_CHARACTER)

  assert.equal(character.totalXp, 120)
  assert.equal(character.totalCompleted, 3)
  assert.equal(character.hardCompleted, DEFAULT_CHARACTER.hardCompleted)
})

run('normalizeCharacter falls back for empty names and invalid completed counts', () => {
  const character = normalizeCharacter({
    name: '   ',
    totalXp: 40,
    totalCompleted: -2,
    hardCompleted: Number.POSITIVE_INFINITY,
    spriteId: 'mage',
  }, DEFAULT_CHARACTER)

  assert.equal(character.name, DEFAULT_CHARACTER.name)
  assert.equal(character.totalXp, 40)
  assert.equal(character.totalCompleted, DEFAULT_CHARACTER.totalCompleted)
  assert.equal(character.hardCompleted, DEFAULT_CHARACTER.hardCompleted)
  assert.equal(character.spriteId, 'mage')
})

run('xp helpers calculate level progress boundaries', () => {
  assert.equal(levelFromTotalXp(0), 1)
  assert.deepEqual(xpProgressInLevel(100), {
    level: 2,
    current: 0,
    needed: 200,
    percent: 0,
  })
  assert.deepEqual(xpProgressInLevel(250), {
    level: 2,
    current: 150,
    needed: 200,
    percent: 75,
  })
})

run('date helpers format date keys and skip same-day resets', () => {
  assert.equal(formatDateKey(new Date('2026-05-06T12:00:00')), '2026-05-06')
  const today = formatDateKey(new Date())
  assert.equal(shouldResetToday('daily', today), false)
})
