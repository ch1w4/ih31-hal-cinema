import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // ブラウザからの /backend/* リクエストを、Next.js サーバー内部で
  // backend コンテナ（Docker内部ネットワーク）へ転送する。
  // これにより公開ドメインが何であっても、ブラウザは常に同一オリジンだけを見ればよくなる。
  async rewrites() {
    const backendUrl = process.env.INTERNAL_API_URL ?? "http://backend:5000";
    return [{ source: "/backend/:path*", destination: `${backendUrl}/:path*` }];
  },
};

export default nextConfig;
