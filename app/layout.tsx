import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "İlay Home — Sözleşme Sistemi",
  description: "İlay Home barter influencer sözleşme imzalama platformu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
