import Link from "next/link";
import Header from "@/components/Header";
import { campaigns } from "@/lib/mockData";

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

        {/* Category Filter */}
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

        {/* Campaign List */}
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/campaign/${campaign.id}`}
              className="block border border-[#333] rounded-lg overflow-hidden bg-[#1a1a1a] hover:border-[#555] transition-colors"
            >
              <div className="flex gap-4 p-4">
                {/* Visual accent bar */}
                <div
                  className="flex-shrink-0 rounded flex items-center justify-center"
                  style={{
                    width: "120px",
                    height: "80px",
                    background: `linear-gradient(135deg, ${campaign.accentColor}cc, ${campaign.accentColor}44)`,
                    borderLeft: `3px solid ${campaign.accentColor}`,
                  }}
                >
                  <span className="text-[10px] text-white text-center px-2 leading-tight font-medium">
                    {campaign.title.slice(0, 8)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-1">
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
