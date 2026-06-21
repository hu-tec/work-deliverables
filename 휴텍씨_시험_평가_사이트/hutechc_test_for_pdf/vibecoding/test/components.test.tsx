import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClassificationResultTable } from "@/components/ClassificationResultTable";
import { FileUploadDropzone } from "@/components/FileUploadDropzone";
import { classificationRows } from "@/lib/fixtures";

describe("FileUploadDropzone", () => {
  it("shows validation errors when the filename and size are invalid", () => {
    render(<FileUploadDropzone />);

    fireEvent.change(screen.getByLabelText("파일명"), { target: { value: "members.exe" } });
    fireEvent.change(screen.getByLabelText("크기"), { target: { value: String(1024 * 1024 * 24) } });

    expect(screen.getByText("지원하지 않는 파일 형식입니다.")).toBeInTheDocument();
    expect(screen.getByText("20MB 이하 파일만 업로드할 수 있습니다.")).toBeInTheDocument();
  });
});

describe("ClassificationResultTable", () => {
  it("supports bulk selection and inline edits", () => {
    render(<ClassificationResultTable rows={classificationRows.slice(0, 2)} />);

    fireEvent.click(screen.getByText("전체선택"));
    expect(screen.getByText("선택 2")).toBeInTheDocument();

    const category = screen.getByLabelText(`${classificationRows[1].id} 구분 결과`);
    fireEvent.change(category, { target: { value: "AI 콘텐츠 에디터" } });
    fireEvent.blur(category);

    expect(screen.getByDisplayValue("AI 콘텐츠 에디터")).toBeInTheDocument();
    expect(screen.getAllByText("수정필요").length).toBeGreaterThan(0);
  });
});
