"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DEFAULT_CONTRACT } from "@/lib/defaults";

export default function ContractPage() {
  const [ct, setCt] = useState(DEFAULT_CONTRACT);

  useEffect(() => {
    fetch("/api/content?type=contract")
      .then((r) => r.json())
      .then((data) => { if (data && data.contract_no) setCt(data); })
      .catch(() => {});
  }, []);

  return (
    <div className="page-wrapper">
      <style>{`
        .back-link { display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-muted);margin-bottom:30px;transition:color .3s; }
        .back-link:hover { color:var(--gold); }
        .contract { max-width:860px;margin:0 auto;background:#fff;color:#1a1a1a;padding:70px 80px;border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);position:relative;animation:fadeInUp .6s ease-out; }
        .contract::before { content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#111,#444,#111); }
        .republic-header { text-align:center;margin-bottom:40px;padding-bottom:25px;border-bottom:1px solid #e0e0e0; }
        .rh-line1 { font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#333; }
        .rh-line2 { font-size:13px;font-weight:600;letter-spacing:.5px;color:#555;margin-top:4px; }
        .rh-deco { color:#999;margin-top:8px;font-size:14px; }
        .ct-title { text-align:center;margin-bottom:40px; }
        .ct-title h1 { font-size:22px;font-weight:800;color:#111;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px; }
        .ct-no { font-size:13px;color:#888;font-weight:500; }
        .intro-text { font-size:14px;color:#555;font-style:italic;margin-bottom:30px;line-height:1.7; }
        .party-section { margin-bottom:25px;padding:20px 24px;border-radius:6px;border:1px solid #eee; }
        .party-a { background:#fafafa;border-left:4px solid #c9a84c; }
        .party-b { background:#f5f5f5;border-left:4px solid #111; }
        .party-label { font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:12px; }
        .party-name { font-size:17px;font-weight:800;color:#111;margin-bottom:10px; }
        .party-detail { font-size:13.5px;color:#444;line-height:1.8; }
        .party-detail strong { display:inline-block;width:110px;color:#333;font-weight:600; }
        .agreement-intro { font-size:14px;color:#555;font-style:italic;margin:30px 0;line-height:1.7;text-align:center; }
        .clause { margin-bottom:28px; }
        .clause-title { font-size:15px;font-weight:800;color:#111;text-transform:uppercase;letter-spacing:.5px;padding-bottom:8px;border-bottom:2px solid #111;display:inline-block;margin-bottom:14px; }
        .clause p { font-size:14px;line-height:1.8;color:#333;margin-bottom:8px;text-align:justify;white-space:pre-line; }
        .payment-box { background:#111;color:#fff;padding:20px 24px;border-radius:6px;margin:16px 0; }
        .payment-box .total-label { font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:4px; }
        .payment-box .total-amount { font-size:24px;font-weight:800;color:#c9a84c; }
        .payment-box .total-text { font-size:12px;color:#777;margin-top:4px;font-style:italic; }
        .signature-area { display:flex;justify-content:space-between;margin-top:60px;padding-top:30px;border-top:1px solid #e0e0e0; }
        .sig-box { width:260px;text-align:center; }
        .sig-label { font-size:14px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px; }
        .sig-note { font-size:12px;color:#999;font-style:italic; }
        .sig-space { height:80px;border-bottom:1px dashed #ccc;margin-top:10px; }
        .print-btn { display:block;width:100%;padding:18px;background:#111;color:#fff;font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;border:none;border-radius:6px;cursor:pointer;transition:all .3s;margin-top:40px; }
        .print-btn:hover { background:#333;transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.15); }
        @media print { .back-link,.print-btn{display:none!important} .contract{box-shadow:none;padding:40px 50px} }
        @media(max-width:768px) { .contract{padding:30px 24px} .signature-area{flex-direction:column;gap:30px;align-items:center} }
      `}</style>

      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <Link href="/" className="back-link no-print">← Quay lại Portal</Link>
      </div>
      <div className="contract">
        <div className="republic-header">
          <div className="rh-line1">Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam</div>
          <div className="rh-line2">Độc lập – Tự do – Hạnh phúc</div>
          <div className="rh-deco">— ✦ —</div>
        </div>
        <div className="ct-title">
          <h1>Hợp Đồng Dịch Vụ<br/>Thiết Kế & Phát Triển Website</h1>
          <div className="ct-no">Số: {ct.contract_no}</div>
        </div>
        <p className="intro-text">{ct.date_text}</p>

        <div className="party-section party-a">
          <div className="party-label">Bên A — Khách hàng</div>
          <div className="party-name">{ct.party_a.name}</div>
          <div className="party-detail">
            <p><strong>Đại diện:</strong> {ct.party_a.representative || "................................................................"}</p>
            <p><strong>Chức vụ:</strong> {ct.party_a.position || "............................................................................"}</p>
            <p><strong>Địa chỉ:</strong> {ct.party_a.address || "............................................................................."}</p>
            <p><strong>Điện thoại:</strong> {ct.party_a.phone || "........................................................................"}</p>
          </div>
        </div>

        <div className="party-section party-b">
          <div className="party-label">Bên B — Đơn vị thiết kế & phát triển</div>
          <div className="party-name">{ct.party_b.name}</div>
          <div className="party-detail">
            <p><strong>Đại diện:</strong> {ct.party_b.representative}</p>
            <p><strong>Điện thoại:</strong> {ct.party_b.phone}</p>
            <p><strong>Email:</strong> {ct.party_b.email}</p>
            <p><strong>Địa chỉ:</strong> {ct.party_b.address}</p>
          </div>
        </div>

        <p className="agreement-intro">Sau khi thỏa thuận, hai bên thống nhất ký kết Hợp đồng dịch vụ<br/>với các điều khoản dưới đây:</p>

        {ct.clauses.map((clause, i) => (
          <div key={i} className="clause">
            <div className="clause-title">{clause.title}</div>
            {clause.title.includes("Điều 3") && (
              <div className="payment-box">
                <div className="total-label">Tổng giá trị hợp đồng</div>
                <div className="total-amount">{ct.total_amount} VNĐ</div>
                <div className="total-text">({ct.total_text})</div>
              </div>
            )}
            <p>{clause.content}</p>
          </div>
        ))}

        <div className="signature-area">
          <div className="sig-box">
            <div className="sig-label">Đại diện Bên A</div>
            <div className="sig-note">(Ký, ghi rõ họ tên)</div>
            <div className="sig-space" />
          </div>
          <div className="sig-box">
            <div className="sig-label">Đại diện Bên B</div>
            <div className="sig-note">(Ký, ghi rõ họ tên)</div>
            <div className="sig-space" />
          </div>
        </div>
        <button className="print-btn no-print" onClick={() => window.print()}>IN / LƯU PDF</button>
      </div>
    </div>
  );
}
