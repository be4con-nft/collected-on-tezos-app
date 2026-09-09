import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAppStore, type ValueUnit } from "@/lib/store";

const COMING_SOON = ["1/1 split", "Net new minters", "Whales"] as const;

export function ConfigMenu() {
  const unit = useAppStore((s) => s.unit);
  const setUnit = useAppStore((s) => s.setUnit);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Config">
          <Settings2 />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} collisionPadding={16} className="w-72 p-3">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          Value unit
        </p>
        <ToggleGroup
          type="single"
          value={unit}
          onValueChange={(value) => {
            if (value === "xtz" || value === "usd") setUnit(value as ValueUnit);
          }}
          className="mt-2 w-full"
        >
          <ToggleGroupItem value="xtz" className="flex-1">
            XTZ
          </ToggleGroupItem>
          <ToggleGroupItem value="usd" className="flex-1">
            USD
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator className="my-3" />

        <p className="mb-1.5 text-xs font-medium tracking-[0.18em] text-muted uppercase">
          More
        </p>
        <ul className="flex flex-col">
          {COMING_SOON.map((label) => (
            <li
              key={label}
              className="flex h-9 items-center justify-between rounded-md px-2 text-sm text-subtle"
              aria-disabled="true"
            >
              <span>{label}</span>
              <Badge variant="muted">Coming soon</Badge>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
