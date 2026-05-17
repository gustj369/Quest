import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] 앱 오류:', error, info.componentStack)
  }

  handleReload() {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        style={{
          minHeight: '100dvh',
          background: '#1e1a2e',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          textAlign: 'center',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '48px', lineHeight: 1 }}>⚠️</div>

        <div
          style={{
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '11px',
            color: '#ff6b6b',
            lineHeight: 1.8,
          }}
        >
          GAME ERROR
        </div>

        <div
          style={{
            fontFamily: '"Noto Sans KR", sans-serif',
            fontSize: '14px',
            color: '#f0ece8',
            fontWeight: 700,
          }}
        >
          예상치 못한 오류가 발생했습니다
        </div>

        <div
          style={{
            fontFamily: '"Noto Sans KR", sans-serif',
            fontSize: '12px',
            color: '#8a8499',
            lineHeight: 1.6,
            maxWidth: '280px',
          }}
        >
          데이터는 안전하게 저장되어 있습니다.
          <br />
          앱을 다시 시작해주세요.
        </div>

        <button
          onClick={this.handleReload}
          style={{
            marginTop: '8px',
            padding: '14px 28px',
            background: '#7fdbca',
            color: '#1e1a2e',
            border: '2px solid #000',
            boxShadow: '3px 3px 0px #000',
            borderRadius: '8px',
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '9px',
            cursor: 'pointer',
            minHeight: '48px',
          }}
        >
          다시 시작
        </button>
      </div>
    )
  }
}
