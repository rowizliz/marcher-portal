"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const SECTIONS = [
  {
    id: "company",
    title: "I. Doanh nghiệp & Đội ngũ",
    fields: [
      { key: "company_name", label: "1. Tên thương hiệu / Công ty:", type: "text" },
      { key: "contact_person", label: "2. Người phụ trách chính:", hint: "(Tên, SĐT, Zalo, Email)", type: "text" },
      { key: "approver", label: "3. Người duyệt cuối cùng:", type: "text" },
      { key: "company_history", label: "4. Tóm tắt lịch sử và mô hình kinh doanh:", type: "textarea" },
    ],
  },
  {
    id: "brand",
    title: "II. Nền tảng thương hiệu (Brand DNA)",
    fields: [
      { key: "vision_mission", label: "1. Tầm nhìn & Sứ mệnh:", type: "textarea" },
      { key: "core_values", label: "2. Giá trị cốt lõi:", type: "textarea" },
      { key: "brand_personality", label: "3. Tính cách thương hiệu:", type: "text" },
      { key: "usp", label: "4. Lợi thế bán hàng độc nhất (USP):", type: "textarea" },
    ],
  },
  {
    id: "market",
    title: "III. Thị trường & Đối thủ",
    fields: [
      { key: "segment", label: "1. Phân khúc định vị:", type: "checkbox", options: ["Mass Market", "Mid-end", "Premium", "Luxury / Bespoke"] },
      { key: "competitors", label: "2. Ba đối thủ cạnh tranh mạnh nhất:", type: "textarea" },
      { key: "dislike_competitors", label: "3. Điều KHÔNG THÍCH ở web đối thủ:", type: "textarea" },
    ],
  },
  {
    id: "audience",
    title: "IV. Khách hàng mục tiêu",
    fields: [
      { key: "persona", label: "1. Chân dung khách hàng chính:", hint: "(Độ tuổi, Giới tính, Nghề, Thu nhập)", type: "textarea" },
      { key: "pain_points", label: "2. Nỗi đau & Động lực mua hàng:", type: "textarea" },
    ],
  },
  {
    id: "goals",
    title: "V. Mục tiêu & KPI",
    fields: [
      { key: "goals", label: "1. Mục đích ưu tiên nhất:", type: "checkbox", options: ["Lead Generation", "E-commerce", "Brand Awareness", "Automation (Booking)"] },
      { key: "kpis", label: "2. KPIs cụ thể sau khi ra mắt:", type: "textarea" },
    ],
  },
  {
    id: "ux",
    title: "VI. Cấu trúc & Trải nghiệm (UX)",
    fields: [
      { key: "sitemap", label: "1. Sitemap — Danh sách trang:", type: "textarea" },
      { key: "user_flow", label: "2. User Flow chính:", type: "textarea" },
    ],
  },
  {
    id: "design",
    title: "VII. Định hướng thẩm mỹ",
    fields: [
      { key: "brand_guidelines", label: "1. Tình trạng Brand Guidelines:", type: "checkbox", options: ["Đã có đầy đủ", "Chỉ có Logo", "Chưa có gì"] },
      { key: "design_style", label: "2. Phong cách thiết kế:", type: "checkbox", options: ["Dark & Moody", "Clean & Minimalist", "Bold & Brutalist", "Classic & Heritage"] },
      { key: "animation_level", label: "3. Mức độ Animation:", type: "checkbox_with_other", options: ["Siêu tốc độ", "Mượt mà tinh tế", "Ấn tượng mạnh"] },
      { key: "references", label: "4. Link website bạn thích & Lý do:", type: "textarea" },
      { key: "design_donts", label: "5. Design Don'ts:", type: "textarea" },
    ],
  },
  {
    id: "content",
    title: "VIII. Nội dung & Tài nguyên",
    fields: [
      { key: "visual_assets", label: "1. Visual Assets:", type: "checkbox", options: ["Đã có 100%", "Cần thêm Stock", "Cần chụp/quay mới"] },
      { key: "copywriting", label: "2. Copywriting:", type: "checkbox", options: ["Tự viết toàn bộ", "Có thô, cần biên tập", "Cần viết từ A-Z"] },
    ],
  },
  {
    id: "tech",
    title: "IX. Yêu cầu kỹ thuật",
    fields: [
      { key: "tech_stack", label: "1. Nền tảng công nghệ:", type: "checkbox_with_other", options: ["Custom cao cấp (Next.js)", "Để Agency tư vấn"] },
      { key: "backend_features", label: "2. Tính năng Backend:", type: "checkbox", options: ["E-commerce", "Quản lý kho", "Booking", "Membership", "Đa ngôn ngữ", "Phân quyền Admin"] },
    ],
  },
  {
    id: "budget",
    title: "X. Tiến độ & Ngân sách",
    fields: [
      { key: "deadline", label: "1. Deadline bắt buộc:", type: "text" },
      { key: "budget", label: "2. Ngân sách dự kiến:", type: "checkbox", options: ["Dưới 30 triệu", "30-60 triệu", "60-100+ triệu", "Trên 100 triệu"] },
      { key: "maintenance", label: "3. Yêu cầu Bảo hành:", type: "textarea" },
    ],
  },
];

export default function BriefPage() {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [previousId, setPreviousId] = useState(null);
  const [previousDate, setPreviousDate] = useState("");
  const [loading, setLoading] = useState(true);

  // Load previous submission on mount
  useEffect(() => {
    fetch("/api/submissions/latest")
      .then(r => r.json())
      .then(data => {
        if (data && data.form_data && Object.keys(data.form_data).length > 0) {
          setFormData(data.form_data);
          setHasPrevious(true);
          setPreviousId(data.id);
          const dateStr = data.updated_at || data.created_at;
          setPreviousDate(new Date(dateStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCheckbox = (key, option) => {
    setFormData((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [key]: updated };
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        company_name: formData.company_name || "Chưa điền",
        contact_person: formData.contact_person || "Chưa điền",
        form_data: formData,
      };

      let res;
      if (previousId) {
        // Update existing submission
        res = await fetch("/api/submissions", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: previousId, ...payload }),
        });
      } else {
        // Create new submission
        res = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setPreviousId(data.id);
        }
      }

      if (res.ok) {
        setSubmitted(true);
        setHasPrevious(true);
      } else {
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch {
      alert("Không thể kết nối. Vui lòng thử lại.");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="page-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <div style={{ textAlign: "center", animation: "fadeInUp 0.6s ease-out" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
            {hasPrevious ? "Cập nhật thành công!" : "Cảm ơn bạn!"}
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: 30 }}>
            {hasPrevious
              ? "Phiếu khảo sát đã được cập nhật.\nChúng tôi sẽ xem xét các thay đổi ngay."
              : "Phiếu khảo sát đã được gửi thành công.\nChúng tôi sẽ liên hệ lại trong vòng 24-48h."}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/" className="btn btn-primary">← Quay lại Portal</Link>
            <button className="btn btn-outline" onClick={() => { setSubmitted(false); setHasPrevious(true); }}>
              ✏️ Tiếp tục chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <style>{`
        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; color: var(--text-muted);
          margin-bottom: 30px; transition: color 0.3s;
        }
        .back-link:hover { color: var(--gold); }
        .brief-container {
          max-width: 880px; margin: 0 auto;
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius-lg); overflow: hidden;
          animation: fadeInUp 0.6s ease-out;
        }
        .brief-accent {
          height: 3px;
          background: linear-gradient(90deg, #111, var(--gold), #111);
        }
        .brief-body { padding: 50px 55px; }
        .brief-header {
          text-align: center; margin-bottom: 50px;
          padding-bottom: 30px; border-bottom: 1px solid var(--border);
        }
        .brief-header .brand {
          font-size: 11px; font-weight: 700; letter-spacing: 4px;
          text-transform: uppercase; color: var(--gold); margin-bottom: 16px;
        }
        .brief-header h1 {
          font-size: 26px; font-weight: 800; color: #fff;
          text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px;
        }
        .brief-header .en {
          font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;
        }
        .brief-header p {
          font-size: 14px; color: var(--text-secondary);
          line-height: 1.7; max-width: 600px; margin: 0 auto;
        }
        .previous-banner {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 20px; margin-bottom: 30px;
          background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.2);
          border-radius: 8px; animation: fadeInUp 0.4s ease-out;
        }
        .previous-icon { font-size: 20px; }
        .previous-text { flex: 1; }
        .previous-title { font-size: 13px; font-weight: 700; color: var(--gold); margin-bottom: 2px; }
        .previous-sub { font-size: 12px; color: var(--text-secondary); }
        .previous-badge { padding: 4px 12px; border-radius: 12px; font-size: 10px; font-weight: 700; background: rgba(201,168,76,0.15); color: var(--gold); text-transform: uppercase; letter-spacing: 1px; }
        .section { margin-bottom: 40px; }
        .section-title {
          font-size: 12px; font-weight: 800; color: #fff;
          background: rgba(255,255,255,0.08); padding: 10px 18px;
          display: inline-block; border-radius: 4px;
          text-transform: uppercase; letter-spacing: 1.5px;
          margin-bottom: 20px; border-left: 3px solid var(--gold);
        }
        .form-group { margin-bottom: 20px; }
        .question-label {
          font-weight: 700; font-size: 14px; color: #fff;
          margin-bottom: 6px; display: block;
        }
        .hint-text {
          font-size: 12px; color: var(--text-muted);
          font-style: italic; margin-bottom: 8px; display: block;
        }
        .checkbox-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 8px; margin-top: 8px;
        }
        .checkbox-grid.single { grid-template-columns: 1fr; }
        .cb-label {
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: var(--text);
          cursor: pointer; padding: 10px 14px;
          border: 1px solid var(--border); border-radius: 6px;
          transition: all 0.2s;
        }
        .cb-label:hover { border-color: var(--border-hover); background: var(--bg-elevated); }
        .cb-label.checked { border-color: var(--gold); background: rgba(201,168,76,0.06); }
        .cb-label input { accent-color: var(--gold); width: 16px; height: 16px; cursor: pointer; }
        .other-input {
          margin-top: 8px; width: 100%; padding: 10px 14px;
          background: var(--bg-input); border: 1px solid var(--border);
          border-radius: 6px; color: var(--text); font-size: 13px;
          font-family: var(--font); outline: none; transition: all 0.2s;
        }
        .other-input:focus { border-color: var(--gold); }
        .submit-area {
          margin-top: 40px; padding-top: 30px;
          border-top: 1px solid var(--border);
          display: flex; gap: 12px;
        }
        .submit-btn {
          flex: 1; padding: 18px; font-size: 14px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 2px;
          border: none; border-radius: var(--radius);
          cursor: pointer; transition: all 0.3s;
          font-family: var(--font);
        }
        .submit-btn.primary {
          background: linear-gradient(135deg, var(--gold), var(--gold-dim));
          color: #111;
        }
        .submit-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(201,168,76,0.3);
        }
        .submit-btn.secondary {
          background: transparent; color: var(--text);
          border: 1px solid var(--border);
        }
        .submit-btn.secondary:hover { border-color: var(--border-hover); }
        .submit-btn:disabled {
          opacity: 0.5; cursor: not-allowed; transform: none !important;
        }
        .loading-brief { text-align: center; padding: 60px; color: var(--text-muted); font-size: 14px; }
        @media (max-width: 768px) {
          .brief-body { padding: 24px; }
          .checkbox-grid { grid-template-columns: 1fr; }
          .submit-area { flex-direction: column; }
        }
      `}</style>

      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <Link href="/" className="back-link">← Quay lại Portal</Link>
      </div>

      <div className="brief-container">
        <div className="brief-accent" />
        <div className="brief-body">
          <div className="brief-header">
            <div className="brand">Marcher × Rowiz Lê Design</div>
            <h1>Phiếu Khảo Sát Dự Án</h1>
            <div className="en">THE ULTIMATE CLIENT BRIEF</div>
            <p>Vui lòng điền đầy đủ thông tin để chúng tôi hiểu sâu sắc nhất về tầm nhìn và yêu cầu của bạn.</p>
          </div>

          {loading ? (
            <div className="loading-brief">⏳ Đang tải dữ liệu...</div>
          ) : (
            <>
              {hasPrevious && (
                <div className="previous-banner">
                  <div className="previous-icon">📋</div>
                  <div className="previous-text">
                    <div className="previous-title">Bạn đã gửi phiếu trước đó</div>
                    <div className="previous-sub">Lần gửi gần nhất: {previousDate} — Dữ liệu đã được tải lại để bạn xem và chỉnh sửa.</div>
                  </div>
                  <div className="previous-badge">Đã điền</div>
                </div>
              )}

              {SECTIONS.map((section) => (
                <div key={section.id} className="section">
                  <div className="section-title">{section.title}</div>
                  {section.fields.map((field) => (
                    <div key={field.key} className="form-group">
                      <label className="question-label">{field.label}</label>
                      {field.hint && <span className="hint-text">{field.hint}</span>}

                      {field.type === "text" && (
                        <input
                          className="input"
                          type="text"
                          value={formData[field.key] || ""}
                          onChange={(e) => updateField(field.key, e.target.value)}
                        />
                      )}

                      {field.type === "textarea" && (
                        <textarea
                          className="textarea"
                          value={formData[field.key] || ""}
                          onChange={(e) => updateField(field.key, e.target.value)}
                        />
                      )}

                      {(field.type === "checkbox" || field.type === "checkbox_with_other") && (
                        <div className={`checkbox-grid ${field.options.length <= 3 ? "single" : ""}`}>
                          {field.options.map((opt) => {
                            const checked = (formData[field.key] || []).includes(opt);
                            return (
                              <label key={opt} className={`cb-label ${checked ? "checked" : ""}`}>
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleCheckbox(field.key, opt)}
                                />
                                {opt}
                              </label>
                            );
                          })}
                          {field.type === "checkbox_with_other" && (
                            <div>
                              <label className={`cb-label ${(formData[field.key] || []).includes("Khác") ? "checked" : ""}`}>
                                <input
                                  type="checkbox"
                                  checked={(formData[field.key] || []).includes("Khác")}
                                  onChange={() => toggleCheckbox(field.key, "Khác")}
                                />
                                Khác:
                              </label>
                              {(formData[field.key] || []).includes("Khác") && (
                                <input
                                  className="other-input"
                                  type="text"
                                  placeholder="Nhập nội dung khác..."
                                  value={formData[field.key + "_other"] || ""}
                                  onChange={(e) => updateField(field.key + "_other", e.target.value)}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              <div className="submit-area">
                <button
                  className="submit-btn primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Đang gửi..." : hasPrevious ? "📤 Cập nhật phiếu khảo sát" : "📤 Gửi phiếu khảo sát"}
                </button>
                <button className="submit-btn secondary" onClick={() => window.print()}>
                  🖨 In / Lưu PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
