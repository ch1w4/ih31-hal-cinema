import Header from "@/components/Header";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-sm mx-auto px-4 py-12">
        <div className="bg-[#0f0f0f] rounded-lg p-8">
          <h1 className="text-lg font-medium text-white text-center mb-8">ログイン</h1>

          <form className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">メールアドレス</label>
              <input
                type="email"
                className="w-full bg-[#3a3a3a] border-0 rounded px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#666]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">パスワード</label>
              <input
                type="password"
                className="w-full bg-[#3a3a3a] border-0 rounded px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#666]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black py-2.5 rounded text-sm font-medium hover:bg-gray-200 transition-colors mt-2"
            >
              ログイン
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#444]" />
            <span className="text-xs text-gray-500">または</span>
            <div className="flex-1 h-px bg-[#444]" />
          </div>

          <div className="space-y-3">
            <button className="w-full bg-[#f0f0f0] text-black py-2.5 rounded text-sm font-medium hover:bg-white transition-colors flex items-center justify-center gap-2">
              <span className="text-base">G</span>
              Googleアカウント
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 mb-2">アカウントをお持ちでない方</p>
            <Link href="/register" className="text-xs text-white hover:underline">
              新規会員登録はこちら
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
