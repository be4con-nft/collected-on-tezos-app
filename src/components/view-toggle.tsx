import { ChartSpline, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useAppStore, type ViewMode } from "@/lib/store";

export function ViewToggle() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="flex items-center gap-2">
      <ToggleGroup
        type="single"
        value={view === "methods" ? "" : view}
        onValueChange={(value) => {
          if (value === "graphic" || value === "table") setView(value as ViewMode);
        }}
        aria-label="View"
      >
        <ToggleGroupItem value="graphic" aria-label="Graphic">
          <ChartSpline />
          <span className="hidden sm:inline">Graphic</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="table" aria-label="Table">
          <Table />
          <span className="hidden sm:inline">Table</span>
        </ToggleGroupItem>
      </ToggleGroup>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-11 px-3",
          view === "methods" && "bg-fg text-bg hover:bg-fg hover:text-bg",
        )}
        aria-pressed={view === "methods"}
        onClick={() => setView("methods")}
      >
        Methods
      </Button>
    </div>
  );
}
