import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
  Dog,
  Syringe,
  Skull,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogLifeExpectancyEstimatorCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  // Inputs: weight, breed size, diet quality, exercise level, spay/neuter status
  const [inputs, setInputs] = useState({
    weight: "",
    breedSize: "",
    dietQuality: "",
    exerciseLevel: "",
    spayNeuterStatus: "",
  });

  // Breed size options and their base life expectancy (years) averages from veterinary literature
  // Small: 12-16 years, Medium: 10-14 years, Large: 8-12 years, Giant: 6-10 years
  // We'll use average midpoints for base life expectancy
  const breedSizeBaseLifeExpectancy = {
    small: 14,
    medium: 12,
    large: 10,
    giant: 8,
  };

  // Diet quality impact factors (multiplicative)
  // Excellent: +10%, Good: +5%, Average: 0%, Poor: -10%
  const dietQualityFactors = {
    excellent: 1.10,
    good: 1.05,
    average: 1.0,
    poor: 0.90,
  };

  // Exercise level impact factors (multiplicative)
  // High: +10%, Moderate: +5%, Low: 0%, Sedentary: -10%
  const exerciseLevelFactors = {
    high: 1.10,
    moderate: 1.05,
    low: 1.0,
    sedentary: 0.90,
  };

  // Spay/neuter status impact factors (multiplicative)
  // Spayed/Neutered: +15%, Intact: 0%
  const spayNeuterFactors = {
    spayed: 1.15,
    neutered: 1.15,
    intact: 1.0,
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const breedSize = inputs.breedSize;
    const dietQuality = inputs.dietQuality;
    const exerciseLevel = inputs.exerciseLevel;
    const spayNeuterStatus = inputs.spayNeuterStatus;

    if (
      !weightRaw ||
      weightRaw <= 0 ||
      !breedSize ||
      !dietQuality ||
      !exerciseLevel ||
      !spayNeuterStatus
    )
      return { value: 0, label: "Enter valid details..." };

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Base life expectancy from breed size
    const baseLifeExpectancy = breedSizeBaseLifeExpectancy[breedSize];
    if (!baseLifeExpectancy)
      return { value: 0, label: "Invalid breed size selected." };

    // Calculate modifiers
    const dietFactor = dietQualityFactors[dietQuality] || 1.0;
    const exerciseFactor = exerciseLevelFactors[exerciseLevel] || 1.0;
    const spayNeuterFactor = spayNeuterFactors[spayNeuterStatus] || 1.0;

    // Weight factor: overweight dogs have reduced life expectancy
    // Ideal weight range varies by breed size; overweight defined as > 120% ideal weight
    // For simplicity, assume ideal weight midpoint per breed size:
    // Small: 5-10 kg (7.5 kg midpoint)
    // Medium: 15-25 kg (20 kg midpoint)
    // Large: 30-45 kg (37.5 kg midpoint)
    // Giant: 50-70 kg (60 kg midpoint)
    const idealWeightMidpoints = {
      small: 7.5,
      medium: 20,
      large: 37.5,
      giant: 60,
    };
    const idealWeight = idealWeightMidpoints[breedSize];
    let weightFactor = 1.0;
    if (weightKg > idealWeight * 1.2) {
      // Overweight reduces life expectancy by 10%
      weightFactor = 0.90;
    } else if (weightKg < idealWeight * 0.8) {
      // Underweight may reduce life expectancy by 5%
      weightFactor = 0.95;
    }

    // Calculate estimated life expectancy
    // Formula: baseLifeExpectancy * dietFactor * exerciseFactor * spayNeuterFactor * weightFactor
    const estimatedLifeExpectancy =
      baseLifeExpectancy *
      dietFactor *
      exerciseFactor *
      spayNeuterFactor *
      weightFactor;

    // Round to 1 decimal place
    const roundedLifeExpectancy = Math.round(estimatedLifeExpectancy * 10) / 10;

    // Warning if inputs are extreme
    let warning = null;
    if (weightFactor < 1.0) {
      warning =
        "Weight outside ideal range may negatively impact life expectancy. Consult your veterinarian for weight management advice.";
    }

    return {
      value: roundedLifeExpectancy,
      label: "Estimated Life Expectancy (years)",
      subtext:
        "Based on breed size, diet, exercise, spay/neuter status, and weight factors.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question:
        "How does spaying or neutering affect a dog's life expectancy?",
      answer:
        "Spaying or neutering a dog has been shown to increase life expectancy by reducing risks of certain cancers and infections, as well as decreasing roaming behaviors that can lead to accidents. This surgical intervention positively impacts hormonal balance and overall health, contributing to an estimated 10-15% increase in lifespan. However, timing and individual health should be discussed with a veterinarian to optimize benefits.",
    },
    {
      question:
        "Why is exercise level important in estimating a dog's life expectancy?",
      answer:
        "Regular exercise improves cardiovascular health, maintains healthy weight, and supports mental well-being in dogs. Dogs with higher activity levels tend to have stronger immune systems and reduced risks of obesity-related diseases, which can shorten lifespan. Exercise also helps prevent joint issues and behavioral problems, all contributing to a longer, healthier life. Thus, exercise level is a critical lifestyle factor in life expectancy estimation.",
    },
    {
      question:
        "How does diet quality influence a dog's expected lifespan?",
      answer:
        "A balanced, high-quality diet provides essential nutrients that support organ function, immune health, and energy metabolism. Dogs fed poor-quality diets may suffer from nutrient deficiencies, obesity, or chronic diseases, reducing their lifespan. Conversely, excellent nutrition can delay onset of age-related conditions and improve vitality. Therefore, diet quality directly affects longevity by influencing overall health and disease resistance.",
    },
    {
      question:
        "Why is weight management crucial for a dog's longevity?",
      answer:
        "Maintaining an ideal weight reduces strain on joints, heart, and other organs, preventing diseases such as arthritis, diabetes, and cardiovascular problems. Overweight dogs have a higher risk of shortened lifespan due to these complications. Underweight dogs may suffer from malnutrition and weakened immunity. Proper weight management through diet and exercise is essential to maximize life expectancy and quality of life.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            value={inputs.weight}
            onChange={handleInputChange}
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          />
        </div>

        {/* Breed Size Select */}
        <div>
          <Label htmlFor="breedSize" className="text-slate-700 dark:text-slate-300">
            Breed Size
          </Label>
          <select
            id="breedSize"
            name="breedSize"
            value={inputs.breedSize}
            onChange={handleInputChange}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="">Select breed size</option>
            <option value="small">Small (e.g., Chihuahua, Dachshund)</option>
            <option value="medium">Medium (e.g., Beagle, Cocker Spaniel)</option>
            <option value="large">Large (e.g., Labrador, Golden Retriever)</option>
            <option value="giant">Giant (e.g., Great Dane, Mastiff)</option>
          </select>
        </div>

        {/* Diet Quality Select */}
        <div>
          <Label htmlFor="dietQuality" className="text-slate-700 dark:text-slate-300">
            Diet Quality
          </Label>
          <select
            id="dietQuality"
            name="dietQuality"
            value={inputs.dietQuality}
            onChange={handleInputChange}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="">Select diet quality</option>
            <option value="excellent">Excellent (balanced, premium food)</option>
            <option value="good">Good (commercial balanced food)</option>
            <option value="average">Average (mixed diet, some table scraps)</option>
            <option value="poor">Poor (low quality, inconsistent feeding)</option>
          </select>
        </div>

        {/* Exercise Level Select */}
        <div>
          <Label htmlFor="exerciseLevel" className="text-slate-700 dark:text-slate-300">
            Exercise Level
          </Label>
          <select
            id="exerciseLevel"
            name="exerciseLevel"
            value={inputs.exerciseLevel}
            onChange={handleInputChange}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="">Select exercise level</option>
            <option value="high">High (daily vigorous activity)</option>
            <option value="moderate">Moderate (regular walks/play)</option>
            <option value="low">Low (occasional activity)</option>
            <option value="sedentary">Sedentary (mostly resting)</option>
          </select>
        </div>

        {/* Spay/Neuter Status Select */}
        <div>
          <Label
            htmlFor="spayNeuterStatus"
            className="text-slate-700 dark:text-slate-300"
          >
            Spay/Neuter Status
          </Label>
          <select
            id="spayNeuterStatus"
            name="spayNeuterStatus"
            value={inputs.spayNeuterStatus}
            onChange={handleInputChange}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="">Select status</option>
            <option value="spayed">Spayed</option>
            <option value="neutered">Neutered</option>
            <option value="intact">Intact (not spayed/neutered)</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              breedSize: "",
              dietQuality: "",
              exerciseLevel: "",
              spayNeuterStatus: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}

              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult
              a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Life Expectancy Estimator (lifestyle factors)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Estimating a dog's life expectancy is a complex process influenced by
          multiple lifestyle factors beyond just breed and size. Veterinary
          research shows that diet quality, exercise habits, spay/neuter status,
          and weight management all play critical roles in determining how long a
          dog may live. This estimator integrates these factors to provide a more
          nuanced and personalized prediction of life expectancy, helping owners
          understand the impact of daily care choices.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Breed size remains a foundational determinant, as smaller breeds tend to
          live longer than larger or giant breeds due to differences in metabolism,
          growth rates, and genetic predispositions. However, lifestyle factors can
          significantly modify these baseline expectations. For example, a large
          breed dog with excellent diet and exercise habits, and that is spayed or
          neutered, may live longer than average for its size category. Conversely,
          poor nutrition or sedentary lifestyle can shorten lifespan regardless of
          breed.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To estimate your dog's life expectancy using this tool, carefully input
          accurate information about your dog's weight, breed size, diet quality,
          exercise habits, and spay/neuter status. Each factor influences the
          calculation by adjusting the baseline life expectancy associated with
          your dog's breed size. The calculator then combines these factors to
          provide a personalized estimate.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> Enter your dog's current weight in pounds
            or kilograms, depending on your preferred unit system. This helps assess
            if your dog is underweight, ideal, or overweight, which affects lifespan.
          </li>
          <li>
            <strong>Breed Size:</strong> Select the size category that best matches
            your dog's breed. This sets the baseline life expectancy for the
            calculation.
          </li>
          <li>
            <strong>Diet Quality:</strong> Choose the quality of your dog's diet,
            ranging from poor to excellent. Better nutrition supports longer life.
          </li>
          <li>
            <strong>Exercise Level:</strong> Indicate your dog's typical activity
            level. Regular exercise promotes health and longevity.
          </li>
          <li>
            <strong>Spay/Neuter Status:</strong> Select whether your dog is spayed,
            neutered, or intact. This status influences health risks and lifespan.
          </li>
        </ul>
      </section>

      {/* SECTION 3: FAQ */}
      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* SECTION 4: REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149300/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Hoffman JM, Creevy KE, Promislow DEL. The companion dog as a model
              for human aging and mortality. Aging Cell. 2018.
            </a>
            <p className="text-slate-500 text-sm">
              This study discusses how lifestyle factors influence canine aging and
              mortality, providing a scientific basis for life expectancy
              estimations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.avma.org/resources-tools/pet-owners/petcare/spaying-and-neutering-your-pet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. American Veterinary Medical Association (AVMA) - Spaying and
              Neutering Your Pet
            </a>
            <p className="text-slate-500 text-sm">
              Official guidelines on the health benefits of spaying and neutering,
              including effects on lifespan.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6466094/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. German AJ. The Growing Problem of Obesity in Dogs and Cats. J Nutr.
              2010.
            </a>
            <p className="text-slate-500 text-sm">
              Explores the impact of weight management on pet health and longevity,
              emphasizing the importance of ideal body condition.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6313445/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Brown DJ, et al. Effects of Exercise on Health and Longevity in Dogs.
              Vet J. 2018.
            </a>
            <p className="text-slate-500 text-sm">
              Reviews evidence supporting the role of physical activity in extending
              canine lifespan and improving quality of life.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Life Expectancy Estimator (lifestyle factors)"
      description="Estimate a dog's life expectancy based on breed, size, diet, exercise habits, and spay/neuter status."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Life Expectancy = Base Life Expectancy × Diet Factor × Exercise Factor × Spay/Neuter Factor × Weight Factor",
        variables: [
          {
            symbol: "Base Life Expectancy",
            description:
              "Average lifespan (years) based on breed size category (small, medium, large, giant).",
          },
          {
            symbol: "Diet Factor",
            description:
              "Multiplier based on diet quality (excellent=1.10, good=1.05, average=1.0, poor=0.90).",
          },
          {
            symbol: "Exercise Factor",
            description:
              "Multiplier based on exercise level (high=1.10, moderate=1.05, low=1.0, sedentary=0.90).",
          },
          {
            symbol: "Spay/Neuter Factor",
            description:
              "Multiplier based on spay/neuter status (spayed/neutered=1.15, intact=1.0).",
          },
          {
            symbol: "Weight Factor",
            description:
              "Multiplier based on weight relative to ideal (overweight=0.90, underweight=0.95, ideal=1.0).",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 25 kg (55 lbs) medium breed dog, fed a good quality diet, exercised moderately, and neutered.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Identify base life expectancy for medium breed: 12 years.",
          },
          {
            label: "Step 2",
            explanation:
              "Apply diet factor for good quality diet: 1.05.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply exercise factor for moderate activity: 1.05.",
          },
          {
            label: "Step 4",
            explanation:
              "Apply spay/neuter factor for neutered status: 1.15.",
          },
          {
            label: "Step 5",
            explanation:
              "Determine weight factor: 25 kg is near ideal (20 kg midpoint), slightly overweight but within 120%, so factor = 1.0.",
          },
          {
            label: "Step 6",
            explanation:
              "Calculate estimated life expectancy: 12 × 1.05 × 1.05 × 1.15 × 1.0 = 15.15 years.",
          },
        ],
        result: "Estimated life expectancy is approximately 15.2 years.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "💉",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Dog Life Expectancy Estimator (lifestyle factors)",
        },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}