import { useEffect } from 'react'
import { motion } from 'framer-motion'
import CharacterSprite from './CharacterSprite.jsx'

export default function LevelUpModal({ newLevel, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className="levelup-overlay" onClick={onDismiss}>
      <motion.div
        initial={{ scale: 0, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        style={{
          position: 'relative',
          background: '#2a2640',
          border: '3px solid #f5c542',
          boxShadow: '6px 6px 0px #000, 0 0 40px rgba(245,197,66,0.4)',
          borderRadius: '16px',
          padding: '40px 48px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 골드 파티클 */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((i / 8) * Math.PI * 2) * 80,
                y: Math.sin((i / 8) * Math.PI * 2) * 80,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                background: '#f5c542',
                borderRadius: '2px',
                imageRendering: 'pixelated',
              }}
            />
          ))}
        </div>

        {/* LEVEL UP 텍스트 */}
        <div
          style={{
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '18px',
            color: '#f5c542',
            textShadow: '2px 2px 0 #000, 0 0 20px rgba(245,197,66,0.6)',
            lineHeight: 1.3,
          }}
        >
          LEVEL UP!
        </div>

        {/* 캐릭터 */}
        <div className="pop-in">
          <CharacterSprite size={64} level={newLevel} />
        </div>

        {/* 새 레벨 */}
        <div
          style={{
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '28px',
            color: '#f0ece8',
            textShadow: '3px 3px 0 #000',
          }}
        >
          Lv. {newLevel}
        </div>

        {/* 서브 텍스트 */}
        <div style={{ fontFamily: '"Noto Sans KR", sans-serif', fontSize: '14px', color: '#8a8499' }}>
          탭하여 계속
        </div>
      </motion.div>
    </div>
  )
}
