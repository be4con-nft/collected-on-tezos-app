export type MonthRow = {
  month: string;
  pieces: number;
  sales: number;
  xtz: number;
  usd: number;
  collectors: number;
  sellers: number;
  avg_pieces_per_collector: number;
  avg_usd_per_collector: number;
};

export type YearYoy = {
  collectors_pct?: number;
  sellers_pct?: number;
  pieces_pct?: number;
  xtz_pct?: number;
  usd_pct?: number;
};

export type YearRow = {
  year: number;
  months: number;
  label: string;
  collectors: number;
  sellers: number;
  pieces: number;
  sales: number;
  xtz: number;
  usd: number;
  avg_pieces_per_collector: number;
  avg_usd_per_collector: number;
  yoy?: YearYoy;
};

export type YtdWindow = {
  year: number;
  window: string;
  collectors: number;
  sellers: number;
  pieces: number;
  sales: number;
  xtz: number;
  usd: number;
  avg_pieces_per_collector: number;
  avg_usd_per_collector: number;
};

export type YtdYoy = {
  collectors?: number;
  sellers?: number;
  pieces?: number;
  xtz?: number;
  usd?: number;
  avg_pieces_per_collector?: number;
  avg_usd_per_collector?: number;
};

export type YtdSet = {
  current: YtdWindow;
  prior: YtdWindow;
  yoy_pct: YtdYoy;
};

export type MonthlyMeta = {
  title: string;
  as_of_month: string;
  period_start: string;
  period_end: string;
  updated_at: string;
  unit_people: string;
  sales_definition: string;
  markets: string;
  usd_method: string;
  unique_note: string;
  year_note: string;
  net_new_minters: unknown;
  net_new_minters_note: string;
  source: string;
};

export type MonthlyData = {
  meta: MonthlyMeta;
  months: MonthRow[];
  years: YearRow[];
  ytd: YtdSet | null;
};

const PRIMARY =
  "https://raw.githubusercontent.com/be4con-nft/collected-on-tezos/main/data/monthly.json";
const SNAPSHOT =
  "https://raw.githubusercontent.com/be4con-nft/collected-on-tezos/2704340ce2290ad9e5996dd88df087df55b23560/data/monthly.json";

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function optionalNumber(value: unknown): number | undefined {
  return isFiniteNumber(value) ? value : undefined;
}

function parseMonth(value: unknown): MonthRow | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const month = asString(row.month);
  if (!/^\d{4}-\d{2}$/.test(month)) return null;
  const fields = [
    "pieces",
    "sales",
    "xtz",
    "usd",
    "collectors",
    "sellers",
    "avg_pieces_per_collector",
    "avg_usd_per_collector",
  ] as const;
  for (const key of fields) {
    if (!isFiniteNumber(row[key])) return null;
  }
  return {
    month,
    pieces: row.pieces as number,
    sales: row.sales as number,
    xtz: row.xtz as number,
    usd: row.usd as number,
    collectors: row.collectors as number,
    sellers: row.sellers as number,
    avg_pieces_per_collector: row.avg_pieces_per_collector as number,
    avg_usd_per_collector: row.avg_usd_per_collector as number,
  };
}

function parseYearYoy(value: unknown): YearYoy | undefined {
  if (!value || typeof value !== "object") return undefined;
  const row = value as Record<string, unknown>;
  const yoy: YearYoy = {
    collectors_pct: optionalNumber(row.collectors_pct),
    sellers_pct: optionalNumber(row.sellers_pct),
    pieces_pct: optionalNumber(row.pieces_pct),
    xtz_pct: optionalNumber(row.xtz_pct),
    usd_pct: optionalNumber(row.usd_pct),
  };
  return Object.values(yoy).some((n) => n != null) ? yoy : undefined;
}

function parseYear(value: unknown): YearRow | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (!isFiniteNumber(row.year)) return null;
  const fields = [
    "months",
    "collectors",
    "sellers",
    "pieces",
    "sales",
    "xtz",
    "usd",
    "avg_pieces_per_collector",
    "avg_usd_per_collector",
  ] as const;
  for (const key of fields) {
    if (!isFiniteNumber(row[key])) return null;
  }
  return {
    year: row.year,
    months: row.months as number,
    label: asString(row.label) || String(row.year),
    collectors: row.collectors as number,
    sellers: row.sellers as number,
    pieces: row.pieces as number,
    sales: row.sales as number,
    xtz: row.xtz as number,
    usd: row.usd as number,
    avg_pieces_per_collector: row.avg_pieces_per_collector as number,
    avg_usd_per_collector: row.avg_usd_per_collector as number,
    yoy: parseYearYoy(row.yoy),
  };
}

function parseYtdWindow(value: unknown): YtdWindow | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (!isFiniteNumber(row.year)) return null;
  const fields = [
    "collectors",
    "sellers",
    "pieces",
    "sales",
    "xtz",
    "usd",
    "avg_pieces_per_collector",
    "avg_usd_per_collector",
  ] as const;
  for (const key of fields) {
    if (!isFiniteNumber(row[key])) return null;
  }
  return {
    year: row.year,
    window: asString(row.window),
    collectors: row.collectors as number,
    sellers: row.sellers as number,
    pieces: row.pieces as number,
    sales: row.sales as number,
    xtz: row.xtz as number,
    usd: row.usd as number,
    avg_pieces_per_collector: row.avg_pieces_per_collector as number,
    avg_usd_per_collector: row.avg_usd_per_collector as number,
  };
}

function parseYtd(value: unknown): YtdSet | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const current = parseYtdWindow(row.current);
  const prior = parseYtdWindow(row.prior);
  if (!current || !prior) return null;
  const pctRaw =
    row.yoy_pct && typeof row.yoy_pct === "object"
      ? (row.yoy_pct as Record<string, unknown>)
      : {};
  return {
    current,
    prior,
    yoy_pct: {
      collectors: optionalNumber(pctRaw.collectors),
      sellers: optionalNumber(pctRaw.sellers),
      pieces: optionalNumber(pctRaw.pieces),
      xtz: optionalNumber(pctRaw.xtz),
      usd: optionalNumber(pctRaw.usd),
      avg_pieces_per_collector: optionalNumber(pctRaw.avg_pieces_per_collector),
      avg_usd_per_collector: optionalNumber(pctRaw.avg_usd_per_collector),
    },
  };
}

function parseMeta(value: unknown): MonthlyMeta {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid data: meta missing");
  }
  const meta = value as Record<string, unknown>;
  return {
    title: asString(meta.title) || "Collected on Tezos",
    as_of_month: asString(meta.as_of_month),
    period_start: asString(meta.period_start),
    period_end: asString(meta.period_end),
    updated_at: asString(meta.updated_at),
    unit_people: asString(meta.unit_people),
    sales_definition: asString(meta.sales_definition),
    markets: asString(meta.markets),
    usd_method: asString(meta.usd_method),
    unique_note: asString(meta.unique_note),
    year_note: asString(meta.year_note),
    net_new_minters: meta.net_new_minters ?? null,
    net_new_minters_note: asString(meta.net_new_minters_note),
    source: asString(meta.source),
  };
}

export function parseMonthly(raw: unknown): MonthlyData {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid monthly payload");
  }
  const body = raw as Record<string, unknown>;
  if (!Array.isArray(body.months)) {
    throw new Error("Invalid data: months missing");
  }
  const months = body.months
    .map(parseMonth)
    .filter((row): row is MonthRow => row !== null)
    .sort((a, b) => a.month.localeCompare(b.month));
  if (months.length === 0) {
    throw new Error("Invalid data: no usable months");
  }
  const years = Array.isArray(body.years)
    ? body.years
        .map(parseYear)
        .filter((row): row is YearRow => row !== null)
        .sort((a, b) => a.year - b.year)
    : [];
  return {
    meta: parseMeta(body.meta),
    months,
    years,
    ytd: parseYtd(body.ytd),
  };
}

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load monthly data (${res.status})`);
  }
  return res.json();
}

export async function fetchMonthlyData(): Promise<MonthlyData> {
  const primary = `${PRIMARY}?t=${Date.now()}`;
  try {
    const parsed = parseMonthly(await getJson(primary));
    if (parsed.months.length >= 40) return parsed;
  } catch {
    /* fall through to the 44-month snapshot */
  }
  return parseMonthly(await getJson(SNAPSHOT));
}

export function lastClosedMonth(months: MonthRow[]): MonthRow | null {
  return months[months.length - 1] ?? null;
}

export function valueOf(row: { xtz: number; usd: number }, unit: "xtz" | "usd"): number {
  return unit === "usd" ? row.usd : row.xtz;
}

export function formatYtdHeading(row: YtdWindow): string {
  const match = row.window.match(/^(\d{4}-\d{2})\.\.(\d{4}-\d{2})$/);
  if (!match) return String(row.year);
  const start = match[1];
  const end = match[2];
  if (!start || !end) return String(row.year);
  const startMonth = new Date(Date.UTC(Number(start.slice(0, 4)), Number(start.slice(5, 7)) - 1, 1));
  const endMonth = new Date(Date.UTC(Number(end.slice(0, 4)), Number(end.slice(5, 7)) - 1, 1));
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  return `${row.year} ${fmt(startMonth)}–${fmt(endMonth)}`;
}
