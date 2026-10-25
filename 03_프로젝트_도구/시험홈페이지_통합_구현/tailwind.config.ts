import type { Config } from "tailwindcss";

/**
 * 휴텍씨 디자인 시스템 토큰 매핑 (../design_system/index.html, rules-and-tokens.md 기준).
 * 토큰 외 임의 색/사이즈 도입 금지. 타이포는 아래 스케일 유틸만 사용.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ds: {
          // text
          primary: "#222222",
          secondary: "#666666",
          muted: "#808080",
          disabled: "#999999",
          inverse: "#ffffff",
          // brand
          brand: "#0088ff",
          "brand-2": "#822afd",
          // accent / status
          success: "#51b117",
          warning: "#f7b22c",
          danger: "#dc3d3d",
          // backgrounds
          base: "#ffffff",
          page: "#f8f9fc",
          sidebar: "#eff0fa",
          soft: "#faf9ff",
          selected: "#d7e7fc",
          footer: "#fbfaff",
          // borders
          border: "#e3e5ed",
          "border-soft": "#e6e6e6",
          "border-strong": "#cccccc",
        },
      },
      fontFamily: {
        sans: [
          "Noto Sans KR",
          "Pretendard",
          "Apple SD Gothic Neo",
          "Arial",
          "sans-serif",
        ],
      },
      // 디자인 시스템 5단 타이포 스케일 (size/line-height)
      fontSize: {
        caption: ["12px", "18px"], // 메타/캡션
        body: ["14px", "22px"], // 본문 기본
        subtitle: ["16px", "24px"], // 카드 제목/소섹션
        title: ["18px", "26px"], // 섹션 헤더
        h2: ["20px", "28px"], // 대섹션
        display: ["30px", "36px"], // 페이지 타이틀/히어로
      },
      spacing: {
        // 디자인 시스템 스페이싱 리듬 (2~30px)
        "ds-1": "2px",
        "ds-2": "4px",
        "ds-3": "6px",
        "ds-4": "8px",
        "ds-5": "10px",
        "ds-6": "12px",
        "ds-7": "16px",
        "ds-8": "20px",
        "ds-9": "24px",
        "ds-10": "30px",
      },
      borderRadius: {
        "ds-xs": "4px",
        "ds-sm": "6px",
        "ds-md": "8px",
        "ds-lg": "10px",
        "ds-profile": "20px",
        "ds-full": "100px",
      },
      boxShadow: {
        popup: "0 16px 40px rgba(34, 34, 34, 0.14)",
        card: "0 1px 2px rgba(34, 34, 34, 0.05)",
      },
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};

export default config;
