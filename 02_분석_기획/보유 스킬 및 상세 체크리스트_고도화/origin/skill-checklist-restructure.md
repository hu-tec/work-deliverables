# 보유 스킬 및 상세 체크리스트 분리/보완안

## 목적

`interview.html`의 "보유 스킬 및 상세 체크리스트"는 현재 도구, 업무 경험, 교육 운영 역량, 콘텐츠 제작 역량이 한 영역에 함께 배치되어 있다. 면접이나 역량 확인 용도로 사용하려면 다음처럼 목적별로 분리하는 편이 좋다.

- 지원자의 실제 업무 수행 가능성을 빠르게 확인한다.
- AI/바이브코딩 도구처럼 최신성이 중요한 항목은 별도 그룹으로 관리한다.
- 단순 사용 경험과 실무 산출 가능 역량을 구분한다.
- HTML 체크리스트를 수정할 때 항목 추가/삭제가 쉽도록 카테고리 기준을 명확히 둔다.

## 권장 분리 구조

### 1. AI 개발/바이브코딩

목적: 프롬프트만으로 프로토타입, 웹앱, 자동화 도구, 코드 수정까지 진행할 수 있는지 확인한다.

기존 항목:

- 피그마 AI
- 커서
- 와프
- 엔티

보완 권장 항목:

- Cursor
- Windsurf
- GitHub Copilot
- Claude Code
- OpenAI Codex CLI
- Gemini CLI
- Cline
- Roo Code
- Continue
- Aider
- Tabnine
- Devin
- Replit Agent
- Bolt.new
- Lovable
- v0
- Base44
- Firebase Studio
- Kiro
- Warp AI

세부 분리안:

- AI IDE/에디터: Cursor, Windsurf, GitHub Copilot, Kiro, Zed AI
- 터미널/CLI 에이전트: Claude Code, OpenAI Codex CLI, Gemini CLI, Aider, Warp AI
- VS Code 확장형 에이전트: Cline, Roo Code, Continue
- 노코드/로우코드 앱 빌더: Replit Agent, Bolt.new, Lovable, v0, Base44, Firebase Studio
- 검토/협업형 개발 도구: Devin, GitHub Copilot, Tabnine

체크 기준:

- 단순 코드 생성 가능
- 기존 코드 수정 가능
- 오류 로그 기반 디버깅 가능
- GitHub 연동 가능
- 배포까지 경험
- 프롬프트로 UI/DB/API 구조 설명 가능
- 생성 코드의 보안/품질 검토 가능

### 2. 범용 LLM/프롬프트 활용

목적: 업무 질문, 문서 작성, 요약, 기획, 리서치, 사고 정리에 AI를 활용할 수 있는지 확인한다.

기존 항목:

- 제미나이
- GPT
- 클로드

보완 권장 항목:

- ChatGPT
- Claude
- Gemini
- Perplexity
- NotebookLM
- Microsoft Copilot
- Grok
- Poe
- You.com

체크 기준:

- 역할/목표/제약조건을 포함한 프롬프트 작성
- 긴 문서 요약 및 비교
- 표/체크리스트/템플릿 생성
- 근거 확인 및 출처 검토
- 회의록/상담 기록 정리
- 반복 업무용 프롬프트 템플릿화

### 3. 디자인/프레젠테이션/시각자료 제작

목적: 발표자료, 카드뉴스, 홍보물, 이미지 생성, UI 초안을 빠르게 만들 수 있는지 확인한다.

기존 항목:

- 감마
- 미드저니
- 미리 캔버스
- Canva
- Adobe Express
- Prezi
- Canva 프레젠테이션
- PowerPoint
- Keynote
- 피그마 AI

보완 권장 항목:

- Figma
- FigJam
- Gamma
- Canva AI
- Adobe Firefly
- Adobe Express
- Midjourney
- DALL-E
- Ideogram
- Leonardo AI
- Krea
- Runway
- Beautiful.ai
- Pitch
- Tome

세부 분리안:

- UI/협업 디자인: Figma, FigJam
- 발표자료: Gamma, PowerPoint, Keynote, Prezi, Beautiful.ai, Pitch, Tome
- 이미지 생성/편집: Midjourney, DALL-E, Adobe Firefly, Ideogram, Leonardo AI, Krea
- 마케팅/콘텐츠 디자인: Canva, Canva AI, Adobe Express, 미리 캔버스

체크 기준:

- 브랜드 톤에 맞춘 템플릿 제작
- 발표 흐름 구성
- 카드뉴스/썸네일 제작
- AI 이미지 생성 프롬프트 작성
- 이미지 보정/배경 제거/리사이즈
- 디자인 산출물 공유 및 피드백 반영

### 4. 문서 작성/지식관리

목적: 업무 문서, 보고서, 매뉴얼, 상담 기록, 자료 정리를 체계적으로 수행할 수 있는지 확인한다.

기존 항목:

- 글쓰기
- 글정리
- 맥락파악
- 노션
- 노트북 LM

보완 권장 항목:

- Notion
- Notion AI
- Google Docs
- Microsoft Word
- Microsoft Loop
- Obsidian
- Coda
- Dropbox Paper
- Confluence

체크 기준:

- 회의록 작성
- 보고서/제안서 작성
- 산재된 자료 구조화
- 문서 템플릿 제작
- 지식베이스 관리
- 문서 버전 관리
- 업무 맥락 요약

### 5. 업무 협업/커뮤니케이션

목적: 팀 단위 업무 진행, 요청/보고/공유가 가능한지 확인한다.

기존 항목:

- 슬랙
- 깃허브

보완 권장 항목:

- Slack
- Microsoft Teams
- Discord
- Google Chat
- Zoom
- Google Meet
- Webex
- Jira
- Trello
- Asana
- Monday.com
- Linear
- GitHub Issues

체크 기준:

- 채널 기반 커뮤니케이션
- 업무 요청/상태 공유
- 이슈/태스크 관리
- 댓글/멘션/스레드 활용
- 회의 일정 및 링크 관리
- 회의 후 액션 아이템 정리

### 6. 온라인 강의/교육 운영

목적: 온라인 강의, 워크숍, 교육생 관리, 실시간 피드백을 운영할 수 있는지 확인한다.

기존 항목:

- Zoom
- MS Teams
- Google Meet
- Webex
- Miro
- Jamboard
- Padlet
- Mural
- Kahoot
- Quizizz
- Mentimeter
- Slido

보완 권장 항목:

- Google Classroom
- Moodle
- Canvas LMS
- ClassDojo
- Nearpod
- Edpuzzle
- Socrative
- FigJam

세부 분리안:

- 화상 강의: Zoom, MS Teams, Google Meet, Webex
- 화이트보드/협업: Miro, FigJam, Padlet, Mural
- 퀴즈/평가: Kahoot, Quizizz, Mentimeter, Slido, Socrative
- LMS/학습관리: Google Classroom, Moodle, Canvas LMS
- 강의 콘텐츠 상호작용: Nearpod, Edpuzzle

체크 기준:

- 온라인 강의 개설/초대
- 출석/참여 관리
- 화면 공유/녹화
- 실시간 퀴즈 진행
- 수업 자료 배포
- 교육생 질문 관리
- 결과 리포트 정리

### 7. 영상/녹화/미디어 제작

목적: 교육 영상, 숏폼, 화면 녹화, 튜토리얼, 홍보 영상을 만들 수 있는지 확인한다.

기존 항목:

- 캡컷
- 프리미어 프로
- 파이널 컷
- DaVinci Resolve
- OBS
- Loom
- Bandicam
- Camtasia

보완 권장 항목:

- Descript
- Runway
- Pika
- HeyGen
- Synthesia
- ElevenLabs
- OpusClip
- Veed
- Riverside
- Screen Studio

세부 분리안:

- 편집: CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve
- 화면 녹화: OBS, Loom, Bandicam, Camtasia, Screen Studio
- AI 영상 생성/편집: Runway, Pika, Descript, HeyGen, Synthesia
- 음성/자막: ElevenLabs, Veed, Descript
- 숏폼 재가공: OpusClip, CapCut

체크 기준:

- 컷 편집
- 자막 삽입
- 화면 녹화
- 음성 정리
- 썸네일 제작
- 강의 영상 내보내기
- 유튜브/블로그 업로드 경험

### 8. 데이터 정리/자동화

목적: 반복 업무, 엑셀 정리, 데이터 입력/정제, 간단한 자동화를 수행할 수 있는지 확인한다.

기존 항목:

- 데이터 정리
- 문서정리관리
- MCP

보완 권장 항목:

- Excel
- Google Sheets
- Airtable
- Zapier
- Make
- n8n
- Power Automate
- AppSheet
- Google Apps Script
- Python
- SQL
- Looker Studio
- Power BI
- Tableau

체크 기준:

- 표 데이터 정리
- 함수/필터/피벗 사용
- 반복 작업 자동화
- 폼 응답 정리
- 간단한 데이터 시각화
- API/MCP 개념 이해
- 업무 자동화 흐름 설계

### 9. 웹 운영/인프라/배포

목적: 웹사이트, CMS, 서버, 배포, 도메인 등 운영 경험을 확인한다.

기존 항목:

- 서버(아마존등)
- 까페 24
- 워드프레스
- 깃허브

보완 권장 항목:

- AWS
- Google Cloud
- Azure
- Vercel
- Netlify
- Cloudflare
- Render
- Railway
- Supabase
- Firebase
- Cafe24
- WordPress
- Shopify
- Webflow
- GitHub Pages

체크 기준:

- 도메인 연결
- 호스팅 설정
- CMS 게시물 관리
- 간단한 웹사이트 수정
- GitHub 저장소 사용
- 정적 사이트 배포
- 환경변수/권한 관리
- 백업 및 복구 이해

### 10. 번역/로컬라이제이션

목적: 번역 도구, 용어 관리, 문맥 검토, 다국어 콘텐츠 작업 가능성을 확인한다.

기존 항목:

- SDL
- 멘소스

보완 권장 항목:

- Trados
- memoQ
- Phrase
- Lokalise
- Smartcat
- DeepL
- Google Translate
- Papago
- Crowdin

체크 기준:

- 번역 메모리 이해
- 용어집 관리
- 문맥 기반 번역 검토
- 기계번역 후편집
- 다국어 파일 관리
- 자막/웹 콘텐츠 번역

### 11. 업무 경험/직무 역량

목적: 도구 사용 능력이 아니라 실제 업무 역할과 경험을 분리해서 확인한다.

기존 항목:

- 사무
- 상담
- 문서정리관리
- 데이터 정리
- 관리-조직학생

보완 권장 항목:

- 일정 관리
- 고객 응대
- 교육생 관리
- 행정 문서 처리
- 자료 조사
- 보고서 작성
- 콘텐츠 운영
- 커뮤니티 운영
- 프로젝트 보조
- 품질 검수

체크 기준:

- 반복 행정 업무 처리
- 상담 내용 기록/정리
- 교육생/사용자 문의 대응
- 문서/파일 체계 관리
- 업무 우선순위 조정
- 결과 보고
- 예외 상황 대응

## HTML 반영 시 추천 섹션 구성

현재 `interview.html`의 한 섹션을 다음 3개 블록으로 나누는 것을 권장한다.

### A. AI/디지털 도구

- AI 개발/바이브코딩
- 범용 LLM/프롬프트
- 디자인/콘텐츠 제작
- 영상/미디어 제작
- 데이터/자동화

### B. 업무 수행 도구

- 문서 작성/지식관리
- 협업/커뮤니케이션
- 온라인 강의/교육 운영
- 웹 운영/인프라
- 번역/로컬라이제이션

### C. 실무 경험/역량

- 사무/행정
- 상담/고객응대
- 교육생/조직 관리
- 데이터 정리
- 문서 관리
- 콘텐츠 운영

## 체크리스트 표시 방식 제안

단순 체크박스만 두면 "써본 적 있음"과 "업무에 투입 가능"이 구분되지 않는다. 가능하면 각 항목에 숙련도 표시를 추가하는 것이 좋다.

권장 숙련도:

- 경험: 사용해 본 적 있음
- 가능: 기본 업무 수행 가능
- 실무: 실제 업무 산출물 제작 가능
- 고급: 다른 사람에게 설명/교육 가능

HTML이 좁은 체크리스트 형태를 유지해야 한다면 다음처럼 섹션 제목에 목적을 넣는다.

- AI 개발: Cursor, Windsurf, Claude Code, Codex CLI, Replit Agent, Bolt.new, Lovable, v0
- AI 활용: ChatGPT, Claude, Gemini, Perplexity, NotebookLM
- 디자인: Figma, Canva, Gamma, Midjourney, Adobe Firefly
- 문서/협업: Notion, Google Docs, Slack, Teams, GitHub
- 교육 운영: Zoom, Meet, Miro, Kahoot, Mentimeter, Google Classroom
- 영상 제작: CapCut, Premiere Pro, OBS, Loom, Descript, Runway
- 데이터/자동화: Excel, Sheets, Airtable, Zapier, Make, n8n
- 웹 운영: WordPress, Cafe24, AWS, Vercel, Netlify, Supabase
- 번역: Trados, memoQ, DeepL, Phrase, Lokalise
- 실무 경험: 사무, 상담, 문서관리, 데이터정리, 교육생관리

## 우선 반영 추천 항목

HTML 공간이 제한되어 있다면 우선순위를 두고 넣는 것이 좋다.

1. AI 개발/바이브코딩: Cursor, Windsurf, Claude Code, OpenAI Codex CLI, GitHub Copilot, Gemini CLI, Replit Agent, Bolt.new, Lovable, v0
2. 범용 AI: ChatGPT, Claude, Gemini, Perplexity, NotebookLM
3. 디자인/발표: Figma, Canva, Gamma, Midjourney, Adobe Firefly, PowerPoint
4. 문서/협업: Notion, Google Docs, Slack, Teams, GitHub
5. 교육/강의: Zoom, Google Meet, Miro, Kahoot, Mentimeter, Google Classroom
6. 영상/녹화: CapCut, Premiere Pro, OBS, Loom, Descript
7. 데이터/자동화: Excel, Google Sheets, Airtable, Zapier, Make, n8n
8. 웹 운영: WordPress, Cafe24, AWS, Vercel, Netlify, Supabase
9. 번역: Trados, memoQ, DeepL, Phrase
10. 업무 경험: 사무, 상담, 문서관리, 데이터정리, 교육생관리

## 정리

핵심은 "도구별 나열"이 아니라 "목적별 역량 확인"으로 바꾸는 것이다. 특히 바이브코딩 도구는 기존의 `AI 바이브코딩` 하나로 묶기보다 `AI IDE`, `CLI 에이전트`, `앱 빌더`, `확장형 개발 도구`로 나누면 지원자의 실제 활용 범위를 더 정확하게 볼 수 있다.
