import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { YoyChip } from "@/components/yoy-chip";
import {
  formatDecimal,
  formatInt,
  formatMillions,
  formatMonthLabel,
} from "@/lib/format";
import { formatYtdHeading, type MonthRow, type YtdSet } from "@/lib/monthly";

export type KpiItem = {
  key: string;
  label: string;
  value: string;
  hint: string;
  detail: string;
  yoy?: number;
};

export function monthlyKpiItems(last: MonthRow): KpiItem[] {
  const lastLabel = formatMonthLabel(last.month);
  return [
    {
      key: "pieces",
      label: "Pieces",
      value: formatInt(last.pieces),
      hint: lastLabel,
      detail: formatInt(last.pieces),
    },
    {
      key: "collectors",
      label: "Collectors",
      value: formatInt(last.collectors),
      hint: `${lastLabel} · wallets that bought this month`,
      detail: `${formatInt(last.collectors)} unique wallets in ${lastLabel}`,
    },
    {
      key: "xtz",
      label: "XTZ",
      value: formatInt(Math.round(last.xtz)),
      hint: lastLabel,
      detail: `${formatDecimal(last.xtz)} XTZ`,
    },
    {
      key: "usd",
      label: "USD",
      value: `$${formatInt(Math.round(last.usd))}`,
      hint: lastLabel,
      detail: `$${formatDecimal(last.usd)}`,
    },
    {
      key: "avg-pieces",
      label: "Avg pieces / collector",
      value: formatDecimal(last.avg_pieces_per_collector),
      hint: lastLabel,
      detail: `${formatDecimal(last.avg_pieces_per_collector)} in ${lastLabel}`,
    },
    {
      key: "avg-usd",
      label: "Avg USD / collector",
      value: `$${formatDecimal(last.avg_usd_per_collector)}`,
      hint: lastLabel,
      detail: `$${formatDecimal(last.avg_usd_per_collector)} in ${lastLabel}`,
    },
  ];
}

export function ytdKpiItems(ytd: YtdSet): KpiItem[] {
  const hint = `${formatYtdHeading(ytd.current)} vs ${formatYtdHeading(ytd.prior)}`;
  const current = ytd.current;
  const yoy = ytd.yoy_pct;
  return [
    {
      key: "pieces",
      label: "Pieces",
      value: formatInt(current.pieces),
      hint,
      detail: formatInt(current.pieces),
      yoy: yoy.pieces,
    },
    {
      key: "collectors",
      label: "Collectors",
      value: formatInt(current.collectors),
      hint,
      detail: formatInt(current.collectors),
      yoy: yoy.collectors,
    },
    {
      key: "xtz",
      label: "XTZ",
      value: formatMillions(current.xtz),
      hint,
      detail: `${formatDecimal(current.xtz)} XTZ`,
      yoy: yoy.xtz,
    },
    {
      key: "usd",
      label: "USD",
      value: `$${formatMillions(current.usd)}`,
      hint,
      detail: `$${formatDecimal(current.usd)}`,
      yoy: yoy.usd,
    },
    {
      key: "avg-pieces",
      label: "Avg pieces / collector",
      value: formatDecimal(current.avg_pieces_per_collector),
      hint,
      detail: formatDecimal(current.avg_pieces_per_collector),
      yoy: yoy.avg_pieces_per_collector,
    },
    {
      key: "avg-usd",
      label: "Avg USD / collector",
      value: `$${formatDecimal(current.avg_usd_per_collector)}`,
      hint,
      detail: `$${formatDecimal(current.avg_usd_per_collector)}`,
      yoy: yoy.avg_usd_per_collector,
    },
  ];
}

export function KpiStrip({ items }: { items: KpiItem[] }) {
  return (
    <section className="stagger-in grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => (
        <Tooltip key={item.key}>
          <TooltipTrigger asChild>
            <Card className="flex h-full flex-col rounded-xl p-4">
              <p className="text-xs font-medium tracking-wide text-muted">{item.label}</p>
              <p className="mt-2 font-mono text-2xl leading-none tabular-nums tracking-tight text-fg">
                {item.value}
              </p>
              {item.yoy != null ? (
                <p className="mt-1.5">
                  <YoyChip value={item.yoy} />
                </p>
              ) : null}
              <p className="mt-2 text-xs text-subtle">{item.hint}</p>
            </Card>
          </TooltipTrigger>
          <TooltipContent>{item.detail}</TooltipContent>
        </Tooltip>
      ))}
    </section>
  );
}
