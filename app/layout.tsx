import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "gap ─ 本音と建前の距離を見る",
  description: "誰の前の自分かによって、本音と建前がどう変わるかを、責めず、ただ見続ける場所。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
