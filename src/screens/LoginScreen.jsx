import { useState } from 'react'
import { supabase } from '../utils/supabase.js'
import CharacterSprite from '../components/CharacterSprite.jsx'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSend = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
      },
    })
    setLoading(false)
    if (error) {
      setError('이메일 전송에 실패했습니다. 다시 시도해주세요.')
    } else {
      setSent(true)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        padding: '32px 24px',
        background: '#1e1a2e',
        maxWidth: '390px',
        margin: '0 auto',
      }}
    >
      {/* 로고/스프라이트 */}
      <div style={{ marginBottom: '16px' }}>
        <CharacterSprite size={80} level={1} animate />
      </div>

      <div
        style={{
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '16px',
          color: '#7fdbca',
          marginBottom: '8px',
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        QUEST
      </div>
      <div
        style={{
          fontFamily: '"Noto Sans KR", sans-serif',
          fontSize: '13px',
          color: '#8a8499',
          marginBottom: '48px',
          textAlign: 'center',
        }}
      >
        매일의 습관을 모험으로
      </div>

      {!sent ? (
        <form onSubmit={handleSend} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label
              style={{
                fontFamily: '"Noto Sans KR", sans-serif',
                fontSize: '12px',
                color: '#8a8499',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              이메일 주소
            </label>
            <input
              className="pixel-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>

          {error && (
            <div
              style={{
                fontFamily: '"Noto Sans KR", sans-serif',
                fontSize: '12px',
                color: '#ff6b6b',
                padding: '10px 14px',
                background: '#ff6b6b18',
                border: '1px solid #ff6b6b44',
                borderRadius: '8px',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            style={{
              width: '100%',
              padding: '16px',
              marginTop: '4px',
              background: email.trim() && !loading ? '#7fdbca' : '#2a2640',
              color: email.trim() && !loading ? '#1e1a2e' : '#3d3858',
              border: `2px solid ${email.trim() && !loading ? '#000' : '#3d3858'}`,
              boxShadow: email.trim() && !loading ? '3px 3px 0px #000' : 'none',
              borderRadius: '8px',
              fontFamily: '"Noto Sans KR", sans-serif',
              fontWeight: 800,
              fontSize: '14px',
              cursor: email.trim() && !loading ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
              minHeight: '52px',
            }}
          >
            {loading ? '전송 중...' : '로그인 링크 받기'}
          </button>

          <p
            style={{
              fontFamily: '"Noto Sans KR", sans-serif',
              fontSize: '11px',
              color: '#8a8499',
              textAlign: 'center',
              lineHeight: 1.6,
              marginTop: '4px',
            }}
          >
            이메일로 로그인 링크를 보내드립니다.<br />
            비밀번호가 필요 없어요.
          </p>
        </form>
      ) : (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📬</div>
          <div
            style={{
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '11px',
              color: '#7fdbca',
              marginBottom: '12px',
              lineHeight: 1.8,
            }}
          >
            메일을 확인하세요!
          </div>
          <div
            style={{
              fontFamily: '"Noto Sans KR", sans-serif',
              fontSize: '13px',
              color: '#8a8499',
              lineHeight: 1.7,
              marginBottom: '32px',
            }}
          >
            <span style={{ color: '#f0ece8', fontWeight: 700 }}>{email}</span>으로<br />
            로그인 링크를 보냈습니다.<br />
            링크를 클릭하면 자동으로 로그인됩니다.
          </div>
          <button
            type="button"
            onClick={() => { setSent(false); setEmail('') }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#8a8499',
              fontFamily: '"Noto Sans KR", sans-serif',
              fontSize: '12px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            다른 이메일로 재시도
          </button>
        </div>
      )}
    </div>
  )
}
