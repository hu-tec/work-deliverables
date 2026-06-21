"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Theme = "default" | "slate" | "emerald";

const storageKey = "hutechc-theme";

const themes: Array<{
  value: Theme;
  label: string;
  description: string;
  swatch: string;
}> = [
  {
    value: "default",
    label: "기본",
    description: "밝은 블루 중심",
    swatch: "bg-[#0788ff]"
  },
  {
    value: "slate",
    label: "슬레이트",
    description: "차분한 네이비 중심",
    swatch: "bg-slate-800"
  },
  {
    value: "emerald",
    label: "에메랄드",
    description: "초록 포인트 중심",
    swatch: "bg-emerald-600"
  }
];

function isTheme(value: string | null): value is Theme {
  return value === "default" || value === "slate" || value === "emerald";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(storageKey, theme);
}

export function ThemeSync() {
  React.useEffect(() => {
    const savedTheme = window.localStorage.getItem(storageKey);

    if (isTheme(savedTheme)) {
      document.documentElement.dataset.theme = savedTheme;
    }
  }, []);

  return null;
}

export function ThemeSettings() {
  const [theme, setTheme] = React.useState<Theme>("default");

  React.useEffect(() => {
    const savedTheme = window.localStorage.getItem(storageKey);

    if (isTheme(savedTheme)) {
      setTheme(savedTheme);
      document.documentElement.dataset.theme = savedTheme;
    }
  }, []);

  return (
    <div className="grid gap-2 p-3 md:grid-cols-3">
      {themes.map((item) => {
        const active = item.value === theme;

        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={active}
            className={cn(
              "grid min-h-[112px] gap-3 rounded-md border bg-white p-3 text-left transition-colors",
              active ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-primary/60"
            )}
            onClick={() => {
              setTheme(item.value);
              applyTheme(item.value);
            }}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-sm font-black text-slate-900">{item.label}</span>
              <span className={cn("size-5 rounded-full", item.swatch)} aria-hidden />
            </span>
            <span className="text-xs font-semibold leading-5 text-slate-500">{item.description}</span>
            <span className="mt-auto">
              <Button asChild size="sm" variant={active ? "default" : "outline"} className="h-8 w-full text-xs">
                <span>{active ? "적용 중" : "적용"}</span>
              </Button>
            </span>
          </button>
        );
      })}
    </div>
  );
}
