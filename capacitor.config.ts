import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.gustj.quest',
  appName: 'Quest',
  webDir: 'dist',
  server: {
    // https 스킴 사용 — localStorage, crypto 등 브라우저 API 정상 동작 보장
    androidScheme: 'https',
  },
  android: {
    // 상태바 색상을 앱 배경과 통일
    backgroundColor: '#1e1a2e',
  },
}

export default config
