import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/chart-tooltip";
import { CHART_TICK, monthAxisTick, yearStartTicks } from "@/lib/chart";
import { formatCompact } from "@/lib/format";
import type { MonthRow } from "@/lib/monthly";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function PanelC({ months }: { months: MonthRow[] }) {
  const reduce = useReducedMotion();
  const ticks = yearStartTicks(months);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Averages per collector</CardTitle>
        <CardDescription>Pieces left · USD right</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={months}
              margin={{ top: 8, right: 8, left: 8, bottom: 4 }}
              barGap={1}
              barCategoryGap="12%"
            >
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="month"
                ticks={ticks}
                tickFormatter={monthAxisTick}
                tick={CHART_TICK}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
                interval={0}
                minTickGap={24}
                padding={{ left: 16, right: 16 }}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={formatCompact}
                tick={CHART_TICK}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={formatCompact}
                tick={{ ...CHART_TICK, fill: "var(--color-accent)" }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "rgba(237, 238, 230, 0.04)" }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "var(--color-muted)", paddingTop: 8 }}
                formatter={(value) =>
                  value === "avg_pieces_per_collector"
                    ? "Avg pieces / collector"
                    : "Avg USD / collector"
                }
              />
              <Bar
                yAxisId="left"
                dataKey="avg_pieces_per_collector"
                name="avg_pieces_per_collector"
                fill="var(--color-fg)"
                radius={[4, 4, 0, 0]}
                maxBarSize={8}
                isAnimationActive={!reduce}
              />
              <Bar
                yAxisId="right"
                dataKey="avg_usd_per_collector"
                name="avg_usd_per_collector"
                fill="var(--color-accent)"
                radius={[4, 4, 0, 0]}
                maxBarSize={8}
                isAnimationActive={!reduce}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div
          className="mt-4 flex h-11 items-center justify-center rounded-md border border-dashed border-border px-3 text-sm text-subtle"
          role="note"
        >
          Net new minters — next update
        </div>
      </CardContent>
    </Card>
  );
}
