"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HalLogo from "./HalLogo";

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
      <div className="w-full px-4 py-4 flex flex-col items-center gap-4">
        <Link href="/">
          <HalLogo size={60} />
        </Link>
        <nav className="flex items-center justify-center gap-6 md:gap-10 w-full">
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
                <span
                  className="nav-label-ja"
                  style={{ whiteSpace: "pre-line", lineHeight: "1.3" }}
                >
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
