"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

type Step = "seat" | "ticket-type" | "customer-info" | "confirm";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const COLS = 14;

function generateSeats() {
  return ROWS.map((row) =>
    Array.from({ length: COLS }, (_, col) => ({
      id: `${row}-${col + 1}`,
      row,
      col: col + 1,
      occupied: Math.random() < 0.25,
    }))
  );
}

const seatLayout = generateSeats();

const ticketTypes = [
  { id: "general", label: "一般", price: 1900 },
  { id: "student", label: "大学生・専門学生", price: 1500 },
  { id: "senior", label: "シニア（60歳以上）", price: 1200 },
  { id: "child", label: "小学生以下", price: 1000 },
];

const halDiscounts = [
  { id: "hal-wed", label: "HALカードと水曜割引なし" },
  { id: "hal-card", label: "HALカードと水曜割引あり" },
];

export default function TicketsPage() {
  const [step, setStep] = useState<Step>("seat");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [ticketSelections, setTicketSelections] = useState<Record<string, string>>({});
  const [halDiscount, setHalDiscount] = useState(halDiscounts[0].id);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"男" | "女" | "どちらでもない">("男");
  const [memberNo, setMemberNo] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [payment, setPayment] = useState<"credit" | "paypay">("credit");

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

  const stepLabels: { key: Step; label: string }[] = [
    { key: "seat", label: "座席選択" },
    { key: "ticket-type", label: "チケット種別" },
    { key: "customer-info", label: "お客様情報" },
    { key: "confirm", label: "購入確認" },
  ];

  const currentIdx = stepLabels.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Step breadcrumb */}
        <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-6 overflow-x-auto">
          {stepLabels.map((s, i) => (
            <span key={s.key} className="flex items-center gap-1 flex-shrink-0">
              {i > 0 && <span className="text-gray-600">›</span>}
              <span className={step === s.key ? "text-white" : ""}>
                {i < currentIdx ? "✓ " : ""}{s.label}
              </span>
            </span>
          ))}
        </div>

        {/* ── STEP: 座席選択 ── */}
        {step === "seat" && (
          <div>
            <div className="text-xs text-gray-400 mb-4">
              座席アイコン説明
            </div>
            <div className="flex gap-4 text-xs text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <span className="inline-block w-4 h-4 bg-[#555] rounded-t" /> 空き
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-4 h-4 bg-white rounded-t" /> 選択した座席
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-4 h-4 bg-[#333] rounded-t" /> 満席
              </span>
            </div>

            {/* Screen */}
            <div className="text-center text-[10px] text-gray-500 mb-1">SCREEN</div>
            <div className="bg-[#2a2a2a] text-center text-xs text-gray-400 py-1.5 rounded mb-5">
              ── スクリーン ──
            </div>

            {/* Seat grid */}
            <div className="overflow-x-auto mb-4">
              <div className="inline-block min-w-full">
                {seatLayout.map((row, ri) => (
                  <div key={ri} className="flex items-center gap-1 mb-1">
                    <span className="text-[10px] text-gray-500 w-4 text-right mr-1">
                      {ROWS[ri]}
                    </span>
                    {/* left block gap */}
                    {ri >= 3 && <div className="w-8" />}
                    {row.map((seat) => {
                      const isSelected = selectedSeats.includes(seat.id);
                      return (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat.id, seat.occupied)}
                          disabled={seat.occupied}
                          className={`w-5 h-5 rounded-t text-[7px] transition-colors ${
                            seat.occupied
                              ? "bg-[#333] cursor-not-allowed"
                              : isSelected
                              ? "bg-white text-black"
                              : "bg-[#555] text-gray-400 hover:bg-[#888]"
                          }`}
                        />
                      );
                    })}
                    <span className="text-[10px] text-gray-500 ml-1">{ROWS[ri]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Count display */}
            <div className="flex items-center gap-4 mb-2 text-sm text-gray-300">
              <span>選択数</span>
              <span className="font-bold text-white">{selectedSeats.length}</span>
              <span>席</span>
            </div>

            {/* Booking info panel */}
            {selectedSeats.length > 0 && (
              <div className="border border-[#333] rounded p-3 bg-[#1a1a1a] mb-4 text-xs">
                <div className="text-gray-400 mb-2">購入内容</div>
                <div className="text-gray-300 mb-1">作品：カラダ探し</div>
                <div className="text-gray-300 mb-1">日時：10/17(土) 8:00〜10:00</div>
                <div className="text-gray-300 mb-1">劇場：HALシネマ 名古屋</div>
                <div className="text-gray-300 mb-1">SCREEN：スクリーン1</div>
                <div className="text-gray-300 mb-1">座席：{selectedSeats.map(s => s.replace("-","")).join(", ")}</div>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep("ticket-type")}
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
            <div className="mt-3">
              <button className="text-xs text-gray-500 hover:text-gray-300 underline">
                購入を取り消して時間指定選択画面に戻る
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: チケット種別 ── */}
        {step === "ticket-type" && (
          <div>
            <div className="text-sm text-gray-300 mb-1">チケットの種類をお選びください</div>
            <div className="text-xs text-gray-500 mb-4">SCREEN スクリーン3</div>

            <div className="space-y-3 mb-6">
              {selectedSeats.map((seatId, i) => {
                const label = `F-${i + 7}`;
                const selected = ticketSelections[seatId] || "general";
                return (
                  <div key={seatId} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-10">{label}</span>
                    <select
                      value={selected}
                      onChange={(e) =>
                        setTicketSelections((prev) => ({ ...prev, [seatId]: e.target.value }))
                      }
                      className="flex-1 bg-[#e8a090] text-white text-xs rounded px-3 py-2 focus:outline-none"
                    >
                      {ticketTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}を選択してください
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            {/* HAL discount */}
            <div className="flex gap-2 mb-6">
              {halDiscounts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setHalDiscount(d.id)}
                  className={`px-3 py-1.5 rounded text-xs transition-colors border ${
                    halDiscount === d.id
                      ? "border-[#e8a090] bg-[#e8a090] text-white"
                      : "border-[#444] text-gray-400 hover:border-[#777]"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center border-t border-[#333] pt-4 mb-6">
              <span className="text-sm text-gray-400">合計</span>
              <span className="text-white font-medium">¥{totalPrice.toLocaleString()}</span>
            </div>

            {/* Login options */}
            <div className="space-y-2 mb-4">
              <button className="w-full border border-[#444] text-white py-2 rounded text-xs hover:bg-[#1a1a1a] transition-colors">
                Googleでログイン
              </button>
              <button className="w-full border border-[#444] text-white py-2 rounded text-xs hover:bg-[#1a1a1a] transition-colors">
                Googleでログイン
              </button>
            </div>
            <div className="text-center mb-6">
              <button
                onClick={() => setStep("customer-info")}
                className="text-xs text-gray-400 hover:text-white underline"
              >
                ログインしないで次へ
              </button>
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
            <div className="mt-3">
              <button className="text-xs text-gray-500 hover:text-gray-300 underline">
                購入を取り消して時間指定選択画面に戻る
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: お客様情報入力 ── */}
        {step === "customer-info" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm text-white">氏名</h2>
              <span className="text-xs text-red-400">必須</span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-gray-400 block mb-1">苗字（姓）</label>
                <input
                  type="text"
                  value={name.split(" ")[0] || ""}
                  onChange={(e) => setName(e.target.value + " " + (name.split(" ")[1] || ""))}
                  className="w-full bg-white text-black text-sm rounded px-3 py-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">名前（名）</label>
                <input
                  type="text"
                  value={name.split(" ")[1] || ""}
                  onChange={(e) => setName((name.split(" ")[0] || "") + " " + e.target.value)}
                  className="w-full bg-white text-black text-sm rounded px-3 py-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">ふりがな（姓）</label>
                <input type="text" className="w-full bg-white text-black text-sm rounded px-3 py-2 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">ふりがな（名）</label>
                <input type="text" className="w-full bg-white text-black text-sm rounded px-3 py-2 focus:outline-none" />
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm text-white mb-3">性別</div>
              <div className="flex gap-4 text-sm text-gray-300">
                {(["男", "女", "どちらでもない"] as const).map((g) => (
                  <label key={g} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === g}
                      onChange={() => setGender(g)}
                      className="accent-white"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-white">割引番号</div>
                <span className="text-xs text-red-400">必須</span>
              </div>
              <input
                type="text"
                placeholder="各種割引・ハイフンなし"
                value={memberNo}
                onChange={(e) => setMemberNo(e.target.value)}
                className="w-full bg-[#e8a090] text-white placeholder-white/60 text-sm rounded px-3 py-2 focus:outline-none"
              />
            </div>

            <div className="mb-6">
              <div className="text-sm text-white mb-3">メールアドレス</div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">メールアドレス</label>
                  <input
                    type="email"
                    placeholder="例）halcinema@hal.hla.la"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#e8a090] text-white placeholder-white/60 text-sm rounded px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">確認</label>
                  <input
                    type="email"
                    placeholder="例）halcinema@hal.hla.la"
                    value={emailConfirm}
                    onChange={(e) => setEmailConfirm(e.target.value)}
                    className="w-full bg-[#e8a090] text-white placeholder-white/60 text-sm rounded px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-white">支払い方法</div>
                <span className="text-xs text-red-400">必須</span>
              </div>
              <div className="space-y-2">
                {(["credit", "paypay"] as const).map((p) => (
                  <label key={p} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === p}
                      onChange={() => setPayment(p)}
                      className="accent-white"
                    />
                    <span className="text-sm text-gray-300">
                      {p === "credit" ? "クレジットカード" : "PayPay"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep("ticket-type")}
                className="px-6 py-2 border border-[#444] text-gray-400 rounded text-sm hover:border-white hover:text-white transition-colors"
              >
                戻る
              </button>
              <button
                onClick={() => setStep("confirm")}
                className="px-6 py-2 bg-white text-black rounded text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                次へ
              </button>
            </div>
            <div className="mt-3">
              <button className="text-xs text-gray-500 hover:text-gray-300 underline">
                購入を取り消して時間指定選択画面に戻る
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: 購入確認 ── */}
        {step === "confirm" && (
          <div>
            <div className="border border-[#333] rounded p-4 bg-[#1a1a1a] mb-6">
              <div className="text-xs text-gray-400 text-center mb-4">購入内容</div>
              <div className="space-y-2 text-sm">
                {[
                  { label: "作品", value: "カラダ探し" },
                  { label: "日時", value: "2026年10月17日(土) 8:00〜10:00" },
                  { label: "劇場", value: "HALシネマ 名古屋" },
                  { label: "SCREEN", value: "スクリーン1" },
                  {
                    label: "席数",
                    value: selectedSeats.map((s) => {
                      const typeId = ticketSelections[s] || "general";
                      const type = ticketTypes.find((t) => t.id === typeId);
                      return `F-${selectedSeats.indexOf(s) + 7}　${type?.label ?? "一般"}`;
                    }).join("\n"),
                  },
                  { label: "名前", value: name || "鈴川　樹" },
                  { label: "メールアドレス", value: email || "HALCINEMA@HAL.HLA.LA" },
                  { label: "支払い方法", value: payment === "credit" ? "クレジットカード" : "PayPay" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex">
                    <span className="text-gray-500 w-28 flex-shrink-0">{label}</span>
                    <span className="text-gray-200 whitespace-pre-line">{value}</span>
                  </div>
                ))}
              </div>
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
