import { useRef, useLayoutEffect } from 'react'

export default function XPBar({ xpInfo, level }) {
  const fillRef = useRef(null)
  // 이전 percent 값 추적 (애니메이션 방향 결정)
  const prevPercent = useRef(xpInfo.percent)

  // useLayoutEffect: 페인트 전에 실행 → 0% 깜박임 없음
  useLayoutEffect(() => {
    const el = fillRef.current
    if (!el) return

    const from = prevPercent.current
    const to = xpInfo.percent

    if (from === to) {
      el.style.transition = 'none'
      el.style.width = `${to}%`
      return
    }

    // 레벨업으로 인한 오버플로우 처리 (100% → 다음 레벨 시작값)
    if (to < from && from > 90) {
      // 레벨업: 100%까지 채운 다음 0에서 다시 시작
      el.style.transition = 'width 0.4s ease'
      el.style.width = '100%'
      setTimeout(() => {
        el.style.transition = 'none'
        el.style.width = '0%'
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.transition = 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            el.style.width = `${to}%`
          })
        })
      }, 420)
    } else {
      el.style.transition = 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      el.style.width = `${to}%`
    }

    prevPercent.current = to
  }, [xpInfo.percent])

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
        Lv.{level + 1}까지 {xpInfo.needed - xpInfo.current} XP
      </div>
    </div>
  )
}
