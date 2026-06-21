import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ExamPortal } from "@/components/exam-portal";
import { getPageConfig, PortalPage } from "@/components/portal-shell";

function renderPortal(locale: "ko" | "en" = "ko") {
  return render(<ExamPortal locale={locale} />);
}

describe("ExamPortal", () => {
  it("renders the cloned hero and primary exam entry actions", () => {
    renderPortal();

    expect(
      screen.getByRole("heading", {
        name: "시험 접수부터 응시, 결과 확인까지 바로 진행하세요"
      })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("수험번호 또는 접수번호")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("이름 또는 생년월일")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "시험장 입장" })[0]).toHaveAttribute(
      "href",
      "/ko/take"
    );
  });

  it("shows the original portal metrics, shortcuts, and registration table data", () => {
    renderPortal();

    const metrics = screen.getByLabelText("today metrics");
    expect(within(metrics).getByText("접수대기")).toBeInTheDocument();
    expect(within(metrics).getByText("응시가능")).toBeInTheDocument();
    expect(within(metrics).getByText("합격")).toBeInTheDocument();

    expect(screen.getAllByRole("link", { name: /시험접수/ }).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("HCT2401-01")).toBeInTheDocument();
    expect(screen.getAllByText("AITe 번역 전문가").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("응시 준비 상태")).toBeInTheDocument();
  });

  it("supports the English dictionary on the same themed layout", () => {
    renderPortal("en");

    expect(
      screen.getByRole("heading", {
        name: "Apply, take exams, and check results in one place"
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "My page" })).toHaveAttribute("href", "/en/mypage");
  });

  it("keeps the mypage sidebar visible on the orders page", () => {
    render(<PortalPage locale="ko" config={getPageConfig(["orders"])} />);

    expect(screen.getByRole("main")).toHaveClass("bg-background");
    expect(screen.getByRole("heading", { name: "주문내역" })).toBeInTheDocument();
    expect(screen.getByText("마이페이지")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "결제 내역" })).toHaveAttribute("href", "/ko/orders");
  });

  it("uses separate full-grid admin pages for inquiries and payments", () => {
    const { rerender } = render(<PortalPage locale="ko" config={getPageConfig(["admin", "inquiries"])} />);

    expect(screen.getByRole("heading", { name: "문의관리" })).toBeInTheDocument();
    expect(screen.getByText("운영자 페이지")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "문의관리" })).toHaveAttribute("href", "/ko/admin/inquiries");
    expect(screen.getByText("문의 처리 그리드")).toBeInTheDocument();
    expect(screen.getByText("INQ-2026-017")).toBeInTheDocument();

    rerender(<PortalPage locale="ko" config={getPageConfig(["admin", "payments"])} />);

    expect(screen.getByRole("heading", { name: "결제내역" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "결제내역" }).some((link) => link.getAttribute("href") === "/ko/admin/payments")).toBe(true);
    expect(screen.getByText("결제 검증 그리드")).toBeInTheDocument();
    expect(screen.getByText("ORD-2026-1048")).toBeInTheDocument();
  });

  it("lets users change the profile theme", async () => {
    const user = userEvent.setup();
    render(<PortalPage locale="ko" config={getPageConfig(["profile"])} />);

    await user.click(screen.getByRole("button", { name: /에메랄드/ }));

    expect(document.documentElement).toHaveAttribute("data-theme", "emerald");
    expect(window.localStorage.getItem("hutechc-theme")).toBe("emerald");
  });

  it("shows different dummy data for each take exam question tab", async () => {
    const user = userEvent.setup();
    render(<PortalPage locale="ko" config={getPageConfig(["take"])} />);

    expect(screen.getByText("문제 1. 태국 여행 기획서")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "문제 4" }));

    expect(screen.getByText("문제 4. 제품 소개문")).toBeInTheDocument();
    expect(screen.getByText(/이 무선 충전기는 스마트폰과 이어폰을 동시에 충전/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("문제 4 답안을 입력하세요.")).toBeInTheDocument();
  });

  it("searches, filters, and adds inquiry dummy data", async () => {
    const user = userEvent.setup();
    render(<PortalPage locale="ko" config={getPageConfig(["inquiry"])} />);

    await user.type(screen.getByPlaceholderText("키워드 검색"), "영수증");
    expect(screen.getByText("영수증 재발급 요청")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "영수증 재발급 요청" })).toHaveAttribute("href", "/ko/inquiry/INQ-2026-002");
    expect(screen.queryByText("시험장 입장 버튼이 보이지 않습니다")).not.toBeInTheDocument();

    await user.clear(screen.getByPlaceholderText("키워드 검색"));
    await user.click(screen.getByRole("button", { name: "답변대기" }));
    expect(screen.getByText("시험장 입장 버튼이 보이지 않습니다")).toBeInTheDocument();
    expect(screen.queryByText("영수증 재발급 요청")).not.toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("제목"), "시험 시간 변경 문의");
    await user.type(screen.getByPlaceholderText("문의 내용을 입력하세요."), "개인 일정으로 시험 시간을 변경할 수 있는지 확인 부탁드립니다.");
    await user.click(screen.getByRole("button", { name: "문의 접수" }));

    expect(screen.getByText("시험 시간 변경 문의")).toBeInTheDocument();
    expect(screen.getByText(/INQ-2026-004/)).toBeInTheDocument();
  });

  it("renders an inquiry detail page with question and answer content", () => {
    render(<PortalPage locale="ko" config={getPageConfig(["inquiry", "INQ-2026-002"])} />);

    expect(screen.getByRole("heading", { name: "문의 상세" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "영수증 재발급 요청" })).toBeInTheDocument();
    expect(screen.getByText("회사 제출용 결제 영수증을 다시 발급받고 싶습니다.")).toBeInTheDocument();
    expect(screen.getByText(/영수증 재발급을 선택하면 PDF로 다시 다운로드/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "목록으로 돌아가기" })).toHaveAttribute("href", "/ko/inquiry");
  });

  it("lets expert graders select Lee Jungwoo and Park Jiwon from grading history", async () => {
    const user = userEvent.setup();
    render(<PortalPage locale="ko" config={getPageConfig(["expert", "grading"])} />);

    await user.click(screen.getByRole("button", { name: "이정우 · AI 70" }));
    expect(screen.getByText(/현재 응시자/).closest("section")).toHaveTextContent(
      "이정우 (HCT-2407-119), 재검토"
    );
    expect(screen.getByPlaceholderText("이정우 검수 코멘트")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "박지원 · AI 90" }));
    expect(screen.getByText(/현재 응시자/).closest("section")).toHaveTextContent(
      "박지원 (HCT-2407-128), 확정대기"
    );
    expect(screen.getByPlaceholderText("박지원 검수 코멘트")).toBeInTheDocument();
  });
});
