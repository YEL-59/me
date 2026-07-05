export default function MapCard() {
  const dots: { x: number; y: number; active?: boolean }[] = [];

  for (let row = 0; row < 14; row++) {
    for (let col = 0; col < 28; col++) {
      const x = col * 11 + 8;
      const y = row * 11 + 8;

      const isLand =
        (col > 3 && col < 9 && row > 2 && row < 7) ||
        (col > 10 && col < 16 && row > 3 && row < 9) ||
        (col > 18 && col < 22 && row > 5 && row < 8) ||
        (col > 6 && col < 13 && row > 8 && row < 11) ||
        (col > 16 && col < 21 && row > 2 && row < 5);

      if (isLand) {
        dots.push({
          x,
          y,
          active: col === 20 && row === 6,
        });
      }
    }
  }

  return (
    <div className="card relative h-full overflow-hidden rounded-xl">
      <svg viewBox="0 0 320 200" className="h-full w-full">
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={dot.active ? 4 : 1.5}
            fill={dot.active ? "#8b5cf6" : "var(--dot-inactive)"}
          />
        ))}
        {dots
          .filter((d) => d.active)
          .map((dot, i) => (
            <circle
              key={`glow-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={10}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth={0.8}
              opacity={0.5}
              className="animate-pulse"
            />
          ))}
      </svg>

      <button
        className="absolute bottom-3 left-3 max-w-[55%] text-left text-[10px] transition-opacity hover:opacity-80"
        style={{ color: "var(--text-secondary)" }}
      >
        <span className="mr-1">🇧🇩</span>
        Based in Hatirjheel, Noyatola, Dhaka
      </button>

      <p
        className="absolute right-3 bottom-3 max-w-[42%] text-right text-[9px] leading-tight"
        style={{ color: "var(--text-tertiary)" }}
      >
        If you&apos;re in Dhaka, let&apos;s grab a coffee.
      </p>
    </div>
  );
}
