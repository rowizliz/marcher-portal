"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientLogin() {
  const router = useRouter();
  const [step, setStep] = useState("loading"); // loading, login, setup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check if already logged in
    if (typeof window !== "undefined" && localStorage.getItem("client_auth") === "true") {
      router.push("/");
      return;
    }
    // Check if password exists
    fetch("/api/client-auth")
      .then(r => r.json())
      .then(data => setStep(data.hasPassword ? "login" : "username"))
      .catch(() => setStep("login"));
  }, [router]);

  const handleUsername = () => {
    if (username.toLowerCase() !== "marcher") {
      setError("Tên đăng nhập không đúng");
      return;
    }
    setError("");
    setStep("setup");
  };

  const handleSetup = async () => {
    if (password.length < 4) { setError("Mật khẩu phải có ít nhất 4 ký tự"); return; }
    if (password !== confirmPw) { setError("Mật khẩu xác nhận không khớp"); return; }
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/client-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "marcher", password, action: "setup" }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("client_auth", "true");
      router.push("/");
    } else {
      setError(data.error || "Có lỗi xảy ra");
    }
    setSubmitting(false);
  };

  const handleLogin = async () => {
    if (!password) { setError("Vui lòng nhập mật khẩu"); return; }
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/client-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "marcher", password, action: "login" }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("client_auth", "true");
      router.push("/");
    } else if (data.needSetup) {
      setStep("username");
      setPassword("");
    } else {
      setError(data.error || "Mật khẩu không đúng");
    }
    setSubmitting(false);
  };

  if (step === "loading") {
    return (
      <div className="page-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ color: "var(--text-muted)", fontSize: 14 }}>⏳ Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <style>{`
        .login-card { width:100%;max-width:420px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;animation:fadeInUp .5s ease-out; }
        .login-accent { height:3px;background:linear-gradient(90deg,#111,var(--gold),#111); }
        .login-body { padding:50px 40px; }
        .login-brand { text-align:center;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--gold);margin-bottom:10px; }
        .login-title { text-align:center;font-size:24px;font-weight:800;color:#fff;margin-bottom:6px; }
        .login-sub { text-align:center;font-size:13px;color:var(--text-secondary);margin-bottom:36px;line-height:1.6; }
        .login-label { font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px;display:block; }
        .login-input { width:100%;padding:14px 16px;background:var(--bg-input);border:1px solid var(--border);border-radius:8px;color:#fff;font-size:14px;font-family:var(--font);outline:none;transition:all .2s;margin-bottom:16px; }
        .login-input:focus { border-color:var(--gold); }
        .login-btn { width:100%;padding:16px;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:2px;border:none;border-radius:8px;cursor:pointer;transition:all .3s;font-family:var(--font); }
        .login-btn.primary { background:linear-gradient(135deg,var(--gold),var(--gold-dim));color:#111; }
        .login-btn.primary:hover { transform:translateY(-2px);box-shadow:0 8px 24px rgba(201,168,76,.3); }
        .login-btn:disabled { opacity:.5;cursor:not-allowed;transform:none!important; }
        .login-error { background:rgba(229,57,53,.1);border:1px solid rgba(229,57,53,.2);color:#ef5350;padding:10px 14px;border-radius:6px;font-size:13px;margin-bottom:16px;text-align:center; }
        .login-step { display:flex;gap:8px;justify-content:center;margin-bottom:30px; }
        .login-dot { width:8px;height:8px;border-radius:50%;background:var(--border);transition:all .3s; }
        .login-dot.active { background:var(--gold);width:24px;border-radius:4px; }
        .login-icon { text-align:center;font-size:48px;margin-bottom:20px; }
      `}</style>

      <div className="login-card">
        <div className="login-accent" />
        <div className="login-body">
          <div className="login-brand">Marcher × Rowiz Lê Design</div>

          {step === "username" && (
            <>
              <div className="login-icon">🔐</div>
              <div className="login-title">Chào mừng</div>
              <div className="login-sub">Lần đầu truy cập? Nhập tên đăng nhập để bắt đầu thiết lập tài khoản.</div>
              <div className="login-step">
                <div className="login-dot active" />
                <div className="login-dot" />
              </div>
              <label className="login-label">Tên đăng nhập</label>
              <input
                className="login-input"
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleUsername()}
                placeholder="Nhập username..."
                autoFocus
              />
              {error && <div className="login-error">{error}</div>}
              <button className="login-btn primary" onClick={handleUsername}>Tiếp tục →</button>
            </>
          )}

          {step === "setup" && (
            <>
              <div className="login-icon">🔑</div>
              <div className="login-title">Tạo mật khẩu</div>
              <div className="login-sub">Tạo mật khẩu để bảo vệ tài khoản của bạn. Bạn sẽ dùng mật khẩu này để đăng nhập lần sau.</div>
              <div className="login-step">
                <div className="login-dot" />
                <div className="login-dot active" />
              </div>
              <label className="login-label">Mật khẩu mới</label>
              <input
                className="login-input"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Tối thiểu 4 ký tự"
                autoFocus
              />
              <label className="login-label">Xác nhận mật khẩu</label>
              <input
                className="login-input"
                type="password"
                value={confirmPw}
                onChange={(e) => { setConfirmPw(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSetup()}
                placeholder="Nhập lại mật khẩu"
              />
              {error && <div className="login-error">{error}</div>}
              <button className="login-btn primary" onClick={handleSetup} disabled={submitting}>
                {submitting ? "Đang tạo..." : "🔐 Tạo mật khẩu & Đăng nhập"}
              </button>
            </>
          )}

          {step === "login" && (
            <>
              <div className="login-icon">👋</div>
              <div className="login-title">Đăng nhập</div>
              <div className="login-sub">Nhập mật khẩu để truy cập Client Portal</div>
              <label className="login-label">Mật khẩu</label>
              <input
                className="login-input"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Nhập mật khẩu..."
                autoFocus
              />
              {error && <div className="login-error">{error}</div>}
              <button className="login-btn primary" onClick={handleLogin} disabled={submitting}>
                {submitting ? "Đang đăng nhập..." : "→ Đăng nhập"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
