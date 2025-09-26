import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '@/data/calculatorRegistry';
import AspectRatioCalculator from '@/components/calculators/tv/AspectRatioCalculator';
import PPICalculator from '@/components/calculators/tv/PPICalculator';
import ProjectorCalculator from '@/components/calculators/tv/ProjectorCalculator';
import ScreenSizeCalculator from '@/components/calculators/tv/ScreenSizeCalculator';
import TVDimensionsChart from '@/components/calculators/tv/TVDimensionsChart';
import TVHeightCalculator from '@/components/calculators/tv/TVHeightCalculator';
import TVMountingCostCalculator from '@/components/calculators/tv/TVMountingCostCalculator';
import TVViewingDistanceCalculator from '@/components/calculators/tv/TVViewingDistanceCalculator';
import TVViewingRangesGuide from '@/components/calculators/tv/TVViewingRangesGuide';
import VideoResolutionsGuide from '@/components/calculators/tv/VideoResolutionsGuide';
import NotFound from '../NotFound';

const calculatorComponents: Record<string, React.ComponentType> = {
  'aspect-ratio': AspectRatioCalculator,
  'ppi': PPICalculator,
  'projector': ProjectorCalculator,
  'screen-size': ScreenSizeCalculator,
  'tv-dimensions': TVDimensionsChart,
  'tv-height': TVHeightCalculator,
  'tv-mounting-cost': TVMountingCostCalculator,
  'tv-viewing-distance': TVViewingDistanceCalculator,
  'tv-viewing-ranges': TVViewingRangesGuide,
  'video-resolutions': VideoResolutionsGuide,
};

export default function TVCalculatorPage() {
  const { calculator } = useParams<{ calculator: string }>();
  const calcKey = calculator?.replace('-calculator', '');
  
  if (!calcKey || !calculatorRegistry[calcKey] || !calculatorComponents[calcKey]) {
    return <NotFound />;
  }

  const CalculatorComponent = calculatorComponents[calcKey];
  return <CalculatorComponent />;
}