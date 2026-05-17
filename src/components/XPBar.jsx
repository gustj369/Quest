import { useCallback, useRef, useLayoutEffect } from 'react'

export default function XPBar({ xpInfo, level }) {
  const fillRef = useRef(null)
  const timeoutRef = useRef(null)
  const frameRefs = useRef([])
  // 이전 percent 값 추적 (애니메이션 방향 결정)
  const prevPercent = useRef(xpInfo.percent)
  // 이전 레벨 추적 — from > 90 휴리스틱 대신 레벨 변화로 레벨업 정확 감지
  const prevLevelRef = useRef(level)

  const clearAnimationCallbacks = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    frameRefs.current.forEach(cancelAnimationFrame)
    frameRefs.current = []
  }, [])

  // useLayoutEffect: 페인트 전에 실행 → 0% 깜박임 없음
  useLayoutEffect(() => {
    const el = fillRef.current
    if (!el) return

    clearAnimationCallbacks()

    const from = prevPercent.current
    const to = xpInfo.percent
    const leveledUp = level > prevLevelRef.current

    // percent도 동일하고 레벨업도 없으면 아무것도 안 함
    if (from === to && !leveledUp) {
      el.style.transition = 'none'
      el.style.width = `${to}%`
      prevLevelRef.current = level
      return
    }

    if (leveledUp) {
      // 레벨업: 현재 바를 100%까지 채운 뒤 0에서 새 percent까지 재시작
      el.style.transition = 'width 0.4s ease'
      el.style.width = '100%'
      timeoutRef.current = setTimeout(() => {
        el.style.transition = 'none'
        el.style.width = '0%'
        const firstFrame = requestAnimationFrame(() => {
          const secondFrame = requestAnimationFrame(() => {
            el.style.transition = 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            el.style.width = `${to}%`
          })
          frameRefs.current = [secondFrame]
        })
        frameRefs.current = [firstFrame]
        timeoutRef.current = null
      }, 420)
    } else {
      el.style.transition = 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      el.style.width = `${to}%`
    }

    prevPercent.current = to
    prevLevelRef.current = level
    return clearAnimationCallbacks
  }, [xpInfo.percent, level, clearAnimationCallbacks])

  return (
    <div className="px-5 pb-4">
      <div className="flex justify-between items-center mb-2">
        <span style={{ fontSize: '10px', fontFamily: '"Press Start 2P", cursive', color: '#f5c542' }}>
          EXP
        </span>
        <span style={{ fontSize: '11px', fontFamily: '"Noto Sans KR", sans-serif', color: '#8a8499' }}>
          {xpInfo.current} / {xpInfo.needed} XP
        </span>
      </div>

      <div className="xp-bar-track">
        <div
          ref={fillRef}
          className="xp-bar-fill"
          style={{ width: `${xpInfo.percent}%`, transition: 'none' }}
        />
      </div>

      <div className="mt-1 text-right" style={{ fontSize: '11px', color: '#8a8499', fontFamily: '"Noto Sans KR", sans-serif' }}>
        Lv.{level + 1}까지 {xpInfo.remaining} XP
      </div>
    </div>
  )
}
