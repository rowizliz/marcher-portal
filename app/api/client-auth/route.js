import { NextResponse } from "next/server";
import { getClientPassword, setClientPassword } from "@/lib/store";

// GET: check if password is already set
export async function GET() {
  const pw = await getClientPassword();
  return NextResponse.json({ hasPassword: !!pw });
}

// POST: login or setup
export async function POST(request) {
  try {
    const { username, password, action } = await request.json();

    if (username !== "marcher") {
      return NextResponse.json({ error: "Tên đăng nhập không đúng" }, { status: 401 });
    }

    const existingPw = await getClientPassword();

    if (action === "setup") {
      // First time - create password
      if (existingPw) {
        return NextResponse.json({ error: "Mật khẩu đã được tạo trước đó. Vui lòng đăng nhập." }, { status: 400 });
      }
      if (!password || password.length < 4) {
        return NextResponse.json({ error: "Mật khẩu phải có ít nhất 4 ký tự" }, { status: 400 });
      }
      await setClientPassword(password);
      return NextResponse.json({ success: true, message: "Tạo mật khẩu thành công" });
    }

    if (action === "login") {
      if (!existingPw) {
        return NextResponse.json({ needSetup: true });
      }
      if (password !== existingPw) {
        return NextResponse.json({ error: "Mật khẩu không đúng" }, { status: 401 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
