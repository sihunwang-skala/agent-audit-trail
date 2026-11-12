import { useEffect, useState } from "react";
import { api } from "../api";
import type { Shared } from "../App";
import { Badge, Btn, Card, ErrorNote, Json } from "../ui";
import { useT } from "../i18n";

const VERIFIED = ["GATEWAY_VERIFIED", "MERCHANT_CONFIRMED"];

export default function Receipts({ tick, txFocus, setTxFocus }: Shared) {
  const t = useT();
  const [rs, setRs] = useState<any[]>([]);
  const [sel, setSel] = useState<any>(null);
  const [ver, setVer] = useState<any>(null);
  const [chain, setChain] = useState<any>(null);
  const [view, setView] = useState<"timeline" | "json">("timeline");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api(`/receipts${txFocus ? `?transaction_id=${txFocus}` : ""}`).then((r) => { setRs(r); setSel(r[r.length - 1] ?? null); setVer(null); })
      .catch((e) => setErr(e.message));
  }, [tick, txFocus]);

  const verify = async (r: any) => { try { setVer(await api(`/receipts/${r.receipt_id}/verify`)); } catch (e: any) { setErr(e.message); } };
  const verifyChain = async () => { try { setChain(await api("/receipts/verify-chain")); } catch (e: any) { setErr(e.message); } };
  const download = async () => {
    const data = await api("/receipts/export");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    a.download = "agenttrust-export.json"; a.click();
  };

  return (
    <div className="grid gap-4 md:grid-cols-6">
      <div className="md:col-span-2"><Card title={txFocus ? `${t("Receipts for")} ${txFocus}` : "All receipts (hash chain order)"} right={txFocus ? <Btn onClick={() => setTxFocus("")}>Show all</Btn> : undefined}>
        <ol className="space-y-1">
          {rs.map((r) => (
            <li key={r.receipt_id}>
              <button onClick={() => { setSel(r); setVer(null); }} className={`w-full rounded border p-2 text-left text-xs ${sel?.receipt_id === r.receipt_id ? "border-indigo-500 bg-indigo-50" : "border-slate-200"}`}>
                <div className="font-medium">#{r.seq} {t(r.event_type)}</div>
                <div className="flex gap-1"><Badge>{r.policy_decision}</Badge><Badge>{r.verification_level}</Badge></div>
              </button>
            </li>
          ))}
          {rs.length === 0 && <p className="text-sm text-slate-500">{t("No receipts.")}</p>}
        </ol>
        <div className="mt-3 flex flex-wrap gap-2"><Btn onClick={verifyChain}>Verify whole chain</Btn><Btn onClick={download}>Export JSON</Btn></div>
        {chain && <p className={`mt-2 text-sm ${chain.valid ? "text-green-700" : "text-red-700"}`}>{chain.valid ? `Chain valid (${chain.receipt_count} receipts)` : `Chain INVALID: ${JSON.stringify(chain.problems)}`}</p>}
      </Card></div>
      <div className="space-y-3 md:col-span-4">
        <ErrorNote error={err} />
        {sel && (
          <>
            <Card title={`${t("Receipt")} ${sel.receipt_id}`} right={<div className="flex gap-1"><Btn onClick={() => setView("timeline")}>Timeline</Btn><Btn onClick={() => setView("json")}>JSON</Btn></div>}>
              {view === "json" ? <Json data={sel} /> : (
                <div className="space-y-2 text-sm">
                  <div className="flex flex-wrap gap-2"><Badge>{sel.policy_decision}</Badge><span>{t(sel.execution_status)}</span><span className="text-xs text-slate-500">{new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "medium" }).format(new Date(sel.timestamp))}</span></div>
                  <div>{t("Action")}: <code>{t(sel.requested_action)}</code> {sel.action_parameters?.product_id && <>{t(" on ")}<code>{t(sel.action_parameters.product_id)}</code></>} {t(" · agent ")}<code>{sel.agent_id}</code> {t(" · delegation ")}<code>{sel.delegation_id}</code> v{sel.delegation_version}</div>
                  {sel.policy_reason?.violations?.length > 0 ? (
                    <div><b>{t("Policy reasons (violations):")}</b><ul className="list-disc pl-5 text-red-700">{sel.policy_reason.violations.map((v: any, i: number) => <li key={i}>{t(v.code)}: {t(v.message)}</li>)}</ul></div>
                  ) : sel.policy_reason?.checks && <p className="text-green-700">{t("All ")}{sel.policy_reason.checks.length}{t(" deterministic checks passed.")}</p>}
                  {sel.policy_reason?.note && <p className="text-slate-600">{t(sel.policy_reason.note)}</p>}
                  {sel.merchant_response && <p className="text-xs">{t("Merchant response (")}<b>{t("SIMULATED")}</b>{t(") type: ")}<code>{t(sel.merchant_response.payload.type)}</code></p>}
                </div>
              )}
            </Card>
            <div className="grid gap-3 md:grid-cols-2">
              <Card title="Verifiable evidence">
                {sel.evidence_references.filter((e: any) => VERIFIED.includes(e.level)).map((e: any) => (
                  <div key={e.evidence_id} className="mb-2 text-sm"><Badge>{e.level}</Badge> {t(e.summary)}</div>
                ))}
                <p className="text-xs text-slate-500">{t("Merchant confirmation comes from a simulated merchant. PAYMENT_CONFIRMED does not exist in this MVP.")}</p>
              </Card>
              <Card title="Unverified claims / unknowns">
                {sel.evidence_references.filter((e: any) => !VERIFIED.includes(e.level)).map((e: any) => (
                  <div key={e.evidence_id} className="mb-2 text-sm"><Badge>{e.level}</Badge> {t(e.summary)}</div>
                ))}
                {sel.evidence_references.every((e: any) => VERIFIED.includes(e.level)) && <p className="text-sm text-slate-500">{t("None recorded in this receipt.")}</p>}
              </Card>
            </div>
            <Card title="Signature & hash verification" right={<Btn kind="primary" onClick={() => verify(sel)}>Verify this receipt</Btn>}>
              <p className="break-all text-xs text-slate-600">hash {sel.current_hash}<br />prev {sel.previous_hash}</p>
              {ver && (
                <ul className="mt-2 text-sm">
                  <li>{t("Hash matches content: ")}<b>{t(String(ver.hash_valid))}</b></li><li>{t("Ed25519 signature valid: ")}<b>{t(String(ver.signature_valid))}</b></li>
                  <li>{t("Chain link to previous receipt: ")}<b>{t(String(ver.chain_link_valid))}</b></li>
                  <li>{t("Merchant signature (simulated): ")}<b>{ver.merchant_signature_valid === null ? t("n/a") : t(String(ver.merchant_signature_valid))}</b></li>
                  <li className="text-xs text-slate-500">{t(ver.note)}. {t("Offline")}: <code>python verifier/agenttrust_verify.py export.json --public-key …</code></li>
                </ul>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
