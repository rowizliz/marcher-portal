"use client";
import { useEffect, useState, useRef } from "react";

const TYPE_ICONS = { chat: "💬", progress: "📍", note: "📝", submission: "📋" };

export default function NotificationBell({ target = "client" }) {
  const [notifs, setNotifs] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchNotifs = async () => {
    const res = await fetch(`/api/notifications?target=${target}`);
    const data = await res.json();
    setNotifs(data);
  };

  useEffect(() => {
    fetchNotifs();
    const poll = setInterval(fetchNotifs, 5000);
    return () => clearInterval(poll);
  }, [target]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifs.filter(n => !n.read).length;

  const markRead = async () => {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ target }) });
    setNotifs(notifs.map(n => ({ ...n, read: true })));
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

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <style>{`
        .notif-bell { position:relative;width:40px;height:40px;border-radius:50%;border:1px solid var(--border);background:var(--bg-card);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;font-size:18px; }
        .notif-bell:hover { border-color:var(--gold);background:var(--bg-elevated); }
        .notif-badge { position:absolute;top:-2px;right:-2px;min-width:18px;height:18px;border-radius:9px;background:#e53935;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0 4px;animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        .notif-dropdown { position:absolute;top:48px;right:0;width:340px;background:var(--bg-card);border:1px solid var(--border);border-radius:12px;box-shadow:0 16px 48px rgba(0,0,0,.5);z-index:1000;overflow:hidden;animation:fadeInUp .2s ease-out; }
        .notif-header { display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid var(--border); }
        .notif-title { font-size:14px;font-weight:700;color:#fff; }
        .notif-clear { font-size:11px;color:var(--text-muted);cursor:pointer;transition:color .2s; }
        .notif-clear:hover { color:var(--gold); }
        .notif-list { max-height:360px;overflow-y:auto; }
        .notif-list::-webkit-scrollbar { width:4px; }
        .notif-list::-webkit-scrollbar-thumb { background:var(--border);border-radius:2px; }
        .notif-item { display:flex;gap:12px;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.03);transition:background .2s;cursor:default; }
        .notif-item:hover { background:rgba(255,255,255,.02); }
        .notif-item.unread { background:rgba(201,168,76,.04); }
        .notif-icon { width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;background:var(--bg-elevated);flex-shrink:0; }
        .notif-body { flex:1;min-width:0; }
        .notif-item-title { font-size:13px;font-weight:600;color:#fff;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .notif-item-msg { font-size:12px;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .notif-time { font-size:10px;color:var(--text-muted);flex-shrink:0;margin-top:2px; }
        .notif-empty { padding:40px 16px;text-align:center;color:var(--text-muted);font-size:13px; }
        .notif-unread-dot { width:6px;height:6px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:6px; }
      `}</style>

      <button className="notif-bell" onClick={toggle}>
        🔔
        {unread > 0 && <span className="notif-badge">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <div className="notif-title">Thông báo</div>
            {notifs.length > 0 && <span className="notif-clear" onClick={markRead}>Đánh dấu đã đọc</span>}
          </div>
          <div className="notif-list">
            {notifs.length === 0 ? (
              <div className="notif-empty">🔕 Chưa có thông báo</div>
            ) : (
              [...notifs].reverse().map(n => (
                <div key={n.id} className={`notif-item ${!n.read ? "unread" : ""}`}>
                  <div className="notif-icon">{TYPE_ICONS[n.type] || "📢"}</div>
                  <div className="notif-body">
                    <div className="notif-item-title">{n.title}</div>
                    <div className="notif-item-msg">{n.message}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <div className="notif-time">{timeAgo(n.timestamp)}</div>
                    {!n.read && <div className="notif-unread-dot" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
