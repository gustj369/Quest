import { useState, useCallback, useEffect, useRef } from 'react'
import { loadCharacter, saveCharacter, loadBadges, saveBadges, normalizeCharacter } from '../utils/storage.js'
import { DEFAULT_CHARACTER, ALL_BADGES } from '../utils/defaults.js'
import { xpProgressInLevel, XP_TABLE } from '../utils/xp.js'

export function useCharacter() {
  const [character, setCharacter] = useState(() => {
    const stored = loadCharacter()
    return normalizeCharacter(stored, DEFAULT_CHARACTER) ?? { ...DEFAULT_CHARACTER }
  })
  const characterRef = useRef(character)
  const [earnedBadgeIds, setEarnedBadgeIds] = useState(() => loadBadges())
  const earnedBadgeIdsRef = useRef(earnedBadgeIds)
  const [levelUpInfo, setLevelUpInfo] = useState(null) // { newLevel }
  const levelUpTimerRef = useRef(null)

  const xpInfo = xpProgressInLevel(character.totalXp)
  const level = xpInfo.level

  const clearLevelUpTimer = useCallback(() => {
    if (levelUpTimerRef.current) {
      clearTimeout(levelUpTimerRef.current)
      levelUpTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return clearLevelUpTimer
  }, [clearLevelUpTimer])

  // 퀘스트 완료 보상은 이 함수 하나로만 처리해 XP/완료 수 중복 반영을 방지
  const completeQuestEffect = useCallback((difficulty) => {
    const gain = XP_TABLE[difficulty] ?? 10
    const prev = characterRef.current
    const oldLevel = xpProgressInLevel(prev.totalXp).level
    const newTotalXp = prev.totalXp + gain
    const newLevel = xpProgressInLevel(newTotalXp).level
    const updated = {
      ...prev,
      totalXp: newTotalXp,
      totalCompleted: prev.totalCompleted + 1,
      hardCompleted: difficulty === 'hard'
        ? prev.hardCompleted + 1
        : prev.hardCompleted,
    }
    characterRef.current = updated
    setCharacter(updated)
    saveCharacter(updated)
    if (newLevel > oldLevel) {
      clearLevelUpTimer()
      levelUpTimerRef.current = setTimeout(() => {
        setLevelUpInfo({ newLevel })
        levelUpTimerRef.current = null
      }, 50)
    }
  }, [clearLevelUpTimer])

  const updateName = useCallback((newName) => {
    const updated = { ...characterRef.current, name: newName }
    characterRef.current = updated
    setCharacter(updated)
    saveCharacter(updated)
  }, [])

  const resetCharacter = useCallback(() => {
    clearLevelUpTimer()
    const fresh = { ...DEFAULT_CHARACTER }
    characterRef.current = fresh
    earnedBadgeIdsRef.current = []
    setCharacter(fresh)
    setLevelUpInfo(null)
    setEarnedBadgeIds([])
    saveCharacter(fresh)
    saveBadges([])
  }, [clearLevelUpTimer])

  const checkBadges = useCallback((char, lvl, streak = 0) => {
    const current = earnedBadgeIdsRef.current
    const newIds = []
    ALL_BADGES.forEach((badge) => {
      if (!current.includes(badge.id) && badge.condition(char, lvl, streak)) {
        newIds.push(badge.id)
      }
    })
    if (newIds.length === 0) return
    const merged = [...current, ...newIds]
    earnedBadgeIdsRef.current = merged
    setEarnedBadgeIds(merged)
    saveBadges(merged)
  }, [])

  const dismissLevelUp = useCallback(() => {
    clearLevelUpTimer()
    setLevelUpInfo(null)
  }, [clearLevelUpTimer])

  return {
    character,
    level,
    xpInfo,
    earnedBadgeIds,
    levelUpInfo,
    completeQuestEffect,
    updateName,
    resetCharacter,
    checkBadges,
    dismissLevelUp,
  }
}
