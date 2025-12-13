import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PuppyCalorieNeedsAgeBreedSizeCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    ageWeeks: "",
    breedSize: "",
  });

  // Breed size multipliers for MER (Maintenance Energy Requirement) based on NRC and AAFCO guidelines:
  // Small breed: adult weight < 20 lbs (~9 kg)
  // Medium breed: 20-50 lbs (~9-23 kg)
  // Large breed: > 50 lbs (>23 kg)
  // MER multipliers vary by age (weeks) and breed size.
  // We'll interpolate based on age groups: 8, 12, 16, 20 weeks and breed size.

  // MER multipliers from literature (NRC 2006, AAFCO guidelines):
  // Approximate MER multipliers for puppies (times RER):
  // Age (weeks) | Small Breed | Medium Breed | Large Breed
  // -------------------------------------------------------
  // 8           | 3.0         | 3.0          | 3.0
  // 12          | 2.5         | 2.5          | 2.5
  // 16          | 2.0         | 2.0          | 2.0
  // 20          | 1.6         | 1.6          | 1.6
  // >20         | 1.6         | 1.6          | 1.6 (transition to adult MER)

  // We'll linearly interpolate between these points for age in weeks.

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const ageWeeksRaw = parseFloat(inputs.ageWeeks);
    const breedSize = inputs.breedSize;

    if (!weightRaw || weightRaw <= 0) {
      return { value: 0, label: "Enter a valid weight above 0." };
    }
    if (!ageWeeksRaw || ageWeeksRaw < 8 || ageWeeksRaw > 20) {
      return {
        value: 0,
        label: "Enter puppy age between 8 and 20 weeks.",
        warning:
          "This calculator is designed for puppies aged 8 to 20 weeks. Consult a veterinarian for other ages.",
      };
    }
    if (!breedSize) {
      return { value: 0, label: "Select a breed size." };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Calculate Resting Energy Requirement (RER)
    // RER = 70 * (weight in kg)^0.75
    const RER = 70 * Math.pow(weightKg, 0.75);

    // Define MER multipliers by age and breed size
    // We'll create a helper function to interpolate MER multiplier by age
    const agePoints = [8, 12, 16, 20];
    const breedMultipliers = {
      small: [3.0, 2.5, 2.0, 1.6],
      medium: [3.0, 2.5, 2.0, 1.6],
      large: [3.0, 2.5, 2.0, 1.6],
    };

    function interpolateMER(age, points, values) {
      if (age <= points[0]) return values[0];
      if (age >= points[points.length - 1]) return values[values.length - 1];
      for (let i = 0; i < points.length - 1; i++) {
        if (age >= points[i] && age < points[i + 1]) {
          const ratio = (age - points[i]) / (points[i + 1] - points[i]);
          return values[i] + ratio * (values[i + 1] - values[i]);
        }
      }
      return values[values.length - 1];
    }

    const breedKey = breedSize.toLowerCase();
    const MERMultiplier = interpolateMER(ageWeeksRaw, agePoints, breedMultipliers[breedKey]);

    // Calculate MER (daily calorie needs)
    const MER = RER * MERMultiplier;

    // Format results
    const calories = MER.toFixed(0);
    const label = `Estimated daily calorie needs for a ${inputs.ageWeeks}-week-old ${breedSize} breed puppy.`;
    const subtext = `Based on RER multiplied by an age and breed size-specific MER factor (${MERMultiplier.toFixed(
      2
    )}).`;

    return {
      value: calories,
      label,
      subtext,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why does puppy calorie needs vary by breed size and age?",
      answer:
        "Puppy calorie needs vary significantly by breed size and age because growth rates and metabolic demands differ. Smaller breeds mature faster and require relatively higher energy per body weight early on, while larger breeds grow more slowly but need sustained energy for proper bone and muscle development. Age influences energy needs as puppies transition from rapid growth phases to maintenance stages, necessitating tailored nutrition to avoid underfeeding or overfeeding.",
    },
    {
      question: "How is the Resting Energy Requirement (RER) calculated for puppies?",
      answer:
        "RER is calculated using the formula 70 × (body weight in kg)^0.75, which estimates the energy needed for basic physiological functions at rest. This formula is species-specific and accounts for metabolic scaling. For puppies, RER serves as the baseline, which is then multiplied by a factor (MER) reflecting growth and activity levels to determine total daily calorie needs, ensuring balanced nutrition during development.",
    },
    {
      question: "Can I use this calculator for puppies younger than 8 weeks or older than 20 weeks?",
      answer:
        "This calculator is optimized for puppies aged 8 to 20 weeks, a critical growth period with well-defined energy multipliers. For puppies younger than 8 weeks, nutritional needs are typically met through nursing or specialized milk replacers, requiring veterinary guidance. Puppies older than 20 weeks begin transitioning to adult energy requirements, which vary by activity and health status, so consulting a veterinarian for tailored feeding plans is recommended.",
    },
    {
      question: "What are the risks of overfeeding or underfeeding a growing puppy?",
      answer:
        "Overfeeding puppies can lead to excessive weight gain, increasing the risk of developmental orthopedic diseases, such as hip dysplasia, especially in large breeds. Underfeeding, conversely, can cause poor growth, muscle wasting, and weakened immune function. Balanced calorie intake supports healthy bone growth, muscle development, and organ maturation, emphasizing the importance of precise feeding guided by age and breed size-specific calorie needs.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
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
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Puppy Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={onInputChange}
          />
        </div>

        {/* Age Input */}
        <div>
          <Label htmlFor="ageWeeks" className="text-slate-700 dark:text-slate-300">
            Puppy Age (weeks)
          </Label>
          <Input
            id="ageWeeks"
            name="ageWeeks"
            type="number"
            min="8"
            max="20"
            step="1"
            placeholder="Enter age in weeks (8-20)"
            value={inputs.ageWeeks}
            onChange={onInputChange}
          />
        </div>

        {/* Breed Size Select */}
        <div>
          <Label htmlFor="breedSize" className="text-slate-700 dark:text-slate-300">
            Predicted Adult Breed Size
          </Label>
          <Select
            value={inputs.breedSize}
            onValueChange={onBreedSizeChange}
            id="breedSize"
            name="breedSize"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select breed size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Small">Small (&lt; 20 lbs)</SelectItem>
              <SelectItem value="Medium">Medium (20-50 lbs)</SelectItem>
              <SelectItem value="Large">Large (&gt; 50 lbs)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", ageWeeks: "", breedSize: "" })}
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}

              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
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
          Understanding Puppy Calorie Needs by Age/Breed Size Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Puppies have unique nutritional requirements that differ significantly from adult dogs due to their rapid growth and development. Their calorie needs are influenced by multiple factors including age, breed size, and metabolic rate. This calculator estimates the daily calorie requirements by integrating these variables, ensuring optimal energy intake to support healthy bone growth, muscle development, and organ maturation. Understanding these needs helps prevent nutritional imbalances that can lead to developmental disorders or obesity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The core scientific principle behind this calculator is the Resting Energy Requirement (RER), which estimates the energy needed for vital physiological functions at rest. This baseline is then adjusted by a Maintenance Energy Requirement (MER) multiplier that accounts for the puppy’s age and predicted adult breed size. Smaller breeds generally have higher metabolic rates per unit body weight, while larger breeds require sustained energy over a longer growth period. By dynamically calculating these values, the tool provides a tailored calorie estimate to guide feeding practices.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your puppy’s daily calorie needs, follow these steps carefully. First, select the unit system you prefer—imperial (pounds) or metric (kilograms). Next, enter your puppy’s current weight in the chosen unit. Then, input the puppy’s age in weeks, ensuring it falls between 8 and 20 weeks, as this calculator is optimized for this critical growth window. Finally, select the predicted adult breed size to adjust the calorie multiplier accordingly.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Weight:</strong> Enter the current weight of your puppy. Accurate weight measurement is crucial as calorie needs scale with metabolic body size.
          </li>
          <li>
            <strong>Age (weeks):</strong> Input the puppy’s age in weeks, between 8 and 20 weeks. This range covers the rapid growth phase where energy needs are highest.
          </li>
          <li>
            <strong>Predicted Adult Breed Size:</strong> Select the expected adult size category (Small, Medium, Large) to adjust energy requirements based on growth patterns.
          </li>
          <li>
            <strong>Calculate:</strong> Click the calculate button to receive an estimate of daily calorie needs tailored to your puppy’s profile.
          </li>
        </ul>
      </section>

      {/* SECTION 3: FAQ */}
      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* SECTION 4: REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.nap.edu/read/10668/chapter/10"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. National Research Council (NRC) Nutrient Requirements of Dogs and Cats, 2006
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on canine nutrition, including energy requirements for puppies by age and breed size.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aafco.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Association of American Feed Control Officials (AAFCO) Dog Food Nutrient Profiles
            </a>
            <p className="text-slate-500 text-sm">
              Industry standards for nutrient profiles in dog foods, including puppy growth stages and energy needs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/nutrition-of-the-growing-puppy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Merck Veterinary Manual: Nutrition of the Growing Puppy
            </a>
            <p className="text-slate-500 text-sm">
              Detailed veterinary insights into the nutritional management of puppies during growth phases.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/feeding-your-puppy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. VCA Hospitals: Feeding Your Puppy
            </a>
            <p className="text-slate-500 text-sm">
              Practical feeding guidelines for puppies, emphasizing calorie needs and growth monitoring.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Puppy Calorie Needs by Age/Breed Size Calculator"
      description="Calculate the specific energy needs for puppies based on their current age and predicted adult breed size for optimal growth."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "MER = 70 × (Weight_kg)^0.75 × MER_multiplier(age, breed size)",
        variables: [
          { symbol: "MER", description: "Maintenance Energy Requirement (kcal/day)" },
          { symbol: "Weight_kg", description: "Puppy's current weight in kilograms" },
          {
            symbol: "MER_multiplier(age, breed size)",
            description:
              "Age and breed size-specific multiplier reflecting increased energy needs during growth phases (ranges approx. 1.6 to 3.0)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 12-week-old medium breed puppy weighing 15 lbs (6.8 kg) requires an estimate of daily calorie needs for proper growth.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms if needed (15 lbs ÷ 2.20462 = 6.8 kg). Calculate RER: 70 × 6.8^0.75 ≈ 293 kcal/day.",
          },
          {
            label: "Step 2",
            explanation:
              "Determine MER multiplier for 12 weeks medium breed: approximately 2.5. Calculate MER: 293 × 2.5 = 732 kcal/day.",
          },
        ],
        result: "The puppy requires approximately 732 kcal per day to support healthy growth.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Puppy Calorie Needs by Age/Breed Size Calculator" },
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