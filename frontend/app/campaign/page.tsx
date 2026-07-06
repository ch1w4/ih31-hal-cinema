import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { fetchCampaigns } from "@/lib/api";

const categories = ["すべて", "キャンペーン", "割引情報", "会員情報", "お知らせ"];

export default async function CampaignPage() {
  const campaigns = await fetchCampaigns();

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-lg font-medium text-white mb-6 pb-2 border-b border-[#333]">
          <span className="text-xs text-gray-400 block mb-1">Campaign / News</span>
          キャンペーン・ニュース
        </h1>

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

        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/campaign/${campaign.id}`}
              className="block border border-[#333] rounded-lg overflow-hidden bg-[#1a1a1a] hover:border-[#555] transition-colors"
            >
              <div className="flex gap-4 p-4">
                <div className="relative flex-shrink-0 w-[150px] h-16 rounded overflow-hidden bg-[#0f0f0f] border border-[#2a2a2a]">
                  <Image src={campaign.imageSrc} alt={campaign.title} fill sizes="150px" className="object-contain" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded text-white flex-shrink-0" style={{ background: campaign.accentColor }}>
                      {campaign.category}
                    </span>
                    <span className="text-[10px] text-gray-500">{campaign.period}</span>
                  </div>
                  <div className="text-white text-sm font-medium mb-1">{campaign.title}</div>
                  <div className="text-xs text-gray-400 mb-2">{campaign.subtitle}</div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{campaign.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
