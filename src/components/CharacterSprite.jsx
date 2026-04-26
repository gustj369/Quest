// 캐릭터 픽셀 스프라이트 — CSS로 구현
export default function CharacterSprite({ size = 48, level = 1, animate = false }) {
  // 레벨에 따라 색상 변화
  const bodyColor = level >= 10 ? '#f5c542' : level >= 5 ? '#a78bfa' : '#7fdbca'
  const armorColor = level >= 10 ? '#d4a90e' : level >= 5 ? '#7c5fc4' : '#5ab8a4'
  const scale = size / 16

  return (
    <div
      style={{ width: size, height: size, imageRendering: 'pixelated', flexShrink: 0 }}
      className={animate ? 'bounce-pixel' : ''}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated', transform: `scale(${scale})`, transformOrigin: 'top left', display: 'block' }}
      >
        {/* 헬멧 */}
        <rect x="5" y="1" width="6" height="1" fill={armorColor}/>
        <rect x="4" y="2" width="8" height="3" fill={armorColor}/>
        {/* 얼굴 */}
        <rect x="5" y="5" width="6" height="3" fill="#f5c8a0"/>
        {/* 눈 */}
        <rect x="6" y="6" width="1" height="1" fill="#1e1a2e"/>
        <rect x="9" y="6" width="1" height="1" fill="#1e1a2e"/>
        {/* 헬멧 바이저 */}
        <rect x="4" y="5" width="1" height="1" fill={armorColor}/>
        <rect x="11" y="5" width="1" height="1" fill={armorColor}/>
        {/* 몸통 */}
        <rect x="4" y="8" width="8" height="5" fill={bodyColor}/>
        {/* 어깨판 */}
        <rect x="3" y="8" width="2" height="2" fill={armorColor}/>
        <rect x="11" y="8" width="2" height="2" fill={armorColor}/>
        {/* 팔 */}
        <rect x="2" y="9" width="2" height="3" fill={bodyColor}/>
        <rect x="12" y="9" width="2" height="3" fill={bodyColor}/>
        {/* 검 */}
        <rect x="13" y="7" width="1" height="5" fill="#c0c0c0"/>
        <rect x="12" y="8" width="3" height="1" fill="#c0c0c0"/>
        <rect x="13" y="12" width="1" height="1" fill="#a78bfa"/>
        {/* 다리 */}
        <rect x="5" y="13" width="2" height="2" fill={armorColor}/>
        <rect x="9" y="13" width="2" height="2" fill={armorColor}/>
        {/* 부츠 */}
        <rect x="5" y="15" width="2" height="1" fill="#1e1a2e"/>
        <rect x="9" y="15" width="2" height="1" fill="#1e1a2e"/>
        {/* 복장 장식 */}
        <rect x="7" y="9" width="2" height="3" fill={armorColor} opacity="0.6"/>
        {/* 하이라이트 */}
        <rect x="5" y="2" width="1" height="1" fill="#fff" opacity="0.3"/>
      </svg>
    </div>
  )
}
