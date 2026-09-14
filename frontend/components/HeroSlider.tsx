// トップページのヒーロースライダーコンポーネント
// 画像スライドを一定間隔・左右ボタン・ドットインジケーターで切り替える

"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

const AUTO_PLAY_INTERVAL = 5000;

// 表示順はキャンペーン・ニュースの並びに合わせる
const slides = [
  {
    id: "wakuwaku",
    src: "/images/hero/わくわく.png",
    alt: "春のわくわく映画キャンペーン",
    href:"/campaign/1",
  },
  {
    id: "hal-friend",
    src: "/images/hero/HAL友.png",
    alt: "HAL CINEMA友の会",
    href:"/campaign/2",
  },
  {
    id: "ladies",
    src: "/images/hero/レディース.png",
    alt: "レディースデー",
    href:"/campaign/3",
  },
  {
    id: "senior",
    src: "/images/hero/シニア.png",
    alt: "シニア割引",
    href:"/campaign/4",
  },
  {
    id: "student",
    src: "/images/hero/学生.png",
    alt: "学生割引",
    href:"/campaign/5",
  },
  {
    id: "four-dx",
    src: "/images/hero/4dx.png",
    alt: "4DXシアター",
    href:"/campaign/6",
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
    <div className="mx-auto w-full max-w-6xl px-3 py-3 md:px-4">
      <div className="relative overflow-hidden rounded-[15px] border border-[#302a1b] bg-[#0b0b0b] shadow-[0_18px_50px_rgba(0,0,0,0.38)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(217,179,90,0.2),_transparent_30%)]" />

        <Link
          href={currentSlide.href}
          className="group relative block aspect-[16/8] overflow-hidden md:aspect-[16/7]"
          aria-label={`詳細を見る: ${currentSlide.alt}`}
        >
          <div className="absolute inset-0 bg-[#0f0f0f]">
            <Image
              src={currentSlide.src}
              alt={currentSlide.alt}
              fill
              priority={current === 0}
              sizes="100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-black/35" />

          <div className="absolute left-4 top-4 z-10 rounded-full border border-[#d9b35a]/60 bg-[#120f0b]/70 px-3 py-1.5 text-[10px] font-medium tracking-[0.22em] text-[#f5d678] uppercase backdrop-blur-sm md:left-6 md:top-6 md:text-[11px]">
            Campaign
          </div>

          <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[9px] font-medium tracking-[0.14em] text-white/80 uppercase backdrop-blur-sm md:text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f5d678]" />
              Now Showing
            </div>
          </div>
        </Link>

        <button
          type="button"
          onClick={showPrev}
          className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#f5d678]/30 bg-[#0c0c0c]/70 text-2xl text-[#f5d678] shadow-lg shadow-black/30 transition hover:bg-[#141414] md:left-5"
          aria-label="前のスライド"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={showNext}
          className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#f5d678]/30 bg-[#0c0c0c]/70 text-2xl text-[#f5d678] shadow-lg shadow-black/30 transition hover:bg-[#141414] md:right-5"
          aria-label="次のスライド"
        >
          ›
        </button>
      </div>

      <div className="mt-2 flex justify-center gap-2 bg-transparent py-1">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full border transition-all duration-200 ${
              i === current
                ? "border-[#f5d678] bg-[#f5d678] shadow-[0_0_12px_rgba(245,214,120,0.75)]"
                : "border-[#555] bg-[#2a2a2a] hover:border-[#888]"
            }`}
            aria-label={`Slide ${i + 1}: ${slide.alt}`}
            aria-current={i === current ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
