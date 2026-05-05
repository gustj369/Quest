import { X } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * 공통 바텀시트 컴포넌트.
 * AnimatePresence는 포함하지 않으므로 호출부에서 감싸야 함.
 *
 * Props:
 *   title    — 헤더에 표시할 픽셀폰트 텍스트
 *   onClose  — 오버레이 클릭 및 X 버튼 핸들러
 *   children — 핸들/헤더 아래에 렌더링할 콘텐츠
 */
export default function BottomSheet({ title, onClose, children }) {
  return (
    <motion.div
      className="bottom-sheet-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bottom-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-3 pb-1">
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#3d3858' }} />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-3">
          <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '11px', color: '#f0ece8' }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              color: '#8a8499',
              padding: '8px',
              minHeight: '44px',
              minWidth: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </motion.div>
    </motion.div>
  )
}
