# AgentTrust

**An independent AI Agent Trust Layer (AATL) · AI 에이전트 독립 신뢰 계층**

Verify, record and recover AI agent actions with a deterministic policy gateway, signed hash-chained receipts and an offline verifier.
AI 에이전트의 행동을 결정론적 정책 게이트웨이, 서명된 해시 체인 영수증, 오프라인 검증기로 검증·기록·복구합니다.

![Status: research prototype](https://img.shields.io/badge/status-research%20prototype-orange)
![Data: synthetic only](https://img.shields.io/badge/data-synthetic%20only-blue)
![Payments: none](https://img.shields.io/badge/real%20payments-none-red)
![Tests](https://img.shields.io/badge/tests-67%20backend%20%2B%205%20UI-brightgreen)

> **EN** Local research prototype. All data is synthetic and the merchant is simulated. No real payments, cards, personal data, guarantees or insurance. Not for production, not legal advice, and not a legal-responsibility decision-maker.
>
> **KO** 로컬 연구용 프로토타입입니다. 모든 데이터는 가상이며 가맹점은 시뮬레이션입니다. 실제 결제·카드·개인정보·보증·보험은 없습니다. 운영 용도가 아니며, 법률 자문이나 법적 책임 판정을 하지 않습니다.

**Contents · 목차** — [Problem](#problem--문제) · [Architecture](#architecture--아키텍처) · [Screens](#screens--화면) · [Capabilities](#capabilities--기능) · [Verification](#verification--검증) · [Quick start](#quick-start--실행) · [Limits](#limits-and-trade-offs--한계와-트레이드오프) · [AP2](#relationship-to-ap2--ap2와의-관계) · [Public edition](#public-reference-edition--공개-참고용-버전) · [Copyright](#copyright--usage--저작권-및-이용-안내)

---

## Problem · 문제

**EN** When an AI agent buys or books something for you, three parties each hold only their own story.
**KO** AI 에이전트가 대신 구매하거나 예약할 때, 세 당사자는 각자 자기 쪽 이야기만 갖고 있습니다.

| Party · 당사자 | Need · 필요 |
|---|---|
| **User · 사용자** | Delegate without approving every step, see *why* the agent acted, undo mistakes. <br> 매 단계 승인 없이 위임하고, 에이전트가 *왜* 그렇게 했는지 확인하며, 실수를 되돌리고 싶습니다. |
| **Agent provider · 에이전트 제공자** | Show the agent stayed inside what the user allowed, without exposing prompts, models or workflows. <br> 프롬프트·모델·워크플로를 노출하지 않고, 에이전트가 허용 범위 안에서 움직였음을 보이고 싶습니다. |
| **Merchant · 가맹점** | Tell legitimate purchases from unauthorized ones and hold verifiable evidence in a dispute. <br> 정상 구매와 무단 구매를 구분하고, 분쟁 시 검증 가능한 증거를 갖고 싶습니다. |

**EN** AgentTrust sits between them. **KO** AgentTrust는 이들 사이에 놓입니다.

`User → Delegation → AI Agent → Independent Policy Gateway → (Mock) Merchant → Action Receipt → Verification & Recovery`

## Architecture · 아키텍처

![AgentTrust high-level architecture](docs/architecture.svg)

**EN** The agent is treated as untrusted. Only the gateway's deterministic checks and signed statements count as evidence; whatever the agent or user merely *says* stays labelled `SELF_REPORTED`.
**KO** 에이전트는 신뢰하지 않습니다. 게이트웨이의 결정론적 검사와 서명된 진술만 증거로 인정하고, 에이전트나 사용자가 *말한* 내용은 `SELF_REPORTED`로 남습니다.

## Screens · 화면

Captured from the running demo with synthetic data. · 가상 데이터로 실제 실행한 데모 화면입니다.

### Dashboard · 대시보드
![Dashboard](docs/screenshots/00-dashboard.png)

**EN** Action counts (approved, blocked, awaiting approval, open disputes) and the latest receipts with their evidence level.
**KO** 승인·차단·승인 대기·진행 중 분쟁 건수와, 증거 등급이 붙은 최근 영수증을 보여줍니다.

### Delegation · 위임
![Delegation](docs/screenshots/01-delegation.png)

**EN** Create, approve, revise and revoke a delegation (budget, merchants, categories, expiry). Approval happens on a *Demo Trusted Surface* and is not a user signature.
**KO** 예산·가맹점·카테고리·만료를 정해 위임을 생성, 승인, 개정, 철회합니다. 승인은 *데모 신뢰 화면*에서 이뤄지며 사용자 서명이 아닙니다.

### Agent Simulator · 에이전트 시뮬레이터
![Agent Simulator](docs/screenshots/02-agent-simulator.png)

**EN** A mock agent runs 9 scenarios through the same gateway API a real agent would use (shown: an over-budget attempt denied with `BUDGET_EXCEEDED`).
**KO** 모의 에이전트가 실제 에이전트와 같은 게이트웨이 API로 9개 시나리오를 실행합니다(예시: 예산 초과 시도가 `BUDGET_EXCEEDED`로 거부됨).

### Receipt Explorer · 영수증 탐색기
![Receipt Explorer](docs/screenshots/03-receipt-explorer.png)

**EN** Per-transaction receipts, verifiable evidence shown apart from unverified claims, and in-app hash, signature and chain checks. Merchant signatures are simulated.
**KO** 거래별 영수증을 보여주고, 검증 가능한 증거와 검증되지 않은 주장을 분리하며, 해시·서명·체인 검사를 앱 안에서 수행합니다. 가맹점 서명은 시뮬레이션입니다.

### Dispute & Recovery · 분쟁 및 복구
![Dispute and Recovery](docs/screenshots/04-dispute-recovery.png)

**EN** Evidence by party, source discrepancies (quoted 80,000 KRW vs charged 95,000 KRW), facts that are *not* established, and a simulated cancellation. Responsibility is always `NOT_DETERMINED`.
**KO** 당사자별 증거, 출처 간 불일치(견적 80,000원 vs 청구 95,000원), *확정되지 않은* 사실, 모의 취소를 보여줍니다. 책임 판단은 항상 `NOT_DETERMINED`입니다.

### Korean UI · 한국어 화면
![Dashboard (Korean)](docs/screenshots/05-dashboard-ko.png)
![Dispute and Recovery (Korean)](docs/screenshots/06-dispute-recovery-ko.png)

> **EN** Use the **EN / 한국어** switch in the header. Only navigation, titles, main buttons and key notices are translated; codes, evidence levels, receipt data and API messages stay in English on purpose.
> **KO** 헤더의 **EN / 한국어** 버튼으로 전환합니다. 메뉴, 제목, 주요 버튼, 핵심 안내만 번역하며 코드·증거 등급·영수증 데이터·API 메시지는 의도적으로 영어로 둡니다.

## Capabilities · 기능

| Component · 구성 요소 | EN | KO |
|---|---|---|
| **Delegation Manager** | Explicit create → approve; versioned, immutable once approved; expiry and revocation enforced. | 생성 → 승인의 명시적 흐름, 승인 후 버전 고정(불변), 만료·철회 강제. |
| **Policy Gateway** | Deterministic code (no LLM): `ALLOW` / `DENY` / `REQUIRE_APPROVAL`. Prices come from a merchant-signed quote. Budget reservation, idempotency and receipt append are atomic (SQLite `BEGIN IMMEDIATE`). | LLM 없는 결정론적 코드: `ALLOW` / `DENY` / `REQUIRE_APPROVAL`. 가격은 가맹점이 서명한 견적에서 가져오며, 예산 예약·멱등성·영수증 추가는 원자적입니다(SQLite `BEGIN IMMEDIATE`). |
| **Action Receipts** | Canonical JSON, SHA-256 hash chain, Ed25519 signature; timeline or JSON view. | Canonical JSON, SHA-256 해시 체인, Ed25519 서명, 타임라인/JSON 보기. |
| **Evidence levels** | `SELF_REPORTED`, `GATEWAY_VERIFIED`, `MERCHANT_CONFIRMED` (simulated), `UNKNOWN`. `PAYMENT_CONFIRMED` is never issued. | `SELF_REPORTED`, `GATEWAY_VERIFIED`, `MERCHANT_CONFIRMED`(시뮬레이션), `UNKNOWN`. `PAYMENT_CONFIRMED`는 발급되지 않습니다. |
| **Offline verifier** | `verifier/agenttrust_verify.py` checks hashes, signatures and chain with only a public key. | 공개키만으로 해시·서명·체인을 검증하는 독립 CLI. |
| **Recovery & disputes** | Per-party evidence, failing stage, unknown facts, simulated cancellation (the mock merchant may refuse). No refund, chargeback or payout exists. | 당사자별 증거, 실패 단계, 미확정 사실, 모의 취소(가맹점이 거절 가능). 환불·차지백·지급 기능은 없습니다. |

**Stack · 기술 스택** Python · FastAPI · Pydantic · SQLAlchemy · SQLite · React · TypeScript · Vite · Tailwind · pytest · vitest · Docker Compose · GitHub Actions

## Verification · 검증

**EN** 67 backend tests (pytest) and 5 UI tests (vitest). Adversarial cases are in [`backend/tests/test_adversarial.py`](backend/tests/test_adversarial.py).
**KO** 백엔드 67개(pytest), UI 5개(vitest) 테스트가 있습니다. 공격 시나리오는 [`test_adversarial.py`](backend/tests/test_adversarial.py)에 있습니다.

| Scenario · 시나리오 | Result · 결과 | Status · 상태 |
|---|---|---|
| Edited receipt (hash only / hash recomputed) · 영수증 수정(해시만 / 해시 재계산) | `HASH_MISMATCH` / `BAD_SIGNATURE` | tested |
| Receipt deleted, reordered, duplicated, signature transplanted · 삭제·순서 변경·중복·서명 이식 | chain / sequence / signature failure | tested |
| Evidence level inflated · 증거 등급 부풀리기 | rejected · 거부 | tested |
| Idempotency key replayed or reused with another payload · 멱등성 키 재전송/다른 페이로드로 재사용 | executed once / `409` | tested |
| Replayed approval or cancellation · 승인·취소 재전송 | no second execution · 이중 실행 없음 | tested |
| Concurrent requests on one budget · 동시 요청 예산 경쟁 | budget never exceeded · 예산 초과 없음 | tested |
| Hostile input to the verifier · 검증기에 악의적 입력 | problems reported, no crash · 크래시 없이 문제 보고 | tested |
| **Newest receipts dropped; older genuine export replayed** · **최신 영수증 삭제 / 과거 정상 export 재제시** | **not detected · 탐지 불가** (`test_known_limit_*`) | **open** |

## Quick start · 실행

Requirements · 요구 사항: Python 3.11+, Node 20+ (or Docker · 또는 Docker)

```bash
# backend
cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements-dev.txt
AGENTTRUST_ALLOW_DEMO_RESET=true .venv/bin/uvicorn app.main:default_app --factory --host 127.0.0.1 --port 8000
```
```bash
# frontend (second terminal · 두 번째 터미널)
cd frontend && npm ci && npm run dev    # http://localhost:5173
```
```bash
# or everything with Docker · 또는 Docker로 한 번에
docker compose up --build
```

Tests · 테스트: `cd backend && .venv/bin/python -m pytest -q` · `cd frontend && npm test`
API docs · API 문서: `http://127.0.0.1:8000/docs`, [API.md](API.md) · Walkthrough · 데모 안내: [DEMO.md](DEMO.md)

Offline verification of the committed sample · 커밋된 샘플의 오프라인 검증:
```bash
python verifier/agenttrust_verify.py samples/sample_export.json \
  --public-key samples/gateway_public_key.hex --merchant-public-key samples/mock_merchant_public_key.hex
```

## Limits and trade-offs · 한계와 트레이드오프

| EN | KO |
|---|---|
| Delegation approval is a click on a **Demo Trusted Surface**: there is **no cryptographic proof that the user signed it**. | 위임 승인은 **데모 신뢰 화면**의 클릭일 뿐이며, **사용자가 서명했다는 암호학적 증거가 없습니다**. |
| One server signature plus a hash chain detects *alteration* by anyone without the key, but cannot prove completeness (trailing receipts can be dropped), signer honesty, or third-party independence. | 단일 서버 서명과 해시 체인은 키가 없는 사람의 *변조*는 탐지하지만, 완전성(마지막 영수증 삭제), 서명자의 정직성, 제3자 독립성은 증명하지 못합니다. |
| "Independently auditable" is not "independently assured": anyone can re-check receipts with the public key, but the same operator holds the key. No third party has attested anything. | "독립적으로 감사 가능"과 "독립적으로 보증됨"은 다릅니다. 누구나 공개키로 재검증할 수 있지만 키는 같은 운영자가 갖고 있고, 어떤 제3자도 보증하지 않았습니다. |
| Mock Merchant signatures are **simulation evidence**, not real merchant attestations. No payment provider exists. | 모의 가맹점 서명은 **시뮬레이션 증거**이며 실제 가맹점 증명이 아닙니다. 결제 제공자도 없습니다. |
| No authentication, rate limiting or tenant isolation: bind to localhost only ([SECURITY.md](SECURITY.md)). | 인증·속도 제한·테넌트 격리가 없으므로 localhost에서만 실행하세요([SECURITY.md](SECURITY.md)). |
| Docker Compose and the GitHub Actions workflow are included but were not exercised in the last verification pass. | Docker Compose와 GitHub Actions 워크플로는 포함돼 있으나 마지막 검증에서 실행하지 않았습니다. |

## Relationship to AP2 · AP2와의 관계

**EN** Google's [Agent Payments Protocol (AP2)](https://github.com/google-agentic-commerce/AP2) describes user-approved *mandates* on a trusted surface and signed receipts. AgentTrust borrows that *concept* but **implements none of the AP2 specification and is not AP2-compatible, certified, or affiliated with Google or the AP2 project**. Mapping to AP2 is future work ([ROADMAP.md](ROADMAP.md)).

**KO** Google의 [Agent Payments Protocol(AP2)](https://github.com/google-agentic-commerce/AP2)은 신뢰 화면에서의 사용자 승인 *mandate*와 서명된 영수증을 다룹니다. AgentTrust는 그 *개념*만 참고하며, **AP2 사양을 구현하지 않았고 AP2와 호환되거나 인증받지 않았으며 Google 및 AP2 프로젝트와 무관합니다**. AP2 매핑은 향후 과제입니다([ROADMAP.md](ROADMAP.md)).

## Public reference edition · 공개 참고용 버전

**EN** This is the public portfolio edition: a complete working demo with a deliberately **simplified reference rule set and dispute analysis**. A fuller implementation is not published. In this edition, delegations store `require_free_returns` and `max_delivery_days` but **do not enforce** them, agent-supplied `claimed` values are recorded as `SELF_REPORTED` without cross-checking against the signed quote, and dispute analysis is simpler than a production analysis would be.

**KO** 이 저장소는 포트폴리오용 공개 버전으로, 의도적으로 **단순화한 참고용 규칙과 분쟁 분석**을 담은 완전한 동작 데모입니다. 더 완전한 구현은 공개하지 않습니다. 이 버전에서는 위임의 `require_free_returns`, `max_delivery_days`를 저장만 하고 **적용하지 않으며**, 에이전트가 보낸 `claimed` 값은 서명된 견적과 대조하지 않고 `SELF_REPORTED`로 기록만 하고, 분쟁 분석은 실제 운영용보다 단순합니다.

## Layout · 구조

```
backend/   FastAPI app, SQLAlchemy models, tests, sample generator
frontend/  React + Vite + Tailwind UI, vitest tests
verifier/  standalone offline verifier (depends only on `cryptography`)
samples/   synthetic signed receipts + public keys
docs/      architecture diagram and UI screenshots
```

## Copyright & Usage · 저작권 및 이용 안내

**EN** Copyright © 2026 Sihun Wang. All Rights Reserved. This project is publicly available for viewing and portfolio demonstration purposes. All rights to the original source code, documentation, designs, and project-specific assets are reserved by the author. No permission is granted to reproduce, modify, redistribute, or commercially use the original materials without prior written authorization, except as permitted by applicable law or GitHub's Terms of Service. Third-party libraries, dependencies, and other externally sourced materials remain subject to their respective licenses and ownership rights (see [LICENSE_NOTICES.md](LICENSE_NOTICES.md)). For licensing, collaboration, or commercial inquiries, please contact the repository owner.

**KO** 저작권 © 2026 Sihun Wang. 모든 권리 보유. 이 프로젝트는 열람 및 포트폴리오 시연 목적으로 공개됩니다. 원본 소스 코드, 문서, 디자인 및 프로젝트 고유 자산에 대한 모든 권리는 저작자에게 있습니다. 관련 법령 또는 GitHub 이용약관이 허용하는 범위를 제외하고, 저작자의 사전 서면 허락 없이 원본 자료를 복제, 수정, 재배포하거나 상업적으로 이용할 수 없습니다. 제3자 라이브러리, 의존성 및 외부에서 가져온 자료는 각각의 라이선스와 소유권에 따릅니다([LICENSE_NOTICES.md](LICENSE_NOTICES.md) 참조). 라이선스, 협업 또는 상업적 문의는 저장소 소유자에게 연락해 주십시오.
