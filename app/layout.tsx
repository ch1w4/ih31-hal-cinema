// アプリ全体を囲むルートレイアウト
// Next.js App Router では layout.tsx が全ページ共通のHTML骨格を提供する
// このファイルはサーバーコンポーネントとして動作し、クライアントJSを含まない

import type { Metadata } from "next";
import "./globals.css";

// ブラウザタブのタイトルとSEO用メタデータ
export const metadata: Metadata = {
  title: "HAL CINEMA",
  description: "HAL CINEMAオフィシャルサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // lang="ja" を指定することでスクリーンリーダーが日本語として読み上げる
    <html lang="ja" className="h-full">
      {/* bg-[#0f0f0f] をbodyに当てることで全ページ共通のダークテーマ背景を確保 */}
      <body className="min-h-full flex flex-col bg-[#0f0f0f] text-white">
        {children}
      </body>
    </html>
  );
}
