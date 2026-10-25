"use client";
// 휴텍씨 디자인 시스템 공통 UI 키트.
// 토큰(ds.*)만 사용, 임의 색/사이즈 금지. 드롭다운 금지 → Chip/버튼 나열.
import type { ButtonHTMLAttributes, ReactNode } from "react";

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ===== Button (24/32/40px, primary/secondary/outline/neutral/danger/ghost) ===== */
type BtnVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "neutral"
  | "danger"
  | "ghost";
type BtnSize = "sm" | "md" | "lg";

const BTN_SIZE: Record<BtnSize, string> = {
  sm: "h-6 px-ds-4 text-caption",
  md: "h-8 px-ds-6 text-body",
  lg: "h-10 px-ds-7 text-body",
};
const BTN_VARIANT: Record<BtnVariant, string> = {
  primary: "bg-ds-brand text-ds-inverse hover:brightness-95",
  secondary: "bg-ds-brand-2 text-ds-inverse hover:brightness-95",
  outline: "border border-ds-border bg-ds-base text-ds-primary hover:bg-ds-soft",
  neutral:
    "border border-ds-border bg-ds-page text-ds-secondary hover:bg-ds-soft",
  danger: "bg-ds-danger text-ds-inverse hover:brightness-95",
  ghost: "text-ds-secondary hover:bg-ds-soft",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: {
  variant?: BtnVariant;
  size?: BtnSize;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-ds-2 rounded-ds-sm font-medium transition-colors whitespace-nowrap",
        BTN_SIZE[size],
        BTN_VARIANT[variant],
        rest.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ===== Chip (멀티선택=pill / 싱글선택=네모) ===== */
export function Chip({
  children,
  selected = false,
  pill = false,
  onClick,
  title,
}: {
  children: ReactNode;
  selected?: boolean;
  pill?: boolean; // true=멀티선택(원형), false=싱글선택(네모)
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cx(
        "inline-flex items-center gap-ds-2 h-7 px-ds-5 text-caption border transition-colors",
        pill ? "rounded-ds-full" : "rounded-ds-sm",
        selected
          ? "bg-ds-selected border-ds-brand text-ds-primary font-medium"
          : "bg-ds-base border-ds-border text-ds-secondary hover:bg-ds-soft",
      )}
    >
      {children}
    </button>
  );
}

/* ===== StatusBadge (실제 상태 문자열 → 색상) ===== */
type Tone = "success" | "warning" | "danger" | "brand" | "muted";
const TONE_CLASS: Record<Tone, string> = {
  success: "bg-[#eaf6e1] text-ds-success",
  warning: "bg-[#fdf3df] text-[#b07d11]",
  danger: "bg-[#fbe6e6] text-ds-danger",
  brand: "bg-ds-selected text-ds-brand",
  muted: "bg-ds-page text-ds-muted",
};

const STATUS_TONE: Record<string, Tone> = {
  // 접수
  "접수 중": "brand",
  "접수 완료": "success",
  "접수 전": "warning",
  "접수 취소": "danger",
  // 결제
  결제완료: "success",
  결제대기: "warning",
  결제미승인: "danger",
  환불신청: "warning",
  환불완료: "muted",
  // 시험
  "시험 전": "muted",
  "시험 시작": "brand",
  "시험 중": "brand",
  "시험 완료": "success",
  "시험 취소": "danger",
  // 채점
  "채점 요청": "warning",
  "채점 중": "warning",
  "채점 완료": "success",
  "자동 채점 완료": "success",
  "승인 완료": "success",
  // 결과
  채점중: "warning",
  합격: "success",
  불합격: "danger",
  미발표: "muted",
  // 자격증
  신청가능: "brand",
  신청완료: "success",
  발급중: "warning",
  발급완료: "success",
};

export function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const tone = STATUS_TONE[status] ?? "muted";
  return (
    <span
      className={cx(
        "inline-flex items-center h-6 px-ds-4 rounded-ds-full text-caption font-medium",
        TONE_CLASS[tone],
      )}
    >
      {status}
    </span>
  );
}

/* ===== Panel / Card ===== */
export function Panel({
  children,
  className,
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div
      className={cx(
        "bg-ds-base border border-ds-border rounded-ds-md",
        pad && "p-ds-7",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHead({
  title,
  desc,
  right,
}: {
  title: string;
  desc?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-ds-6 mb-ds-6">
      <div>
        <h2 className="text-title font-bold m-0">{title}</h2>
        {desc && <p className="text-caption text-ds-muted m-0 mt-ds-1">{desc}</p>}
      </div>
      {right}
    </div>
  );
}

/* ===== Field (32px, label + input) ===== */
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-caption text-ds-secondary mb-ds-2 font-medium">
        {label}
      </span>
      {children}
      {hint && <span className="block text-caption text-ds-muted mt-ds-1">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "w-full h-8 px-ds-5 text-body bg-ds-base border border-ds-border rounded-ds-sm",
        "placeholder:text-ds-muted focus:border-ds-brand",
        props.className,
      )}
    />
  );
}

/* ===== Tabs (싱글선택 — 라디오 동작) ===== */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      role="tablist"
      className="flex items-center gap-ds-1 border-b border-ds-border"
    >
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.key)}
            className={cx(
              "h-9 px-ds-6 text-body -mb-px border-b-2 transition-colors",
              active
                ? "border-ds-brand text-ds-brand font-semibold"
                : "border-transparent text-ds-secondary hover:text-ds-primary",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ===== EmptyState / Notice / DemoBadge ===== */
export function EmptyState({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-ds-10 gap-ds-3">
      <div className="text-h2">🗂️</div>
      <p className="text-body font-medium m-0">{title}</p>
      {desc && <p className="text-caption text-ds-muted m-0">{desc}</p>}
      {action}
    </div>
  );
}

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "warning" | "demo";
  children: ReactNode;
}) {
  const map = {
    info: "bg-ds-selected text-ds-brand border-ds-brand",
    warning: "bg-[#fdf3df] text-[#b07d11] border-ds-warning",
    demo: "bg-ds-soft text-ds-brand-2 border-ds-brand-2",
  } as const;
  return (
    <div
      className={cx(
        "flex items-start gap-ds-3 px-ds-6 py-ds-4 rounded-ds-sm border text-caption",
        map[tone],
      )}
    >
      {tone === "demo" && <span>🧪</span>}
      {tone === "warning" && <span>⚠️</span>}
      {tone === "info" && <span>ℹ️</span>}
      <div className="ds-prewrap">{children}</div>
    </div>
  );
}

/** 데모 데이터 표식 */
export function DemoBadge({ label = "데모" }: { label?: string }) {
  return (
    <span className="inline-flex items-center h-5 px-ds-3 rounded-ds-full text-[10px] font-medium bg-ds-soft text-ds-brand-2 border border-ds-brand-2">
      🧪 {label}
    </span>
  );
}

/** 실제 정리DB 출처 표식 (가짜/추측 데이터 아님을 명시) */
export function SourceTag({ label = "실제 정리DB" }: { label?: string }) {
  return (
    <span className="inline-flex items-center h-5 px-ds-3 rounded-ds-full text-[10px] font-medium bg-[#eaf6e1] text-ds-success border border-ds-success">
      📑 {label}
    </span>
  );
}

/* ===== KPI 카드 (유저향 숫자 — 라벨+값+근거) ===== */
export function Kpi({
  label,
  value,
  sub,
  icon,
  demo,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: string;
  demo?: boolean;
}) {
  return (
    <div className="bg-ds-base border border-ds-border rounded-ds-md p-ds-6 flex flex-col gap-ds-1">
      <div className="flex items-center justify-between gap-ds-2">
        <span className="text-caption text-ds-muted flex items-center gap-ds-2">
          {icon && <span>{icon}</span>}
          {label}
        </span>
        {demo && <DemoBadge />}
      </div>
      <span className="text-h2 font-bold leading-tight tabular-nums">{value}</span>
      {sub && <span className="text-caption text-ds-muted">{sub}</span>}
    </div>
  );
}

/* ===== 가로 막대 (통계 근거 시각화 — 데이터-근거 규칙) ===== */
export function BarRow({
  label,
  value,
  max,
  suffix = "",
  tone = "brand",
}: {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  tone?: "brand" | "brand-2" | "success" | "warning" | "danger";
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const barColor = {
    brand: "bg-ds-brand",
    "brand-2": "bg-ds-brand-2",
    success: "bg-ds-success",
    warning: "bg-ds-warning",
    danger: "bg-ds-danger",
  }[tone];
  return (
    <div className="grid grid-cols-[100px_1fr_56px] items-center gap-ds-3">
      <span className="text-caption text-ds-secondary truncate" title={label}>
        {label}
      </span>
      <span className="h-3 rounded-ds-full bg-ds-page overflow-hidden border border-ds-border">
        <span
          className={cx("block h-full rounded-ds-full", barColor)}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="text-caption text-ds-secondary tabular-nums text-right">
        {value.toLocaleString()}
        {suffix}
      </span>
    </div>
  );
}

export { cx };
