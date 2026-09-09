import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/chart-tooltip";
import { YoyChip } from "@/components/yoy-chip";
import { CHART_TICK, logDomain, logTicks } from "@/lib/chart";
import { formatAxisTick, formatCompact, formatDecimal, formatInt, formatUsd } from "@/lib/format";
import type { YearRow } from "@/lib/monthly";
import { valueOf } from "@/lib/monthly";
import type { ValueUnit } from "@/lib/store";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

function yearHeading(row: YearRow): string {
  if (row.label) return row.label;
  return row.months === 12 ? String(row.year) : `${row.year} YTD`;
}

function yearCaption(row: YearRow): string {
  return row.months === 12 ? "Full year" : `${row.months} closed months`;
}

function YearStrip({ years }: { years: YearRow[] }) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {years.map((year) => (
        <Card key={year.year} className="flex min-w-0 flex-col gap-3 overflow-hidden rounded-xl p-4">
          <div>
            <p className="font-display text-xl leading-tight text-fg">{yearHeading(year)}</p>
            <p className="text-xs text-subtle">{yearCaption(year)}</p>
          </div>
          <dl className="flex flex-col gap-2 text-sm">
            <Stat label="Collectors" value={formatInt(year.collectors)} yoy={year.yoy?.collectors_pct} />
            <Stat label="Sellers" value={formatInt(year.sellers)} yoy={year.yoy?.sellers_pct} />
            <Stat label="Pieces" value={formatInt(year.pieces)} yoy={year.yoy?.pieces_pct} />
            <Stat label="XTZ" value={formatCompact(year.xtz)} yoy={year.yoy?.xtz_pct} />
            <Stat label="USD" value={`$${formatCompact(year.usd)}`} yoy={year.yoy?.usd_pct} />
            <Stat label="Avg pieces" value={formatDecimal(year.avg_pieces_per_collector)} />
            <Stat label="Avg USD" value={`$${formatDecimal(year.avg_usd_per_collector)}`} />
          </dl>
        </Card>
      ))}
    </section>
  );
}

function Stat({
  label,
  value,
  yoy,
}: {
  label: string;
  value: string;
  yoy?: number;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="flex min-w-0 flex-wrap items-baseline justify-end gap-x-2 font-mono tabular-nums text-fg">
        <span className="truncate">{value}</span>
        <YoyChip value={yoy} />
      </dd>
    </div>
  );
}

function YearBar({
  title,
  hint,
  years,
  dataKey,
  unit,
  log,
}: {
  title: string;
  hint: string;
  years: YearRow[];
  dataKey: "collectors" | "pieces" | "value";
  unit?: ValueUnit;
  log?: boolean;
}) {
  const reduce = useReducedMotion();
  const data = years.map((row) => ({
    ...row,
    value: valueOf(row, unit ?? "xtz"),
    tick: row.months === 12 ? String(row.year) : `${row.year} YTD`,
  }));
  const series = data.map((row) => (dataKey === "value" ? row.value : row[dataKey]));
  const [logMin, logMax] = logDomain(series);
  const ticks = log ? logTicks(logMin, logMax) : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{hint}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-52 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="tick"
                tick={CHART_TICK}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
                interval={0}
              />
              <YAxis
                scale={log ? "log" : "auto"}
                domain={log ? [logMin, logMax] : ["auto", "auto"]}
                ticks={ticks}
                allowDataOverflow={false}
                tickFormatter={formatAxisTick}
                tick={CHART_TICK}
                axisLine={false}
                tickLine={false}
                width={56}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ fill: "rgba(237, 238, 230, 0.04)" }} />
              <Bar
                dataKey={dataKey}
                name={dataKey}
                fill={dataKey === "value" ? "var(--color-accent)" : "var(--color-fg)"}
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
                isAnimationActive={!reduce}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function YearTable({ years }: { years: YearRow[] }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-left">
              {[
                "Year",
                "Collectors",
                "YoY",
                "Sellers",
                "YoY",
                "Pieces",
                "YoY",
                "XTZ",
                "YoY",
                "USD",
                "YoY",
                "Avg pieces",
                "Avg USD",
              ].map((label, i) => (
                <th
                  key={`${label}-${i}`}
                  className={cn(
                    "px-4 py-3 text-xs font-medium tracking-wide text-muted whitespace-nowrap",
                    i > 0 && "text-right",
                  )}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {years.map((row) => (
              <tr key={row.year} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 font-medium whitespace-nowrap">{yearHeading(row)}</td>
                <Num>{formatInt(row.collectors)}</Num>
                <Pct value={row.yoy?.collectors_pct} />
                <Num>{formatInt(row.sellers)}</Num>
                <Pct value={row.yoy?.sellers_pct} />
                <Num>{formatInt(row.pieces)}</Num>
                <Pct value={row.yoy?.pieces_pct} />
                <Num>{formatDecimal(row.xtz)}</Num>
                <Pct value={row.yoy?.xtz_pct} />
                <Num>{formatUsd(row.usd)}</Num>
                <Pct value={row.yoy?.usd_pct} />
                <Num>{formatDecimal(row.avg_pieces_per_collector)}</Num>
                <Num>{formatUsd(row.avg_usd_per_collector)}</Num>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Num({ children }: { children: string }) {
  return <td className="px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap">{children}</td>;
}

function Pct({ value }: { value: number | undefined }) {
  return (
    <td className="px-4 py-3 text-right whitespace-nowrap">
      {value == null ? <span className="text-subtle">—</span> : <YoyChip value={value} />}
    </td>
  );
}

export function YearView({
  years,
  unit,
  graphic,
}: {
  years: YearRow[];
  unit: ValueUnit;
  graphic: boolean;
}) {
  if (years.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted">Year series is not in this file.</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <YearStrip years={years} />
      {graphic ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <YearBar title="Collectors" hint="Unique wallets in the year" years={years} dataKey="collectors" />
          <YearBar title="Pieces" hint="Arts collected" years={years} dataKey="pieces" />
          <YearBar
            title={unit.toUpperCase()}
            hint="Log scale"
            years={years}
            dataKey="value"
            unit={unit}
            log
          />
        </div>
      ) : (
        <YearTable years={years} />
      )}
    </div>
  );
}
