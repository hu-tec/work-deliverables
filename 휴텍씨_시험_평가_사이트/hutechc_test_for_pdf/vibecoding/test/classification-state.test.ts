import { describe, expect, it } from "vitest";
import {
  applyInlineEdit,
  bulkSelectRows,
  createClassificationJob,
  transitionJob,
  validateUploadFile
} from "@/lib/classification-state";

describe("upload classification state model", () => {
  it("accepts supported spreadsheet and csv files under the size limit", () => {
    const result = validateUploadFile({ name: "members.xlsx", size: 1024 * 1024 * 8 });

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects unsupported files and files over 20MB", () => {
    const result = validateUploadFile({ name: "members.exe", size: 1024 * 1024 * 24 });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(["지원하지 않는 파일 형식입니다.", "20MB 이하 파일만 업로드할 수 있습니다."]);
  });

  it("moves through upload, validation, processing, review, and apply states", () => {
    const initial = createClassificationJob("job-1");
    const uploaded = transitionJob(initial, "upload-complete");
    const valid = transitionJob(uploaded, "validation-ok");
    const processed = transitionJob(valid, "processing-complete");
    const reviewed = transitionJob(processed, "review-complete");
    const applied = transitionJob(reviewed, "apply-complete");

    expect(applied).toMatchObject({
      upload: "uploaded",
      validation: "valid",
      processing: "complete",
      review: "complete",
      apply: "applied"
    });
  });

  it("marks invalid transitions as failed without changing unrelated domains", () => {
    const initial = createClassificationJob("job-1");
    const failed = transitionJob(initial, "processing-complete");

    expect(failed.processing).toBe("failed");
    expect(failed.upload).toBe("idle");
    expect(failed.validation).toBe("pending");
  });
});

describe("classification result table behavior", () => {
  const rows = [
    { id: "row-1", member: "홍길동", category: "번역 전문가", status: "needs-review" as const, selected: false },
    { id: "row-2", member: "김관리", category: "영상 편집자", status: "confirmed" as const, selected: false }
  ];

  it("selects all rows in one bulk action", () => {
    const selected = bulkSelectRows(rows, true);

    expect(selected.every((row) => row.selected)).toBe(true);
  });

  it("updates one editable classification cell and returns it to needs-review", () => {
    const edited = applyInlineEdit(rows, "row-2", "category", "AI 콘텐츠 에디터");

    expect(edited[1]).toMatchObject({
      category: "AI 콘텐츠 에디터",
      status: "needs-review"
    });
  });
});
