import { useCallback, useState } from "react";
import type { WeightUnit } from "@/lib/utils";

const KEY = "skn:weight_unit";

function readStoredUnit(): WeightUnit {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw === "kg" || raw === "lb") return raw;
  } catch {
  }
  return "kg";
}

export function useWeightUnitPreference() {
  const [unit, setUnitState] = useState<WeightUnit>(() => readStoredUnit());

  const setUnit = useCallback((next: WeightUnit) => {
    setUnitState(next);
    try {
      sessionStorage.setItem(KEY, next);
    } catch {
    }
  }, []);

  return { unit, setUnit };
}
