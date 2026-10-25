export type UploadStatus = "idle" | "uploading" | "uploaded" | "failed";
export type ValidationStatus = "pending" | "validating" | "valid" | "invalid";
export type ProcessingStatus = "pending" | "running" | "complete" | "failed";
export type ReviewStatus = "not-started" | "in-review" | "needs-changes" | "complete";
export type ApplyStatus = "waiting" | "saved" | "applied" | "failed";

export type ClassificationEvent =
  | "upload-start"
  | "upload-complete"
  | "upload-fail"
  | "validation-ok"
  | "validation-fail"
  | "processing-start"
  | "processing-complete"
  | "processing-fail"
  | "review-start"
  | "review-complete"
  | "apply-save"
  | "apply-complete"
  | "apply-fail";

export type ClassificationJob = {
  id: string;
  upload: UploadStatus;
  validation: ValidationStatus;
  processing: ProcessingStatus;
  review: ReviewStatus;
  apply: ApplyStatus;
};

export type UploadCandidate = {
  name: string;
  size: number;
};

export type UploadValidation = {
  ok: boolean;
  errors: string[];
};

export type ClassificationRow = {
  id: string;
  member: string;
  category: string;
  status: "needs-review" | "confirmed" | "failed";
  selected: boolean;
};

const supportedExtensions = new Set(["csv", "xls", "xlsx"]);
const maxUploadSize = 1024 * 1024 * 20;

export function validateUploadFile(file: UploadCandidate): UploadValidation {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const errors: string[] = [];

  if (!supportedExtensions.has(extension)) {
    errors.push("지원하지 않는 파일 형식입니다.");
  }

  if (file.size > maxUploadSize) {
    errors.push("20MB 이하 파일만 업로드할 수 있습니다.");
  }

  return {
    ok: errors.length === 0,
    errors
  };
}

export function createClassificationJob(id: string): ClassificationJob {
  return {
    id,
    upload: "idle",
    validation: "pending",
    processing: "pending",
    review: "not-started",
    apply: "waiting"
  };
}

export function transitionJob(job: ClassificationJob, event: ClassificationEvent): ClassificationJob {
  switch (event) {
    case "upload-start":
      return { ...job, upload: "uploading" };
    case "upload-complete":
      return job.upload === "uploading" || job.upload === "idle"
        ? { ...job, upload: "uploaded", validation: "validating" }
        : { ...job, upload: "failed" };
    case "upload-fail":
      return { ...job, upload: "failed" };
    case "validation-ok":
      return job.upload === "uploaded"
        ? { ...job, validation: "valid", processing: "pending" }
        : { ...job, validation: "invalid" };
    case "validation-fail":
      return { ...job, validation: "invalid" };
    case "processing-start":
      return job.validation === "valid" ? { ...job, processing: "running" } : { ...job, processing: "failed" };
    case "processing-complete":
      return job.validation === "valid"
        ? { ...job, processing: "complete", review: "in-review" }
        : { ...job, processing: "failed" };
    case "processing-fail":
      return { ...job, processing: "failed" };
    case "review-start":
      return job.processing === "complete" ? { ...job, review: "in-review" } : { ...job, review: "needs-changes" };
    case "review-complete":
      return job.processing === "complete" ? { ...job, review: "complete", apply: "saved" } : { ...job, review: "needs-changes" };
    case "apply-save":
      return job.review === "complete" ? { ...job, apply: "saved" } : { ...job, apply: "failed" };
    case "apply-complete":
      return job.review === "complete" ? { ...job, apply: "applied" } : { ...job, apply: "failed" };
    case "apply-fail":
      return { ...job, apply: "failed" };
    default:
      return job;
  }
}

export function bulkSelectRows(rows: ClassificationRow[], selected: boolean): ClassificationRow[] {
  return rows.map((row) => ({ ...row, selected }));
}

export function applyInlineEdit(
  rows: ClassificationRow[],
  rowId: string,
  field: "member" | "category",
  value: string
): ClassificationRow[] {
  return rows.map((row) => (row.id === rowId ? { ...row, [field]: value, status: "needs-review" } : row));
}
