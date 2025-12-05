import { useEffect, useState } from "react";

export function useAssetAvailable(path: string) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let alive = true;
    const img = new Image();
    const bust = path + (path.includes("?") ? "&" : "?") + "v=" + Date.now();

    const setFalse = () => {
      if (!alive) return;
      setAvailable(false);
    };
    const setTrue = () => {
      if (!alive) return;
      setAvailable(true);
    };

    img.onload = () => {
      // Image loaded; attempt decode for extra confidence
      if (typeof img.decode === "function") {
        img.decode().then(setTrue).catch(setFalse);
      } else {
        setTrue();
      }
    };
    img.onerror = setFalse;
    img.src = bust;

    return () => {
      alive = false;
    };
  }, [path]);

  return available;
}
