"use client";
import { useEffect, useState, useRef } from "react";

export default function ChatBox({ role = "client" }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  const fileRef = useRef(null);
  const pollRef = useRef(null);

  const fetchMsgs = async () => {
    const res = await fetch("/api/chat");
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMsgs();
    pollRef.current = setInterval(fetchMsgs, 4000);
    return () => clearInterval(pollRef.current);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMsg = async (msgText, file) => {
    if (!msgText && !file) return;
    setSending(true);
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: role, text: msgText, file }),
    });
    setText("");
    await fetchMsgs();
    setSending(false);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { alert("File quá lớn (tối đa 2MB)"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      sendMsg("", { name: f.name, type: f.type, data: reader.result });
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  };

  const isImg = (type) => type?.startsWith("image/");
  const isMe = (from) => from === role;

  return (
    <div>
      <style>{`
        .chat-container { background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;display:flex;flex-direction:column;height:520px; }
        .chat-header { padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px; }
        .chat-header-dot { width:8px;height:8px;border-radius:50%;background:#4caf50; }
        .chat-header-title { font-size:14px;font-weight:700;color:#fff; }
        .chat-header-sub { font-size:11px;color:var(--text-muted);margin-left:auto; }
        .chat-messages { flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:10px; }
        .chat-messages::-webkit-scrollbar { width:4px; }
        .chat-messages::-webkit-scrollbar-thumb { background:var(--border);border-radius:2px; }
        .msg { max-width:75%;display:flex;flex-direction:column; }
        .msg.mine { align-self:flex-end; }
        .msg.theirs { align-self:flex-start; }
        .msg-bubble { padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.5;word-break:break-word; }
        .msg.mine .msg-bubble { background:var(--gold);color:#111;border-bottom-right-radius:4px; }
        .msg.theirs .msg-bubble { background:var(--bg-elevated);color:var(--text);border:1px solid var(--border);border-bottom-left-radius:4px; }
        .msg-meta { font-size:10px;color:var(--text-muted);margin-top:4px;padding:0 4px; }
        .msg.mine .msg-meta { text-align:right; }
        .msg-file { margin-top:6px; }
        .msg-img { max-width:240px;max-height:200px;border-radius:8px;cursor:pointer;transition:transform .2s; }
        .msg-img:hover { transform:scale(1.02); }
        .msg-file-link { display:inline-flex;align-items:center;gap:6px;padding:8px 12px;background:var(--bg-input);border:1px solid var(--border);border-radius:6px;font-size:12px;color:var(--text);text-decoration:none;transition:border-color .2s; }
        .msg-file-link:hover { border-color:var(--gold); }
        .chat-input { display:flex;gap:8px;padding:14px 16px;border-top:1px solid var(--border);background:var(--bg-elevated); }
        .chat-text { flex:1;padding:10px 14px;background:var(--bg-input);border:1px solid var(--border);border-radius:20px;color:var(--text);font-size:13px;font-family:var(--font);outline:none;resize:none;max-height:80px; }
        .chat-text:focus { border-color:var(--gold); }
        .chat-btn { width:40px;height:40px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:all .2s; }
        .chat-send { background:var(--gold);color:#111; }
        .chat-send:hover { background:var(--gold-light);transform:scale(1.05); }
        .chat-send:disabled { opacity:.4;cursor:not-allowed;transform:none; }
        .chat-attach { background:var(--bg-input);color:var(--text-secondary);border:1px solid var(--border); }
        .chat-attach:hover { border-color:var(--gold);color:var(--gold); }
        .chat-empty { text-align:center;color:var(--text-muted);font-size:13px;margin:auto; }
      `}</style>

      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-dot" />
          <div className="chat-header-title">
            {role === "admin" ? "Chat với Marcher" : "Chat với Rowiz Lê Design"}
          </div>
          <div className="chat-header-sub">{messages.length} tin nhắn</div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">💬 Chưa có tin nhắn. Bắt đầu cuộc trò chuyện!</div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`msg ${isMe(msg.from) ? "mine" : "theirs"}`}>
              <div className="msg-bubble">
                {msg.text && <div>{msg.text}</div>}
                {msg.file && (
                  <div className="msg-file">
                    {isImg(msg.file.type) ? (
                      <img className="msg-img" src={msg.file.data} alt={msg.file.name} onClick={() => window.open(msg.file.data, "_blank")} />
                    ) : (
                      <a className="msg-file-link" href={msg.file.data} download={msg.file.name}>📎 {msg.file.name}</a>
                    )}
                  </div>
                )}
              </div>
              <div className="msg-meta">
                {msg.from === "admin" ? "Rowiz Lê" : "Marcher"} · {new Date(msg.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="chat-input">
          <button className="chat-btn chat-attach" onClick={() => fileRef.current?.click()} title="Đính kèm file">📎</button>
          <input type="file" ref={fileRef} hidden onChange={handleFile} accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip" />
          <textarea
            className="chat-text"
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(text); } }}
            placeholder="Nhập tin nhắn..."
          />
          <button className="chat-btn chat-send" disabled={sending || !text.trim()} onClick={() => sendMsg(text)}>➤</button>
        </div>
      </div>
    </div>
  );
}
