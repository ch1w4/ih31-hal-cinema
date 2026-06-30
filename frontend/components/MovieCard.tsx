// 映画一枚のサムネイルカードコンポーネント
// ホームページの「上映中の映画」グリッドで使用される純粋な表示コンポーネント
// 状態は持たず、props として Movie オブジェクトだけを受け取る

import Link from "next/link";
import { Movie } from "@/lib/mockData";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    // カード全体をリンクにして /movies/[id] へ遷移
    <Link href={`/movies/${movie.id}`} className="block movie-card">
      {/* 2:3 のアスペクト比でポスターサイズを維持 */}
      <div className="w-full relative" style={{ aspectRatio: "2/3" }}>
        {/* posterが文字列（URLまたはパス）のときは<img>、なければposterColorでグラデーション */}
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #0a0a0a 100%)` }}
          />
        )}
      </div>
      {/* タイトルとジャンル・レーティングのキャプション */}
      <div className="p-2 bg-[#1a1a1a]">
        <div className="text-xs text-white font-medium truncate">{movie.title}</div>
        <div className="text-[10px] text-gray-400 mt-0.5">
          {movie.genre[0]} · {movie.rating}
        </div>
      </div>
    </Link>
  );
}
