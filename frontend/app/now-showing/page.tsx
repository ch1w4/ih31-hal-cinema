// 上映中の映画一覧ページ
// 全映画を3列グリッドで4グループに分けて表示する
//
// AI推薦がある場合の追加UI:
//   - 右端に固定パネル（fixed right-0）を表示してAIランキングTOP10をリスト表示
//   - ページ上部にも推薦映画TOP4を2:3グリッドで表示
//
// データフロー:
//   localStorage.recommendedMovies → raw (id+score+why) → Movie オブジェクトに変換
//   localStorage.userInfo → ユーザー名を取得して見出しに表示

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { movies, Movie } from "@/lib/mockData";

export default function NowShowingPage() {
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // 右サイドパネルの表示/非表示（×ボタンで閉じることができる）
  const [showPanel, setShowPanel] = useState(true);

  useEffect(() => {
    try {
      // AI推薦データ: { id, score, why }[] 形式を Movie[] に変換
      const stored = localStorage.getItem("recommendedMovies");
      if (stored) {
        const raw = JSON.parse(stored);
        const converted: Movie[] = raw
          .map((item: any) => movies.find((m) => m.id === item.id) || null)
          .filter(Boolean);
        setRecommendedMovies(converted);
      }
      const user = localStorage.getItem("userInfo");
      if (user) setUserInfo(JSON.parse(user));
    } catch {}
    setLoading(false);
  }, []);

  // 全映画(12本)を3列グリッドで4行に分けて表示するためのグループ分け
  const group1 = movies.slice(0, 3);
  const group2 = movies.slice(3, 6);
  const group3 = movies.slice(6, 9);
  const group4 = movies.slice(9, 12);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      {/* AIおすすめサイドパネル（推薦映画がある場合かつパネルが開いている場合のみ表示）
          fixed right-0 で画面右端に固定表示。メインコンテンツとは独立してスクロール可能 */}
      {recommendedMovies.length > 0 && showPanel && (
        <div className="fixed right-0 top-0 h-screen w-80 bg-[#1a1a1a] border-l border-[#333] shadow-2xl z-50 overflow-y-auto">
          <div className="sticky top-0 bg-[#0f0f0f] border-b border-[#333] p-4 flex items-center justify-between">
            <h2 className="text-white font-medium text-sm">AIによるおすすめ</h2>
            {/* ×ボタンでパネルを閉じる（ページ離脱まで再表示しない） */}
            <button
              onClick={() => setShowPanel(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* AIランキングTOP10（インデックス0が最もおすすめ）*/}
          <div className="p-4 space-y-4">
            {recommendedMovies.slice(0, 10).map((movie, idx) => {
              const rec = movie as any;
              return (
                <Link key={movie.id} href={`/movies/${movie.id}`} className="block group">
                  <div className="flex gap-3">
                    <div className="w-16 h-24 rounded flex-shrink-0 overflow-hidden">
                      {movie.poster ? (
                        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full" style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #0a0a0a 100%)` }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-400 mb-1">#{idx + 1}</div>
                      <h3 className="text-sm text-white font-medium truncate group-hover:text-gray-200">{movie.title}</h3>
                      {/* AIスコアがある場合は赤バッジで表示 */}
                      {rec.score !== undefined && (
                        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold mt-1 inline-block">
                          {rec.score}点
                        </span>
                      )}
                      {/* AI推薦理由（2行切り詰め）*/}
                      {rec.why && (
                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{rec.why}</p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* AIおすすめ映画TOP4（ページ上部グリッド。推薦ありかつ読み込み完了後のみ表示）*/}
        {recommendedMovies.length > 0 && !loading && (
          <section className="mb-10">
            <h1 className="text-lg font-medium text-white mb-4 pb-2 border-b border-[#333]">
              <span className="text-xs text-gray-400 block mb-1">Recommended For You</span>
              {/* ユーザー名がある場合は「○○さんへのおすすめ」、なければ汎用表示 */}
              {userInfo?.name ? `${userInfo.name}さんへのおすすめ` : "あなたへのおすすめ"}
            </h1>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {recommendedMovies.slice(0, 4).map((movie) => (
                <Link key={movie.id} href={`/movies/${movie.id}`} className="group cursor-pointer">
                  <div className="w-full rounded-lg mb-2 overflow-hidden" style={{ aspectRatio: "2/3" }}>
                    {movie.poster ? (
                      <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                    ) : (
                      <div className="w-full h-full" style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #1a1a1a 100%)` }} />
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-white group-hover:text-gray-200 truncate">{movie.title}</h3>
                  <p className="text-xs text-gray-500">{movie.genre.join("・")}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <h1 className="text-xl font-medium text-white mb-6 pb-2 border-b border-[#333]">
          <span className="text-sm text-gray-400 block mb-1">Now Showing</span>
          上映中
        </h1>

        {/* 全映画を3列×4グループのグリッドで表示 */}
        {[group1, group2, group3, group4].map((group, si) => (
          <div key={si} className="mb-8">
            <div className="grid grid-cols-3 gap-4">
              {group.map((movie) => (
                <div key={movie.id} className="flex flex-col">
                  <Link
                    href={`/movies/${movie.id}`}
                    className="w-full rounded-sm mb-2 block overflow-hidden hover:opacity-75 transition-opacity"
                    style={{ aspectRatio: "2/3" }}
                  >
                    {movie.poster ? (
                      <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #1a1a1a 100%)` }} />
                    )}
                  </Link>
                  <div className="text-sm text-gray-300 mb-1 truncate">{movie.title}</div>
                  {/* ジャンルタグ（複数ある場合は横並び・折り返し）*/}
                  <div className="flex gap-1 flex-wrap">
                    {movie.genre.map((g, i) => (
                      <span key={`${g}-${i}`} className="text-sm px-1.5 py-0.5 border border-[#444] text-gray-500 rounded">{g}</span>
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
