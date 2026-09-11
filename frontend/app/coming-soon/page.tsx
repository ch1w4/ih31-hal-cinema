import Header from "@/components/Header";
import Link from "next/link";
import { fetchComingSoon } from "@/lib/api";

export default async function ComingSoonPage() {
  const movies = await fetchComingSoon();

  // 公開月でグループ化
  const byMonth = movies.reduce<Record<string, typeof movies>>((acc, m) => {
    const label = m.releaseDate
      ? `${m.releaseDate.slice(0, 7).replace("-", "年")}月公開`
      : "近日公開";
    acc[label] = [...(acc[label] ?? []), m];
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-xl font-medium text-white mb-6 pb-2 border-b border-[#333]">
          <span className="text-sm text-gray-400 block mb-1">Coming Soon</span>
          上映予定
        </h1>

        {Object.entries(byMonth).map(([label, films]) => (
          <div key={label} className="mb-10">
            <div className="text-sm text-gray-400 text-center mb-4">{label}</div>
            <div className="grid grid-cols-4 gap-4">
              {films.map((movie) => (
                <div key={movie.id} className="flex flex-col">
                  <div className="text-sm text-gray-400 mb-1">
                    {movie.releaseDate.replace(/-/g, "/").slice(5).replace("/", "月")}日公開
                  </div>

                  <Link
                    href={`/coming-soon/${movie.id}`}
                    className="group block w-full overflow-hidden rounded-sm border border-[#d9b35a]/40 bg-[#111111] shadow-[0_12px_28px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d9b35a]/80"
                    style={{ aspectRatio: "2/3" }}
                  >
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div
                        className="h-full w-full"
                        style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #1a1a1a 100%)` }}
                      />
                    )}
                  </Link>

                  <Link
                    href={`/coming-soon/${movie.id}`}
                    className="mt-2 block w-full rounded-sm border border-[#d9b35a]/60 bg-black/30 px-3 py-2 text-center text-[11px] font-bold text-[#f5d678] transition-colors hover:bg-[#d9b35a]/10"
                  >
                    詳細を見る
                  </Link>

                  <div className="text-sm text-gray-300 mb-1 truncate mt-2">{movie.title}</div>
                  <div className="flex gap-1 flex-wrap mb-2">
                    {movie.genre.map((g) => (
                      <span key={g} className="text-sm px-1.5 py-0.5 border border-[#444] text-gray-500 rounded">
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {movie.synopsis}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {movies.length === 0 && (
          <div className="text-gray-500 text-center py-16">上映予定作品はありません</div>
        )}
      </main>
    </div>
  );
}
