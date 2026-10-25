# AI Studio 디자인 개선안 — 둥근 모서리 → 직각 플랫(관제형)

| 항목 | 내용 |
| --- | --- |
| 대상 | HutechC 사내 Studio 앱 (`http://54.116.15.136:81/app`) |
| 현재 스타일 | shadcn/ui 기본 — 둥근 모서리(`--radius: .625rem` ≈ 10px), 그림자, 라이트 사이드바 |
| 목표 스타일 | 참조 사이트 `lee-byeong-chan.vercel.app/pagemanagement/index.html` — **완전 직각(`border-radius: 0`)**, 그림자 없음, 다크 네이비 사이드바, 고밀도 |
| 작성일 | 2026-05-26 |
| 전/후 미리보기 | [before-after.html](./before-after.html) |

---

## 1. 한 줄 요약

현재 앱은 모든 카드·버튼·입력·사이드바에 둥근 모서리(약 10px)와 부드러운 그림자가 적용된 **소비자형 SaaS 룩**이다. 참조 사이트는 모서리를 전부 `0`으로 두고 그림자를 없앤 **직각·고밀도 관제(Control Panel) 룩**이다. 두 디자인의 결정적 차이는 단 하나, **`border-radius`**다. shadcn은 거의 모든 컴포넌트가 `var(--radius)` 파생값을 쓰므로 **변수 1개만 0으로 바꾸면 90%가 직각화**된다.

---

## 2. 현재(AS-IS) 디자인 토큰 — 실측

앱 번들 CSS(`/app/assets/index-*.css`)에서 추출.

```css
:root {
  --radius: .625rem;       /* = 10px : 둥근 모서리의 근원 */
  --radius-xs: .125rem;    /* 2px */
  --background: #fff;
  --primary: #030213;      /* 거의 검정 */
  --border: #0000001a;     /* 매우 옅은 테두리 */
  --muted-foreground: #717182;
  /* oklch 다크모드 토큰 다수, sidebar-* 토큰 보유 */
}

/* Tailwind 라운드 스케일 (전부 --radius 파생) */
.rounded-sm  { border-radius: calc(var(--radius) - 4px); } /* 6px */
.rounded-md  { border-radius: calc(var(--radius) - 2px); } /* 8px */
.rounded-lg  { border-radius: var(--radius); }            /* 10px */
.rounded-xl  { border-radius: calc(var(--radius) + 4px); }/* 14px */
.rounded-full{ border-radius: 9999px; }                   /* 알약형 */
```

관찰된 특징:

1. 카드·패널·버튼·입력·배지 대부분 `rounded-md/lg` (8~10px).
2. 아바타·일부 태그·토글이 `rounded-full`(알약/원형).
3. 그림자(soft shadow) 사용, 옅은 테두리(`#0000001a`).
4. 사이드바는 라이트 배경(`--sidebar` 밝은 톤) + 둥근 활성 항목.
5. 폰트는 일반 산세리프, 여백이 넓은 저밀도 레이아웃.

---

## 3. 목표(TO-BE) 디자인 토큰 — 참조 사이트 실측

참조 사이트 `style/variables.css` · `components.css` · `layout.css`에서 추출.

```css
:root {
  /* 라이트 엔터프라이즈 팔레트 */
  --bg-base:     #f0f2f5;   /* 연한 블루그레이 바탕 */
  --bg-panel:    #ffffff;   /* 순백 패널 */
  --bg-card:     #f7f8fa;   /* 극연회색 카드 */
  --bg-header:   #1e2a3a;   /* 딥 네이비 — 탑바/사이드바 */
  --bg-selected: #dde3ff;   /* 선택 항목 배경 */
  --border-dim:    #d1d5db; /* 일반 구분선 */
  --border-heavy:  #6b7280;
  --text-primary:  #111827;
  --text-muted:    #6b7280;
  --accent-blue:   #2563eb; /* 정보/선택/CTA */
  --accent-green:  #059669; /* 정상 */
  --accent-amber:  #d97706; /* 경고 */
  --accent-red:    #dc2626; /* 위험 */
  --font-display: 'JetBrains Mono', monospace;     /* 라벨/수치 */
  --font-ui:      'IBM Plex Sans Condensed', sans-serif;
}

/* 핵심 철학: 둥근 모서리·그림자 전면 금지 */
.panel, .btn, .input-field, .kpi-cell, .engine-tag {
  border-radius: 0 !important;   /* ❌ 둥근 모서리 절대 금지 */
  box-shadow: none !important;   /* ❌ 그림자 금지 */
}
```

관찰된 특징:

1. **모든 요소 `border-radius: 0 !important`** — 도트·토글 손잡이까지 정사각형.
2. **그림자 없음**, 구분은 1px 테두리로만.
3. **다크 네이비 사이드바(180px 고정)** + 네이비 탑바(36px).
4. 활성 항목 = 연파랑 배경 + 파랑 테두리/텍스트(`#2563eb`).
5. **고밀도** — 폰트 9~11px, 여백 2~16px 스케일, 패널 패딩 8~10px.
6. 라벨/수치는 **모노스페이스(JetBrains Mono)**, 본문은 콘덴스드 산세리프.
7. 좌측 3px 컬러 바(`pillar`)로 영역 구분.

---

## 4. 전/후 비교 표

| 요소 | AS-IS (현재) | TO-BE (개선) |
| --- | --- | --- |
| 모서리 | 8~10px 둥글게, 일부 알약형 | `0` 완전 직각 |
| 그림자 | soft shadow 사용 | 없음 (1px 테두리로 대체) |
| 사이드바 | 라이트 배경, 둥근 활성 | 다크 네이비 180px, 직각 활성 |
| 활성 표시 | 둥근 강조 배경 | 연파랑 배경 + 파랑 좌측/테두리 |
| 폰트 | 일반 산세리프 | 라벨=모노스페이스, 본문=콘덴스드 |
| 밀도 | 넓은 여백·큰 글자 | 고밀도·9~11px |
| 테두리 | 거의 안 보임(#0000001a) | 명확한 회색 1px(#d1d5db) |
| 인상 | 부드러운 소비자 SaaS | 단단한 엔터프라이즈 관제 |

---

## 5. 적용 방법 (shadcn/ui + Tailwind v4)

### 5.1 1단계 — 변수 1개로 90% 직각화 (가장 큰 효과, 가장 적은 작업)

```css
/* globals.css 의 :root */
:root {
  --radius: 0rem;      /* 10px → 0 : rounded-sm/md/lg/xl 전부 0으로 cascade */
  --radius-xs: 0rem;
}
```

> shadcn 컴포넌트는 거의 모두 `rounded-md`(=`calc(var(--radius) - 2px)`) 등을 쓰므로 이 한 줄로 카드·버튼·입력·팝오버·탭이 일괄 직각이 된다. `calc(var(--radius) - 2px)`가 음수가 되면 브라우저가 0으로 클램프하므로 안전하다.

### 5.2 2단계 — 알약형(`rounded-full`) 잔여 처리

`rounded-full`은 `--radius`를 따르지 않으므로 개별 교체한다.

```diff
- <Badge className="rounded-full ...">
+ <Badge className="rounded-none ...">
- <Avatar className="rounded-full">   {/* 아바타는 직각 또는 2px 유지 선택 */}
+ <Avatar className="rounded-none">
```

전역 검색 대상: `rounded-full`, `rounded-xl`, 인라인 `border-radius`.

### 5.3 3단계 — 그림자 제거 + 테두리 강화

```css
/* 그림자를 1px 실선 테두리로 대체 */
.card, [data-slot="card"], .popover, .dialog {
  box-shadow: none;
  border: 1px solid var(--border);   /* --border 를 #d1d5db 급으로 진하게 */
}
:root { --border: #d1d5db; }         /* 기존 #0000001a → 또렷한 회색 */
```

### 5.4 4단계 — 다크 네이비 사이드바

```css
:root {
  --sidebar: #1e2a3a;                 /* 딥 네이비 */
  --sidebar-foreground: #e8ecf4;
  --sidebar-accent: #dde3ff;          /* 활성 배경 */
  --sidebar-accent-foreground: #2563eb;
  --sidebar-border: #6b7280;
  --sidebar-primary: #2563eb;
}
[data-sidebar="menu-button"] { border-radius: 0; }          /* 직각 항목 */
[data-sidebar="menu-button"][data-active="true"] {
  background: var(--sidebar-accent);
  color: var(--sidebar-accent-foreground);
  border-left: 3px solid #2563eb;     /* 좌측 컬러 바 */
}
```

### 5.5 5단계(선택) — 폰트·밀도

```css
:root {
  --font-sans: 'IBM Plex Sans Condensed', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;  /* 라벨·수치용 */
}
/* 밀도: 기본 글자 14→13px, 패널 패딩 16→10px 등 점진 조정 */
```

---

## 6. 적용 순서 & 리스크

| 단계 | 작업 | 효과 | 리스크 |
| --- | --- | --- | --- |
| 1 | `--radius: 0` | 카드/버튼/입력/탭 일괄 직각 | 낮음 — 변수 1개, 되돌리기 즉시 |
| 2 | `rounded-full`·`rounded-xl` 교체 | 알약/큰 라운드 제거 | 낮음 — 검색·치환 |
| 3 | 그림자 제거 + 테두리 강화 | 평평·또렷한 경계 | 낮음 |
| 4 | 다크 네이비 사이드바 | 영역 분리·관제 인상 | 중간 — 대비/접근성 검증 |
| 5 | 폰트·밀도 | 정보 밀도 향상 | 중간 — 한글 가독성 검증(모노는 라벨 한정) |

> 권장: **1~3단계만으로도 참조 사이트의 "직각 플랫" 인상의 대부분이 구현**된다. 4~5단계는 관제형 색·밀도까지 원할 때 추가한다. 모든 단계는 메뉴 구조 개편( [01 가이드](./01-사이드바-메뉴-단순화-가이드.md) )과 독립적으로 적용 가능하다.

---

## 7. 주의 사항

1. **한글 가독성** — JetBrains Mono는 한글 글리프가 약하므로 **라벨/숫자에만** 적용하고 본문 한글은 콘덴스드 산세리프 또는 기존 폰트 유지.
2. **접근성** — 다크 네이비 사이드바는 텍스트 대비(WCAG AA 4.5:1) 확인. `--text-on-dark: #e8ecf4` 권장.
3. **포커스 링** — 직각화 후에도 키보드 포커스 표시(`outline`)는 유지.
4. **터치 타깃** — 고밀도 적용 시 모바일 터치 영역(≥40px) 별도 보장. 참조 사이트는 1440px+ 데스크톱 전제이므로 모바일은 밀도를 완화한다.
5. **점진 적용** — 변수 단계(1~3) 먼저 배포해 회귀를 관찰한 뒤 색·밀도(4~5) 적용.

---

## 8. 요약

| 핵심 | 내용 |
| --- | --- |
| 차이의 본질 | `border-radius` — 현재 10px 둥근 vs 목표 0 직각 |
| 최소 변경 | `--radius: 0` 한 줄로 대부분 직각화 (shadcn cascade) |
| 추가 | `rounded-full` 제거 → 그림자 제거·테두리 강화 → 다크 네이비 사이드바 → 폰트/밀도 |
| 미리보기 | [before-after.html](./before-after.html) 에서 좌(현재)/우(개선) 직접 비교 |
