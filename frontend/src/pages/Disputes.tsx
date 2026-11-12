import { useEffect, useState } from "react";
import { api, krw, post } from "../api";
import type { Shared } from "../App";
import { Badge, Btn, Card, ErrorNote } from "../ui";
import { useT } from "../i18n";

export default function Disputes({ tick, refresh, txFocus }: Shared) {
  const t = useT();
  const [txs, setTxs] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [txId, setTxId] = useState(txFocus);
  const [reason, setReason] = useState(t("This purchase looks wrong"));
  const [dispute, setDispute] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [outcome, setOutcome] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { api("/transactions").then(setTxs).catch((e) => setErr(e.message)); api("/disputes").then(setDisputes).catch(() => {}); }, [tick]);
  useEffect(() => { if (dispute) api(`/disputes/${dispute.dispute_id}/analysis`).then(setAnalysis).catch((e) => setErr(e.message)); }, [dispute, tick]);

  const run = async (fn: () => Promise<any>) => { setErr(null); try { await fn(); refresh(); } catch (e: any) { setErr(e.message); } };
  const open = () => run(async () => setDispute(await post("/disputes", { transaction_id: txId, reason })));
  const cancel = () => run(async () => { const r = await post(`/disputes/${dispute.dispute_id}/cancellations`, { reason }); setOutcome(r.cancellation_outcome ?? "n/a"); });
  const close = () => run(async () => setDispute(await post(`/disputes/${dispute.dispute_id}/close`, { resolution_note: "closed from dashboard" })));

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-3">
        <Card title="1. Select a transaction">
          <select aria-label={t("Transaction")} className="w-full rounded border border-slate-300 p-1 text-sm" value={txId} onChange={(e) => setTxId(e.target.value)}>
            <option value="">{t("Choose…")}</option>
            {txs.map((tx) => <option key={tx.transaction_id} value={tx.transaction_id}>{tx.transaction_id} · {t(tx.product_id)} · {t(tx.status)}</option>)}
          </select>
          <textarea aria-label={t("Dispute reason")} className="mt-2 w-full rounded border border-slate-300 p-1 text-sm" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
          <Btn kind="primary" className="mt-2" disabled={!txId || !reason} onClick={open}>Open dispute</Btn>
          <ErrorNote error={err} />
        </Card>
        <Card title="Disputes">
          {disputes.length === 0 && <p className="text-sm text-slate-500">{t("None yet.")}</p>}
          {disputes.map((d) => (
            <button key={d.dispute_id} onClick={() => { setDispute(d); setOutcome(null); }} className="mb-1 block w-full rounded border border-slate-200 p-2 text-left text-xs">
              {d.dispute_id} <Badge>{d.status}</Badge><div className="text-slate-500">{d.transaction_id}</div>
            </button>
          ))}
        </Card>
      </div>
      <div className="space-y-3 md:col-span-2">
        {!analysis && <Card><p className="text-sm text-slate-500">{t("Open or select a dispute to compare evidence.")}</p></Card>}
        {analysis && dispute && (
          <>
            <Card title={`Dispute ${analysis.dispute_id}`} right={<Badge>{analysis.dispute_status}</Badge>}>
              <p className="text-sm">{t("Transaction ")}<code>{analysis.transaction_id}</code>{t(" is ")}<Badge>{analysis.transaction_status}</Badge>. {t("Failed stage: ")}<b>{t(analysis.failed_stage ?? "none detected")}</b></p>
              <p className="mt-2 rounded bg-slate-100 p-2 text-sm"><b>{t("Responsibility: ")}{t(analysis.responsibility.determination)}.</b> {t(analysis.responsibility.note)}</p>
            </Card>
            <Card title="Violated conditions">
              {analysis.violated_conditions.length === 0 ? <p className="text-sm text-slate-500">{t("None recorded.")}</p> :
                <ul className="list-disc pl-5 text-sm text-red-700">{analysis.violated_conditions.map((v: any, i: number) => <li key={i}><b>{t(v.code)}</b>: {t(v.message)}</li>)}</ul>}
            </Card>
            <Card title="Discrepancies between sources">
              {analysis.discrepancies.length === 0 ? <p className="text-sm text-slate-500">{t("None detected.")}</p> : (
                <table className="w-full text-sm [&_td]:pr-4 [&_td]:py-1 [&_td]:align-top [&_th]:pr-4"><thead><tr className="text-left text-xs text-slate-500"><th>{t("Stage")}</th><th>{t("Field")}</th><th>{t("Expected")}</th><th>{t("Observed")}</th></tr></thead>
                  <tbody>{analysis.discrepancies.map((d: any, i: number) => (
                    <tr key={i} className="border-t border-slate-100"><td>{t(d.stage)}</td><td>{t(d.field)}</td><td>{t(String(d.expected))}<div className="text-xs text-slate-500">{t(d.expected_source)}</div></td><td>{t(String(d.observed))}<div className="text-xs text-slate-500">{t(d.observed_source)}</div></td></tr>))}</tbody></table>)}
            </Card>
            <Card title="Evidence by party">
              <div className="grid gap-2 md:grid-cols-2">
                {Object.entries(analysis.evidence_by_party).map(([party, items]: [string, any]) => (
                  <div key={party} className="rounded border border-slate-200 p-2"><div className="text-xs font-semibold uppercase text-slate-500">{t(party)}</div>
                    {items.length === 0 ? <p className="text-xs text-slate-400">{t("no evidence")}</p> : items.map((e: any, i: number) => <div key={i} className="text-xs"><Badge>{e.level}</Badge> {t(e.summary)}</div>)}</div>
                ))}
              </div>
            </Card>
            <Card title="Not established (unknowns)"><ul className="list-disc pl-5 text-sm text-slate-700">{analysis.unknown_facts.map((u: string, i: number) => <li key={i}>{t(u)}</li>)}</ul></Card>
            <Card title="Recovery (simulated)">
              <p className="text-sm">{t("Cancellation possible: ")}<b>{t(analysis.cancellation.possible ? "yes (merchant may still reject)" : "cancellation unavailable")}</b>. {t(analysis.cancellation.reason)}</p>
              <div className="mt-2 flex gap-2">
                <Btn kind="danger" disabled={!analysis.cancellation.possible || dispute.status !== "OPEN"} onClick={cancel}>Request cancellation from mock merchant</Btn>
                <Btn disabled={dispute.status !== "OPEN"} onClick={close}>Close dispute</Btn>
              </div>
              {outcome && <p className="mt-2 text-sm">{t("Merchant result: ")}<Badge>{outcome}</Badge>{t(" (no real refund, chargeback or insurance payout exists in this MVP)")}</p>}
              <p className="mt-1 text-xs text-slate-500">{t("Charged: ")}{krw(txs.find((tx) => tx.transaction_id === analysis.transaction_id)?.charged_krw)}</p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
