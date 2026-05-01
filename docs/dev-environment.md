# Development Environment Notes

이 문서는 로컬 개발환경에서 확인된 권한/설정 문제를 정리합니다. 앱 코드 동작에는 영향을 주지 않습니다.

## Vite build: `spawn EPERM`

현재 Codex 세션에서는 `node_modules/@esbuild/win32-x64/esbuild.exe`를 직접 실행하면 동작하지만, Node의 `child_process.spawn`으로 실행하면 `EPERM`이 발생합니다. Vite는 build/dev 시작 중 esbuild를 child process로 실행하므로 `npm run build`와 `npm run dev`가 같은 지점에서 실패합니다.

사용자 PowerShell에서 확인:

```powershell
cd C:\Users\gustj\Quest
node_modules\@esbuild\win32-x64\esbuild.exe --version
node -e "const {spawnSync}=require('child_process'); const r=spawnSync('node_modules/@esbuild/win32-x64/esbuild.exe',['--version'],{encoding:'utf8'}); console.log(r.status, r.error?.message, r.stdout)"
npm.cmd run build
npm.cmd run dev
```

직접 PowerShell에서도 `spawn EPERM`이 나면 보안 프로그램, Windows Defender 제어된 폴더 액세스, Node/esbuild 실행 권한, 또는 `node_modules` 재설치를 확인합니다. Codex 세션에서는 `npm.cmd rebuild esbuild`도 npm lifecycle script spawn 단계에서 `EPERM`으로 실패했습니다.

```powershell
npm.cmd rebuild esbuild
```

권장 확인 순서:

1. 사용자 PowerShell을 새로 열고 위 명령을 다시 실행합니다.
2. Windows 보안에서 `바이러스 및 위협 방지 > 랜섬웨어 방지 > 제어된 폴더 액세스`가 켜져 있다면 Node.js와 esbuild 실행을 허용하거나, 잠시 끄고 `npm.cmd run build`를 재확인합니다.
3. 백신/보안 프로그램이 `node.exe` 또는 `node_modules/@esbuild/win32-x64/esbuild.exe` 실행을 차단하는지 확인합니다.
4. 계속 실패하면 의존성을 재설치합니다.
5. 그래도 실패하면 Node.js LTS 버전으로 재설치합니다. 현재 Codex 세션에서는 Node `v24.14.1`, npm `11.11.0`에서 `spawn EPERM`이 재현됐습니다.

Windows Defender를 쓰는 경우 관리자 PowerShell에서 예외를 추가할 수 있습니다.

```powershell
Add-MpPreference -ExclusionPath "C:\Users\gustj\Quest"
Add-MpPreference -ExclusionProcess "C:\Program Files\nodejs\node.exe"
Add-MpPreference -ExclusionProcess "C:\Users\gustj\Quest\node_modules\@esbuild\win32-x64\esbuild.exe"
```

예외 추가 후 일반 사용자 PowerShell에서 다시 확인합니다.

```powershell
cd C:\Users\gustj\Quest
npm.cmd run build
npm.cmd run dev
```

```powershell
Remove-Item -Recurse -Force node_modules
npm.cmd install
npm.cmd run build
```

Node 재설치 후 확인:

```powershell
node -v
npm.cmd -v
npm.cmd install
npm.cmd run build
npm.cmd run dev
```

권장: Node.js Current보다 LTS 버전을 우선 사용합니다.

Node LTS 재설치 후에도 같은 오류가 나면 차단 로그를 확인합니다.

Windows 보안 앱에서 확인:

1. `Windows 보안`을 엽니다.
2. `바이러스 및 위협 방지`로 이동합니다.
3. `보호 기록`을 엽니다.
4. `node.exe`, `npm.cmd`, `esbuild.exe`, 또는 `C:\Users\gustj\Quest` 관련 차단 항목이 있는지 확인합니다.
5. 차단 항목이 있으면 세부 정보를 열고 허용 또는 복원 후 다시 `npm.cmd run build`를 실행합니다.

PowerShell에서 최근 Defender 탐지 내역 확인:

```powershell
Get-MpThreatDetection | Select-Object -First 20
```

추가로 Windows 이벤트 로그에서 앱 차단 흔적을 확인할 수 있습니다.

```powershell
Get-WinEvent -LogName "Microsoft-Windows-Windows Defender/Operational" -MaxEvents 20 |
  Select-Object TimeCreated, Id, ProviderName, Message
```

## Git global ignore warning

`git status`에서 `C:\Users\gustj\.config\git\ignore` 접근 권한 경고가 나면, 접근 가능한 전역 ignore 파일을 지정합니다.

```powershell
New-Item -ItemType File -Force "$env:USERPROFILE\.gitignore_global"
git config --global core.excludesfile "$env:USERPROFILE\.gitignore_global"
git status
```

## Codex session cannot write `.git/config`

Codex 샌드박스 계정에는 `.git/config`에 대한 deny ACL이 있어 이 세션에서 Git config 쓰기가 막힐 수 있습니다. 커밋과 push는 사용자 PowerShell에서 수행합니다.

```powershell
git status
git add .
git commit -m "Stabilize Quest app"
git push
```

커밋 전 확인:

```powershell
git status --short
git diff --stat
```

`node_modules/`와 `dist/`는 `.gitignore`로 제외되어야 합니다.

이 세션에서 커밋이 실패하고 사용자 PowerShell에서도 `.git/index.lock` 오류가 나면 잠금 파일이 남아 있는지 확인합니다.

```powershell
Remove-Item -Force .git\index.lock -ErrorAction SilentlyContinue
git add .
git commit -m "Stabilize Quest app"
git push
```

## Manual UI regression checklist

`npm.cmd run dev`가 성공하면 브라우저에서 아래를 확인합니다.

1. 홈 화면에서 퀘스트 1개를 완료합니다.
2. 완료 애니메이션 후 카드가 완료 상태로 바뀌고 XP/완료 수가 증가하는지 확인합니다.
3. 레벨업이 발생할 만큼 퀘스트를 완료하거나 localStorage의 XP를 조정해 레벨업 모달이 정상 표시/닫힘 되는지 확인합니다.
4. 완료 직후 탭 전환, 설정 열기, 데이터 초기화를 해도 콘솔 경고가 없는지 확인합니다.
5. DevTools Application 탭에서 manifest 아이콘이 `pwa-192x192.png`, `pwa-512x512.png`로 표시되는지 확인합니다.

빠른 레벨업 확인용으로 브라우저 DevTools Console에서 아래 값을 넣은 뒤 새로고침할 수 있습니다.

```js
localStorage.setItem('quest_character', JSON.stringify({
  name: '용사',
  totalXp: 90,
  totalCompleted: 0,
  hardCompleted: 0,
  spriteId: 'warrior'
}))
```

새로고침 후 `normal` 이상의 퀘스트를 완료하면 레벨업 모달을 확인하기 쉽습니다.

테스트가 끝나면 필요에 따라 localStorage를 초기화합니다.

```js
localStorage.removeItem('quest_character')
localStorage.removeItem('quest_quests')
localStorage.removeItem('quest_history')
location.reload()
```

## Commit checklist

UI 확인까지 끝난 뒤 사용자 PowerShell에서 커밋합니다.

```powershell
cd C:\Users\gustj\Quest
git status --short
git add .
git commit -m "Stabilize Quest app"
git push
```

커밋 전 `git status --short`에서 `node_modules/`와 `dist/`가 보이면 커밋하지 말고 `.gitignore`를 먼저 확인합니다.
