"use client";

import Header from "@/components/Header";
import Link from "next/link";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/login";
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-sm mx-auto px-4 py-12">
        <div className="bg-[#0f0f0f] rounded-lg p-8">
          <h1 className="text-lg font-medium text-white text-center mb-8">ログイン</h1>

          <form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">メールアドレス</label>
              <input
                type="email"
                className="w-full bg-[#3a3a3a] border-0 rounded px-3 py-4 text-base text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#666]"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">パスワード</label>
              <input
                type="password"
                className="w-full bg-[#3a3a3a] border-0 rounded px-3 py-4 text-base text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#666]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black py-4 rounded text-base font-medium hover:bg-gray-200 transition-colors mt-2"
            >
              ログイン
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#333]">
            <p className="text-xs text-gray-500 text-center mb-3">または</p>
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white text-black py-2.5 rounded font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Googleでログイン
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-[#333] text-center">
            <p className="text-xs text-gray-500 mb-3">会員登録がまだの方</p>
            <Link
              href="/register"
              className="text-sm text-white border border-[#555] px-6 py-2 rounded hover:bg-[#333] transition-colors"
            >
              新規会員登録（無料）
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
