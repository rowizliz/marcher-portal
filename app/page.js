"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Receipt,
  ScrollText,
  MessagesSquare,
  LogOut,
  ArrowUpRight,
  Circle,
  CircleDot,
  CheckCircle2,
  MessageSquarePlus,
  X,
  Save,
  PencilLine,
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Chào buổi sáng";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

const CARDS = [
  {
    href: "/brief",
    Icon: ClipboardList,
    eyebrow: "01 — Brief",
    title: "Phiếu khảo sát",
    desc: "Chia sẻ tầm nhìn, mục tiêu và yêu cầu chi tiết của dự án.",
    cta: "Điền brief",
  },
  {
    href: "/invoice",
    Icon: Receipt,
    eyebrow: "02 — Invoice",
    title: "Hóa đơn",
    desc: "Chi tiết hạng mục, lịch thanh toán và thông tin chuyển khoản.",
    cta: "Xem hóa đơn",
  },
  {
    href: "/contract",
    Icon: ScrollText,
    eyebrow: "03 — Contract",
    title: "Hợp đồng",
    desc: "Toàn bộ điều khoản dịch vụ thiết kế và phát triển website.",
    cta: "Xem hợp đồng",
  },
  {
    href: "/chat",
    Icon: MessagesSquare,
    eyebrow: "04 — Chat",
    title: "Trò chuyện",
    desc: "Trao đổi trực tiếp với đội ngũ thiết kế. Gửi ảnh, file đính kèm.",
    cta: "Mở chat",
  },
];

export default function Home() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openNote, setOpenNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => r.json())
      .then((data) => { setSteps(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const saveNote = async (stepId) => {
    setSaving(true);
    const updated = steps.map((s) => (s.id === stepId ? { ...s, client_note: noteText } : s));
    setSteps(updated);
    await fetch("/api/progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steps: updated, source: "client" }),
    });
    setSaving(false);
    setOpenNote(null);
  };

  const logout = () => {
    localStorage.removeItem("client_auth");
    router.push("/login");
  };

  const doneCount = steps.filter((s) => s.status === "done").length;
  const pct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;
  const activeIndex = steps.findIndex((s) => s.status === "active");

  return (
    <div className="lp">
      <style>{`
        .lp { min-height:100vh; padding:var(--s-12) var(--s-6) var(--s-20); position:relative; }
        .lp-topbar { position:fixed; top:var(--s-6); right:var(--s-6); z-index:50; display:flex; gap:var(--s-2); align-items:center; }

        .lp-hero { max-width:var(--container); margin:0 auto var(--s-20); padding-top:var(--s-12); }
        .lp-eyebrow-row { display:flex; align-items:center; gap:var(--s-3); margin-bottom:var(--s-8); }
        .lp-eyebrow-line { flex:0 0 64px; height:1px; background:var(--line-gold); }
        .lp-greeting { font-family:var(--font-sans); font-size:var(--text-sm); color:var(--ink-muted); margin-bottom:var(--s-4); letter-spacing:var(--track-wide); }
        .lp-headline { font-family:var(--font-display); font-weight:300; font-size:clamp(48px, 9vw, var(--text-6xl)); line-height:0.95; letter-spacing:var(--track-tight); color:var(--ink); margin-bottom:var(--s-6); font-variation-settings:"opsz" 144, "SOFT" 50; }
        .lp-headline em { font-style:italic; color:var(--gold); font-weight:300; }
        .lp-sub { max-width:520px; font-size:var(--text-md); color:var(--ink-muted); line-height:1.7; }

        /* ── CARDS GRID ── */
        .lp-cards { max-width:var(--container); margin:0 auto var(--s-24); display:grid; grid-template-columns:repeat(4, 1fr); gap:var(--s-3); }
        .lp-card { position:relative; padding:var(--s-8) var(--s-6) var(--s-6); background:var(--bg-1); border:1px solid var(--line); border-radius:var(--r-lg); transition:all var(--dur-base) var(--ease); display:flex; flex-direction:column; gap:var(--s-4); min-height:260px; overflow:hidden; }
        .lp-card::before { content:""; position:absolute; inset:0; background:radial-gradient(circle at 50% 0%, var(--gold-glow), transparent 60%); opacity:0; transition:opacity var(--dur-slow) var(--ease); pointer-events:none; }
        .lp-card:hover { border-color:var(--line-gold); transform:translateY(-3px); box-shadow:var(--shadow-md); }
        .lp-card:hover::before { opacity:1; }
        .lp-card:hover .lp-card-icon { color:var(--gold); transform:scale(1.05); }
        .lp-card:hover .lp-card-cta-arrow { transform:translate(2px, -2px); }
        .lp-card-icon { width:28px; height:28px; color:var(--ink-muted); transition:all var(--dur-base) var(--ease); }
        .lp-card-eyebrow { font-size:var(--text-2xs); letter-spacing:var(--track-wider); text-transform:uppercase; color:var(--gold); font-weight:600; }
        .lp-card-title { font-family:var(--font-display); font-size:var(--text-xl); font-weight:400; line-height:1.15; letter-spacing:var(--track-tight); color:var(--ink); }
        .lp-card-desc { font-size:var(--text-sm); color:var(--ink-muted); line-height:1.6; flex:1; }
        .lp-card-cta { display:flex; align-items:center; gap:var(--s-2); font-size:var(--text-2xs); font-weight:600; letter-spacing:var(--track-wider); text-transform:uppercase; color:var(--ink); padding-top:var(--s-3); border-top:1px solid var(--line); margin-top:auto; }
        .lp-card-cta-arrow { width:14px; height:14px; transition:transform var(--dur-base) var(--ease); }

        /* ── PROGRESS ── */
        .lp-progress { max-width:var(--container); margin:0 auto; }
        .lp-section-head { display:flex; align-items:flex-end; justify-content:space-between; gap:var(--s-6); padding-bottom:var(--s-5); margin-bottom:var(--s-8); border-bottom:1px solid var(--line); }
        .lp-section-eyebrow { font-size:var(--text-2xs); font-weight:600; letter-spacing:var(--track-widest); text-transform:uppercase; color:var(--gold); margin-bottom:var(--s-2); }
        .lp-section-title { font-family:var(--font-display); font-size:var(--text-2xl); font-weight:400; line-height:1.1; color:var(--ink); letter-spacing:var(--track-tight); }
        .lp-section-meta { text-align:right; }
        .lp-pct-num { font-family:var(--font-display); font-size:var(--text-3xl); font-weight:300; color:var(--gold); line-height:1; }
        .lp-pct-label { font-size:var(--text-2xs); letter-spacing:var(--track-wider); text-transform:uppercase; color:var(--ink-faded); margin-top:var(--s-1); }

        .lp-progress-bar { height:2px; background:var(--bg-3); border-radius:var(--r-full); overflow:hidden; margin-bottom:var(--s-10); }
        .lp-progress-fill { height:100%; background:linear-gradient(90deg, var(--gold-deep), var(--gold-soft)); border-radius:var(--r-full); transition:width var(--dur-slower) var(--ease-out); position:relative; }
        .lp-progress-fill::after { content:""; position:absolute; right:0; top:50%; width:8px; height:8px; background:var(--gold-soft); border-radius:50%; transform:translate(50%, -50%); box-shadow:0 0 12px var(--gold); }

        .lp-timeline { display:flex; flex-direction:column; gap:2px; }
        .lp-step { border-radius:var(--r-md); transition:background var(--dur-fast) var(--ease); }
        .lp-step:hover { background:var(--bg-1); }
        .lp-step-row { display:flex; align-items:center; gap:var(--s-5); padding:var(--s-4) var(--s-5); cursor:pointer; }
        .lp-step-icon { flex:0 0 24px; width:24px; height:24px; color:var(--ink-dim); transition:color var(--dur-base) var(--ease); }
        .lp-step.active .lp-step-icon { color:var(--gold); }
        .lp-step.done .lp-step-icon { color:var(--success); }
        .lp-step-num { font-family:var(--font-mono); font-size:var(--text-xs); color:var(--ink-faded); width:32px; flex:0 0 32px; }
        .lp-step-label { flex:1; font-size:var(--text-base); font-weight:500; color:var(--ink-faded); transition:color var(--dur-base) var(--ease); }
        .lp-step.active .lp-step-label { color:var(--ink); font-weight:600; }
        .lp-step.done .lp-step-label { color:var(--ink-muted); text-decoration:line-through; text-decoration-color:var(--ink-dim); text-decoration-thickness:1px; }
        .lp-step-status { font-size:var(--text-2xs); letter-spacing:var(--track-wider); text-transform:uppercase; color:var(--ink-faded); padding:4px 10px; border-radius:var(--r-full); border:1px solid var(--line); }
        .lp-step.active .lp-step-status { color:var(--gold); border-color:var(--line-gold); background:var(--gold-glow); }
        .lp-step.done .lp-step-status { color:var(--success); border-color:rgba(92,184,122,0.3); background:rgba(92,184,122,0.08); }
        .lp-step-note-pill { display:inline-flex; align-items:center; gap:6px; font-size:var(--text-2xs); color:var(--gold); font-weight:600; padding:3px 10px; border-radius:var(--r-full); background:var(--gold-glow); }
        .lp-step-action { width:32px; height:32px; border-radius:var(--r-full); border:1px solid var(--line); background:transparent; color:var(--ink-faded); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all var(--dur-fast) var(--ease); }
        .lp-step-action:hover { color:var(--gold); border-color:var(--line-gold); }

        .lp-step-divider { height:1px; background:var(--line); margin:0 var(--s-5); }

        .lp-note-panel { padding:var(--s-5) var(--s-6) var(--s-6); background:var(--bg-1); border:1px solid var(--line); border-radius:var(--r-md); margin:var(--s-2) 0 var(--s-3); animation:fadeInUp var(--dur-base) var(--ease-out); }
        .lp-note-existing { padding:var(--s-3) var(--s-4); border-radius:var(--r-sm); margin-bottom:var(--s-3); border-left:2px solid var(--gold); background:var(--bg-2); font-size:var(--text-sm); color:var(--ink-muted); line-height:1.6; }
        .lp-note-admin { padding:var(--s-3) var(--s-4); border-radius:var(--r-sm); margin-bottom:var(--s-3); border-left:2px solid var(--success); background:rgba(92,184,122,0.06); font-size:var(--text-sm); color:var(--ink); line-height:1.6; }
        .lp-note-admin-from { font-size:var(--text-2xs); font-weight:700; text-transform:uppercase; letter-spacing:var(--track-wider); color:var(--success); margin-bottom:var(--s-1); }
        .lp-note-actions { display:flex; gap:var(--s-2); margin-top:var(--s-3); justify-content:flex-end; }

        /* ── ADMIN LINK ── */
        .lp-admin-link { text-align:center; margin-top:var(--s-20); padding-top:var(--s-10); border-top:1px solid var(--line); }
        .lp-admin-link a { font-family:var(--font-sans); font-size:var(--text-2xs); letter-spacing:var(--track-widest); text-transform:uppercase; color:var(--ink-faded); transition:color var(--dur-base) var(--ease); }
        .lp-admin-link a:hover { color:var(--gold); }

        /* ── SKELETON ── */
        .lp-skel-row { padding:var(--s-4) var(--s-5); display:flex; gap:var(--s-5); align-items:center; }
        .lp-skel-circle { width:24px; height:24px; border-radius:50%; }
        .lp-skel-bar { flex:1; height:14px; }

        @media (max-width:900px) {
          .lp-cards { grid-template-columns:repeat(2, 1fr); }
        }
        @media (max-width:560px) {
          .lp-cards { grid-template-columns:1fr; }
          .lp-section-head { flex-direction:column; align-items:flex-start; }
          .lp-section-meta { text-align:left; }
          .lp-step-num { display:none; }
          .lp-step-row { gap:var(--s-3); padding:var(--s-3) var(--s-3); }
        }
      `}</style>

      {/* ── TOP BAR ── */}
      <div className="lp-topbar">
        <NotificationBell target="client" />
        <button className="btn-icon" onClick={logout} title="Đăng xuất" aria-label="Đăng xuất">
          <LogOut size={16} />
        </button>
      </div>

      {/* ── HERO ── */}
      <header className="lp-hero fade-in-up">
        <div className="lp-eyebrow-row">
          <span className="lp-eyebrow-line" />
          <span className="eyebrow">Marcher × Rowiz Lê Design</span>
        </div>
        <div className="lp-greeting">{greeting()}, Marcher.</div>
        <h1 className="lp-headline">
          Client <em>Portal</em>
        </h1>
        <p className="lp-sub">
          Cổng thông tin dự án — nơi bạn xem tài liệu, điền brief, theo dõi tiến độ và trao đổi với đội ngũ thiết kế trong suốt 3 tuần triển khai.
        </p>
      </header>

      {/* ── CARDS ── */}
      <section className="lp-cards stagger">
        {CARDS.map(({ href, Icon, eyebrow, title, desc, cta }) => (
          <Link key={href} href={href} className="lp-card">
            <Icon className="lp-card-icon" strokeWidth={1.5} />
            <span className="lp-card-eyebrow">{eyebrow}</span>
            <h3 className="lp-card-title">{title}</h3>
            <p className="lp-card-desc">{desc}</p>
            <span className="lp-card-cta">
              {cta}
              <ArrowUpRight className="lp-card-cta-arrow" size={14} strokeWidth={2} />
            </span>
          </Link>
        ))}
      </section>

      {/* ── PROGRESS TRACKER ── */}
      <section className="lp-progress fade-in-up" style={{ animationDelay: "200ms" }}>
        <div className="lp-section-head">
          <div>
            <div className="lp-section-eyebrow">Project Status</div>
            <h2 className="lp-section-title">Tiến độ Dự án</h2>
          </div>
          <div className="lp-section-meta">
            <div className="lp-pct-num">{pct}<span style={{ fontSize: "0.5em", opacity: 0.5 }}>%</span></div>
            <div className="lp-pct-label">Hoàn thành</div>
          </div>
        </div>

        <div className="lp-progress-bar">
          <div className="lp-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        {loading ? (
          <div className="lp-timeline">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="lp-skel-row">
                <div className="skeleton lp-skel-circle" />
                <div className="skeleton lp-skel-bar" style={{ maxWidth: 220 + i * 30 }} />
              </div>
            ))}
          </div>
        ) : steps.length === 0 ? (
          <p className="subhead" style={{ padding: "var(--s-8) 0", textAlign: "center" }}>
            Chưa có bước tiến độ nào.
          </p>
        ) : (
          <div className="lp-timeline">
            {steps.map((step, i) => {
              const StatusIcon = step.status === "done" ? CheckCircle2 : step.status === "active" ? CircleDot : Circle;
              const statusLabel = step.status === "done" ? "Hoàn thành" : step.status === "active" ? "Đang làm" : "Chờ";
              const isOpen = openNote === step.id;
              return (
                <div key={step.id} className={`lp-step ${step.status}`}>
                  <div
                    className="lp-step-row"
                    onClick={() => {
                      if (isOpen) setOpenNote(null);
                      else { setOpenNote(step.id); setNoteText(step.client_note || ""); }
                    }}
                  >
                    <StatusIcon className="lp-step-icon" strokeWidth={1.75} />
                    <span className="lp-step-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="lp-step-label">{step.label}</span>
                    {step.client_note && (
                      <span className="lp-step-note-pill"><PencilLine size={11} /> Ghi chú</span>
                    )}
                    <span className="lp-step-status">{statusLabel}</span>
                    <button
                      className="lp-step-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isOpen) setOpenNote(null);
                        else { setOpenNote(step.id); setNoteText(step.client_note || ""); }
                      }}
                      aria-label="Ghi chú bước này"
                    >
                      {isOpen ? <X size={14} /> : <MessageSquarePlus size={14} />}
                    </button>
                  </div>
                  {i < steps.length - 1 && <div className="lp-step-divider" />}

                  {isOpen && (
                    <div className="lp-note-panel">
                      {step.admin_note && (
                        <div className="lp-note-admin">
                          <div className="lp-note-admin-from">Phản hồi từ Rowiz Lê Design</div>
                          {step.admin_note}
                        </div>
                      )}
                      {step.client_note && (
                        <div className="lp-note-existing">{step.client_note}</div>
                      )}
                      <textarea
                        className="textarea"
                        placeholder="Nhập ghi chú, phản hồi, yêu cầu của bạn..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                      />
                      <div className="lp-note-actions">
                        <button className="btn btn-quiet" onClick={() => setOpenNote(null)}>Hủy</button>
                        <button className="btn btn-primary" disabled={saving} onClick={() => saveNote(step.id)}>
                          <Save size={14} /> {saving ? "Đang lưu..." : "Lưu ghi chú"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── ADMIN LINK ── */}
      <div className="lp-admin-link">
        <Link href="/admin/login">Khu vực quản trị</Link>
      </div>
    </div>
  );
}
