import { Button } from "../../components/Button";

export default function SignupPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel" data-design-source="../../figma_pdf/2024/회원가입.pdf">
        <h1 className="auth-title">회원가입</h1>
        <p className="auth-copy">권한을 선택하고 기본 정보를 입력합니다.</p>
        <form className="form-stack">
          <div className="field">
            <label htmlFor="role">회원 구분</label>
            <select id="role" name="role">
              <option>수험생</option>
              <option>출제자</option>
              <option>채점자</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="name">이름</label>
            <input id="name" name="name" />
          </div>
          <div className="field">
            <label htmlFor="phone">휴대폰 인증</label>
            <input id="phone" name="phone" placeholder="010-0000-0000" />
          </div>
          <Button type="submit">가입 신청</Button>
        </form>
      </section>
    </main>
  );
}
