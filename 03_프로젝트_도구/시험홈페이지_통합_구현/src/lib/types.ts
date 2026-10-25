// 시험 플랫폼 도메인 타입 (2024 IA + 항목사전 기준)

// ===== 분류/급수 (실제 정리DB) =====
export interface Classification {
  id: string;
  large: string; // 대분류
  medium: string; // 중분류
  small: string; // 소분류
  source: { file: string; row: string };
}

export interface Grade {
  id: string;
  examType: string; // 시험종류 (프롬/번역/윤리)
  gradeGroup: string; // 등급구분 (교육/일반/전문)
  grade: string; // 급수 (1급~8급)
  source: { file: string; row: string };
}

export interface ExamGrade {
  id: string;
  gradeGroup: string;
  detailGrade: string;
  source: { file: string; row: string };
}

export interface ExamSettingGroup {
  setting: string; // 설정항목
  values: string[]; // 선택값들
}

export interface FieldDictEntry {
  colNo: string;
  area: string;
  name: string;
  example: string;
  source: { file: string };
}

// ===== 문제은행 (실제 정리DB) =====
export interface Question {
  id: string;
  field: string; // 분야(파일 단위)
  large: string;
  medium: string;
  small: string;
  originalNo: string;
  questions: string[]; // 시험문제 안1~3 (있는 것만)
  answers: string[]; // 답안자료 안1~2 (있는 것만)
  modelAnswer: string; // 모범답안(채점자용) — 응시자 비공개
  memo: string;
  source: { file: string; row: string };
}

export interface QuestionBankIndexEntry {
  field: string;
  count: number;
  withQuestion: number;
  withModelAnswer: number;
}

// ===== 시험 회차 (실제 옵션값 + 데모 일정) =====
export type ExamSubject = string; // 시험종목: AI번역/프롬프트/ITT 시험/윤리시험/테솔
export type QuestionType = "객관식" | "주관식" | "단답형" | "프롬프트" | "번역";

export interface ExamOffering {
  id: string;
  round: string; // 회차 (데모)
  subject: ExamSubject; // 시험종목 (실제 DB)
  gradeGroup: string; // 등급구분 (실제 DB)
  grade: string; // 급수 (실제 DB)
  fieldLarge: string; // 분야 대분류 (실제 DB)
  fieldMedium: string; // 분야 중분류 (실제 DB)
  region: string; // 지역 (실제 DB)
  fee: number; // 응시료 (실제 DB 금액)
  questionTypes: QuestionType[]; // 교시 구성 기반
  registerStart: string; // 접수 시작 (데모)
  registerEnd: string; // 접수 종료 (데모)
  examDate: string; // 시험일 (데모)
  examStart: string; // 시작 시각 (데모)
  examEnd: string; // 종료 시각 (데모)
  resultDate: string; // 성적 발표일 (데모)
  capacity: number; // 정원 (데모)
  applied: number; // 접수 인원 (데모)
  questionFields: string[]; // 연결된 문제은행 분야
  isDemo: true; // 일정/회차/정원은 시연용 데모
}

// ===== 상태값 (항목사전 기준 실제 상태 문자열) =====
export type RegisterStatus = "접수 전" | "접수 중" | "접수 완료" | "접수 취소";
export type PaymentStatus =
  | "결제대기"
  | "결제완료"
  | "결제미승인"
  | "환불신청"
  | "환불완료";
export type ExamStatus =
  | "시험 전"
  | "시험 시작"
  | "시험 중"
  | "시험 완료"
  | "시험 취소";
export type ScoringStatus =
  | "채점 요청"
  | "채점 중"
  | "채점 완료"
  | "자동 채점 완료"
  | "승인 완료";
export type ResultStatus = "채점중" | "합격" | "불합격" | "미발표";
export type CertStatus = "신청가능" | "신청완료" | "발급중" | "발급완료";

// ===== 응시자 세션 상태 (클라이언트 데모 상태) =====
export interface Application {
  id: string;
  examId: string;
  appliedAt: string;
  registerStatus: RegisterStatus;
  paymentStatus: PaymentStatus;
  examStatus: ExamStatus;
  resultStatus: ResultStatus;
  scoringStatus?: ScoringStatus;
  score?: number;
  certStatus?: CertStatus;
  answers?: Record<string, string>; // questionId -> 답안
  submittedAt?: string;
  aiEval?: AiEvalResult; // AI 평가 placeholder
}

// ===== 수험생 지원/내 정보 (클라이언트 데모 상태) =====
export interface ExamineeProfile {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  marketingConsent: boolean;
}

export type InquiryCategory =
  | "접수/결제"
  | "시험 응시"
  | "시험 결과"
  | "자격증"
  | "회원정보"
  | "기타";
export type InquiryStatus = "접수" | "처리중" | "답변완료";

export interface Inquiry {
  id: string;
  category: InquiryCategory;
  title: string;
  body: string;
  status: InquiryStatus;
  createdAt: string;
  answer?: string;
  answeredAt?: string;
}

// ===== AI 평가 (26 vibe placeholder) =====
export type EvalVersion = "대학생" | "일반인" | "전문가";
export interface AiEvalResult {
  version: EvalVersion;
  status: "placeholder"; // 실제 연동 전 — 틀만
  note: string;
}
