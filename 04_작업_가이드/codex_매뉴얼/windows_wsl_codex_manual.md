# Windows 사용자를 위한 WSL 접속 및 Codex 실행 매뉴얼

작성일: 2026-05-30

이 문서는 Windows 사용자가 WSL에 접속해 OpenAI Codex CLI를 실행하는 과정을 처음부터 따라 할 수 있도록 만든 초심자용 매뉴얼입니다.

## 1. 먼저 알아야 할 개념

### Windows

평소 사용하는 운영체제입니다. PowerShell, 명령 프롬프트, 파일 탐색기, 바탕화면 등이 Windows 환경입니다.

### WSL

WSL은 Windows Subsystem for Linux의 약자입니다. Windows 안에서 Ubuntu 같은 Linux 환경을 실행할 수 있게 해 줍니다.

Codex CLI는 터미널에서 실행되는 개발 도구이므로, Windows 사용자는 WSL의 Ubuntu 터미널 안에서 실행하는 방식이 가장 안정적입니다.

### Ubuntu

WSL에서 가장 많이 사용하는 Linux 배포판입니다. 이 문서에서는 Ubuntu 기준으로 설명합니다.

### 터미널

명령어를 입력하는 검은색 또는 흰색 창입니다.

Windows에서는 PowerShell을 사용하고, WSL에 들어간 뒤에는 Ubuntu 터미널을 사용합니다.

## 2. 전체 진행 순서

1. Windows에서 WSL 설치
2. Ubuntu 계정 만들기
3. WSL에 접속하기
4. 기본 Linux 명령어 익히기
5. Node.js와 npm 설치
6. Codex CLI 설치
7. Codex 로그인 또는 API 키 설정
8. 작업 폴더로 이동해 Codex 실행

## 3. Windows에서 WSL 설치하기

### 3.1 PowerShell 관리자 권한으로 열기

1. Windows 시작 버튼을 누릅니다.
2. `PowerShell`을 검색합니다.
3. `Windows PowerShell` 또는 `Terminal`을 마우스 오른쪽 버튼으로 클릭합니다.
4. `관리자 권한으로 실행`을 선택합니다.

관리자 권한으로 실행해야 WSL 설치 명령이 정상적으로 동작합니다.

### 3.2 WSL 설치 명령 실행

PowerShell에 아래 명령어를 입력합니다.

```powershell
wsl --install
```

기본적으로 Ubuntu가 함께 설치됩니다.

설치가 끝나면 Windows를 다시 시작하라는 안내가 나올 수 있습니다. 안내가 나오면 컴퓨터를 재부팅합니다.

### 3.3 Ubuntu만 지정해서 설치하고 싶은 경우

기본 설치가 잘 안 되거나 Ubuntu를 명확히 지정하고 싶다면 아래 명령어를 사용할 수 있습니다.

```powershell
wsl --install -d Ubuntu
```

### 3.4 설치 가능한 Linux 목록 보기

어떤 Linux 배포판을 설치할 수 있는지 보고 싶다면 PowerShell에서 아래 명령어를 실행합니다.

```powershell
wsl --list --online
```

짧은 명령어로는 다음도 가능합니다.

```powershell
wsl -l -o
```

## 4. Ubuntu 처음 실행하기

### 4.1 Ubuntu 실행

Windows 시작 메뉴에서 `Ubuntu`를 검색해 실행합니다.

또는 PowerShell에서 아래 명령어를 입력해도 됩니다.

```powershell
wsl
```

특정 Ubuntu 배포판으로 접속하려면 아래처럼 입력합니다.

```powershell
wsl -d Ubuntu
```

### 4.2 사용자 이름과 비밀번호 만들기

Ubuntu를 처음 실행하면 Linux 사용자 이름과 비밀번호를 만들라고 나옵니다.

예시:

```text
Enter new UNIX username: gildong
New password:
Retype new password:
```

주의할 점:

- 사용자 이름은 영어 소문자로 만드는 것이 좋습니다.
- 비밀번호를 입력할 때 화면에 아무 글자도 표시되지 않는 것이 정상입니다.
- 비밀번호는 Windows 로그인 비밀번호와 달라도 됩니다.
- 이 비밀번호는 나중에 `sudo` 명령을 사용할 때 필요합니다.

## 5. WSL이 잘 설치되었는지 확인하기

PowerShell에서 아래 명령어를 실행합니다.

```powershell
wsl --list --verbose
```

짧게는 아래처럼 입력할 수 있습니다.

```powershell
wsl -l -v
```

예상 결과:

```text
  NAME      STATE           VERSION
* Ubuntu    Running         2
```

`VERSION`이 `2`이면 WSL2로 실행 중입니다.

## 6. WSL 접속과 종료

### 6.1 WSL 접속하기

PowerShell에서:

```powershell
wsl
```

또는 Windows 시작 메뉴에서 `Ubuntu` 실행.

### 6.2 WSL에서 빠져나오기

Ubuntu 터미널에서:

```bash
exit
```

### 6.3 실행 중인 WSL 종료하기

PowerShell에서:

```powershell
wsl --shutdown
```

이 명령은 실행 중인 모든 WSL 환경을 종료합니다.

## 7. WSL 기본 명령어

이 장은 Codex를 실행하기 전에 꼭 알아야 하는 Linux 기본 명령어입니다.

### 7.1 현재 위치 확인: `pwd`

현재 내가 어느 폴더에 있는지 확인합니다.

```bash
pwd
```

예상 결과:

```text
/home/gildong
```

`/home/gildong`은 Windows의 사용자 폴더처럼, Ubuntu 안의 내 기본 폴더입니다.

### 7.2 파일과 폴더 목록 보기: `ls`

현재 폴더 안에 있는 파일과 폴더를 봅니다.

```bash
ls
```

자세히 보고 싶다면:

```bash
ls -la
```

`ls -la` 결과 예시:

```text
drwxr-xr-x  3 gildong gildong 4096 May 30 10:00 .
drwxr-xr-x  4 root    root    4096 May 30 09:50 ..
-rw-r--r--  1 gildong gildong  220 May 30 09:50 .bash_logout
-rw-r--r--  1 gildong gildong 3771 May 30 09:50 .bashrc
drwxr-xr-x  2 gildong gildong 4096 May 30 10:00 projects
```

간단히 해석하면:

- 맨 앞이 `d`이면 폴더입니다.
- 맨 앞이 `-`이면 파일입니다.
- `.bashrc`처럼 점으로 시작하는 파일은 숨김 파일입니다.
- 숨김 파일까지 보려면 `ls -la`를 사용합니다.

### 7.3 폴더 만들기: `mkdir`

`projects`라는 폴더를 만듭니다.

```bash
mkdir projects
```

폴더가 만들어졌는지 확인합니다.

```bash
ls
```

여러 단계의 폴더를 한 번에 만들고 싶다면 `-p` 옵션을 사용합니다.

```bash
mkdir -p projects/my-app
```

이 명령은 `projects` 폴더가 없으면 만들고, 그 안에 `my-app` 폴더도 만듭니다.

### 7.4 경로 이동: `cd`

`projects` 폴더로 이동합니다.

```bash
cd projects
```

현재 위치 확인:

```bash
pwd
```

한 단계 위 폴더로 이동:

```bash
cd ..
```

홈 폴더로 이동:

```bash
cd ~
```

또는:

```bash
cd
```

### 7.5 파일 내용 보기: `cat`

파일 내용을 터미널에 출력합니다.

```bash
cat README.md
```

파일이 길다면 `less`를 사용할 수 있습니다.

```bash
less README.md
```

`less`에서 빠져나오려면 `q`를 누릅니다.

### 7.6 파일 또는 폴더 이름 자동 완성: Tab 키

명령어를 입력하다가 `Tab` 키를 누르면 이름이 자동 완성됩니다.

예를 들어 `projects` 폴더가 있을 때:

```bash
cd pro
```

여기까지 입력하고 `Tab`을 누르면:

```bash
cd projects
```

처럼 자동 완성될 수 있습니다.

## 8. Windows 폴더와 WSL 폴더의 차이

WSL에서는 크게 두 종류의 경로를 볼 수 있습니다.

### 8.1 WSL 내부 폴더

예:

```text
/home/gildong/projects
```

이 위치는 Ubuntu 내부의 Linux 파일 시스템입니다.

개발 작업은 가능하면 이 위치에서 하는 것을 권장합니다. WSL 안에서 속도가 빠르고 권한 문제가 적습니다.

### 8.2 Windows 폴더

예:

```text
/mnt/c/Users/gildong/Desktop
```

Windows의 `C:\Users\gildong\Desktop`은 WSL에서 `/mnt/c/Users/gildong/Desktop`으로 보입니다.

예를 들어 Windows 바탕화면으로 이동하려면:

```bash
cd /mnt/c/Users/gildong/Desktop
```

주의할 점:

- Windows 폴더(`/mnt/c/...`)에서도 작업은 가능하지만, 프로젝트가 커지면 느릴 수 있습니다.
- Codex로 개발 작업을 할 프로젝트는 가능하면 `/home/사용자이름/projects` 아래에 두는 것이 좋습니다.

## 9. Codex 작업용 폴더 만들기

Ubuntu 터미널에서 아래 명령어를 실행합니다.

```bash
cd ~
mkdir -p projects
cd projects
mkdir my-codex-test
cd my-codex-test
```

현재 위치 확인:

```bash
pwd
```

예상 결과:

```text
/home/gildong/projects/my-codex-test
```

간단한 파일도 하나 만들어 봅니다.

```bash
echo "# My Codex Test" > README.md
ls
cat README.md
```

## 10. Ubuntu 패키지 업데이트

Codex 설치 전에 Ubuntu의 패키지 목록을 업데이트합니다.

```bash
sudo apt update
```

설치된 패키지를 최신 상태로 올리고 싶다면:

```bash
sudo apt upgrade -y
```

`sudo`는 관리자 권한으로 실행한다는 뜻입니다. 처음 실행하면 Ubuntu 비밀번호를 물어볼 수 있습니다.

## 11. Node.js와 npm 설치

Codex CLI는 npm으로 설치할 수 있습니다. 먼저 Node.js와 npm이 있는지 확인합니다.

```bash
node -v
npm -v
```

둘 중 하나라도 `command not found`가 나오면 설치합니다.

```bash
sudo apt install -y nodejs npm
```

설치 후 다시 확인합니다.

```bash
node -v
npm -v
```

버전 번호가 나오면 설치된 것입니다.

## 12. Codex CLI 설치

Ubuntu 터미널에서 아래 명령어를 실행합니다.

```bash
npm install -g @openai/codex
```

설치가 끝나면 버전을 확인합니다.

```bash
codex --version
```

버전 번호가 나오면 Codex CLI가 설치된 것입니다.

업데이트가 필요할 때는 아래 명령어를 사용할 수 있습니다.

```bash
codex --upgrade
```

또는 npm으로 최신 버전을 다시 설치할 수 있습니다.

```bash
npm install -g @openai/codex
```

## 13. Codex 인증하기

Codex CLI는 OpenAI 계정 인증 또는 API 키를 사용합니다. 사용하는 조직이나 계정 정책에 따라 인증 방식이 다를 수 있습니다.

### 13.1 Codex를 실행해서 로그인하기

가장 먼저 아래 명령어를 실행합니다.

```bash
codex
```

로그인이 필요하면 터미널에 안내가 나옵니다. 화면의 안내에 따라 브라우저에서 로그인하거나 인증 코드를 입력합니다.

### 13.2 API 키를 환경 변수로 설정하기

조직에서 API 키 사용을 안내받은 경우 아래처럼 설정할 수 있습니다.

```bash
export OPENAI_API_KEY="여기에_API_키_붙여넣기"
```

주의:

- API 키는 비밀번호처럼 다뤄야 합니다.
- 다른 사람에게 공유하지 않습니다.
- 화면 공유 중에는 노출하지 않습니다.

매번 입력하지 않으려면 `~/.bashrc` 파일에 추가할 수 있습니다.

```bash
nano ~/.bashrc
```

파일 맨 아래에 아래 줄을 추가합니다.

```bash
export OPENAI_API_KEY="여기에_API_키_붙여넣기"
```

저장 방법:

1. `Ctrl + O`를 누릅니다.
2. `Enter`를 누릅니다.
3. `Ctrl + X`를 눌러 나옵니다.

바로 적용하려면:

```bash
source ~/.bashrc
```

## 14. Codex 실행하기

Codex는 현재 폴더를 기준으로 파일을 읽고 작업합니다. 그래서 먼저 작업할 프로젝트 폴더로 이동해야 합니다.

```bash
cd ~/projects/my-codex-test
```

현재 위치 확인:

```bash
pwd
ls
```

그 다음 Codex를 실행합니다.

```bash
codex
```

Codex가 실행되면 자연어로 요청할 수 있습니다.

예시:

```text
README.md 파일에 이 프로젝트의 목적과 실행 방법을 초심자용으로 정리해줘.
```

또는 실행하면서 바로 요청할 수도 있습니다.

```bash
codex "README.md 파일을 초심자용 설명으로 개선해줘"
```

## 15. Codex 사용 시 기본 흐름

1. 프로젝트 폴더로 이동합니다.
2. `codex`를 실행합니다.
3. 원하는 작업을 한국어 또는 영어로 요청합니다.
4. Codex가 제안하는 파일 변경이나 명령 실행 내용을 확인합니다.
5. 필요한 경우 승인합니다.
6. 작업이 끝나면 결과 파일을 확인합니다.

예시:

```bash
cd ~/projects/my-codex-test
codex
```

Codex 안에서 요청:

```text
이 폴더의 파일 목록을 확인하고, README.md를 더 보기 좋게 정리해줘.
```

## 16. 자주 쓰는 WSL 명령어 요약

| 목적 | 명령어 | 설명 |
| --- | --- | --- |
| 현재 위치 보기 | `pwd` | 내가 있는 폴더 경로 확인 |
| 파일 목록 보기 | `ls` | 현재 폴더의 파일과 폴더 보기 |
| 숨김 파일까지 보기 | `ls -la` | 자세한 목록 보기 |
| 폴더 만들기 | `mkdir 폴더명` | 새 폴더 생성 |
| 여러 단계 폴더 만들기 | `mkdir -p a/b/c` | 중간 폴더까지 한 번에 생성 |
| 폴더 이동 | `cd 폴더명` | 해당 폴더로 이동 |
| 상위 폴더 이동 | `cd ..` | 한 단계 위로 이동 |
| 홈 폴더 이동 | `cd ~` | 내 기본 폴더로 이동 |
| 파일 내용 보기 | `cat 파일명` | 파일 내용을 출력 |
| 긴 파일 보기 | `less 파일명` | 긴 파일을 페이지 단위로 보기 |
| 명령 중단 | `Ctrl + C` | 실행 중인 명령 중지 |
| 터미널 지우기 | `clear` | 화면 정리 |
| WSL 종료 | `exit` | Ubuntu 터미널에서 나가기 |

## 17. 자주 쓰는 WSL 관리 명령어

아래 명령어들은 PowerShell에서 실행합니다.

| 목적 | 명령어 |
| --- | --- |
| WSL 실행 | `wsl` |
| Ubuntu로 실행 | `wsl -d Ubuntu` |
| 설치된 배포판 보기 | `wsl -l -v` |
| 설치 가능한 배포판 보기 | `wsl -l -o` |
| 모든 WSL 종료 | `wsl --shutdown` |
| 기본 WSL 버전 2로 설정 | `wsl --set-default-version 2` |
| 기본 배포판 설정 | `wsl --set-default Ubuntu` |

## 18. 자주 발생하는 문제 해결

### 18.1 `wsl` 명령어가 안 됩니다

PowerShell을 관리자 권한으로 열고 아래 명령어를 다시 실행합니다.

```powershell
wsl --install
```

설치 후 Windows를 재부팅합니다.

### 18.2 Ubuntu 비밀번호를 입력해도 화면에 표시되지 않습니다

정상입니다. Linux 터미널에서는 비밀번호 입력 시 별표도 표시하지 않는 경우가 많습니다.

비밀번호를 입력하고 `Enter`를 누르면 됩니다.

### 18.3 `npm: command not found`가 나옵니다

Ubuntu에서 npm이 설치되지 않은 상태입니다.

```bash
sudo apt update
sudo apt install -y nodejs npm
```

설치 후 확인:

```bash
npm -v
```

### 18.4 `codex: command not found`가 나옵니다

Codex CLI가 설치되지 않았거나 경로가 잡히지 않은 상태입니다.

먼저 설치합니다.

```bash
npm install -g @openai/codex
```

설치 후 새 터미널을 열고 다시 확인합니다.

```bash
codex --version
```

### 18.5 권한 오류가 납니다

npm 전역 설치 중 권한 오류가 나면 아래처럼 `sudo`를 붙여 시도할 수 있습니다.

```bash
sudo npm install -g @openai/codex
```

단, 회사 또는 교육기관 PC에서는 관리자 권한 정책 때문에 실패할 수 있습니다. 이 경우 담당자에게 WSL 내부 npm 전역 설치 권한을 문의해야 합니다.

### 18.6 Windows 폴더에서 작업했더니 느립니다

`/mnt/c/...` 아래는 Windows 파일 시스템입니다. WSL에서 개발할 때 느릴 수 있습니다.

가능하면 프로젝트를 아래와 같은 WSL 내부 경로에 두세요.

```text
/home/사용자이름/projects
```

예:

```bash
mkdir -p ~/projects
cd ~/projects
```

### 18.7 Codex가 파일을 못 찾습니다

Codex는 현재 폴더를 기준으로 작업합니다.

먼저 현재 위치와 파일 목록을 확인하세요.

```bash
pwd
ls -la
```

원하는 프로젝트 폴더가 아니라면 `cd`로 이동한 뒤 Codex를 다시 실행합니다.

```bash
cd ~/projects/my-codex-test
codex
```

## 19. 초심자용 실습 예제

아래 명령어를 순서대로 실행하면 Codex 테스트용 폴더를 만들고 실행할 수 있습니다.

```bash
cd ~
mkdir -p projects/codex-practice
cd projects/codex-practice
echo "# Codex Practice" > README.md
ls -la
cat README.md
codex
```

Codex가 열리면 아래처럼 요청합니다.

```text
README.md 파일을 초심자가 이해하기 쉽게 한국어로 작성해줘. 프로젝트 소개, 사용 방법, 폴더 구조 섹션을 넣어줘.
```

작업 후 확인:

```bash
cat README.md
```

## 20. 권장 작업 습관

- Codex 실행 전에는 항상 `pwd`로 현재 위치를 확인합니다.
- `ls -la`로 작업할 파일이 있는지 확인합니다.
- 프로젝트는 가능하면 `~/projects` 아래에 만듭니다.
- API 키는 절대 다른 사람에게 공유하지 않습니다.
- Codex가 파일을 수정한다고 할 때는 어떤 파일을 바꾸는지 확인합니다.
- 중요한 프로젝트는 Git으로 관리하는 것이 좋습니다.

## 21. 참고 자료

- Microsoft Learn: WSL 설치 문서  
  https://learn.microsoft.com/en-us/windows/wsl/install

- Microsoft Learn: WSL 기본 명령어  
  https://learn.microsoft.com/en-us/windows/wsl/basic-commands

- OpenAI Help Center: OpenAI Codex CLI Getting Started  
  https://help.openai.com/en/articles/11096431

- OpenAI Help Center: Codex CLI and Sign in with ChatGPT  
  https://help.openai.com/en/articles/11381614-api-codex-cli-and-sign-in-with-chatgpt
