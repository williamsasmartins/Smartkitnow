import { Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/NotFound";

type LazyComp = React.LazyExoticComponent<React.ComponentType<any>>;
const preferDefault = <T extends Record<string, any>>(m: T, key?: string) =>
  ({ default: (key && m[key]) ? m[key] : (m as any).default }) as { default: React.ComponentType<any> };

const calculators: Record<string, LazyComp> = {
  "aspect-ratio-calculator": lazy(() =>
    import("@/components/calculators/tv/AspectRatioCalculator").then(m => preferDefault(m, "AspectRatioCalculator"))
  ),
  "ppi-calculator": lazy(() =>
    import("@/components/calculators/tv/PPICalculator").then(m => preferDefault(m, "PPICalculator"))
  ),
  "projector-calculator": lazy(() =>
    import("@/components/calculators/tv/ProjectorCalculator").then(m => preferDefault(m, "ProjectorCalculator"))
  ),
  "screen-size-calculator": lazy(() =>
    import("@/components/calculators/tv/ScreenSizeCalculator").then(m => preferDefault(m, "ScreenSizeCalculator"))
  ),
  "tv-dimensions-chart": lazy(() =>
    import("@/components/calculators/tv/TVDimensionsChart").then(m => preferDefault(m, "TVDimensionsChart"))
  ),
  "tv-height-calculator": lazy(() =>
    import("@/components/calculators/tv/TVHeightCalculator").then(m => preferDefault(m, "TVHeightCalculator"))
  ),
  "tv-mounting-cost-calculator": lazy(() =>
    import("@/components/calculators/tv/TVMountingCostCalculator").then(m => preferDefault(m, "TVMountingCostCalculator"))
  ),
  "tv-viewing-distance-calculator": lazy(() =>
    import("@/components/calculators/tv/TVViewingDistanceCalculator").then(m => preferDefault(m, "TVViewingDistanceCalculator"))
  ),
  "tv-viewing-ranges-guide": lazy(() =>
    import("@/components/calculators/tv/TVViewingRangesGuide").then(m => preferDefault(m, "TVViewingRangesGuide"))
  ),
  "video-resolutions-guide": lazy(() =>
    import("@/components/calculators/tv/VideoResolutionsGuide").then(m => preferDefault(m, "VideoResolutionsGuide"))
  ),
};

export default function TVCalculatorPage() {
  const { calculator, subcategory } = useParams();
  const navigate = useNavigate();
  if (!calculator) return <NotFound />;

  const Comp = calculators[calculator];
  if (!Comp) return <NotFound />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" onClick={() => (subcategory ? navigate(`/tv/${subcategory}`) : navigate("/tv"))}>
          ← Voltar
        </Button>
        <h1 className="text-2xl font-bold">
          {calculator.split("-").map(s => s[0]?.toUpperCase() + s.slice(1)).join(" ")}
        </h1>
      </div>
      <Suspense fallback={<div className="mx-auto max-w-2xl py-10">Carregando calculadora…</div>}>
        <Comp />
      </Suspense>
    </div>
  );
}
