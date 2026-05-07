"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_PATHS = ["/login", "/admin", "/admin/login"];

export default function ClientAuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
          minHeight: "100vh",
          color: "var(--ink-faded)",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            border: "2px solid var(--line)",
            borderTopColor: "var(--gold)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return children;
}
