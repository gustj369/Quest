// 캐릭터 픽셀 스프라이트 — 티어별 장비 성장
// Tier 1(1-4): 기본 전사  Tier 2(5-9): +방패
// Tier 3(10-19): +헬멧 날개·금검  Tier 4(20+): +왕관·전설의 검
export default function CharacterSprite({ size = 48, level = 1, animate = false }) {
  const tier = level >= 20 ? 4 : level >= 10 ? 3 : level >= 5 ? 2 : 1

  // 레벨 구간별 색상 — CharacterScreen rankTitle 4단계와 동기화
  const bodyColor  = tier === 4 ? '#ff6b6b' : tier === 3 ? '#f5c542' : tier === 2 ? '#a78bfa' : '#7fdbca'
  const armorColor = tier === 4 ? '#cc3333' : tier === 3 ? '#d4a90e' : tier === 2 ? '#7c5fc4' : '#5ab8a4'
  // 검 색상: 은→은→금→전설주황
  const swordColor = tier >= 4 ? '#ff9f7f' : tier >= 3 ? '#f5c542' : '#c0c0c0'
  // 검 보석 색상
  const gemColor   = tier >= 4 ? '#ff6b6b' : tier >= 3 ? '#f5c542' : '#a78bfa'

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
        {/* ── Tier 4: 왕관 (헬멧 위) ── */}
        {tier >= 4 && (
          <>
            <rect x="5"  y="0" width="1" height="1" fill={armorColor}/>
            <rect x="7"  y="0" width="2" height="1" fill={armorColor}/>
            <rect x="10" y="0" width="1" height="1" fill={armorColor}/>
          </>
        )}

        {/* ── 헬멧 ── */}
        <rect x="5" y="1" width="6" height="1" fill={armorColor}/>
        <rect x="4" y="2" width="8" height="3" fill={armorColor}/>

        {/* ── Tier 3+: 헬멧 날개 ── */}
        {tier >= 3 && (
          <>
            <rect x="3"  y="3" width="1" height="2" fill={armorColor}/>
            <rect x="12" y="3" width="1" height="2" fill={armorColor}/>
          </>
        )}

        {/* ── 얼굴 ── */}
        <rect x="5" y="5" width="6" height="3" fill="#f5c8a0"/>
        {/* 눈 */}
        <rect x="6" y="6" width="1" height="1" fill="#1e1a2e"/>
        <rect x="9" y="6" width="1" height="1" fill="#1e1a2e"/>
        {/* 헬멧 바이저 */}
        <rect x="4"  y="5" width="1" height="1" fill={armorColor}/>
        <rect x="11" y="5" width="1" height="1" fill={armorColor}/>

        {/* ── 몸통 ── */}
        <rect x="4" y="8" width="8" height="5" fill={bodyColor}/>
        {/* 어깨판 */}
        <rect x="3"  y="8" width="2" height="2" fill={armorColor}/>
        <rect x="11" y="8" width="2" height="2" fill={armorColor}/>
        {/* 팔 */}
        <rect x="2"  y="9" width="2" height="3" fill={bodyColor}/>
        <rect x="12" y="9" width="2" height="3" fill={bodyColor}/>
        {/* 복장 장식 */}
        <rect x="7" y="9" width="2" height="3" fill={armorColor} opacity="0.6"/>
        {/* 하이라이트 */}
        <rect x="5" y="2" width="1" height="1" fill="#fff" opacity="0.3"/>

        {/* ── Tier 2+: 방패 (왼팔 앞) ── */}
        {tier >= 2 && (
          <>
            <rect x="0" y="9"  width="2" height="3" fill={armorColor}/>
            <rect x="0" y="12" width="1" height="1" fill={armorColor}/>
          </>
        )}

        {/* ── 검 ── */}
        {tier >= 4 ? (
          // 전설: 2픽셀 두꺼운 전설의 검
          <>
            <rect x="12" y="7"  width="2" height="5" fill={swordColor}/>
            <rect x="11" y="8"  width="4" height="1" fill={swordColor}/>
            <rect x="12" y="12" width="2" height="1" fill={gemColor}/>
          </>
        ) : (
          // 일반: 1픽셀 검
          <>
            <rect x="13" y="7"  width="1" height="5" fill={swordColor}/>
            <rect x="12" y="8"  width="3" height="1" fill={swordColor}/>
            <rect x="13" y="12" width="1" height="1" fill={gemColor}/>
          </>
        )}

        {/* ── 다리 ── */}
        <rect x="5" y="13" width="2" height="2" fill={armorColor}/>
        <rect x="9" y="13" width="2" height="2" fill={armorColor}/>
        {/* 부츠 */}
        <rect x="5" y="15" width="2" height="1" fill="#1e1a2e"/>
        <rect x="9" y="15" width="2" height="1" fill="#1e1a2e"/>
      </svg>
    </div>
  )
}
