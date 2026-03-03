import AdUnit from "@/components/AdUnit";

const ENV: any = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
const SLOT_SIDEBAR =
  ENV.VITE_ADSENSE_SLOT_SIDEBAR ?? ENV.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "pending";

/**
 * Sidebar ad for category pages.
 * Delegates to AdUnit which handles dev/prod toggling and responsive sizes.
 */
export default function AdSidebarRight({ topOffset = 0 }: { topOffset?: number }) {
  return (
    <aside className="hidden lg:block lg:w-[320px]">
      <div className="sticky space-y-4" style={{ top: topOffset }}>
        <AdUnit slot={SLOT_SIDEBAR} type="sidebar" />
      </div>
    </aside>
  );
}