# 보유 스킬 및 상세 체크리스트 분리/보완안 ver_2

## 목적

`interview.html`의 "보유 스킬 및 상세 체크리스트"는 현재 도구, 업무 경험, 교육 운영 역량, 콘텐츠 제작 역량이 한 영역에 함께 배치되어 있다. 면접이나 역량 확인 용도로 사용하려면 다음처럼 목적별로 분리하는 편이 좋다.

- 지원자의 실제 업무 수행 가능성을 빠르게 확인한다.
- AI/바이브코딩 도구처럼 최신성이 중요한 항목은 별도 그룹으로 관리한다.
- 단순 사용 경험과 실무 산출 가능 역량을 구분한다.
- HTML 체크리스트를 수정할 때 항목 추가/삭제가 쉽도록 카테고리 기준을 명확히 둔다.

## ver_2 변경 사항

- `★ 자주 사용` 표기를 추가해 변경 후 보완 및 추가항목 중 현장에서 가장 많이 쓰이는 도구를 바로 구분할 수 있게 했다.
- 12번 항목으로 마케팅, 회계, 행정, 교육 운영, 고객 응대 등 직무별로 강조하기 좋은 역량 묶음을 추가했다.

표기 기준:

- `★ 자주 사용`: 일반 사무, 콘텐츠, 교육, 협업, AI 활용 현장에서 범용성이 높고 실제 사용 빈도가 높은 항목
- 표기 없음: 특정 직무, 조직, 프로젝트 상황에 따라 유용한 보완 항목

## 자주 사용하는 핵심 항목 빠른 보기

- AI 개발/바이브코딩: Cursor, GitHub Copilot, Claude Code, OpenAI Codex CLI, Replit Agent, Bolt.new, Lovable, v0
- 범용 LLM/프롬프트: ChatGPT, Claude, Gemini, Perplexity, NotebookLM
- 디자인/발표: Figma, Canva AI, Gamma, PowerPoint, Adobe Express, Midjourney
- 문서/지식관리: Notion, Google Docs, Microsoft Word, Notion AI, Confluence
- 협업/커뮤니케이션: Slack, Microsoft Teams, Zoom, Google Meet, Jira, Trello, GitHub Issues
- 교육 운영: Zoom, Google Meet, Miro, Padlet, Kahoot, Mentimeter, Google Classroom
- 영상/미디어: CapCut, Premiere Pro, OBS, Loom, Descript, Runway
- 데이터/자동화: Excel, Google Sheets, Airtable, Zapier, Make, Power Automate, SQL
- 웹 운영: WordPress, Cafe24, AWS, Vercel, Netlify, GitHub Pages
- 번역: DeepL, Papago, Google Translate, Trados, memoQ

## 권장 분리 구조

### 1. AI 개발/바이브코딩

목적: 프롬프트만으로 프로토타입, 웹앱, 자동화 도구, 코드 수정까지 진행할 수 있는지 확인한다.

기존 항목:

- 피그마 AI
- 커서
- 와프
- 엔티

보완 권장 항목:

- Cursor ★ 자주 사용
- Windsurf ★ 자주 사용
- GitHub Copilot ★ 자주 사용
- Claude Code ★ 자주 사용
- OpenAI Codex CLI ★ 자주 사용
- Gemini CLI ★ 자주 사용
- Cline
- Roo Code
- Continue
- Aider
- Tabnine
- Devin
- Replit Agent ★ 자주 사용
- Bolt.new ★ 자주 사용
- Lovable ★ 자주 사용
- v0 ★ 자주 사용
- Base44
- Firebase Studio
- Kiro
- Warp AI ★ 자주 사용

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

- ChatGPT ★ 자주 사용
- Claude ★ 자주 사용
- Gemini ★ 자주 사용
- Perplexity ★ 자주 사용
- NotebookLM ★ 자주 사용
- Microsoft Copilot ★ 자주 사용
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

- Figma ★ 자주 사용
- FigJam ★ 자주 사용
- Gamma ★ 자주 사용
- Canva AI ★ 자주 사용
- Adobe Firefly ★ 자주 사용
- Adobe Express ★ 자주 사용
- Midjourney ★ 자주 사용
- DALL-E ★ 자주 사용
- Ideogram
- Leonardo AI
- Krea
- Runway ★ 자주 사용
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

- Notion ★ 자주 사용
- Notion AI ★ 자주 사용
- Google Docs ★ 자주 사용
- Microsoft Word ★ 자주 사용
- Microsoft Loop
- Obsidian
- Coda
- Dropbox Paper
- Confluence ★ 자주 사용

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

- Slack ★ 자주 사용
- Microsoft Teams ★ 자주 사용
- Discord ★ 자주 사용
- Google Chat ★ 자주 사용
- Zoom ★ 자주 사용
- Google Meet ★ 자주 사용
- Webex
- Jira ★ 자주 사용
- Trello ★ 자주 사용
- Asana
- Monday.com
- Linear ★ 자주 사용
- GitHub Issues ★ 자주 사용

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

- Google Classroom ★ 자주 사용
- Moodle
- Canvas LMS
- ClassDojo
- Nearpod
- Edpuzzle
- Socrative
- FigJam ★ 자주 사용

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

- Descript ★ 자주 사용
- Runway ★ 자주 사용
- Pika
- HeyGen
- Synthesia
- ElevenLabs
- OpusClip
- Veed
- Riverside
- Screen Studio ★ 자주 사용

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

- Excel ★ 자주 사용
- Google Sheets ★ 자주 사용
- Airtable ★ 자주 사용
- Zapier ★ 자주 사용
- Make ★ 자주 사용
- n8n ★ 자주 사용
- Power Automate ★ 자주 사용
- AppSheet
- Google Apps Script ★ 자주 사용
- Python ★ 자주 사용
- SQL ★ 자주 사용
- Looker Studio ★ 자주 사용
- Power BI ★ 자주 사용
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

- AWS ★ 자주 사용
- Google Cloud ★ 자주 사용
- Azure
- Vercel ★ 자주 사용
- Netlify ★ 자주 사용
- Cloudflare ★ 자주 사용
- Render
- Railway
- Supabase ★ 자주 사용
- Firebase ★ 자주 사용
- Cafe24 ★ 자주 사용
- WordPress ★ 자주 사용
- Shopify ★ 자주 사용
- Webflow
- GitHub Pages ★ 자주 사용

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

- Trados ★ 자주 사용
- memoQ ★ 자주 사용
- Phrase
- Lokalise
- Smartcat
- DeepL ★ 자주 사용
- Google Translate ★ 자주 사용
- Papago ★ 자주 사용
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

- 일정 관리 ★ 자주 사용
- 고객 응대 ★ 자주 사용
- 교육생 관리 ★ 자주 사용
- 행정 문서 처리 ★ 자주 사용
- 자료 조사 ★ 자주 사용
- 보고서 작성 ★ 자주 사용
- 콘텐츠 운영 ★ 자주 사용
- 커뮤니티 운영
- 프로젝트 보조 ★ 자주 사용
- 품질 검수

체크 기준:

- 반복 행정 업무 처리
- 상담 내용 기록/정리
- 교육생/사용자 문의 대응
- 문서/파일 체계 관리
- 업무 우선순위 조정
- 결과 보고
- 예외 상황 대응

### 12. 직무별 강조 역량

목적: 도구 목록만으로 드러나기 어려운 직무 적합성을 보완한다. 면접, 이력서, 포트폴리오에서는 지원 직무에 맞춰 아래 항목을 선택적으로 강조하는 것이 좋다.

#### 마케팅/콘텐츠

강조 항목:

- 콘텐츠 기획 ★ 자주 사용
- 카드뉴스/썸네일 제작 ★ 자주 사용
- SNS 채널 운영 ★ 자주 사용
- 광고 소재 제작
- 캠페인 성과 정리 ★ 자주 사용
- 브랜드 톤앤매너 관리
- 키워드/트렌드 리서치 ★ 자주 사용
- 뉴스레터/블로그 콘텐츠 작성

활용 도구 예시:

- Canva AI, 미리 캔버스, Adobe Express, Figma
- ChatGPT, Claude, Gemini, Perplexity
- Google Analytics, Looker Studio, Google Sheets

체크 기준:

- 타깃에 맞는 콘텐츠 주제 도출
- 홍보 문구/카피 작성
- 이미지와 문구를 결합한 홍보물 제작
- 채널별 성과 지표 정리
- 반복 콘텐츠 템플릿화

#### 회계/정산

강조 항목:

- 지출 증빙 정리 ★ 자주 사용
- 매출/매입 자료 정리 ★ 자주 사용
- 세금계산서/영수증 관리 ★ 자주 사용
- 정산표 작성 ★ 자주 사용
- 예산 대비 집행 현황 확인
- 월별 비용 리포트 작성
- 회계 자료 파일링 ★ 자주 사용

활용 도구 예시:

- Excel, Google Sheets, 더존, 세무사랑, ERP
- Notion, Google Drive, Microsoft Word
- ChatGPT, Claude

체크 기준:

- 금액/날짜/거래처 기준 자료 정리
- 누락 증빙 확인
- 기본 함수와 피벗을 활용한 합계 검토
- 회계 담당자 또는 세무대리인에게 전달할 자료 정리
- 개인정보/재무자료 권한 관리

#### 사무/행정

강조 항목:

- 일정 관리 ★ 자주 사용
- 공문/보고서 작성 ★ 자주 사용
- 문서 양식 관리 ★ 자주 사용
- 파일명/폴더 체계화 ★ 자주 사용
- 요청 사항 접수 및 처리
- 회의록 작성 ★ 자주 사용
- 업무 진행 상황 공유 ★ 자주 사용

활용 도구 예시:

- Notion, Google Docs, Microsoft Word, Excel
- Slack, Teams, Google Calendar, Outlook
- Google Drive, OneDrive

체크 기준:

- 반복 업무를 누락 없이 처리
- 문서와 파일을 재사용 가능한 구조로 정리
- 보고 대상에 맞춰 핵심만 요약
- 요청/처리/완료 상태를 추적

#### 교육 운영/강의 지원

강조 항목:

- 교육생 출석/참여 관리 ★ 자주 사용
- 수업 자료 배포 ★ 자주 사용
- 실시간 퀴즈/피드백 운영 ★ 자주 사용
- 온라인 강의 세팅 ★ 자주 사용
- 과제 제출 현황 정리
- 만족도 조사 및 결과 리포트
- 강의 녹화/편집 지원

활용 도구 예시:

- Zoom, Google Meet, Teams
- Google Classroom, Moodle, Canvas LMS
- Miro, Padlet, Kahoot, Mentimeter

체크 기준:

- 강의 전 링크/자료/참여 안내 준비
- 강의 중 출석과 질문 관리
- 강의 후 과제, 설문, 결과 정리
- 교육생 문의에 대한 응대 기록 관리

#### 고객 응대/상담

강조 항목:

- 문의 접수 및 분류 ★ 자주 사용
- 상담 내용 기록 ★ 자주 사용
- FAQ/응대 스크립트 정리 ★ 자주 사용
- 고객 불편 사항 전달
- 재문의 방지를 위한 안내문 개선
- 상담 이력 관리 ★ 자주 사용

활용 도구 예시:

- Slack, Teams, Google Sheets, Notion
- Zendesk, Intercom, 채널톡
- ChatGPT, Claude

체크 기준:

- 문의 유형을 빠르게 파악
- 고객에게 필요한 정보를 명확하게 안내
- 처리 이력을 남겨 후속 대응 가능하게 관리
- 반복 문의를 문서화해 응대 품질 개선

## HTML 반영 시 추천 섹션 구성

현재 `interview.html`의 한 섹션을 다음 4개 블록으로 나누는 것을 권장한다.

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

### D. 직무별 강조 역량

- 마케팅/콘텐츠
- 회계/정산
- 사무/행정
- 교육 운영/강의 지원
- 고객 응대/상담

## 체크리스트 표시 방식 제안

단순 체크박스만 두면 "써본 적 있음"과 "업무에 투입 가능"이 구분되지 않는다. 가능하면 각 항목에 숙련도 표시를 추가하는 것이 좋다.

권장 숙련도:

- 경험: 사용해 본 적 있음
- 가능: 기본 업무 수행 가능
- 실무: 실제 업무 산출물 제작 가능
- 고급: 다른 사람에게 설명/교육 가능

HTML이 좁은 체크리스트 형태를 유지해야 한다면 다음처럼 섹션 제목에 목적을 넣는다.

- AI 개발: Cursor ★, Windsurf ★, Claude Code ★, Codex CLI ★, Replit Agent ★, Bolt.new ★, Lovable ★, v0 ★
- AI 활용: ChatGPT ★, Claude ★, Gemini ★, Perplexity ★, NotebookLM ★
- 디자인: Figma ★, Canva ★, Gamma ★, Midjourney ★, Adobe Firefly ★
- 문서/협업: Notion ★, Google Docs ★, Slack ★, Teams ★, GitHub ★
- 교육 운영: Zoom ★, Meet ★, Miro ★, Kahoot ★, Mentimeter ★, Google Classroom ★
- 영상 제작: CapCut ★, Premiere Pro ★, OBS ★, Loom ★, Descript ★, Runway ★
- 데이터/자동화: Excel ★, Sheets ★, Airtable ★, Zapier ★, Make ★, n8n ★
- 웹 운영: WordPress ★, Cafe24 ★, AWS ★, Vercel ★, Netlify ★, Supabase ★
- 번역: Trados ★, memoQ ★, DeepL ★, Phrase, Lokalise
- 실무 경험: 사무 ★, 상담 ★, 문서관리 ★, 데이터정리 ★, 교육생관리 ★
- 직무별 강조: 마케팅/콘텐츠 ★, 회계/정산 ★, 사무/행정 ★, 교육 운영 ★, 고객 응대 ★

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
11. 마케팅/콘텐츠 강조: 콘텐츠 기획, 카드뉴스/썸네일, SNS 운영, 캠페인 성과 정리
12. 회계/정산 강조: 지출 증빙, 매출/매입 자료, 세금계산서/영수증, 정산표, 월별 비용 리포트

## 정리

핵심은 "도구별 나열"이 아니라 "목적별 역량 확인"으로 바꾸는 것이다. 특히 바이브코딩 도구는 기존의 `AI 바이브코딩` 하나로 묶기보다 `AI IDE`, `CLI 에이전트`, `앱 빌더`, `확장형 개발 도구`로 나누면 지원자의 실제 활용 범위를 더 정확하게 볼 수 있다.
