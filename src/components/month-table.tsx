import { Card } from "@/components/ui/card";
import { formatDecimal, formatInt, formatMonthLabel, formatUsd } from "@/lib/format";
import type { MonthRow } from "@/lib/monthly";
import { cn } from "@/lib/utils";

const COLUMNS = [
  { key: "month", label: "Month", align: "left" },
  { key: "pieces", label: "Pieces", align: "right" },
  { key: "sales", label: "Sales", align: "right" },
  { key: "xtz", label: "XTZ", align: "right" },
  { key: "usd", label: "USD", align: "right" },
  { key: "collectors", label: "Collectors", align: "right" },
  { key: "sellers", label: "Sellers", align: "right" },
  { key: "avg_pieces_per_collector", label: "Avg pieces", align: "right" },
  { key: "avg_usd_per_collector", label: "Avg USD", align: "right" },
] as const;

function cell(row: MonthRow, key: (typeof COLUMNS)[number]["key"]): string {
  switch (key) {
    case "month":
      return formatMonthLabel(row.month);
    case "pieces":
    case "sales":
    case "collectors":
    case "sellers":
      return formatInt(row[key]);
    case "xtz":
      return formatDecimal(row.xtz);
    case "usd":
      return formatUsd(row.usd);
    case "avg_pieces_per_collector":
      return formatDecimal(row.avg_pieces_per_collector);
    case "avg_usd_per_collector":
      return formatUsd(row.avg_usd_per_collector);
  }
}

export function MonthTable({ months }: { months: MonthRow[] }) {
  const last = months[months.length - 1]?.month;

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-left">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-xs font-medium tracking-wide text-muted whitespace-nowrap",
                    col.align === "right" && "text-right",
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {months.map((row) => (
              <tr
                key={row.month}
                className={cn(
                  "border-b border-border last:border-b-0",
                  row.month === last && "bg-accent/5",
                )}
              >
                {COLUMNS.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 whitespace-nowrap",
                      col.align === "right" && "text-right font-mono tabular-nums",
                      col.key === "month" && "font-medium text-fg",
                    )}
                  >
                    {cell(row, col.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
