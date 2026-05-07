import { useState, useRef, useCallback, useEffect } from 'react'
import {
  loadQuests, saveQuests,
  loadCategories, saveCategories,
  loadLastReset, saveLastReset,
  loadHistory, saveHistory,
} from '../utils/storage.js'

import { DEFAULT_CATEGORIES, DEFAULT_QUESTS } from '../utils/defaults.js'
import { nanoid } from '../utils/nanoid.js'
import { todayKey, shouldResetToday } from '../utils/date.js'

export function useQuests() {
  const [quests, setQuests] = useState(() => {
    const stored = loadQuests()
    // 기본 퀘스트는 인덱스만큼 ms 차이를 두어 고유한 createdAt 보장
    return stored.length > 0
      ? stored
      : DEFAULT_QUESTS.map((q, i) => ({ ...q, createdAt: Date.now() + i }))
  })
  // setQuests 외부에서 현재 상태를 동기적으로 읽기 위한 ref
  const questsRef = useRef(quests)

  const [categories, setCategories] = useState(() => {
    return loadCategories() ?? [...DEFAULT_CATEGORIES]
  })
  const categoriesRef = useRef(categories)

  const [history, setHistory] = useState(() => loadHistory())
  const historyRef = useRef(history)

  // 자정 기준 repeat별 퀘스트 리셋
  useEffect(() => {
    const lastReset = loadLastReset()
    const today = todayKey()

    if (lastReset !== today) {
      const reset = questsRef.current.map((q) => {
        // repeat 설정에 따라 오늘 리셋 여부 결정
        if (shouldResetToday(q.repeat ?? 'daily', lastReset)) {
          return { ...q, completedToday: false }
        }
        return q
      })
      questsRef.current = reset
      setQuests(reset)
      saveQuests(reset)
      saveLastReset(today)
    }
  }, [])

  // 히스토리 저장
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
  }, [])

  const completeQuest = useCallback((id) => {
    // updater 밖에서 먼저 대상 찾기 — updater의 동기 실행을 가정하지 않음
    const target = questsRef.current.find((q) => q.id === id && !q.completedToday)
    if (!target) return null

    const updated = questsRef.current.map((q) =>
      q.id === id && !q.completedToday ? { ...q, completedToday: true } : q
    )
    questsRef.current = updated
    setQuests(updated)
    saveQuests(updated)
    // 실제로 완료 처리될 퀘스트가 확인된 후에만 히스토리 기록
    recordHistory(id)
    return target
  }, [recordHistory])

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
  }, [])

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
  }, [])

  const deleteQuest = useCallback((id) => {
    const updated = questsRef.current.filter((q) => q.id !== id)
    questsRef.current = updated
    setQuests(updated)
    saveQuests(updated)
  }, [])

  const addCategory = useCallback((data) => {
    const newCat = { id: nanoid(), ...data }
    const updated = [...categoriesRef.current, newCat]
    categoriesRef.current = updated
    setCategories(updated)
    saveCategories(updated)
  }, [])

  const deleteCategory = useCallback((catId) => {
    const updatedCategories = categoriesRef.current.filter((c) => c.id !== catId)
    categoriesRef.current = updatedCategories
    setCategories(updatedCategories)
    saveCategories(updatedCategories)

    // 해당 카테고리 퀘스트는 유지하되 categoryId를 null로
    const updatedQuests = questsRef.current.map((q) => q.categoryId === catId ? { ...q, categoryId: null } : q)
    questsRef.current = updatedQuests
    setQuests(updatedQuests)
    saveQuests(updatedQuests)
  }, [])

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
  }, [])

  return {
    quests,
    categories,
    history,
    completeQuest,
    addQuest,
    updateQuest,
    deleteQuest,
    addCategory,
    deleteCategory,
    resetAllData,
  }
}
