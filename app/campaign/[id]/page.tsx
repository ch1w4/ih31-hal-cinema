"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { campaigns } from "@/lib/mockData";

export default function CampaignDetailPage() {
  const params = useParams();
  const campaign = campaigns.find((c) => c.id === params.id);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">
          キャンペーン情報が見つかりませんでした
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/campaign" className="hover:text-gray-300 transition-colors">
            キャンペーン・ニュース
          </Link>
          <span>/</span>
          <span className="text-gray-400">{campaign.title}</span>
        </div>

        {/* Header banner */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ background: `linear-gradient(135deg, ${campaign.accentColor}cc, ${campaign.accentColor}44)`, borderLeft: `4px solid ${campaign.accentColor}` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs px-2 py-1 rounded font-medium text-white"
              style={{ background: campaign.accentColor }}
            >
              {campaign.category}
            </span>
            <span className="text-sm text-gray-300">{campaign.period}</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-1">{campaign.title}</h1>
          <p className="text-sm text-gray-300">{campaign.subtitle}</p>
        </div>

        {/* Summary */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-200 leading-relaxed">{campaign.description}</p>
        </div>

        {/* Body */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-8">
          <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
            {campaign.body}
          </p>
        </div>

        {/* Back button */}
        <div className="flex justify-center">
          <Link
            href="/campaign"
            className="px-8 py-3 border border-[#555] text-gray-300 rounded hover:border-[#888] hover:text-white transition-colors text-sm"
          >
            一覧に戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
