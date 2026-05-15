"use client";
import { useState } from "react";

const TOTAL_DOTS = 9;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="w-full">
      {/* Campaign banner */}
      <div className="w-full relative overflow-hidden" style={{ height: "280px" }}>
        {/* Background layers */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(120deg, #c0392b 0%, #e74c3c 35%, #d35400 50%, #2980b9 70%, #1a6ea8 100%)",
          }}
        />
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-32 h-32 rounded-full bg-yellow-400/20 -top-8 -left-8" />
          <div className="absolute w-20 h-20 rounded-full bg-white/10 top-4 left-20" />
          <div className="absolute w-48 h-48 rounded-full bg-blue-800/30 -bottom-16 right-0" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between py-4 px-6">
          {/* Top label */}
          <div className="text-[10px] text-white/80 font-medium tracking-wide">
            UNITED CINEMAS GROUP クラブスパイス会員限定
          </div>

          {/* Main title area */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Title */}
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

              {/* Sub text */}
              <div className="text-[10px] text-white/90 mt-2">
                クラブスパイスカードにすぐ入会！<br />
                毎週金曜1,100円 6回鑑賞で1本無料
              </div>
            </div>

            {/* Date badge */}
            <div
              className="flex-shrink-0 ml-4 rounded border-2 border-white px-3 py-2 text-center bg-white/10"
            >
              <div className="text-[9px] text-white/80">キャンペーン期間</div>
              <div className="text-white font-bold text-sm">3.30</div>
              <div className="text-white/70 text-xs">〜</div>
              <div className="text-white font-bold text-sm">5.14<span className="text-[9px">日</span></div>
            </div>
          </div>

          {/* Bottom banner */}
          <div
            className="text-center text-sm font-medium py-1.5 rounded"
            style={{ background: "#1a5fa8", color: "#fff" }}
          >
            ファミリーで楽しめる注目の映画を観て、プレゼントを当てよう！
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 py-3 bg-[#0f0f0f]">
        {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`slider-dot ${i === current ? "active" : ""}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
