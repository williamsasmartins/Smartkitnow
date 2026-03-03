import AdSlot from "@/components/ads/AdSlot";

const ENV: any = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
const ADSENSE_CLIENT_ID =
  ENV.VITE_ADSENSE_CLIENT_ID ?? ENV.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";
const SLOT_SIDEBAR =
  ENV.VITE_ADSENSE_SLOT_SIDEBAR ?? ENV.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "";

/**
 * Componente reutilizável para a coluna de anúncios à direita (Right Rail).
 * - Responsivo: oculto em telas menores; exibido em >= 1280px (xl)
 * - Usa AdSlot existente com variante "rail"
 */
export default function RightRailAds() {
  return (
    <div className="space-y-4">
      <div className="ad-reserve-rail ad-frame">
        <AdSlot
          variant="rail"
          id="rail-top"
          adClient={ADSENSE_CLIENT_ID}
          adSlot={SLOT_SIDEBAR}
          stickyRail
        />
      </div>
      <div className="ad-reserve-rail ad-frame">
        <AdSlot
          variant="rail"
          id="rail-mid"
          adClient={ADSENSE_CLIENT_ID}
          adSlot={SLOT_SIDEBAR}
        />
      </div>
    </div>
  );
}