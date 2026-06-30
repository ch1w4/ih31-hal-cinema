// 映画詳細ページ
// URLの [id] パラメータで対象映画を特定し、上映スケジュールと予約パネルを表示する
//
// 予約フロー（このページ内で行う選択）:
//   1. 地域タブ（現在はUI表示のみ、中部=インデックス3がデフォルトアクティブ）
//   2. 劇場選択（セレクトボックス）
//   3. 日付タブ選択
//   4. 時刻ボタン選択 → 右側に選択内容パネルが出現
//   5. 「席を選択する」ボタン → /tickets?movieId=&date=&time=&screen= へ遷移

"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { movies, mockSchedules } from "@/lib/mockData";

// 地域タブ一覧（現在はUI表示のみで絞り込み機能は未実装）
const regions = ["北海道", "東北", "仙台", "中部", "関西", "中国", "九州", "九州"];
const theaters = ["HALシネマ 名古屋館", "HALシネマ 栄店", "HALシネマ 大須店"];

export default function MovieDetailPage() {
  const params = useParams();
  // IDで映画を検索（存在しない場合は下部でフォールバック表示）
  const movie = movies.find((m) => m.id === params.id);
  // mockSchedules は映画IDをキーとするオブジェクト。未定義のIDは "1" のスケジュールにフォールバック
  const schedules = mockSchedules[params.id as string] || mockSchedules["1"];
  const [selectedDate, setSelectedDate] = useState(schedules[0]?.date ?? "");
  const [selectedTheater, setSelectedTheater] = useState(theaters[0]);
  // 時刻は未選択状態（null）からスタート。選択すると右パネルが表示される
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">
          映画が見つかりませんでした
        </div>
      </div>
    );
  }

  // 選択中の日付に対応するスケジュール（スクリーンと時刻スロットの配列）
  const selectedSchedule = schedules.find((s) => s.date === selectedDate);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 上映中一覧へ戻る矢印ボタン */}
        <Link
          href="/now-showing"
          className="inline-flex items-center gap-1 text-gray-400 hover:text-white mb-5 text-sm"
        >
          <span>←</span>
        </Link>

        {/* 映画情報エリア: ポスター（140px固定幅） + テキスト詳細 */}
        <div className="flex gap-5 mb-6">
          <div className="flex-shrink-0" style={{ width: "140px" }}>
            {movie.poster ? (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded object-cover"
                style={{ aspectRatio: "2/3" }}
              />
            ) : (
              <div
                className="w-full rounded"
                style={{
                  aspectRatio: "2/3",
                  background: `linear-gradient(160deg, ${movie.posterColor} 0%, #111 100%)`,
                }}
              />
            )}
          </div>
          <div className="flex-1">
            {/* 公開期間（例: "2024-10-01" → "2024/10/01"）*/}
            <div className="text-sm text-gray-400 mb-1">
              公開期間：{movie.releaseDate.replace(/-/g, "/")}〜{movie.endDate.replace(/-/g, "/")}
            </div>
            {/* あらすじ（最大5行）*/}
            <p className="text-sm text-gray-400 leading-relaxed mb-3 line-clamp-5">
              {movie.synopsis}
            </p>
            {/* ジャンルとレーティングのバッジ */}
            <div className="flex flex-wrap gap-1 mb-3">
              {movie.genre.map((g) => (
                <span key={g} className="text-sm px-1.5 py-0.5 border border-[#444] text-gray-400 rounded">
                  {g}
                </span>
              ))}
              <span className="text-sm px-1.5 py-0.5 border border-[#444] text-gray-400 rounded">
                {movie.rating}
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-1">声優・キャスト</div>
            <div className="flex flex-wrap gap-1">
              {movie.cast.map((name) => (
                <span key={name} className="text-sm text-gray-400">{name}</span>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              監督：{movie.director}　{movie.duration}分
            </div>
          </div>
        </div>

        {/* スケジュール選択セクション */}
        <div className="border-t border-[#333] pt-4">
          <div className="text-sm text-gray-400 mb-3">上映スケジュール</div>

          {/* 地域タブ: インデックス3（中部）がデフォルトのアクティブタブ
              現在はスタイルのみで絞り込み機能は未実装 */}
          <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
            {regions.map((r, i) => (
              <button
                key={i}
                className={`flex-shrink-0 text-sm pb-1 border-b-2 transition-colors ${
                  i === 3
                    ? "border-white text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* 劇場選択セレクトボックス */}
          <div className="mb-4">
            <select
              value={selectedTheater}
              onChange={(e) => setSelectedTheater(e.target.value)}
              className="bg-[#1a1a1a] border border-[#444] text-white text-base rounded px-4 py-3 w-full max-w-xs focus:outline-none"
            >
              {theaters.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* 日付タブ: 選択するとタイムスロットが更新され、時刻選択もリセットされる */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {schedules.map((s) => (
              <button
                key={s.date}
                onClick={() => { setSelectedDate(s.date); setSelectedTime(null); }}
                className={`flex-shrink-0 px-5 py-3 rounded text-base transition-colors border ${
                  s.date === selectedDate
                    ? "border-white text-white"
                    : "border-[#444] text-gray-400 hover:border-[#777]"
                }`}
              >
                {s.date}
              </button>
            ))}
          </div>

          {/* タイムスロット + 予約パネル（選択日程がある場合のみ表示）*/}
          {selectedSchedule && (
            <div className="flex gap-6">
              {/* 左: スクリーン別のタイムスロットボタン群 */}
              <div className="flex-1">
                {selectedSchedule.slots.map((slot) => (
                  <div key={slot.screen} className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">{slot.screen}</div>
                    <div className="flex flex-wrap gap-2">
                      {slot.times.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-5 py-3 rounded text-base transition-colors border ${
                            selectedTime === time
                              ? "border-white text-white bg-[#2a2a2a]"
                              : "border-[#555] text-gray-400 hover:border-white hover:text-white"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 右: 選択内容確認パネル（時刻が選択されたときのみ表示）*/}
              {selectedTime && (
                <div className="w-64 flex-shrink-0 border border-[#333] rounded p-4 bg-[#1a1a1a] text-sm self-start">
                  <div className="text-gray-400 text-xs mb-3 pb-2 border-b border-[#333]">選択内容</div>
                  <div className="space-y-2 mb-4">
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-14 flex-shrink-0">作品</span>
                      <span className="text-gray-200">{movie.title}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-14 flex-shrink-0">日時</span>
                      <span className="text-gray-200">{selectedDate}　{selectedTime}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-14 flex-shrink-0">劇場</span>
                      <span className="text-gray-200">{selectedTheater}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-14 flex-shrink-0">SCREEN</span>
                      {/* 選択時刻がどのスクリーンに属するかを逆引きして表示 */}
                      <span className="text-gray-200">{selectedSchedule.slots.find((s) => s.times.includes(selectedTime))?.screen}</span>
                    </div>
                  </div>
                  {/* 席選択ページへ: 必要なパラメータをすべてクエリに乗せて渡す */}
                  <Link
                    href={`/tickets?movieId=${params.id}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}&screen=${encodeURIComponent(selectedSchedule.slots.find((s) => s.times.includes(selectedTime))?.screen ?? "")}`}
                    className="block text-center bg-white text-black py-3 rounded font-medium hover:bg-gray-200 transition-colors"
                  >
                    席を選択する
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
