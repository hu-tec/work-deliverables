import type { ClassificationJob, ClassificationRow } from "@/lib/classification-state";

export const categories = ["Youtube", "문서", "리서치&분석", "프로그래밍", "이미지,디자인", "음악", "음성", "기타"];

export const metaCategories = ["동시통역", "문서번역", "YouTube", "기타", "웹툰번역"];

export const aiModels = ["ChatGPT", "Gemini", "wrtn.", "다른 AI", "다른 AI", "다른 AI"];

export const formRows = [
  { id: "FRM-2501", name: "문서번역 기본 양식", type: "번역", owner: "관리자", status: "사용", updatedAt: "2025.04.10" },
  { id: "FRM-2502", name: "Youtube 요약 프롬프트", type: "영상", owner: "콘텐츠팀", status: "검수", updatedAt: "2025.04.12" },
  { id: "FRM-2503", name: "법률 문서 검토", type: "전문", owner: "운영자", status: "사용", updatedAt: "2025.04.18" }
];

export const templates = [
  { id: "TMP-01", name: "PDF 번역 후 문서 변환", category: "문서번역", price: 220000, fileType: "PPTX" },
  { id: "TMP-02", name: "전문가 감수 요청", category: "후면 작업", price: 10000, fileType: "DOCX" },
  { id: "TMP-03", name: "유튜브 스크립트 정리", category: "Youtube", price: 55000, fileType: "TXT" }
];

export const cartItems = [
  { id: "cart-1", title: "[문서번역] PDF를 번역 후 문서로 변환", files: "Filename.pdf, Filename.pdf, Filename.pdf, Filename.pdf", from: "한국어", to: "english(us)", price: 220000, selected: true },
  { id: "cart-2", title: "[문서번역] PDF를 번역 후 문서로 변환", files: "Filename.pdf, Filename.pdf, Filename.pdf, Filename.pdf", from: "한국어", to: "english(us)", price: 220000, selected: true },
  { id: "cart-3", title: "[문서번역] PDF를 번역 후 문서로 변환", files: "Filename.pdf, Filename.pdf, Filename.pdf, Filename.pdf", from: "한국어", to: "english(us)", price: 220000, selected: false }
];

export const uploadRows = Array.from({ length: 10 }, (_, index) => ({
  id: `UI24011${String(index).padStart(4, "0")}`,
  name: index % 3 === 0 ? "홍길동(남)" : "일반회원",
  email: "abc@gmail.com",
  status: index % 4 === 0 ? "미응시" : "시험 시작",
  result: index % 3 === 0 ? "불합격" : "합격"
}));

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
