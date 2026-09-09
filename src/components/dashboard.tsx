import { RefreshCw } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AppFooter } from "@/components/app-footer";
import { ConfigMenu } from "@/components/config-menu";
import { KpiStrip, monthlyKpiItems } from "@/components/kpi-strip";
import { MethodsPage } from "@/components/methods-page";
import { MonthTable } from "@/components/month-table";
import { PanelA } from "@/components/panel-a";
import { PanelB } from "@/components/panel-b";
import { PanelC } from "@/components/panel-c";
import { PeriodToggle } from "@/components/period-toggle";
import { ViewToggle } from "@/components/view-toggle";
import { YearView } from "@/components/year-view";
import { YtdView } from "@/components/ytd-view";
import { lastClosedMonth, type MonthlyData } from "@/lib/monthly";
import { useAppStore } from "@/lib/store";

function TezosMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true" fill="none">
      <path d="M12 12 L40 40 L12 68" stroke="currentColor" strokeWidth="5" strokeLinecap="square" />
      <path d="M68 12 L40 40 L68 68" stroke="currentColor" strokeWidth="5" strokeLinecap="square" />
    </svg>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-2xl" />
      <Skeleton className="h-80 rounded-2xl" />
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="flex flex-col items-start gap-4 p-6 md:p-8">
      <p className="text-xs font-medium tracking-[0.2em] text-danger uppercase">Data</p>
      <h2 className="font-display text-3xl tracking-tight">Could not load months</h2>
      <p className="max-w-md text-sm text-muted">{message}</p>
      <Button variant="secondary" onClick={onRetry}>
        <RefreshCw />
        Retry
      </Button>
    </Card>
  );
}

export function Dashboard({ query }: { query: UseQueryResult<MonthlyData> }) {
  const view = useAppStore((s) => s.view);
  const unit = useAppStore((s) => s.unit);
  const period = useAppStore((s) => s.period);
  const last = query.data ? lastClosedMonth(query.data.months) : null;
  const periodLabel =
    query.data?.meta.period_start && query.data?.meta.period_end
      ? `${query.data.meta.period_start} → ${query.data.meta.period_end}`
      : "Closed months";

  return (
    <div className="relative min-h-dvh bg-bg text-fg">
      <div className="grain" />
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <TezosMark className="size-7 shrink-0 text-accent" />
              <div className="min-w-0">
                <h1 className="font-display text-2xl leading-tight tracking-tight sm:text-3xl">
                  Collected on Tezos
                </h1>
                <p className="truncate text-xs text-muted sm:text-sm">{periodLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ViewToggle />
              <ConfigMenu />
            </div>
          </div>
          {view !== "methods" ? <PeriodToggle /> : null}
        </header>

        {query.isPending ? <LoadingState /> : null}

        {query.isError ? (
          <ErrorState
            message={
              query.error instanceof Error
                ? query.error.message
                : "Primary and fallback sources failed."
            }
            onRetry={() => {
              void query.refetch();
            }}
          />
        ) : null}

        {query.data ? (
          <div className="flex flex-col gap-6">
            {view === "methods" ? (
              <MethodsPage />
            ) : period === "ytd" ? (
              <YtdView ytd={query.data.ytd} graphic={view === "graphic"} />
            ) : period === "year" ? (
              <YearView years={query.data.years} unit={unit} graphic={view === "graphic"} />
            ) : (
              <>
                {last ? <KpiStrip items={monthlyKpiItems(last)} /> : null}
                {view === "graphic" ? (
                  <>
                    <PanelA months={query.data.months} unit={unit} />
                    <PanelB months={query.data.months} />
                    <PanelC months={query.data.months} />
                  </>
                ) : (
                  <MonthTable months={query.data.months} />
                )}
              </>
            )}
            <AppFooter meta={query.data.meta} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
