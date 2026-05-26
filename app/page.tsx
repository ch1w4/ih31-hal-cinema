"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import MovieCard from "@/components/MovieCard";
import { movies, Movie } from "@/lib/mockData";

export default function HomePage() {
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recommendedMovies");
      if (stored) {
        const raw = JSON.parse(stored);
        const converted: Movie[] = raw
          .map((item: any) => movies.find((m) => m.id === item.id) || null)
          .filter(Boolean);
        setRecommendedMovies(converted);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const hasRecs = recommendedMovies.length > 0 && !loading;
  const nowShowingMovies = movies.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <HeroSlider />

      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-stretch border border-[#333] rounded overflow-hidden w-fit">
          <div className="px-4 py-2.5 text-sm text-gray-300 bg-[#1a1a1a] border-r border-[#333] whitespace-nowrap">
            HAL CINEMA会員
          </div>
          <Link href="/login" className="px-6 py-2.5 text-sm text-white bg-[#555] hover:bg-[#666] transition-colors border-r border-[#333]">
            ログイン
          </Link>
          <Link href="/register" className="px-6 py-2.5 text-sm text-white hover:bg-[#222] transition-colors">
            新規登録
          </Link>
        </div>
      </div>

      {/* Movie Ranking / AI Recommended */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="border border-[#333] rounded overflow-hidden">
          <div className="px-4 py-2 section-title bg-[#1a1a1a] border-b border-[#333]">
            {hasRecs ? "あなたにオススメの映画" : "映画ランキング"}
          </div>

          <div className="placeholder-box" style={{ overflow: "visible" }}>
            <div className="p-6 grid grid-cols-5 gap-3 relative">
              {(hasRecs ? recommendedMovies.slice(0, 10) : movies.slice(0, 10)).map((movie, i) => {
                const rec = movie as any;
                return (
                  <div key={movie.id} className="flex flex-col items-center gap-1 group relative">
                    <div className="text-xs font-bold text-gray-600">{i + 1}</div>
                    <Link href={`/movies/${movie.id}`} className="w-full">
                      <div className="w-full rounded overflow-hidden relative" style={{ aspectRatio: "2/3" }}>
                        {movie.poster ? (
                          <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full" style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #1a1a1a 100%)` }} />
                        )}
                        {rec.score !== undefined && (
                          <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {rec.score}点
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="text-[9px] text-gray-500 text-center truncate w-full group-hover:text-gray-300">
                      {movie.title}
                    </div>
                    {rec.why && (
                      <div className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-gray-100 text-[8px] px-2 py-1 rounded whitespace-nowrap z-20 border border-gray-600 pointer-events-none">
                        {rec.why}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl text-white font-medium">上映中の映画</h2>
          <Link href="/now-showing" className="text-sm text-gray-400 hover:text-white">
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
