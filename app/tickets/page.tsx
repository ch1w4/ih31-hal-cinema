"use client";
import { useState } from "react";
import Header from "@/components/Header";
import { movies, mockSchedules } from "@/lib/mockData";

type Step = "select-movie" | "select-time" | "seat" | "ticket-type" | "customer-info" | "confirm";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const COLS = 14;

const seatLayout = ROWS.map((row) =>
  Array.from({ length: COLS }, (_, col) => ({
    id: `${row}-${col + 1}`,
    row,
    col: col + 1,
    occupied: Math.random() < 0.25,
  }))
);

const ticketTypes = [
  { id: "general", label: "一般", price: 1900 },
  { id: "student", label: "大学生・専門学生", price: 1500 },
  { id: "senior", label: "シニア（60歳以上）", price: 1200 },
  { id: "child", label: "小学生以下", price: 1000 },
];

const halDiscounts = [
  { id: "no", label: "HALカードと水曜割引なし" },
  { id: "yes", label: "HALカードと水曜割引あり" },
];

const stepLabels: { key: Step; label: string }[] = [
  { key: "select-movie", label: "映画選択" },
  { key: "select-time", label: "時間帯選択" },
  { key: "seat", label: "座席選択" },
  { key: "ticket-type", label: "チケット種別" },
  { key: "customer-info", label: "お客様情報" },
  { key: "confirm", label: "購入確認" },
];

export default function TicketsPage() {
  const [step, setStep] = useState<Step>("select-movie");
  const [selectedMovieId, setSelectedMovieId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedScreen, setSelectedScreen] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [ticketSelections, setTicketSelections] = useState<Record<string, string>>({});
  const [halDiscount, setHalDiscount] = useState(halDiscounts[0].id);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"男" | "女" | "どちらでもない">("男");
  const [memberNo, setMemberNo] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [payment, setPayment] = useState<"credit" | "paypay">("credit");

  const movie = movies.find((m) => m.id === selectedMovieId);
  const schedules = mockSchedules[selectedMovieId] || mockSchedules["1"] || [];

  const currentIdx = stepLabels.findIndex((s) => s.key === step);

  const toggleSeat = (id: string, occupied: boolean) => {
    if (occupied) return;
    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const typeId = ticketSelections[seatId] || "general";
    const type = ticketTypes.find((t) => t.id === typeId);
    return sum + (type?.price ?? 1900);
  }, 0);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Step breadcrumb */}
        <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-6 overflow-x-auto pb-1">
          {stepLabels.map((s, i) => (
            <span key={s.key} className="flex items-center gap-1 flex-shrink-0">
              {i > 0 && <span className="text-gray-700">›</span>}
              <span className={step === s.key ? "text-white" : i < currentIdx ? "text-gray-400" : ""}>
                {i < currentIdx ? "✓ " : ""}{s.label}
              </span>
            </span>
          ))}
        </div>

        {/* ── STEP 1: 映画選択 ── */}
        {step === "select-movie" && (
          <div>
            <h2 className="text-sm text-gray-300 mb-4">映画を選択してください</h2>
            <div className="space-y-2">
              {movies.slice(0, 6).map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMovieId(m.id);
                    setSelectedDate("");
                    setSelectedTime("");
                    setSelectedSeats([]);
                    setStep("select-time");
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded border border-[#333] bg-[#1a1a1a] hover:border-[#666] transition-colors text-left"
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
                    <div className="text-xs text-gray-400 mt-0.5">
                      {m.genre[0]} · {m.duration}分 · {m.rating}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: 時間帯選択 ── */}
        {step === "select-time" && movie && (
          <div>
            {/* 選択中の映画 */}
            <div className="flex items-center gap-3 border border-[#333] rounded p-3 bg-[#1a1a1a] mb-5">
              <div
                className="flex-shrink-0 rounded"
                style={{
                  width: "36px",
                  aspectRatio: "2/3",
                  background: `linear-gradient(160deg, ${movie.posterColor} 0%, #111 100%)`,
                }}
              />
              <div>
                <div className="text-white text-sm font-medium">{movie.title}</div>
                <div className="text-xs text-gray-400">{movie.duration}分 · {movie.rating}</div>
              </div>
            </div>

            <h2 className="text-sm text-gray-300 mb-3">日付を選択してください</h2>
            <div className="flex gap-2 flex-wrap mb-5">
              {schedules.map((s) => (
                <button
                  key={s.date}
                  onClick={() => { setSelectedDate(s.date); setSelectedTime(""); setSelectedScreen(""); }}
                  className={`px-4 py-1.5 rounded text-xs border transition-colors ${
                    selectedDate === s.date
                      ? "border-white text-white bg-[#2a2a2a]"
                      : "border-[#444] text-gray-400 hover:border-[#777]"
                  }`}
                >
                  {s.date}
                </button>
              ))}
            </div>

            {selectedDate && (
              <>
                <h2 className="text-sm text-gray-300 mb-3">時間帯を選択してください</h2>
                {schedules
                  .find((s) => s.date === selectedDate)
                  ?.slots.map((slot) => (
                    <div key={slot.screen} className="mb-4">
                      <div className="text-xs text-gray-500 mb-2">{slot.screen}</div>
                      <div className="flex flex-wrap gap-2">
                        {slot.times.map((time) => (
                          <button
                            key={time}
                            onClick={() => { setSelectedTime(time); setSelectedScreen(slot.screen); }}
                            className={`px-4 py-2 rounded text-xs border transition-colors ${
                              selectedTime === time && selectedScreen === slot.screen
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
              </>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep("select-movie")}
                className="px-4 py-2 border border-[#444] text-gray-400 rounded text-sm hover:border-white hover:text-white transition-colors"
              >
                戻る
              </button>
              <button
                onClick={() => setStep("seat")}
                disabled={!selectedTime}
                className={`px-6 py-2 rounded text-sm font-medium transition-colors ${
                  selectedTime
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-[#333] text-gray-600 cursor-not-allowed"
                }`}
              >
                座席を選ぶ
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: 座席選択 ── */}
        {step === "seat" && movie && (
          <div>
            {/* 選択内容サマリ */}
            <div className="text-xs text-gray-400 border border-[#333] rounded p-3 bg-[#1a1a1a] mb-4 space-y-0.5">
              <div>{movie.title}</div>
              <div>{selectedDate}　{selectedTime}　{selectedScreen}</div>
            </div>

            <div className="flex gap-4 text-xs text-gray-400 mb-3">
              <span className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-[#555] rounded-t" />空き</span>
              <span className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-white rounded-t" />選択中</span>
              <span className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-[#333] rounded-t" />満席</span>
            </div>

            <div className="bg-[#2a2a2a] text-center text-xs text-gray-400 py-1.5 rounded mb-5">── スクリーン ──</div>

            <div className="overflow-x-auto mb-4">
              <div className="inline-block">
                {seatLayout.map((row, ri) => (
                  <div key={ri} className="flex items-center gap-1 mb-1">
                    <span className="text-[10px] text-gray-500 w-4 text-right mr-1">{ROWS[ri]}</span>
                    {row.map((seat) => {
                      const isSelected = selectedSeats.includes(seat.id);
                      return (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat.id, seat.occupied)}
                          disabled={seat.occupied}
                          className={`w-5 h-5 rounded-t transition-colors ${
                            seat.occupied
                              ? "bg-[#333] cursor-not-allowed"
                              : isSelected
                              ? "bg-white"
                              : "bg-[#555] hover:bg-[#888]"
                          }`}
                        />
                      );
                    })}
                    <span className="text-[10px] text-gray-500 ml-1">{ROWS[ri]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-300 mb-4">
              選択数：<span className="text-white font-bold">{selectedSeats.length}</span> 席
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("select-time")}
                className="px-4 py-2 border border-[#444] text-gray-400 rounded text-sm hover:border-white hover:text-white transition-colors"
              >
                戻る
              </button>
              <button
                onClick={() => selectedSeats.length > 0 && setStep("ticket-type")}
                disabled={selectedSeats.length === 0}
                className={`px-6 py-2 rounded text-sm font-medium transition-colors ${
                  selectedSeats.length > 0
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-[#333] text-gray-600 cursor-not-allowed"
                }`}
              >
                次へ
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: チケット種別 ── */}
        {step === "ticket-type" && movie && (
          <div>
            <div className="text-xs text-gray-400 border border-[#333] rounded p-3 bg-[#1a1a1a] mb-4 space-y-0.5">
              <div>{movie.title}</div>
              <div>{selectedDate}　{selectedTime}　{selectedScreen}</div>
              <div>座席：{selectedSeats.join(", ")}</div>
            </div>

            <h2 className="text-sm text-gray-300 mb-4">チケットの種類をお選びください</h2>

            <div className="space-y-3 mb-5">
              {selectedSeats.map((seatId, i) => {
                const selected = ticketSelections[seatId] || "general";
                return (
                  <div key={seatId} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-12 flex-shrink-0">{seatId}</span>
                    <select
                      value={selected}
                      onChange={(e) =>
                        setTicketSelections((prev) => ({ ...prev, [seatId]: e.target.value }))
                      }
                      className="flex-1 bg-[#1a1a1a] border border-[#444] text-white text-xs rounded px-3 py-2 focus:outline-none"
                    >
                      {ticketTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}　¥{t.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 mb-5">
              {halDiscounts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setHalDiscount(d.id)}
                  className={`px-3 py-1.5 rounded text-xs border transition-colors ${
                    halDiscount === d.id
                      ? "border-[#e8a090] bg-[#e8a090] text-white"
                      : "border-[#444] text-gray-400 hover:border-[#777]"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-[#333] pt-4 mb-5">
              <span className="text-sm text-gray-400">合計</span>
              <span className="text-white font-medium">¥{totalPrice.toLocaleString()}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("seat")}
                className="px-4 py-2 border border-[#444] text-gray-400 rounded text-sm hover:border-white hover:text-white transition-colors"
              >
                戻る
              </button>
              <button
                onClick={() => setStep("customer-info")}
                className="px-6 py-2 bg-white text-black rounded text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                次へ
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: お客様情報入力 ── */}
        {step === "customer-info" && (
          <div>
            <h2 className="text-sm text-white mb-5">お客様情報の入力</h2>

            <div className="space-y-4 mb-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">苗字（姓）</label>
                  <input type="text" className="w-full bg-[#2a2a2a] border border-[#444] text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-[#888]" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">名前（名）</label>
                  <input type="text" className="w-full bg-[#2a2a2a] border border-[#444] text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-[#888]" />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-2">性別</label>
                <div className="flex gap-4 text-sm text-gray-300">
                  {(["男", "女", "どちらでもない"] as const).map((g) => (
                    <label key={g} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="gender" checked={gender === g} onChange={() => setGender(g)} className="accent-white" />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">割引番号（任意）</label>
                <input
                  type="text"
                  placeholder="各種割引・ハイフンなし"
                  value={memberNo}
                  onChange={(e) => setMemberNo(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#444] text-white text-sm rounded px-3 py-2 placeholder-gray-600 focus:outline-none focus:border-[#888]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">メールアドレス <span className="text-red-400">必須</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#444] text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-[#888]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">メールアドレス（確認）</label>
                <input
                  type="email"
                  value={emailConfirm}
                  onChange={(e) => setEmailConfirm(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#444] text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-[#888]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-2">支払い方法 <span className="text-red-400">必須</span></label>
                <div className="space-y-2">
                  {(["credit", "paypay"] as const).map((p) => (
                    <label key={p} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="payment" checked={payment === p} onChange={() => setPayment(p)} className="accent-white" />
                      <span className="text-sm text-gray-300">
                        {p === "credit" ? "クレジットカード" : "PayPay"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("ticket-type")}
                className="px-4 py-2 border border-[#444] text-gray-400 rounded text-sm hover:border-white hover:text-white transition-colors"
              >
                戻る
              </button>
              <button
                onClick={() => email && setStep("confirm")}
                disabled={!email}
                className={`px-6 py-2 rounded text-sm font-medium transition-colors ${
                  email ? "bg-white text-black hover:bg-gray-200" : "bg-[#333] text-gray-600 cursor-not-allowed"
                }`}
              >
                次へ
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 6: 購入確認 ── */}
        {step === "confirm" && movie && (
          <div>
            <h2 className="text-sm text-white mb-4">購入内容の確認</h2>

            <div className="border border-[#333] rounded p-4 bg-[#1a1a1a] mb-6 space-y-2 text-sm">
              {[
                { label: "作品", value: movie.title },
                { label: "日時", value: `${selectedDate}　${selectedTime}` },
                { label: "劇場", value: "HALシネマ 名古屋" },
                { label: "SCREEN", value: selectedScreen },
                { label: "座席", value: selectedSeats.join(", ") },
                { label: "合計金額", value: `¥${totalPrice.toLocaleString()}` },
                { label: "メールアドレス", value: email },
                { label: "支払い方法", value: payment === "credit" ? "クレジットカード" : "PayPay" },
              ].map(({ label, value }) => (
                <div key={label} className="flex">
                  <span className="text-gray-500 w-32 flex-shrink-0">{label}</span>
                  <span className="text-gray-200">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("customer-info")}
                className="px-4 py-2 border border-[#444] text-gray-400 rounded text-sm hover:border-white hover:text-white transition-colors"
              >
                戻る
              </button>
              <button className="px-8 py-2 bg-[#e8a090] text-white rounded text-sm font-medium hover:bg-[#d08070] transition-colors">
                購入する
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
