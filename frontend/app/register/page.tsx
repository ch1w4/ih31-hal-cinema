// 新規会員登録ページ
// 将来的にはFastAPI /register エンドポイントへPOSTする予定

"use client";
import Header from "@/components/Header";
import Link from "next/link";

export default function RegisterPage() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/login";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-5 md:px-8">
        <div className="w-full max-w-[560px] rounded-[18px] border border-[#2a2a2a] bg-[#0d0d0d] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)] md:p-6">
          <div className="mb-5 text-center">
            <h1 className="text-[20px] font-bold tracking-[0.05em] text-white md:text-[24px]">
              HALシネマ会員登録
            </h1>
          </div>

          <form className="mx-auto max-w-[460px] space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-white md:text-[14px]">
                名前
              </label>
              <input
                type="text"
                placeholder="山田 太郎"
                className="w-full rounded-md border border-[#444] bg-[#121212] px-2 py-1.5 text-base text-white placeholder-gray-500 outline-none transition focus:border-[#d9b35a] focus:ring-2 focus:ring-[#d9b35a]/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-white md:text-[14px]">
                メールアドレス
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full rounded-md border border-[#444] bg-[#121212] px-2 py-1.5 text-base text-white placeholder-gray-500 outline-none transition focus:border-[#d9b35a] focus:ring-2 focus:ring-[#d9b35a]/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-white md:text-[14px]">
                パスワード
              </label>
              <input
                type="password"
                placeholder="8文字以上"
                className="w-full rounded-md border border-[#444] bg-[#121212] px-2 py-1.5 text-base text-white placeholder-gray-500 outline-none transition focus:border-[#d9b35a] focus:ring-2 focus:ring-[#d9b35a]/20"
              />
            </div>

            <button
              type="submit"
              className="mt-1 w-full rounded-md bg-[#d9b35a] px-4 py-3 text-base font-bold text-[#111] transition hover:bg-[#e2c15f]"
            >
              会員登録
            </button>
          </form>

          <div className="mt-5 border-t border-[#2b2b2b] pt-4 text-center">
            <button
              onClick={handleGoogleLogin}
              className="inline-flex w-full max-w-[460px] items-center justify-center gap-3 rounded-md border border-[#444] bg-[#ffffff] px-4 py-2.5 text-sm font-medium text-[#111111] transition hover:bg-[#f0f0f0]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.5C16.5 2.6 14.4 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.8H12z" />
                <path fill="#34A853" d="M3.6 7.4l3.5 2.6c1-1.9 3.1-3.3 5.9-3.3 1.8 0 3 .8 3.7 1.5l2.5-2.5C16.5 2.6 14.4 2 12 2c-3.7 0-6.9 2.1-8.4 5.4z" />
                <path fill="#FBBC05" d="M12 22c2.4 0 4.4-.8 5.9-2.2l-2.8-2.3c-.8.6-1.9 1.1-3.1 1.1-2.4 0-4.5-1.6-5.2-3.8l-3.1 2.4C2.9 19.8 6.9 22 12 22z" />
                <path fill="#4285F4" d="M3.6 16.7C4.3 18.9 6.4 20.5 9 20.5c1.2 0 2.3-.4 3.1-1.1l2.8 2.3C16.4 21.2 14.4 22 12 22c-5.1 0-9.1-2.2-8.4-5.3z" />
              </svg>
              Googleで登録
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="mb-3 text-sm text-gray-400">すでに会員の方</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-[#444] bg-[#111111] px-6 py-2.5 text-sm font-medium text-white transition hover:border-[#d9b35a] hover:text-[#f5d678]"
            >
              ログインはこちら
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
