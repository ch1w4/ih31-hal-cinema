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

      <main className="mx-auto max-w-[1280px] px-3 pb-8 pt-4 md:px-6">


        <HeroSlider />

        {!isLoggedIn && (
          <div className="mb-4 flex items-stretch overflow-hidden rounded-md border border-[#333] bg-[#121212] w-fit">
            <div className="whitespace-nowrap border-r border-[#333] bg-[#1a1a1a] px-3 py-2 text-xs text-gray-300">
              HAL CINEMA会員
            </div>
            <Link href="/login" className="border-r border-[#333] bg-[#555] px-4 py-2 text-xs text-white transition-colors hover:bg-[#666]">
              ログイン
            </Link>
            <Link href="/register" className="px-4 py-2 text-xs text-white transition-colors hover:bg-[#222]">
              新規登録
            </Link>
          </div>
        )}

        <div className="ranking-shell mb-6">
          <div className="flex items-center justify-between border-b border-[#3a3120] bg-[linear-gradient(90deg,rgba(217,179,90,0.16),rgba(17,17,17,0.92),rgba(17,17,17,1))] px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="ranking-label">映画人気ランキング</div>
            </div>
            <div className="text-[16px] font-medium tracking-[0.22em] text-gray-400 uppercase">Top 5</div>
          </div>

          {hasRecs ? (
            <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-5">
              {recommendedMovies.slice(0, 5).map((movie, i) => {
                const rec = movie as any;
                return (
                  <div key={movie.id} className="group relative">
                    <div className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#d9b35a]/60 bg-[#0f0f0f]/90 text-[14px] font-bold text-[#f5d678] shadow-[0_0_18px_rgba(245,214,120,0.22)]">
                      {i + 1}
                    </div>

                    <Link
                      href={`/movies/${movie.id}`}
                      className="block overflow-hidden rounded-[10px] border border-[#2e2a24] bg-[linear-gradient(180deg,#1b1a18,#0f0f0f)] p-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition duration-200 hover:-translate-y-0.5 hover:border-[#d9b35a]/80 hover:shadow-[0_18px_40px_rgba(217,179,90,0.12)]"
                    >
                      <div className="relative overflow-hidden p-0 rounded-[8px] border border-[#3a3120]" style={{ aspectRatio: "2/3" }}>
                        {movie.poster ? (
                          <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full" style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #0a0a0a 100%)` }} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                        <div className="absolute bottom-2 left-2 rounded-[5px] border border-[#d9b35a]/60 bg-[#0f0f0f]/80 px-1.5 py-0.5 text-[8px] font-medium tracking-[0.12em] text-[#f5d678] uppercase">
                          {rec.score ? `AI ${Number(rec.score).toFixed(1)}` : "Hot"}
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between gap-2 text-[9px] text-gray-400">
                          <span className="tracking-[0.16em] text-[#d9b35a] uppercase">Rank {i + 1}</span>
                          <span>★ {movie.rating}</span>
                        </div>
                        <div className="truncate text-[13px] font-semibold text-white">{movie.title}</div>
                        <div className="mt-1 text-[10px] text-gray-400">{movie.genre[0]}</div>
                        {rec.why && (
                          <div className="mt-1 line-clamp-2 text-[9px] leading-relaxed text-gray-500">{rec.why}</div>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-5">
              {movies.slice(0, 5).map((movie, i) => (
                <div key={movie.id} className="group relative">
                  <div className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#d9b35a]/60 bg-[#0f0f0f]/90 text-[12px] font-bold text-[#f5d678] shadow-[0_0_18px_rgba(245,214,120,0.22)]">
                    {i + 1}
                  </div>

                  <Link
                    href={`/movies/${movie.id}`}
                    className="block overflow-hidden rounded-[8px] border border-[#2e2a24] bg-[linear-gradient(180deg,#1b1a18,#0f0f0f)] p-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition duration-200 hover:-translate-y-0.5 hover:border-[#d9b35a]/80 hover:shadow-[0_18px_40px_rgba(217,179,90,0.12)]"
                  >
                    <div className="relative overflow-hidden rounded-[6px] border-2 border-[#3a3120]" style={{ aspectRatio: "2/3" }}>
                      {movie.poster ? (
                        <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full" style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #1a1a1a 100%)` }} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                      <div className="absolute bottom-2 left-2 rounded-full border border-[#d9b35a]/60 bg-[#0f0f0f]/80 px-1.5 py-0.5 text-[8px] font-medium tracking-[0.12em] text-[#f5d678] uppercase">
                        {movie.genre[0]}
                      </div>
                    </div>

                    <div className="mt-3 text-center">
                      <div className="mb-1 text-[16px] tracking-[0.2em] text-[#f5d678] uppercase">Top {i + 1}</div>
                      <div className="truncate text-[14px] font-semibold text-white">{movie.title}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-6xl pt-1">
          <div className="mb-3 flex items-center justify-between border-b border-[#2a2a2a] pb-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#f5d678] uppercase" style={{ lineHeight: 1.2 }}>
                Now
              </span>
              <h2 className="text-[17px] font-bold tracking-[0.06em] text-white" style={{ lineHeight: 1.2 }}>
                Showing
              </h2>
            </div>
            <Link href="/now-showing" className="text-[9px] font-medium tracking-[0.14em] text-gray-300 transition-colors hover:text-[#f5d678]">
              MORE
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5" style={{ justifyItems: "center" }}>
            {nowShowingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
