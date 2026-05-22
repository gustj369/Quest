import { LocalNotifications } from '@capacitor/local-notifications'

const NOTIFICATION_ID = 1001 // 매일 리마인더 고정 ID

/**
 * 로컬 알림 권한을 요청한다.
 * @returns {Promise<boolean>} 권한 허용 여부
 */
export async function requestNotificationPermission() {
  try {
    const { display } = await LocalNotifications.requestPermissions()
    return display === 'granted'
  } catch (e) {
    console.error('[Notifications] 권한 요청 실패', e)
    return false
  }
}

/**
 * 현재 알림 권한 상태를 반환한다.
 * @returns {Promise<'granted'|'denied'|'prompt'>}
 */
export async function checkNotificationPermission() {
  try {
    const { display } = await LocalNotifications.checkPermissions()
    return display
  } catch {
    return 'denied'
  }
}

/**
 * 매일 지정 시간에 리마인더 알림을 등록한다.
 * 기존 등록된 알림은 먼저 취소 후 재등록한다.
 * @param {number} hour   - 시 (0~23)
 * @param {number} minute - 분 (0~59)
 */
export async function scheduleDailyReminder(hour, minute) {
  try {
    // 기존 알림 먼저 취소
    await cancelAllReminders()

    // 오늘 기준으로 다음 발송 시각 계산
    const now = new Date()
    const next = new Date(now)
    next.setHours(hour, minute, 0, 0)
    // 이미 지난 시각이면 내일로
    if (next <= now) {
      next.setDate(next.getDate() + 1)
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: NOTIFICATION_ID,
          title: '⚔️ Quest',
          body: '오늘의 퀘스트가 기다리고 있어요!',
          schedule: {
            at: next,
            every: 'day',      // 매일 반복
            allowWhileIdle: true, // Doze 모드에서도 발송
          },
          actionTypeId: '',
          extra: null,
        },
      ],
    })

    console.log(`[Notifications] 매일 ${hour}:${String(minute).padStart(2, '0')} 알림 등록 완료`)
    return true
  } catch (e) {
    console.error('[Notifications] 알림 등록 실패', e)
    return false
  }
}

/**
 * 등록된 모든 리마인더 알림을 취소한다.
 */
export async function cancelAllReminders() {
  try {
    const { notifications } = await LocalNotifications.getPending()
    if (notifications.length > 0) {
      await LocalNotifications.cancel({ notifications })
    }
  } catch (e) {
    console.error('[Notifications] 알림 취소 실패', e)
  }
}

/**
 * "HH:MM" 형식의 시간 문자열을 { hour, minute } 객체로 파싱한다.
 * @param {string} timeStr - 예: "09:00"
 * @returns {{ hour: number, minute: number }}
 */
export function parseTimeString(timeStr) {
  const [h, m] = (timeStr ?? '09:00').split(':').map(Number)
  const hour   = Number.isFinite(h) && h >= 0 && h <= 23 ? h : 9
  const minute = Number.isFinite(m) && m >= 0 && m <= 59 ? m : 0
  return { hour, minute }
}
