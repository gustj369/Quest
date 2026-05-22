export const XP_TABLE = {
  easy:   10,
  normal: 25,
  hard:   50,
}

export function xpForLevel(level) {
  return level * 100
}


export function xpProgressInLevel(totalXp) {
  const safeXp = Number.isFinite(totalXp) && totalXp >= 0 ? totalXp : 0
  let level = 1
  let accumulated = 0
  while (true) {
    if (level > 9999) return { level, current: 0, needed: 0, remaining: 0, percent: 0 }
    const needed = xpForLevel(level)
    if (accumulated + needed > safeXp) {
      const current = safeXp - accumulated
      return {
        level,
        current,
        needed,
        remaining: needed - current,
        percent: Math.round((current / needed) * 100),
      }
    }
    accumulated += needed
    level++
  }
}
