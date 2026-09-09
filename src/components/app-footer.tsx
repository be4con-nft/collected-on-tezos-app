import { formatUpdatedAt } from "@/lib/format";
import type { MonthlyMeta } from "@/lib/monthly";

export function AppFooter({ meta }: { meta: MonthlyMeta }) {
  const range =
    meta.period_start && meta.period_end
      ? `${meta.period_start} → ${meta.period_end}`
      : "";
  const updated = meta.updated_at ? formatUpdatedAt(meta.updated_at) : "";
  const parts = [
    range,
    updated ? `Updated ${updated}` : "",
    "Paid marketplace sales only. Wallets, not people.",
  ].filter(Boolean);

  return (
    <footer className="mt-10 border-t border-border pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <p className="max-w-3xl text-xs leading-relaxed text-subtle">{parts.join(" · ")}</p>
    </footer>
  );
}
