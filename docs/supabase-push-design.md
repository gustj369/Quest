# Supabase Push Notification Design

Quest에서 실제 푸시 알림을 연결할 때 사용할 v2 설계 초안입니다.
현재 MVP는 알림 권한, ON/OFF, 알림 시간 저장까지만 담당합니다.

## 1. 목표

- 사용자가 설정한 알림 시간에 퀘스트 리마인더를 보냅니다.
- 앱이 닫혀 있어도 가능한 범위에서 알림을 받을 수 있게 합니다.
- 모바일 PWA 환경의 차이를 사용자에게 명확히 안내합니다.

## 2. 권장 방향

초기 구현은 **Supabase + Edge Function + Web Push 구독 저장**을 권장합니다.

- localStorage에는 사용자 UI 설정만 유지합니다.
- Supabase에는 서버가 푸시를 보낼 때 필요한 구독 정보와 알림 시간을 저장합니다.
- 실제 발송은 예약 실행되는 Edge Function 또는 외부 스케줄러가 담당합니다.

## 3. 데이터 모델 초안

### `notification_preferences`

| 컬럼 | 예시 | 설명 |
|------|------|------|
| `id` | uuid | 설정 row ID |
| `user_id` | uuid / null | 로그인 도입 전에는 null 가능 |
| `device_id` | text | 로그인 전 기기 단위 식별자 |
| `enabled` | true | 사용자가 알림을 켰는지 |
| `time` | 09:00 | 사용자가 선택한 알림 시간 |
| `timezone` | Asia/Seoul | 로컬 시간 계산 기준 |
| `created_at` | timestamp | 생성 시각 |
| `updated_at` | timestamp | 수정 시각 |

### `push_subscriptions`

| 컬럼 | 예시 | 설명 |
|------|------|------|
| `id` | uuid | 구독 row ID |
| `user_id` | uuid / null | 로그인 도입 전에는 null 가능 |
| `device_id` | text | 기기 단위 연결 키 |
| `endpoint` | text | Web Push endpoint |
| `p256dh` | text | Web Push 공개 키 |
| `auth` | text | Web Push auth secret |
| `user_agent` | text | 브라우저/기기 디버깅용 |
| `created_at` | timestamp | 생성 시각 |
| `last_seen_at` | timestamp | 마지막 갱신 시각 |

## 4. 클라이언트 흐름

1. 사용자가 설정 화면에서 알림을 켭니다.
2. 브라우저 알림 권한을 요청합니다.
3. 서비스워커 등록 상태를 확인합니다.
4. PushManager로 구독을 생성합니다.
5. 구독 정보와 알림 시간을 Supabase에 저장합니다.
6. 사용자가 알림을 끄면 `enabled=false`로 바꾸고, 필요하면 구독도 해제합니다.

## 5. 서버 발송 흐름

1. 스케줄러가 5분 또는 10분 단위로 Edge Function을 호출합니다.
2. 현재 시간과 각 사용자의 `timezone`, `time`을 비교합니다.
3. `enabled=true`인 구독에만 Web Push를 발송합니다.
4. 만료되었거나 실패한 구독은 비활성화하거나 삭제 후보로 표시합니다.

## 6. 주의 사항

- iOS PWA는 설치 여부와 브라우저 버전에 따라 푸시 지원이 달라질 수 있습니다.
- Android Chrome은 비교적 안정적이지만 배터리 최적화 영향을 받을 수 있습니다.
- 로그인 도입 전에는 기기 단위 알림으로 시작하고, Supabase Auth 도입 후 사용자 단위로 확장합니다.
- VAPID 키는 클라이언트 공개 키와 서버 비밀 키를 분리해서 관리합니다.

## 7. 구현 전 결정할 것

- 로그인 없이 기기 단위 푸시부터 시작할지
- Supabase Edge Function 스케줄러를 쓸지, 외부 cron을 쓸지
- 알림 문구를 고정할지, 남은 퀘스트 수를 포함할지
- 알림 실패 구독을 즉시 삭제할지, 재시도 후 정리할지
