"use client";

import { Fragment, useEffect, useState } from "react";
import { ActionLog, AppShell, DataTable, StatusBadge } from "@/components/ui";
import { authorItems, categories, exams, gradingJobs, members, payments } from "@/lib/data";

type Tab = "dashboard" | "members" | "exams" | "authoring" | "payments" | "certificates" | "forms" | "bulk";
type MemberRow = typeof members[number];

const hashTabs: Record<string, Tab> = {
  members: "members",
  exams: "exams",
  authoring: "authoring",
  payments: "payments",
  certificates: "certificates",
  forms: "forms",
  bulk: "bulk"
};

const roleMeta: Record<string, { className: string; label: string }> = {
  "수험생": { className: "candidate", label: "시험 접수/응시" },
  "출제자": { className: "author", label: "문항 출제" },
  "채점자": { className: "grader", label: "답안 채점" },
  "관리자": { className: "admin", label: "운영 관리" }
};

function getTabFromHash() {
  const hash = window.location.hash.replace("#", "");
  return hashTabs[hash] ?? "dashboard";
}

function RoleBadge({ value }: { value: string }) {
  const role = roleMeta[value] ?? { className: "default", label: value };
  return <span className={`role-badge ${role.className}`}>{value}</span>;
}

function MemberDetail({ row }: { row: MemberRow }) {
  const [id, name, roleName, type, area, status] = row;
  const role = roleMeta[roleName] ?? { className: "default", label: roleName };

  return (
    <div className="member-detail">
      <div className="member-detail-head">
        <div>
          <strong>{name}</strong>
          <span>{id}</span>
        </div>
        <span className={`role-badge ${role.className}`}>{roleName}</span>
      </div>
      <dl>
        <div><dt>회원 유형</dt><dd>{type}</dd></div>
        <div><dt>분야/지역</dt><dd>{area}</dd></div>
        <div><dt>현재 상태</dt><dd><StatusBadge value={status} /></dd></div>
        <div><dt>업무 권한</dt><dd>{role.label}</dd></div>
        <div><dt>최근 활동</dt><dd>2026-05-28 16:40</dd></div>
        <div><dt>관리 메모</dt><dd>{roleName === "관리자" ? "본부 운영 계정" : `${area} 영역 ${type} 프로필 확인 필요`}</dd></div>
      </dl>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [memberRows, setMemberRows] = useState(members);
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  const [examRows, setExamRows] = useState(exams);
  const [paymentRows, setPaymentRows] = useState(payments);
  const [certificateStatus, setCertificateStatus] = useState("발급대기");
  const [logs, setLogs] = useState<string[]>(["관리자 대시보드 로드 완료"]);

  useEffect(() => {
    const syncTabFromHash = () => setTab(getTabFromHash());
    syncTabFromHash();
    window.addEventListener("hashchange", syncTabFromHash);
    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, []);

  function log(message: string) {
    setLogs((prev) => [`${new Date().toLocaleTimeString("ko-KR")} ${message}`, ...prev].slice(0, 10));
  }

  function selectTab(nextTab: Tab) {
    setTab(nextTab);
    const nextHash = nextTab === "dashboard" ? "" : `#${nextTab}`;
    window.history.replaceState(null, "", `${window.location.pathname}${nextHash}`);
  }

  function approveExpert(id: string) {
    setMemberRows((prev) => prev.map((row) => row[0] === id ? [row[0], row[1], row[2], row[3], row[4], "승인"] : row));
    log(`${id} 전문가 승인 처리`);
  }

  function toggleMemberDetail(row: MemberRow) {
    setExpandedMemberId((prev) => prev === row[0] ? null : row[0]);
    log(`${row[0]} 상세 ${expandedMemberId === row[0] ? "닫기" : "열기"}`);
  }

  function closeExam(id: string) {
    setExamRows((prev) => prev.map((exam) => exam.id === id ? { ...exam, status: "접수완료" as const } : exam));
    log(`${id} 시험 접수 마감 처리`);
  }

  function settlePayment(id: string) {
    setPaymentRows((prev) => prev.map((row) => row[0] === id ? [row[0], row[1], row[2], row[3], row[4], "정산완료"] : row));
    log(`${id} 정산 완료`);
  }

  const tabs: [Tab, string][] = [
    ["dashboard", "대시보드"],
    ["members", "회원/전문가"],
    ["exams", "시험/일정"],
    ["authoring", "출제/채점"],
    ["payments", "결제/정산"],
    ["certificates", "자격증"],
    ["forms", "양식/템플릿"],
    ["bulk", "대량관리"]
  ];

  return (
    <AppShell role="admin" title="관리자 운영">
      <div className="content admin grid">
        <nav className="toolbar">
          {tabs.map(([key, label]) => <button className={`btn ${tab === key ? "primary" : ""}`} key={key} onClick={() => selectTab(key)}>{label}</button>)}
        </nav>

        {tab === "dashboard" && (
          <section className="grid">
            <div className="grid four">
              <div className="stat"><span>회원</span><strong>{memberRows.length}</strong></div>
              <div className="stat"><span>시험</span><strong>{examRows.length}</strong></div>
              <div className="stat"><span>출제내역</span><strong>{authorItems.length}</strong></div>
              <div className="stat"><span>채점대상</span><strong>{gradingJobs.length}</strong></div>
            </div>
            <DataTable headers={["관리항목", "상태", "오늘 처리", "액션"]} rows={[["전문가 승인", <StatusBadge key="s" value="승인대기" />, "1건", <button className="btn primary" key="a" onClick={() => selectTab("members")}>처리</button>], ["시험 일정", <StatusBadge key="s" value="접수중" />, "5건", <button className="btn" key="e" onClick={() => selectTab("exams")}>관리</button>], ["정산", <StatusBadge key="s" value="정산대기" />, "2건", <button className="btn" key="p" onClick={() => selectTab("payments")}>정산</button>]]} />
          </section>
        )}

        {tab === "members" && (
          <section className="panel" id="members">
            <h2>회원/전문가 관리</h2>
            <div className="table-wrap member-table">
              <table>
                <thead>
                  <tr>{["번호", "이름", "권한", "유형", "분야/지역", "상태", "액션"].map((header) => <th key={header}>{header}</th>)}</tr>
                </thead>
                <tbody>
                  {memberRows.map((row) => (
                    <Fragment key={row[0]}>
                      <tr className={expandedMemberId === row[0] ? "expanded" : ""}>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                        <td><RoleBadge value={row[2]} /></td>
                        <td>{row[3]}</td>
                        <td>{row[4]}</td>
                        <td><StatusBadge value={row[5]} /></td>
                        <td>
                          <div className="row-actions">
                            {row[5] === "승인대기" && <button className="btn primary" onClick={() => approveExpert(row[0])}>승인</button>}
                            <button className="btn" onClick={() => toggleMemberDetail(row)}>{expandedMemberId === row[0] ? "닫기" : "상세"}</button>
                          </div>
                        </td>
                      </tr>
                      {expandedMemberId === row[0] && (
                        <tr className="detail-row">
                          <td colSpan={7}><MemberDetail row={row} /></td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "exams" && (
          <section className="panel" id="exams">
            <h2>시험/일정 관리</h2>
            <div className="actions"><button className="btn primary" onClick={() => log("시험 신규 등록 폼 열기")}>시험 신규 등록</button><button className="btn">일정 일괄 변경</button></div>
            <DataTable headers={["ID", "시험명", "회차", "등급", "유형", "일시", "응시료", "상태", "액션"]} rows={examRows.map((exam) => [exam.id, exam.title, exam.round, exam.grade, exam.type, exam.date, `${exam.fee.toLocaleString()}원`, <StatusBadge key="s" value={exam.status} />, <button className="btn" key="c" onClick={() => closeExam(exam.id)}>마감처리</button>])} />
          </section>
        )}

        {tab === "authoring" && (
          <section className="grid two" id="authoring">
            <div className="panel">
              <h2>출제 검수</h2>
              <DataTable headers={["ID", "시험", "유형", "문항", "상태", "액션"]} rows={authorItems.map((item) => [item.id, item.exam, item.type, item.title, <StatusBadge key="s" value={item.status} />, <button className="btn primary" key="r" onClick={() => log(`${item.id} 검수 승인`)}>검수</button>])} />
            </div>
            <div className="panel">
              <h2>채점 배정</h2>
              <DataTable headers={["ID", "시험", "유형", "수험생", "상태", "액션"]} rows={gradingJobs.map((job) => [job.id, job.exam, job.type, job.candidate, <StatusBadge key="s" value={job.status} />, <button className="btn" key="a" onClick={() => log(`${job.id} 채점자 재배정`)}>배정</button>])} />
            </div>
          </section>
        )}

        {tab === "payments" && (
          <section className="panel" id="payments">
            <h2>결제/정산/환불</h2>
            <DataTable headers={["결제ID", "내용", "수단", "금액", "결제상태", "정산/환불", "액션"]} rows={paymentRows.map((row) => [...row.slice(0, 4), <StatusBadge key="pay" value={row[4]} />, <StatusBadge key="set" value={row[5]} />, <button className="btn primary" key="s" onClick={() => settlePayment(row[0])}>정산</button>])} />
          </section>
        )}

        {tab === "certificates" && (
          <section className="panel" id="certificates">
            <h2>자격증 관리</h2>
            <DataTable headers={["신청ID", "회원", "시험", "결과", "발급상태", "액션"]} rows={[["C-801", "김민서", "AI번역 일반 2급", <StatusBadge key="r" value="합격" />, <StatusBadge key="s" value={certificateStatus} />, <button className="btn primary" key="issue" onClick={() => { setCertificateStatus("발급완료"); log("C-801 자격증 발급완료"); }}>발급</button>]]} />
          </section>
        )}

        {tab === "forms" && (
          <section className="grid four">
            {["양식관리", "양식관리 신규", "프롬프트 첫화면", "템플릿 양식 관리자", "파일 업로드", "메타번역"].map((title) => <article className="card" key={title}><h2>{title}</h2><p className="muted">2025 figma_pdf 기준 관리 화면</p><button className="btn" onClick={() => log(`${title} 설정 저장`)}>관리</button></article>)}
          </section>
        )}

        {tab === "bulk" && (
          <section className="panel wide" id="bulk">
            <h2>vibecoding 대량관리</h2>
            <div className="toolbar">{["정식회원", "전문가", "결제완료", "환불요청", "문자", "이메일", "카카오", "검증요청", "수정요청"].map((label) => <label className="chip" key={label}><input type="checkbox" defaultChecked /> {label}</label>)}</div>
            <DataTable headers={["번호", "회원번호", "이름", "권한", "지역", "시험명", "접수상태", "결제", "정산", "자격증", "액션"]} rows={memberRows.map((row, index) => [index + 1, row[0], row[1], row[2], row[4], examRows[index % examRows.length].title, <StatusBadge key="a" value="접수완료" />, <StatusBadge key="p" value="결제완료" />, <StatusBadge key="s" value={index % 2 ? "정산대기" : "정산완료"} />, <StatusBadge key="c" value={index % 2 ? "발급대기" : "발급완료"} />, <button className="btn" key="x" onClick={() => log(`${row[0]} 대량 처리`)}>처리</button>])} />
          </section>
        )}

        <section className="panel">
          <h2>카테고리/구분 관리</h2>
          <DataTable headers={["대분류", "중분류", "소분류"]} rows={categories} />
        </section>
        <ActionLog logs={logs} />
      </div>
    </AppShell>
  );
}
