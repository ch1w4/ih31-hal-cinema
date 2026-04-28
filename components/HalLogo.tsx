export default function HalLogo({ size = 80 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center gap-1" style={{ width: size * 1.5 }}>
      <svg
        width={size}
        height={size * 0.8}
        viewBox="0 0 120 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left diagonal line - red/pink */}
        <line x1="10" y1="10" x2="60" y2="86" stroke="#e83030" strokeWidth="5" strokeLinecap="round" />
        {/* Right diagonal line - blue */}
        <line x1="110" y1="10" x2="60" y2="86" stroke="#3060e0" strokeWidth="5" strokeLinecap="round" />
        {/* Top horizontal connector */}
        <line x1="25" y1="32" x2="95" y2="32" stroke="#30b030" strokeWidth="4" strokeLinecap="round" />
        {/* Small accent dots */}
        <circle cx="10" cy="10" r="4" fill="#e83030" />
        <circle cx="110" cy="10" r="4" fill="#3060e0" />
        <circle cx="60" cy="86" r="4" fill="#30b030" />
        <circle cx="25" cy="32" r="3" fill="#30b030" />
        <circle cx="95" cy="32" r="3" fill="#30b030" />
      </svg>
      <div className="text-center leading-tight">
        <div className="text-xs tracking-[0.25em] text-white font-light">HAL</div>
        <div className="text-xs tracking-[0.2em] text-white font-light">CINEMA</div>
      </div>
    </div>
  );
}
