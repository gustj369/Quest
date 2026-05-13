# Deployment Guide

Quest는 Vite 기반 정적 PWA이므로 `npm.cmd run build` 결과물인 `dist/`를 배포합니다.

## 최종 배포 전 체크

사용자 PowerShell에서 아래 순서로 확인합니다.

```powershell
cd C:\Users\gustj\Quest
git status --short
npm.cmd test
npm.cmd run build
```

판정 기준:

- `git status --short`에서 의도하지 않은 파일이 보이면 먼저 정리합니다.
- `npm.cmd test`가 실패하면 배포하지 않습니다.
- `npm.cmd run build`가 실패하면 배포하지 않습니다.
- 위 3개가 통과하면 배포 가능한 상태로 봅니다.

`npm.cmd run build`가 사용자 PowerShell에서는 성공하고 Codex 세션에서만 `spawn EPERM`이 나면 앱 코드 문제가 아니라 Codex 실행 권한 문제로 봅니다. 자세한 확인 절차는 [Development Environment Notes](./dev-environment.md)를 따릅니다.

## 배포 전 상세 확인

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
- `docs/testing-strategy.md`

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

확인 기준:

- 제목 의미를 알아볼 수 있는지
- 카테고리, 난이도, XP 정보가 겹치지 않는지
- 몬스터, 수정, 삭제 버튼 터치 영역이 답답하지 않은지
- 답답함이 반복되면 제목 2줄 허용을 별도 작업으로 검토합니다.

미분류 퀘스트 정책은 `categoryId: null`이 보존용 임시 상태로만 쓰이는지 확인합니다.

1. 테스트 카테고리를 하나 만듭니다.
2. 해당 카테고리에 퀘스트를 하나 추가합니다.
3. 카테고리를 삭제합니다.
4. 홈 전체 탭에 퀘스트가 보존되는지 확인합니다.
5. 해당 퀘스트를 수정할 때 “기존 카테고리가 삭제되었습니다. 저장하려면 새 카테고리를 선택하세요.” 안내가 보이는지 확인합니다.
6. 새 카테고리를 선택해야 저장되는지 확인합니다.

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
