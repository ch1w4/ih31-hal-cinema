import Header from "@/components/Header";
import Link from "next/link";
import { comingSoonMovies } from "@/lib/mockData";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-lg font-medium text-white mb-6 pb-2 border-b border-[#333]">
          <span className="text-xs text-gray-400 block mb-1">Coming Soon</span>
          上映予定
        </h1>

        <div className="grid grid-cols-2 gap-6">
          {comingSoonMovies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="flex gap-4 border border-[#333] rounded-lg overflow-hidden bg-[#1a1a1a] hover:border-[#555] transition-colors"
            >
              {/* Poster */}
              <div
                className="flex-shrink-0"
                style={{
                  width: "100px",
                  aspectRatio: "2/3",
                  background: `linear-gradient(160deg, ${movie.posterColor} 0%, #111 100%)`,
                }}
              />
              {/* Info */}
              <div className="p-3 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    {movie.releaseDate.replace(/-/g, ".")} 公開予定
                  </div>
                  <div className="text-white font-medium mb-1">{movie.title}</div>
                  <div className="text-xs text-gray-400 mb-2">{movie.titleEn}</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {movie.genre.map((g) => (
                      <span
                        key={g}
                        className="text-[10px] px-1.5 py-0.5 rounded border border-[#444] text-gray-400"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                    {movie.synopsis}
                  </p>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {movie.duration}分 / {movie.rating}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
