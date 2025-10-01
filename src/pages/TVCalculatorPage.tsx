import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { lazy, Suspense } from "react";

// Lazy load calculator components
const AspectRatioCalculator = lazy(() => import("@/components/calculators/AspectRatioCalculator"));
const PPICalculator = lazy(() => import("@/components/calculators/PPICalculator"));
const ProjectorCalculator = lazy(() => import("@/components/calculators/ProjectorCalculator"));
const ScreenSizeCalculator = lazy(() => import("@/components/calculators/ScreenSizeCalculator"));
const TVHeightCalculator = lazy(() => import("@/components/calculators/TVHeightCalculator"));
const TVViewingDistanceCalculator = lazy(() => import("@/components/calculators/TVViewingDistanceCalculator"));
const TVMountingCostCalculator = lazy(() => import("@/components/calculators/TVMountingCostCalculator"));
const TVDimensionsChart = lazy(() => import("@/components/calculators/TVDimensionsChart"));
const VideoResolutionsGuide = lazy(() => import("@/components/calculators/VideoResolutionsGuide"));
const TVViewingRangesGuide = lazy(() => import("@/components/calculators/TVViewingRangesGuide"));

export default function TVCalculatorPage() {
  const { calculator } = useParams();
  const navigate = useNavigate();

  // Calculator mapping with metadata
  const calculatorComponents = {
    "aspect-ratio": {
      component: AspectRatioCalculator,
      title: "Aspect Ratio Calculator",
      description: "Calculate aspect ratios for screens and videos",
      category: "tv-video"
    },
    "ppi-dpi": {
      component: PPICalculator,
      title: "PPI Calculator / DPI Calculator",
      description: "Calculate pixels per inch and dots per inch for displays",
      category: "tv-video"
    },
    "projector": {
      component: ProjectorCalculator,
      title: "Projector Calculator", 
      description: "Calculate projector distance, screen size, and throw ratio",
      category: "tv-video"
    },
    "screen-size": {
      component: ScreenSizeCalculator,
      title: "Screen Size Calculator",
      description: "Calculate screen dimensions from diagonal measurements",
      category: "tv-video"
    },
    "tv-height": {
      component: TVHeightCalculator,
      title: "TV Height Calculator",
      description: "Calculate optimal TV mounting height for viewing",
      category: "tv-video"
    },
    "tv-viewing-distance": {
      component: TVViewingDistanceCalculator,
      title: "TV Size and Viewing Distance Calculator",
      description: "Calculate optimal viewing distance based on TV size",
      category: "tv-video"
    },
    "tv-mounting-cost": {
      component: TVMountingCostCalculator,
      title: "TV Mounting and Installation Cost Guide",
      description: "Calculate TV mounting and installation costs",
      category: "cost-guides"
    },
    "tv-dimensions-chart": {
      component: TVDimensionsChart,
      title: "16:9 TV Dimensions – Screen Size Chart",
      description: "Reference chart for standard TV dimensions",
      category: "resources"
    },
    "video-resolutions": {
      component: VideoResolutionsGuide,
      title: "Common Video Display Resolutions and Aspect Ratios",
      description: "Guide to standard video formats and resolutions",
      category: "resources"
    },
    "tv-viewing-ranges": {
      component: TVViewingRangesGuide,
      title: "TV Size and Viewing Distance Ranges",
      description: "Recommended viewing distances for different TV sizes",
      category: "resources"
    }
  };

  const calculatorData = calculatorComponents[calculator as keyof typeof calculatorComponents];

  if (!calculatorData) {
    return (
      <div className="min-h-screen bg-gradient-subtle pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Calculator Not Found</h1>
            <p className="text-muted-foreground mb-8">The requested calculator does not exist.</p>
            <Link to="/tv">
              <Button>Back to TV & Video Calculators</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const CalculatorComponent = calculatorData.component;

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/tv")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to TV & Video Calculators
          </Button>
        </div>

        {/* Calculator Component */}
        <Suspense 
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          }
        >
          <CalculatorComponent />
        </Suspense>
      </div>
    </div>
  );
}