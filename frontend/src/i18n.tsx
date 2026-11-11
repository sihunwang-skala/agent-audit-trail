import { createContext, ReactNode, useCallback, useContext, useState } from "react";

// Minimal EN/KO switch. English strings are the keys; only the text a reader needs to navigate the UI is translated.
// Codes, enum values, receipt data and text returned by the API stay in English on purpose.
export type Lang = "en" | "ko";

const KO: Record<string, string> = {
  "DEMO / MOCK DATA ONLY: simulated merchant, no real payments or personal data. Approvals happen on a Demo Trusted Surface and are not cryptographically signed by the user. AgentTrust does not determine legal responsibility.":
    "데모 / 가상 데이터 전용: 시뮬레이션 가맹점이며 실제 결제나 개인정보는 없습니다. 승인은 데모 신뢰 화면에서 이뤄지고 사용자의 암호학적 서명이 아닙니다. AgentTrust는 법적 책임을 판정하지 않습니다.",
  "Dashboard": "대시보드", "Delegation": "위임", "Agent Simulator": "에이전트 시뮬레이터", "Receipt Explorer": "영수증 탐색기",
  "Dispute & Recovery": "분쟁 및 복구", "Reset demo data": "데모 데이터 초기화", "Loading…": "불러오는 중…",
  "Total agent actions": "전체 에이전트 행동", "Approved actions": "승인된 행동", "Blocked actions": "차단된 행동",
  "Awaiting user approval": "사용자 승인 대기", "Open disputes": "진행 중 분쟁", "Recent receipts": "최근 영수증",
  "Open explorer": "탐색기 열기",
  "No receipts yet. Create a delegation, then run the Agent Simulator.": "아직 영수증이 없습니다. 위임을 만든 뒤 에이전트 시뮬레이터를 실행하세요.",
  "Create delegation": "위임 생성", "Agent ID": "에이전트 ID", "Total budget (KRW)": "총 예산 (KRW)", "Max per item (KRW)": "품목당 최대 (KRW)",
  "Allowed categories (comma separated)": "허용 카테고리 (쉼표로 구분)", "Allowed merchant IDs (comma separated)": "허용 가맹점 ID (쉼표로 구분)",
  "Max delivery days": "최대 배송일", "Valid for (minutes, counted from approval)": "유효 시간 (분, 승인 시점부터)",
  "Require free returns": "무료 반품 필수", "Allow automatic purchase (otherwise each action needs your approval)": "자동 구매 허용 (끄면 행동마다 사용자 승인 필요)",
  "Create delegation (pending)": "위임 생성 (승인 대기)", "Create new version (pending)": "새 버전 생성 (승인 대기)", "Cancel": "취소",
  "A delegation has no effect until you explicitly approve it. Approval is recorded on the Demo Trusted Surface and is NOT a cryptographic signature by you.":
    "위임은 직접 승인하기 전까지 효력이 없습니다. 승인은 데모 신뢰 화면에 기록되며 사용자의 암호학적 서명이 아닙니다.",
  "No delegations yet.": "아직 위임이 없습니다.", "Agent": "에이전트", "Budget": "예산", "Per item max": "품목당 최대", "Categories": "카테고리",
  "Merchants": "가맹점", "Free returns": "무료 반품", "Auto purchase": "자동 구매", "Expires": "만료",
  "Approve (demo surface)": "승인 (데모 화면)", "Revoke": "철회", "Revise (new version)": "개정 (새 버전)",
  "Select for simulator": "시뮬레이터에 선택", "Selected for simulator": "시뮬레이터에 선택됨",
  "Mock Agent scenarios": "모의 에이전트 시나리오", "Run": "실행", "Create and approve a delegation first (Delegation tab), then select it.":
    "먼저 위임 탭에서 위임을 만들고 승인한 뒤 선택하세요.", "Mock merchant catalog (synthetic, simulated)": "모의 가맹점 카탈로그 (가상·시뮬레이션)",
  "Approve this action": "이 행동 승인", "Reject": "거절",
  "All receipts (hash chain order)": "전체 영수증 (해시 체인 순서)", "Show all": "전체 보기", "Verify whole chain": "전체 체인 검증",
  "Export JSON": "JSON 내보내기", "Timeline": "타임라인", "Verifiable evidence": "검증 가능한 증거",
  "Unverified claims / unknowns": "검증되지 않은 주장 / 미확정 사항", "Signature & hash verification": "서명 및 해시 검증",
  "Verify this receipt": "이 영수증 검증", "No receipts.": "영수증이 없습니다.",
  "Merchant confirmation comes from a simulated merchant. PAYMENT_CONFIRMED does not exist in this MVP.":
    "가맹점 확인은 시뮬레이션 가맹점에서 온 것입니다. 이 MVP에는 PAYMENT_CONFIRMED가 없습니다.",
  "None recorded in this receipt.": "이 영수증에는 기록된 항목이 없습니다.",
  "1. Select a transaction": "1. 거래 선택", "Choose…": "선택…", "Open dispute": "분쟁 접수", "Disputes": "분쟁 목록", "None yet.": "아직 없습니다.",
  "Open or select a dispute to compare evidence.": "분쟁을 접수하거나 선택하면 증거를 비교할 수 있습니다.",
  "Violated conditions": "위반된 조건", "None recorded.": "기록 없음", "Discrepancies between sources": "출처 간 불일치", "None detected.": "발견되지 않음",
  "Evidence by party": "당사자별 증거", "Not established (unknowns)": "확정되지 않은 사실", "Recovery (simulated)": "복구 (시뮬레이션)",
  "Request cancellation from mock merchant": "모의 가맹점에 취소 요청", "Close dispute": "분쟁 종료",
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void };
const LangCtx = createContext<Ctx>({ lang: "en", setLang: () => {} });

function initial(): Lang {
  try { const v = window.localStorage.getItem("agenttrust.lang"); if (v === "ko" || v === "en") return v; } catch { /* storage unavailable */ }
  return "en";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial);
  const setLang = useCallback((l: Lang) => { setLangState(l); try { window.localStorage.setItem("agenttrust.lang", l); } catch { /* ignore */ } }, []);
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

export function useT() {
  const { lang } = useLang();
  return (s: string) => (lang === "ko" ? KO[s] ?? s : s);
}
