import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAppStore, type PeriodMode } from "@/lib/store";

export function PeriodToggle() {
  const period = useAppStore((s) => s.period);
  const setPeriod = useAppStore((s) => s.setPeriod);

  return (
    <ToggleGroup
      type="single"
      value={period}
      onValueChange={(value) => {
        if (value === "monthly" || value === "year" || value === "ytd") {
          setPeriod(value as PeriodMode);
        }
      }}
      aria-label="Period"
      className="w-full sm:w-auto"
    >
      <ToggleGroupItem value="ytd" className="flex-1 sm:flex-none">
        YTD
      </ToggleGroupItem>
      <ToggleGroupItem value="monthly" className="flex-1 sm:flex-none">
        Monthly
      </ToggleGroupItem>
      <ToggleGroupItem value="year" className="flex-1 sm:flex-none">
        Full year
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
