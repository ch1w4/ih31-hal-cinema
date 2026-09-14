// アプリ全体を囲むルートレイアウト
// Next.js App Router では layout.tsx が全ページ共通のHTML骨格を提供する
// このファイルはサーバーコンポーネントとして動作し、クライアントJSを含まない

import type { Metadata } from "next";
import "./globals.css";
import Chatbot from "@/app/chat/chatbot"; // ★追加：チャットボットを読み込む（ファイル名に合わせて ./chatbot としています）

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho&display=swap" rel="stylesheet" />
      </head>
      {/* bg-[#0f0f0f] をbodyに当てることで全ページ共通のダークテーマ背景を確保 */}
      <body className="min-h-full flex flex-col bg-[#0f0f0f] text-white" style={{ fontFamily: '"Shippori Mincho", serif' }}>
        {children}
        <footer className="border-t border-[#2a2a2a] bg-[#0f0f0f] py-4 mt-auto">
          <p className="text-center text-xs text-gray-600">
            &copy; {new Date().getFullYear()} HAL CINEMA. All rights reserved.
          </p>
        </footer>
        
        {/* ★追加：全ページにチャットボットを表示する */}
        <Chatbot />
      </body>
    </html>
  );
}