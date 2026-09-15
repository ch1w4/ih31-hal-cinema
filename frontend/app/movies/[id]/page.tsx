"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { Movie } from "@/lib/mockData";
import { fetchMovieById } from "@/lib/api";
import { useEffect, useState } from "react";

export default function MovieDetailPage() {
  const params = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetchMovieById(String(params.id)).then((m) => {
      if (m) setMovie(m);
      else setNotFound(true);
    });
  }, [params.id]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center text-gray-400">映画が見つかりませんでした</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <Link
          href="/now-showing"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-[#f5d678]"
        >
          <span aria-hidden="true">←</span>
          <span>上映中作品一覧</span>
        </Link>

        <div className="overflow-hidden rounded-[20px] border border-[#2a2a2a] bg-[#111111]/80 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-[2px]">
          <div
            className="relative px-4 pb-8 pt-6 md:px-8"
            style={{
              backgroundImage: movie.poster
                ? `linear-gradient(90deg, rgba(10,10,10,0.82), rgba(10,10,10,0.7)), url(${movie.poster})`
                : `linear-gradient(160deg, ${movie.posterColor} 0%, #0a0a0a 100%)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="w-full max-w-[220px] shrink-0 self-end">
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full rounded-[14px] border border-[#3a3a3a] object-cover shadow-[0_18px_30px_rgba(0,0,0,0.3)]"
                    style={{ aspectRatio: "2 / 3" }}
                  />
                ) : (
                  <div
                    className="w-full rounded-[14px] border border-[#3a3a3a]"
                    style={{ aspectRatio: "2 / 3", background: `linear-gradient(160deg, ${movie.posterColor} 0%, #111 100%)` }}
                  />
                )}
              </div>

              <div className="flex-1 pt-2">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#d9b35a]/40 bg-[#d9b35a]/10 px-2 py-1 text-[10px] font-medium tracking-[0.16em] text-[#f5d678]">
                    {movie.rating}
                  </span>
                  <span className="text-[11px] tracking-[0.18em] text-gray-400">{movie.duration}分</span>
                </div>

                <h1 className="mb-1 text-3xl font-bold tracking-[0.06em] text-white md:text-4xl">
                  {movie.title}
                </h1>
                <p className="mb-4 text-sm tracking-[0.2em] text-gray-400">{movie.titleEn}</p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {movie.genre.map((g) => (
                    <span key={g} className="rounded-full border border-[#444] bg-[#171717] px-2.5 py-1 text-[11px] text-gray-300">
                      {g}
                    </span>
                  ))}
                </div>

                <div className="mb-4 grid gap-2 text-sm text-gray-300 md:grid-cols-2">
                  <div>
                    <span className="mr-2 text-gray-500">公開期間</span>
                    {movie.releaseDate.replace(/-/g, "/")}〜{movie.endDate.replace(/-/g, "/")}
                  </div>
                  <div>
                    <span className="mr-2 text-gray-500">監督</span>
                    {movie.director}
                  </div>
                </div>

                <p className="max-w-2xl text-sm leading-7 text-gray-300">{movie.synopsis}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[18px] border border-[#2a2a2a] bg-[#111111] p-6">
            <h2 className="mb-4 text-lg font-bold tracking-[0.18em] text-[#f5d678]">CAST</h2>
            <div className="flex flex-wrap gap-2">
              {movie.cast.map((name) => (
                <span key={name} className="rounded-full border border-[#3a3a3a] bg-[#171717] px-3 py-1.5 text-sm text-gray-300">
                  {name}
                </span>
              ))}
            </div>
          </section>

          <div className="rounded-[18px] border border-[#2a2a2a] bg-[#111111] p-6">
            <h2 className="mb-4 text-lg font-bold tracking-[0.18em] text-[#f5d678]">購入</h2>
            <p className="mb-5 text-sm leading-6 text-gray-300">
              この作品の上映スケジュールを確認して、チケットを予約できます。
            </p>
            <Link
              href={`/tickets?movieId=${params.id}`}
              className="inline-flex w-full items-center justify-center rounded-sm bg-[#d9b35a] px-5 py-3 text-sm font-bold text-[#1b1b1b] transition-colors duration-200 hover:bg-[#f2d77b] hover:text-[#111111]"
            >
              チケットを購入する
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
