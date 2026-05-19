import Header from "@/components/Header";
import Link from "next/link";
import { movies } from "@/lib/mockData";

export default function NowShowingPage() {
  const group1 = movies.slice(0, 3);
  const group2 = movies.slice(3, 6);
  const group3 = movies.slice(6, 9);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-xl font-medium text-white mb-6 pb-2 border-b border-[#333]">
          <span className="text-sm text-gray-400 block mb-1">Now Showing</span>
          上映中
        </h1>

        {[
          { label: `公開期間：${group1[0].releaseDate.replace(/-/g,"/")}〜${group1[0].endDate.replace(/-/g,"/")}`, films: group1 },
          { label: `公開期間：${group2[0].releaseDate.replace(/-/g,"/")}〜${group2[0].endDate.replace(/-/g,"/")}`, films: group2 },
          { label: "", films: group3 },
        ].map((section, si) => (
          <div key={si} className="mb-8">
            {section.label && (
              <div className="text-sm text-gray-400 mb-1">{section.label}</div>
            )}
            <div className="grid grid-cols-3 gap-4">
              {section.films.map((movie) => (
                <div key={movie.id} className="flex flex-col">
                  <Link
                    href={`/movies/${movie.id}`}
                    className="w-full rounded-sm mb-2 block hover:opacity-75 transition-opacity"
                    style={{
                      aspectRatio: "2/3",
                      background: `linear-gradient(160deg, ${movie.posterColor} 0%, #1a1a1a 100%)`,
                    }}
                  />
                  <div className="text-sm text-gray-300 mb-1 truncate">{movie.title}</div>
                  <div className="flex gap-1 flex-wrap mb-2">
                    {movie.genre.map((g) => (
                      <span key={g} className="text-sm px-1.5 py-0.5 border border-[#444] text-gray-500 rounded">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
