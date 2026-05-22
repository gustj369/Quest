import { supabase } from './supabase.js'

// ─── 퀘스트 ────────────────────────────────────────────────
export async function fetchQuests(userId) {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data.map(dbToQuest)
}

export async function upsertQuest(userId, quest) {
  const { error } = await supabase
    .from('quests')
    .upsert({ ...questToDb(quest), user_id: userId }, { onConflict: 'id' })
  if (error) throw error
}

export async function upsertQuests(userId, quests) {
  if (quests.length === 0) return
  const { error } = await supabase
    .from('quests')
    .upsert(quests.map((q) => ({ ...questToDb(q), user_id: userId })), { onConflict: 'id' })
  if (error) throw error
}

export async function deleteQuestRemote(questId) {
  const { error } = await supabase.from('quests').delete().eq('id', questId)
  if (error) throw error
}

// ─── 카테고리 ────────────────────────────────────────────────
export async function fetchCategories(userId) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return data.map(dbToCategory)
}

export async function upsertCategories(userId, categories) {
  if (categories.length === 0) return
  const { error } = await supabase
    .from('categories')
    .upsert(categories.map((c) => ({ ...categoryToDb(c), user_id: userId })), { onConflict: 'id' })
  if (error) throw error
}

export async function deleteCategoryRemote(catId) {
  const { error } = await supabase.from('categories').delete().eq('id', catId)
  if (error) throw error
}

// ─── 캐릭터 ────────────────────────────────────────────────
export async function fetchCharacter(userId) {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
  return data ? dbToCharacter(data) : null
}

export async function upsertCharacter(userId, character) {
  const { error } = await supabase
    .from('characters')
    .upsert({ ...characterToDb(character), user_id: userId }, { onConflict: 'user_id' })
  if (error) throw error
}

// ─── 히스토리 ────────────────────────────────────────────────
export async function fetchHistory(userId) {
  const { data, error } = await supabase
    .from('history')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  // { date: quest_ids[] } 형태로 변환
  const result = {}
  data.forEach((row) => { result[row.date] = row.quest_ids })
  return result
}

export async function upsertHistoryDay(userId, date, questIds) {
  const { error } = await supabase
    .from('history')
    .upsert({ user_id: userId, date, quest_ids: questIds }, { onConflict: 'user_id,date' })
  if (error) throw error
}

export async function upsertAllHistory(userId, history) {
  const rows = Object.entries(history).map(([date, quest_ids]) => ({
    user_id: userId,
    date,
    quest_ids,
  }))
  if (rows.length === 0) return
  const { error } = await supabase
    .from('history')
    .upsert(rows, { onConflict: 'user_id,date' })
  if (error) throw error
}

// ─── user_meta (last_reset) ────────────────────────────────────────────────
export async function fetchLastReset(userId) {
  const { data, error } = await supabase
    .from('user_meta')
    .select('last_reset')
    .eq('user_id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data?.last_reset ?? null
}

export async function upsertLastReset(userId, date) {
  const { error } = await supabase
    .from('user_meta')
    .upsert({ user_id: userId, last_reset: date }, { onConflict: 'user_id' })
  if (error) throw error
}

// ─── 변환 함수 ────────────────────────────────────────────────
function questToDb(q) {
  return {
    id: q.id,
    title: q.title,
    category_id: q.categoryId ?? null,
    difficulty: q.difficulty,
    repeat: q.repeat,
    completed_today: q.completedToday,
    created_at: q.createdAt,
  }
}

function dbToQuest(row) {
  return {
    id: row.id,
    title: row.title,
    categoryId: row.category_id,
    difficulty: row.difficulty,
    repeat: row.repeat,
    completedToday: row.completed_today,
    createdAt: row.created_at,
  }
}

function categoryToDb(c) {
  return { id: c.id, name: c.name, emoji: c.emoji, color: c.color }
}

function dbToCategory(row) {
  return { id: row.id, name: row.name, emoji: row.emoji, color: row.color }
}

function characterToDb(c) {
  return {
    name: c.name,
    total_xp: c.totalXp,
    total_completed: c.totalCompleted,
    hard_completed: c.hardCompleted,
    sprite_id: c.spriteId ?? 'warrior',
  }
}

function dbToCharacter(row) {
  return {
    name: row.name,
    totalXp: row.total_xp,
    totalCompleted: row.total_completed,
    hardCompleted: row.hard_completed,
    spriteId: row.sprite_id,
  }
}
