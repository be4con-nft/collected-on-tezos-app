import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/chart-tooltip";
import { CHART_TICK, monthAxisTick, yearStartTicks } from "@/lib/chart";
import { formatGrouped } from "@/lib/format";
import type { MonthRow } from "@/lib/monthly";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function PanelB({ months }: { months: MonthRow[] }) {
  const reduce = useReducedMotion();
  const ticks = yearStartTicks(months);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unique collectors</CardTitle>
        <CardDescription>Wallets that bought that month · not summed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={months} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
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
                tickFormatter={formatGrouped}
                tick={CHART_TICK}
                axisLine={false}
                tickLine={false}
                width={72}
                allowDecimals={false}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "var(--color-subtle)", strokeDasharray: "4 4" }}
              />
              <Line
                type="monotone"
                dataKey="collectors"
                name="collectors"
                stroke="var(--color-muted)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={!reduce}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
