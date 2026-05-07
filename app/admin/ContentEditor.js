"use client";
import { useEffect, useState } from "react";
import { DEFAULT_INVOICE, DEFAULT_CONTRACT } from "@/lib/defaults";

export default function ContentEditor() {
  const [docType, setDocType] = useState("invoice");
  const [invoice, setInvoice] = useState(DEFAULT_INVOICE);
  const [contract, setContract] = useState(DEFAULT_CONTRACT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    fetch("/api/content?type=invoice").then(r => r.json()).then(d => { if (d?.invoice_no) setInvoice(d); });
    fetch("/api/content?type=contract").then(r => r.json()).then(d => { if (d?.contract_no) setContract(d); });
  }, []);

  const save = async (type, data) => {
    setSaving(true);
    await fetch("/api/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, data }) });
    setSaving(false);
    setSaved(type);
    setTimeout(() => setSaved(""), 2000);
  };

  const updateInv = (key, val) => setInvoice(p => ({ ...p, [key]: val }));
  const updateInvItem = (i, key, val) => {
    const items = [...invoice.items];
    items[i] = { ...items[i], [key]: val };
    setInvoice(p => ({ ...p, items }));
  };
  const addInvItem = () => setInvoice(p => ({ ...p, items: [...p.items, { name: "", desc: "", timeline: "", amount: "" }] }));
  const removeInvItem = (i) => setInvoice(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));
  const updateInvTerm = (i, val) => { const t = [...invoice.terms]; t[i] = val; setInvoice(p => ({ ...p, terms: t })); };
  const updateInvBank = (key, val) => setInvoice(p => ({ ...p, bank: { ...p.bank, [key]: val } }));
  const updateCt = (key, val) => setContract(p => ({ ...p, [key]: val }));
  const updateCtParty = (party, key, val) => setContract(p => ({ ...p, [party]: { ...p[party], [key]: val } }));
  const updateCtClause = (i, key, val) => { const c = [...contract.clauses]; c[i] = { ...c[i], [key]: val }; setContract(p => ({ ...p, clauses: c })); };

  return (
    <div>
      <style>{`
        .doc-tabs { display:flex;gap:8px;margin-bottom:24px; }
        .doc-tab { padding:10px 20px;font-size:13px;font-weight:600;border:1px solid var(--border);border-radius:6px;background:var(--bg-input);color:var(--text-secondary);cursor:pointer;transition:all .2s;font-family:var(--font); }
        .doc-tab.active { border-color:var(--gold);color:var(--gold);background:rgba(201,168,76,.08); }
        .ed-card { background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:28px;margin-bottom:20px; }
        .ed-title { font-size:15px;font-weight:700;color:#fff;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--border); }
        .ed-row { margin-bottom:14px; }
        .ed-label { font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:4px; }
        .ed-input { width:100%;padding:10px 14px;background:var(--bg-input);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px;font-family:var(--font);outline:none; }
        .ed-input:focus { border-color:var(--gold); }
        .ed-textarea { width:100%;padding:10px 14px;background:var(--bg-input);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px;font-family:var(--font);outline:none;resize:vertical;min-height:60px; }
        .ed-textarea:focus { border-color:var(--gold); }
        .ed-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
        .ed-item { background:var(--bg-elevated);border:1px solid var(--border);border-radius:6px;padding:16px;margin-bottom:10px;position:relative; }
        .ed-item-remove { position:absolute;top:8px;right:8px;background:none;border:none;color:var(--error);cursor:pointer;font-size:16px; }
        .ed-add { padding:10px 20px;font-size:12px;font-weight:600;background:var(--bg-input);border:1px dashed var(--border);border-radius:6px;color:var(--text-secondary);cursor:pointer;width:100%;font-family:var(--font); }
        .ed-add:hover { border-color:var(--gold);color:var(--gold); }
        .ed-save { padding:14px 32px;font-size:13px;font-weight:700;background:var(--gold);color:#111;border:none;border-radius:6px;cursor:pointer;text-transform:uppercase;letter-spacing:1px;transition:all .3s;font-family:var(--font); }
        .ed-save:hover { background:var(--gold-light);transform:translateY(-1px); }
        .ed-save:disabled { opacity:.5;cursor:not-allowed; }
        .ed-saved { display:inline-block;margin-left:12px;font-size:13px;color:var(--success);font-weight:600; }
      `}</style>

      <div className="doc-tabs">
        {[["invoice","🧾 Hóa Đơn"],["contract","📄 Hợp Đồng"]].map(([k,l]) => (
          <button key={k} className={`doc-tab ${docType===k?"active":""}`} onClick={() => setDocType(k)}>{l}</button>
        ))}
      </div>

      {/* ── INVOICE EDITOR ── */}
      {docType === "invoice" && (
        <>
          <div className="ed-card">
            <div className="ed-title">Thông tin chung</div>
            <div className="ed-grid">
              <div className="ed-row"><div className="ed-label">Số hóa đơn</div><input className="ed-input" value={invoice.invoice_no} onChange={e => updateInv("invoice_no", e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Từ</div><input className="ed-input" value={invoice.from_name} onChange={e => updateInv("from_name", e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Ngày phát hành</div><input className="ed-input" value={invoice.issue_date} onChange={e => updateInv("issue_date", e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Hạn thanh toán</div><input className="ed-input" value={invoice.due_date} onChange={e => updateInv("due_date", e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Trạng thái</div><input className="ed-input" value={invoice.payment_status} onChange={e => updateInv("payment_status", e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Khách hàng</div><input className="ed-input" value={invoice.client_name} onChange={e => updateInv("client_name", e.target.value)} /></div>
            </div>
            <div className="ed-row"><div className="ed-label">Tên dự án</div><input className="ed-input" value={invoice.project_name} onChange={e => updateInv("project_name", e.target.value)} /></div>
          </div>

          <div className="ed-card">
            <div className="ed-title">Hạng mục công việc</div>
            {invoice.items.map((item, i) => (
              <div key={i} className="ed-item">
                <button className="ed-item-remove" onClick={() => removeInvItem(i)}>✕</button>
                <div className="ed-grid">
                  <div className="ed-row"><div className="ed-label">Tên</div><input className="ed-input" value={item.name} onChange={e => updateInvItem(i,"name",e.target.value)} /></div>
                  <div className="ed-row"><div className="ed-label">Giai đoạn</div><input className="ed-input" value={item.timeline} onChange={e => updateInvItem(i,"timeline",e.target.value)} /></div>
                </div>
                <div className="ed-row"><div className="ed-label">Mô tả</div><input className="ed-input" value={item.desc} onChange={e => updateInvItem(i,"desc",e.target.value)} /></div>
                <div className="ed-row"><div className="ed-label">Thành tiền</div><input className="ed-input" value={item.amount} onChange={e => updateInvItem(i,"amount",e.target.value)} /></div>
              </div>
            ))}
            <button className="ed-add" onClick={addInvItem}>+ Thêm hạng mục</button>
          </div>

          <div className="ed-card">
            <div className="ed-title">Tổng & Thanh toán</div>
            <div className="ed-grid">
              <div className="ed-row"><div className="ed-label">Tổng cộng</div><input className="ed-input" value={invoice.total} onChange={e => updateInv("total", e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Chiết khấu</div><input className="ed-input" value={invoice.discount} onChange={e => updateInv("discount", e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Label cọc</div><input className="ed-input" value={invoice.deposit_label} onChange={e => updateInv("deposit_label", e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Số tiền cọc</div><input className="ed-input" value={invoice.deposit_amount} onChange={e => updateInv("deposit_amount", e.target.value)} /></div>
            </div>
          </div>

          <div className="ed-card">
            <div className="ed-title">Ngân hàng</div>
            <div className="ed-grid">
              <div className="ed-row"><div className="ed-label">Ngân hàng</div><input className="ed-input" value={invoice.bank.name} onChange={e => updateInvBank("name", e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Chủ TK</div><input className="ed-input" value={invoice.bank.holder} onChange={e => updateInvBank("holder", e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Số TK</div><input className="ed-input" value={invoice.bank.account} onChange={e => updateInvBank("account", e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Nội dung CK</div><input className="ed-input" value={invoice.bank.transfer_note} onChange={e => updateInvBank("transfer_note", e.target.value)} /></div>
            </div>
          </div>

          <div style={{ display:"flex",alignItems:"center",marginTop:16 }}>
            <button className="ed-save" disabled={saving} onClick={() => save("invoice", invoice)}>{saving ? "Đang lưu..." : "💾 Lưu Hóa Đơn"}</button>
            {saved === "invoice" && <span className="ed-saved">✓ Đã lưu!</span>}
          </div>
        </>
      )}

      {/* ── CONTRACT EDITOR ── */}
      {docType === "contract" && (
        <>
          <div className="ed-card">
            <div className="ed-title">Thông tin hợp đồng</div>
            <div className="ed-grid">
              <div className="ed-row"><div className="ed-label">Số hợp đồng</div><input className="ed-input" value={contract.contract_no} onChange={e => updateCt("contract_no", e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Tổng giá trị</div><input className="ed-input" value={contract.total_amount} onChange={e => updateCt("total_amount", e.target.value)} /></div>
            </div>
            <div className="ed-row"><div className="ed-label">Ngày ký</div><textarea className="ed-textarea" value={contract.date_text} onChange={e => updateCt("date_text", e.target.value)} /></div>
          </div>

          <div className="ed-card">
            <div className="ed-title">Bên A — Khách hàng</div>
            <div className="ed-row"><div className="ed-label">Tên</div><input className="ed-input" value={contract.party_a.name} onChange={e => updateCtParty("party_a","name",e.target.value)} /></div>
            <div className="ed-grid">
              <div className="ed-row"><div className="ed-label">Đại diện</div><input className="ed-input" value={contract.party_a.representative} onChange={e => updateCtParty("party_a","representative",e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Chức vụ</div><input className="ed-input" value={contract.party_a.position} onChange={e => updateCtParty("party_a","position",e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Địa chỉ</div><input className="ed-input" value={contract.party_a.address} onChange={e => updateCtParty("party_a","address",e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Điện thoại</div><input className="ed-input" value={contract.party_a.phone} onChange={e => updateCtParty("party_a","phone",e.target.value)} /></div>
            </div>
          </div>

          <div className="ed-card">
            <div className="ed-title">Bên B — Đơn vị thiết kế</div>
            <div className="ed-row"><div className="ed-label">Tên</div><input className="ed-input" value={contract.party_b.name} onChange={e => updateCtParty("party_b","name",e.target.value)} /></div>
            <div className="ed-grid">
              <div className="ed-row"><div className="ed-label">Đại diện</div><input className="ed-input" value={contract.party_b.representative} onChange={e => updateCtParty("party_b","representative",e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Điện thoại</div><input className="ed-input" value={contract.party_b.phone} onChange={e => updateCtParty("party_b","phone",e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Email</div><input className="ed-input" value={contract.party_b.email} onChange={e => updateCtParty("party_b","email",e.target.value)} /></div>
              <div className="ed-row"><div className="ed-label">Địa chỉ</div><input className="ed-input" value={contract.party_b.address} onChange={e => updateCtParty("party_b","address",e.target.value)} /></div>
            </div>
          </div>

          <div className="ed-card">
            <div className="ed-title">Các điều khoản</div>
            {contract.clauses.map((clause, i) => (
              <div key={i} className="ed-item">
                <div className="ed-row"><div className="ed-label">Tiêu đề</div><input className="ed-input" value={clause.title} onChange={e => updateCtClause(i,"title",e.target.value)} /></div>
                <div className="ed-row"><div className="ed-label">Nội dung</div><textarea className="ed-textarea" style={{ minHeight:80 }} value={clause.content} onChange={e => updateCtClause(i,"content",e.target.value)} /></div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex",alignItems:"center",marginTop:16 }}>
            <button className="ed-save" disabled={saving} onClick={() => save("contract", contract)}>{saving ? "Đang lưu..." : "💾 Lưu Hợp Đồng"}</button>
            {saved === "contract" && <span className="ed-saved">✓ Đã lưu!</span>}
          </div>
        </>
      )}
    </div>
  );
}
