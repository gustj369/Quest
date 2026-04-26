# 새 기능 추가 템플릿

새로운 기능이나 컴포넌트를 추가할 때 이 템플릿을 참고한다.

---

## 1. 기능 정의

**기능 이름**: (예: 퀘스트 수정 모달)

**한줄 설명**: (예: 기존 퀘스트의 제목·난이도·카테고리를 변경할 수 있는 바텀 시트)

**트리거**: (예: QuestCard 롱프레스 / 수정 버튼 탭)

**영향 받는 파일**:
- `src/hooks/useQuests.js` — updateQuest 함수 추가
- `src/components/EditQuestModal.jsx` — 신규 생성
- `src/screens/HomeScreen.jsx` — onEdit prop 연결
- `src/App.jsx` — 상태 연결

---

## 2. 데이터 변경

```js
// 새로 추가되는 상태/함수
const updateQuest = (id, updates) => { ... }

// 변경되는 데이터 구조 (있으면)
// 기존: { title, categoryId, difficulty, repeat }
// 변경: 동일 (수정 기능이므로 구조 변경 없음)
```

---

## 3. 컴포넌트 스펙

```jsx
// 컴포넌트 시그니처
<EditQuestModal
  quest={quest}        // 수정할 퀘스트 객체
  categories={[...]}  // 카테고리 목록
  onSave={(updates) => {}} // 저장 콜백
  onClose={() => {}}  // 닫기 콜백
/>
```

**UI 요소**:
- [ ] 바텀 시트 형태 (AddQuestModal과 동일 구조)
- [ ] 제목 입력 (기존값 pre-fill)
- [ ] 카테고리 선택 (기존값 selected)
- [ ] 난이도 선택 (기존값 selected)
- [ ] "저장" 버튼 (mint 색상, 픽셀 스타일)

**디자인 주의사항**:
- Press Start 2P: 헤더 텍스트만
- Noto Sans KR: 레이블, 입력값
- 터치 타겟: 최소 44px

---

## 4. 체크리스트

### 구현
- [ ] hook에 새 함수 추가 + localStorage 저장
- [ ] 컴포넌트 생성 (`TEMPLATES/` 참고)
- [ ] 부모 화면에 prop 연결
- [ ] `App.jsx`에 상태 연결 (필요 시)

### 확인
- [ ] 새 기능이 기존 기능을 깨뜨리지 않음
- [ ] 빈 상태 처리 있음
- [ ] 모바일 뷰포트(375px)에서 레이아웃 정상
- [ ] `npm run build` 에러 없음
- [ ] 스크린샷으로 결과 확인

### 코드 품질
- [ ] 인라인 스타일의 색상값은 CSS 변수 사용
- [ ] `console.log` 제거
- [ ] 새 용어는 `docs/glossary.md`에 추가

---

## 5. 결과물 저장

작업 완료 후 스크린샷은 `OUTPUTS/` 폴더에 저장.  
파일명 형식: `YYYY-MM-DD_기능명.png`
