import "./globals.css";

export const metadata = {
  title: "Marcher — Client Portal",
  description: "Premium Digital Platform Portal cho Marcher × Rowiz Lê Design",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
