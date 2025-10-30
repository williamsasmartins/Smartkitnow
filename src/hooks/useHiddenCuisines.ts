import { useEffect, useMemo, useState } from "react";

const LS_KEY = "skn:hidden_cuisines";

function readHidden(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return new Set<string>();
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return new Set<string>(arr as string[]);
  } catch {}
  return new Set<string>();
}

function writeHidden(set: Set<string>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify([...set]));
  } catch {}
}

export function useHiddenCuisines() {
  const [hidden, setHidden] = useState<Set<string>>(() => readHidden());

  useEffect(() => {
    // Sync when other tabs modify localStorage
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_KEY) {
        setHidden(readHidden());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const api = useMemo(() => {
    return {
      hidden,
      isHidden: (key: string) => hidden.has(key),
      hideCuisine: (key: string) => {
        const next = new Set(hidden);
        next.add(key);
        writeHidden(next);
        setHidden(next);
      },
      restoreCuisine: (key: string) => {
        const next = new Set(hidden);
        next.delete(key);
        writeHidden(next);
        setHidden(next);
      },
      restoreAll: () => {
        const next = new Set<string>();
        writeHidden(next);
        setHidden(next);
      },
    };
  }, [hidden]);

  return api;
}