import { classificationRules } from "@/lib/fixtures";

export function ClassificationRuleSelector() {
  return (
    <section className="filter-panel" aria-label="선택된 검색조건">
      <header>
        <strong>선택된 구분조건 4</strong>
        <button aria-label="접기">⌃</button>
      </header>
      <div className="rule-grid">
        {classificationRules.map((rule) => (
          <label key={rule.id} className="check-row">
            <input type="checkbox" defaultChecked />
            <span>{rule.label}</span>
            <select defaultValue={rule.value}>
              <option>{rule.value}</option>
            </select>
          </label>
        ))}
      </div>
      <div className="query-row">
        <select defaultValue="이름">
          <option>이름</option>
          <option>회원번호</option>
        </select>
        <input placeholder="입력" />
        <button className="outline-button">검색</button>
      </div>
    </section>
  );
}
