const INT = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const DEC = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const COMPACT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatGrouped(value: number): string {
  if (!Number.isFinite(value)) return "";
  return INT.format(Math.round(value));
}

export function formatInt(value: number): string {
  return INT.format(value);
}

export function formatDecimal(value: number): string {
  return DEC.format(value);
}

export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) return COMPACT.format(value);
  if (Number.isInteger(value)) return INT.format(value);
  return DEC.format(value);
}

export function formatMillions(value: number): string {
  if (!Number.isFinite(value)) return "";
  return `${(value / 1_000_000).toFixed(2)}M`;
}

export function formatAxisTick(value: number): string {
  if (!Number.isFinite(value)) return "";
  if (Math.abs(value) >= 1_000) return COMPACT.format(value);
  return INT.format(Math.round(value));
}

export function formatXtz(value: number, compact = false): string {
  const body = compact ? formatCompact(value) : DEC.format(value);
  return `${body} XTZ`;
}

export function formatUsd(value: number, compact = false): string {
  const body = compact ? formatCompact(value) : DEC.format(value);
  return `$${body}`;
}

export function formatValue(value: number, unit: "xtz" | "usd", compact = false): string {
  return unit === "usd" ? formatUsd(value, compact) : formatXtz(value, compact);
}

export function formatMonthLabel(ym: string): string {
  const [year, month] = ym.split("-");
  if (!year || !month) return ym;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  if (Number.isNaN(date.getTime())) return ym;
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatMonthTick(ym: string): string {
  const [year, month] = ym.split("-");
  if (!year || !month) return ym;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  if (Number.isNaN(date.getTime())) return ym;
  const mon = date.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  return `${mon} ’${year.slice(2)}`;
}

export function formatPct(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatUpdatedAt(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(date);
}
