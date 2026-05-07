"use client";
import { useEffect, useState, useRef } from "react";
import {
  Bell,
  BellOff,
  MessageSquare,
  MapPin,
  PencilLine,
  ClipboardList,
  Megaphone,
} from "lucide-react";

const TYPE_ICONS = {
  chat: MessageSquare,
  progress: MapPin,
  note: PencilLine,
  submission: ClipboardList,
};

export default function NotificationBell({ target = "client" }) {
  const [notifs, setNotifs] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchNotifs = async () => {
    try {
      const res = await fetch(`/api/notifications?target=${target}`);
      const data = await res.json();
      if (Array.isArray(data)) setNotifs(data);
    } catch {
      /* silent — will retry on next poll */
    }
  };

  useEffect(() => {
    fetchNotifs();
    const poll = setInterval(fetchNotifs, 5000);
    return () => clearInterval(poll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifs.filter((n) => !n.read).length;

  const markRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      /* silent */
    }
  };

  const toggle = () => {
    if (!open && unread > 0) markRead();
    setOpen(!open);
  };

  const timeAgo = (ts) => {
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (diff < 60) return "vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  const sorted = [...notifs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <style>{`
        .nb-bell {
          position:relative; width:44px; height:44px;
          border-radius:var(--r-full);
          border:1px solid var(--line);
          background:var(--bg-2);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer;
          color:var(--ink-muted);
          transition:all var(--dur-base) var(--ease);
          -webkit-tap-highlight-color:transparent;
        }
        @media (min-width:768px) { .nb-bell { width:40px; height:40px; } }
        @media (hover:hover) {
          .nb-bell:hover { color:var(--gold); border-color:var(--line-gold); background:var(--bg-3); }
        }
        .nb-bell:active { background:var(--bg-3); }
        .nb-bell.has-unread { color:var(--gold); }

        .nb-badge {
          position:absolute; top:-3px; right:-3px;
          min-width:18px; height:18px; padding:0 5px;
          border-radius:var(--r-full);
          background:var(--error);
          color:#fff;
          font-size:10px; font-weight:700;
          display:flex; align-items:center; justify-content:center;
          border:2px solid var(--bg);
          animation:nb-pulse 1.6s ease-in-out infinite;
        }
        @keyframes nb-pulse {
          0%,100% { transform:scale(1); box-shadow:0 0 0 0 rgba(216,100,94,.4); }
          50%     { transform:scale(1.08); box-shadow:0 0 0 6px rgba(216,100,94,0); }
        }

        .nb-dropdown {
          position:absolute; top:48px; right:0; width:360px;
          background:rgba(20,20,26,0.92);
          backdrop-filter:saturate(180%) blur(24px);
          -webkit-backdrop-filter:saturate(180%) blur(24px);
          border:1px solid var(--line-strong);
          border-radius:var(--r-lg);
          box-shadow:var(--shadow-lg);
          z-index:1000; overflow:hidden;
          animation:nb-in var(--dur-base) var(--ease-out);
          transform-origin:top right;
        }
        @keyframes nb-in {
          from { opacity:0; transform:translateY(-6px) scale(0.98); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }

        .nb-header {
          display:flex; justify-content:space-between; align-items:center;
          padding:var(--s-4) var(--s-5);
          border-bottom:1px solid var(--line);
        }
        .nb-title {
          font-family:var(--font-display);
          font-size:var(--text-md);
          font-weight:400;
          letter-spacing:var(--track-tight);
          color:var(--ink);
        }
        .nb-clear {
          font-size:var(--text-2xs);
          font-weight:600;
          letter-spacing:var(--track-wide);
          text-transform:uppercase;
          color:var(--ink-muted);
          cursor:pointer;
          background:none; border:none; padding:0;
          font-family:var(--font-sans);
          transition:color var(--dur-base) var(--ease);
        }
        .nb-clear:hover { color:var(--gold); }

        .nb-list { max-height:400px; overflow-y:auto; }
        .nb-list::-webkit-scrollbar { width:4px; }
        .nb-list::-webkit-scrollbar-thumb { background:var(--line-strong); border-radius:2px; }

        .nb-item {
          display:flex; gap:var(--s-3);
          padding:var(--s-3) var(--s-5);
          border-bottom:1px solid var(--line);
          transition:background var(--dur-fast) var(--ease);
        }
        .nb-item:last-child { border-bottom:none; }
        .nb-item.unread { background:var(--gold-glow); }
        @media (hover:hover) {
          .nb-item:hover { background:rgba(255,255,255,0.02); }
          .nb-item.unread:hover { background:rgba(201,168,76,0.12); }
        }

        .nb-icon-wrap {
          width:32px; height:32px;
          border-radius:var(--r-md);
          background:var(--bg-2);
          border:1px solid var(--line);
          display:flex; align-items:center; justify-content:center;
          color:var(--ink-muted);
          flex-shrink:0;
        }
        .nb-item.unread .nb-icon-wrap { color:var(--gold); border-color:var(--line-gold); }

        .nb-body { flex:1; min-width:0; }
        .nb-item-title {
          font-size:var(--text-sm); font-weight:600;
          color:var(--ink);
          margin-bottom:2px;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .nb-item-msg {
          font-size:var(--text-xs);
          color:var(--ink-muted);
          line-height:1.5;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
          overflow:hidden;
        }
        .nb-meta {
          display:flex; flex-direction:column; align-items:flex-end; gap:6px;
          flex-shrink:0; margin-top:2px;
        }
        .nb-time { font-size:10px; color:var(--ink-faded); white-space:nowrap; }
        .nb-dot { width:6px; height:6px; border-radius:50%; background:var(--gold); }

        .nb-empty {
          padding:var(--s-12) var(--s-5);
          text-align:center;
          display:flex; flex-direction:column; align-items:center; gap:var(--s-3);
          color:var(--ink-faded);
        }
        .nb-empty-text { font-size:var(--text-sm); }

        /* ── MOBILE: Bottom-sheet pattern ── */
        @media (max-width:640px) {
          .nb-backdrop {
            position:fixed; inset:0;
            background:rgba(0,0,0,0.5);
            backdrop-filter:blur(2px);
            -webkit-backdrop-filter:blur(2px);
            z-index:999;
            animation:fadeIn var(--dur-base) var(--ease);
          }
          .nb-dropdown {
            position:fixed;
            top:auto; right:0; left:0; bottom:0;
            width:100%;
            border-radius:var(--r-xl) var(--r-xl) 0 0;
            border-bottom:none;
            max-height:80vh;
            display:flex; flex-direction:column;
            padding-bottom:env(safe-area-inset-bottom);
            animation:nb-slide-up var(--dur-base) var(--ease-out);
            transform-origin:bottom;
          }
          .nb-dropdown::before {
            content:"";
            display:block;
            width:36px; height:4px;
            background:var(--ink-dim);
            border-radius:var(--r-full);
            margin:var(--s-3) auto 0;
            flex-shrink:0;
          }
          .nb-list { max-height:none; flex:1; }
          .nb-header { padding:var(--s-4) var(--s-5) var(--s-3); }
          .nb-item { padding:var(--s-4) var(--s-5); }
        }
        @keyframes nb-slide-up {
          from { transform:translateY(100%); }
          to   { transform:translateY(0); }
        }
      `}</style>

      <button
        className={`nb-bell ${unread > 0 ? "has-unread" : ""}`}
        onClick={toggle}
        aria-label={unread > 0 ? `${unread} thông báo chưa đọc` : "Thông báo"}
        aria-expanded={open}
      >
        <Bell size={18} strokeWidth={1.75} />
        {unread > 0 && <span className="nb-badge">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <>
          <div className="nb-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="nb-dropdown" role="dialog" aria-label="Danh sách thông báo">
          <div className="nb-header">
            <div className="nb-title">Thông báo</div>
            {unread > 0 && (
              <button className="nb-clear" onClick={markRead}>
                Đánh dấu đã đọc
              </button>
            )}
          </div>
          <div className="nb-list">
            {sorted.length === 0 ? (
              <div className="nb-empty">
                <BellOff size={28} strokeWidth={1.5} />
                <div className="nb-empty-text">Chưa có thông báo</div>
              </div>
            ) : (
              sorted.map((n) => {
                const Icon = TYPE_ICONS[n.type] || Megaphone;
                return (
                  <div key={n.id} className={`nb-item ${!n.read ? "unread" : ""}`}>
                    <div className="nb-icon-wrap">
                      <Icon size={16} strokeWidth={1.75} />
                    </div>
                    <div className="nb-body">
                      <div className="nb-item-title">{n.title}</div>
                      <div className="nb-item-msg">{n.message}</div>
                    </div>
                    <div className="nb-meta">
                      <div className="nb-time">{timeAgo(n.timestamp)}</div>
                      {!n.read && <div className="nb-dot" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        </>
      )}

      <style>{`
        /* Hide backdrop on desktop (only used as click-away on mobile sheet) */
        @media (min-width:641px) {
          .nb-backdrop { display:none; }
        }
      `}</style>
    </div>
  );
}
