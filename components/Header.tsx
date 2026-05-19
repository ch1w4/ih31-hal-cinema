"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", labelEn: "Home", labelJa: "ホーム" },
  { href: "/now-showing", labelEn: "Now  Showing", labelJa: "上映中" },
  { href: "/coming-soon", labelEn: "Coming Soon", labelJa: "上映予定" },
  { href: "/campaign", labelEn: "Campaign/News", labelJa: "キャンペーン\nニュース" },
  { href: "/tickets", labelEn: "Online Tickets", labelJa: "チケット購入" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-[#0f0f0f] border-b border-[#2a2a2a]">
      <div className="py-2">
        <div className="flex justify-center mb-2">
          <Link href="/">
            <img src="/halcinemalogo.png" alt="HAL CINEMA" style={{ height: "72px", width: "auto" }} />
          </Link>
        </div>
        <nav className="flex items-center justify-center gap-8 pl-12 ">
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
