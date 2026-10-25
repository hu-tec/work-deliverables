import { roles } from "./ia.js";

export const demoUsers = [
  { id: "candidate", password: "1234", role: "candidate", name: "수험생" },
  { id: "author", password: "1234", role: "author", name: "출제자" },
  { id: "grader", password: "1234", role: "grader", name: "채점자" },
  { id: "admin", password: "1234", role: "admin", name: "관리자" }
];

export function authenticateLogin(id, password) {
  const normalizedId = id.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (!normalizedId || !normalizedPassword) {
    return { ok: false, message: "아이디와 비밀번호를 입력하세요." };
  }

  const demoUser = demoUsers.find(
    (user) => user.id === normalizedId && user.password === normalizedPassword
  );

  if (demoUser) {
    return {
      ok: true,
      user: {
        id: demoUser.id,
        name: demoUser.name,
        role: demoUser.role,
        home: roles[demoUser.role].home
      }
    };
  }

  return { ok: false, message: "등록된 데모 계정 정보와 일치하지 않습니다." };
}
