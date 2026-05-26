"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { comingSoonMovies } from "@/lib/mockData";

export default function ComingSoonDetailPage() {
  const params = useParams();
  const movie = comingSoonMovies.find((m) => m.id === params.id);

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

  const releaseDateFormatted = movie.releaseDate
    .replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$1年$2月$3日");

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Link
          href="/coming-soon"
          className="inline-flex items-center gap-1 text-gray-400 hover:text-white mb-5 text-sm"
        >
          <span>←</span>
        </Link>

        {/* Movie Info */}
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
            <div className="text-sm text-red-400 font-medium mb-3">
              公開予定：{releaseDateFormatted}
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-3">
              {movie.synopsis}
            </p>
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

        {/* Coming soon notice */}
        <div className="border border-[#333] rounded p-4 bg-[#1a1a1a] text-sm text-gray-400">
          <div className="text-white font-medium mb-1">チケット販売について</div>
          <div>公開日({releaseDateFormatted})以降にチケット販売が開始されます。</div>
        </div>
      </main>
    </div>
  );
}
