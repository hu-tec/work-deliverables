"use client";

import Link from "next/link";
import { Bell, CheckCircle2, Clock3, MessageSquareText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const notifications = [
  {
    title: "5월 정기시험 접수 마감 임박",
    description: "오늘 18:00까지 결제를 완료해 주세요.",
    time: "10분 전",
    tone: "warning",
    icon: Clock3
  },
  {
    title: "1:1 문의 답변 등록",
    description: "응시 환경 문의에 대한 답변이 도착했습니다.",
    time: "1시간 전",
    tone: "info",
    icon: MessageSquareText
  },
  {
    title: "결제 승인 완료",
    description: "번역능력인증 2급 접수가 완료되었습니다.",
    time: "어제",
    tone: "success",
    icon: CheckCircle2
  }
];

export function NotificationDropdown({ locale }: { locale: Locale }) {
  const unreadCount = notifications.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 shrink-0 rounded-md text-slate-700 hover:text-primary"
          aria-label={`알림 ${unreadCount}개`}
        >
          <Bell className="size-5" aria-hidden />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <DropdownMenuLabel className="p-0">알림</DropdownMenuLabel>
          <Badge variant="secondary">{unreadCount}개</Badge>
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-[360px] overflow-y-auto p-1.5">
          {notifications.map((notification) => {
            const Icon = notification.icon;

            return (
              <DropdownMenuItem key={notification.title} className="items-start gap-3 rounded-md p-3">
                <span
                  className={cn(
                    "mt-0.5 grid size-8 shrink-0 place-items-center rounded-md",
                    notification.tone === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : notification.tone === "warning"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-secondary text-primary"
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-3">
                    <span className="break-keep text-sm font-black leading-5 text-slate-900">{notification.title}</span>
                    <span className="shrink-0 text-xs font-semibold text-muted-foreground">{notification.time}</span>
                  </span>
                  <span className="mt-1 block break-keep text-xs font-semibold leading-5 text-muted-foreground">
                    {notification.description}
                  </span>
                </span>
              </DropdownMenuItem>
            );
          })}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="grid grid-cols-2 gap-2 p-3">
          <Button asChild variant="outline" size="sm">
            <Link href={`/${locale}/notifications`}>알림 설정</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/${locale}/mypage`}>마이페이지</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
