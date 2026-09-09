import type { ValueUnit } from "@/lib/store";
import { formatDecimal, formatInt, formatMonthLabel, formatValue } from "@/lib/format";

type TooltipPayload = {
  dataKey?: string | number;
  value?: number;
  color?: string;
  name?: string;
};

type Props = {
  active?: boolean;
  label?: string;
  payload?: TooltipPayload[];
  unit?: ValueUnit;
};

const LABELS: Record<string, string> = {
  pieces: "Pieces",
  collectors: "Collectors",
  xtz: "XTZ",
  usd: "USD",
  avg_pieces_per_collector: "Avg pieces / collector",
  avg_usd_per_collector: "Avg USD / collector",
};

function formatEntry(key: string, value: number, unit?: ValueUnit) {
  if (key === "xtz" || key === "usd") {
    return formatValue(value, key, false);
  }
  if (key === "avg_usd_per_collector") return `$${formatDecimal(value)}`;
  if (key === "avg_pieces_per_collector") return formatDecimal(value);
  if (key === "value" && unit) return formatValue(value, unit, false);
  return formatInt(value);
}

export function ChartTooltip({ active, label, payload, unit }: Props) {
  if (!active || !payload?.length) return null;
  const heading =
    label && /^\d{4}-\d{2}$/.test(label) ? formatMonthLabel(label) : (label ?? "");

  return (
    <div className="rounded-md bg-surface-2 px-3 py-2 text-xs text-fg shadow-[var(--shadow-border)]">
      {heading ? <p className="mb-1.5 font-medium">{heading}</p> : null}
      <ul className="flex flex-col gap-1">
        {payload.map((entry) => {
          const key = String(entry.dataKey ?? entry.name ?? "");
          if (entry.value == null) return null;
          return (
            <li key={key} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 text-muted">
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: entry.color }}
                />
                {LABELS[key] ?? key}
              </span>
              <span className="font-mono tabular-nums">
                {formatEntry(key, entry.value, unit)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
