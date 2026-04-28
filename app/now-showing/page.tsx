import Header from "@/components/Header";
import { MovieCardLarge } from "@/components/MovieCard";
import { movies } from "@/lib/mockData";

export default function NowShowingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-lg font-medium text-white mb-6 pb-2 border-b border-[#333]">
          <span className="text-xs text-gray-400 block mb-1">Now Showing</span>
          上映中
        </h1>

        <div className="grid grid-cols-3 gap-4">
          {movies.map((movie) => (
            <MovieCardLarge key={movie.id} movie={movie} />
          ))}
        </div>
      </main>
    </div>
  );
}
