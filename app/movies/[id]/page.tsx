"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { movies, mockSchedules } from "@/lib/mockData";

export default function MovieDetailPage() {
  const params = useParams();
  const movie = movies.find((m) => m.id === params.id);
  const schedules = mockSchedules[params.id as string] || mockSchedules["1"];
  const [selectedDate, setSelectedDate] = useState(schedules[0]?.date ?? "");

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
        {/* Back button */}
        <Link
          href="/now-showing"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm"
        >
          <span className="text-lg">←</span>
          <span>上映中一覧に戻る</span>
        </Link>

        {/* Movie Info */}
        <div className="flex gap-6 mb-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div
              className="rounded-lg"
              style={{
                width: "160px",
                aspectRatio: "2/3",
                background: `linear-gradient(160deg, ${movie.posterColor} 0%, #111 100%)`,
              }}
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="text-xs text-gray-400 mb-1">
              公開期間 {movie.releaseDate.replace(/-/g, ".")}〜
              {movie.endDate.replace(/-/g, ".")}
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{movie.title}</h1>
            <div className="text-sm text-gray-400 mb-4">{movie.titleEn}</div>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre.map((g) => (
                <span
                  key={g}
                  className="text-xs px-2 py-1 rounded border border-[#444] text-gray-300"
                >
                  {g}
                </span>
              ))}
              <span className="text-xs px-2 py-1 rounded border border-[#444] text-gray-300">
                {movie.rating}
              </span>
              <span className="text-xs px-2 py-1 rounded border border-[#444] text-gray-300">
                {movie.duration}分
              </span>
            </div>

            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">監督</div>
              <div className="text-sm text-gray-300">{movie.director}</div>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <div className="mb-8 border border-[#333] rounded p-4 bg-[#1a1a1a]">
          <h2 className="text-sm text-gray-400 mb-3">あらすじ</h2>
          <p className="text-sm text-gray-300 leading-relaxed">{movie.synopsis}</p>
        </div>

        {/* Cast */}
        <div className="mb-8 border border-[#333] rounded p-4 bg-[#1a1a1a]">
          <h2 className="text-sm text-gray-400 mb-3">声優・キャスト</h2>
          <div className="flex flex-wrap gap-2">
            {movie.cast.map((name) => (
              <span key={name} className="text-sm text-gray-300">
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Theater */}
        <div className="mb-8 border border-[#333] rounded p-4 bg-[#1a1a1a]">
          <h2 className="text-sm text-gray-400 mb-3">上映場所</h2>
          <div className="text-sm text-gray-300">HAL CINEMA 本館</div>
          <div className="text-xs text-gray-500 mt-1">
            〒123-4567 東京都○○区△△ 1-2-3
          </div>
        </div>

        {/* Schedule */}
        <div className="border border-[#333] rounded p-4 bg-[#1a1a1a]">
          <h2 className="text-sm text-gray-400 mb-4">上映スケジュール</h2>

          {/* Date tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {schedules.map((s) => (
              <button
                key={s.date}
                onClick={() => setSelectedDate(s.date)}
                className={`date-tab flex-shrink-0 ${
                  s.date === selectedDate ? "active" : ""
                }`}
              >
                {s.date}
              </button>
            ))}
          </div>

          {/* Time slots */}
          {selectedSchedule && (
            <div className="space-y-4">
              {selectedSchedule.slots.map((slot) => (
                <div key={slot.screen}>
                  <div className="text-xs text-gray-500 mb-2">{slot.screen}</div>
                  <div className="flex flex-wrap gap-2">
                    {slot.times.map((time) => (
                      <Link
                        key={time}
                        href="/tickets"
                        className="px-4 py-2 border border-[#555] rounded text-sm text-gray-300 hover:border-white hover:text-white transition-colors"
                      >
                        {time}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
