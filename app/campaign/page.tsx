// キャンペーン・ニュース一覧ページ（サーバーコンポーネント）
// "use client" なしのため、Next.js がサーバーサイドでHTMLを生成する
// カテゴリフィルターボタンはUI表示のみ（現在はクリックしても絞り込まれない）

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { campaigns } from "@/lib/mockData";

// フィルタ用カテゴリ一覧（コンポーネント外で定義することで再レンダリング時の再生成を回避）
const categories = ["すべて", "キャンペーン", "割引情報", "会員情報", "お知らせ"];

export default function CampaignPage() {

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-lg font-medium text-white mb-6 pb-2 border-b border-[#333]">
          <span className="text-xs text-gray-400 block mb-1">Campaign / News</span>
          キャンペーン・ニュース
        </h1>

        {/* カテゴリフィルターボタン群（現在は「すべて」だけがアクティブスタイル固定） */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                cat === "すべて"
                  ? "border-white bg-white text-black"
                  : "border-[#444] text-gray-400 hover:border-[#888] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* キャンペーンカード一覧 */}
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/campaign/${campaign.id}`}
              className="block border border-[#333] rounded-lg overflow-hidden bg-[#1a1a1a] hover:border-[#555] transition-colors"
            >
              <div className="flex gap-4 p-4">
                {/* キャンペーン画像サムネイル */}
                <div className="relative flex-shrink-0 w-[150px] h-16 rounded overflow-hidden bg-[#0f0f0f] border border-[#2a2a2a]">
                  <Image
                    src={campaign.imageSrc}
                    alt={campaign.title}
                    fill
                    sizes="150px"
                    className="object-contain"
                  />
                </div>

                {/* キャンペーン本文情報 */}
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-1">
                    {/* カテゴリバッジ: accentColor を背景色に使用 */}
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded text-white flex-shrink-0"
                      style={{ background: campaign.accentColor }}
                    >
                      {campaign.category}
                    </span>
                    <span className="text-[10px] text-gray-500">{campaign.period}</span>
                  </div>
                  <div className="text-white text-sm font-medium mb-1">
                    {campaign.title}
                  </div>
                  <div className="text-xs text-gray-400 mb-2">{campaign.subtitle}</div>
                  {/* 2行に切り詰めて一覧を見やすくする */}
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {campaign.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
