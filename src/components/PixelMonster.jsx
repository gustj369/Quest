// 카테고리별 픽셀 몬스터 — 순수 CSS/SVG로 구현
const MONSTERS = {
  health: {
    label: '슬라임',
    svg: (
      <svg width="32" height="32" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{imageRendering:'pixelated'}}>
        <rect x="2" y="3" width="4" height="3" fill="#7fdbca"/>
        <rect x="1" y="4" width="6" height="2" fill="#7fdbca"/>
        <rect x="2" y="6" width="1" height="1" fill="#5ab8a4"/>
        <rect x="5" y="6" width="1" height="1" fill="#5ab8a4"/>
        <rect x="3" y="6" width="2" height="1" fill="#7fdbca"/>
        {/* 눈 */}
        <rect x="3" y="4" width="1" height="1" fill="#1e1a2e"/>
        <rect x="5" y="4" width="1" height="1" fill="#1e1a2e"/>
        {/* 하이라이트 */}
        <rect x="3" y="4" width="1" height="1" fill="#fff" opacity="0.4"/>
      </svg>
    ),
  },
  study: {
    label: '부엉이',
    svg: (
      <svg width="32" height="32" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{imageRendering:'pixelated'}}>
        <rect x="2" y="1" width="4" height="5" fill="#a78bfa"/>
        <rect x="1" y="2" width="6" height="3" fill="#a78bfa"/>
        {/* 귀 */}
        <rect x="2" y="1" width="1" height="1" fill="#7c5fc4"/>
        <rect x="5" y="1" width="1" height="1" fill="#7c5fc4"/>
        {/* 눈 */}
        <rect x="2" y="3" width="2" height="2" fill="#f5c542"/>
        <rect x="4" y="3" width="2" height="2" fill="#f5c542"/>
        <rect x="3" y="3" width="1" height="1" fill="#1e1a2e"/>
        <rect x="5" y="3" width="1" height="1" fill="#1e1a2e"/>
        {/* 부리 */}
        <rect x="3" y="5" width="2" height="1" fill="#f5c542"/>
        {/* 날개 */}
        <rect x="1" y="3" width="1" height="2" fill="#7c5fc4"/>
        <rect x="6" y="3" width="1" height="2" fill="#7c5fc4"/>
        {/* 발 */}
        <rect x="2" y="6" width="1" height="1" fill="#f5c542"/>
        <rect x="5" y="6" width="1" height="1" fill="#f5c542"/>
      </svg>
    ),
  },
  mindset: {
    label: '요정',
    svg: (
      <svg width="32" height="32" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{imageRendering:'pixelated'}}>
        {/* 몸 */}
        <rect x="3" y="3" width="2" height="3" fill="#f5c542"/>
        {/* 머리 */}
        <rect x="2" y="1" width="4" height="3" fill="#f5c542"/>
        {/* 눈 */}
        <rect x="3" y="2" width="1" height="1" fill="#1e1a2e"/>
        <rect x="5" y="2" width="1" height="1" fill="#1e1a2e"/>
        {/* 날개 */}
        <rect x="1" y="2" width="2" height="2" fill="#a78bfa" opacity="0.8"/>
        <rect x="5" y="2" width="2" height="2" fill="#a78bfa" opacity="0.8"/>
        {/* 광채 */}
        <rect x="1" y="1" width="1" height="1" fill="#fff" opacity="0.6"/>
        <rect x="6" y="1" width="1" height="1" fill="#fff" opacity="0.6"/>
        <rect x="7" y="3" width="1" height="1" fill="#fff" opacity="0.4"/>
      </svg>
    ),
  },
  social: {
    label: '토끼',
    svg: (
      <svg width="32" height="32" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{imageRendering:'pixelated'}}>
        {/* 귀 */}
        <rect x="2" y="0" width="1" height="3" fill="#ff9f7f"/>
        <rect x="5" y="0" width="1" height="3" fill="#ff9f7f"/>
        <rect x="2" y="0" width="1" height="2" fill="#ffccc0" opacity="0.7"/>
        <rect x="5" y="0" width="1" height="2" fill="#ffccc0" opacity="0.7"/>
        {/* 머리 */}
        <rect x="1" y="2" width="6" height="4" fill="#ff9f7f"/>
        {/* 눈 */}
        <rect x="2" y="3" width="1" height="1" fill="#1e1a2e"/>
        <rect x="5" y="3" width="1" height="1" fill="#1e1a2e"/>
        {/* 볼 */}
        <rect x="2" y="4" width="1" height="1" fill="#ffcccc" opacity="0.8"/>
        <rect x="5" y="4" width="1" height="1" fill="#ffcccc" opacity="0.8"/>
        {/* 코·입 */}
        <rect x="4" y="4" width="1" height="1" fill="#ff6b6b"/>
        <rect x="3" y="5" width="1" height="1" fill="#ff6b6b" opacity="0.5"/>
        <rect x="5" y="5" width="1" height="1" fill="#ff6b6b" opacity="0.5"/>
      </svg>
    ),
  },
  hobby: {
    label: '드래곤',
    svg: (
      <svg width="32" height="32" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{imageRendering:'pixelated'}}>
        {/* 뿔 */}
        <rect x="2" y="0" width="1" height="2" fill="#ff6b6b"/>
        <rect x="5" y="0" width="1" height="2" fill="#ff6b6b"/>
        {/* 몸 */}
        <rect x="1" y="2" width="6" height="4" fill="#6bdfff"/>
        {/* 날개 흔적 */}
        <rect x="0" y="2" width="2" height="2" fill="#5bb8cc" opacity="0.7"/>
        <rect x="6" y="2" width="2" height="2" fill="#5bb8cc" opacity="0.7"/>
        {/* 눈 */}
        <rect x="2" y="3" width="1" height="1" fill="#f5c542"/>
        <rect x="5" y="3" width="1" height="1" fill="#f5c542"/>
        <rect x="2" y="3" width="1" height="1" fill="#1e1a2e" opacity="0.7"/>
        <rect x="5" y="3" width="1" height="1" fill="#1e1a2e" opacity="0.7"/>
        {/* 불꽃 */}
        <rect x="3" y="5" width="3" height="1" fill="#ff6b6b"/>
        <rect x="4" y="6" width="2" height="1" fill="#f5c542"/>
        {/* 비늘 */}
        <rect x="2" y="4" width="1" height="1" fill="#5bb8cc"/>
        <rect x="4" y="4" width="1" height="1" fill="#5bb8cc"/>
      </svg>
    ),
  },
  finance: {
    label: '금화',
    svg: (
      <svg width="32" height="32" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{imageRendering:'pixelated'}}>
        {/* 동전 */}
        <rect x="2" y="1" width="4" height="6" fill="#f5c542"/>
        <rect x="1" y="2" width="6" height="4" fill="#f5c542"/>
        {/* 테두리 */}
        <rect x="2" y="1" width="4" height="1" fill="#d4a90e"/>
        <rect x="2" y="6" width="4" height="1" fill="#d4a90e"/>
        <rect x="1" y="2" width="1" height="4" fill="#d4a90e"/>
        <rect x="6" y="2" width="1" height="4" fill="#d4a90e"/>
        {/* ₩ 심볼 */}
        <rect x="3" y="3" width="1" height="2" fill="#d4a90e"/>
        <rect x="5" y="3" width="1" height="2" fill="#d4a90e"/>
        <rect x="3" y="4" width="3" height="1" fill="#d4a90e"/>
        {/* 광택 */}
        <rect x="3" y="2" width="1" height="1" fill="#fff" opacity="0.4"/>
      </svg>
    ),
  },
  default: {
    label: '고블린',
    svg: (
      <svg width="32" height="32" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{imageRendering:'pixelated'}}>
        {/* 귀 */}
        <rect x="0" y="3" width="2" height="1" fill="#6bff9c"/>
        <rect x="6" y="3" width="2" height="1" fill="#6bff9c"/>
        {/* 머리 */}
        <rect x="1" y="1" width="6" height="5" fill="#6bff9c"/>
        {/* 눈 */}
        <rect x="2" y="2" width="2" height="2" fill="#ff6b6b"/>
        <rect x="5" y="2" width="2" height="2" fill="#ff6b6b"/>
        <rect x="3" y="2" width="1" height="1" fill="#1e1a2e"/>
        <rect x="6" y="2" width="1" height="1" fill="#1e1a2e"/>
        {/* 코 */}
        <rect x="3" y="4" width="2" height="1" fill="#4dcc7a"/>
        {/* 이빨 */}
        <rect x="2" y="5" width="1" height="1" fill="#fff"/>
        <rect x="5" y="5" width="1" height="1" fill="#fff"/>
        <rect x="3" y="5" width="2" height="1" fill="#4dcc7a"/>
      </svg>
    ),
  },
}

export default function PixelMonster({ categoryId, size = 32, animate = false }) {
  const monster = MONSTERS[categoryId] ?? MONSTERS.default

  return (
    <div
      className={animate ? 'pixel-hit' : ''}
      style={{ width: size, height: size, imageRendering: 'pixelated', flexShrink: 0 }}
      title={monster.label}
    >
      <div style={{ transform: `scale(${size / 32})`, transformOrigin: 'top left' }}>
        {monster.svg}
      </div>
    </div>
  )
}
