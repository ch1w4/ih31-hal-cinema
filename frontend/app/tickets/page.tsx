// チケット購入ページ
// 映画選択 → 時間帯選択 → 座席選択 → チケット種別 → お客様情報 → 購入確認 → 完了
// の7ステップウィザード形式で購入フローを管理する。
// /movies/[id] ページからURLパラメータ（movieId・date・time・screen）を受け取った場合は
// 座席選択ステップから開始する。
"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { movies, mockSchedules } from "@/lib/mockData";

// ウィザードの各ステップを表すユニオン型
type Step = "select-movie" | "select-time" | "seat" | "ticket-type" | "customer-info" | "confirm" | "complete";

// 座席の状態。empty=空席、purchased=購入済み、selected=今回選択中
type SeatStatus = "empty" | "purchased" | "selected";

// スクリーンの物理的な座席配置を表す設定型
type ScreenConfig = {
  name: string;          // 表示名（例：大スクリーン）
  capacity: number;      // 総座席数
  topRows: string[];     // スクリーン寄りの上段行ラベル（例：["A","B","C"]）
  topCols: number;       // 上段の列数
  bottomRows: string[];  // 下段行ラベル
  bottomCols: number;    // 下段の列数（大スクリーンは通路を挟んだ合計数）
  bottomLeftBlock: number | null; // 大スクリーンのみ：通路左側の列数（nullなら通路なし）
  exitSide: "left" | "right";    // 出入り口の位置（中スクリーンは左、大・小は右）
};

// スクリーン種別ごとの座席配置定義
// 大スクリーン：A-C行×16列 ＋ D-I行×13列（左2列＋通路＋右11列）
// 中スクリーン：A-C行×15列 ＋ D-H行×15列（通路なし）
// 小スクリーン：A-C行×10列 ＋ D-G行×10列（通路なし）
const SCREEN_CONFIGS: Record<"large" | "medium" | "small", ScreenConfig> = {
  large: {
    name: "大スクリーン",
    capacity: 200,
    topRows: ["A", "B", "C"],
    topCols: 16,
    bottomRows: ["D", "E", "F", "G", "H", "I"],
    bottomCols: 13,
    bottomLeftBlock: 2,
    exitSide: "right",
  },
  medium: {
    name: "中スクリーン",
    capacity: 120,
    topRows: ["A", "B", "C"],
    topCols: 15,
    bottomRows: ["D", "E", "F", "G", "H"],
    bottomCols: 15,
    bottomLeftBlock: null,
    exitSide: "left",
  },
  small: {
    name: "小スクリーン",
    capacity: 70,
    topRows: ["A", "B", "C"],
    topCols: 10,
    bottomRows: ["D", "E", "F", "G"],
    bottomCols: 10,
    bottomLeftBlock: null,
    exitSide: "right",
  },
};

// スクリーン名の文字（大・中・小）からスクリーン種別を判定する
// mockData の screen 名が「大スクリーン1」「中スクリーン1」「小スクリーン1」の形式であることを前提とする
function getScreenType(screenName: string): "large" | "medium" | "small" {
  if (screenName.includes("大")) return "large";
  if (screenName.includes("中")) return "medium";
  if (screenName.includes("小")) return "small";
  return "large";
}

// ScreenConfig を元に全座席の初期状態マップを生成する
// キーは "行-列" 形式（例："A-1"）、値は全て "empty"
function buildSeatMap(config: ScreenConfig): Record<string, SeatStatus> {
  const map: Record<string, SeatStatus> = {};
  const allRows = [...config.topRows, ...config.bottomRows];
  for (const row of allRows) {
    const isTop = config.topRows.includes(row);
    const cols = isTop ? config.topCols : config.bottomCols;
    for (let c = 1; c <= cols; c++) {
      map[`${row}-${c}`] = "empty";
    }
  }
  return map;
}

// チケット種別と料金の定義
const ticketTypes = [
  { id: "general", label: "一般", price: 1900 },
  { id: "student", label: "大学生・専門学生", price: 1500 },
  { id: "senior", label: "シニア（60歳以上）", price: 1200 },
  { id: "child", label: "小学生以下", price: 1000 },
];

// HALカード・水曜割引の選択肢（現在はUI表示のみ、料金計算には未反映）
const halDiscounts = [
  { id: "no", label: "HALカードと水曜割引なし" },
  { id: "yes", label: "HALカードと水曜割引あり" },
];

// パンくずナビに表示するステップの順序と表示名
const stepLabels: { key: Step; label: string }[] = [
  { key: "select-movie", label: "映画選択" },
  { key: "select-time", label: "時間帯選択" },
  { key: "seat", label: "座席選択" },
  { key: "ticket-type", label: "チケット種別" },
  { key: "customer-info", label: "お客様情報" },
  { key: "confirm", label: "購入確認" },
  { key: "complete", label: "完了" },
];

// チケット購入ウィザードの本体コンポーネント
// useSearchParams を使用するため Suspense でラップする必要がある
function TicketsContent() {
  // /movies/[id] からのリンクでURLパラメータが渡された場合は座席選択から開始する
  const searchParams = useSearchParams();
  const initMovieId = searchParams.get("movieId") ?? "";
  const initDate = searchParams.get("date") ?? "";
  const initTime = searchParams.get("time") ?? "";
  const initScreen = searchParams.get("screen") ?? "";
  const initStep: Step =
    initMovieId && initDate && initTime ? "seat" :
    initMovieId ? "select-time" :
    "select-movie";

  // ウィザードの現在ステップ
  const [step, setStep] = useState<Step>(initStep);

  // 各ステップで選択した値
  const [selectedMovieId, setSelectedMovieId] = useState(initMovieId);
  const [selectedDate, setSelectedDate] = useState(initDate);
  const [selectedScreen, setSelectedScreen] = useState(initScreen);
  const [selectedTime, setSelectedTime] = useState(initTime);

  // 選択中スクリーンのレイアウト設定（selectedScreen 変化に追従）
  const screenConfig = SCREEN_CONFIGS[getScreenType(selectedScreen)];

  // 座席マップ：キー "行-列"、値は SeatStatus
  const [seatMap, setSeatMap] = useState<Record<string, SeatStatus>>(() => buildSeatMap(screenConfig));

  // 座席ごとに選択されたチケット種別ID（例：{ "A-1": "student", "A-2": "general" }）
  const [ticketSelections, setTicketSelections] = useState<Record<string, string>>({});
  const [halDiscount, setHalDiscount] = useState("no");

  // お客様情報フォームの各フィールド
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastNameKana, setLastNameKana] = useState("");
  const [firstNameKana, setFirstNameKana] = useState("");
  const [gender, setGender] = useState<"男" | "女" | "どちらでもない">("男");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [payment, setPayment] = useState<"credit" | "paypay">("credit");

  // 選択中の映画オブジェクト
  const movie = movies.find((m) => m.id === selectedMovieId);

  // 選択中映画のスケジュール（未定義の場合はid=1のスケジュールをフォールバック）
  const schedules = mockSchedules[selectedMovieId] || mockSchedules["1"] || [];

  // 現在 "selected" 状態の座席IDリスト
  const selectedSeats = Object.entries(seatMap)
    .filter(([, s]) => s === "selected")
    .map(([id]) => id);

  // パンくずナビでの現在位置インデックス
  const currentIdx = stepLabels.findIndex((s) => s.key === step);

  // 選択座席の合計金額（ticketSelections に未設定の席は一般料金で計算）
  const totalPrice = selectedSeats.reduce((sum, id) => {
    const t = ticketTypes.find((t) => t.id === (ticketSelections[id] || "general"));
    return sum + (t?.price ?? 1900);
  }, 0);

  // 座席ボタンをクリックしたときの状態トグル
  // 購入済み座席（blue）は変更不可
  function toggleSeat(id: string) {
    setSeatMap((prev) => {
      const cur = prev[id];
      if (cur === "purchased") return prev;
      return { ...prev, [id]: cur === "selected" ? "empty" : "selected" };
    });
  }

  // 個々の座席を表すボタンコンポーネント（TicketsContent 内でのみ使用）
  // gray=空席、red=選択中、blue=購入済み
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
      {/* パンくずナビ：完了済みステップに ✓ を表示 */}
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
            {movies.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMovieId(m.id);
                  setSelectedDate("");
                  setSelectedTime("");
                  setSelectedScreen("");
                  // 映画選択時は大スクリーンの初期マップをセット（時間帯選択後に更新される）
                  setSeatMap(buildSeatMap(SCREEN_CONFIGS.large));
                  setStep("select-time");
                }}
                className="w-full flex items-center gap-3 p-3 rounded border border-[#333] bg-[#1a1a1a] hover:border-[#666] transition-colors text-left"
              >
                <div className="flex-shrink-0 rounded overflow-hidden" style={{ width: "40px", aspectRatio: "2/3" }}>
                  {m.poster ? (
                    <img src={m.poster} alt={m.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full" style={{ background: `linear-gradient(160deg, ${m.posterColor} 0%, #111 100%)` }} />
                  )}
                </div>
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
      {/* 日付を選ぶと、その日のスクリーンごとの上映時間一覧が表示される */}
      {step === "select-time" && movie && (
        <div>
          {/* 選択中映画のサマリーバー */}
          <div className="flex items-center gap-3 border border-[#333] rounded p-3 bg-[#1a1a1a] mb-5">
            <div className="flex-shrink-0 rounded overflow-hidden" style={{ width: "36px", aspectRatio: "2/3" }}>
              {movie.poster ? (
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" style={{ background: `linear-gradient(160deg, ${movie.posterColor} 0%, #111 100%)` }} />
              )}
            </div>
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

          {/* 日付選択後に時間帯一覧を表示（スクリーンごとにグループ化） */}
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
                            // スクリーン名から種別を判定し、対応する座席マップを生成する
                            setSeatMap(buildSeatMap(SCREEN_CONFIGS[getScreenType(slot.screen)]));
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
          {/* 選択内容サマリー */}
          <div className="text-sm text-gray-400 border border-[#333] rounded p-3 bg-[#1a1a1a] mb-4 space-y-0.5">
            <div>{movie.title}</div>
            <div>{selectedDate}　{selectedTime}　{selectedScreen}</div>
          </div>

          {/* 座席色の凡例 */}
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

          {/* 座席マップ本体（赤枠） */}
          <div className="border-2 border-red-700 rounded p-4 bg-[#111] mb-4 overflow-x-auto">
            {/* スクリーンを表す白いバー */}
            <div className="flex justify-center mb-1">
              <div className="bg-white rounded h-2" style={{ width: "55%" }} />
            </div>
            <div className="text-center text-sm text-gray-400 mb-4">{selectedScreen}</div>

            {/* 座席全体を中央揃えにするコンテナ */}
            <div className="flex flex-col items-center">
              {/* 上段（スクリーン寄り）：topRows × topCols の格子 */}
              <div className="mb-1">
                <div className="flex items-center mb-1">
                  <span className="w-6" />
                  <div className="flex flex-1 justify-between text-sm text-gray-500">
                    <span>1</span>
                    <span>{screenConfig.topCols}</span>
                  </div>
                  <span className="w-6" />
                </div>
                {screenConfig.topRows.map((row) => (
                  <div key={row} className="flex items-center gap-1 mb-1">
                    <span className="text-sm text-gray-400 w-5 text-right">{row}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: screenConfig.topCols }, (_, c) => (
                        <SeatButton key={c} id={`${row}-${c + 1}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400 w-5 ml-1">{row}</span>
                  </div>
                ))}
              </div>

              {/* 上段・下段の間のスペース（劇場の通路に相当） */}
              <div className="my-3" />

              {/* 下段：bottomRows × bottomCols の格子
                  大スクリーンのみ bottomLeftBlock で左ブロックを分割し、通路（w-4）を挟む */}
              <div>
                {/* 列番号ヘッダー（出入り口インジケーターと同じflexに入れると↑の位置がずれるため分離） */}
                <div className="flex items-center mb-1">
                  <span className="w-5" />
                  <div className="text-sm text-gray-500 ml-0.5">1</div>
                  <div className="flex-1" />
                  <div className="text-sm text-gray-500">{screenConfig.bottomCols}</div>
                  <span className="w-5 ml-1" />
                </div>

                {/* 下段の行 + 出入り口インジケーターを横並びにする */}
                <div className="flex items-stretch gap-2">
                  {/* 中スクリーンは出入り口が左側 */}
                  {screenConfig.exitSide === "left" && (
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-gray-500 text-xs leading-none">↑</span>
                      <div className="border-l border-gray-500 w-px flex-1" />
                      <div className="text-xs text-gray-400" style={{ writingMode: "vertical-rl" }}>出入り口</div>
                    </div>
                  )}

                  <div>
                    {screenConfig.bottomRows.map((row) => (
                      <div key={row} className="flex items-center gap-1 mb-1">
                        <span className="text-sm text-gray-400 w-5 text-right">{row}</span>
                        {screenConfig.bottomLeftBlock !== null ? (
                          // 大スクリーン：左ブロック（2席）＋通路＋右ブロック（11席）
                          <>
                            <div className="flex gap-0.5">
                              {Array.from({ length: screenConfig.bottomLeftBlock }, (_, c) => (
                                <SeatButton key={c} id={`${row}-${c + 1}`} />
                              ))}
                            </div>
                            <div className="w-4" /> {/* 通路 */}
                            <div className="flex gap-0.5">
                              {Array.from({ length: screenConfig.bottomCols - screenConfig.bottomLeftBlock }, (_, c) => (
                                <SeatButton key={c} id={`${row}-${c + screenConfig.bottomLeftBlock! + 1}`} />
                              ))}
                            </div>
                          </>
                        ) : (
                          // 中・小スクリーン：通路なし
                          <div className="flex gap-0.5">
                            {Array.from({ length: screenConfig.bottomCols }, (_, c) => (
                              <SeatButton key={c} id={`${row}-${c + 1}`} />
                            ))}
                          </div>
                        )}
                        <span className="text-sm text-gray-400 w-5 ml-1">{row}</span>
                      </div>
                    ))}
                  </div>

                  {/* 大・小スクリーンは出入り口が右側 */}
                  {screenConfig.exitSide === "right" && (
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-gray-500 text-xs leading-none">↑</span>
                      <div className="border-l border-gray-500 w-px flex-1" />
                      <div className="text-xs text-gray-400" style={{ writingMode: "vertical-rl" }}>出入り口</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 座席数と選択中の座席IDチップ */}
            <div className="flex items-center gap-4 mt-4 border-t border-[#333] pt-3">
              <div className="text-sm text-gray-400">
                <div>座席数</div>
                <div className="font-bold text-white">{screenConfig.capacity}席</div>
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
      {/* 選択した座席ごとに種別（一般・学生・シニア・子供）を設定し、合計金額を算出する */}
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
            {/* 座席ごとに種別ドロップダウンを表示 */}
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

          {/* HALカード・水曜割引の選択（現在は見た目のみ） */}
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
      {/* 氏名・性別・電話番号・メールアドレス・支払い方法を収集する */}
      {step === "customer-info" && (
        <div className="space-y-0">
          {/* 氏名セクション（漢字・フリガナ） */}
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

          {/* 電話番号とメールアドレスの両方が入力済みの場合のみ次へ進める */}
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

      {/* ── STEP 7: 購入完了 ── */}
      {/* 予約番号は Math.random で生成したモック値（本番では API から取得する） */}
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
    </main>
  );
}

// useSearchParams を使う TicketsContent を Suspense でラップする
// Next.js App Router では useSearchParams は Suspense バウンダリ内でのみ使用可能
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
