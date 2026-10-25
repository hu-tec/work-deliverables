// 실제 정리DB 시드(data/*.json) 접근 레이어. 정적 import 후 타입 캐스팅.
import classificationJson from "@data/classification.json";
import gradesJson from "@data/grades.json";
import examGradesJson from "@data/exam-grades.json";
import examSettingsJson from "@data/exam-settings.json";
import fieldDictJson from "@data/field-dictionary.json";
import qbIndexJson from "@data/question-bank-index.json";

import qbDev from "@data/question-bank/개발.json";
import qbHealth from "@data/question-bank/건강.json";
import qbRel from "@data/question-bank/관계교육.json";
import qbDoc from "@data/question-bank/문서작성.json";
import qbLife from "@data/question-bank/생활기타.json";
import qbVideo from "@data/question-bank/영상콘텐츠.json";
import qbAudio from "@data/question-bank/음성콘텐츠.json";
import qbFin from "@data/question-bank/재무생활.json";
import qbPro from "@data/question-bank/전문분야.json";
import qbCreate from "@data/question-bank/창작활동.json";
import qbJob from "@data/question-bank/취업.json";
import qbTrans from "@data/question-bank/통번역.json";

import type {
  Classification,
  Grade,
  ExamGrade,
  ExamSettingGroup,
  FieldDictEntry,
  Question,
  QuestionBankIndexEntry,
} from "./types";

export const classification = classificationJson as Classification[];
export const grades = gradesJson as Grade[];
export const examGrades = examGradesJson as ExamGrade[];
export const examSettings = examSettingsJson as ExamSettingGroup[];
export const fieldDictionary = fieldDictJson as FieldDictEntry[];
export const questionBankIndex = qbIndexJson as QuestionBankIndexEntry[];

export const questionBank: Record<string, Question[]> = {
  개발: qbDev as Question[],
  건강: qbHealth as Question[],
  관계교육: qbRel as Question[],
  문서작성: qbDoc as Question[],
  생활기타: qbLife as Question[],
  영상콘텐츠: qbVideo as Question[],
  음성콘텐츠: qbAudio as Question[],
  재무생활: qbFin as Question[],
  전문분야: qbPro as Question[],
  창작활동: qbCreate as Question[],
  취업: qbJob as Question[],
  통번역: qbTrans as Question[],
};

// ---- 조회 헬퍼 ----
export function getSetting(name: string): string[] {
  return examSettings.find((s) => s.setting === name)?.values ?? [];
}

export function getQuestionsByFields(fields: string[]): Question[] {
  return fields.flatMap((f) => questionBank[f] ?? []);
}

export function getAllQuestions(): Question[] {
  return Object.values(questionBank).flat();
}

/** 대분류 → 중분류 목록 */
export function getMediumsByLarge(large: string): string[] {
  return Array.from(
    new Set(
      classification
        .filter((c) => c.large === large && c.medium)
        .map((c) => c.medium),
    ),
  );
}

export function getLargeCategories(): string[] {
  return Array.from(new Set(classification.map((c) => c.large)));
}
