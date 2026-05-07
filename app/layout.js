import "./globals.css";
import ClientAuthGuard from "@/components/ClientAuthGuard";

export const metadata = {
  title: "Marcher — Client Portal",
  description: "Premium Digital Platform Portal cho Marcher × Rowiz Lê Design",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientAuthGuard>{children}</ClientAuthGuard>
      </body>
    </html>
  );
}
