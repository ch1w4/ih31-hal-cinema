import Header from "@/components/Header";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="border border-[#333] rounded-lg p-8 bg-[#1a1a1a]">
          <h1 className="text-xl font-medium text-white mb-2">ログイン</h1>
          <p className="text-sm text-gray-400 mb-8">HAL CINEMA会員アカウントでログイン</p>

          <form className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full bg-[#2a2a2a] border border-[#444] rounded px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#888]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">
                パスワード
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#2a2a2a] border border-[#444] rounded px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#888]"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" className="accent-white" />
                ログイン状態を保持する
              </label>
              <Link href="#" className="text-gray-400 hover:text-white">
                パスワードを忘れた方
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black py-2.5 rounded font-medium text-sm hover:bg-gray-200 transition-colors mt-2"
            >
              ログイン
            </button>
          </form>

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
