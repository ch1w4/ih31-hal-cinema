"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { MovieCardLarge } from "@/components/MovieCard";
import { movies, Movie } from "@/lib/mockData";

export default function NowShowingPage() {
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(true);

  useEffect(() => {
    try {
      // 🔥 推薦結果を取得（AI の返答）
      const stored = localStorage.getItem("recommendedMovies");

      if (stored) {
        const raw = JSON.parse(stored);

        // 🔥 AI の返答が Movie[] ではない場合に Movie[] に変換する
        // 例: [{ id: "3", score: 92 }, ...]
        const converted: Movie[] = raw
          .map((item: any) => {
            const movie = movies.find((m) => m.id === item.id);
            return movie || null;
          })
          .filter(Boolean);

        setRecommendedMovies(converted);
      }

      // 🔥 ユーザー情報
      const user = localStorage.getItem("userInfo");
      if (user) {
        setUserInfo(JSON.parse(user));
      }
    } catch (error) {
      console.warn("Failed to load data from localStorage:", error);
    }
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      {/* 🔥 追従パネル（推薦映画） */}
      {recommendedMovies.length > 0 && showPanel && (
        <div className="fixed right-0 top-0 h-screen w-96 bg-[#1a1a1a] border-l border-[#333] shadow-2xl z-50 overflow-y-auto">
          {/* ヘッダー */}
          <div className="sticky top-0 bg-[#0f0f0f] border-b border-[#333] p-4 flex items-center justify-between">
            <h2 className="text-white font-medium text-sm">🤖 AIによるおすすめ</h2>
            <button
              onClick={() => setShowPanel(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* コンテンツ */}
          <div className="p-4 space-y-4">
            {recommendedMovies.slice(0, 10).map((movie, idx) => {
              const rec = (movie as any);
              return (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  className="block group"
                >
                  <div className="flex gap-3">
                    {/* ポスター */}
                    <div
                      className="w-16 h-24 rounded flex-shrink-0"
                      style={{
                        background: `linear-gradient(160deg, ${movie.posterColor} 0%, #0a0a0a 100%)`,
                      }}
                    />
                    {/* 情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-400 mb-1">#{idx + 1}</div>
                      <h3 className="text-sm text-white font-medium truncate group-hover:text-gray-200">
                        {movie.title}
                      </h3>
                      {rec.score !== undefined && (
                        <div className="mt-1 flex items-center gap-1">
                          <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                            {rec.score}点
                          </span>
                        </div>
                      )}
                      {rec.why && (
                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                          {rec.why}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-6">

        {/* 🔥 AIおすすめ映画セクション */}
        {recommendedMovies.length > 0 && (
          <section className="mb-10">
            <h1 className="text-lg font-medium text-white mb-4 pb-2 border-b border-[#333]">
              <span className="text-xs text-gray-400 block mb-1">Recommended For You</span>
              {userInfo?.name ? `${userInfo.name}さんへのおすすめ` : "あなたへのおすすめ"}
            </h1>

            <div className="grid grid-cols-4 gap-4 mb-8">
              {recommendedMovies.slice(0, 4).map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  className="group cursor-pointer"
                >
                  <div
                    className="w-full rounded-lg mb-2 hover:shadow-lg transition-shadow"
                    style={{
                      aspectRatio: "2/3",
                      background: `linear-gradient(160deg, ${movie.posterColor} 0%, #1a1a1a 100%)`,
                    }}
                  />
                  <h3 className="text-sm font-medium text-white group-hover:text-gray-200 truncate">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400">
                    {movie.genre.join("・")}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 🔥 上映中 */}
        <h1 className="text-lg font-medium text-white mb-6 pb-2 border-b border-[#333]">
          <span className="text-xs text-gray-400 block mb-1">Now Showing</span>
          上映中
        </h1>

        <div className="grid grid-cols-3 gap-4">
          {movies.map((movie) => (
            <MovieCardLarge key={movie.id} movie={movie} />
          ))}
        </div>
      </main>
    </div>
  );
}
