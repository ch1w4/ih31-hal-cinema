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

const navItems = [
  { href: "/", labelJa: "ホーム" },
  { href: "/now-showing", labelJa: "上映中" },
  { href: "/coming-soon", labelJa: "上映予定" },
  { href: "/campaign", labelJa: "キャンペーン" },
  { href: "/tickets", labelJa: "チケット予約" },
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const main = document.querySelector("main");
    const previousScrollTop = main?.scrollTop ?? 0;

    document.body.classList.toggle("sidebar-open", isMenuOpen);
    document.body.classList.toggle("sidebar-collapsed", !isMenuOpen);

    requestAnimationFrame(() => {
      if (main) {
        main.scrollTop = previousScrollTop;
      }
    });

    return () => {
      document.body.classList.remove("sidebar-open", "sidebar-collapsed");
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("recommendedMovies");
    setUser(null);
    router.push("/login");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className={`sidebar-toggle ${isMenuOpen ? "sidebar-toggle-open" : ""}`}
        aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={isMenuOpen}
      >
        <span className="sidebar-toggle-icon" aria-hidden="true">
          <span className="sidebar-toggle-line" />
          <span className="sidebar-toggle-line" />
          <span className="sidebar-toggle-line" />
        </span>
      </button>

      <aside className={`sidebar ${isMenuOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="sidebar-header">
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="sidebar-close"
            aria-label="メニューを閉じる"
          >
            <span className="sidebar-close-icon" aria-hidden="true">
              <span className="sidebar-close-line" />
              <span className="sidebar-close-line" />
            </span>
          </button>
        </div>

        <Link href="/" className="sidebar-brand">
          <img src="/halcinemalogo.png" alt="HAL CINEMA" className="sidebar-brand-image" />
        </Link>



        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              >
                <span>{item.labelJa}</span>
              </Link>

              
            );
          })}
        </nav>
        <Link href="/login" className="sidebar-login-item">
          ログイン
        </Link>

        {user && (
          <div className="sidebar-user-menu">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="sidebar-user-button"
            >
              {user.picture && (
                <img src={user.picture} alt={user.name || "User"} className="sidebar-user-avatar" />
              )}
              <span className="sidebar-user-email">{user.email}</span>
            </button>

            {isDropdownOpen && (
              <div className="sidebar-dropdown">
                <a
                  href="/reservations"
                  onClick={() => setIsDropdownOpen(false)}
                  className="sidebar-dropdown-item"
                >
                  予約済み座席
                </a>
                <button
                  onClick={handleLogout}
                  className="sidebar-dropdown-button"
                >
                  ログアウト
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
