import AdUnit from "@/components/AdUnit";

const ENV: any = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
const ADSENSE_ENABLED = (ENV.VITE_ADSENSE_ENABLED ?? 'false') === 'true';
const SLOT_SIDEBAR = ENV.VITE_ADSENSE_SLOT_SIDEBAR ?? "pending";

/**
 * Sidebar ad for category pages.
 * Returns null when ads are disabled — no wasted space in the flex layout.
 * Includes its own outer <aside> wrapper so callers don't need one.
 */
export default function AdSidebarRight({ topOffset = 0 }: { topOffset?: number }) {
  if (!ADSENSE_ENABLED) return null;
  return (
    <aside className="hidden xl:block w-[300px] flex-shrink-0">
      <div className="sticky" style={{ top: topOffset > 0 ? topOffset : "var(--skn-rail-top)" }}>
        <AdUnit slot={SLOT_SIDEBAR} type="sidebar" />
      </div>
    </aside>
  );
}