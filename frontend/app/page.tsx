// ホームページ
// トップページの全要素を組み合わせて表示する:
//   - ヒーロースライダー（キャンペーンバナー）
//   - 会員ログイン/新規登録ボタン
//   - 映画ランキング or AIおすすめ（localStorage の recommendedMovies に応じて切り替わる）
//   - 上映中の映画グリッド（先頭8本）

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import MovieCard from "@/components/MovieCard";
import { movies, Movie } from "@/lib/mockData";

export default function HomePage() {
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // localStorage の recommendedMovies は /auth/success でGoogle OAuth後にAIが生成したリスト
    // 各要素は { id, score, why } 形式なので、id をキーに movies 配列から Movie オブジェクトへ変換する
    try {
      setIsLoggedIn(!!localStorage.getItem("userInfo"));
      const stored = localStorage.getItem("recommendedMovies");
      if (stored) {
        const raw = JSON.parse(stored);
        const converted = raw
          .map((item: any) => {
            const movie = movies.find((m) => m.id === item.id);
            return movie ? { ...movie, score: item.score, why: item.why } : null;
          })
          .filter(Boolean) as Movie[];
        setRecommendedMovies(converted);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  // AI推薦が存在し読み込み完了している場合に true
  // ランキングセクションとタイトル表示の分岐条件として使用
  const hasRecs = recommendedMovies.length > 0 && !loading;
  // ホームに表示する上映中映画は先頭8本のみ（すべては /now-showing へ）
  const nowShowingMovies = movies.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <HeroSlider />

      {/* 会員ログイン/新規登録ボタン（ログアウト中のみ表示） */}
      {!isLoggedIn && (
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-stretch border border-[#333] rounded overflow-hidden w-fit">
            <div className="px-4 py-2.5 text-sm text-gray-300 bg-[#1a1a1a] border-r border-[#333] whitespace-nowrap">
              HAL CINEMA会員
            </div>
            <Link href="/login" className="px-6 py-2.5 text-sm text-white bg-[#555] hover:bg-[#666] transition-colors border-r border-[#333]">
              ログイン
            </Link>
            <Link href="/register" className="px-6 py-2.5 text-sm text-white hover:bg-[#222] transition-colors">
              新規登録
            </Link>
          </div>
        </div>
      )}

      {/* 映画ランキング / AIおすすめセクション
          hasRecs が true のとき: AI推薦リストを「あなたにオススメ」として表示
          hasRecs が false のとき: 全映画の先頭10本を「映画ランキング」として表示 */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="border border-[#333] rounded overflow-hidden">
          <div className="px-4 py-3 bg-[#1a1a1a] border-b border-[#333] text-xl font-medium text-gray-300">
            {hasRecs ? "あなたにオススメの映画" : "映画ランキング"}
          </div>

          <div className="placeholder-box" style={{ overflow: "visible" }}>
            {hasRecs ? (
              /* AIおすすめ: MovieCard と同じスタイル */
              <div className="p-4 grid grid-cols-4 gap-3">
                {recommendedMovies.slice(0, 4).map((movie) => {
                  const rec = movie as any;
                  return (
                    <div key={movie.id} className="group relative">
                      <Link href={`/movies/${movie.id}`} className="block movie-card">
                        <div className="w-full relative" style={{ aspectRatio: "2/3" }}>
                          {movie.poster ? (
                            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full" style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #0a0a0a 100%)` }} />
                          )}
                          {/* AI推薦バッジ */}
                          <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            AI推薦
                          </div>
                        </div>
                        <div className="p-2 bg-[#1a1a1a]">
                          <div className="text-xs text-white font-medium truncate">{movie.title}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{movie.genre[0]} · {movie.rating}</div>
                          {/* 推薦理由 */}
                          {rec.why && (
                            <div className="text-[10px] text-gray-500 mt-1 line-clamp-2">{rec.why}</div>
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ランキング: 従来の5列レイアウト */
              <div className="p-6 grid grid-cols-5 gap-3">
                {movies.slice(0, 5).map((movie, i) => (
                  <div key={movie.id} className="flex flex-col items-center gap-1">
                    <div className="text-sm font-bold text-gray-600">{i + 1}</div>
                    <Link href={`/movies/${movie.id}`} className="w-full block transition-[transform,opacity] duration-200 hover:scale-[1.03] hover:opacity-90">
                      <div className="w-full rounded overflow-hidden" style={{ aspectRatio: "2/3" }}>
                        {movie.poster ? (
                          <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full" style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #1a1a1a 100%)` }} />
                        )}
                      </div>
                    </Link>
                    <div className="text-xs text-gray-600 text-center truncate w-full">{movie.title}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 上映中の映画グリッド（先頭8本のみ。全部見るボタンで /now-showing へ） */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl text-white font-medium">上映中の映画</h2>
          <Link href="/now-showing" className="text-sm text-gray-400 hover:text-white">
            すべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {nowShowingMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      <div className="py-8" />
    </div>
  );
}
