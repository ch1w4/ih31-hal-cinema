import Link from "next/link";
import { Movie } from "@/lib/mockData";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.id}`} className="block movie-card">
      {/* Poster placeholder */}
      <div
        className="w-full"
        style={{
          aspectRatio: "2/3",
          background: `linear-gradient(160deg, ${movie.posterColor} 0%, #0a0a0a 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "12px",
        }}
      >
        {movie.ranking && (
          <div
            className="text-4xl font-bold opacity-20 absolute"
            style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
          >
            {movie.ranking}
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-2 bg-[#1a1a1a]">
        <div className="text-xs text-white font-medium truncate">{movie.title}</div>
        <div className="text-[10px] text-gray-400 mt-0.5">
          {movie.genre[0]} · {movie.rating}
        </div>
      </div>
    </Link>
  );
}

export function MovieCardLarge({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.id}`} className="block movie-card">
      <div
        className="w-full relative"
        style={{
          aspectRatio: "2/3",
          background: `linear-gradient(160deg, ${movie.posterColor} 0%, #111 100%)`,
          display: "flex",
          alignItems: "flex-end",
          padding: "12px",
        }}
      >
        <div className="w-full">
          <div className="text-white text-sm font-bold leading-tight">{movie.title}</div>
          <div className="text-gray-300 text-xs mt-1">{movie.genre.join(" / ")}</div>
          <div className="text-gray-400 text-[10px] mt-1">{movie.releaseDate.replace(/-/g, ".")} 公開</div>
        </div>
      </div>
    </Link>
  );
}
