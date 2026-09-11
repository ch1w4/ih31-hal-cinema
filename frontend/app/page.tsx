"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/lib/mockData";
import { fetchMovies } from "@/lib/api";

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchMovies().then(setMovies);

    try {
      setIsLoggedIn(!!localStorage.getItem("userInfo"));
      const stored = localStorage.getItem("recommendedMovies");
      if (stored) {
        const raw: { id: string; score: number; why: string }[] = JSON.parse(stored);
        // raw は api.ts の fetchAllMovies から取得した全映画と突合する
        // ここでは movies の fetch が完了してから変換するため useEffect を分ける
        const rawRef = raw;
        fetchMovies().then((all) => {
          const converted = rawRef
            .map((item) => {
              const movie = all.find((m) => m.id === item.id);
              return movie ? { ...movie, score: item.score, why: item.why } : null;
            })
            .filter(Boolean) as Movie[];
          setRecommendedMovies(converted);
        });
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const hasRecs = recommendedMovies.length > 0 && !loading;
  const nowShowingMovies = movies.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <main className="mx-auto max-w-[1280px] px-4 pb-12 pt-6 md:px-8">
        <div className="mb-4 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#d9b35a] uppercase" style={{ lineHeight: 1.3 }}>
          <span>ホーム</span>
          <span>/</span>
          <span>HOME</span>
        </div>

        <HeroSlider />

        {!isLoggedIn && (
          <div className="mb-6 flex items-stretch overflow-hidden rounded-md border border-[#333] bg-[#121212] w-fit">
            <div className="whitespace-nowrap border-r border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-sm text-gray-300">
              HAL CINEMA会員
            </div>
            <Link href="/login" className="border-r border-[#333] bg-[#555] px-6 py-2.5 text-sm text-white transition-colors hover:bg-[#666]">
              ログイン
            </Link>
            <Link href="/register" className="px-6 py-2.5 text-sm text-white transition-colors hover:bg-[#222]">
              新規登録
            </Link>
          </div>
        )}

        <div className="ranking-shell mb-8">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] bg-[#111111] px-4 py-3">
            <div className="ranking-label">映画人気ランキング</div>
            <div className="text-xs text-gray-400">TOP 5</div>
          </div>

          {hasRecs ? (
            <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4">
              {recommendedMovies.slice(0, 4).map((movie) => {
                const rec = movie as any;
                return (
                  <div key={movie.id} className="group relative">
                    <Link href={`/movies/${movie.id}`} className="block movie-card">
                      <div className="w-full relative" style={{ aspectRatio: "2/3" }}>
                        {movie.poster ? (
                          <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full" style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #0a0a0a 100%)` }} />
                        )}
                        <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          AI推薦
                        </div>
                      </div>
                      <div className="p-2 bg-[#1a1a1a]">
                        <div className="text-xs text-white font-medium truncate">{movie.title}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{movie.genre[0]} · {movie.rating}</div>
                        {rec.why && (
                          <div className="text-[10px] text-gray-500 mt-1 line-clamp-2">{rec.why}</div>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-5">
              {movies.slice(0, 5).map((movie, i) => (
                <div key={movie.id} className="ranking-card">
                  <div className="ranking-number">{i + 1}</div>
                  <Link href={`/movies/${movie.id}`} className="ranking-poster block transition-transform duration-200 hover:scale-[1.02]">
                    {movie.poster ? (
                      <img src={movie.poster} alt={movie.title} />
                    ) : (
                      <div className="h-full w-full" style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #1a1a1a 100%)` }} />
                    )}
                  </Link>
                  <div className="mt-2 text-center">
                    <div className="ranking-stars">★★★★★</div>
                    <div className="mt-1 text-xs text-gray-300">{movie.title}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-6xl pt-2">
          <div className="mb-4 flex items-center justify-between border-b border-[#2a2a2a] pb-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#f5d678] uppercase" style={{ lineHeight: 1.2 }}>
                Now
              </span>
              <h2 className="text-[19px] font-bold tracking-[0.06em] text-white" style={{ lineHeight: 1.2 }}>
                Showing
              </h2>
            </div>
            <Link href="/now-showing" className="text-[10px] font-medium tracking-[0.14em] text-gray-300 transition-colors hover:text-[#f5d678]">
              MORE
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5" style={{ justifyItems: "center" }}>
            {nowShowingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
