import type { ClassificationJob, ClassificationRow } from "@/lib/classification-state";

export const uploadedFiles = [
  { id: "file-1", name: "회원_시험결과_2501.xlsx", size: "1.8MB", status: "검증 정상", rows: 1240 },
  { id: "file-2", name: "전문가_분류대상.csv", size: "780KB", status: "검증 정상", rows: 386 },
  { id: "file-3", name: "활동관리_오류포함.xls", size: "2.4MB", status: "오류 12건", rows: 412 }
];

export const initialJob: ClassificationJob = {
  id: "VOC-250519-001",
  upload: "uploaded",
  validation: "valid",
  processing: "complete",
  review: "in-review",
  apply: "saved"
};

export const classificationRules = [
  { id: "member-type", label: "회원 유형", value: "정식회원 / 일반회원 / 전문가" },
  { id: "exam", label: "시험 결과", value: "합격 / 불합격 / 미응시" },
  { id: "channel", label: "알림 채널", value: "문자 / 이메일 / 카카오톡" },
  { id: "activity", label: "활동 상태", value: "시험 시작 / 게시완료 / 취소" }
];

export const classificationRows: ClassificationRow[] = Array.from({ length: 12 }, (_, index) => ({
  id: `UI24011${String(index + 1).padStart(4, "0")}`,
  member: index % 3 === 0 ? "홍길동(남) 34세" : "일반회원",
  category: index % 4 === 0 ? "번역 전문가 / 전문1급" : index % 4 === 1 ? "영상 편집자" : "문서생성 에디터",
  status: index % 5 === 0 ? "needs-review" : "confirmed",
  selected: index < 2
}));

export const historyRows = [
  { id: "VOC-250519-001", file: "회원_시험결과_2501.xlsx", status: "반영완료", updatedAt: "2025.05.19 15:10" },
  { id: "VOC-250518-004", file: "전문가_분류대상.csv", status: "검수완료", updatedAt: "2025.05.18 18:42" },
  { id: "VOC-250517-002", file: "활동관리_오류포함.xls", status: "오류있음", updatedAt: "2025.05.17 10:03" }
];
