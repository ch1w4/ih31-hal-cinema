import Header from "@/components/Header";
import Link from "next/link";
import { fetchComingSoon } from "@/lib/api";

export default async function ComingSoonPage() {
  const movies = await fetchComingSoon();

  const byMonth = movies.reduce<Record<string, typeof movies>>((acc, m) => {
    const label = m.releaseDate
      ? `${m.releaseDate.slice(0, 7).replace("-", "年")}月公開`
      : "近日公開";
    acc[label] = [...(acc[label] ?? []), m];
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <main className="mx-auto max-w-[1280px] px-4 pb-12 pt-6 md:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="text-[19px] font-bold tracking-[0.2em] text-[#f5d678] uppercase" style={{ lineHeight: 1.2 }}>
            Coming
          </span>
          <h1 className="text-[19px] font-bold tracking-[0.06em] text-white" style={{ lineHeight: 1.2 }}>
            Soon
          </h1>
        </div>

        {Object.entries(byMonth).map(([label, films]) => (
          <section key={label} className="mb-12">
            <div className="mb-5 flex items-center justify-between border-b border-[#2a2a2a] pb-3">
              <div className="text-[16px] font-medium tracking-[0.18em] text-[#d9b35a] uppercase">{label}</div>
              <div className="text-[14px] tracking-[0.18em] text-gray-500">NEW RELEASE</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {films.map((movie) => (
                <div key={movie.id} className="group flex flex-col overflow-hidden rounded-[3px] border border-[#2a2a2a] bg-[#111111] shadow-[0_12px_32px_rgba(0,0,0,0.28)] transition duration-300 hover:border-[#d9b35a]/70 hover:shadow-[0_18px_40px_rgba(217,179,90,0.08)]">
                  <div className="border-b border-[#2a2a2a] px-3 py-3">
                    <div className="flex items-end gap-2 text-left">
                      <div className="text-[22px] font-bold leading-none tracking-[0.08em] text-white">
                        {movie.releaseDate.replace(/-/g, "/").slice(5).replace("/", "月")}
                      </div>
                      <div className="pb-[2px] text-[11px] tracking-[0.14em] text-gray-400">日公開</div>
                    </div>
                  </div>

                  <Link href={`/coming-soon/${movie.id}`} className="block overflow-hidden" aria-label={`${movie.title}の詳細を見る`}>
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "2 / 3" }}>
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #1a1a1a 100%)` }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/10 to-transparent" />
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-3 pt-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1 truncate text-[14px] font-bold tracking-[0.04em] text-white">{movie.title}</div>
                      <span className="rounded-full border border-[#d9b35a]/40 bg-[#d9b35a]/10 px-1.5 py-0.5 text-[9px] font-medium tracking-[0.12em] text-[#f5d678]">
                        {movie.rating}
                      </span>
                    </div>

                    <div className="mb-2 flex flex-wrap gap-1">
                      {movie.genre.slice(0, 2).map((g) => (
                        <span key={g} className="rounded-full border border-[#444] bg-[#171717] px-1.5 py-0.5 text-[10px] text-gray-400">
                          {g}
                        </span>
                      ))}
                    </div>

                    <p className="mb-3 line-clamp-3 text-[12px] leading-5 text-gray-400">{movie.synopsis}</p>

                    <Link
                      href={`/coming-soon/${movie.id}`}
                      className="mt-auto inline-flex w-full items-center justify-center rounded-sm border border-[#d9b35a]/60 bg-black/30 px-3 py-2 text-[10px] font-bold tracking-[0.12em] text-[#f5d678] transition-colors duration-200 hover:border-[#d9b35a] hover:bg-[#d9b35a] hover:text-[#111111]"
                    >
                      詳細を見る
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {movies.length === 0 && (
          <div className="py-16 text-center text-gray-500">上映予定作品はありません</div>
        )}
      </main>
    </div>
  );
}
