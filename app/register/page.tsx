"use client";
import Header from "@/components/Header";
import Link from "next/link";




export default function RegisterPage() {
  const handleGoogleLogin = () =>{
    window.location.href = "http://localhost:5000/login";
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-sm mx-auto px-4 py-12">
        <div className="bg-[#0f0f0f] rounded-lg p-8">
          <h1 className="text-lg font-medium text-white text-center mb-8">会員登録</h1>

          <form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">名前</label>
              <input
                type="text"
                className="w-full bg-[#3a3a3a] border-0 rounded px-3 py-4 text-base text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#666]"
              />
            </div>

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
              会員登録
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#444]" />
            <span className="text-sm text-gray-500">または</span>
            <div className="flex-1 h-px bg-[#444]" />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-[#f0f0f0] text-black py-4 rounded text-base font-medium hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-base">G</span>
              Googleアカウント
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">すでに会員の方</p>
            <Link href="/login" className="text-sm text-white hover:underline">
              ログインはこちら
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
