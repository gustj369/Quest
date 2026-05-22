import { useState, useCallback, useEffect, useRef } from 'react'
import { loadCharacter, saveCharacter, loadBadges, saveBadges, normalizeCharacter } from '../utils/storage.js'
import { DEFAULT_CHARACTER, ALL_BADGES } from '../utils/defaults.js'
import { xpProgressInLevel, XP_TABLE } from '../utils/xp.js'
import { fetchCharacter, upsertCharacter } from '../utils/sync.js'

export function useCharacter(user = null) {
  const userId = user?.id ?? null

  const [character, setCharacter] = useState(() => {
    const stored = loadCharacter()
    return normalizeCharacter(stored, DEFAULT_CHARACTER) ?? { ...DEFAULT_CHARACTER }
  })
  const characterRef = useRef(character)
  const [earnedBadgeIds, setEarnedBadgeIds] = useState(() => loadBadges())
  const earnedBadgeIdsRef = useRef(earnedBadgeIds)
  const [levelUpInfo, setLevelUpInfo] = useState(null)
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

  // ─── 로그인 시 캐릭터 클라우드 동기화 ───────────────────
  useEffect(() => {
    if (!userId) return

    let cancelled = false

    const syncCharacter = async () => {
      try {
        const cloudChar = await fetchCharacter(userId)
        if (cancelled) return

        if (!cloudChar) {
          // 클라우드에 없으면 로컬 → 클라우드 업로드
          await upsertCharacter(userId, characterRef.current)
        } else {
          // 클라우드 우선 — 로컬에 반영
          characterRef.current = cloudChar
          setCharacter(cloudChar)
          saveCharacter(cloudChar)
        }
      } catch (err) {
        console.error('[Sync] 캐릭터 동기화 실패', err)
      }
    }

    syncCharacter()
    return () => { cancelled = true }
  }, [userId])

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
    if (userId) {
      upsertCharacter(userId, updated).catch(console.error)
    }
    if (newLevel > oldLevel) {
      clearLevelUpTimer()
      levelUpTimerRef.current = setTimeout(() => {
        setLevelUpInfo({ newLevel })
        levelUpTimerRef.current = null
      }, 50)
    }
  }, [clearLevelUpTimer, userId])

  const updateName = useCallback((newName) => {
    const updated = { ...characterRef.current, name: newName }
    characterRef.current = updated
    setCharacter(updated)
    saveCharacter(updated)
    if (userId) {
      upsertCharacter(userId, updated).catch(console.error)
    }
  }, [userId])

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
