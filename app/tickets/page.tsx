"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { movies, mockSchedules } from "@/lib/mockData";

type Step = "select-movie" | "select-time" | "seat" | "ticket-type" | "customer-info" | "confirm" | "complete";

const TOP_ROWS = ["A", "B", "C"];
const BOTTOM_ROWS = ["D", "E", "F", "G", "H", "I"];
const TOP_COLS = 16;
const LEFT_BLOCK = 2;
const RIGHT_BLOCK = 11;

type SeatStatus = "empty" | "purchased" | "selected";

function buildSeatMap() {
  const map: Record<string, SeatStatus> = {};
  const purchased = ["F-7", "F-8", "G-3"];
  for (const row of [...TOP_ROWS, ...BOTTOM_ROWS]) {
    const cols = TOP_ROWS.includes(row) ? TOP_COLS : LEFT_BLOCK + RIGHT_BLOCK;
    for (let c = 1; c <= cols; c++) {
      const id = `${row}-${c}`;
      map[id] = purchased.includes(id) ? "purchased" : "empty";
    }
  }
  return map;
}

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
  { key: "complete", label: "完了" },
];

function TicketsContent() {
  const searchParams = useSearchParams();
  const initMovieId = searchParams.get("movieId") ?? "";
  const initDate = searchParams.get("date") ?? "";
  const initTime = searchParams.get("time") ?? "";
  const initScreen = searchParams.get("screen") ?? "";
  const initStep: Step =
    initMovieId && initDate && initTime ? "seat" : "select-movie";

  const [step, setStep] = useState<Step>(initStep);
  const [selectedMovieId, setSelectedMovieId] = useState(initMovieId);
  const [selectedDate, setSelectedDate] = useState(initDate);
  const [selectedScreen, setSelectedScreen] = useState(initScreen);
  const [selectedTime, setSelectedTime] = useState(initTime);
  const [seatMap, setSeatMap] = useState<Record<string, SeatStatus>>(buildSeatMap);
  const [ticketSelections, setTicketSelections] = useState<Record<string, string>>({});
  const [halDiscount, setHalDiscount] = useState("no");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastNameKana, setLastNameKana] = useState("");
  const [firstNameKana, setFirstNameKana] = useState("");
  const [gender, setGender] = useState<"男" | "女" | "どちらでもない">("男");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [payment, setPayment] = useState<"credit" | "paypay">("credit");

  const movie = movies.find((m) => m.id === selectedMovieId);
  const schedules = mockSchedules[selectedMovieId] || mockSchedules["1"] || [];
  const selectedSeats = Object.entries(seatMap)
    .filter(([, s]) => s === "selected")
    .map(([id]) => id);
  const currentIdx = stepLabels.findIndex((s) => s.key === step);

  const totalPrice = selectedSeats.reduce((sum, id) => {
    const t = ticketTypes.find((t) => t.id === (ticketSelections[id] || "general"));
    return sum + (t?.price ?? 1900);
  }, 0);

  function toggleSeat(id: string) {
    setSeatMap((prev) => {
      const cur = prev[id];
      if (cur === "purchased") return prev;
      return { ...prev, [id]: cur === "selected" ? "empty" : "selected" };
    });
  }

  function SeatButton({ id }: { id: string }) {
    const status = seatMap[id] ?? "empty";
    const color =
      status === "selected"
        ? "bg-red-500 hover:bg-red-400"
        : status === "purchased"
        ? "bg-blue-500 cursor-not-allowed"
        : "bg-gray-400 hover:bg-gray-300";
    return (
      <button
        onClick={() => toggleSeat(id)}
        disabled={status === "purchased"}
        className={`h-4 rounded-t-sm transition-colors ${color}`}
        style={{ width: "18px", flexShrink: 0 }}
        title={id}
      />
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-6 overflow-x-auto pb-1">
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
          <h2 className="text-base text-gray-300 mb-4">映画を選択してください</h2>
          <div className="space-y-2">
            {movies.slice(0, 6).map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMovieId(m.id);
                  setSelectedDate("");
                  setSelectedTime("");
                  setSelectedScreen("");
                  setSeatMap(buildSeatMap());
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
                  <div className="text-sm text-gray-400 mt-0.5">
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
              <div className="text-sm text-gray-400">
                {movie.duration}分 · {movie.rating}
              </div>
            </div>
          </div>

          <h2 className="text-base text-gray-300 mb-3">日付を選択してください</h2>
          <div className="flex gap-2 flex-wrap mb-5">
            {schedules.map((s) => (
              <button
                key={s.date}
                onClick={() => {
                  setSelectedDate(s.date);
                  setSelectedTime("");
                  setSelectedScreen("");
                }}
                className={`px-5 py-3 rounded text-base border transition-colors ${
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
              <h2 className="text-base text-gray-300 mb-3">時間帯を選択してください</h2>
              {schedules
                .find((s) => s.date === selectedDate)
                ?.slots.map((slot) => (
                  <div key={slot.screen} className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">{slot.screen}</div>
                    <div className="flex flex-wrap gap-2">
                      {slot.times.map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setSelectedTime(time);
                            setSelectedScreen(slot.screen);
                          }}
                          className={`px-4 py-2 rounded text-sm border transition-colors ${
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
              className="px-5 py-3 border border-[#444] text-gray-400 rounded text-base hover:border-white hover:text-white transition-colors"
            >
              戻る
            </button>
            <button
              onClick={() => setStep("seat")}
              disabled={!selectedTime}
              className={`px-8 py-3 rounded text-base font-medium transition-colors ${
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
          {/* Summary bar */}
          <div className="text-sm text-gray-400 border border-[#333] rounded p-3 bg-[#1a1a1a] mb-4 space-y-0.5">
            <div>{movie.title}</div>
            <div>{selectedDate}　{selectedTime}　{selectedScreen}</div>
          </div>

          {/* Legend */}
          <div className="flex gap-6 text-sm text-gray-300 mb-5">
            <span className="flex items-center gap-2">
              <span className="inline-block w-5 h-4 bg-gray-400 rounded-t-sm" />空白
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block w-5 h-4 bg-red-500 rounded-t-sm" />選択した席
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block w-5 h-4 bg-blue-500 rounded-t-sm" />購入された席
            </span>
          </div>

          {/* Seat map box */}
          <div className="border-2 border-red-700 rounded p-4 bg-[#111] mb-4 overflow-x-auto">
            {/* Screen bar */}
            <div className="flex justify-center mb-1">
              <div className="bg-white rounded h-2" style={{ width: "55%" }} />
            </div>
            <div className="text-center text-sm text-gray-400 mb-4">screen1</div>

            {/* Top rows A-C */}
            <div className="mb-1">
              <div className="flex items-center mb-1">
                <span className="w-6" />
                <div
                  className="flex flex-1 justify-between px-0 text-sm text-gray-500"
                  style={{ paddingLeft: "1px" }}
                >
                  <span>1</span>
                  <span>16</span>
                </div>
                <span className="w-6" />
              </div>
              {TOP_ROWS.map((row) => (
                <div key={row} className="flex items-center gap-1 mb-1">
                  <span className="text-sm text-gray-400 w-5 text-right">{row}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: TOP_COLS }, (_, c) => (
                      <SeatButton key={c} id={`${row}-${c + 1}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400 w-5 ml-1">{row}</span>
                </div>
              ))}
            </div>

            <div className="my-3" />

            {/* Bottom rows D-I */}
            <div className="flex">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <span className="w-5" />
                  <div className="text-sm text-gray-500 ml-0.5">1</div>
                  <div className="flex-1" />
                  <div className="text-sm text-gray-500 mr-1">13</div>
                </div>
                {BOTTOM_ROWS.map((row) => (
                  <div key={row} className="flex items-center gap-1 mb-1">
                    <span className="text-sm text-gray-400 w-5 text-right">{row}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: LEFT_BLOCK }, (_, c) => (
                        <SeatButton key={c} id={`${row}-${c + 1}`} />
                      ))}
                    </div>
                    <div className="w-4" />
                    <div className="flex gap-0.5">
                      {Array.from({ length: RIGHT_BLOCK }, (_, c) => (
                        <SeatButton key={c} id={`${row}-${c + LEFT_BLOCK + 1}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400 w-5 ml-1">{row}</span>
                  </div>
                ))}
              </div>

              {/* 出入り口 */}
              <div className="flex flex-col items-center ml-2 self-center">
                <div className="border-r border-t border-b border-gray-500 h-20 w-3" />
                <div
                  className="text-sm text-gray-400 mt-1"
                  style={{ writingMode: "vertical-rl" }}
                >
                  出入り口
                </div>
              </div>
            </div>

            {/* Seat count + selected chips */}
            <div className="flex items-center gap-4 mt-4 border-t border-[#333] pt-3">
              <div className="text-sm text-gray-400">
                <div>座席数</div>
                <div className="font-bold text-white">200席</div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {selectedSeats.map((id) => (
                  <div key={id} className="flex items-center gap-1">
                    <span className="inline-block w-5 h-4 bg-red-500 rounded-t-sm" />
                    <span className="text-sm text-gray-300">{id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setStep("select-time")}
              className="px-5 py-3 border border-[#444] text-gray-400 rounded text-base hover:border-white hover:text-white transition-colors"
            >
              戻る
            </button>
            <button
              onClick={() => selectedSeats.length > 0 && setStep("ticket-type")}
              disabled={selectedSeats.length === 0}
              className={`px-8 py-3 rounded text-base font-medium transition-colors ${
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
          <div className="text-sm text-gray-400 border border-[#333] rounded p-3 bg-[#1a1a1a] mb-4 space-y-0.5">
            <div>{movie.title}</div>
            <div>
              {selectedDate}　{selectedTime}　{selectedScreen}
            </div>
            <div>座席：{selectedSeats.join(", ")}</div>
          </div>

          <h2 className="text-base text-gray-300 mb-4">チケットの種類をお選びください</h2>
          <div className="space-y-3 mb-5">
            {selectedSeats.map((seatId) => (
              <div key={seatId} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-12 flex-shrink-0">{seatId}</span>
                <select
                  value={ticketSelections[seatId] || "general"}
                  onChange={(e) =>
                    setTicketSelections((p) => ({ ...p, [seatId]: e.target.value }))
                  }
                  className="flex-1 bg-[#1a1a1a] border border-[#444] text-white text-sm rounded px-3 py-2 focus:outline-none"
                >
                  {ticketTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}　¥{t.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-5">
            {halDiscounts.map((d) => (
              <button
                key={d.id}
                onClick={() => setHalDiscount(d.id)}
                className={`px-3 py-1.5 rounded text-sm border transition-colors ${
                  halDiscount === d.id
                    ? "border-red-600 bg-red-600 text-white"
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
              className="px-5 py-3 border border-[#444] text-gray-400 rounded text-base hover:border-white hover:text-white transition-colors"
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
        <div className="space-y-0">
          <section className="bg-[#1a1a1a] rounded-t p-4 mb-px">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-white">氏名</span>
              <span className="text-sm text-red-400">*必須</span>
            </div>
            <div className="space-y-2">
              {[
                { label: "漢字(姓)", placeholder: "姓", value: lastName, set: setLastName },
                { label: "漢字(名)", placeholder: "名", value: firstName, set: setFirstName },
                { label: "フリガナ(姓)", placeholder: "姓", value: lastNameKana, set: setLastNameKana },
                { label: "フリガナ(名)", placeholder: "名", value: firstNameKana, set: setFirstNameKana },
              ].map(({ label, placeholder, value, set }) => (
                <div key={label}>
                  <label className="text-sm text-gray-400 block mb-0.5">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="w-full bg-white text-black text-sm rounded px-3 py-2 placeholder-gray-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#1a1a1a] p-4 mb-px">
            <div className="text-sm text-white mb-3">性別</div>
            <div className="flex gap-6 text-sm text-gray-300">
              {(["男", "女", "どちらでもない"] as const).map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === g}
                    onChange={() => setGender(g)}
                    className="accent-white w-4 h-4"
                  />
                  {g}
                </label>
              ))}
            </div>
          </section>

          <section className="bg-[#1a1a1a] p-4 mb-px">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-white">電話番号</span>
              <span className="text-sm text-red-400">*必須</span>
            </div>
            <label className="text-sm text-gray-400 block mb-0.5">半角数字・ハイフンなし</label>
            <input
              type="tel"
              placeholder="08000000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white text-black text-sm rounded px-3 py-2 placeholder-gray-400 focus:outline-none"
            />
          </section>

          <section className="bg-[#1a1a1a] p-4 mb-px">
            <div className="text-sm text-white mb-3">メールアドレス</div>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-gray-400 block mb-0.5">メールアドレス</label>
                <input
                  type="email"
                  placeholder="例）HALCINEMA@HAL.HLA"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white text-black text-sm rounded px-3 py-2 placeholder-gray-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-0.5">確認</label>
                <input
                  type="email"
                  placeholder="例）HALCINEMA@HAL.HLA"
                  value={emailConfirm}
                  onChange={(e) => setEmailConfirm(e.target.value)}
                  className="w-full bg-white text-black text-sm rounded px-3 py-2 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>
          </section>

          <section className="bg-[#1a1a1a] rounded-b p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-white">支払い方法</span>
              <span className="text-sm text-red-400">*必須</span>
            </div>
            <div className="space-y-2">
              {(["credit", "paypay"] as const).map((p) => (
                <label key={p} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === p}
                    onChange={() => setPayment(p)}
                    className="accent-white w-4 h-4"
                  />
                  <span className="text-sm text-gray-300">
                    {p === "credit" ? "クレジットカード" : "PayPay"}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep("ticket-type")}
              className="px-5 py-3 border border-[#444] text-gray-400 rounded text-base hover:border-white hover:text-white transition-colors"
            >
              戻る
            </button>
            <button
              onClick={() => email && phone && setStep("confirm")}
              disabled={!email || !phone}
              className={`px-8 py-3 rounded text-base font-medium transition-colors ${
                email && phone
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-[#333] text-gray-600 cursor-not-allowed"
              }`}
            >
              次へ
            </button>
          </div>
        </div>
      )}

      {/* ── 購入完了 ── */}
      {step === "complete" && movie && (
        <div className="text-center py-10">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-600 mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-white text-xl font-bold mb-1">購入完了</div>
          <div className="text-gray-400 text-sm mb-8">ご購入ありがとうございます</div>

          <div className="border border-[#333] rounded p-4 bg-[#1a1a1a] mb-6 text-left space-y-2 text-sm">
            <div className="text-gray-400 text-sm mb-3">予約内容</div>
            {[
              { label: "予約番号", value: `HC-${Math.random().toString(36).slice(2, 8).toUpperCase()}` },
              { label: "作品", value: movie.title },
              { label: "日時", value: `${selectedDate}　${selectedTime}` },
              { label: "SCREEN", value: selectedScreen },
              { label: "座席", value: selectedSeats.join(", ") },
              { label: "合計金額", value: `¥${totalPrice.toLocaleString()}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex">
                <span className="text-gray-500 w-28 flex-shrink-0">{label}</span>
                <span className="text-gray-200">{value}</span>
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-500 mb-8">
            ご登録のメールアドレスに確認メールを送信しました。<br />
            当日は予約番号をご提示ください。
          </div>

          <a
            href="/"
            className="inline-block px-8 py-2.5 bg-white text-black rounded text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            トップページへ
          </a>
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
              { label: "SCREEN", value: selectedScreen },
              { label: "座席", value: selectedSeats.join(", ") },
              { label: "合計金額", value: `¥${totalPrice.toLocaleString()}` },
              { label: "氏名", value: `${lastName} ${firstName}` },
              { label: "電話番号", value: phone },
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
              className="px-5 py-3 border border-[#444] text-gray-400 rounded text-base hover:border-white hover:text-white transition-colors"
            >
              戻る
            </button>
            <button
              onClick={() => setStep("complete")}
              className="px-8 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
            >
              購入する
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function TicketsPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto px-4 py-6 text-gray-400 text-sm">
            読み込み中...
          </div>
        }
      >
        <TicketsContent />
      </Suspense>
    </div>
  );
}
