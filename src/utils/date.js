/**
 * YYYY-MM-DD 형식의 오늘 날짜 키 반환
 */
export function todayKey() {
  const d = new Date()
  return formatDateKey(d)
}

/**
 * Date 객체를 YYYY-MM-DD 문자열로 변환
 */
export function formatDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * 오늘 요일 반환 (0=일, 1=월 ... 6=토)
 */
export function todayDow() {
  return new Date().getDay()
}

/**
 * 특정 repeat 설정이 오늘 리셋되어야 하는지 확인
 * @param {'daily'|'weekday'|'weekend'|'weekly'} repeat
 * @param {string|null} lastResetDate - 마지막 리셋일 (YYYY-MM-DD)
 */
export function shouldResetToday(repeat, lastResetDate = null) {
  const dow = todayDow() // 0=일, 1=월 ... 6=토
  const today = todayKey()
  if (lastResetDate === today) return false

  switch (repeat) {
    case 'daily':
      return true
    case 'weekday':
      return dow >= 1 && dow <= 5  // 월~금
    case 'weekend':
      return dow === 0 || dow === 6 // 일, 토
    case 'weekly':
      return dow === 1             // 매주 월요일
    default:
      return true
  }
}
