"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ContentEditor from "./ContentEditor";

const PHASES = {
  week_1: { label: "Tuần 1 — Build Up", color: "#c9a84c" },
  week_2: { label: "Tuần 2 — Fix & Custom", color: "#ff9800" },
  week_3: { label: "Tuần 3 — Review & Bàn giao", color: "#4caf50" },
  completed: { label: "Hoàn thành ✓", color: "#4caf50" },
};

const STATUS_LABELS = {
  new: { label: "Mới", color: "#c9a84c" },
  reviewing: { label: "Đang xem", color: "#ff9800" },
  approved: { label: "Đã duyệt", color: "#4caf50" },
  completed: { label: "Hoàn tất", color: "#888" },
};

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [workflow, setWorkflow] = useState({ current_phase: "week_1", progress: 0, notes: "" });
  const [selectedSub, setSelectedSub] = useState(null);
  const [tab, setTab] = useState("overview");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin_auth") !== "true") {
      router.push("/admin/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    const [subRes, wfRes] = await Promise.all([
      fetch("/api/submissions"),
      fetch("/api/workflow"),
    ]);
    setSubmissions(await subRes.json());
    setWorkflow(await wfRes.json());
  };

  const updateStatus = async (id, status) => {
    await fetch("/api/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  const updateWorkflow = async (updates) => {
    const newWf = { ...workflow, ...updates };
    setWorkflow(newWf);
    await fetch("/api/workflow", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWf),
    });
  };

  const logout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  return (
    <div className="page-wrapper">
      <style>{`
        .admin-layout { max-width: 1100px; margin: 0 auto; }
        .admin-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 30px; padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }
        .admin-title {
          font-size: 24px; font-weight: 800; color: #fff;
        }
        .admin-subtitle {
          font-size: 13px; color: var(--text-muted); margin-top: 4px;
        }
        .tab-bar {
          display: flex; gap: 4px; margin-bottom: 30px;
          background: var(--bg-card); border-radius: var(--radius);
          padding: 4px; border: 1px solid var(--border);
        }
        .tab-btn {
          flex: 1; padding: 12px 16px; font-size: 13px; font-weight: 600;
          color: var(--text-secondary); background: none; border: none;
          border-radius: 6px; cursor: pointer; transition: all 0.2s;
          font-family: var(--font);
        }
        .tab-btn.active { background: var(--bg-elevated); color: #fff; }
        .tab-btn:hover:not(.active) { color: var(--text); }

        /* Stats */
        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 16px; margin-bottom: 30px;
        }
        .stat-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 20px;
        }
        .stat-label {
          font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px;
          color: var(--text-muted); margin-bottom: 8px;
        }
        .stat-value { font-size: 28px; font-weight: 800; color: #fff; }

        /* Submissions table */
        .sub-table {
          width: 100%; border-collapse: collapse;
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius); overflow: hidden;
        }
        .sub-table th {
          padding: 14px 16px; text-align: left; font-size: 11px;
          text-transform: uppercase; letter-spacing: 1.5px;
          color: var(--text-muted); border-bottom: 1px solid var(--border);
        }
        .sub-table td {
          padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.03);
          font-size: 14px;
        }
        .sub-table tr:hover td { background: rgba(255,255,255,0.02); }
        .status-badge {
          display: inline-block; padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 600;
        }
        .view-btn {
          padding: 6px 14px; font-size: 12px; font-weight: 600;
          background: var(--bg-elevated); color: var(--text);
          border: 1px solid var(--border); border-radius: 4px;
          cursor: pointer; transition: all 0.2s; font-family: var(--font);
        }
        .view-btn:hover { border-color: var(--gold); color: var(--gold); }

        /* Workflow */
        .wf-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 30px;
        }
        .wf-phase-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 10px; margin: 20px 0;
        }
        .wf-phase-btn {
          padding: 14px 10px; text-align: center; font-size: 12px;
          font-weight: 600; border: 1px solid var(--border);
          border-radius: var(--radius); cursor: pointer;
          transition: all 0.2s; background: var(--bg-input);
          color: var(--text-secondary); font-family: var(--font);
        }
        .wf-phase-btn.active {
          border-color: var(--gold); color: var(--gold);
          background: rgba(201,168,76,0.08);
        }
        .progress-bar {
          height: 8px; background: var(--bg-input);
          border-radius: 4px; margin: 20px 0; overflow: hidden;
        }
        .progress-fill {
          height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold-light));
          border-radius: 4px; transition: width 0.5s;
        }
        .wf-notes {
          width: 100%; min-height: 100px; padding: 14px;
          background: var(--bg-input); border: 1px solid var(--border);
          border-radius: var(--radius); color: var(--text);
          font-size: 14px; font-family: var(--font);
          resize: vertical; outline: none;
        }
        .wf-notes:focus { border-color: var(--gold); }

        /* Detail modal */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 24px;
        }
        .modal-content {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 36px;
          max-width: 700px; width: 100%; max-height: 80vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 24px; padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }
        .modal-close {
          background: none; border: none; color: var(--text-muted);
          font-size: 24px; cursor: pointer;
        }
        .detail-row { margin-bottom: 16px; }
        .detail-label {
          font-size: 11px; text-transform: uppercase; letter-spacing: 1px;
          color: var(--text-muted); margin-bottom: 4px;
        }
        .detail-value { font-size: 14px; color: var(--text); line-height: 1.6; }
        .status-select {
          padding: 8px 14px; background: var(--bg-input);
          border: 1px solid var(--border); border-radius: var(--radius);
          color: var(--text); font-size: 13px; font-family: var(--font);
          cursor: pointer; outline: none;
        }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .wf-phase-grid { grid-template-columns: 1fr 1fr; }
          .tab-bar { flex-wrap: wrap; }
        }
      `}</style>

      <div className="admin-layout">
        <div className="admin-header">
          <div>
            <div className="admin-title">🏗️ Admin Dashboard</div>
            <div className="admin-subtitle">Marcher — Premium Digital Platform</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/" className="btn btn-outline" style={{ fontSize: 12, padding: "8px 16px" }}>
              Portal ↗
            </Link>
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={logout}>
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="tab-bar">
          {["overview", "submissions", "workflow", "content"].map((t) => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "overview" ? "📊 Tổng quan" : t === "submissions" ? "📋 Submissions" : t === "workflow" ? "⚙️ Workflow" : "✏️ Nội dung"}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Tổng submissions</div>
                <div className="stat-value">{submissions.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Mới</div>
                <div className="stat-value" style={{ color: "var(--gold)" }}>
                  {submissions.filter((s) => s.status === "new").length}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Giai đoạn hiện tại</div>
                <div className="stat-value" style={{ fontSize: 16 }}>
                  {PHASES[workflow.current_phase]?.label || "N/A"}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Tiến độ</div>
                <div className="stat-value">{workflow.progress || 0}%</div>
              </div>
            </div>

            <div className="wf-card">
              <h3 style={{ marginBottom: 12 }}>Tiến độ dự án</h3>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${workflow.progress || 0}%` }} />
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                {PHASES[workflow.current_phase]?.label} — {workflow.progress || 0}% hoàn thành
              </div>
            </div>
          </>
        )}

        {/* SUBMISSIONS TAB */}
        {tab === "submissions" && (
          <>
            {submissions.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                <p>Chưa có submission nào. Khi khách hàng gửi Client Brief, dữ liệu sẽ hiện ở đây.</p>
              </div>
            ) : (
              <table className="sub-table">
                <thead>
                  <tr>
                    <th>Công ty</th>
                    <th>Người liên hệ</th>
                    <th>Ngày gửi</th>
                    <th>Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.id}>
                      <td style={{ fontWeight: 600, color: "#fff" }}>{sub.company_name}</td>
                      <td>{sub.contact_person}</td>
                      <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                        {new Date(sub.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            background: `${STATUS_LABELS[sub.status]?.color}20`,
                            color: STATUS_LABELS[sub.status]?.color,
                          }}
                        >
                          {STATUS_LABELS[sub.status]?.label}
                        </span>
                      </td>
                      <td>
                        <button className="view-btn" onClick={() => setSelectedSub(sub)}>
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* WORKFLOW TAB */}
        {tab === "workflow" && (
          <div className="wf-card">
            <h3 style={{ marginBottom: 20 }}>Cập nhật Tiến độ Dự án</h3>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>
                Giai đoạn hiện tại:
              </div>
              <div className="wf-phase-grid">
                {Object.entries(PHASES).map(([key, val]) => (
                  <button
                    key={key}
                    className={`wf-phase-btn ${workflow.current_phase === key ? "active" : ""}`}
                    onClick={() => updateWorkflow({ current_phase: key })}
                  >
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>
                % Hoàn thành: <strong style={{ color: "var(--gold)" }}>{workflow.progress || 0}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={workflow.progress || 0}
                onChange={(e) => updateWorkflow({ progress: parseInt(e.target.value) })}
                style={{ width: "100%", accentColor: "var(--gold)" }}
              />
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${workflow.progress || 0}%` }} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>
                Ghi chú:
              </div>
              <textarea
                className="wf-notes"
                value={workflow.notes || ""}
                onChange={(e) => updateWorkflow({ notes: e.target.value })}
                placeholder="Ghi chú tiến độ, vấn đề phát sinh..."
              />
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {tab === "content" && <ContentEditor />}

        {/* DETAIL MODAL */}
        {selectedSub && (
          <div className="modal-overlay" onClick={() => setSelectedSub(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>
                  📋 {selectedSub.company_name}
                </h2>
                <button className="modal-close" onClick={() => setSelectedSub(null)}>×</button>
              </div>

              <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                <div className="detail-row" style={{ flex: 1 }}>
                  <div className="detail-label">Ngày gửi</div>
                  <div className="detail-value">
                    {new Date(selectedSub.created_at).toLocaleString("vi-VN")}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Cập nhật trạng thái</div>
                  <select
                    className="status-select"
                    value={selectedSub.status}
                    onChange={(e) => {
                      updateStatus(selectedSub.id, e.target.value);
                      setSelectedSub({ ...selectedSub, status: e.target.value });
                    }}
                  >
                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedSub.form_data && Object.entries(selectedSub.form_data).map(([key, value]) => (
                <div key={key} className="detail-row">
                  <div className="detail-label">{key.replace(/_/g, " ")}</div>
                  <div className="detail-value">
                    {Array.isArray(value) ? value.join(", ") : value || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
