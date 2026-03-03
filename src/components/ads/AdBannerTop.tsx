import AdUnit from "@/components/AdUnit";

const ENV: any = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
const SLOT_TOP_BANNER =
  ENV.VITE_ADSENSE_SLOT_TOP_BANNER ?? ENV.NEXT_PUBLIC_ADSENSE_SLOT_TOP_BANNER ?? "pending";

/**
 * Top banner ad for category pages.
 * Delegates to AdUnit which handles dev/prod toggling and responsive sizes.
 */
export default function AdBannerTop() {
  return <AdUnit slot={SLOT_TOP_BANNER} type="top-banner" className="w-full py-3" />;
}