"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DEFAULT_INVOICE } from "@/lib/defaults";

export default function InvoicePage() {
  const [inv, setInv] = useState(DEFAULT_INVOICE);

  useEffect(() => {
    fetch("/api/content?type=invoice")
      .then((r) => r.json())
      .then((data) => { if (data && data.invoice_no) setInv(data); })
      .catch(() => {});
  }, []);

  return (
    <div className="page-wrapper">
      <style>{`
        .back-link { display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-muted);margin-bottom:30px;transition:color .3s; }
        .back-link:hover { color:var(--gold); }
        .invoice { max-width:860px;margin:0 auto;background:var(--bg-card);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-lg);animation:fadeInUp .6s ease-out; }
        .inv-accent { height:3px;background:linear-gradient(90deg,var(--gold),var(--gold-light),var(--gold)); }
        .inv-body { padding:50px 55px; }
        .inv-header { display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:30px;border-bottom:1px solid var(--border); }
        .inv-title { font-size:36px;font-weight:800;color:#fff;letter-spacing:4px; }
        .inv-no { font-size:13px;color:var(--text-muted);margin-top:6px;letter-spacing:1px; }
        .inv-from-name { font-size:18px;font-weight:700;color:#fff;margin-bottom:8px;text-align:right; }
        .inv-meta { font-size:12px;color:var(--text-muted);line-height:1.8;text-align:right; }
        .inv-meta strong { color:var(--text-secondary); }
        .client-box { background:var(--bg-elevated);border-radius:var(--radius);padding:20px 24px;margin-bottom:35px;border-left:3px solid var(--gold); }
        .client-label { font-size:10px;text-transform:uppercase;letter-spacing:2px;color:var(--text-muted);margin-bottom:6px; }
        .client-name { font-size:17px;font-weight:700;color:#fff; }
        .client-project { font-size:13px;color:var(--text-secondary);margin-top:4px; }
        .inv-table { width:100%;border-collapse:collapse;margin-bottom:30px; }
        .inv-table th { padding:14px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:var(--text-muted);border-bottom:1px solid var(--border);font-weight:600; }
        .inv-table th:last-child { text-align:right; }
        .inv-table td { padding:18px 16px;border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:top; }
        .inv-table td:last-child { text-align:right;white-space:nowrap;font-weight:600;color:#ccc;font-size:15px; }
        .item-name { font-weight:700;color:#fff;font-size:14px;margin-bottom:4px; }
        .item-desc { font-size:12px;color:var(--text-muted);line-height:1.5; }
        .timeline-badge { display:inline-block;background:var(--bg-elevated);padding:3px 10px;border-radius:20px;font-size:11px;color:var(--text-secondary); }
        .totals-section { display:flex;justify-content:flex-end;margin-bottom:40px; }
        .totals-wrap { width:340px; }
        .totals-row { display:flex;justify-content:space-between;padding:10px 0;font-size:14px;color:var(--text-secondary); }
        .totals-row.divider { border-bottom:1px solid var(--border);margin-bottom:8px;padding-bottom:14px; }
        .totals-row.main { font-size:20px;font-weight:800;color:var(--gold);padding:16px 0 0 0; }
        .totals-row.main .label { font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--text-secondary);align-self:center; }
        .terms-title { font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--text-muted);font-weight:700;margin-bottom:14px; }
        .terms-list { list-style:none;padding:0;margin-bottom:30px; }
        .terms-list li { font-size:12px;color:var(--text-secondary);line-height:1.8;padding-left:16px;position:relative;margin-bottom:6px; }
        .terms-list li::before { content:'•';position:absolute;left:0;color:var(--gold); }
        .bank-box { background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:20px;position:relative;overflow:hidden; }
        .bank-box::before { content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--gold); }
        .bank-title { font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--text-muted);font-weight:700;margin-bottom:14px; }
        .bank-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
        .b-label { font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:3px; }
        .b-value { font-size:14px;font-weight:600;color:#fff; }
        .transfer-note { margin-top:14px;display:inline-block;background:var(--bg-input);padding:6px 14px;border-radius:20px;font-size:12px;color:var(--gold);font-weight:600; }
        .inv-footer { text-align:center;font-size:11px;color:var(--text-muted);padding-top:20px;border-top:1px solid rgba(255,255,255,0.04);line-height:1.6; }
        .print-btn { display:block;width:100%;padding:18px;background:linear-gradient(135deg,var(--gold),var(--gold-dim));color:#111;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:2px;border:none;border-radius:var(--radius);cursor:pointer;transition:var(--transition);margin-top:30px; }
        .print-btn:hover { transform:translateY(-2px);box-shadow:0 8px 24px rgba(201,168,76,.3); }
        @media print { .back-link,.print-btn{display:none!important} .invoice{box-shadow:none;background:#fff} }
        @media(max-width:768px) { .inv-body{padding:24px} .inv-header{flex-direction:column;gap:16px} .inv-from-name,.inv-meta{text-align:left} .bank-grid{grid-template-columns:1fr} .totals-wrap{width:100%} }
      `}</style>

      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <Link href="/" className="back-link no-print">← Quay lại Portal</Link>
      </div>
      <div className="invoice">
        <div className="inv-accent" />
        <div className="inv-body">
          <div className="inv-header">
            <div>
              <div className="inv-title">INVOICE</div>
              <div className="inv-no">{inv.invoice_no}</div>
            </div>
            <div>
              <div className="inv-from-name">{inv.from_name}</div>
              <div className="inv-meta">
                <strong>Ngày phát hành:</strong> {inv.issue_date}<br/>
                <strong>Hạn thanh toán:</strong> {inv.due_date}<br/>
                <strong>Trạng thái:</strong>{" "}
                <span style={{ color: "var(--gold)" }}>{inv.payment_status}</span>
              </div>
            </div>
          </div>

          <div className="client-box">
            <div className="client-label">Gửi đến</div>
            <div className="client-name">{inv.client_name}</div>
            <div className="client-project">{inv.project_name}</div>
          </div>

          <table className="inv-table">
            <thead><tr><th>Mô tả hạng mục</th><th>Giai đoạn</th><th>Thành tiền (VNĐ)</th></tr></thead>
            <tbody>
              {inv.items.map((item, i) => (
                <tr key={i}>
                  <td><div className="item-name">{item.name}</div><div className="item-desc">{item.desc}</div></td>
                  <td><span className="timeline-badge">{item.timeline}</span></td>
                  <td>{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="totals-section">
            <div className="totals-wrap">
              <div className="totals-row divider"><span>Tổng cộng</span><span style={{ color: "#ccc", fontWeight: 600 }}>{inv.total} VNĐ</span></div>
              <div className="totals-row"><span>Chiết khấu</span><span>{inv.discount} VNĐ</span></div>
              <div className="totals-row main"><span className="label">{inv.deposit_label}</span><span>{inv.deposit_amount} VNĐ</span></div>
            </div>
          </div>

          <div>
            <div className="terms-title">Điều khoản & Điều kiện</div>
            <ul className="terms-list">
              {inv.terms.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>

          <div className="bank-box">
            <div className="bank-title">Thông tin chuyển khoản — Bank Transfer</div>
            <div className="bank-grid">
              <div><div className="b-label">Ngân hàng</div><div className="b-value">{inv.bank.name}</div></div>
              <div><div className="b-label">Chủ tài khoản</div><div className="b-value">{inv.bank.holder}</div></div>
              <div><div className="b-label">Số tài khoản</div><div className="b-value">{inv.bank.account}</div></div>
              <div><div className="b-label">Số điện thoại</div><div className="b-value">{inv.bank.phone}</div></div>
            </div>
            <div className="transfer-note">Nội dung CK: {inv.bank.transfer_note}</div>
          </div>

          <div className="inv-footer">
            Bằng việc thanh toán, quý khách đồng ý với các điều khoản trong HĐ số 001/2026/HĐTK-MARCHER.<br/>
            Rowiz Lê Design © 2026
          </div>
          <button className="print-btn no-print" onClick={() => window.print()}>⬇ Lưu thành PDF / In hóa đơn</button>
        </div>
      </div>
    </div>
  );
}
