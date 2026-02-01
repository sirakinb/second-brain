import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Second Brain",
  description: "Observatory — A sophisticated workspace for knowledge management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${instrumentSans.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#0C0B0E] text-[#F5F3F0] selection:bg-[#FF7A5C]/20`}
      >
        {/* Noise texture overlay */}
        <div className="fixed inset-0 pointer-events-none z-50 noise-overlay" />
        {children}
      </body>
    </html>
  );
}
