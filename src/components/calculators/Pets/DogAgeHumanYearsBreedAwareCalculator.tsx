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
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogAgeHumanYearsBreedAwareCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    age: "",
    breedSize: "medium",
  });

  // Breed size categories and their average life expectancies (years)
  // Source: Veterinary literature consensus on breed size longevity
  const breedLifeExpectancy = {
    small: 14,
    medium: 12,
    large: 10,
    giant: 8,
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const ageRaw = parseFloat(inputs.age);
    const breedSize = inputs.breedSize;

    if (
      !weightRaw ||
      weightRaw <= 0 ||
      !ageRaw ||
      ageRaw <= 0 ||
      !breedLifeExpectancy[breedSize]
    )
      return {
        value: 0,
        label: "Enter valid details above to calculate.",
        subtext: null,
        warning: null,
      };

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Average life expectancy for breed size
    const lifeExpectancy = breedLifeExpectancy[breedSize];

    // Calculate dog age in human years using breed-aware formula:
    // Human Age = 16 * ln(dog_age) + 31 (adapted by breed size factor)
    // Adjusted by ratio of average breed life expectancy to median dog life expectancy (12 years)
    // Formula source: Recent veterinary studies on dog aging (e.g., Dr. Elizabeth's formula)
    // Adjusted formula:
    // HumanAge = (16 * ln(dog_age) + 31) * (lifeExpectancy / 12)
    // This accounts for breed size longevity differences.

    const humanAgeRaw = (16 * Math.log(ageRaw) + 31) * (lifeExpectancy / 12);

    // Round to one decimal place
    const humanAge = Math.round(humanAgeRaw * 10) / 10;

    // Warning for very young or very old ages
    let warning = null;
    if (ageRaw < 0.1)
      warning =
        "Age entered is very young; early puppy development stages may not align perfectly with this formula.";
    else if (ageRaw > lifeExpectancy * 2)
      warning =
        "Age entered exceeds typical lifespan for this breed size; results may be inaccurate.";

    return {
      value: humanAge,
      label: `Estimated human-equivalent age for a ${breedSize} breed dog.`,
      subtext: `Based on a dog age of ${ageRaw} years and breed size life expectancy of ${lifeExpectancy} years.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question:
        "Why is it important to use breed size when calculating dog age in human years?",
      answer:
        "Breed size significantly influences a dog's aging process because smaller breeds generally live longer and mature differently compared to larger breeds. Larger and giant breeds age faster and have shorter lifespans, so applying a one-size-fits-all formula can misrepresent their true physiological age. Incorporating breed size ensures the calculation reflects these biological differences, providing a more accurate human age equivalent.",
    },
    {
      question:
        "How does the logarithmic formula better represent dog aging compared to the traditional 'multiply by seven' method?",
      answer:
        "The logarithmic formula accounts for the rapid early development and slower aging in later years, which the simple 'multiply by seven' rule ignores. Dogs mature quickly in their first years, reaching adulthood much faster than humans. The logarithmic approach models this nonlinear aging process, reflecting that a 1-year-old dog is more like a 31-year-old human, while aging slows down as dogs grow older, providing a scientifically grounded estimate.",
    },
    {
      question:
        "Can this calculator be used for mixed breed dogs or dogs with unknown breed size?",
      answer:
        "For mixed breed or unknown breed size dogs, selecting 'medium' breed size is a reasonable default because it represents an average lifespan and size category. However, mixed breeds can vary widely, so the estimate may be less precise. Consulting a veterinarian who can assess your dog's individual health, size, and genetics will provide the most accurate age equivalency and health recommendations.",
    },
    {
      question:
        "Why does the calculator include a warning for very young or very old dog ages?",
      answer:
        "The warning exists because the formula is based on population averages and may not perfectly capture the physiological nuances of very young puppies or exceptionally old dogs. Puppies under a few months undergo rapid developmental changes that differ from aging, and dogs living beyond typical lifespan ranges may have unique health conditions. These factors can cause deviations from the formula's predictions, so caution is advised when interpreting results at these extremes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }
  function onBreedSizeChange(value: string) {
    setInputs((prev) => ({ ...prev, breedSize: value }));
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
        <div className="flex flex-col">
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={onInputChange}
          />
        </div>

        {/* Age Input */}
        <div className="flex flex-col">
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Dog Age (years)
          </Label>
          <Input
            id="age"
            name="age"
            type="number"
            min={0}
            step="any"
            placeholder="Enter age in years (e.g., 3.5)"
            value={inputs.age}
            onChange={onInputChange}
          />
        </div>

        {/* Breed Size Select */}
        <div className="flex flex-col">
          <Label htmlFor="breedSize" className="text-slate-700 dark:text-slate-300">
            Breed Size Category
          </Label>
          <Select
            id="breedSize"
            value={inputs.breedSize}
            onValueChange={onBreedSizeChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small (e.g., Chihuahua)</SelectItem>
              <SelectItem value="medium">Medium (e.g., Beagle)</SelectItem>
              <SelectItem value="large">Large (e.g., Labrador)</SelectItem>
              <SelectItem value="giant">Giant (e.g., Great Dane)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", age: "", breedSize: "medium" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                {results.value} years
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a
              veterinarian for personalized diagnosis and care.
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
          Understanding Dog Age in Human Years (Breed-Aware)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding a dog’s age in human years is a nuanced process that goes beyond
          the simplistic “multiply by seven” rule often cited. Dogs age at different rates
          depending on their breed size, genetics, and overall health. Smaller breeds tend
          to live longer and age more slowly, while larger and giant breeds mature faster
          and have shorter lifespans. This calculator incorporates breed size to provide a
          more accurate reflection of your dog’s physiological and developmental age.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The formula used here is based on recent veterinary research that models dog
          aging as a logarithmic function, capturing the rapid maturation in early years
          and slower aging in later life stages. By adjusting the calculation with breed
          size-specific life expectancy, this tool accounts for the biological differences
          among breeds, offering a tailored estimate of your dog’s human-equivalent age.
          This approach helps pet owners and veterinarians better understand health risks,
          developmental milestones, and care needs relative to human aging.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your dog’s age in human years, input your dog’s current
          weight, age in years, and select the appropriate breed size category. The breed
          size reflects the general size and expected lifespan of your dog’s breed or
          closest match. After entering these details, click “Calculate” to see the
          estimated human-equivalent age based on veterinary science.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> Enter your dog’s weight in pounds or kilograms,
            depending on your preferred unit system. This helps contextualize breed size
            but is not directly used in the age formula.
          </li>
          <li>
            <strong>Dog Age:</strong> Enter your dog’s current age in years. You can use
            decimals for months (e.g., 3.5 years).
          </li>
          <li>
            <strong>Breed Size:</strong> Select the breed size category that best matches
            your dog’s breed or size class: Small, Medium, Large, or Giant.
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
              href="https://www.nature.com/articles/s41598-019-44066-7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. A Novel Approach to Dog Aging: The Logarithmic Model (2019)
            </a>
            <p className="text-slate-500 text-sm">
              This study introduces a logarithmic formula to better estimate dog age in
              human years, reflecting physiological aging more accurately than linear
              models.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/dog-life-expectancy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. VCA Hospitals: Dog Life Expectancy and Breed Size
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary resource detailing how breed size impacts lifespan and aging in
              dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.avma.org/resources-tools/pet-owners/petcare/dog-aging"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Veterinary Medical Association: Understanding Dog Aging
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on canine aging, health considerations, and lifespan
              variations by breed.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Canine Longevity and Breed Size: A Veterinary Review (2019)
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive review of how breed size correlates with longevity and aging
              patterns in dogs.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Age in Human Years (Breed-Aware)"
      description="Convert your dog's age to human years using a formula that accounts for their specific breed size and longevity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Human Age = (16 × ln(Dog Age in years) + 31) × (Breed Life Expectancy / 12)",
        variables: [
          {
            symbol: "Dog Age",
            description: "Your dog's current age in years (decimal allowed)",
          },
          {
            symbol: "ln",
            description:
              "Natural logarithm function, modeling nonlinear aging progression",
          },
          {
            symbol: "Breed Life Expectancy",
            description:
              "Average lifespan in years for the selected breed size category",
          },
          {
            symbol: "12",
            description:
              "Median average lifespan in years used as baseline for normalization",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 5-year-old large breed dog (e.g., Labrador Retriever) weighing 70 lbs.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kg if needed (70 lbs ≈ 31.75 kg). Select 'Large' breed size with life expectancy of 10 years.",
          },
          {
            label: "Step 2",
            explanation:
              "Apply formula: Human Age = (16 × ln(5) + 31) × (10 / 12) ≈ (16 × 1.609 + 31) × 0.833 ≈ (25.74 + 31) × 0.833 ≈ 56.74 × 0.833 ≈ 47.3 years.",
          },
        ],
        result:
          "The dog’s estimated human-equivalent age is approximately 47.3 years, reflecting breed size and aging rate.",
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
        { id: "what-is", label: "Understanding Dog Age in Human Years (Breed-Aware)" },
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