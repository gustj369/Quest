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
    return stored.length > 0 ? stored : [...DEFAULT_QUESTS]
  })
  // setQuests 외부에서 현재 상태를 동기적으로 읽기 위한 ref
  const questsRef = useRef(quests)

  const [categories, setCategories] = useState(() => {
    return loadCategories() ?? [...DEFAULT_CATEGORIES]
  })

  // 자정 기준 repeat별 퀘스트 리셋
  useEffect(() => {
    const lastReset = loadLastReset()
    const today = todayKey()

    if (lastReset !== today) {
      setQuests((prev) => {
        const reset = prev.map((q) => {
          // repeat 설정에 따라 오늘 리셋 여부 결정
          if (shouldResetToday(q.repeat ?? 'daily', lastReset)) {
            return { ...q, completedToday: false }
          }
          return q
        })
        saveQuests(reset)
        questsRef.current = reset
        return reset
      })
      saveLastReset(today)
    }
  }, [])

  // 히스토리 저장
  const recordHistory = useCallback((questId) => {
    const today = todayKey()
    const history = loadHistory()
    if (!history[today]) history[today] = []
    if (!history[today].includes(questId)) history[today].push(questId)
    saveHistory(history)
  }, [])

  const completeQuest = useCallback((id) => {
    // updater 밖에서 먼저 대상 찾기 — updater의 동기 실행을 가정하지 않음
    const target = questsRef.current.find((q) => q.id === id && !q.completedToday)
    if (!target) return null

    setQuests((prev) => {
      const updated = prev.map((q) =>
        q.id === id && !q.completedToday ? { ...q, completedToday: true } : q
      )
      saveQuests(updated)
      questsRef.current = updated
      return updated
    })
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
    setQuests((prev) => {
      const updated = [...prev, newQuest]
      saveQuests(updated)
      questsRef.current = updated
      return updated
    })
  }, [])

  const deleteQuest = useCallback((id) => {
    setQuests((prev) => {
      const updated = prev.filter((q) => q.id !== id)
      saveQuests(updated)
      questsRef.current = updated
      return updated
    })
  }, [])

  const addCategory = useCallback((data) => {
    const newCat = { id: nanoid(), ...data }
    setCategories((prev) => {
      const updated = [...prev, newCat]
      saveCategories(updated)
      return updated
    })
  }, [])

  const deleteCategory = useCallback((catId) => {
    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== catId)
      saveCategories(updated)
      return updated
    })
    // 해당 카테고리 퀘스트는 유지하되 categoryId를 null로
    setQuests((prev) => {
      const updated = prev.map((q) => q.categoryId === catId ? { ...q, categoryId: null } : q)
      saveQuests(updated)
      questsRef.current = updated
      return updated
    })
  }, [])

  const resetAllData = useCallback(() => {
    const fresh = [...DEFAULT_QUESTS.map(q => ({ ...q, id: nanoid() }))]
    const freshCats = [...DEFAULT_CATEGORIES]
    questsRef.current = fresh
    setQuests(fresh)
    setCategories(freshCats)
    saveQuests(fresh)
    saveCategories(freshCats)
    saveLastReset(null)
    saveHistory({})
  }, [])

  return {
    quests,
    categories,
    completeQuest,
    addQuest,
    deleteQuest,
    addCategory,
    deleteCategory,
    resetAllData,
  }
}
