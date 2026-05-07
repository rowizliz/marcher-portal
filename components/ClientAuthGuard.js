"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_PATHS = ["/login", "/admin", "/admin/login"];

export default function ClientAuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Skip auth for public paths
    if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
      setChecked(true);
      return;
    }

    const isAuth = localStorage.getItem("client_auth") === "true";
    if (!isAuth) {
      router.push("/login");
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  if (!checked) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "var(--text-muted)" }}>
        ⏳
      </div>
    );
  }

  return children;
}
