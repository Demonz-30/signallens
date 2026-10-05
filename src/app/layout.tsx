import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignalLens — Forensic Investigation Agent for Peer Financial Outliers",
  description:
    "SignalLens investigates unusual peer differences and shows what the evidence can — and cannot — prove using Sectors fundamentals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
