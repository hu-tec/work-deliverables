"use client";

import { usePathname, useRouter } from "next/navigation";

const roleRoutes = [
  { label: "2025 작업실", value: "/workspace" },
  { label: "관리자", value: "/admin/dashboard" },
  { label: "수험생", value: "/candidate" },
  { label: "출제자", value: "/author" },
  { label: "채점자", value: "/grader" },
  { label: "파일구분", value: "/upload-classification/upload" }
];

function currentRoute(pathname: string) {
  if (pathname.startsWith("/admin")) return "/admin/dashboard";
  if (pathname.startsWith("/candidate")) return "/candidate";
  if (pathname.startsWith("/author")) return "/author";
  if (pathname.startsWith("/grader")) return "/grader";
  if (pathname.startsWith("/upload-classification")) return "/upload-classification/upload";
  return "/workspace";
}

export function RoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="role-switcher" aria-label="권한 변경">
      <span>권한</span>
      <select value={currentRoute(pathname)} onChange={(event) => router.push(event.target.value)}>
        {roleRoutes.map((route) => (
          <option key={route.value} value={route.value}>
            {route.label}
          </option>
        ))}
      </select>
    </label>
  );
}
