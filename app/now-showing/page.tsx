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

  useEffect(() => {
    // ローカルストレージから推薦映画とユーザー情報を取得
    try {
      const stored = localStorage.getItem("recommendedMovies");
      if (stored) {
        const recommended = JSON.parse(stored);
        setRecommendedMovies(recommended);
      }

      const user = localStorage.getItem("userInfo");
      if (user) {
        const userParsed = JSON.parse(user);
        setUserInfo(userParsed);
      }
    } catch (error) {
      console.warn("Failed to load data from localStorage:", error);
    }
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

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
