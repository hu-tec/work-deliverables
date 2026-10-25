import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="content">
      <section className="panel" style={{ maxWidth: 520, margin: "40px auto" }}>
        <h1>로그인</h1>
        <p className="muted">시연용 화면입니다. 권한을 선택하면 해당 실제 업무 페이지로 이동합니다.</p>
        <div className="form">
          <label className="field full">아이디<input defaultValue="candidate@example.com" /></label>
          <label className="field full">비밀번호<input type="password" defaultValue="password" /></label>
        </div>
        <div className="actions">
          <Link className="btn primary" href="/candidate">수험생 로그인</Link>
          <Link className="btn" href="/author">출제자</Link>
          <Link className="btn" href="/grader/scoring">채점자</Link>
          <Link className="btn" href="/admin">관리자</Link>
        </div>
      </section>
    </main>
  );
}
