// トップページのヒーロースライダーコンポーネント
// 2枚のスライドを左右ボタンとドットインジケーターで切り替える
//
// スライドの種類:
//   type: "campaign" → JSX + CSS グラデーションで「春のわくわく映画キャンペーン」バナーを描画
//   type: "image"    → Next.js の <Image> コンポーネントで画像ファイルを表示

"use client";
import Image from "next/image";
import { useState } from "react";

// スライドデータ: `as const` で型を narrowing し、type の文字列リテラル型を保持する
const slides = [
  {
    id: "spring-campaign",
    type: "campaign",
    alt: "春のわくわく映画キャンペーン",
  },
  {
    id: "hal-friend",
    type: "image",
    src: "/images/hero/HAL友.png",
    alt: "HAL CINEMA友の会",
  },
] as const;

export default function HeroSlider() {
  // 現在表示中のスライドインデックス（0始まり）
  const [current, setCurrent] = useState(0);
  const currentSlide = slides[current];

  // 前のスライドへ（先頭なら末尾にループ）
  function showPrev() {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }

  // 次のスライドへ（末尾なら先頭にループ）
  function showNext() {
    setCurrent((prev) => (prev + 1) % slides.length);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* スライダー本体: 高さ固定460px、overflow-hiddenで画像がはみ出ないようにする */}
      <div className="w-full relative overflow-hidden rounded-lg" style={{ height: "460px" }}>
        {currentSlide.type === "image" ? (
          // 画像スライド: fill + object-contain で縦横比を保ちつつ枠内に収める
          <div className="absolute inset-0 bg-[#0f0f0f]">
            <Image
              src={currentSlide.src}
              alt={currentSlide.alt}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
          </div>
        ) : (
          // キャンペーンスライド: 画像なしでCSSグラデーション＋テキストだけで構成
          <>
            {/* 背景グラデーション（赤→オレンジ→青のキャンペーンカラー） */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(120deg, #c0392b 0%, #e74c3c 35%, #d35400 50%, #2980b9 70%, #1a6ea8 100%)",
              }}
            />
            {/* 装飾用の半透明の円（深度感を出すため） */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute w-32 h-32 rounded-full bg-yellow-400/20 -top-8 -left-8" />
              <div className="absolute w-20 h-20 rounded-full bg-white/10 top-4 left-20" />
              <div className="absolute w-48 h-48 rounded-full bg-blue-800/30 -bottom-16 right-0" />
            </div>

            {/* キャンペーンコンテンツ */}
            <div className="relative h-full flex flex-col justify-between py-4 px-6">
              <div className="text-[10px] text-white/80 font-medium tracking-wide">
                UNITED CINEMAS GROUP クラブスパイス会員限定
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* キャンペーンタイトル（黄色×ストロークで視認性確保） */}
                  <div className="relative mb-1">
                    <div className="text-4xl font-black leading-none text-white drop-shadow-lg">
                      春の
                    </div>
                    <div
                      className="text-5xl font-black leading-none drop-shadow-lg"
                      style={{ color: "#ffe000", WebkitTextStroke: "1px #e67e22" }}
                    >
                      わくわく映画
                    </div>
                    <div className="text-3xl font-black text-white drop-shadow-lg">
                      キャンペーン
                      <span className="text-yellow-300 text-xl ml-1">!!!!</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-white/90 mt-2">
                    クラブスパイスカードにすぐ入会！<br />
                    毎週金曜1,100円 6回鑑賞で1本無料
                  </div>
                </div>

                {/* 期間バッジ */}
                <div
                  className="flex-shrink-0 ml-4 rounded border-2 border-white px-3 py-2 text-center bg-white/10"
                >
                  <div className="text-[9px] text-white/80">キャンペーン期間</div>
                  <div className="text-white font-bold text-sm">3.30</div>
                  <div className="text-white/70 text-xs">〜</div>
                  <div className="text-white font-bold text-sm">5.14<span className="text-[9px]">日</span></div>
                </div>
              </div>

              {/* フッターキャッチコピー */}
              <div
                className="text-center text-sm font-medium py-1.5 rounded"
                style={{ background: "#1a5fa8", color: "#fff" }}
              >
                ファミリーで楽しめる注目の映画を観て、プレゼントを当てよう！
              </div>
            </div>
          </>
        )}

        {/* 前へボタン */}
        <button
          type="button"
          onClick={showPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white text-2xl leading-none hover:bg-black/60 transition-colors"
          aria-label="前のスライド"
        >
          ‹
        </button>
        {/* 次へボタン */}
        <button
          type="button"
          onClick={showNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white text-2xl leading-none hover:bg-black/60 transition-colors"
          aria-label="次のスライド"
        >
          ›
        </button>
      </div>

      {/* ドットインジケーター: クリックで任意のスライドに直接ジャンプ可能 */}
      <div className="flex justify-center gap-1.5 py-3 bg-[#0f0f0f]">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrent(i)}
            className={`slider-dot ${i === current ? "active" : ""}`}
            aria-label={`Slide ${i + 1}: ${slide.alt}`}
            aria-current={i === current ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
