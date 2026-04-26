# Quest — Habit Tracker RPG · 프로젝트 계약

Claude Code가 이 프로젝트를 열 때 자동으로 읽는 파일입니다.

---

## 프로젝트 한줄 요약
픽셀아트 RPG 감성의 일상 습관 트래커 PWA.  
사용자는 매일 퀘스트(습관)를 완료하며 캐릭터를 성장시킨다.

## 기술 스택
| 항목 | 선택 |
|------|------|
| 프레임워크 | React 18 + Vite 5 |
| 스타일링 | Tailwind CSS + CSS Variables |
| 애니메이션 | CSS Transitions + Framer Motion (레벨업만) |
| 데이터 | localStorage (MVP) → Supabase (v2 예정) |
| PWA | vite-plugin-pwa |
| 폰트 | Press Start 2P (픽셀 감성), Noto Sans KR (본문) |
| 아이콘 | lucide-react |

## 디자인 원칙 (최우선)
- **픽셀아트 RPG 감성 + 현대 모바일 앱의 쾌적함**
- 둘이 충돌하면 **깔끔함 우선**
- 픽셀 감성은 포인트로만, 전체 레이아웃은 모바일 기준
- 제네릭 AI 디자인(보라 그라디언트, Inter 폰트 등) **절대 금지**

## 컬러 시스템 (CSS 변수)
```
--bg-base: #1e1a2e       딥 네이비 배경
--bg-card: #2a2640       카드 배경
--accent-primary: #7fdbca  민트 — 완료, 주요 액션
--accent-secondary: #f5c542 노랑 — XP, 레벨업
--accent-danger: #ff6b6b   레드 — 경고, 삭제
--text-primary: #f0ece8
--text-muted: #8a8499
--pixel-shadow: 3px 3px 0px #000
```

## 디렉토리 구조
```
src/
  utils/      nanoid, storage, xp, defaults, date
  hooks/      useQuests, useCharacter
  components/ UI 컴포넌트 (Header, XPBar, QuestCard, ...)
  screens/    HomeScreen, CategoriesScreen, CharacterScreen
ABOUT-ME/     사용자 맥락 (Claude 참고용)
docs/         프로젝트 문서 (용어집, 플랜)
TEMPLATES/    새 기능 추가 시 참고 템플릿
OUTPUTS/      결과물 저장소
```

## 개발 명령어
```bash
npm run dev    # 개발 서버 (localhost:5173)
npm run build  # 프로덕션 빌드 → dist/
```

## 현재 MVP 완료 기능
- 퀘스트 CRUD + 원탭 완료 (슬라이드 아웃 애니메이션)
- 카테고리 분류 + 탭 전환
- repeat 반복 주기 (daily/weekday/weekend/weekly)
- EXP 시스템 + 레벨업 연출
- 캐릭터 화면 (스프라이트, 통계, 잔디 달력, 뱃지)
- 설정 시트 (이름 변경, 알림 토글, 2단계 데이터 리셋)
- PWA 홈화면 추가 배너
- ALL CLEAR! 배너

## 다음 작업 (v2)
- Supabase 연동 (클라우드 동기화)
- 푸시 알림 구현
- 퀘스트 수정 기능
- 스마트워치 연동
