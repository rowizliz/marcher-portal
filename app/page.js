"use client";
import { useEffect, useMemo, useState } from "react";
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
  ChevronDown,
  ListTodo,
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

const CARDS = [
  { href: "/brief",    Icon: ClipboardList,  index: "01", label: "Brief",    title: "Phiếu khảo sát", desc: "Chia sẻ tầm nhìn, mục tiêu và yêu cầu chi tiết của dự án.",          cta: "Điền brief" },
  { href: "/invoice",  Icon: Receipt,        index: "02", label: "Invoice",  title: "Hóa đơn",        desc: "Chi tiết hạng mục, lịch thanh toán và thông tin chuyển khoản.",       cta: "Xem hóa đơn" },
  { href: "/contract", Icon: ScrollText,     index: "03", label: "Contract", title: "Hợp đồng",       desc: "Toàn bộ điều khoản dịch vụ thiết kế và phát triển website.",          cta: "Xem hợp đồng" },
  { href: "/chat",     Icon: MessagesSquare, index: "04", label: "Chat",     title: "Trò chuyện",     desc: "Trao đổi trực tiếp với đội ngũ thiết kế. Gửi ảnh, file đính kèm.",     cta: "Mở chat" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Chào buổi sáng";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export default function Home() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openNote, setOpenNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  // Defer greeting to client-only to avoid hydration mismatch on hour boundary
  const [greeting, setGreeting] = useState("");
  const router = useRouter();

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
    let alive = true;
    fetch("/api/progress")
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        if (Array.isArray(data)) setSteps(data);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setError("Không tải được tiến độ. Vui lòng thử lại.");
        setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  const saveNote = async (stepId) => {
    setSaving(true);
    const prevSteps = steps;
    const updated = steps.map((s) => (s.id === stepId ? { ...s, client_note: noteText } : s));
    setSteps(updated);
    try {
      const res = await fetch("/api/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steps: updated, source: "client" }),
      });
      if (!res.ok) throw new Error("save failed");
      setOpenNote(null);
    } catch {
      // Revert optimistic update
      setSteps(prevSteps);
      alert("Không lưu được ghi chú. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const toggleNote = (stepId, currentNote) => {
    if (openNote === stepId) {
      setOpenNote(null);
    } else {
      setOpenNote(stepId);
      setNoteText(currentNote || "");
    }
  };

  const doLogout = () => {
    localStorage.removeItem("client_auth");
    router.push("/login");
  };

  const { pct, doneCount, skeletonCount } = useMemo(() => {
    const done = steps.filter((s) => s.status === "done").length;
    return {
      pct: steps.length ? Math.round((done / steps.length) * 100) : 0,
      doneCount: done,
      skeletonCount: 6, // realistic placeholder
    };
  }, [steps]);

  return (
    <div className="lp">
      <style>{`
        .lp { min-height:100vh; padding:var(--s-12) var(--s-6) var(--s-20); position:relative; }
        .lp-topbar { position:fixed; top:var(--s-5); right:var(--s-5); z-index:50; display:flex; gap:var(--s-2); align-items:center; padding:var(--s-2); border-radius:var(--r-full); background:rgba(8,8,10,0.6); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid var(--line); }

        /* ── HERO ── */
        .lp-hero { max-width:var(--container); margin:0 auto var(--s-20); padding-top:var(--s-12); }
        .lp-hero > * { animation:fadeInUp var(--dur-slow) var(--ease-out) both; }
        .lp-hero-eyebrow { animation-delay:0ms; }
        .lp-hero-greeting { animation-delay:80ms; }
        .lp-hero-headline { animation-delay:160ms; }
        .lp-hero-sub { animation-delay:280ms; }

        .lp-eyebrow-row { display:flex; align-items:center; gap:var(--s-3); margin-bottom:var(--s-8); }
        .lp-eyebrow-line { width:48px; height:1px; background:var(--line-gold); flex-shrink:0; }
        .lp-greeting-text {
          font-family:var(--font-sans); font-size:var(--text-sm);
          color:var(--ink-muted); margin-bottom:var(--s-4);
          letter-spacing:var(--track-wide);
          min-height:1.5em; /* prevent layout shift before greeting hydrates */
        }
        .lp-headline {
          font-family:var(--font-display); font-weight:300;
          font-size:clamp(48px, 9vw, 96px);
          line-height:0.95; letter-spacing:var(--track-tight);
          color:var(--ink); margin-bottom:var(--s-6);
          font-variation-settings:"opsz" 144, "SOFT" 50;
        }
        .lp-headline em { font-style:italic; color:var(--gold); font-weight:300; }
        .lp-sub { max-width:520px; font-size:var(--text-md); color:var(--ink-muted); line-height:1.7; }

        /* ── CARDS GRID ── */
        .lp-cards { max-width:var(--container); margin:0 auto var(--s-24); display:grid; grid-template-columns:repeat(4, 1fr); gap:var(--s-3); }
        .lp-card {
          position:relative; padding:var(--s-8) var(--s-6) var(--s-6);
          background:var(--bg-1); border:1px solid var(--line);
          border-radius:var(--r-lg);
          transition:all var(--dur-base) var(--ease);
          display:flex; flex-direction:column; gap:var(--s-4);
          min-height:260px; overflow:hidden;
          color:inherit; text-decoration:none;
        }
        .lp-card::before {
          content:""; position:absolute; inset:0;
          background:radial-gradient(circle at 50% 0%, var(--gold-glow), transparent 60%);
          opacity:0; transition:opacity var(--dur-slow) var(--ease);
          pointer-events:none;
        }
        .lp-card:focus-visible {
          outline:2px solid var(--gold); outline-offset:2px;
          border-color:var(--line-gold);
        }
        @media (hover:hover) {
          .lp-card:hover { border-color:var(--line-gold); transform:translateY(-3px); box-shadow:var(--shadow-md); }
          .lp-card:hover::before { opacity:1; }
          .lp-card:hover .lp-card-icon { color:var(--gold); transform:scale(1.05); }
          .lp-card:hover .lp-card-cta-arrow { transform:translate(2px, -2px); }
        }
        .lp-card:active { transform:translateY(-1px); }
        .lp-card-icon { width:28px; height:28px; color:var(--ink-muted); transition:all var(--dur-base) var(--ease); }
        .lp-card-eyebrow {
          font-size:var(--text-2xs); letter-spacing:var(--track-wider);
          text-transform:uppercase; color:var(--gold); font-weight:600;
          display:flex; gap:8px; align-items:center;
        }
        .lp-card-eyebrow-num { font-family:var(--font-mono); color:var(--ink-faded); font-weight:500; }
        .lp-card-title {
          font-family:var(--font-display); font-size:var(--text-xl);
          font-weight:400; line-height:1.15;
          letter-spacing:var(--track-tight); color:var(--ink);
        }
        .lp-card-desc { font-size:var(--text-sm); color:var(--ink-muted); line-height:1.6; flex:1; }
        .lp-card-cta {
          display:flex; align-items:center; gap:var(--s-2);
          font-size:var(--text-2xs); font-weight:600;
          letter-spacing:var(--track-wider); text-transform:uppercase;
          color:var(--ink); padding-top:var(--s-3);
          border-top:1px solid var(--line); margin-top:auto;
        }
        .lp-card-cta-arrow { transition:transform var(--dur-base) var(--ease); }

        /* ── PROGRESS ── */
        .lp-progress { max-width:var(--container); margin:0 auto; }
        .lp-section-head {
          display:flex; align-items:flex-end; justify-content:space-between;
          gap:var(--s-6); padding-bottom:var(--s-5); margin-bottom:var(--s-8);
          border-bottom:1px solid var(--line);
        }
        .lp-section-eyebrow {
          font-size:var(--text-2xs); font-weight:600;
          letter-spacing:var(--track-widest); text-transform:uppercase;
          color:var(--gold); margin-bottom:var(--s-2);
        }
        .lp-section-title {
          font-family:var(--font-display); font-size:var(--text-2xl);
          font-weight:400; line-height:1.1; color:var(--ink);
          letter-spacing:var(--track-tight);
        }
        .lp-section-meta { text-align:right; }
        .lp-pct-num { font-family:var(--font-display); font-size:var(--text-3xl); font-weight:300; color:var(--gold); line-height:1; }
        .lp-pct-num small { font-size:0.5em; opacity:0.5; margin-left:2px; }
        .lp-pct-label { font-size:var(--text-2xs); letter-spacing:var(--track-wider); text-transform:uppercase; color:var(--ink-faded); margin-top:var(--s-1); }

        .lp-progress-bar { position:relative; height:2px; background:var(--bg-3); border-radius:var(--r-full); overflow:visible; margin-bottom:var(--s-10); }
        .lp-progress-fill {
          height:100%;
          background:linear-gradient(90deg, var(--gold-deep), var(--gold-soft));
          border-radius:var(--r-full);
          transition:width var(--dur-slower) var(--ease-out);
          position:relative;
        }
        .lp-progress-fill::after {
          content:""; position:absolute; right:0; top:50%;
          width:8px; height:8px; background:var(--gold-soft);
          border-radius:50%; transform:translate(50%, -50%);
          box-shadow:0 0 12px var(--gold);
        }

        .lp-timeline { display:flex; flex-direction:column; }
        .lp-step { border-radius:var(--r-md); transition:background var(--dur-fast) var(--ease); position:relative; }
        @media (hover:hover) {
          .lp-step:hover { background:rgba(255,255,255,0.018); }
        }
        .lp-step.is-open { background:var(--bg-1); }

        .lp-step-row {
          display:flex; align-items:center; gap:var(--s-5);
          padding:var(--s-4) var(--s-5);
          cursor:pointer; user-select:none;
          width:100%; background:none; border:none; text-align:left;
          color:inherit; font:inherit;
        }
        .lp-step-row:focus-visible { outline:2px solid var(--gold); outline-offset:-2px; border-radius:var(--r-md); }

        .lp-step-icon { flex:0 0 24px; width:24px; height:24px; color:var(--ink-dim); transition:color var(--dur-base) var(--ease); }
        .lp-step.active .lp-step-icon { color:var(--gold); }
        .lp-step.done .lp-step-icon { color:var(--success); }

        .lp-step-num {
          font-family:var(--font-mono); font-size:var(--text-xs);
          color:var(--ink-faded); width:32px; flex:0 0 32px;
          font-feature-settings:"tnum";
        }

        .lp-step-label {
          flex:1; font-size:var(--text-base); font-weight:500;
          color:var(--ink-faded);
          transition:color var(--dur-base) var(--ease);
        }
        .lp-step.active .lp-step-label { color:var(--ink); font-weight:600; }
        .lp-step.done .lp-step-label { color:var(--ink-muted); }

        .lp-step-status {
          font-size:var(--text-2xs); letter-spacing:var(--track-wider);
          text-transform:uppercase; color:var(--ink-faded);
          padding:4px 10px; border-radius:var(--r-full);
          border:1px solid var(--line);
        }
        .lp-step.active .lp-step-status { color:var(--gold); border-color:var(--line-gold); background:var(--gold-glow); }
        .lp-step.done .lp-step-status { color:var(--success); border-color:rgba(92,184,122,0.3); background:rgba(92,184,122,0.08); }

        .lp-step-pill {
          display:inline-flex; align-items:center; gap:6px;
          font-size:var(--text-2xs); color:var(--gold); font-weight:600;
          padding:3px 10px; border-radius:var(--r-full); background:var(--gold-glow);
        }

        .lp-step-chevron {
          width:20px; height:20px; color:var(--ink-faded);
          transition:transform var(--dur-base) var(--ease), color var(--dur-base) var(--ease);
        }
        .lp-step.is-open .lp-step-chevron { transform:rotate(180deg); color:var(--gold); }

        .lp-step-divider { height:1px; background:var(--line); margin:0 var(--s-5); }

        /* Note panel — animated open/close */
        .lp-note-wrap {
          display:grid;
          grid-template-rows:0fr;
          transition:grid-template-rows var(--dur-base) var(--ease);
        }
        .lp-step.is-open .lp-note-wrap { grid-template-rows:1fr; }
        .lp-note-inner { overflow:hidden; }
        .lp-note-panel {
          padding:0 var(--s-5) var(--s-5);
          opacity:0; transform:translateY(-4px);
          transition:opacity var(--dur-slow) var(--ease) var(--dur-fast),
                     transform var(--dur-slow) var(--ease) var(--dur-fast);
        }
        .lp-step.is-open .lp-note-panel { opacity:1; transform:translateY(0); }

        .lp-note-block {
          padding:var(--s-3) var(--s-4); border-radius:var(--r-sm);
          margin-bottom:var(--s-3);
          font-size:var(--text-sm); line-height:1.6;
        }
        .lp-note-existing {
          border-left:2px solid var(--gold);
          background:var(--bg-2);
          color:var(--ink-muted);
        }
        .lp-note-admin {
          border-left:2px solid var(--success);
          background:rgba(92,184,122,0.06);
          color:var(--ink);
        }
        .lp-note-admin-from {
          font-size:var(--text-2xs); font-weight:700;
          text-transform:uppercase; letter-spacing:var(--track-wider);
          color:var(--success); margin-bottom:var(--s-1);
        }
        .lp-note-actions {
          display:flex; gap:var(--s-2); margin-top:var(--s-3);
          justify-content:flex-end;
        }

        /* ── ERROR / EMPTY ── */
        .lp-empty {
          padding:var(--s-12) var(--s-6);
          display:flex; flex-direction:column; align-items:center;
          gap:var(--s-3); color:var(--ink-faded); text-align:center;
        }
        .lp-error {
          padding:var(--s-4) var(--s-5);
          border:1px solid rgba(216,100,94,0.3);
          background:rgba(216,100,94,0.08);
          border-radius:var(--r-md);
          color:var(--error);
          font-size:var(--text-sm);
          text-align:center;
        }

        /* ── ADMIN LINK ── */
        .lp-admin-link {
          text-align:center; margin-top:var(--s-20);
          padding-top:var(--s-10); border-top:1px solid var(--line);
        }
        .lp-admin-link a {
          font-family:var(--font-sans); font-size:var(--text-2xs);
          letter-spacing:var(--track-widest); text-transform:uppercase;
          color:var(--ink-faded);
          transition:color var(--dur-base) var(--ease);
        }
        .lp-admin-link a:hover { color:var(--gold); }

        /* ── SKELETON ── */
        .lp-skel-row { padding:var(--s-4) var(--s-5); display:flex; gap:var(--s-5); align-items:center; }
        .lp-skel-circle { width:24px; height:24px; border-radius:50%; }
        .lp-skel-bar { flex:1; height:14px; }

        /* ── LOGOUT MODAL ── */
        .lp-modal-backdrop {
          position:fixed; inset:0; background:rgba(0,0,0,0.6);
          backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px);
          z-index:200; display:flex; align-items:center; justify-content:center;
          padding:var(--s-6);
          animation:fadeIn var(--dur-base) var(--ease);
        }
        .lp-modal {
          background:var(--bg-1); border:1px solid var(--line-strong);
          border-radius:var(--r-lg); padding:var(--s-8);
          max-width:380px; width:100%;
          box-shadow:var(--shadow-lg);
          animation:scaleIn var(--dur-base) var(--ease-out);
        }
        .lp-modal-title {
          font-family:var(--font-display); font-size:var(--text-lg);
          font-weight:400; color:var(--ink); margin-bottom:var(--s-2);
        }
        .lp-modal-desc {
          font-size:var(--text-sm); color:var(--ink-muted);
          line-height:1.6; margin-bottom:var(--s-6);
        }
        .lp-modal-actions { display:flex; gap:var(--s-2); justify-content:flex-end; }

        @media (max-width:900px) {
          .lp-cards { grid-template-columns:repeat(2, 1fr); }
        }
        @media (max-width:560px) {
          .lp { padding:var(--s-8) var(--s-5) var(--s-16); }
          .lp-topbar { top:var(--s-3); right:var(--s-3); }
          .lp-cards { grid-template-columns:1fr; }
          .lp-section-head { flex-direction:column; align-items:flex-start; }
          .lp-section-meta { text-align:left; }
          .lp-step-num { display:none; }
          .lp-step-row { gap:var(--s-3); padding:var(--s-3) var(--s-3); }
          .lp-step-status { display:none; }
        }
      `}</style>

      {/* ── TOP BAR ── */}
      <div className="lp-topbar">
        <NotificationBell target="client" />
        <button
          className="btn-icon"
          onClick={() => setConfirmLogout(true)}
          title="Đăng xuất"
          aria-label="Đăng xuất"
        >
          <LogOut size={16} strokeWidth={1.75} />
        </button>
      </div>

      {/* ── HERO ── */}
      <header className="lp-hero">
        <div className="lp-eyebrow-row lp-hero-eyebrow">
          <span className="lp-eyebrow-line" />
          <span className="eyebrow">Marcher × Rowiz Lê Design</span>
        </div>
        <div className="lp-greeting-text lp-hero-greeting">
          {greeting && `${greeting}, Marcher.`}
        </div>
        <h1 className="lp-headline lp-hero-headline">
          Client <em>Portal</em>
        </h1>
        <p className="lp-sub lp-hero-sub">
          Cổng thông tin dự án — nơi bạn xem tài liệu, điền brief, theo dõi tiến độ và trao đổi với đội ngũ thiết kế trong suốt 3 tuần triển khai.
        </p>
      </header>

      {/* ── CARDS ── */}
      <section className="lp-cards stagger" aria-label="Tài liệu dự án">
        {CARDS.map(({ href, Icon, index, label, title, desc, cta }) => (
          <Link key={href} href={href} className="lp-card">
            <Icon className="lp-card-icon" strokeWidth={1.5} />
            <span className="lp-card-eyebrow">
              <span className="lp-card-eyebrow-num">{index}</span>
              <span>{label}</span>
            </span>
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
      <section
        className="lp-progress fade-in-up"
        style={{ animationDelay: "200ms" }}
        aria-label="Tiến độ dự án"
      >
        <div className="lp-section-head">
          <div>
            <div className="lp-section-eyebrow">Project Status</div>
            <h2 className="lp-section-title">Tiến độ Dự án</h2>
          </div>
          <div className="lp-section-meta">
            <div className="lp-pct-num">{pct}<small>%</small></div>
            <div className="lp-pct-label">{doneCount}/{steps.length || "–"} Hoàn thành</div>
          </div>
        </div>

        <div className="lp-progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="lp-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        {error ? (
          <div className="lp-error">{error}</div>
        ) : loading ? (
          <div className="lp-timeline">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <div key={i} className="lp-skel-row">
                <div className="skeleton lp-skel-circle" />
                <div className="skeleton lp-skel-bar" style={{ maxWidth: 200 + ((i * 37) % 240) }} />
              </div>
            ))}
          </div>
        ) : steps.length === 0 ? (
          <div className="lp-empty">
            <ListTodo size={36} strokeWidth={1.25} />
            <div>Chưa có bước tiến độ nào.</div>
          </div>
        ) : (
          <div className="lp-timeline">
            {steps.map((step, i) => {
              const StatusIcon =
                step.status === "done" ? CheckCircle2 :
                step.status === "active" ? CircleDot : Circle;
              const statusLabel =
                step.status === "done" ? "Hoàn thành" :
                step.status === "active" ? "Đang làm" : "Chờ";
              const isOpen = openNote === step.id;
              return (
                <div key={step.id} className={`lp-step ${step.status} ${isOpen ? "is-open" : ""}`}>
                  <button
                    className="lp-step-row"
                    onClick={() => toggleNote(step.id, step.client_note)}
                    aria-expanded={isOpen}
                    aria-controls={`note-${step.id}`}
                  >
                    <StatusIcon className="lp-step-icon" strokeWidth={1.75} />
                    <span className="lp-step-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="lp-step-label">{step.label}</span>
                    {step.client_note && (
                      <span className="lp-step-pill">
                        <PencilLine size={11} /> Ghi chú
                      </span>
                    )}
                    <span className="lp-step-status">{statusLabel}</span>
                    <ChevronDown className="lp-step-chevron" strokeWidth={1.75} />
                  </button>

                  <div className="lp-note-wrap" id={`note-${step.id}`}>
                    <div className="lp-note-inner">
                      <div className="lp-note-panel">
                        {step.admin_note && (
                          <div className="lp-note-block lp-note-admin">
                            <div className="lp-note-admin-from">Phản hồi từ Rowiz Lê Design</div>
                            {step.admin_note}
                          </div>
                        )}
                        {step.client_note && step.client_note !== noteText && (
                          <div className="lp-note-block lp-note-existing">{step.client_note}</div>
                        )}
                        <textarea
                          className="textarea"
                          placeholder="Nhập ghi chú, phản hồi, yêu cầu của bạn..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                        />
                        <div className="lp-note-actions">
                          <button className="btn btn-quiet" onClick={() => setOpenNote(null)}>
                            <X size={14} /> Hủy
                          </button>
                          <button
                            className="btn btn-primary"
                            disabled={saving || !noteText.trim()}
                            onClick={() => saveNote(step.id)}
                          >
                            <Save size={14} /> {saving ? "Đang lưu..." : "Lưu ghi chú"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {i < steps.length - 1 && <div className="lp-step-divider" />}
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

      {/* ── LOGOUT CONFIRM ── */}
      {confirmLogout && (
        <div
          className="lp-modal-backdrop"
          onClick={() => setConfirmLogout(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lp-modal-title" id="logout-title">Đăng xuất khỏi Portal?</div>
            <div className="lp-modal-desc">
              Bạn sẽ cần nhập lại mật khẩu để truy cập lần tới.
            </div>
            <div className="lp-modal-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmLogout(false)}>
                Ở lại
              </button>
              <button className="btn btn-primary" onClick={doLogout}>
                <LogOut size={14} /> Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
