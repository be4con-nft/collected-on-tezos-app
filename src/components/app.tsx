import { useEffect } from "react";
import { Cover } from "@/components/cover";
import { Dashboard } from "@/components/dashboard";
import { useAppStore } from "@/lib/store";
import { useMonthly } from "@/lib/use-monthly";

export function App() {
  const opened = useAppStore((s) => s.opened);
  const hydrateUnit = useAppStore((s) => s.hydrateUnit);
  const query = useMonthly();

  useEffect(() => {
    hydrateUnit();
  }, [hydrateUnit]);

  if (!opened) return <Cover />;
  return <Dashboard query={query} />;
}
