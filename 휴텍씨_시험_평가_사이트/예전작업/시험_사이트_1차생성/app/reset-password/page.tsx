import { Button } from "../../components/Button";

export default function ResetPasswordPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel" data-design-source="../../figma_pdf/2024/비밀번호찾기.pdf">
        <h1 className="auth-title">비밀번호 재설정</h1>
        <form className="form-stack">
          <div className="field">
            <label htmlFor="email">아이디 또는 이메일</label>
            <input id="email" name="email" />
          </div>
          <div className="field">
            <label htmlFor="phone">본인인증</label>
            <input id="phone" name="phone" placeholder="휴대폰 번호" />
          </div>
          <Button type="submit">재설정 링크 발송</Button>
        </form>
      </section>
    </main>
  );
}
