// 上映予定映画の詳細ページ
// 上映中映画の /movies/[id] とほぼ同じレイアウトだが、
// チケット購入セクションの代わりに「販売開始日のお知らせ」を表示する点が異なる

"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { comingSoonMovies } from "@/lib/mockData";

export default function ComingSoonDetailPage() {
  // URLパラメータ（例: /coming-soon/cs1 → params.id = "cs1"）
  const params = useParams();
  const movie = comingSoonMovies.find((m) => m.id === params.id);

  // 存在しないIDの場合のフォールバック表示
  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">
          映画が見つかりませんでした
        </div>
      </div>
    );
  }

  // "YYYY-MM-DD" → "YYYY年MM月DD日" に変換（チケット販売開始日の案内文に使用）
  const releaseDateFormatted = movie.releaseDate
    .replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$1年$2月$3日");

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 上映予定一覧へ戻る矢印ボタン */}
        <Link
          href="/coming-soon"
          className="inline-flex items-center gap-1 text-gray-400 hover:text-white mb-5 text-sm"
        >
          <span>←</span>
        </Link>

        {/* 映画情報: ポスター（140px固定幅） + 詳細テキスト */}
        <div className="flex gap-5 mb-6">
          <div className="flex-shrink-0" style={{ width: "140px" }}>
            {movie.poster ? (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded object-cover"
                style={{ aspectRatio: "2/3" }}
              />
            ) : (
              <div
                className="w-full rounded"
                style={{
                  aspectRatio: "2/3",
                  background: `linear-gradient(160deg, ${movie.posterColor} 0%, #111 100%)`,
                }}
              />
            )}
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Coming Soon</div>
            <h1 className="text-lg font-medium text-white mb-2">{movie.title}</h1>
            {/* 公開予定日を赤文字で強調 */}
            <div className="text-sm text-red-400 font-medium mb-3">
              公開予定：{releaseDateFormatted}
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-3">
              {movie.synopsis}
            </p>
            {/* ジャンルタグとレーティングバッジ */}
            <div className="flex flex-wrap gap-1 mb-3">
              {movie.genre.map((g) => (
                <span key={g} className="text-sm px-1.5 py-0.5 border border-[#444] text-gray-400 rounded">
                  {g}
                </span>
              ))}
              <span className="text-sm px-1.5 py-0.5 border border-[#444] text-gray-400 rounded">
                {movie.rating}
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-1">声優・キャスト</div>
            <div className="flex flex-wrap gap-1 mb-2">
              {movie.cast.map((name) => (
                <span key={name} className="text-sm text-gray-400">{name}</span>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              監督：{movie.director}　{movie.duration}分
            </div>
          </div>
        </div>

        {/* チケット販売開始日のお知らせ（上映中映画の予約セクションの代わり） */}
        <div className="border border-[#333] rounded p-4 bg-[#1a1a1a] text-sm text-gray-400">
          <div className="text-white font-medium mb-1">チケット販売について</div>
          <div>公開日({releaseDateFormatted})以降にチケット販売が開始されます。</div>
        </div>
      </main>
    </div>
  );
}
