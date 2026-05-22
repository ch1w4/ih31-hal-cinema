"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", labelEn: "Home", labelJa: "ホーム" },
  { href: "/now-showing", labelEn: "Now  Showing", labelJa: "上映中" },
  { href: "/coming-soon", labelEn: "Coming Soon", labelJa: "上映予定" },
  { href: "/campaign", labelEn: "Campaign/News", labelJa: "キャンペーン\nニュース" },
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

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="bg-[#0f0f0f] border-b border-[#2a2a2a]">
      <div className="py-2 relative">
        <div className="flex justify-center mb-2">
          <Link href="/">
            <img src="/halcinemalogo.png" alt="HAL CINEMA" style={{ height: "72px", width: "auto" }} />
          </Link>
        </div>

        {user && (
          <div className="absolute right-4 top-2">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              {user.picture && (
                <img src={user.picture} alt={user.name || "User"} className="w-8 h-8 rounded-full" />
              )}
              <span className="text-xs text-gray-400">{user.email}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg z-50">
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

        <nav className="flex items-center justify-center gap-16">
          {navItems.map((item) => {
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
                <span
                  className="nav-label-en"
                  style={{ whiteSpace: "pre-line", fontSize: "9px" }}
                >
                  {item.labelEn}
                </span>
                <span className="nav-label-ja">
                  {item.labelJa}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
