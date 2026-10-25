# 마크다운 에디터

마크다운 문서를 작성하고, 선택한 영역에 댓글을 남기고, Word 파일로 내보낼 수 있는 로컬 Node 앱입니다.

## 실행

### Windows에서 바로 실행

`바로실행.bat` 파일을 더블클릭하면 서버가 실행됩니다.

브라우저에서 다음 주소를 엽니다.

```text
http://localhost:3000
```

처음 사용하는 사람은 회원가입을 한 번 한 뒤 바로 사용할 수 있습니다.

### 터미널에서 실행

```bash
npm start
```

브라우저에서 다음 주소를 엽니다.

```text
http://localhost:3000
```

## 외부 접속 사용법

이 앱은 서버 하나가 프론트 화면과 백엔드 API를 함께 제공합니다.

- 프론트 접속 주소: `http://<ipconfig IPv4>:3000`
- 백엔드 API 주소: `http://<ipconfig IPv4>:3000/api`
- 로그인 페이지: `http://<ipconfig IPv4>:3000/login`
- 회원가입 페이지: `http://<ipconfig IPv4>:3000/signup`

### 1. Windows IPv4 주소 확인

Windows 터미널 또는 PowerShell에서 실행합니다.

```powershell
ipconfig
```

현재 PC가 연결된 네트워크 어댑터의 `IPv4 주소`를 확인합니다. 예를 들어 `192.168.0.25`라면 외부 접속 주소는 다음과 같습니다.

```text
http://192.168.0.25:3000
```

### 2. Windows Terminal에서 서버 실행

Windows Terminal 또는 PowerShell에서 프로젝트 폴더로 이동합니다.

```powershell
cd "C:\Users\itban\Desktop\신봄_업무\markdown_editor"
```

같은 PC에서만 사용할 때는 그대로 실행합니다.

```powershell
npm start
```

다른 PC나 휴대폰에서도 접속해야 한다면 `HOST`를 `0.0.0.0`으로 지정해서 실행합니다.

```powershell
$env:HOST="0.0.0.0"
npm start
```

기본 실행은 보안을 위해 `127.0.0.1:3000`에 바인딩됩니다. 외부 접속 모드로 실행하면 같은 네트워크의 다른 기기에서도 접속할 수 있습니다. 실행하면 콘솔에 `Local`, `LAN`, `API` 주소가 표시됩니다.

### 3. Windows 방화벽 확인

외부 기기에서 접속이 안 되면 Windows Defender 방화벽에서 TCP `3000` 포트를 허용합니다.

관리자 PowerShell 예시:

```powershell
New-NetFirewallRule -DisplayName "Markdown Editor 3000" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
```

### 4. 접속 확인

같은 와이파이 또는 같은 사내망에 있는 다른 PC/휴대폰 브라우저에서 다음 주소를 엽니다.

```text
http://192.168.0.25:3000
```

백엔드 API 확인 주소:

```text
http://192.168.0.25:3000/api/auth/me
```

## 저장 위치

- 문서와 댓글 데이터: `data/app-db.json`
- 업로드 원본 파일: `uploads/`
- 화면 파일: `public/`
- 서버 파일: `server.js`

## 현재 기능

- 새 마크다운 문서 작성
- 내부용 회원가입 및 로그인
- 로그인 사용자 기준 작성자 저장
- 마크다운 실시간 미리보기
- 문서 자동 저장 및 수동 저장
- 직접 작성한 문서 삭제
- 마크다운 파일 업로드 후 폴더에 원본 저장
- 업로드 문서를 DB에 등록
- 편집창에서 드래그로 선택한 영역에 댓글 저장
- 댓글 작성자와 작성내용 저장
- 미리보기에서 댓글 영역 파란톤 하이라이트 표시
- 작성 영역 드래그 범위 기준 미리보기 하이라이트
- 댓글 묶음과 미리보기 하이라이트 양방향 포커스
- 같은 영역에 여러 댓글 표시
- 댓글에 대댓글 작성
- 댓글과 대댓글에 파일 첨부
- 직접 작성한 댓글과 대댓글 삭제
- 문서 단위 채팅 저장 및 조회
- 직접 작성한 채팅 삭제
- IDE처럼 상단 열린 문서 탭으로 빠른 전환
- 열린 문서 탭 닫기
- 현재 문서를 `.docx`로 다운로드

## 다음 개선 후보

- SQLite 패키지 도입 후 `data/app-db.json`을 실제 SQLite DB로 전환
- 댓글 위치 하이라이트 표시
- 댓글 수정 및 삭제
- Word 문서 스타일 설정
- 여러 파일 일괄 변환 모드 분리
