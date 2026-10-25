import Link from "next/link";
import { exams } from "@/lib/data";

export default function HomePage() {
  return (
    <main className="content">
      <section className="hero grid four">
        <div className="hero-copy">
          <span className="eyebrow">AI 자격시험 통합 운영</span>
          <h1>접수부터 응시, 채점, 자격증 발급까지 한 번에 연결합니다</h1>
          <p>2024 전체 시험 운영 플로우, 2025 개편 화면, vibecoding 대량관리 요구를 Next.js 라우트로 다시 구성했습니다.</p>
          <div className="actions">
            <Link className="btn primary" href="/candidate">시험 접수하기</Link>
            <Link className="btn" href="/login">로그인</Link>
            <Link className="btn" href="/admin">관리자 운영</Link>
          </div>
        </div>
        {exams.slice(0, 4).map((exam) => (
          <article className="card hero-card" key={exam.id}>
            <h2>{exam.title}</h2>
            <p className="muted">{exam.round} / {exam.grade} / {exam.type}</p>
            <strong>{exam.date}</strong>
          </article>
        ))}
      </section>
    </main>
  );
}
