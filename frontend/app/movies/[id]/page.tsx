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
      <div className="min-h-screen bg-[#0f0f0f]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">映画が見つかりませんでした</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/now-showing" className="inline-flex items-center gap-1 text-gray-400 hover:text-white mb-5 text-sm">
          <span>←</span>
        </Link>

        <div className="flex gap-5 mb-8">
          <div className="flex-shrink-0" style={{ width: "140px" }}>
            {movie.poster ? (
              <img src={movie.poster} alt={movie.title} className="w-full rounded object-cover" style={{ aspectRatio: "2/3" }} />
            ) : (
              <div className="w-full rounded" style={{ aspectRatio: "2/3", background: `linear-gradient(160deg, ${movie.posterColor} 0%, #111 100%)` }} />
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-1">
              公開期間：{movie.releaseDate.replace(/-/g, "/")}〜{movie.endDate.replace(/-/g, "/")}
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-3 line-clamp-5">{movie.synopsis}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {movie.genre.map((g) => (
                <span key={g} className="text-sm px-1.5 py-0.5 border border-[#444] text-gray-400 rounded">{g}</span>
              ))}
              <span className="text-sm px-1.5 py-0.5 border border-[#444] text-gray-400 rounded">{movie.rating}</span>
            </div>
            <div className="text-sm text-gray-500 mb-1">声優・キャスト</div>
            <div className="flex flex-wrap gap-1">
              {movie.cast.map((name) => (
                <span key={name} className="text-sm text-gray-400">{name}</span>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-2">監督：{movie.director}　{movie.duration}分</div>
          </div>
        </div>

        <div className="border-t border-[#333] pt-6">
          <Link
            href={`/tickets?movieId=${params.id}`}
            className="inline-block bg-white text-black px-8 py-3 rounded font-medium hover:bg-gray-200 transition-colors"
          >
            チケットを購入する
          </Link>
        </div>
      </main>
    </div>
  );
}
