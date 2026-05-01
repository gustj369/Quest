import { useState, useCallback, useEffect, useRef } from 'react'
import { loadCharacter, saveCharacter, loadBadges, saveBadges } from '../utils/storage.js'
import { DEFAULT_CHARACTER, ALL_BADGES } from '../utils/defaults.js'
import { levelFromTotalXp, xpProgressInLevel, XP_TABLE } from '../utils/xp.js'

export function useCharacter() {
  const [character, setCharacter] = useState(() => {
    const stored = loadCharacter()
    return stored ? { ...DEFAULT_CHARACTER, ...stored } : { ...DEFAULT_CHARACTER }
  })
  const characterRef = useRef(character)
  const [earnedBadgeIds, setEarnedBadgeIds] = useState(() => loadBadges())
  const earnedBadgeIdsRef = useRef(earnedBadgeIds)
  const [levelUpInfo, setLevelUpInfo] = useState(null) // { newLevel }
  const levelUpTimerRef = useRef(null)

  const level = levelFromTotalXp(character.totalXp)
  const xpInfo = xpProgressInLevel(character.totalXp)

  const clearLevelUpTimer = useCallback(() => {
    if (levelUpTimerRef.current) {
      clearTimeout(levelUpTimerRef.current)
      levelUpTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return clearLevelUpTimer
  }, [clearLevelUpTimer])

  const addXp = useCallback((difficulty) => {
    const gain = XP_TABLE[difficulty] ?? 10
    const prev = characterRef.current
    const oldLevel = levelFromTotalXp(prev.totalXp)
    const newTotalXp = prev.totalXp + gain
    const newLevel = levelFromTotalXp(newTotalXp)
    const updated = {
      ...prev,
      totalXp: newTotalXp,
      hardCompleted: difficulty === 'hard'
        ? (prev.hardCompleted || 0) + 1
        : (prev.hardCompleted || 0),
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

  const incrementCompleted = useCallback(() => {
    const prev = characterRef.current
    const updated = { ...prev, totalCompleted: (prev.totalCompleted || 0) + 1 }
    characterRef.current = updated
    setCharacter(updated)
    saveCharacter(updated)
  }, [])

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

  const checkBadges = useCallback((char, lvl) => {
    const current = earnedBadgeIdsRef.current
    const newIds = []
    ALL_BADGES.forEach((badge) => {
      if (!current.includes(badge.id) && badge.condition(char, lvl)) {
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
    addXp,
    incrementCompleted,
    updateName,
    resetCharacter,
    checkBadges,
    dismissLevelUp,
  }
}
