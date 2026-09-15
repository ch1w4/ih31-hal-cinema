"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { Movie, RecommendedMovie } from "@/lib/mockData";
import { fetchMovies } from "@/lib/api";

export default function NowShowingPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<RecommendedMovie[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies().then((all) => {
      setMovies(all);
      try {
        const stored = localStorage.getItem("recommendedMovies");
        if (stored) {
          const raw: { id: string; score: number; why: string }[] = JSON.parse(stored);
          const converted: RecommendedMovie[] = raw
            .map((item): RecommendedMovie | null => {
              const movie = all.find((m) => m.id === item.id);
              if (!movie) return null;
              return {
                id: movie.id,
                title: movie.title,
                genre: movie.genre,
                posterColor: movie.posterColor,
                poster: movie.poster,
                score: item.score,
                why: item.why,
              };
            })
            .filter((m): m is RecommendedMovie => m !== null);
          setRecommendedMovies(converted);
        }
        const user = localStorage.getItem("userInfo");
        if (user) setUserInfo(JSON.parse(user));
      } catch {}
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <main className="mx-auto max-w-[1280px] px-4 pb-12 pt-6 md:px-8">

        {recommendedMovies.length > 0 && !loading && (
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between border-b border-[#2a2a2a] pb-3">
              <div className="flex items-center gap-3">
                <span className="text-[19px] font-bold tracking-[0.2em] text-[#f5d678] uppercase" style={{ lineHeight: 1.2 }}>
                  Recommended
                </span>
                <h2 className="text-[15px] text-gray-400" style={{ lineHeight: 1.2 }}>
                  {userInfo?.name ? `${userInfo.name}さんへのおすすめ` : "あなたへのおすすめ"}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {recommendedMovies.slice(0, 4).map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  className="group flex gap-3 rounded-[0px] border-2 border-[#2a2a2a] bg-[#111111] p-3 transition-colors hover:border-[#d9b35a]/80"
                >
                  <div className="w-20 shrink-0 overflow-hidden" style={{ aspectRatio: "2/3" }}>
                    {movie.poster ? (
                      <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full" style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #1a1a1a 100%)` }} />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <h3 className="truncate text-sm font-medium text-white group-hover:text-[#f5d678]">{movie.title}</h3>
                    <p className="mb-1 text-xs text-gray-500">{movie.genre.join("・")}</p>
                    {movie.why && (
                      <p className="text-xs leading-snug text-gray-400">{movie.why}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="max-w-6xl pt-2">
          <div className="mb-4 flex items-center justify-between border-b border-[#2a2a2a] pb-3">
            <div className="flex items-center gap-3">
              <span className="text-[19px] font-bold tracking-[0.2em] text-[#f5d678] uppercase" style={{ lineHeight: 1.2 }}>
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
