import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/chart-tooltip";
import { CHART_TICK, logDomain, logTicks, monthAxisTick, yearStartTicks } from "@/lib/chart";
import { formatGrouped } from "@/lib/format";
import type { MonthRow } from "@/lib/monthly";
import type { ValueUnit } from "@/lib/store";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function PanelA({ months, unit }: { months: MonthRow[]; unit: ValueUnit }) {
  const reduce = useReducedMotion();
  const data = months.map((row) => ({
    ...row,
    value: unit === "usd" ? row.usd : row.xtz,
  }));
  const [logMin, logMax] = logDomain(data.map((row) => row.value));
  const valueTicks = logTicks(logMin, logMax);
  const ticks = yearStartTicks(months);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume</CardTitle>
        <CardDescription>
          Pieces, linear left · {unit.toUpperCase()} value, log right
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
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
                tickFormatter={formatGrouped}
                tick={CHART_TICK}
                axisLine={false}
                tickLine={false}
                width={88}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                scale="log"
                domain={[logMin, logMax]}
                ticks={valueTicks}
                allowDataOverflow={false}
                tickFormatter={formatGrouped}
                tick={{ ...CHART_TICK, fill: "var(--color-accent)" }}
                axisLine={false}
                tickLine={false}
                width={88}
              />
              <Tooltip
                content={<ChartTooltip unit={unit} />}
                cursor={{ stroke: "var(--color-subtle)", strokeDasharray: "4 4" }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "var(--color-muted)", paddingTop: 8 }}
                formatter={(value) => (value === "value" ? unit.toUpperCase() : "Pieces")}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="pieces"
                name="pieces"
                stroke="var(--color-fg)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={!reduce}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="value"
                name="value"
                stroke="var(--color-accent)"
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
