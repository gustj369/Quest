# 용어 기준 — Quest 프로젝트 용어집

Claude와 대화할 때 아래 용어를 기준으로 사용한다.

---

## 핵심 도메인 용어

| 용어 | 정의 |
|------|------|
| **퀘스트 (Quest)** | 사용자가 등록한 습관 항목. 매일/주중/주말/매주 반복 가능 |
| **난이도** | 쉬움(easy·10xp) / 보통(normal·25xp) / 어려움(hard·50xp) |
| **카테고리** | 퀘스트를 분류하는 그룹 (건강/학습/마음 등). 사용자 추가 가능 |
| **완료 (Complete)** | 하루에 한 번 원탭으로 처리. `completedToday: true` 상태 |
| **리셋 (Reset)** | 자정 기준으로 `completedToday`를 false로 되돌리는 동작 |
| **repeat** | 퀘스트 반복 주기. `daily`/`weekday`/`weekend`/`weekly` |
| **XP (경험치)** | 퀘스트 완료 시 획득. 레벨업 조건: 레벨 × 100 XP |
| **레벨 (Level)** | 총 XP 기반으로 계산. `levelFromTotalXp()` 함수로 산출 |
| **뱃지 (Badge)** | 특정 조건 달성 시 획득 (첫 완료, 50개 완료, 레벨 5 등) |
| **잔디 달력** | GitHub 잔디 스타일 월별 완료 기록 시각화 |

## 컴포넌트 용어

| 용어 | 설명 |
|------|------|
| **QuestCard** | 홈 화면의 개별 퀘스트 카드. 완료 버튼 + 픽셀 몬스터 포함 |
| **PixelMonster** | 카테고리별 CSS/SVG 픽셀아트 몬스터 (슬라임, 부엉이 등) |
| **CharacterSprite** | 캐릭터 화면의 16×16 픽셀 전사 스프라이트. 레벨에 따라 색상 변화 |
| **LevelUpModal** | 레벨업 시 전체 화면 Framer Motion 연출 |
| **SettingsSheet** | 설정 바텀 시트. 이름 변경·알림·데이터 리셋 |
| **InstallBanner** | PWA 홈화면 추가 유도 배너 (1회만) |
| **XPBar** | 골드 그라디언트 경험치 바. 레이아웃이펙트로 깜박임 없이 렌더 |

## 데이터 구조

```js
// 퀘스트 객체
{
  id: string,
  title: string,
  categoryId: string,
  difficulty: 'easy' | 'normal' | 'hard',
  repeat: 'daily' | 'weekday' | 'weekend' | 'weekly',
  completedToday: boolean,
  createdAt: number, // timestamp
}

// 캐릭터 객체
{
  name: string,
  totalXp: number,
  totalCompleted: number,
  hardCompleted: number,
  spriteId: 'warrior',
}

// 히스토리 객체 (날짜별 완료 퀘스트 id 목록)
{ 'YYYY-MM-DD': ['id1', 'id2', ...] }
```

## 파일·폴더 규칙

| 폴더 | 역할 |
|------|------|
| `src/utils/` | 순수 함수 (부작용 없음) |
| `src/hooks/` | React 상태 + localStorage 연동 |
| `src/components/` | 재사용 UI 컴포넌트 |
| `src/screens/` | 탭별 전체 화면 컴포넌트 |
| `OUTPUTS/` | 스크린샷, 기획 문서, 내보낸 결과물 |
