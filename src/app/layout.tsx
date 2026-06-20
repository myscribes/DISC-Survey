import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DISC Introduction: Reflection Survey",
  description: "DISC Introduction Reflection Survey for coaching participants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
