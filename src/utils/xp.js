export const XP_TABLE = {
  easy:   10,
  normal: 25,
  hard:   50,
}

export function xpForLevel(level) {
  return level * 100
}

export function levelFromTotalXp(totalXp) {
  return xpProgressInLevel(totalXp).level
}

export function xpProgressInLevel(totalXp) {
  let level = 1
  let accumulated = 0
  while (true) {
    const needed = xpForLevel(level)
    if (accumulated + needed > totalXp) {
      return {
        level,
        current: totalXp - accumulated,
        needed,
        percent: Math.round(((totalXp - accumulated) / needed) * 100),
      }
    }
    accumulated += needed
    level++
  }
}
