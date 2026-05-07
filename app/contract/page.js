"use client";
import Link from "next/link";

export default function ContractPage() {
  return (
    <div className="page-wrapper">
      <style>{`
        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; color: var(--text-muted);
          margin-bottom: 30px; transition: color 0.3s;
        }
        .back-link:hover { color: var(--gold); }
        .contract {
          max-width: 860px; margin: 0 auto;
          background: #fff; color: #1a1a1a;
          padding: 70px 80px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          position: relative;
          animation: fadeInUp 0.6s ease-out;
        }
        .contract::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, #111 0%, #444 50%, #111 100%);
        }
        .republic-header {
          text-align: center; margin-bottom: 40px;
          padding-bottom: 25px; border-bottom: 1px solid #e0e0e0;
        }
        .rh-line1 {
          font-size: 14px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase; color: #333;
        }
        .rh-line2 {
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.5px; color: #555; margin-top: 4px;
        }
        .rh-deco { color: #999; margin-top: 8px; font-size: 14px; }
        .ct-title { text-align: center; margin-bottom: 40px; }
        .ct-title h1 {
          font-size: 22px; font-weight: 800; color: #111;
          text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;
        }
        .ct-no { font-size: 13px; color: #888; font-weight: 500; }
        .intro-text {
          font-size: 14px; color: #555; font-style: italic;
          margin-bottom: 30px; line-height: 1.7;
        }
        .party-section {
          margin-bottom: 25px; padding: 20px 24px;
          border-radius: 6px; border: 1px solid #eee;
        }
        .party-a { background: #fafafa; border-left: 4px solid #c9a84c; }
        .party-b { background: #f5f5f5; border-left: 4px solid #111; }
        .party-label {
          font-size: 13px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1px; color: #888; margin-bottom: 12px;
        }
        .party-name {
          font-size: 17px; font-weight: 800; color: #111; margin-bottom: 10px;
        }
        .party-detail {
          font-size: 13.5px; color: #444; line-height: 1.8;
        }
        .party-detail strong {
          display: inline-block; width: 110px; color: #333; font-weight: 600;
        }
        .agreement-intro {
          font-size: 14px; color: #555; font-style: italic;
          margin: 30px 0; line-height: 1.7; text-align: center;
        }
        .clause { margin-bottom: 28px; }
        .clause-title {
          font-size: 15px; font-weight: 800; color: #111;
          text-transform: uppercase; letter-spacing: 0.5px;
          padding-bottom: 8px; border-bottom: 2px solid #111;
          display: inline-block; margin-bottom: 14px;
        }
        .clause p {
          font-size: 14px; line-height: 1.8; color: #333;
          margin-bottom: 8px; text-align: justify;
        }
        .clause ul { padding-left: 20px; margin: 10px 0; }
        .clause li {
          font-size: 14px; line-height: 1.8; color: #333; margin-bottom: 6px;
        }
        .clause li strong { color: #111; }
        .timeline-visual {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          gap: 12px; margin: 16px 0;
        }
        .timeline-card {
          background: #f8f8f8; border: 1px solid #e8e8e8;
          border-radius: 6px; padding: 16px; text-align: center;
        }
        .timeline-card .week {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1px; color: #999; margin-bottom: 6px;
        }
        .timeline-card .task {
          font-size: 13px; font-weight: 600; color: #222; line-height: 1.5;
        }
        .payment-box {
          background: #111; color: #fff; padding: 20px 24px;
          border-radius: 6px; margin: 16px 0;
        }
        .payment-box .total-label {
          font-size: 12px; text-transform: uppercase;
          letter-spacing: 1px; color: #888; margin-bottom: 4px;
        }
        .payment-box .total-amount {
          font-size: 24px; font-weight: 800; color: #c9a84c;
        }
        .payment-box .total-text {
          font-size: 12px; color: #777; margin-top: 4px; font-style: italic;
        }
        .signature-area {
          display: flex; justify-content: space-between;
          margin-top: 60px; padding-top: 30px;
          border-top: 1px solid #e0e0e0;
        }
        .sig-box { width: 260px; text-align: center; }
        .sig-label {
          font-size: 14px; font-weight: 700; color: #111;
          text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;
        }
        .sig-note { font-size: 12px; color: #999; font-style: italic; }
        .sig-space {
          height: 80px; border-bottom: 1px dashed #ccc; margin-top: 10px;
        }
        .print-btn {
          display: block; width: 100%; padding: 18px;
          background: #111; color: #fff; font-size: 15px;
          font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.5px; border: none;
          border-radius: 6px; cursor: pointer;
          transition: all 0.3s; margin-top: 40px;
        }
        .print-btn:hover {
          background: #333; transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        @media print {
          .back-link, .print-btn { display: none !important; }
          .contract { box-shadow: none; padding: 40px 50px; }
        }
        @media (max-width: 768px) {
          .contract { padding: 30px 24px; }
          .timeline-visual { grid-template-columns: 1fr; }
          .signature-area { flex-direction: column; gap: 30px; align-items: center; }
        }
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
          <div className="ct-no">Số: 001/2026/HĐTK-MARCHER</div>
        </div>

        <p className="intro-text">Hôm nay, ngày ..... tháng 05 năm 2026, tại TP. Hồ Chí Minh, chúng tôi gồm có:</p>

        <div className="party-section party-a">
          <div className="party-label">Bên A — Khách hàng</div>
          <div className="party-name">MARCHER — Shoe & Suit Care</div>
          <div className="party-detail">
            <p><strong>Đại diện:</strong> Ông/Bà ................................................................</p>
            <p><strong>Chức vụ:</strong> ............................................................................</p>
            <p><strong>Địa chỉ:</strong> .............................................................................</p>
            <p><strong>Điện thoại:</strong> ........................................................................</p>
          </div>
        </div>

        <div className="party-section party-b">
          <div className="party-label">Bên B — Đơn vị thiết kế & phát triển</div>
          <div className="party-name">ROWIZ LÊ DESIGN</div>
          <div className="party-detail">
            <p><strong>Đại diện:</strong> Lê Công Hiển</p>
            <p><strong>Điện thoại:</strong> 0906 777 377</p>
            <p><strong>Email:</strong> rowiz.le.atelier@gmail.com</p>
            <p><strong>Địa chỉ:</strong> 127/15 Hoàng Diệu 2, TP. Thủ Đức</p>
          </div>
        </div>

        <p className="agreement-intro">Sau khi thỏa thuận, hai bên thống nhất ký kết Hợp đồng dịch vụ<br/>với các điều khoản dưới đây:</p>

        {/* Điều 1 */}
        <div className="clause">
          <div className="clause-title">Điều 1: Nội dung & Phạm vi công việc</div>
          <p>Bên B nhận thiết kế và phát triển <strong>Premium Digital Platform</strong> cho thương hiệu Marcher:</p>
          <ul>
            <li><strong>Thiết kế giao diện UI/UX</strong> theo phong cách Minimalist Luxury trên cả Desktop & Mobile.</li>
            <li><strong>Lập trình Front-end</strong> bằng Next.js — tích hợp hiệu ứng chuyển động mượt mà.</li>
            <li><strong>Xây dựng hệ thống Back-end</strong> bằng Supabase — Admin Dashboard, form thu thập thông tin.</li>
            <li><strong>Triển khai (Deploy)</strong> lên Vercel, cấu hình tên miền, tối ưu SEO cơ bản.</li>
          </ul>
        </div>

        {/* Điều 2 */}
        <div className="clause">
          <div className="clause-title">Điều 2: Thời gian thực hiện — Timeline 3 Tuần</div>
          <p>Tổng thời gian: <strong>03 tuần (21 ngày lịch)</strong>, kể từ ngày thanh toán Đợt 1.</p>
          <div className="timeline-visual">
            <div className="timeline-card">
              <div className="week">Tuần 1</div>
              <div className="task">Build Up Full Website<br/><span style={{fontSize:11,color:"#888"}}>Thiết kế + Code base</span></div>
            </div>
            <div className="timeline-card">
              <div className="week">Tuần 2</div>
              <div className="task">Fix Bug & Customize<br/><span style={{fontSize:11,color:"#888"}}>Cải thiện + Thêm tính năng</span></div>
            </div>
            <div className="timeline-card">
              <div className="week">Tuần 3</div>
              <div className="task">Review & Bàn Giao<br/><span style={{fontSize:11,color:"#888"}}>Tối ưu + Deploy</span></div>
            </div>
          </div>
          <p><em>Nếu Bên A chậm feedback quá 3 ngày, thời gian dự án sẽ được dời tương ứng.</em></p>
        </div>

        {/* Điều 3 */}
        <div className="clause">
          <div className="clause-title">Điều 3: Giá trị hợp đồng & Thanh toán</div>
          <div className="payment-box">
            <div className="total-label">Tổng giá trị hợp đồng</div>
            <div className="total-amount">28.000.000 VNĐ</div>
            <div className="total-text">(Hai mươi tám triệu đồng chẵn)</div>
          </div>
          <ul>
            <li><strong>Đợt 1 — Đặt cọc (50%):</strong> 14.000.000 VNĐ — Thanh toán ngay sau khi ký.</li>
            <li><strong>Đợt 2 — Tất toán (50%):</strong> 14.000.000 VNĐ — Trong vòng 07 ngày sau bàn giao.</li>
          </ul>
          <p>Chuyển khoản: <strong>AGRIBANK — 8888906777377 — LÊ CÔNG HIỂN</strong></p>
        </div>

        {/* Điều 4 */}
        <div className="clause">
          <div className="clause-title">Điều 4: Quyền và Nghĩa vụ</div>
          <p><strong>Bên A:</strong> Cung cấp thông tin, phản hồi trong 3 ngày, thanh toán đúng hạn.</p>
          <p><strong>Bên B:</strong> Thực hiện đúng tiến độ, bàn giao đầy đủ, bảo mật thông tin.</p>
        </div>

        {/* Điều 5 */}
        <div className="clause">
          <div className="clause-title">Điều 5: Quyền sở hữu trí tuệ</div>
          <p>Sau khi thanh toán 100%, toàn bộ quyền sở hữu sản phẩm chuyển giao cho Bên A.</p>
        </div>

        {/* Điều 6 */}
        <div className="clause">
          <div className="clause-title">Điều 6: Bảo hành & Hỗ trợ</div>
          <p>Bảo hành miễn phí <strong>03 tháng</strong>. Bao gồm: sửa lỗi code, hiển thị, tương thích trình duyệt. Không bao gồm: thay đổi tính năng mới, lỗi do bên thứ ba.</p>
        </div>

        {/* Điều 7 */}
        <div className="clause">
          <div className="clause-title">Điều 7: Hủy hợp đồng</div>
          <p>Bên A hủy sau khởi động: không hoàn cọc. Bên B không hoàn thành: hoàn trả 100%.</p>
        </div>

        {/* Điều 8 */}
        <div className="clause">
          <div className="clause-title">Điều 8: Điều khoản chung</div>
          <p>Hợp đồng lập thành 02 bản, mỗi bên giữ 01 bản. Xác nhận qua Email/Zalo cũng có giá trị.</p>
        </div>

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

        <button className="print-btn no-print" onClick={() => window.print()}>
          IN / LƯU PDF
        </button>
      </div>
    </div>
  );
}
