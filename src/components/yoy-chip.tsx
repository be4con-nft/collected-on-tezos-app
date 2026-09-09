import { formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";

export function YoyChip({
  value,
  size = "sm",
}: {
  value: number | undefined;
  size?: "sm" | "lg";
}) {
  if (value == null || !Number.isFinite(value)) return null;
  const tone =
    value > 0 ? "text-accent" : value < 0 ? "text-danger" : "text-muted";
  return (
    <span
      className={cn(
        "font-mono tabular-nums",
        size === "lg" ? "text-2xl leading-none" : "text-sm",
        tone,
      )}
      aria-label={`Year over year ${formatPct(value)}`}
    >
      {formatPct(value)}
    </span>
  );
}
