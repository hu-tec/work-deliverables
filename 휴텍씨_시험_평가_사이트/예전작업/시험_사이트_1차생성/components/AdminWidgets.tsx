import { formRows, templates, uploadRows } from "@/lib/fixtures";

export function AdminDashboardSummary() {
  const metrics = [
    ["신규 양식", "24"],
    ["검수 대기", "8"],
    ["업로드 처리", "132"],
    ["결제 합계", "3,850,000원"]
  ];
  return (
    <section className="summary-grid">
      {metrics.map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}
    </section>
  );
}

export function FormsTable() {
  return (
    <section className="admin-card">
      <div className="admin-actions"><button>선택삭제</button><button>엑셀다운로드</button><a href="/admin/forms/new">신규 등록</a></div>
      <table className="data-table">
        <thead><tr><th><input type="checkbox" /></th><th>양식 ID</th><th>양식명</th><th>유형</th><th>담당자</th><th>상태</th><th>수정일</th></tr></thead>
        <tbody>
          {formRows.map((row) => (
            <tr key={row.id}><td><input type="checkbox" /></td><td>{row.id}</td><td><a href={`/admin/forms/${row.id}`}>{row.name}</a></td><td>{row.type}</td><td>{row.owner}</td><td><span className="badge">{row.status}</span></td><td>{row.updatedAt}</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function TemplateManagerTable() {
  return (
    <section className="admin-card">
      <div className="admin-actions"><button>템플릿 복사</button><button>상태 변경</button><a href="/admin/templates/TMP-01">상세보기</a></div>
      <table className="data-table">
        <thead><tr><th>템플릿 ID</th><th>템플릿명</th><th>카테고리</th><th>파일유형</th><th>금액</th></tr></thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template.id}><td>{template.id}</td><td>{template.name}</td><td>{template.category}</td><td>{template.fileType}</td><td>{template.price.toLocaleString()}원</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function LargeCheckboxGroup() {
  const filters = ["전체", "정식회원", "일반회원", "전문가", "프리미엄", "샌드박스", "문자", "이메일", "카카오톡", "검증요청", "수정요청", "게시완료", "취소"];
  return <div className="filter-grid">{filters.map((filter, index) => <label key={filter}><input type="checkbox" defaultChecked={index < 8} />{filter}</label>)}</div>;
}

export function ProcessingResultTable() {
  return (
    <section className="admin-card wide-table">
      <div className="admin-actions"><button>엑셀파일생성(간편)</button><button>파일올리기</button></div>
      <table className="data-table dense">
        <thead><tr><th>번호</th><th>회원 ID</th><th>이름</th><th>이메일</th><th>서비스 유형</th><th>시험명</th><th>상태</th><th>결과</th></tr></thead>
        <tbody>
          {uploadRows.map((row, index) => (
            <tr key={row.id}><td>{index + 1}</td><td>{row.id}</td><td>{row.name}</td><td>{row.email}</td><td>번역 전문가<br />전문1급</td><td>시험명 표시 영역</td><td className={row.status === "미응시" ? "danger" : "info"}>{row.status}</td><td><span className={row.result === "합격" ? "pass" : "fail"}>{row.result}</span></td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
