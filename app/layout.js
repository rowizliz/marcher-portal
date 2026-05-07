import "./globals.css";
import { Inter, Fraunces } from "next/font/google";
import ClientAuthGuard from "@/components/ClientAuthGuard";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata = {
  title: "Marcher — Client Portal",
  description: "Premium Digital Platform Portal cho Marcher × Rowiz Lê Design",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientAuthGuard>{children}</ClientAuthGuard>
      </body>
    </html>
  );
}
