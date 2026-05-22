import { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw, User, Bell, BellOff } from 'lucide-react'
import BottomSheet from './BottomSheet.jsx'
import {
  loadNotificationEnabled,
  saveNotificationEnabled,
  loadNotificationTime,
  saveNotificationTime,
} from '../utils/storage.js'
import {
  requestNotificationPermission,
  checkNotificationPermission,
  scheduleDailyReminder,
  cancelAllReminders,
  parseTimeString,
} from '../utils/notifications.js'

export default function SettingsSheet({ character, user, onClose, onNameChange, onReset, onSignOut }) {
  const [name, setName] = useState(character.name || '용사')
  const [confirmReset, setConfirmReset] = useState(false)
  const [unsupportedMsg, setUnsupportedMsg] = useState(null)
  const unsupportedTimerRef = useRef(null)
  const [notifEnabled, setNotifEnabled] = useState(() => loadNotificationEnabled())
  const [notifTime, setNotifTime] = useState(() => loadNotificationTime())
  const [notifStatus, setNotifStatus] = useState('idle') // 'idle'|'loading'|'error'
  const resetTimerRef = useRef(null)

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current)
      resetTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return clearResetTimer
  }, [clearResetTimer])

  useEffect(() => {
    return () => {
      if (unsupportedTimerRef.current) clearTimeout(unsupportedTimerRef.current)
    }
  }, [])

  const handleNameSave = () => {
    const trimmed = name.trim() || '용사'
    onNameChange(trimmed)
    // 저장 확인 피드백 없이 닫기
    onClose()
  }

  const handleReset = () => {
    if (confirmReset) {
      clearResetTimer()
      onReset()
      onClose()
    } else {
      setConfirmReset(true)
      // 3초 후 확인 상태 리셋
      clearResetTimer()
      resetTimerRef.current = setTimeout(() => {
        setConfirmReset(false)
        resetTimerRef.current = null
      }, 3000)
    }
  }

  const toggleNotif = async () => {
    if (notifEnabled) {
      // 알림 끄기
      await cancelAllReminders()
      setNotifEnabled(false)
      saveNotificationEnabled(false)
      return
    }

    // 알림 켜기 — 권한 요청 후 스케줄 등록
    setNotifStatus('loading')
    const permission = await checkNotificationPermission()
    const granted = permission === 'granted'
      ? true
      : await requestNotificationPermission()

    if (!granted) {
      setNotifStatus('error')
      setUnsupportedMsg('알림 권한이 거부되었습니다. 기기 설정에서 Quest 알림을 허용해주세요.')
      if (unsupportedTimerRef.current) clearTimeout(unsupportedTimerRef.current)
      unsupportedTimerRef.current = setTimeout(() => {
        setUnsupportedMsg(null)
        unsupportedTimerRef.current = null
      }, 4000)
      setNotifStatus('idle')
      return
    }

    const { hour, minute } = parseTimeString(notifTime)
    const ok = await scheduleDailyReminder(hour, minute)
    if (ok) {
      setNotifEnabled(true)
      saveNotificationEnabled(true)
    } else {
      setUnsupportedMsg('알림 등록에 실패했습니다. 다시 시도해주세요.')
      if (unsupportedTimerRef.current) clearTimeout(unsupportedTimerRef.current)
      unsupportedTimerRef.current = setTimeout(() => {
        setUnsupportedMsg(null)
        unsupportedTimerRef.current = null
      }, 3000)
    }
    setNotifStatus('idle')
  }

  const handleNotifTimeChange = async (e) => {
    const next = e.target.value || '09:00'
    setNotifTime(next)
    saveNotificationTime(next)
    // 알림이 켜져 있으면 새 시간으로 즉시 재등록
    if (notifEnabled) {
      const { hour, minute } = parseTimeString(next)
      await scheduleDailyReminder(hour, minute)
    }
  }

  return (
    <BottomSheet title="SETTINGS" onClose={onClose}>
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
                    <div style={{ fontSize: '11px', color: notifEnabled ? '#7fdbca' : '#8a8499', fontFamily: '"Noto Sans KR"', marginTop: '2px' }}>
                      {notifEnabled ? `매일 ${notifTime}에 리마인더 발송 중` : '탭해서 매일 리마인더를 켜세요'}
                    </div>
                  </div>
                </div>
                {/* 토글 스위치 */}
                <button
                  onClick={toggleNotif}
                  disabled={notifStatus === 'loading'}
                  style={{
                    width: '52px',
                    height: '28px',
                    borderRadius: '14px',
                    background: notifEnabled ? '#7fdbca' : '#3d3858',
                    border: '2px solid #000',
                    boxShadow: '2px 2px 0 #000',
                    cursor: notifStatus === 'loading' ? 'wait' : 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s',
                    flexShrink: 0,
                    opacity: notifStatus === 'loading' ? 0.6 : 1,
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
              {unsupportedMsg && (
                <div style={{ marginTop: '10px', fontSize: '11px', color: '#ff6b6b', fontFamily: '"Noto Sans KR", sans-serif', lineHeight: 1.5 }}>
                  ⚠️ {unsupportedMsg}
                </div>
              )}
              <div style={{ marginTop: '14px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#8a8499', fontFamily: '"Noto Sans KR", sans-serif' }}>
                  알림 시간
                </label>
                <input
                  className="pixel-input"
                  type="time"
                  value={notifTime}
                  onChange={handleNotifTimeChange}
                  disabled={!notifEnabled}
                />
                {notifEnabled && (
                  <div style={{ marginTop: '6px', fontSize: '11px', color: '#7fdbca88', fontFamily: '"Noto Sans KR", sans-serif', lineHeight: 1.5 }}>
                    시간을 바꾸면 즉시 재등록됩니다
                  </div>
                )}
              </div>
            </div>

            {/* 계정 정보 / 로그아웃 */}
            {user && (
              <div
                style={{
                  background: '#1e1a2e',
                  borderRadius: '12px',
                  border: '1px solid #3d3858',
                  padding: '16px',
                }}
              >
                <div style={{ fontSize: '12px', color: '#8a8499', fontFamily: '"Noto Sans KR", sans-serif', marginBottom: '10px' }}>
                  로그인 계정
                </div>
                <div style={{ fontSize: '13px', color: '#f0ece8', fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 600, marginBottom: '14px', wordBreak: 'break-all' }}>
                  {user.email}
                </div>
                <button
                  onClick={onSignOut}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    color: '#8a8499',
                    border: '2px solid #3d3858',
                    borderRadius: '8px',
                    fontFamily: '"Noto Sans KR", sans-serif',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    minHeight: '44px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#f0ece8'; e.currentTarget.style.borderColor = '#f0ece8' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#8a8499'; e.currentTarget.style.borderColor = '#3d3858' }}
                >
                  로그아웃
                </button>
              </div>
            )}

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
    </BottomSheet>
  )
}
