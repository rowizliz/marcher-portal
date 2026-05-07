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
  const [openStep, setOpenStep] = useState(null);

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
        .pe-step { background:var(--bg-card);border:1px solid var(--border);border-radius:8px;margin-bottom:8px;overflow:hidden;transition:all .2s; }
        .pe-step-head { display:flex;align-items:center;gap:14px;padding:14px 16px;cursor:pointer; }
        .pe-step-head:hover { background:rgba(255,255,255,.02); }
        .pe-num { width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid var(--border);flex-shrink:0; }
        .pe-num.done { border-color:#4caf50;color:#4caf50; }
        .pe-num.active { border-color:var(--gold);color:var(--gold); }
        .pe-label { flex:1;font-size:14px;font-weight:600;color:var(--text); }
        .pe-badges { display:flex;gap:6px; }
        .pe-badge-client { font-size:10px;padding:2px 8px;border-radius:10px;background:rgba(201,168,76,.1);color:var(--gold);font-weight:600; }
        .pe-badge-admin { font-size:10px;padding:2px 8px;border-radius:10px;background:rgba(76,175,80,.1);color:#4caf50;font-weight:600; }
        .pe-select { padding:6px 12px;background:var(--bg-input);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:12px;font-family:var(--font);cursor:pointer;outline:none; }
        .pe-expand { padding:14px 20px;border-top:1px solid var(--border);background:var(--bg-elevated);animation:fadeInUp .2s ease-out; }
        .pe-note-section { margin-bottom:14px; }
        .pe-note-label { font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);font-weight:700;margin-bottom:6px; }
        .pe-client-note { font-size:13px;color:var(--text-secondary);padding:10px 14px;background:var(--bg-input);border-radius:6px;border-left:3px solid var(--gold);line-height:1.6; }
        .pe-no-note { font-size:12px;color:var(--text-muted);font-style:italic; }
        .pe-admin-input { width:100%;padding:10px 14px;background:var(--bg-input);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px;font-family:var(--font);outline:none;resize:vertical;min-height:50px; }
        .pe-admin-input:focus { border-color:var(--gold); }
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
          <div className="pe-step-head" onClick={() => setOpenStep(openStep === step.id ? null : step.id)}>
            <div className={`pe-num ${step.status}`}>
              {step.status === "done" ? "✓" : step.status === "active" ? "◉" : i + 1}
            </div>
            <div className="pe-label">{step.label}</div>
            <div className="pe-badges">
              {step.client_note && <span className="pe-badge-client">📝 Client</span>}
              {step.admin_note && <span className="pe-badge-admin">✏️ Admin</span>}
            </div>
            <select className="pe-select" value={step.status} onClick={e => e.stopPropagation()} onChange={e => updateStep(i, "status", e.target.value)}>
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {openStep === step.id && (
            <div className="pe-expand">
              <div className="pe-note-section">
                <div className="pe-note-label">📝 Ghi chú từ Client (Marcher)</div>
                {step.client_note ? (
                  <div className="pe-client-note">{step.client_note}</div>
                ) : (
                  <div className="pe-no-note">Chưa có ghi chú từ client</div>
                )}
              </div>
              <div className="pe-note-section">
                <div className="pe-note-label">✏️ Phản hồi từ Admin</div>
                <textarea
                  className="pe-admin-input"
                  value={step.admin_note || ""}
                  onChange={e => updateStep(i, "admin_note", e.target.value)}
                  placeholder="Ghi chú, cập nhật hoặc phản hồi client..."
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
        <button className="pe-save" disabled={saving} onClick={save}>{saving ? "Đang lưu..." : "💾 Lưu tiến độ"}</button>
        {saved && <span className="pe-saved">✓ Đã lưu!</span>}
      </div>
    </div>
  );
}
