/**
 * Full Web Vitals tracker (CLS, LCP, INP) for SmartKitNow
 * - Uses PerformanceObserver for all three metrics
 * - Logs in console (if debug)
 * - Sends JSON beacon with page metadata
 */

type Metrics = {
  CLS?: number;
  LCP?: number;
  INP?: number;
  url: string;
  pathname?: string;
  viewport?: string;
  userAgent?: string;
  ts: number;
  release?: string;
};

type Options = {
  debug?: boolean;
  beaconUrl?: string;
  onFinal?: (metrics: Metrics) => void;
};

function log(label: string, value: number, debug?: boolean) {
  if (debug) {
    console.log(
      `%c[WebVitals] ${label}:`,
      "color:#0369a1;background:#e0f2fe;padding:2px 6px;border-radius:6px",
      value.toFixed(3)
    );
  }
}

export function initWebVitals(opts: Options = {}) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

  const metrics: Metrics = {
    url: location.href,
    pathname: location.pathname,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    userAgent: navigator.userAgent,
    ts: Date.now(),
    release: (import.meta as any)?.env?.VITE_RELEASE,
  };

  // ---- CLS ----
  let clsValue = 0;
  let sessionValue = 0;
  let sessionStartTime = 0;
  try {
    const poCLS = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        // These fields exist on LayoutShift entries
        const hadRecentInput = (entry as any).hadRecentInput as boolean | undefined;
        const value = Number((entry as any).value || 0);
        const startTime = Number((entry as any).startTime || 0);
        if (!hadRecentInput) {
          if (startTime - sessionStartTime < 1000) {
            sessionValue += value;
          } else {
            sessionStartTime = startTime;
            sessionValue = value;
          }
          clsValue = Math.max(clsValue, sessionValue);
          metrics.CLS = Number(clsValue.toFixed(4));
          log("CLS update", clsValue, opts.debug);
        }
      }
    });
    poCLS.observe({ type: "layout-shift", buffered: true as any });
  } catch {}

  // ---- LCP ----
  try {
    const poLCP = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1] as any;
      // Prefer metrics.renderTime or loadTime — divide by 1000 to log seconds
      const t = Number(last?.renderTime || last?.loadTime || 0);
      metrics.LCP = t;
      log("LCP", (metrics.LCP || 0) / 1000, opts.debug);
    });
    poLCP.observe({ type: "largest-contentful-paint", buffered: true as any });
  } catch {}

  // ---- INP ----
  try {
    const poINP = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceEventTiming[]) {
        metrics.INP = Number(entry.duration);
        log("INP", metrics.INP || 0, opts.debug);
      }
    });
    poINP.observe({ type: "event", buffered: true as any });
  } catch {}

  // ---- Finalize ----
  const finalize = () => {
    metrics.ts = Date.now();
    const payload = JSON.stringify(metrics);
    const host = location.hostname;
    const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
    if (opts.beaconUrl && !isLocalHost) {
      try {
        navigator.sendBeacon(opts.beaconUrl, payload);
      } catch (err) {
        if (opts.debug) console.warn("sendBeacon failed:", err);
      }
    }
    opts.onFinal?.(metrics);
  };

  window.addEventListener("beforeunload", finalize);
  window.addEventListener("pagehide", finalize);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") finalize();
  });
}
