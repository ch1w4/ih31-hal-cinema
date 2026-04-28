"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { movies } from "@/lib/mockData";

type Step = "select-movie" | "select-seat" | "payment" | "confirm";

const seatLayout = Array.from({ length: 8 }, (_, row) =>
  Array.from({ length: 10 }, (_, col) => ({
    id: `${String.fromCharCode(65 + row)}${col + 1}`,
    row: String.fromCharCode(65 + row),
    col: col + 1,
    occupied: Math.random() < 0.3,
  }))
);

export default function TicketsPage() {
  const [step, setStep] = useState<Step>("select-movie");
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const movie = movies.find((m) => m.id === selectedMovie);

  const toggleSeat = (seatId: string, occupied: boolean) => {
    if (occupied) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-lg font-medium text-white mb-6 pb-2 border-b border-[#333]">
          <span className="text-xs text-gray-400 block mb-1">Online Tickets</span>
          チケット購入
        </h1>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {(["select-movie", "select-seat", "payment", "confirm"] as Step[]).map(
            (s, i) => {
              const labels = ["映画選択", "座席選択", "お支払い", "確認"];
              const idx = ["select-movie", "select-seat", "payment", "confirm"].indexOf(step);
              const isActive = s === step;
              const isDone = i < idx;
              return (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? "bg-white text-black"
                        : isDone
                        ? "bg-[#555] text-white"
                        : "bg-[#333] text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-xs hidden sm:block ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {labels[i]}
                  </span>
                  {i < 3 && <span className="text-gray-600 text-xs">›</span>}
                </div>
              );
            }
          )}
        </div>

        {/* Step: Select Movie */}
        {step === "select-movie" && (
          <div>
            <h2 className="text-sm text-gray-400 mb-4">映画を選択してください</h2>
            <div className="space-y-2">
              {movies.slice(0, 6).map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMovie(m.id);
                    setStep("select-seat");
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded border transition-colors text-left ${
                    selectedMovie === m.id
                      ? "border-white bg-[#2a2a2a]"
                      : "border-[#333] bg-[#1a1a1a] hover:border-[#555]"
                  }`}
                >
                  <div
                    className="flex-shrink-0 rounded"
                    style={{
                      width: "40px",
                      aspectRatio: "2/3",
                      background: `linear-gradient(160deg, ${m.posterColor} 0%, #111 100%)`,
                    }}
                  />
                  <div>
                    <div className="text-white text-sm font-medium">{m.title}</div>
                    <div className="text-xs text-gray-400">
                      {m.genre[0]} · {m.duration}分 · {m.rating}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Select Seat */}
        {step === "select-seat" && movie && (
          <div>
            <h2 className="text-sm text-gray-400 mb-2">座席を選択してください</h2>
            <div className="text-xs text-gray-500 mb-4">{movie.title} / シアター1 / 13:30</div>

            {/* Screen */}
            <div className="bg-[#333] text-center text-xs text-gray-400 py-2 rounded mb-6">
              ── スクリーン ──
            </div>

            {/* Seat grid */}
            <div className="overflow-x-auto mb-4">
              <div className="inline-block">
                {seatLayout.map((row, ri) => (
                  <div key={ri} className="flex gap-1 mb-1">
                    <span className="text-xs text-gray-600 w-4 text-right mr-1 leading-6">
                      {String.fromCharCode(65 + ri)}
                    </span>
                    {row.map((seat) => {
                      const isSelected = selectedSeats.includes(seat.id);
                      return (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat.id, seat.occupied)}
                          disabled={seat.occupied}
                          className={`w-6 h-6 rounded-t text-[9px] transition-colors ${
                            seat.occupied
                              ? "bg-[#333] text-gray-600 cursor-not-allowed"
                              : isSelected
                              ? "bg-white text-black"
                              : "bg-[#555] text-gray-300 hover:bg-[#888]"
                          }`}
                          title={seat.id}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-xs text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-t bg-[#555]" /> 空席
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-t bg-white" /> 選択中
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-t bg-[#333]" /> 満席
              </div>
            </div>

            <div className="text-sm text-gray-300 mb-4">
              選択席: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "未選択"}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("select-movie")}
                className="px-4 py-2 border border-[#444] text-gray-400 rounded text-sm hover:border-white hover:text-white transition-colors"
              >
                戻る
              </button>
              <button
                onClick={() => selectedSeats.length > 0 && setStep("payment")}
                disabled={selectedSeats.length === 0}
                className={`px-6 py-2 rounded text-sm font-medium transition-colors ${
                  selectedSeats.length > 0
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-[#333] text-gray-600 cursor-not-allowed"
                }`}
              >
                お支払いへ
              </button>
            </div>
          </div>
        )}

        {/* Step: Payment */}
        {step === "payment" && (
          <div>
            <h2 className="text-sm text-gray-400 mb-4">お支払い方法を選択してください</h2>

            <div className="space-y-2 mb-6">
              {[
                { id: "credit", label: "クレジットカード", icon: "💳" },
                { id: "ic", label: "交通系IC / 電子マネー", icon: "📱" },
                { id: "qr", label: "QRコード決済 (PayPay / LINE Pay)", icon: "📲" },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded border transition-colors text-left ${
                    paymentMethod === method.id
                      ? "border-white bg-[#2a2a2a]"
                      : "border-[#333] bg-[#1a1a1a] hover:border-[#555]"
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-white text-sm">{method.label}</span>
                  {paymentMethod === method.id && (
                    <span className="ml-auto text-white text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border border-[#333] rounded p-4 bg-[#1a1a1a] mb-4">
              <div className="text-xs text-gray-400 mb-3">ご注文内容</div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>{movie?.title}</span>
                <span>{selectedSeats.length}席</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>一般</span>
                <span>¥1,900 × {selectedSeats.length}</span>
              </div>
              <div className="border-t border-[#333] mt-3 pt-3 flex justify-between text-white font-medium">
                <span>合計</span>
                <span>¥{(1900 * selectedSeats.length).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("select-seat")}
                className="px-4 py-2 border border-[#444] text-gray-400 rounded text-sm hover:border-white hover:text-white transition-colors"
              >
                戻る
              </button>
              <button
                onClick={() => paymentMethod && setStep("confirm")}
                disabled={!paymentMethod}
                className={`px-6 py-2 rounded text-sm font-medium transition-colors ${
                  paymentMethod
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-[#333] text-gray-600 cursor-not-allowed"
                }`}
              >
                確認へ進む
              </button>
            </div>
          </div>
        )}

        {/* Step: Confirm */}
        {step === "confirm" && (
          <div>
            <h2 className="text-sm text-gray-400 mb-4">予約内容の確認</h2>

            <div className="border border-[#333] rounded p-4 bg-[#1a1a1a] mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">映画</span>
                <span className="text-white">{movie?.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">日時</span>
                <span className="text-white">2023年10月14日 13:30</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">スクリーン</span>
                <span className="text-white">シアター1</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">座席</span>
                <span className="text-white">{selectedSeats.join(", ")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">お支払い方法</span>
                <span className="text-white">
                  {paymentMethod === "credit"
                    ? "クレジットカード"
                    : paymentMethod === "ic"
                    ? "電子マネー"
                    : "QRコード決済"}
                </span>
              </div>
              <div className="border-t border-[#333] pt-3 flex justify-between font-medium">
                <span className="text-gray-400">合計金額</span>
                <span className="text-white">
                  ¥{(1900 * selectedSeats.length).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-6">
              ※ 予約確定後、登録メールアドレスにQRコードチケットを送付します。
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("payment")}
                className="px-4 py-2 border border-[#444] text-gray-400 rounded text-sm hover:border-white hover:text-white transition-colors"
              >
                戻る
              </button>
              <button className="px-6 py-2 rounded text-sm font-medium bg-white text-black hover:bg-gray-200 transition-colors">
                予約を確定する
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
