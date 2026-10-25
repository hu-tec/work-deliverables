"use client";
// 역할 + 응시자 세션 상태(접수/결제/응시/결과/자격증) 통합 스토어.
// 세션 상태는 localStorage 영속화 (데모 — 백엔드 없이 클릭 플로우 시연).
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Role } from "@/lib/roles";
import type {
  Application,
  ExamineeProfile,
  Inquiry,
  InquiryCategory,
} from "@/lib/types";
import { getExamById, computeRegisterStatus } from "@/lib/demo-exams";

interface Store {
  hydrated: boolean;
  role: Role;
  setRole: (r: Role) => void;
  applications: Application[];
  profile: ExamineeProfile;
  inquiries: Inquiry[];
  apply: (examId: string) => string | null; // returns appId
  pay: (appId: string) => void;
  cancelApplication: (appId: string) => void;
  startExam: (appId: string) => void;
  submitExam: (appId: string, answers: Record<string, string>) => void;
  simulateGrading: (appId: string, pass: boolean, score: number) => void; // 데모 전용
  requestCert: (appId: string) => void;
  updateProfile: (patch: ExamineeProfile) => void;
  createInquiry: (data: {
    category: InquiryCategory;
    title: string;
    body: string;
  }) => void;
  markInquiryAnswered: (id: string) => void;
  reset: () => void;
}

const Ctx = createContext<Store | null>(null);

const LS_ROLE = "hxc.role";
const LS_APPS = "hxc.applications";
const LS_PROFILE = "hxc.examineeProfile";
const LS_INQUIRIES = "hxc.inquiries";

const DEFAULT_PROFILE: ExamineeProfile = {
  name: "홍길동",
  email: "student@example.com",
  phone: "010-1234-5678",
  birthDate: "1998-01-01",
  address: "서울특별시 강남구",
  marketingConsent: false,
};

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4)}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [role, setRoleState] = useState<Role>("guest");
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<ExamineeProfile>(DEFAULT_PROFILE);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const r = localStorage.getItem(LS_ROLE) as Role | null;
      if (r) setRoleState(r);
      const a = localStorage.getItem(LS_APPS);
      if (a) setApplications(JSON.parse(a));
      const p = localStorage.getItem(LS_PROFILE);
      if (p) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(p) });
      const q = localStorage.getItem(LS_INQUIRIES);
      if (q) setInquiries(JSON.parse(q));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_ROLE, role);
    } catch {
      /* ignore */
    }
  }, [role, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_APPS, JSON.stringify(applications));
    } catch {
      /* ignore */
    }
  }, [applications, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_PROFILE, JSON.stringify(profile));
    } catch {
      /* ignore */
    }
  }, [profile, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_INQUIRIES, JSON.stringify(inquiries));
    } catch {
      /* ignore */
    }
  }, [inquiries, hydrated]);

  const setRole = (r: Role) => setRoleState(r);

  const apply = (examId: string): string | null => {
    const ex = getExamById(examId);
    if (!ex) return null;
    if (computeRegisterStatus(ex) !== "접수 중") return null;
    // 이미 접수한 시험인지 확인 (취소 제외)
    const existing = applications.find(
      (a) => a.examId === examId && a.registerStatus !== "접수 취소",
    );
    if (existing) return existing.id;
    const id = uid("APP");
    const app: Application = {
      id,
      examId,
      appliedAt: new Date().toISOString(),
      registerStatus: "접수 완료",
      paymentStatus: "결제대기",
      examStatus: "시험 전",
      resultStatus: "미발표",
    };
    setApplications((prev) => [app, ...prev]);
    return id;
  };

  const update = (appId: string, patch: Partial<Application>) =>
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, ...patch } : a)),
    );

  const pay = (appId: string) => update(appId, { paymentStatus: "결제완료" });

  const cancelApplication = (appId: string) =>
    update(appId, {
      registerStatus: "접수 취소",
      paymentStatus: "환불신청",
    });

  const startExam = (appId: string) => update(appId, { examStatus: "시험 중" });

  const submitExam = (appId: string, answers: Record<string, string>) =>
    update(appId, {
      examStatus: "시험 완료",
      submittedAt: new Date().toISOString(),
      answers,
      scoringStatus: "채점 요청",
      resultStatus: "채점중",
    });

  // 데모 전용: 실제 채점/점수가 없으므로 사용자가 명시적으로 결과를 시뮬레이션
  const simulateGrading = (appId: string, pass: boolean, score: number) =>
    update(appId, {
      scoringStatus: "채점 완료",
      resultStatus: pass ? "합격" : "불합격",
      score,
      certStatus: pass ? "신청가능" : undefined,
    });

  const requestCert = (appId: string) =>
    update(appId, { certStatus: "신청완료" });

  const updateProfile = (patch: ExamineeProfile) => setProfile(patch);

  const createInquiry = (data: {
    category: InquiryCategory;
    title: string;
    body: string;
  }) =>
    setInquiries((prev) => [
      {
        id: uid("INQ"),
        category: data.category,
        title: data.title,
        body: data.body,
        status: "접수",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

  const markInquiryAnswered = (id: string) =>
    setInquiries((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              status: "답변완료",
              answer:
                "문의 내용을 확인했습니다. 실제 운영 환경에서는 담당자 답변이 이 영역에 표시됩니다.",
              answeredAt: new Date().toISOString(),
            }
          : q,
      ),
    );

  const reset = () => {
    setApplications([]);
    setProfile(DEFAULT_PROFILE);
    setInquiries([]);
  };

  return (
    <Ctx.Provider
      value={{
        hydrated,
        role,
        setRole,
        applications,
        profile,
        inquiries,
        apply,
        pay,
        cancelApplication,
        startExam,
        submitExam,
        simulateGrading,
        requestCert,
        updateProfile,
        createInquiry,
        markInquiryAnswered,
        reset,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within AppProvider");
  return ctx;
}
