import { useEffect } from "react";
import { Dashboard } from "@/components/dashboard";
import { useAppStore } from "@/lib/store";
import { useMonthly } from "@/lib/use-monthly";

export function App() {
  const hydrateUnit = useAppStore((s) => s.hydrateUnit);
  const query = useMonthly();

  useEffect(() => {
    hydrateUnit();
  }, [hydrateUnit]);

  return <Dashboard query={query} />;
}
