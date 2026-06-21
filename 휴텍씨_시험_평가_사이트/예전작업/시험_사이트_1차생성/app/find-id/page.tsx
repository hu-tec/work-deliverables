import { Button } from "../../components/Button";

export default function FindIdPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel" data-design-source="../../figma_pdf/2024/아이디찾기.pdf">
        <h1 className="auth-title">아이디 찾기</h1>
        <form className="form-stack">
          <div className="field">
            <label htmlFor="name">이름</label>
            <input id="name" name="name" />
          </div>
          <div className="field">
            <label htmlFor="phone">휴대폰 번호</label>
            <input id="phone" name="phone" />
          </div>
          <Button type="submit">아이디 확인</Button>
        </form>
      </section>
    </main>
  );
}
