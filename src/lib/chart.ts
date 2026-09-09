export const CHART_TICK = {
  fill: "var(--color-muted)",
  fontSize: 11,
  fontFamily: "IBM Plex Mono, monospace",
};

export function yearStartTicks(months: Array<{ month: string }>): string[] {
  const keys = months.map((row) => row.month);
  const ticks = keys.filter((month) => month.endsWith("-01"));
  if (ticks.length > 0) return ticks;
  return keys[0] ? [keys[0]] : [];
}

export function monthAxisTick(ym: string): string {
  return ym.slice(0, 4);
}

export function logDomain(values: number[]): [number, number] {
  const positive = values.filter((value) => value > 0);
  const dataMin = positive.length ? Math.min(...positive) : 100_000;
  const dataMax = positive.length ? Math.max(...positive) : 100_000;
  const min = Math.min(100_000, dataMin);
  const max = Math.max(dataMax * 1.15, min * 2);
  return [min, max];
}

export function logTicks(min: number, max: number): number[] {
  const steps = [
    100_000, 200_000, 400_000, 800_000, 1_000_000, 2_000_000, 4_000_000, 8_000_000, 16_000_000,
  ];
  return steps.filter((value) => value >= min && value <= max);
}
