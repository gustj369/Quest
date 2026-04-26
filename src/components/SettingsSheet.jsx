import { useState } from 'react'
import { X, RotateCcw, User, Bell, BellOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SettingsSheet({ character, onClose, onNameChange, onReset }) {
  const [name, setName] = useState(character.name || '용사')
  const [confirmReset, setConfirmReset] = useState(false)
  const [notifEnabled, setNotifEnabled] = useState(
    () => localStorage.getItem('quest_notif_enabled') !== 'false'
  )

  const handleNameSave = () => {
    const trimmed = name.trim() || '용사'
    onNameChange(trimmed)
    // 저장 확인 피드백 없이 닫기
    onClose()
  }

  const handleReset = () => {
    if (confirmReset) {
      onReset()
      onClose()
    } else {
      setConfirmReset(true)
      // 3초 후 확인 상태 리셋
      setTimeout(() => setConfirmReset(false), 3000)
    }
  }

  const toggleNotif = async () => {
    if (!notifEnabled) {
      // Notification API가 없는 환경(iOS 구형, 일부 브라우저) 방어
      if (typeof Notification === 'undefined') {
        alert('이 기기는 푸시 알림을 지원하지 않습니다.')
        return
      }
      const perm = await Notification.requestPermission().catch(() => 'denied')
      if (perm === 'granted') {
        setNotifEnabled(true)
        localStorage.setItem('quest_notif_enabled', 'true')
      }
    } else {
      setNotifEnabled(false)
      localStorage.setItem('quest_notif_enabled', 'false')
    }
  }

  return (
    <AnimatePresence>
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
              SETTINGS
            </span>
            <button
              onClick={onClose}
              style={{ color: '#8a8499', padding: '8px', minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-5 pb-8" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {/* 캐릭터 이름 */}
            <div
              style={{
                background: '#1e1a2e',
                borderRadius: '12px',
                border: '1px solid #3d3858',
                padding: '16px',
                marginBottom: '12px',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <User size={16} color="#7fdbca" />
                <span style={{ fontSize: '13px', fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 700, color: '#f0ece8' }}>
                  캐릭터 이름
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  className="pixel-input flex-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={10}
                  placeholder="이름 입력"
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                />
                <button
                  onClick={handleNameSave}
                  disabled={!name.trim()}
                  style={{
                    padding: '0 20px',
                    background: name.trim() ? '#7fdbca' : '#2a2640',
                    color: name.trim() ? '#1e1a2e' : '#3d3858',
                    border: `2px solid ${name.trim() ? '#000' : '#3d3858'}`,
                    boxShadow: name.trim() ? '2px 2px 0px #000' : 'none',
                    borderRadius: '8px',
                    fontFamily: '"Noto Sans KR", sans-serif',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: name.trim() ? 'pointer' : 'not-allowed',
                    minHeight: '48px',
                    flexShrink: 0,
                  }}
                >
                  저장
                </button>
              </div>
            </div>

            {/* 알림 설정 */}
            <div
              style={{
                background: '#1e1a2e',
                borderRadius: '12px',
                border: '1px solid #3d3858',
                padding: '16px',
                marginBottom: '12px',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {notifEnabled ? <Bell size={16} color="#7fdbca" /> : <BellOff size={16} color="#8a8499" />}
                  <div>
                    <div style={{ fontSize: '13px', fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 700, color: '#f0ece8' }}>
                      푸시 알림
                    </div>
                    <div style={{ fontSize: '11px', color: '#8a8499', fontFamily: '"Noto Sans KR"', marginTop: '2px' }}>
                      퀘스트 리마인더
                    </div>
                  </div>
                </div>
                {/* 토글 스위치 */}
                <button
                  onClick={toggleNotif}
                  style={{
                    width: '52px',
                    height: '28px',
                    borderRadius: '14px',
                    background: notifEnabled ? '#7fdbca' : '#3d3858',
                    border: '2px solid #000',
                    boxShadow: '2px 2px 0 #000',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: notifEnabled ? '24px' : '2px',
                      width: '20px',
                      height: '20px',
                      background: '#fff',
                      borderRadius: '10px',
                      transition: 'left 0.2s',
                      boxShadow: '1px 1px 0 #000',
                    }}
                  />
                </button>
              </div>
            </div>

            {/* 데이터 초기화 */}
            <div
              style={{
                background: '#1e1a2e',
                borderRadius: '12px',
                border: `1px solid ${confirmReset ? '#ff6b6b' : '#3d3858'}`,
                padding: '16px',
                transition: 'border-color 0.2s',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <RotateCcw size={16} color={confirmReset ? '#ff6b6b' : '#8a8499'} />
                <div>
                  <div style={{ fontSize: '13px', fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 700, color: confirmReset ? '#ff6b6b' : '#f0ece8' }}>
                    데이터 초기화
                  </div>
                  <div style={{ fontSize: '11px', color: '#8a8499', fontFamily: '"Noto Sans KR"', marginTop: '2px' }}>
                    모든 퀘스트·레벨·기록이 삭제됩니다
                  </div>
                </div>
              </div>
              <button
                onClick={handleReset}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: confirmReset ? '#ff6b6b22' : 'transparent',
                  color: confirmReset ? '#ff6b6b' : '#8a8499',
                  border: `2px solid ${confirmReset ? '#ff6b6b' : '#3d3858'}`,
                  boxShadow: confirmReset ? '2px 2px 0px #000' : 'none',
                  borderRadius: '8px',
                  fontFamily: '"Noto Sans KR", sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  minHeight: '44px',
                  transition: 'all 0.2s',
                }}
              >
                {confirmReset ? '⚠️ 한 번 더 탭하면 초기화됩니다' : '초기화'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
