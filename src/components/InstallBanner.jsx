import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function InstallBanner() {
  const [prompt, setPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // 이미 설치됐거나 무시한 경우 표시 안함
    const dismissed = localStorage.getItem('quest_install_dismissed')
    if (dismissed || window.matchMedia('(display-mode: standalone)').matches) return

    const handler = (e) => {
      e.preventDefault()
      setPrompt(e)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      localStorage.setItem('quest_install_dismissed', 'true')
    }
    setVisible(false)
  }

  const handleDismiss = () => {
    localStorage.setItem('quest_install_dismissed', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '358px',
        background: '#2a2640',
        border: '2px solid #7fdbca',
        boxShadow: '4px 4px 0px #000',
        borderRadius: '12px',
        padding: '14px 16px',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animation: 'fadeInUp 0.3s ease',
      }}
    >
      {/* 아이콘 */}
      <div style={{ fontSize: '28px', flexShrink: 0 }}>⚔️</div>

      {/* 텍스트 */}
      <div className="flex-1 min-w-0">
        <div style={{ fontFamily: '"Noto Sans KR", sans-serif', fontSize: '13px', fontWeight: 700, color: '#f0ece8', marginBottom: '2px' }}>
          홈화면에 추가
        </div>
        <div style={{ fontFamily: '"Noto Sans KR", sans-serif', fontSize: '11px', color: '#8a8499', lineHeight: 1.4 }}>
          앱처럼 빠르게 접근하세요
        </div>
      </div>

      {/* 설치 버튼 */}
      <button
        onClick={handleInstall}
        style={{
          background: '#7fdbca',
          color: '#1e1a2e',
          border: '2px solid #000',
          boxShadow: '2px 2px 0 #000',
          borderRadius: '6px',
          fontFamily: '"Noto Sans KR", sans-serif',
          fontSize: '12px',
          fontWeight: 700,
          padding: '8px 14px',
          cursor: 'pointer',
          flexShrink: 0,
          minHeight: '36px',
        }}
      >
        추가
      </button>

      {/* 닫기 */}
      <button
        onClick={handleDismiss}
        style={{ color: '#8a8499', padding: '4px', flexShrink: 0 }}
        aria-label="배너 닫기"
      >
        <X size={16} />
      </button>
    </div>
  )
}
