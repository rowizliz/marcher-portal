"use client";
import { useEffect, useState } from "react";

const STATUS_OPTIONS = [
  { value: "pending", label: "Chờ", color: "#555" },
  { value: "active", label: "Đang làm", color: "#c9a84c" },
  { value: "done", label: "Hoàn thành", color: "#4caf50" },
];

export default function ProgressEditor() {
  const [steps, setSteps] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/progress").then(r => r.json()).then(setSteps).catch(() => {});
  }, []);

  const updateStep = (i, key, val) => {
    const s = [...steps];
    s[i] = { ...s[i], [key]: val };
    setSteps(s);
  };

  const save = async () => {
    setSaving(true);
    await fetch("/api/progress", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ steps }) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const doneCount = steps.filter(s => s.status === "done").length;
  const pct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;

  return (
    <div>
      <style>{`
        .pe-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:20px; }
        .pe-pct { font-size:14px;color:var(--gold);font-weight:700; }
        .pe-bar { height:8px;background:var(--bg-input);border-radius:4px;margin-bottom:24px;overflow:hidden; }
        .pe-fill { height:100%;background:linear-gradient(90deg,var(--gold),var(--gold-light));border-radius:4px;transition:width .5s; }
        .pe-step { display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;margin-bottom:8px;transition:all .2s; }
        .pe-num { width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid var(--border);flex-shrink:0; }
        .pe-num.done { border-color:#4caf50;color:#4caf50; }
        .pe-num.active { border-color:var(--gold);color:var(--gold); }
        .pe-label { flex:1;font-size:14px;font-weight:600;color:var(--text); }
        .pe-select { padding:6px 12px;background:var(--bg-input);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:12px;font-family:var(--font);cursor:pointer;outline:none; }
        .pe-note { font-size:12px;color:var(--text-muted);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
        .pe-note-icon { color:var(--gold); }
        .pe-save { padding:14px 32px;font-size:13px;font-weight:700;background:var(--gold);color:#111;border:none;border-radius:6px;cursor:pointer;text-transform:uppercase;letter-spacing:1px;transition:all .3s;font-family:var(--font);margin-top:16px; }
        .pe-save:hover { background:var(--gold-light);transform:translateY(-1px); }
        .pe-save:disabled { opacity:.5; }
        .pe-saved { display:inline-block;margin-left:12px;font-size:13px;color:var(--success);font-weight:600; }
      `}</style>

      <div className="pe-header">
        <h3 style={{ color: "#fff" }}>📍 Cập nhật Tiến độ</h3>
        <div className="pe-pct">{pct}% hoàn thành ({doneCount}/{steps.length})</div>
      </div>
      <div className="pe-bar"><div className="pe-fill" style={{ width: `${pct}%` }} /></div>

      {steps.map((step, i) => (
        <div key={step.id} className="pe-step">
          <div className={`pe-num ${step.status}`}>
            {step.status === "done" ? "✓" : step.status === "active" ? "◉" : i + 1}
          </div>
          <div className="pe-label">{step.label}</div>
          {step.client_note && (
            <div className="pe-note" title={step.client_note}>
              <span className="pe-note-icon">📝</span> {step.client_note}
            </div>
          )}
          <select className="pe-select" value={step.status} onChange={e => updateStep(i, "status", e.target.value)}>
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      ))}

      <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
        <button className="pe-save" disabled={saving} onClick={save}>{saving ? "Đang lưu..." : "💾 Lưu tiến độ"}</button>
        {saved && <span className="pe-saved">✓ Đã lưu!</span>}
      </div>
    </div>
  );
}
