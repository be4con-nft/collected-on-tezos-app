import { Card } from "@/components/ui/card";
import { KpiStrip, ytdKpiItems } from "@/components/kpi-strip";
import { YoyChip } from "@/components/yoy-chip";
import { formatCompact, formatDecimal, formatInt } from "@/lib/format";
import { formatYtdHeading, type YtdSet, type YtdWindow } from "@/lib/monthly";

const FIELDS = [
  { key: "collectors", label: "Collectors" },
  { key: "sellers", label: "Sellers" },
  { key: "pieces", label: "Pieces" },
  { key: "xtz", label: "XTZ" },
  { key: "usd", label: "USD" },
  { key: "avg_pieces_per_collector", label: "Avg pieces / collector" },
  { key: "avg_usd_per_collector", label: "Avg USD / collector" },
] as const;

function formatField(key: (typeof FIELDS)[number]["key"], row: YtdWindow): string {
  switch (key) {
    case "collectors":
    case "sellers":
    case "pieces":
      return formatInt(row[key]);
    case "xtz":
      return formatCompact(row.xtz);
    case "usd":
      return `$${formatCompact(row.usd)}`;
    case "avg_pieces_per_collector":
      return formatDecimal(row.avg_pieces_per_collector);
    case "avg_usd_per_collector":
      return `$${formatDecimal(row.avg_usd_per_collector)}`;
  }
}

function Stack({ row }: { row: YtdWindow }) {
  return (
    <Card className="flex flex-col gap-4 rounded-2xl p-5">
      <h2 className="font-display text-2xl tracking-tight">{formatYtdHeading(row)}</h2>
      <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
        {FIELDS.map((field) => (
          <div key={field.key} className="contents">
            <dt className="text-muted">{field.label}</dt>
            <dd className="font-mono text-base tabular-nums text-fg">
              {formatField(field.key, row)}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

export function YtdView({ ytd, graphic }: { ytd: YtdSet | null; graphic: boolean }) {
  if (!ytd) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted">YTD series is not in this file.</p>
      </Card>
    );
  }

  const chips = [
    { key: "collectors", label: "Collectors", value: ytd.yoy_pct.collectors },
    { key: "pieces", label: "Pieces", value: ytd.yoy_pct.pieces },
    { key: "xtz", label: "XTZ", value: ytd.yoy_pct.xtz },
    { key: "usd", label: "USD", value: ytd.yoy_pct.usd },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <KpiStrip items={ytdKpiItems(ytd)} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Stack row={ytd.current} />
        <Stack row={ytd.prior} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {chips.map((chip) => (
          <Card key={chip.key} className="flex flex-col gap-2 rounded-xl p-4">
            <p className="text-xs font-medium tracking-wide text-muted">{chip.label} YoY</p>
            <YoyChip value={chip.value} size="lg" />
          </Card>
        ))}
      </div>

      {graphic ? null : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted">
                    Metric
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium tracking-wide text-muted">
                    {formatYtdHeading(ytd.current)}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium tracking-wide text-muted">
                    {formatYtdHeading(ytd.prior)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {FIELDS.map((field) => (
                  <tr key={field.key} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3">{field.label}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">
                      {formatField(field.key, ytd.current)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">
                      {formatField(field.key, ytd.prior)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <p className="text-sm text-muted">
        Same months last year. Collectors are unique wallets in the window, not the sum of months.
      </p>
    </div>
  );
}
