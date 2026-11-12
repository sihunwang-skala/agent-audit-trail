import { createContext, ReactNode, useCallback, useContext, useState } from "react";

// English source strings are keys. User-facing labels and explanatory API text are localized;
// protocol identifiers remain visible in parentheses where useful.
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
  "Normal purchase": "정상 구매", "Headphones (120,000 KRW) within every delegated limit.": "헤드폰(120,000원)을 모든 위임 한도 안에서 구매합니다.",
  "Over-budget attempt": "예산 초과 시도", "Quantity 2 of a 190,000 KRW monitor exceeds the 300,000 KRW budget.": "190,000원 모니터 2개는 예산 300,000원을 넘습니다.",
  "Duplicate request": "중복 요청", "The same request with the same idempotency key is sent twice.": "같은 멱등성 키로 같은 요청을 두 번 보냅니다.",
  "Merchant mismatch": "가맹점 금액 불일치", "Merchant quotes 80,000 KRW but its signed confirmation charges 95,000 KRW.": "가맹점이 80,000원으로 견적을 내고 서명된 확인서에는 95,000원을 청구합니다.",
  "Merchant error": "가맹점 오류", "Merchant returns an error; no order should exist.": "가맹점이 오류를 반환하며 주문은 생기지 않아야 합니다.",
  "Merchant timeout": "가맹점 응답 없음", "No merchant response: outcome stays UNKNOWN.": "가맹점 응답이 없어 결과가 UNKNOWN으로 남습니다.",
  "Unlisted merchant": "허용되지 않은 가맹점", "Merchant is not on the delegation allow-list.": "위임의 허용 가맹점 목록에 없는 가맹점입니다.",
  "Purchase, then cancel": "구매 후 취소", "Buys a cable then requests cancellation (merchant approves).": "케이블을 구매한 뒤 취소를 요청합니다(가맹점이 승인).",
  "Cancel rejected by merchant": "가맹점이 취소 거절", "Non-cancellable item: merchant rejects the cancellation.": "취소 불가 상품이라 가맹점이 취소를 거절합니다.",
  "Time": "시간", "Event": "이벤트", "Decision": "결정", "Status": "상태", "Evidence level": "증거 등급", "Product": "상품", "Merchant": "가맹점",
  "Category": "카테고리", "Price": "가격", "Delivery": "배송", "Cancellable": "취소 가능", "Stage": "단계", "Field": "항목", "Expected": "기대값", "Observed": "관측값",
  "1. Select a transaction": "1. 거래 선택", "Choose…": "선택…", "Open dispute": "분쟁 접수", "Disputes": "분쟁 목록", "None yet.": "아직 없습니다.",
  "Open or select a dispute to compare evidence.": "분쟁을 접수하거나 선택하면 증거를 비교할 수 있습니다.",
  "Violated conditions": "위반된 조건", "None recorded.": "기록 없음", "Discrepancies between sources": "출처 간 불일치", "None detected.": "발견되지 않음",
  "Evidence by party": "당사자별 증거", "Not established (unknowns)": "확정되지 않은 사실", "Recovery (simulated)": "복구 (시뮬레이션)",
  "Request cancellation from mock merchant": "모의 가맹점에 취소 요청", "Close dispute": "분쟁 종료",
  "Language": "언어", "Delete ALL demo data (delegations, receipts, disputes)?": "모든 데모 데이터(위임, 영수증, 분쟁)를 삭제할까요?",
  "New version of": "새 버전:", "required": "필수", "not required": "필수 아님", "allowed": "허용", "approval per action": "행동마다 승인 필요",
  " min after approval": "분 후 만료", "Receipts for": "영수증:", "Result:": "실행 결과:", "Action:": "행동:",
  " on ": " 상품 ", " · agent ": " · 에이전트 ", " · delegation ": " · 위임 ",
  "Receipt": "영수증",
  "Acting under delegation ": "위임 ", ". The mock agent calls the same Gateway API a real agent would.": "에 따라 실행 중입니다. 모의 에이전트는 실제 에이전트와 같은 게이트웨이 API를 호출합니다.",
  "idempotent replay: no second execution": "멱등성 재요청: 두 번째 실행은 발생하지 않음", "authorized ": "승인 금액 ", " · merchant charged ": " · 가맹점 청구 금액 ",
  "View receipts for ": "영수증 보기: ", "spent ": "사용 ", ", left ": ", 잔액 ",
  "Action": "행동", "Policy reasons (violations):": "정책 사유 (위반 항목):", "All ": "전체 ", " deterministic checks passed.": "개 결정론적 검사를 통과했습니다.",
  "Merchant response (": "가맹점 응답 (", ") type: ": ") 유형: ", "hash ": "해시 ", "prev ": "이전 해시 ",
  "Hash matches content: ": "해시와 내용 일치: ", "Ed25519 signature valid: ": "Ed25519 서명 유효: ", "Chain link to previous receipt: ": "이전 영수증과 체인 연결 유효: ",
  "Merchant signature (simulated): ": "가맹점 서명 (시뮬레이션): ", "n/a": "해당 없음", "Chain valid (": "체인 유효 (", " receipts)": "개 영수증)", "Chain INVALID: ": "체인 무효: ",
  "No evidence": "증거 없음", "no evidence": "증거 없음", "Transaction ": "거래 ", " is ": " 상태: ", ". Failed stage: ": ". 실패 단계: ",
  "none detected": "감지되지 않음", "Responsibility: ": "책임 판단: ", "Cancellation possible: ": "취소 가능 여부: ", "yes (merchant may still reject)": "가능 (가맹점이 거절할 수 있음)",
  "no": "아니요", "cancellation unavailable": "불가", "Merchant result: ": "가맹점 처리 결과: ", " (no real refund, chargeback or insurance payout exists in this MVP)": " (이 MVP에는 실제 환불, 차지백 또는 보험금 지급 기능이 없습니다)", "Charged: ": "청구 금액: ",
  "This purchase looks wrong": "이 구매 내역에 문제가 있는 것 같습니다", "This purchase looks wrong.": "이 구매 내역에 문제가 있는 것 같습니다.",
  "Backend unreachable: ": "백엔드에 연결할 수 없습니다: ", "Amount exceeds remaining budget": "요청 금액이 남은 예산을 초과합니다", "Merchant is not on the allow-list": "가맹점이 허용 목록에 없습니다",
  "The merchant outcome is unknown": "가맹점 처리 결과를 알 수 없습니다", "AgentTrust records and compares evidence only. It does not determine legal responsibility, " : "AgentTrust는 증거를 기록하고 비교할 뿐 법적 책임을 판정하지 않습니다. ",
  "Single-server signature; see SECURITY.md for limits": "단일 서버 서명입니다. 한계는 SECURITY.md를 참고하세요", "revoked on Demo Trusted Surface": "데모 신뢰 화면에서 철회됨", "user cancellation request": "사용자 취소 요청", "closure does not assign responsibility": "분쟁 종료는 책임을 판정하지 않습니다",
  "user": "사용자", "agent": "에이전트", "gateway": "게이트웨이", "merchant": "가맹점", "electronics": "전자제품",
  "Headphones": "헤드폰", "Monitor": "모니터", "Cable": "케이블", "Electronics": "전자제품", "true": "예", "false": "아니요",
  "ALLOW": "허용 (ALLOW)", "DENY": "거부 (DENY)", "REQUIRE_APPROVAL": "승인 필요 (REQUIRE_APPROVAL)",
  "EXECUTED": "실행 완료 (EXECUTED)", "DENIED": "거부됨 (DENIED)", "FAILED": "실패 (FAILED)", "UNKNOWN": "알 수 없음 (UNKNOWN)", "DISCREPANCY": "불일치 (DISCREPANCY)", "CANCELLED": "취소됨 (CANCELLED)",
  "ACTIVE": "활성 (ACTIVE)", "REVOKED": "철회됨 (REVOKED)", "EXPIRED": "만료됨 (EXPIRED)", "PENDING_APPROVAL": "승인 대기 (PENDING_APPROVAL)", "SUPERSEDED": "새 버전으로 대체됨 (SUPERSEDED)", "OPEN": "진행 중 (OPEN)", "CLOSED": "종료됨 (CLOSED)",
  "AUTHORIZED": "승인됨 (AUTHORIZED)", "REJECTED": "거절됨 (REJECTED)", "SELF_REPORTED": "자체 보고 (SELF_REPORTED)", "GATEWAY_VERIFIED": "게이트웨이 검증 (GATEWAY_VERIFIED)", "MERCHANT_CONFIRMED": "가맹점 확인 (MERCHANT_CONFIRMED)",
  "BUDGET_EXCEEDED": "예산 초과 (BUDGET_EXCEEDED)", "MERCHANT_NOT_ALLOWED": "허용되지 않은 가맹점 (MERCHANT_NOT_ALLOWED)", "NOT_DETERMINED": "판단하지 않음 (NOT_DETERMINED)",
  "ALLOWED": "허용", "BLOCKED": "차단", "REQUIRED": "필수", "NOT_REQUIRED": "필수 아님",
  "normal_purchase": "정상 구매", "over_budget": "예산 초과 시도", "duplicate_request": "중복 요청", "merchant_mismatch": "가맹점 금액 불일치", "merchant_failure": "가맹점 오류", "merchant_timeout": "가맹점 응답 시간 초과", "unlisted_merchant": "허용되지 않은 가맹점", "cancel_request": "구매 후 취소", "cancel_rejected": "가맹점이 취소 거절",
  "agent_submit": "에이전트 요청", "merchant_quote": "가맹점 견적", "merchant_execute": "가맹점 실행", "approve": "승인", "reject": "거절",
  "product_id": "상품 ID", "merchant_id": "가맹점 ID", "unit_price_krw": "개당 가격 (KRW)", "free_returns": "무료 반품", "delivery_days": "배송 기간 (일)", "cancellable": "취소 가능",
  "days": "일", " days": "일", "expected ": "기대값 ", "merchant reported ": "가맹점 보고값 ",
  "Dispute reason": "분쟁 사유",
  "ACTION_REQUESTED": "행동 요청", "POLICY_DECISION": "정책 결정", "DELEGATION_CREATED": "위임 생성", "DELEGATION_APPROVED": "위임 승인", "DELEGATION_REVISED": "위임 개정", "DELEGATION_REVOKED": "위임 철회",
  "EXECUTION_RESULT": "실행 결과", "PURCHASE_AUTHORIZED": "구매 승인", "DISPUTE_OPENED": "분쟁 접수", "CANCEL_REQUESTED": "취소 요청", "CANCEL_REJECTED": "취소 거절", "CANCEL_APPROVED": "취소 승인", "TRANSACTION_STATE_CHANGED": "거래 상태 변경",
  "DELEGATION_ACTIVE": "위임 활성", "MERCHANT_EXECUTION": "가맹점 실행", "merchant_confirmation": "가맹점 확인", "gateway signed quote": "게이트웨이 서명 견적", "simulated merchant confirmation": "모의 가맹점 확인",
  "MERCHANT_AMOUNT_MISMATCH": "가맹점 청구 금액 불일치", "The merchant charged more than the signed quote.": "가맹점이 서명된 견적보다 많은 금액을 청구했습니다.",
  "Gateway approved the purchase under the active delegation.": "게이트웨이가 활성 위임에 따라 구매를 승인했습니다.", "The agent reported that the user requested headphones.": "에이전트는 사용자가 헤드폰을 요청했다고 보고했습니다.",
  "Gateway recorded a quoted amount of 80,000 KRW.": "게이트웨이는 견적 금액을 80,000원으로 기록했습니다.", "Simulated merchant confirmation reports a charge of 95,000 KRW.": "모의 가맹점 확인에는 95,000원 청구로 기록되어 있습니다.",
  "Delegation dlg_demo_001 v1 recorded by the gateway; approved on the demo trusted surface.": "게이트웨이가 위임 dlg_demo_001 v1을 기록했습니다. 데모 신뢰 화면에서 승인되었습니다.", "The agent reported that it requested the purchase.": "에이전트는 구매를 요청했다고 보고했습니다.",
  "Whether the user saw the final amount before the purchase.": "구매 전에 사용자가 최종 금액을 확인했는지 알 수 없습니다.", "Whether the merchant will accept a cancellation request.": "가맹점이 취소 요청을 수락할지는 알 수 없습니다.",
  "The merchant-side outcome is unknown: it is not established by the available evidence": "가용한 증거만으로는 가맹점 측 처리 결과를 확인할 수 없습니다.", "Why the sources disagree is not established by the available evidence": "가용한 증거만으로는 출처 간 불일치가 발생한 이유를 확인할 수 없습니다.",
  "Whether any real payment settlement occurred: no payment provider is integrated (PAYMENT_CONFIRMED is never issued)": "실제 결제가 정산되었는지 확인할 수 없습니다. 결제 서비스가 연동되지 않아 PAYMENT_CONFIRMED는 발급되지 않습니다.",
  "Merchant-confirmed order exists. A cancellation can be requested; the merchant may still reject it": "가맹점이 확인한 주문이 있습니다. 취소를 요청할 수 있지만 가맹점이 거절할 수도 있습니다.", "Already cancelled": "이미 취소되었습니다", "No order was placed (denied by policy)": "정책에 따라 거부되어 주문이 생성되지 않았습니다.",
  "Offline": "오프라인",
  "This field is required": "필수 입력 항목입니다", "Not found": "항목을 찾을 수 없습니다", "Internal Server Error": "서버 내부 오류가 발생했습니다",
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
