"use client";

import * as React from "react";

import { Switch } from "@/components/ui/switch";

const notificationSettings = [
  {
    id: "exam-schedule",
    label: "시험 일정 알림",
    description: "접수 마감, 시험 시작, 일정 변경 알림",
    defaultChecked: true
  },
  {
    id: "payment",
    label: "결제/환불 알림",
    description: "결제 승인, 환불 접수, 영수증 발급 알림",
    defaultChecked: true
  },
  {
    id: "results",
    label: "결과 발표 알림",
    description: "채점 완료, 성적 공개, 인증 결과 알림",
    defaultChecked: true
  },
  {
    id: "inquiry",
    label: "문의 답변 알림",
    description: "1:1 문의 답변 및 추가 확인 요청 알림",
    defaultChecked: false
  }
];

export function NotificationSettings() {
  const [settings, setSettings] = React.useState(() =>
    Object.fromEntries(notificationSettings.map((setting) => [setting.id, setting.defaultChecked]))
  );

  return (
    <div className="grid gap-2 p-3">
      {notificationSettings.map((setting) => {
        const checked = settings[setting.id];

        return (
          <div
            key={setting.id}
            className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-md border border-slate-100 bg-slate-50 px-3 py-3"
          >
            <label className="min-w-0 cursor-pointer" htmlFor={setting.id}>
              <span className="block text-xs font-black text-slate-800">{setting.label}</span>
              <span className="mt-1 block break-keep text-xs font-semibold leading-5 text-slate-500">
                {setting.description}
              </span>
            </label>
            <Switch
              id={setting.id}
              checked={checked}
              aria-label={setting.label}
              onCheckedChange={(nextChecked) => {
                setSettings((current) => ({
                  ...current,
                  [setting.id]: nextChecked
                }));
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
