# Deployment Guide

Quest는 Vite 기반 정적 PWA이므로 `npm.cmd run build` 결과물인 `dist/`를 배포합니다.

## 배포 전 확인

```powershell
cd C:\Users\gustj\Quest
npm.cmd install
npm.cmd run build
npm.cmd run preview -- --host 0.0.0.0
```

커밋 전에 새 문서 파일이 빠지지 않았는지 확인합니다.

```powershell
git status --short docs
```

아래 파일이 새 파일로 보이면 함께 커밋합니다.

- `docs/product-decisions.md`
- `docs/supabase-push-design.md`

모바일 브라우저에서 아래를 확인합니다.

- 홈, 카테고리, 캐릭터 탭 전환
- 퀘스트 완료 후 XP/완료 수 반영
- 새 퀘스트 바텀시트 열기/닫기
- 카테고리 삭제 안내 문구
- PWA 아이콘과 설치 배너

긴 제목 카드 밀도는 테스트용 퀘스트 5개를 추가해서 확인합니다.

- 아침 출근 전에 물 2리터 마시고 텀블러 다시 채워두기
- 오늘 배운 영어 표현 10개를 예문까지 같이 복습하기
- 자기 전 10분 명상하고 오늘 감정 한 줄 기록하기
- 주간 가계부 정리하고 불필요한 지출 1개 줄이기
- 읽던 책 20페이지 읽고 핵심 문장 하나 저장하기

## Vercel

Vercel에서 GitHub 저장소를 연결한 뒤 아래 설정을 사용합니다.

| 항목 | 값 |
|------|----|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

배포 후 모바일에서 `https://...vercel.app` 주소를 열고 PWA 설치 가능 여부를 확인합니다.

## Netlify

Netlify에서 GitHub 저장소를 연결한 뒤 아래 설정을 사용합니다.

| 항목 | 값 |
|------|----|
| Build command | `npm run build` |
| Publish directory | `dist` |

SPA 라우팅을 추가할 경우 `public/_redirects` 설정이 필요할 수 있지만, 현재 Quest는 단일 화면 앱이라 별도 리다이렉트 설정 없이 배포할 수 있습니다.

## 다음 기능 후보

1. 실제 푸시 발송: Supabase 또는 별도 서버 푸시 정책을 결정한 뒤 서비스워커와 구독 저장 흐름을 연결합니다.
2. 카드 밀도 점검: 긴 퀘스트 제목이 많아질 때 제목 말줄임, 메타 정보 줄바꿈, 오른쪽 액션 영역 폭을 다시 확인합니다.
3. 미분류 탭 검토: 카테고리 삭제 후 남는 퀘스트가 사용 중 불편을 만들 때 정식 탭으로 제공할지 결정합니다.
