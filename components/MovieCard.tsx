import Link from "next/link";
import { Movie } from "@/lib/mockData";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.id}`} className="block movie-card">
      <div className="w-full relative" style={{ aspectRatio: "2/3" }}>
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
      <div className="w-full relative" style={{ aspectRatio: "2/3" }}>
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #111 100%)` }}
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <div className="text-white text-sm font-bold leading-tight">{movie.title}</div>
          <div className="text-gray-300 text-xs mt-1">{movie.genre.join(" / ")}</div>
          <div className="text-gray-400 text-[10px] mt-1">{movie.releaseDate.replace(/-/g, ".")} 公開</div>
        </div>
      </div>
    </Link>
  );
}
