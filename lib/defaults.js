// Default content for all documents — used when no saved content exists in Redis

export const DEFAULT_INVOICE = {
  invoice_no: "#001_MARCHER — 05/2026",
  issue_date: "05/05/2026",
  due_date: "12/05/2026",
  payment_status: "Chờ thanh toán Đợt 1",
  client_name: "MARCHER — Shoe & Suit Care",
  project_name: "Dự án: Premium Digital Platform — Website & Admin Dashboard",
  from_name: "Rowiz Lê Design",
  items: [
    {
      name: "Tuần 1 — Build Up Full Website",
      desc: "Thiết kế UI/UX Minimalist Luxury, Lập trình Front-end (Next.js), Khởi tạo Backend & Admin Dashboard, Tích hợp Client Brief Form",
      timeline: "Tuần 1",
      amount: "14.000.000",
    },
    {
      name: "Tuần 2 — Fix Bug, Cải Thiện & Customize",
      desc: "Review Demo V1, Fix lỗi hiển thị & logic, Bổ sung animation, Phát triển tính năng nâng cao",
      timeline: "Tuần 2",
      amount: "8.000.000",
    },
    {
      name: "Tuần 3 — Review, Tối Ưu & Bàn Giao",
      desc: "Testing đa thiết bị, Tối ưu hiệu năng & SEO, Deploy lên Vercel, Bàn giao Admin & Hướng dẫn",
      timeline: "Tuần 3",
      amount: "6.000.000",
    },
  ],
  total: "28.000.000",
  discount: "0",
  deposit_label: "Cần thanh toán (50% Cọc)",
  deposit_amount: "14.000.000",
  terms: [
    "Bao gồm toàn bộ dịch vụ thiết kế & lập trình do Rowiz Lê Design cung cấp.",
    "Không bao gồm chi phí Domain, Hosting/Server, và phí bản quyền hình ảnh Stock.",
    "Thanh toán trước 50% (14.000.000 VNĐ) trước khi dự án bắt đầu.",
    "50% còn lại thanh toán trong vòng 07 ngày sau khi bàn giao.",
    "Bảo hành kỹ thuật miễn phí 03 tháng (theo HĐ số 001/2026/HĐTK-MARCHER).",
  ],
  bank: {
    name: "AGRIBANK",
    holder: "LÊ CÔNG HIỂN",
    account: "8888906777377",
    phone: "0906 777 377",
    transfer_note: "MARCHER THANH TOAN WEB",
  },
};

export const DEFAULT_CONTRACT = {
  contract_no: "001/2026/HĐTK-MARCHER",
  date_text: "Hôm nay, ngày ..... tháng 05 năm 2026, tại TP. Hồ Chí Minh, chúng tôi gồm có:",
  party_a: {
    name: "MARCHER — Shoe & Suit Care",
    representative: "",
    position: "",
    address: "",
    phone: "",
  },
  party_b: {
    name: "ROWIZ LÊ DESIGN",
    representative: "Lê Công Hiển",
    phone: "0906 777 377",
    email: "rowiz.le.atelier@gmail.com",
    address: "127/15 Hoàng Diệu 2, TP. Thủ Đức",
  },
  total_amount: "28.000.000",
  total_text: "Hai mươi tám triệu đồng chẵn",
  deposit_1: "14.000.000",
  deposit_2: "14.000.000",
  bank_info: "AGRIBANK — 8888906777377 — LÊ CÔNG HIỂN",
  warranty_months: "03",
  clauses: [
    {
      title: "Điều 1: Nội dung & Phạm vi công việc",
      content: "Bên B nhận thiết kế và phát triển Premium Digital Platform cho thương hiệu Marcher:\n- Thiết kế giao diện UI/UX theo phong cách Minimalist Luxury trên cả Desktop & Mobile.\n- Lập trình Front-end bằng Next.js — tích hợp hiệu ứng chuyển động mượt mà.\n- Xây dựng hệ thống Back-end bằng Supabase — Admin Dashboard, form thu thập thông tin.\n- Triển khai (Deploy) lên Vercel, cấu hình tên miền, tối ưu SEO cơ bản.",
    },
    {
      title: "Điều 2: Thời gian thực hiện — Timeline 3 Tuần",
      content: "Tổng thời gian: 03 tuần (21 ngày lịch), kể từ ngày thanh toán Đợt 1.\nTuần 1: Build Up Full Website — Thiết kế + Code base\nTuần 2: Fix Bug & Customize — Cải thiện + Thêm tính năng\nTuần 3: Review & Bàn Giao — Tối ưu + Deploy\nNếu Bên A chậm feedback quá 3 ngày, thời gian dự án sẽ được dời tương ứng.",
    },
    {
      title: "Điều 3: Giá trị hợp đồng & Thanh toán",
      content: "Đợt 1 — Đặt cọc (50%): 14.000.000 VNĐ — Thanh toán ngay sau khi ký.\nĐợt 2 — Tất toán (50%): 14.000.000 VNĐ — Trong vòng 07 ngày sau bàn giao.",
    },
    {
      title: "Điều 4: Quyền và Nghĩa vụ",
      content: "Bên A: Cung cấp thông tin, phản hồi trong 3 ngày, thanh toán đúng hạn.\nBên B: Thực hiện đúng tiến độ, bàn giao đầy đủ, bảo mật thông tin.",
    },
    {
      title: "Điều 5: Quyền sở hữu trí tuệ",
      content: "Sau khi thanh toán 100%, toàn bộ quyền sở hữu sản phẩm chuyển giao cho Bên A.",
    },
    {
      title: "Điều 6: Bảo hành & Hỗ trợ",
      content: "Bảo hành miễn phí 03 tháng. Bao gồm: sửa lỗi code, hiển thị, tương thích trình duyệt. Không bao gồm: thay đổi tính năng mới, lỗi do bên thứ ba.",
    },
    {
      title: "Điều 7: Hủy hợp đồng",
      content: "Bên A hủy sau khởi động: không hoàn cọc. Bên B không hoàn thành: hoàn trả 100%.",
    },
    {
      title: "Điều 8: Điều khoản chung",
      content: "Hợp đồng lập thành 02 bản, mỗi bên giữ 01 bản. Xác nhận qua Email/Zalo cũng có giá trị.",
    },
  ],
};

export const DEFAULT_BRIEF = {
  title: "Phiếu Khảo Sát Dự Án",
  subtitle: "THE ULTIMATE CLIENT BRIEF",
  description: "Vui lòng điền đầy đủ thông tin để chúng tôi hiểu sâu sắc nhất về tầm nhìn và yêu cầu của bạn.",
};
