"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "../../components/Button";
import { authenticateLogin, demoUsers } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const id = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const result = authenticateLogin(id, password);

    if (!result.ok) {
      setErrorMessage(result.message ?? "로그인할 수 없습니다.");
      return;
    }

    if (!result.user) {
      setErrorMessage("로그인할 수 없습니다.");
      return;
    }

    window.localStorage.setItem("sinbom-auth", JSON.stringify(result.user));
    router.push(result.user.home);
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" data-design-source="../../figma_pdf/2024/로그인.pdf">
        <h1 className="auth-title">로그인</h1>
        <p className="auth-copy">시험 운영 플랫폼 계정으로 접속합니다.</p>
        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">아이디</label>
            <input id="email" name="email" placeholder="candidate / author / grader / admin" />
          </div>
          <div className="field">
            <label htmlFor="password">비밀번호</label>
            <input id="password" name="password" placeholder="비밀번호" type="password" />
          </div>
          {errorMessage ? (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <Button type="submit">로그인</Button>
        </form>
        <div className="demo-accounts" aria-label="데모 계정">
          {demoUsers.map((user) => (
            <span key={user.id}>
              {user.id} / {user.password}
            </span>
          ))}
        </div>
        <div className="auth-links">
          <Link href="/find-id">아이디 찾기</Link>
          <Link href="/reset-password">비밀번호 찾기</Link>
          <Link href="/signup">회원가입</Link>
        </div>
      </section>
    </main>
  );
}
