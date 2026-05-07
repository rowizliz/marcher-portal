"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const STATUS_MAP = {
  pending: { icon: "○", color: "#555", bg: "transparent" },
  active: { icon: "◉", color: "#c9a84c", bg: "rgba(201,168,76,0.1)" },
  done: { icon: "✓", color: "#4caf50", bg: "rgba(76,175,80,0.1)" },
};

export default function Home() {
  const [steps, setSteps] = useState([]);
  const [openNote, setOpenNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/progress").then(r => r.json()).then(setSteps).catch(() => {});
  }, []);

  const saveNote = async (stepId) => {
    setSaving(true);
    const updated = steps.map(s => s.id === stepId ? { ...s, client_note: noteText } : s);
    setSteps(updated);
    await fetch("/api/progress", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ steps: updated }) });
    setSaving(false);
    setOpenNote(null);
  };

  const activeIndex = steps.findIndex(s => s.status === "active");
  const doneCount = steps.filter(s => s.status === "done").length;
  const pct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;

  return (
    <div className="page-wrapper">
      <style>{`
        .portal-hero { text-align:center;margin-bottom:50px;animation:fadeInUp .6s ease-out; }
        .portal-badge { font-size:11px;letter-spacing:4px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:16px; }
        .portal-title { font-size:42px;font-weight:800;color:#fff;letter-spacing:-1px;margin-bottom:14px; }
        .portal-desc { font-size:15px;color:var(--text-secondary);max-width:480px;margin:0 auto;line-height:1.7; }
        .cards-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:960px;margin:0 auto 60px; }
        .portal-card { background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:32px;transition:all .3s;position:relative;overflow:hidden; }
        .portal-card:hover { border-color:rgba(201,168,76,.3);transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.3); }
        .card-badge { display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:20px; }
        .card-icon { font-size:28px;margin-bottom:14px; }
        .card-title { font-size:18px;font-weight:800;color:#fff;margin-bottom:10px; }
        .card-desc { font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:20px; }
        .card-link { font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--gold);transition:gap .3s;display:inline-flex;align-items:center;gap:6px; }
        .card-link:hover { gap:10px; }
        .admin-link { text-align:center;margin-top:40px; }
        .admin-link a { font-size:13px;color:var(--text-muted);transition:color .3s; }
        .admin-link a:hover { color:var(--gold); }

        /* ── PROGRESS TRACKER ── */
        .progress-section { max-width:960px;margin:0 auto 60px;animation:fadeInUp .8s ease-out; }
        .progress-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:20px; }
        .progress-title { font-size:18px;font-weight:800;color:#fff; }
        .progress-pct { font-size:13px;color:var(--gold);font-weight:700; }
        .progress-bar-outer { height:6px;background:var(--bg-input);border-radius:3px;margin-bottom:30px;overflow:hidden; }
        .progress-bar-fill { height:100%;background:linear-gradient(90deg,var(--gold),var(--gold-light));border-radius:3px;transition:width .8s ease; }

        .timeline { position:relative;padding-left:32px; }
        .timeline::before { content:'';position:absolute;left:11px;top:0;bottom:0;width:2px;background:var(--border); }

        .step { position:relative;margin-bottom:8px; }
        .step-head { display:flex;align-items:center;gap:14px;padding:12px 16px;border-radius:8px;cursor:pointer;transition:all .2s; }
        .step-head:hover { background:rgba(255,255,255,.03); }
        .step-dot { position:absolute;left:-32px;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid var(--border);background:var(--bg);z-index:1;transition:all .3s; }
        .step-dot.active { border-color:var(--gold);color:var(--gold);box-shadow:0 0 12px rgba(201,168,76,.3); }
        .step-dot.done { border-color:#4caf50;color:#4caf50;background:rgba(76,175,80,.1); }
        .step-label { font-size:14px;font-weight:600;color:var(--text-secondary);flex:1;transition:color .2s; }
        .step.active .step-label { color:#fff; }
        .step.done .step-label { color:var(--text-muted); }
        .step-status { font-size:11px;padding:2px 10px;border-radius:12px;font-weight:600; }
        .step-note-badge { font-size:11px;color:var(--gold);cursor:pointer; }
        .step-note-icon { font-size:16px;color:var(--text-muted);cursor:pointer;transition:color .2s; }
        .step-note-icon:hover { color:var(--gold); }

        .note-panel { margin-left:16px;padding:14px 18px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:8px;margin-bottom:8px;animation:fadeInUp .3s ease-out; }
        .note-existing { font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:10px;padding:8px 12px;background:var(--bg-input);border-radius:6px;border-left:3px solid var(--gold); }
        .note-input { width:100%;padding:10px 14px;background:var(--bg-input);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px;font-family:var(--font);outline:none;resize:vertical;min-height:50px; }
        .note-input:focus { border-color:var(--gold); }
        .note-actions { display:flex;gap:8px;margin-top:10px;justify-content:flex-end; }
        .note-btn { padding:6px 16px;font-size:12px;font-weight:600;border-radius:4px;cursor:pointer;border:none;font-family:var(--font);transition:all .2s; }
        .note-save { background:var(--gold);color:#111; }
        .note-save:hover { background:var(--gold-light); }
        .note-cancel { background:var(--bg-input);color:var(--text-secondary);border:1px solid var(--border); }
        .note-cancel:hover { border-color:var(--gold); }

        @media(max-width:768px) {
          .cards-grid { grid-template-columns:1fr; }
          .portal-title { font-size:28px; }
        }
      `}</style>

      <div className="portal-hero">
        <div className="portal-badge">Marcher × Rowiz Lê Design</div>
        <h1 className="portal-title">Client Portal</h1>
        <p className="portal-desc">Chào mừng bạn đến với cổng thông tin dự án. Truy cập tài liệu, điền brief và theo dõi tiến độ.</p>
      </div>

      <div className="cards-grid">
        {[
          { href: "/brief", badge: "Form", badgeColor: "#4caf50", icon: "📋", title: "Client Brief", desc: "Điền phiếu khảo sát dự án để chúng tôi hiểu rõ tầm nhìn và yêu cầu của bạn.", link: "Điền ngay →" },
          { href: "/invoice", badge: "Invoice", badgeColor: "#c9a84c", icon: "🧾", title: "Hóa Đơn", desc: "Xem chi tiết hóa đơn, hạng mục công việc và thông tin thanh toán.", link: "Xem hóa đơn →" },
          { href: "/contract", badge: "Contract", badgeColor: "#e57373", icon: "📄", title: "Hợp Đồng", desc: "Xem toàn bộ điều khoản hợp đồng dịch vụ thiết kế và phát triển website.", link: "Xem hợp đồng →" },
        ].map((card) => (
          <Link href={card.href} key={card.href} style={{ textDecoration: "none" }}>
            <div className="portal-card">
              <span className="card-badge" style={{ background: `${card.badgeColor}20`, color: card.badgeColor }}>{card.badge}</span>
              <div className="card-icon">{card.icon}</div>
              <div className="card-title">{card.title}</div>
              <div className="card-desc">{card.desc}</div>
              <span className="card-link">{card.link}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── PROGRESS TRACKER ── */}
      {steps.length > 0 && (
        <div className="progress-section">
          <div className="progress-header">
            <div className="progress-title">📍 Tiến độ Dự án</div>
            <div className="progress-pct">{pct}% hoàn thành</div>
          </div>
          <div className="progress-bar-outer">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>

          <div className="timeline">
            {steps.map((step, i) => (
              <div key={step.id} className={`step ${step.status}`}>
                <div className="step-head" onClick={() => {
                  if (openNote === step.id) { setOpenNote(null); }
                  else { setOpenNote(step.id); setNoteText(step.client_note || ""); }
                }}>
                  <div className={`step-dot ${step.status}`}>
                    {step.status === "done" ? "✓" : step.status === "active" ? "◉" : (i + 1)}
                  </div>
                  <span className="step-label">{step.label}</span>
                  {step.client_note && <span className="step-note-badge">📝 Có ghi chú</span>}
                  <span className="step-note-icon" title="Thêm ghi chú">💬</span>
                </div>

                {openNote === step.id && (
                  <div className="note-panel">
                    {step.client_note && (
                      <div className="note-existing">{step.client_note}</div>
                    )}
                    <textarea
                      className="note-input"
                      placeholder="Nhập ghi chú, phản hồi, yêu cầu của bạn..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                    <div className="note-actions">
                      <button className="note-btn note-cancel" onClick={() => setOpenNote(null)}>Hủy</button>
                      <button className="note-btn note-save" disabled={saving} onClick={() => saveNote(step.id)}>
                        {saving ? "Đang lưu..." : "💾 Lưu ghi chú"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="admin-link">
        <Link href="/admin/login">Admin Dashboard</Link>
      </div>
    </div>
  );
}
