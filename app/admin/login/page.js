"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (password === "marcher2026") {
      localStorage.setItem("admin_auth", "true");
      router.push("/admin");
    } else {
      setError("Mật khẩu không đúng.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: 24
    }}>
      <style>{`
        .login-card {
          width: 400px; background: var(--bg-card);
          border: 1px solid var(--border); border-radius: var(--radius-lg);
          padding: 48px 40px; text-align: center;
          animation: fadeInUp 0.6s ease-out;
        }
        .login-card h1 {
          font-size: 22px; font-weight: 800; color: #fff;
          margin-bottom: 8px;
        }
        .login-card p {
          font-size: 13px; color: var(--text-secondary);
          margin-bottom: 30px;
        }
        .login-input {
          width: 100%; padding: 14px 16px;
          background: var(--bg-input); border: 1px solid var(--border);
          border-radius: var(--radius); color: var(--text);
          font-size: 15px; font-family: var(--font);
          outline: none; margin-bottom: 16px; text-align: center;
          letter-spacing: 2px;
        }
        .login-input:focus { border-color: var(--gold); }
        .login-btn {
          width: 100%; padding: 14px; background: var(--gold);
          color: #111; font-size: 14px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1.5px;
          border: none; border-radius: var(--radius);
          cursor: pointer; transition: all 0.3s;
        }
        .login-btn:hover { background: var(--gold-light); }
        .login-error {
          color: var(--error); font-size: 13px;
          margin-bottom: 16px;
        }
      `}</style>

      <div className="login-card">
        <div style={{ fontSize: 36, marginBottom: 16 }}>🔐</div>
        <h1>Admin Dashboard</h1>
        <p>Nhập mật khẩu để truy cập quản trị</p>
        {error && <div className="login-error">{error}</div>}
        <input
          className="login-input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button className="login-btn" onClick={handleLogin}>Đăng nhập</button>
      </div>
    </div>
  );
}
