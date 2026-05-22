import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import {
  loadQuests, saveQuests,
  loadCategories, saveCategories,
  loadLastReset, saveLastReset,
  loadHistory, saveHistory,
  pruneHistory,
} from '../utils/storage.js'
import {
  fetchQuests, upsertQuests, upsertQuest, deleteQuestRemote,
  fetchCategories, upsertCategories, deleteCategoryRemote,
  fetchHistory, upsertHistoryDay, upsertAllHistory,
  fetchLastReset, upsertLastReset,
} from '../utils/sync.js'

import { DEFAULT_CATEGORIES, DEFAULT_QUESTS } from '../utils/defaults.js'
import { nanoid } from '../utils/nanoid.js'
import { todayKey, shouldResetToday, calculateStreak } from '../utils/date.js'

export function useQuests(user = null) {
  const userId = user?.id ?? null

  const [quests, setQuests] = useState(() => {
    const stored = loadQuests()
    return stored.length > 0
      ? stored
      : DEFAULT_QUESTS.map((q, i) => ({ ...q, id: nanoid(), completedToday: false, createdAt: Date.now() + i }))
  })
  const questsRef = useRef(quests)

  const [categories, setCategories] = useState(() => {
    return loadCategories() ?? [...DEFAULT_CATEGORIES]
  })
  const categoriesRef = useRef(categories)

  const [history, setHistory] = useState(() => {
    const raw = loadHistory()
    const pruned = pruneHistory(raw)
    if (Object.keys(pruned).length !== Object.keys(raw).length) saveHistory(pruned)
    return pruned
  })
  const historyRef = useRef(history)

  // ─── 로그인 시 Supabase에서 데이터 pull (초기 동기화) ───────────────────
  useEffect(() => {
    if (!userId) return

    let cancelled = false

    const syncFromCloud = async () => {
      try {
        const [cloudQuests, cloudCats, cloudHistory, cloudLastReset] = await Promise.all([
          fetchQuests(userId),
          fetchCategories(userId),
          fetchHistory(userId),
          fetchLastReset(userId),
        ])

        if (cancelled) return

        const isCloudEmpty = cloudQuests.length === 0 && cloudCats.length === 0

        if (isCloudEmpty) {
          // 클라우드가 비어있으면 로컬 → 클라우드로 업로드 (첫 로그인 마이그레이션)
          const localQuests = questsRef.current
          const localCats = categoriesRef.current
          const localHistory = historyRef.current
          const localLastReset = loadLastReset()

          await Promise.all([
            upsertQuests(userId, localQuests),
            upsertCategories(userId, localCats),
            upsertAllHistory(userId, localHistory),
            localLastReset ? upsertLastReset(userId, localLastReset) : Promise.resolve(),
          ])
        } else {
          // 클라우드 데이터를 로컬에 반영
          questsRef.current = cloudQuests
          setQuests(cloudQuests)
          saveQuests(cloudQuests)

          categoriesRef.current = cloudCats
          setCategories(cloudCats)
          saveCategories(cloudCats)

          const pruned = pruneHistory(cloudHistory)
          historyRef.current = pruned
          setHistory(pruned)
          saveHistory(pruned)

          if (cloudLastReset) saveLastReset(cloudLastReset)
        }
      } catch (err) {
        console.error('[Sync] 클라우드 동기화 실패 — 로컬 데이터 사용', err)
      }
    }

    syncFromCloud()
    return () => { cancelled = true }
  }, [userId])

  // ─── 자정 기준 repeat별 퀘스트 리셋 ───────────────────
  useEffect(() => {
    const lastReset = loadLastReset()
    const today = todayKey()

    if (lastReset !== today) {
      const reset = questsRef.current.map((q) => {
        if (shouldResetToday(q.repeat ?? 'daily', lastReset)) {
          return { ...q, completedToday: false }
        }
        return q
      })
      questsRef.current = reset
      setQuests(reset)
      saveQuests(reset)
      saveLastReset(today)
      if (userId) {
        upsertQuests(userId, reset).catch(console.error)
        upsertLastReset(userId, today).catch(console.error)
      }
    }
  }, [userId])

  // ─── 히스토리 기록 ───────────────────
  const recordHistory = useCallback((questId) => {
    const today = todayKey()
    const prev = historyRef.current
    const dayEntries = prev[today] ? [...prev[today]] : []
    if (!dayEntries.includes(questId)) {
      dayEntries.push(questId)
    }
    const updated = { ...prev, [today]: dayEntries }
    historyRef.current = updated
    setHistory(updated)
    saveHistory(updated)
    if (userId) {
      upsertHistoryDay(userId, today, dayEntries).catch(console.error)
    }
  }, [userId])

  const completeQuest = useCallback((id) => {
    const target = questsRef.current.find((q) => q.id === id && !q.completedToday)
    if (!target) return null

    const updated = questsRef.current.map((q) =>
      q.id === id && !q.completedToday ? { ...q, completedToday: true } : q
    )
    questsRef.current = updated
    setQuests(updated)
    saveQuests(updated)
    recordHistory(id)
    if (userId) {
      upsertQuest(userId, { ...target, completedToday: true }).catch(console.error)
    }
    return target
  }, [recordHistory, userId])

  const addQuest = useCallback((data) => {
    const newQuest = {
      id: nanoid(),
      title: data.title,
      categoryId: data.categoryId,
      difficulty: data.difficulty || 'normal',
      repeat: data.repeat || 'daily',
      completedToday: false,
      createdAt: Date.now(),
    }
    const updated = [...questsRef.current, newQuest]
    questsRef.current = updated
    setQuests(updated)
    saveQuests(updated)
    if (userId) {
      upsertQuest(userId, newQuest).catch(console.error)
    }
  }, [userId])

  const updateQuest = useCallback((id, data) => {
    const updated = questsRef.current.map((q) =>
      q.id === id
        ? {
            ...q,
            title: data.title,
            categoryId: data.categoryId,
            difficulty: data.difficulty || q.difficulty || 'normal',
            repeat: data.repeat || q.repeat || 'daily',
          }
        : q
    )
    questsRef.current = updated
    setQuests(updated)
    saveQuests(updated)
    if (userId) {
      const target = updated.find((q) => q.id === id)
      if (target) upsertQuest(userId, target).catch(console.error)
    }
  }, [userId])

  const deleteQuest = useCallback((id) => {
    const updated = questsRef.current.filter((q) => q.id !== id)
    questsRef.current = updated
    setQuests(updated)
    saveQuests(updated)
    if (userId) {
      deleteQuestRemote(id).catch(console.error)
    }
  }, [userId])

  const addCategory = useCallback((data) => {
    const newCat = { id: nanoid(), ...data }
    const updated = [...categoriesRef.current, newCat]
    categoriesRef.current = updated
    setCategories(updated)
    saveCategories(updated)
    if (userId) {
      upsertCategories(userId, [newCat]).catch(console.error)
    }
  }, [userId])

  const deleteCategory = useCallback((catId) => {
    const updatedCategories = categoriesRef.current.filter((c) => c.id !== catId)
    categoriesRef.current = updatedCategories
    setCategories(updatedCategories)
    saveCategories(updatedCategories)
    if (userId) {
      deleteCategoryRemote(catId).catch(console.error)
    }

    const updatedQuests = questsRef.current.map((q) => q.categoryId === catId ? { ...q, categoryId: null } : q)
    questsRef.current = updatedQuests
    setQuests(updatedQuests)
    saveQuests(updatedQuests)
    if (userId) {
      upsertQuests(userId, updatedQuests).catch(console.error)
    }
  }, [userId])

  const resetAllData = useCallback(() => {
    const fresh = DEFAULT_QUESTS.map((q, i) => ({ ...q, id: nanoid(), createdAt: Date.now() + i }))
    const freshCats = [...DEFAULT_CATEGORIES]
    questsRef.current = fresh
    categoriesRef.current = freshCats
    historyRef.current = {}
    setQuests(fresh)
    setCategories(freshCats)
    setHistory({})
    saveQuests(fresh)
    saveCategories(freshCats)
    saveLastReset(null)
    saveHistory({})
    // 클라우드는 리셋하지 않음 (로컬만 초기화) — 필요 시 추후 추가
  }, [])

  const streak = useMemo(() => calculateStreak(history), [history])

  return {
    quests,
    categories,
    history,
    streak,
    completeQuest,
    addQuest,
    updateQuest,
    deleteQuest,
    addCategory,
    deleteCategory,
    resetAllData,
  }
}
