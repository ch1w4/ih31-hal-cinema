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
