/** The five bars of the TunePay sound wave on a 24-unit grid: x, height. */
const BARS = [
  [2.6, 6],
  [7.3, 11.5],
  [12, 18],
  [16.7, 11.5],
  [21.4, 6],
] as const;
const BAR_W = 2.9;

/** The TunePay mark: chalk bars with the tallest one in mint. */
export function LogoMark({
  className,
  ink = "#fffffe",
  accent = "#3ddc97",
}: {
  className?: string;
  ink?: string;
  accent?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {BARS.map(([x, h], i) => (
        <rect
          key={x}
          x={x - BAR_W / 2}
          y={12 - h / 2}
          width={BAR_W}
          height={h}
          rx={BAR_W / 2}
          fill={i === 2 ? accent : ink}
        />
      ))}
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`nav-logo ${className}`}>
      <LogoMark className="h-7 w-7" />
      TunePay
    </span>
  );
}
