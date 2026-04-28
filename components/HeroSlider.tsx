"use client";
import { useState } from "react";
import Link from "next/link";

type Slide = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  period: string;
  bgGradient: string;
  accentColor: string;
};

const slides: Slide[] = [
  {
    id: 1,
    title: "春のわくわく映画キャンペーン",
    subtitle: "クラブスパイス会員限定",
    description: "ファミリーで楽しめる注目の映画を観て、プレゼントを当てよう！",
    period: "3.3(金)〜5.14(日)",
    bgGradient: "linear-gradient(135deg, #c0392b 0%, #e74c3c 30%, #3498db 70%, #2980b9 100%)",
    accentColor: "#f39c12",
  },
  {
    id: 2,
    title: "カラダ探し",
    subtitle: "10月14日(土) 公開",
    description: "毎夜繰り返される悪夢の中で、彼らは「カラダ」を探し続ける。",
    period: "公開期間: 10.14〜12.24",
    bgGradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    accentColor: "#e94560",
  },
  {
    id: 3,
    title: "銀河の果てで",
    subtitle: "壮大なSF超大作",
    description: "人類最後の宇宙探検隊が未知の銀河の果てで遭遇する冒険。",
    period: "公開中",
    bgGradient: "linear-gradient(135deg, #0a0a2e 0%, #1a1a5e 50%, #2a2a8e 100%)",
    accentColor: "#00d2ff",
  },
  {
    id: 4,
    title: "4DXシアター NEW OPEN",
    subtitle: "体感型映画体験",
    description: "座席が動く！風が吹く！水しぶき！臨場感あふれる4DX体験。",
    period: "2024年1月オープン",
    bgGradient: "linear-gradient(135deg, #1a2a1a 0%, #2a3a2a 50%, #0a4a0a 100%)",
    accentColor: "#2ecc71",
  },
  {
    id: 5,
    title: "HALシネマ友の会 会員募集中",
    subtitle: "年会費無料・特典満載",
    description: "毎月1,000円割引クーポン＋ポイントでお得に映画を楽しもう！",
    period: "随時受付中",
    bgGradient: "linear-gradient(135deg, #2a1a0a 0%, #3a2a1a 50%, #4a3a2a 100%)",
    accentColor: "#f39c12",
  },
  {
    id: 6,
    title: "レディースデー 毎週水曜日",
    subtitle: "女性限定 1,100円",
    description: "毎週水曜日は女性のお客様が特別料金でご鑑賞いただけます。",
    period: "毎週水曜日",
    bgGradient: "linear-gradient(135deg, #2a0a2a 0%, #3a1a3a 50%, #5a1a5a 100%)",
    accentColor: "#ff69b4",
  },
  {
    id: 7,
    title: "最後の侍",
    subtitle: "大河時代劇",
    description: "江戸時代末期、時代の流れに逆らう一人の侍の生きざまを描く。",
    period: "公開中",
    bgGradient: "linear-gradient(135deg, #2a1a0a 0%, #4a2a0a 50%, #6a3a0a 100%)",
    accentColor: "#e74c3c",
  },
  {
    id: 8,
    title: "シネマ美食フェア",
    subtitle: "フード＆ドリンク特集",
    description: "映画と一緒に楽しむ特製ポップコーン＆ドリンクセット販売中！",
    period: "期間限定",
    bgGradient: "linear-gradient(135deg, #1a0a0a 0%, #2a1a1a 50%, #3a2a0a 100%)",
    accentColor: "#e67e22",
  },
  {
    id: 9,
    title: "夢を追いかけて",
    subtitle: "青春音楽映画",
    description: "音楽の夢を諦めかけた若者たちが、バンドを組んで再挑戦する。",
    period: "公開中",
    bgGradient: "linear-gradient(135deg, #1a0a2a 0%, #2a1a4a 50%, #3a2a6a 100%)",
    accentColor: "#9b59b6",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="w-full">
      <div
        className="w-full relative overflow-hidden"
        style={{ height: "320px" }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-500 flex items-center justify-center p-8"
            style={{
              background: slide.bgGradient,
              opacity: i === current ? 1 : 0,
              pointerEvents: i === current ? "auto" : "none",
            }}
          >
            <div className="text-center max-w-2xl">
              <div
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: slide.accentColor,
                  border: `1px solid ${slide.accentColor}`,
                }}
              >
                {slide.subtitle}
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight"
              >
                {slide.title}
              </h2>
              <p className="text-sm text-gray-300 mb-3">{slide.description}</p>
              <div
                className="text-sm font-medium"
                style={{ color: slide.accentColor }}
              >
                {slide.period}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 py-4 bg-[#0f0f0f]">
        {slides.map((_, i) => (
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
