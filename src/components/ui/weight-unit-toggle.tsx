import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn, type WeightUnit } from "@/lib/utils";

type WeightUnitToggleProps = {
  value: WeightUnit;
  onChange: (next: WeightUnit) => void;
  className?: string;
};

export function WeightUnitToggle({ value, onChange, className }: WeightUnitToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next === "kg" || next === "lb") onChange(next);
      }}
      variant="outline"
      size="sm"
      className={cn("justify-end", className)}
    >
      <ToggleGroupItem value="kg" aria-label="Kilograms">
        kg
      </ToggleGroupItem>
      <ToggleGroupItem value="lb" aria-label="Pounds">
        lb
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
