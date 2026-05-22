import { Settings } from 'lucide-react'
import CharacterSprite from './CharacterSprite.jsx'

export default function Header({ level, onSettings }) {
  return (
    <header className="flex items-center gap-3 px-5 pt-5 pb-3">
      {/* 캐릭터 스프라이트 */}
      <div className="relative">
        <CharacterSprite size={48} level={level} animate />
        {/* 레벨 뱃지 */}
        <div
          className="absolute -bottom-1 -right-1 px-1"
          style={{
            background: '#f5c542',
            border: '1px solid #000',
            boxShadow: '1px 1px 0 #000',
            borderRadius: '3px',
            fontSize: '9px',
            fontFamily: '"Noto Sans KR", sans-serif',
            fontWeight: 900,
            color: '#1e1a2e',
            lineHeight: 1,
            padding: '2px 4px',
            whiteSpace: 'nowrap',
          }}
        >
          Lv.{level}
        </div>
      </div>

      {/* 타이틀 영역 */}
      <div className="flex-1 min-w-0">
        <div
          style={{
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '12px',
            color: '#f0ece8',
            letterSpacing: '-0.5px',
          }}
        >
          QUEST
        </div>
        <div style={{ fontSize: '12px', color: '#8a8499', marginTop: '2px', fontFamily: '"Noto Sans KR", sans-serif' }}>
          오늘의 모험
        </div>
      </div>

      {/* 설정 아이콘 */}
      <button
        onClick={onSettings}
        style={{ color: '#8a8499', padding: '8px', minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        aria-label="설정"
      >
        <Settings size={20} />
      </button>
    </header>
  )
}
