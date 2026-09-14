// 映画一枚のサムネイルカードコンポーネント
// ホームページの「上映中の映画」グリッドで使用される純粋な表示コンポーネント
// 状態は持たず、props として Movie オブジェクトだけを受け取る

import Link from "next/link";
import { Movie } from "@/lib/mockData";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="group block w-full max-w-[250px] overflow-hidden rounded-[4px] border border-[#2a2a2a] bg-[#111111] shadow-[0_12px_30px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-[#d9b35a]/80 hover:shadow-[0_18px_32px_rgba(217,179,90,0.12)]">
      <Link href={`/movies/${movie.id}`} className="block overflow-hidden" aria-label={`${movie.title}の詳細を見る`}>
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3 / 4.1" }}>
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={movie.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #0a0a0a 100%)` }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-2.5">
            <div className="mb-1 flex items-center justify-between gap-2 text-white">
              <div className="text-[13px] font-bold tracking-[0.06em] text-white">{movie.title}</div>
              <span className="rounded-full border border-[#d9b35a]/40 bg-[#d9b35a]/10 px-1.5 py-0.5 text-[9px] font-medium tracking-[0.12em] text-[#f5d678]">
                {movie.rating}
              </span>
            </div>

            <div className="mb-2 flex items-center justify-between text-[10px] text-gray-300">
              <span>{movie.genre[0]}</span>
              
            </div>
          </div>
        </div>
      </Link>

      <div className="flex gap-2 p-2.5 pt-0">
        <Link
          href={`/tickets?movieId=${movie.id}`}
          className="flex-1 rounded-sm bg-[#d9b35a] px-2 py-1.5 text-center text-[10px] font-bold text-[#1b1b1b]"
        >
          チケット購入
        </Link>
        <Link
          href={`/movies/${movie.id}`}
          className="flex-1 rounded-sm border border-[#d9b35a]/60 bg-black/30 px-2 py-1.5 text-center text-[10px] font-bold text-white"
        >
          詳細を見る
        </Link>
      </div>
    </div>
  );
}
