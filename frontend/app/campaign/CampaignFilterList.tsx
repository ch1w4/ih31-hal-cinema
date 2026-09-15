"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Campaign } from "@/lib/mockData";

const categories = ["すべて", "キャンペーン", "割引情報", "会員情報", "お知らせ"] as const;

export default function CampaignFilterList({ campaigns }: { campaigns: Campaign[] }) {
  const [selected, setSelected] = useState<(typeof categories)[number]>("すべて");

  const filtered =
    selected === "すべて" ? campaigns : campaigns.filter((c) => c.category === selected);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelected(cat)}
            className={`rounded-full border px-3.5 py-2 text-[10px] font-medium tracking-[0.08em] transition-all duration-200 ${
              cat === selected
                ? "border-[#f5d678] bg-[#f5d678] text-[#111111] shadow-[0_0_10px_rgba(245,214,120,0.3)]"
                : "border-[#2e2e2e] bg-[#141414] text-gray-300 hover:border-[#666] hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((campaign) => (
          <Link
            key={campaign.id}
            href={`/campaign/${campaign.id}`}
            className="group block overflow-hidden rounded-[20px] border border-[#2a2a2a] bg-[#121212] transition-all duration-200 hover:border-[#555] hover:bg-[#171717]"
          >
            <div className="flex flex-col gap-4 p-3 md:flex-row md:p-4">
              <div className="relative h-40 w-full overflow-hidden rounded-[16px] border border-[#2a2a2a] bg-[#0d0d0d] md:h-28 md:w-[220px]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/35" />
                <Image
                  src={campaign.imageSrc}
                  alt={campaign.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 220px"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
                <div className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/10 bg-black/40 px-2 py-1 text-[9px] font-medium text-white backdrop-blur-sm">
                  {campaign.category}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] text-gray-400">
                  <span className="rounded-full border px-2 py-1 font-medium text-[#f5d678]" style={{ background: `${campaign.accentColor}1A`, borderColor: `${campaign.accentColor}66` }}>
                    {campaign.period}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: campaign.accentColor }} />
                    {campaign.category}
                  </span>
                </div>

                <h2 className="mb-1 text-lg font-bold tracking-[0.02em] text-white md:text-[20px]">
                  {campaign.title}
                </h2>
                <p className="mb-2 text-sm text-[#d8bb73]">{campaign.subtitle}</p>
                <p className="max-w-2xl text-sm leading-6 text-gray-300">
                  {campaign.description}
                </p>

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#262626] pt-3">
                  <span className="text-[10px] font-medium tracking-[0.14em] text-gray-400 uppercase">
                    More
                  </span>
                  <span className="text-sm font-medium text-[#f5d678]">
                    詳細を見る →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-gray-500">
            該当する情報がありません。
          </p>
        )}
      </div>
    </>
  );
}
