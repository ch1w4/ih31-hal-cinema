"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { movies, mockSchedules } from "@/lib/mockData";

const regions = ["北海道", "東北", "仙台", "中部", "関西", "中国", "九州", "九州"];
const theaters = ["HALシネマ 名古屋館", "HALシネマ 栄店", "HALシネマ 大須店"];

export default function MovieDetailPage() {
  const params = useParams();
  const movie = movies.find((m) => m.id === params.id);
  const schedules = mockSchedules[params.id as string] || mockSchedules["1"];
  const [selectedDate, setSelectedDate] = useState(schedules[0]?.date ?? "");
  const [selectedTheater, setSelectedTheater] = useState(theaters[0]);
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

  const selectedSchedule = schedules.find((s) => s.date === selectedDate);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Back */}
        <Link
          href="/now-showing"
          className="inline-flex items-center gap-1 text-gray-400 hover:text-white mb-5 text-sm"
        >
          <span>←</span>
        </Link>

        {/* Movie Info */}
        <div className="flex gap-5 mb-6">
          <div className="flex-shrink-0">
            <div
              className="rounded"
              style={{
                width: "140px",
                aspectRatio: "2/3",
                background: `linear-gradient(160deg, ${movie.posterColor} 0%, #111 100%)`,
              }}
            />
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-400 mb-1">
              公開期間：{movie.releaseDate.replace(/-/g, "/")}〜{movie.endDate.replace(/-/g, "/")}
            </div>
            <div className="text-xs text-gray-500 mb-2">カラタ探し</div>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-3 line-clamp-5">
              {movie.synopsis}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {movie.genre.map((g) => (
                <span key={g} className="text-[9px] px-1.5 py-0.5 border border-[#444] text-gray-400 rounded">
                  {g}
                </span>
              ))}
              <span className="text-[9px] px-1.5 py-0.5 border border-[#444] text-gray-400 rounded">
                {movie.rating}
              </span>
            </div>
            <div className="text-[10px] text-gray-500 mb-1">声優・キャスト</div>
            <div className="flex flex-wrap gap-1">
              {movie.cast.map((name) => (
                <span key={name} className="text-[10px] text-gray-400">{name}</span>
              ))}
            </div>
            <div className="text-[10px] text-gray-500 mt-2">
              監督：{movie.director}　{movie.duration}分
            </div>
          </div>
        </div>

        {/* Schedule section */}
        <div className="border-t border-[#333] pt-4">
          <div className="text-xs text-gray-400 mb-3">上映スケジュール</div>

          {/* Region tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
            {regions.map((r, i) => (
              <button
                key={i}
                className={`flex-shrink-0 text-xs pb-1 border-b-2 transition-colors ${
                  i === 2
                    ? "border-white text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Theater select */}
          <div className="mb-4">
            <select
              value={selectedTheater}
              onChange={(e) => setSelectedTheater(e.target.value)}
              className="bg-[#1a1a1a] border border-[#444] text-white text-xs rounded px-3 py-2 w-full max-w-xs focus:outline-none"
            >
              {theaters.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Date tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {schedules.map((s) => (
              <button
                key={s.date}
                onClick={() => { setSelectedDate(s.date); setSelectedTime(null); }}
                className={`flex-shrink-0 px-4 py-1.5 rounded text-xs transition-colors border ${
                  s.date === selectedDate
                    ? "border-white text-white"
                    : "border-[#444] text-gray-400 hover:border-[#777]"
                }`}
              >
                {s.date}
              </button>
            ))}
          </div>

          {/* Slots + booking panel */}
          {selectedSchedule && (
            <div className="flex gap-6">
              <div className="flex-1">
                {selectedSchedule.slots.map((slot) => (
                  <div key={slot.screen} className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">{slot.screen}</div>
                    <div className="flex flex-wrap gap-2">
                      {slot.times.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-4 py-2 rounded text-xs transition-colors border ${
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

              {/* Booking summary panel */}
              {selectedTime && (
                <div className="w-48 flex-shrink-0 border border-[#333] rounded p-3 bg-[#1a1a1a] text-xs self-start">
                  <div className="text-gray-400 mb-2">選択内容</div>
                  <div className="text-gray-300 mb-1">作品：{movie.title}</div>
                  <div className="text-gray-300 mb-1">日時：{selectedDate} {selectedTime}</div>
                  <div className="text-gray-300 mb-1">劇場：{selectedTheater}</div>
                  <div className="text-gray-300 mb-3">
                    SCREEN：{selectedSchedule.slots.find(s => s.times.includes(selectedTime))?.screen}
                  </div>
                  <Link
                    href="/tickets"
                    className="block text-center bg-white text-black py-1.5 rounded font-medium hover:bg-gray-200 transition-colors"
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
