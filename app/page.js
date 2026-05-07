"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PortalHome() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cards = [
    {
      icon: "📋",
      title: "Client Brief",
      desc: "Điền phiếu khảo sát dự án để chúng tôi hiểu rõ tầm nhìn và yêu cầu của bạn.",
      href: "/brief",
      action: "Điền ngay",
      badge: "FORM",
    },
    {
      icon: "🧾",
      title: "Hóa Đơn",
      desc: "Xem chi tiết hóa đơn, hạng mục công việc và thông tin thanh toán.",
      href: "/invoice",
      action: "Xem hóa đơn",
      badge: "INVOICE",
    },
    {
      icon: "📄",
      title: "Hợp Đồng",
      desc: "Xem toàn bộ điều khoản hợp đồng dịch vụ thiết kế và phát triển website.",
      href: "/contract",
      action: "Xem hợp đồng",
      badge: "CONTRACT",
    },
  ];

  return (
    <div className="portal-page">
      <style>{`
        .portal-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          position: relative;
          overflow: hidden;
        }
        .portal-page::before {
          content: '';
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .portal-header {
          text-align: center;
          margin-bottom: 60px;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? 0 : 20}px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .portal-brand {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
        }
        .portal-title {
          font-size: 42px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -1px;
          margin-bottom: 12px;
        }
        .portal-subtitle {
          font-size: 16px;
          color: var(--text-secondary);
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.7;
        }
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 960px;
          width: 100%;
        }
        .portal-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 36px 28px;
          display: flex;
          flex-direction: column;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          position: relative;
          overflow: hidden;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? 0 : 30}px);
        }
        .portal-card:nth-child(1) { transition-delay: 0.1s; }
        .portal-card:nth-child(2) { transition-delay: 0.2s; }
        .portal-card:nth-child(3) { transition-delay: 0.3s; }
        .portal-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .portal-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }
        .portal-card:hover::before { opacity: 1; }
        .card-badge {
          display: inline-block;
          padding: 4px 10px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          color: var(--gold);
          background: rgba(201,168,76,0.1);
          border-radius: 20px;
          margin-bottom: 20px;
          align-self: flex-start;
        }
        .card-icon {
          font-size: 36px;
          margin-bottom: 16px;
        }
        .card-title {
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 10px;
        }
        .card-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.7;
          flex: 1;
          margin-bottom: 24px;
        }
        .card-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .card-action .arrow {
          transition: transform 0.3s;
        }
        .portal-card:hover .card-action .arrow {
          transform: translateX(4px);
        }
        .portal-footer {
          margin-top: 60px;
          text-align: center;
          opacity: ${mounted ? 1 : 0};
          transition: all 0.8s 0.5s;
        }
        .portal-footer a {
          font-size: 12px;
          color: var(--text-muted);
          transition: color 0.3s;
        }
        .portal-footer a:hover { color: var(--gold); }
        @media (max-width: 768px) {
          .cards-grid { grid-template-columns: 1fr; gap: 16px; }
          .portal-title { font-size: 28px; }
        }
      `}</style>

      <div className="portal-header">
        <div className="portal-brand">Marcher × Rowiz Lê Design</div>
        <h1 className="portal-title">Client Portal</h1>
        <p className="portal-subtitle">
          Chào mừng bạn đến với cổng thông tin dự án. Truy cập tài liệu, điền brief và theo dõi tiến độ.
        </p>
      </div>

      <div className="cards-grid">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="portal-card">
            <span className="card-badge">{card.badge}</span>
            <span className="card-icon">{card.icon}</span>
            <h2 className="card-title">{card.title}</h2>
            <p className="card-desc">{card.desc}</p>
            <span className="card-action">
              {card.action} <span className="arrow">→</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="portal-footer">
        <Link href="/admin/login">Admin Dashboard</Link>
      </div>
    </div>
  );
}
