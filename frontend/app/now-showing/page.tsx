"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/lib/mockData";
import { fetchMovies } from "@/lib/api";

export default function NowShowingPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies().then((all) => {
      setMovies(all);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <main className="mx-auto max-w-[1280px] px-4 pb-12 pt-6 md:px-8">
        <div className="mb-4 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#d9b35a] uppercase" style={{ lineHeight: 1.3 }}>
          <span>ホーム</span>
          <span>/</span>
          <span>HOME</span>
        </div>

        <div className="max-w-6xl pt-2">
          <div className="mb-4 flex items-center justify-between border-b border-[#2a2a2a] pb-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#f5d678] uppercase" style={{ lineHeight: 1.2 }}>
                Now
              </span>
              <h1 className="text-[19px] font-bold tracking-[0.06em] text-white" style={{ lineHeight: 1.2 }}>
                Showing
              </h1>
            </div>
            <span className="text-[10px] font-medium tracking-[0.14em] text-gray-300">MORE</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-gray-400">読み込み中...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5" style={{ justifyItems: "center" }}>
              {movies.slice(0, 10).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
