"use client";
import Link from "next/link";
import ChatBox from "@/components/ChatBox";

export default function ClientChat() {
  return (
    <div className="page-wrapper">
      <style>{`
        .chat-page { max-width:700px;margin:0 auto; }
        .back-link { display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-muted);margin-bottom:24px;transition:color .3s; }
        .back-link:hover { color:var(--gold); }
        .chat-page-title { font-size:22px;font-weight:800;color:#fff;margin-bottom:6px; }
        .chat-page-sub { font-size:13px;color:var(--text-secondary);margin-bottom:24px; }
      `}</style>
      <div className="chat-page">
        <Link href="/" className="back-link">← Quay lại Portal</Link>
        <div className="chat-page-title">💬 Trò chuyện</div>
        <div className="chat-page-sub">Gửi tin nhắn, ảnh hoặc file cho đội ngũ thiết kế</div>
        <ChatBox role="client" />
      </div>
    </div>
  );
}
