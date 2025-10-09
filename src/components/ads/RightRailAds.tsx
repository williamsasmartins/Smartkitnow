import React from "react";
import AdSlot from "@/components/ads/AdSlot";

/**
 * Componente reutilizável para a coluna de anúncios à direita (Right Rail).
 * - Responsivo: oculto em telas menores; exibido em >= 1280px (xl)
 * - Usa AdSlot existente com variante "rail"
 * - Inclui borda e sombra sutis para destacar a área de anúncios
 */
export default function RightRailAds() {
  return (
    <div className="w-[160px] space-y-4">
      <AdSlot
        variant="rail"
        label="Ad - Right Rail (Google AdSense)"
        className="w-[160px]"
        stickyRail
      />
    </div>
  );
}