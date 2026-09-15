import Header from "@/components/Header";
import { fetchCampaigns } from "@/lib/api";
import CampaignFilterList from "./CampaignFilterList";

export default async function CampaignPage() {
  const campaigns = await fetchCampaigns();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 md:px-8">

        <section className="mb-8 overflow-hidden rounded-[24px] border border-[#2b2b2b] bg-[#111111] shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-5 p-5 md:flex-row md:items-end md:justify-between md:p-7">
            <div className="max-w-xl">
              <p className="mb-2 text-[10px] font-medium tracking-[0.24em] text-[#d9b35a] uppercase">
                Campaign / News
              </p>
              <h1 className="text-[28px] font-bold tracking-[0.06em] text-white md:text-[36px]">
                キャンペーン・ニュース
              </h1>
              <p className="mt-2 max-w-md text-sm leading-7 text-gray-300 md:text-[15px]">
                映画館ならではの特別な割引や会員限定イベントをチェックして、よりお得に鑑賞を楽しもう。
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-full border border-[#3d3d3d] bg-[#1a1a1a] px-3 py-2 text-[11px] font-medium text-[#f5d678] md:self-auto">
              <span className="inline-block h-2 w-2 rounded-full bg-[#f5d678]" />
              {campaigns.length}件の情報
            </div>
          </div>
        </section>

        <CampaignFilterList campaigns={campaigns} />
      </main>
    </div>
  );
}
