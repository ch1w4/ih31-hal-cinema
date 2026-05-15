import Link from "next/link";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import MovieCard from "@/components/MovieCard";
import { movies } from "@/lib/mockData";

export default function HomePage() {
  const rankingMovies = movies.slice(0, 10);
  const nowShowingMovies = movies.slice(0, 8);
  const top3 = [movies[1], movies[0], movies[2]]; // 2位, 1位, 3位

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Member login bar */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-stretch border border-[#333] rounded overflow-hidden w-fit">
          <div className="px-4 py-2.5 text-xs text-gray-300 bg-[#1a1a1a] border-r border-[#333] whitespace-nowrap">
            HAL CINEMA会員
          </div>
          <Link
            href="/login"
            className="px-6 py-2.5 text-xs text-white bg-[#555] hover:bg-[#666] transition-colors border-r border-[#333]"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 text-xs text-white hover:bg-[#222] transition-colors"
          >
            新規登録
          </Link>
        </div>
      </div>

      {/* Movie Ranking */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-[#1a1a1a] rounded overflow-hidden py-6 px-6">
          <div className="text-sm text-center text-white mb-6">映画ランキング</div>

          {/* Podium: 2nd left, 1st center (larger), 3rd right */}
          <div className="flex items-end justify-center gap-4 mb-5">
            {top3.map((movie, podiumIdx) => {
              const rank = [2, 1, 3][podiumIdx];
              const isFirst = rank === 1;
              return (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  className="flex flex-col items-center gap-1 group"
                  style={{ width: isFirst ? "130px" : "100px" }}
                >
                  <div className={`font-bold text-gray-400 mb-1 ${isFirst ? "text-lg" : "text-sm"}`}>
                    {rank}
                  </div>
                  <div
                    className="w-full rounded"
                    style={{
                      aspectRatio: "2/3",
                      background: `linear-gradient(160deg, ${movie.posterColor} 0%, #111 100%)`,
                      marginBottom: isFirst ? "0" : "10px",
                    }}
                  />
                  <div className="text-[10px] text-gray-400 text-center truncate w-full group-hover:text-gray-200">
                    {movie.title}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link href="/now-showing" className="text-xs text-gray-400 hover:text-white transition-colors">
              もっと見る
            </Link>
          </div>
        </div>
      </div>

      {/* Now Showing Grid – master branch style */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm text-white font-medium">上映中の映画</h2>
          <Link href="/now-showing" className="text-xs text-gray-400 hover:text-white">
            すべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {nowShowingMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      <div className="py-8" />
    </div>
  );
}
