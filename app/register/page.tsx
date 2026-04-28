import Header from "@/components/Header";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="border border-[#333] rounded-lg p-8 bg-[#1a1a1a]">
          <h1 className="text-xl font-medium text-white mb-2">新規会員登録</h1>
          <p className="text-sm text-gray-400 mb-8">
            HAL CINEMA会員に登録して、お得な特典をご利用ください
          </p>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">姓</label>
                <input
                  type="text"
                  placeholder="田中"
                  className="w-full bg-[#2a2a2a] border border-[#444] rounded px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#888]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">名</label>
                <input
                  type="text"
                  placeholder="太郎"
                  className="w-full bg-[#2a2a2a] border border-[#444] rounded px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#888]"
                />
              </div>
            </div>

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
                placeholder="8文字以上"
                className="w-full bg-[#2a2a2a] border border-[#444] rounded px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#888]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">
                パスワード（確認）
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#2a2a2a] border border-[#444] rounded px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#888]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">生年月日</label>
              <input
                type="date"
                className="w-full bg-[#2a2a2a] border border-[#444] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#888]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">性別</label>
              <div className="flex gap-4 text-sm text-gray-300">
                {["男性", "女性", "回答しない"].map((g) => (
                  <label key={g} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="gender" className="accent-white" />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
                <input type="checkbox" className="accent-white mt-0.5" />
                <span>
                  <Link href="#" className="text-white hover:underline">
                    利用規約
                  </Link>
                  および
                  <Link href="#" className="text-white hover:underline">
                    プライバシーポリシー
                  </Link>
                  に同意する
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black py-2.5 rounded font-medium text-sm hover:bg-gray-200 transition-colors mt-2"
            >
              会員登録する
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#333] text-center">
            <p className="text-xs text-gray-500 mb-2">すでに会員の方</p>
            <Link
              href="/login"
              className="text-sm text-white hover:underline"
            >
              ログインはこちら
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
