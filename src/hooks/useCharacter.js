import { useState, useCallback } from 'react'
import { loadCharacter, saveCharacter, loadBadges, saveBadges } from '../utils/storage.js'
import { DEFAULT_CHARACTER, ALL_BADGES } from '../utils/defaults.js'
import { levelFromTotalXp, xpProgressInLevel, XP_TABLE } from '../utils/xp.js'

export function useCharacter() {
  const [character, setCharacter] = useState(() => {
    const stored = loadCharacter()
    return stored ? { ...DEFAULT_CHARACTER, ...stored } : { ...DEFAULT_CHARACTER }
  })
  const [earnedBadgeIds, setEarnedBadgeIds] = useState(() => loadBadges())
  const [levelUpInfo, setLevelUpInfo] = useState(null) // { newLevel }

  const level = levelFromTotalXp(character.totalXp)
  const xpInfo = xpProgressInLevel(character.totalXp)

  const addXp = useCallback((difficulty) => {
    const gain = XP_TABLE[difficulty] ?? 10
    setCharacter((prev) => {
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
      saveCharacter(updated)
      if (newLevel > oldLevel) {
        setTimeout(() => setLevelUpInfo({ newLevel }), 50)
      }
      return updated
    })
  }, [])

  const incrementCompleted = useCallback(() => {
    setCharacter((prev) => {
      const updated = { ...prev, totalCompleted: (prev.totalCompleted || 0) + 1 }
      saveCharacter(updated)
      return updated
    })
  }, [])

  const updateName = useCallback((newName) => {
    setCharacter((prev) => {
      const updated = { ...prev, name: newName }
      saveCharacter(updated)
      return updated
    })
  }, [])

  const resetCharacter = useCallback(() => {
    const fresh = { ...DEFAULT_CHARACTER }
    setCharacter(fresh)
    setEarnedBadgeIds([])
    saveCharacter(fresh)
    saveBadges([])
  }, [])

  const checkBadges = useCallback((char, lvl) => {
    setEarnedBadgeIds((prev) => {
      const newIds = []
      ALL_BADGES.forEach((badge) => {
        if (!prev.includes(badge.id) && badge.condition(char, lvl)) {
          newIds.push(badge.id)
        }
      })
      if (newIds.length === 0) return prev
      const merged = [...prev, ...newIds]
      saveBadges(merged)
      return merged
    })
  }, [])

  const dismissLevelUp = useCallback(() => setLevelUpInfo(null), [])

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
