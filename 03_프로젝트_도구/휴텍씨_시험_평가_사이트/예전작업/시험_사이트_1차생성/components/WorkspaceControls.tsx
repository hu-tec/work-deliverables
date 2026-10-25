import { aiModels, categories, metaCategories } from "@/lib/fixtures";

export function CategoryTabs({ mode = "workspace" }: { mode?: "workspace" | "meta" }) {
  const items = mode === "meta" ? metaCategories : categories;
  return (
    <nav className="tabs" aria-label="카테고리">
      {items.map((item, index) => <button className={index === (mode === "meta" ? 1 : 0) ? "selected" : ""} key={item}>{item}</button>)}
    </nav>
  );
}

export function PillSteps({ accent = "orange" }: { accent?: "orange" | "purple" }) {
  const steps = ["보유한 양식에 텍스트 입력", "나만의 양식 만들기", "양식 생성 후 내용 작성", "양식 만들기", "내용 작성 후 검수 받기", "관련 서비스 표시 영역"];
  return (
    <div className={`pill-steps ${accent}`}>
      {steps.map((step, index) => <button className={index === 0 ? "selected" : ""} key={step}>{step}</button>)}
    </div>
  );
}

export function WorkspacePanel({ accent = "orange", meta = false }: { accent?: "orange" | "purple"; meta?: boolean }) {
  return (
    <section className={`workspace-panel ${accent}`} aria-label="작업 설정">
      <div className="panel-handle">›</div>
      <aside className="control-panel">
        <Fieldset title="카테고리 선택">
          <div className="row">
            <select><option>법률</option></select>
            <select><option>국내 법률</option></select>
            <select><option>고소장</option></select>
            <button className="link-button">{meta ? "적용" : "⌕ 검색"}</button>
          </div>
        </Fieldset>
        {meta && <Fieldset title="언어"><div className="row"><input placeholder="⌕ 출발어" /><input placeholder="⌕ 도착어" /></div></Fieldset>}
        <Fieldset title="사용 AI">
          <div className="checkbox-grid compact">
            {aiModels.map((model, index) => <label key={`${model}-${index}`}><input type="checkbox" defaultChecked />{model}</label>)}
          </div>
        </Fieldset>
        <Fieldset title={meta ? "양식 에디터" : "편집 에디터"}>
          <label><input name="editor" type="radio" defaultChecked />에디터 사용</label>
          <label><input name="editor" type="radio" />에디터 미사용</label>
        </Fieldset>
        <Fieldset title="후면 작업 요청">
          <div className="row tight">
            <select><option>감수 요청</option></select>
            <select><option>고급전문가</option></select>
            <label><input type="checkbox" defaultChecked />긴급</label>
          </div>
        </Fieldset>
        <Fieldset title={meta ? "언어설정" : "사용프롬프트 설정"}>
          <select><option>{meta ? "출발어: 언어감지" : "전문분야 : 법률"}</option></select>
          <div className="checkbox-grid">
            {["형사 소송", "민사소송", "계약서", "인력문제", "이혼", "세부분야", "세부분야2", "세부분야3"].map((item) => <label key={item}><input type="checkbox" defaultChecked />{item}</label>)}
            <input placeholder={meta ? "⌕ 언어 찾기" : "⌕ 유사 분야 찾기"} />
          </div>
        </Fieldset>
        <Fieldset title="다른설정">
          <div className="checkbox-grid">
            {Array.from({ length: 10 }, (_, index) => <label key={index}><input type="checkbox" defaultChecked />관련 내용</label>)}
          </div>
        </Fieldset>
      </aside>
      <div className="work-canvas">
        <div className="empty-lamp">◔</div>
        <p>파일 업로드 또는 AI 텍스트를 입력해 주세요.</p>
        <div className="recommendations">
          <button>AI 추천 관련 서식</button>
          <button>AI 추천 관련 서식</button>
          <button>AI 추천 관련 서식</button>
        </div>
        <div className="prompt-box">
          <span>입력하세요</span>
          <button className="send">↑</button>
          <div className="files"><span>filename.pdf ×</span><span>filename.pdf ×</span><span>filename.pdf ×</span><button>파일올리기</button></div>
        </div>
      </div>
    </section>
  );
}

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return <fieldset><legend>{title}</legend>{children}</fieldset>;
}
