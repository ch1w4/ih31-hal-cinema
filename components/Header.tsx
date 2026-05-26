// グローバルヘッダーコンポーネント
// 全ページで共通使用。ロゴ・ナビゲーション・ユーザーアカウントメニューを提供する
//
// ユーザー状態:
//   - localStorage の "userInfo" を読み込む（/auth/success でGoogle OAuth後に保存される）
//   - ログイン済み → ユーザーアイコンとメールアドレス + ドロップダウンでログアウト
//   - 未ログイン → ユーザーUI非表示

"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ナビゲーション項目定義（日英2段ラベル）
const navItems = [
  { href: "/", labelEn: "Home", labelJa: "ホーム" },
  { href: "/now-showing", labelEn: "Now Showing", labelJa: "上映中" },
  { href: "/coming-soon", labelEn: "Coming Soon", labelJa: "上映予定" },
  { href: "/campaign", labelEn: "Campaign/News", labelJa: "キャンペーンニュース" },
  { href: "/tickets", labelEn: "Online Tickets", labelJa: "チケット購入" },
];

interface UserInfo {
  email?: string;
  picture?: string;
  name?: string;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // マウント時に localStorage からユーザー情報を読み込む
  // SSR では localStorage が使えないため useEffect 内で実行する
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch {}
    }
  }, []);

  const handleLogout = async () => {
    try {
      // FastAPI 側のセッション破棄（失敗してもフロント側のクリアは続ける）
      await fetch("http://localhost:5000/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    // localStorage をクリアしてUIをリセット
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="bg-[#0f0f0f] border-b border-[#2a2a2a]">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          {/* ロゴクリックでホームへ */}
          <Link href="/">
            <img src="/halcinemalogo.png" alt="HAL CINEMA" style={{ height: "80px", width: "auto" }} />
          </Link>

          {/* ログイン済みのときのみユーザーメニューを表示 */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
              >
                {/* Google アカウントのプロフィール画像 */}
                {user.picture && (
                  <img src={user.picture} alt={user.name || "User"} className="w-8 h-8 rounded-full" />
                )}
                <span className="text-sm">{user.email}</span>
              </button>
              {/* ドロップダウンメニュー: ログアウトのみ */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] transition-colors rounded-lg"
                  >
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ナビゲーションタブ */}
        <nav className="flex items-start gap-6 md:gap-10">
          {navItems.map((item) => {
            // ホーム("/")は完全一致、それ以外は前方一致でアクティブ判定
            // （例: /movies/1 でも /movies アイテムがアクティブにならないよう）
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item text-center ${isActive ? "active" : ""}`}
              >
                {/* 英語ラベル（小さいサブテキスト）*/}
                <span className="nav-label-en" style={{ fontSize: "9px" }}>
                  {item.labelEn}
                </span>
                {/* 日本語ラベル（メインテキスト）*/}
                <span className="nav-label-ja">{item.labelJa}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
