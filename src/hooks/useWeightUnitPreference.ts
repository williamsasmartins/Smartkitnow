import { useCallback, useState } from "react";
import type { WeightUnit } from "@/lib/utils";

const KEY = "skn:weight_unit";

function readStoredUnit(): WeightUnit {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw === "kg" || raw === "lb") return raw;
  } catch (error) {
    console.warn("Failed to read stored weight unit:", error);
  }
  return "lb";
}

export function useWeightUnitPreference() {
  const [unit, setUnitState] = useState<WeightUnit>(() => readStoredUnit());

  const setUnit = useCallback((next: WeightUnit) => {
    setUnitState(next);
    try {
      sessionStorage.setItem(KEY, next);
    } catch (error) {
      console.warn("Failed to store weight unit:", error);
    }
  }, []);

  return { unit, setUnit };
}
