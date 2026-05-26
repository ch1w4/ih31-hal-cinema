// トップページのヒーロースライダーコンポーネント
// 画像スライドを一定間隔・左右ボタン・ドットインジケーターで切り替える

"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const AUTO_PLAY_INTERVAL = 5000;

// 表示順はキャンペーン・ニュースの並びに合わせる
const slides = [
  {
    id: "wakuwaku",
    src: "/images/hero/わくわく.png",
    alt: "春のわくわく映画キャンペーン",
  },
  {
    id: "hal-friend",
    src: "/images/hero/HAL友.png",
    alt: "HAL CINEMA友の会",
  },
  {
    id: "ladies",
    src: "/images/hero/レディース.png",
    alt: "レディースデー",
  },
  {
    id: "senior",
    src: "/images/hero/シニア.png",
    alt: "シニア割引",
  },
  {
    id: "student",
    src: "/images/hero/学生.png",
    alt: "学生割引",
  },
  {
    id: "four-dx",
    src: "/images/hero/4dx.png",
    alt: "4DXシアター",
  },
] as const;

export default function HeroSlider() {
  // 現在表示中のスライドインデックス（0始まり）
  const [current, setCurrent] = useState(0);
  const currentSlide = slides[current];
  const lastIndex = slides.length - 1;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTO_PLAY_INTERVAL);

    return () => window.clearInterval(timer);
  }, []);

  // 前のスライドへ（先頭なら末尾にループ）
  function showPrev() {
    setCurrent((prev) => (prev === 0 ? lastIndex : prev - 1));
  }

  // 次のスライドへ（末尾なら先頭にループ）
  function showNext() {
    setCurrent((prev) => (prev + 1) % slides.length);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* スライダー本体: 高さ固定460px、overflow-hiddenで画像がはみ出ないようにする */}
      <div className="w-full relative overflow-hidden rounded-lg" style={{ height: "460px" }}>
        <div className="absolute inset-0 bg-[#0f0f0f]">
          <Image
            src={currentSlide.src}
            alt={currentSlide.alt}
            fill
            priority={current === 0}
            sizes="100vw"
            className="object-contain"
          />
        </div>

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
