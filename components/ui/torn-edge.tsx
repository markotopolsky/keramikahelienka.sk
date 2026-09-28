// A torn-paper edge used where a solid section meets the next one.
// The path is generated from a fixed seed, so it renders identically on server and client.

const WIDTH = 1440;
const HEIGHT = 40;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function tornPath(seed: number, baseline: number) {
  const rand = seeded(seed);
  const points: string[] = [`M0 ${HEIGHT}`];
  let x = 0;
  let base = baseline;
  while (x <= WIDTH) {
    // Slow wander of the tear line, plus fine jitter for the paper fibres
    base = Math.min(baseline + 7, Math.max(baseline - 7, base + (rand() - 0.5) * 3));
    const fibre = rand() > 0.9 ? (rand() - 0.5) * 7 : 0;
    const y = base + (rand() - 0.5) * 2.2 + fibre;
    points.push(`L${Math.min(x, WIDTH).toFixed(1)} ${y.toFixed(1)}`);
    x += 3 + rand() * 9;
  }
  points.push(`L${WIDTH} ${HEIGHT}`, "Z");
  return points.join(" ");
}

type TornEdgeProps = {
  /** Tailwind text color class; the edge is painted with currentColor */
  className?: string;
  seed?: number;
};

export function TornEdge({ className = "text-sand", seed = 7 }: TornEdgeProps) {
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" aria-hidden className={`block h-10 w-full ${className}`}>
      {/* Paler, slightly higher layer reads as the frayed fringe of the tear */}
      <path d={tornPath(seed + 101, 16)} fill="currentColor" opacity={0.45} />
      <path d={tornPath(seed, 22)} fill="currentColor" />
    </svg>
  );
}
