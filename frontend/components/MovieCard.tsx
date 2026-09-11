// 映画一枚のサムネイルカードコンポーネント
// ホームページの「上映中の映画」グリッドで使用される純粋な表示コンポーネント
// 状態は持たず、props として Movie オブジェクトだけを受け取る

import Link from "next/link";
import { Movie } from "@/lib/mockData";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group block overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#111111] shadow-[0_12px_30px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-[#d9b35a]/80 hover:shadow-[0_18px_32px_rgba(217,179,90,0.12)]"
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3 / 4" }}>
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #0a0a0a 100%)` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
      </div>

      <div className="space-y-2 bg-[#111111] px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-sm font-semibold text-white">{movie.title}</div>
          <span className="rounded-full border border-[#d9b35a]/40 bg-[#d9b35a]/10 px-1.5 py-0.5 text-[9px] font-medium tracking-[0.12em] text-[#f5d678]">
            {movie.rating}
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-gray-400">
          <span>{movie.genre[0]}</span>
          <span className="text-[#f5d678]">★★★★★</span>
        </div>
      </div>
    </Link>
  );
}
