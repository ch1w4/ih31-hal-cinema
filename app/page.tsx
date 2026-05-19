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
    // ローカルストレージからオススメ映画を取得
    try {
      const stored = localStorage.getItem("recommendedMovies");
      if (stored) {
        const recommended = JSON.parse(stored);
        setRecommendedMovies(recommended);
      }
    } catch (error) {
      console.warn("Failed to load recommended movies:", error);
    }
    setLoading(false);
  }, []);

  // オススメ映画がある場合は表示、ない場合はランキング映画を表示
  const displayedRankingMovies = recommendedMovies.length > 0 ? recommendedMovies.slice(0, 10) : movies.slice(0, 10);
  const rankingMovies = displayedRankingMovies;
  const nowShowingMovies = movies.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Member Login Section */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-0 border border-[#333] rounded overflow-hidden max-w-md">
          <div className="px-4 py-3 text-sm text-gray-300 bg-[#1a1a1a] border-r border-[#333] whitespace-nowrap">
            HAL CINEMA会員
          </div>
          <Link
            href="/login"
            className="px-6 py-3 text-sm text-white bg-[#555] hover:bg-[#666] transition-colors border-r border-[#333]"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 text-sm text-white hover:bg-[#222] transition-colors"
          >
            新規登録
          </Link>
        </div>
      </div>

      {/* Movie Ranking / Recommended */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="border border-[#333] rounded overflow-hidden">
          <div className="px-4 py-2 section-title bg-[#1a1a1a] border-b border-[#333]">
            {recommendedMovies.length > 0 && !loading ? "🎬 あなたにオススメの映画" : "映画ランキング"}
          </div>
          <div className="placeholder-box" style={{ height: "300px", overflow: "visible" }}>
            <div className="p-6 grid grid-cols-5 gap-3 h-full relative">
              {rankingMovies.map((movie, i) => (
                <div key={movie.id} className="flex flex-col items-center gap-1 group relative">
                  <div className="text-xs font-bold text-gray-600">{i + 1}</div>
                  <Link
                    href={`/movies/${movie.id}`}
                    className="w-full"
                  >
                    <div
                      className="w-full rounded relative overflow-hidden"
                      style={{
                        aspectRatio: "2/3",
                        background: `linear-gradient(160deg, ${movie.posterColor} 0%, #1a1a1a 100%)`,
                      }}
                    >
                      {/* スコアをポスターの右上に表示（推薦の場合） */}
                      {(movie as any).score !== undefined && (
                        <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {(movie as any).score}点
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="w-full">
                    <div className="text-[9px] text-gray-500 text-center truncate w-full group-hover:text-gray-300">
                      {movie.title}
                    </div>
                    {/* 推薦理由をツールチップで表示 */}
                    {(movie as any).why && (
                      <div className="absolute bottom-[calc(100%+10px)] left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-gray-100 text-[8px] px-2 py-1 rounded whitespace-nowrap z-20 border border-gray-600 pointer-events-none">
                        {(movie as any).why}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Now Showing Grid */}
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

      {/* Spacing */}
      <div className="py-8" />
    </div>
  );
}
