import { useParams } from 'react-router-dom';
import { calculatorRegistry } from '@/data/calculatorRegistry';
import { AquariumVolumeCalculator } from '@/components/calculators/pets/AquariumVolumeCalculator';
import { AquariumWeightCalculator } from '@/components/calculators/pets/AquariumWeightCalculator';
import { CatAgeCalculator } from '@/components/calculators/pets/CatAgeCalculator';
import { DogAgeCalculator } from '@/components/calculators/pets/DogAgeCalculator';
import { DogCalorieCalculator } from '@/components/calculators/pets/DogCalorieCalculator';
import NotFound from '../NotFound';

const calculatorComponents: Record<string, React.ComponentType> = {
  'aquarium-volume': AquariumVolumeCalculator,
  'aquarium-weight': AquariumWeightCalculator,
  'cat-age': CatAgeCalculator,
  'dog-age': DogAgeCalculator,
  'dog-calorie': DogCalorieCalculator,
};

export default function PetsCalculatorPage() {
  const { calculator } = useParams<{ calculator: string }>();
  const calcKey = calculator?.replace('-calculator', '');
  
  if (!calcKey || !calculatorRegistry[calcKey] || !calculatorComponents[calcKey]) {
    return <NotFound />;
  }

  const CalculatorComponent = calculatorComponents[calcKey];
  return <CalculatorComponent />;
}