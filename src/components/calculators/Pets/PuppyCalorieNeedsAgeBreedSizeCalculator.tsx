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
  Calculator,
  RotateCcw,
  AlertTriangle,
  Info,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PuppyCalorieNeedsAgeBreedSizeCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  // Inputs: Current Weight, Age (weeks), Breed Size (Small, Medium, Large)
  const [inputs, setInputs] = useState({
    weight: "",
    ageWeeks: "",
    breedSize: "medium",
  });

  // Breed size multipliers for MER based on NRC and AAFCO puppy growth guidelines:
  // Small breed (<20 lbs adult): MER = 3.0 x RER (up to 4 months), then 2.0 x RER (4-12 months)
  // Medium breed (20-50 lbs adult): MER = 3.0 x RER (up to 4 months), then 2.5 x RER (4-12 months)
  // Large breed (>50 lbs adult): MER = 3.0 x RER (up to 4 months), then 2.8 x RER (4-12 months)
  // After 12 months, adult maintenance applies (not covered here).

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const ageRaw = parseInt(inputs.ageWeeks, 10);
    const breedSize = inputs.breedSize;

    // Safety Check
    if (
      !weightRaw ||
      weightRaw <= 0 ||
      !ageRaw ||
      ageRaw <= 0 ||
      ageRaw > 52 ||
      !["small", "medium", "large"].includes(breedSize)
    )
      return {
        value: 0,
        label: "Enter valid weight, age (1-52 weeks), and breed size.",
      };

    // Conversion to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Calculate Resting Energy Requirement (RER)
    // RER = 70 * (weight_kg ^ 0.75)
    const rer = 70 * Math.pow(weightKg, 0.75);

    // Determine MER multiplier based on age and breed size
    // Puppies up to 16 weeks (4 months) have highest energy needs (3.0 x RER)
    // Between 16 and 52 weeks, MER decreases depending on breed size
    let merMultiplier = 3.0; // default for <=16 weeks

    if (ageRaw > 16 && ageRaw <= 52) {
      switch (breedSize) {
        case "small":
          merMultiplier = 2.0;
          break;
        case "medium":
          merMultiplier = 2.5;
          break;
        case "large":
          merMultiplier = 2.8;
          break;
      }
    } else if (ageRaw > 52) {
      // Beyond 1 year, adult maintenance applies (not calculated here)
      return {
        value: 0,
        label:
          "This calculator is for puppies up to 52 weeks old. For adult dogs, use the adult calorie calculator.",
      };
    }

    // Calculate MER (Maintenance Energy Requirement)
    const mer = rer * merMultiplier;

    // Convert output calories to integer for display
    const calories = Math.round(mer);

    // Display weight in user's unit system with 1 decimal place
    const displayWeight =
      unit === "imperial"
        ? weightRaw.toFixed(1) + " lbs"
        : weightKg.toFixed(1) + " kg";

    // Age display in weeks and months
    const ageMonths = (ageRaw / 4.345).toFixed(1);

    // Breed size label capitalized
    const breedSizeLabel =
      breedSize.charAt(0).toUpperCase() + breedSize.slice(1);

    return {
      value: calories.toLocaleString(),
      label: `Daily Calorie Needs for a ${displayWeight} ${breedSizeLabel} Breed Puppy at ${ageRaw} weeks (~${ageMonths} months)`,
      subtext: `Based on Resting Energy Requirement (RER) multiplied by a factor of ${merMultiplier.toFixed(
        1
      )} for growth stage.`,
      warning:
        ageRaw < 8
          ? "Puppies under 8 weeks should primarily nurse or be fed a specialized formula. Consult your veterinarian for feeding guidance."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (Rich Content)
  const faqs = [
    {
      question:
        "Why is it important to calculate a puppy's calorie needs based on age and breed size?",
      answer:
        "Calculating a puppy's calorie needs by age and breed size ensures optimal growth and development. Puppies have varying energy requirements depending on their growth stage and expected adult size. Overfeeding can lead to obesity and skeletal issues, while underfeeding may cause malnutrition and stunted growth. Tailoring calories helps maintain healthy weight and supports organ and bone development.",
    },
    {
      question:
        "How does the Resting Energy Requirement (RER) differ from Maintenance Energy Requirement (MER) in puppies?",
      answer:
        "RER represents the baseline calories a puppy needs at complete rest to maintain vital functions. MER accounts for additional energy demands like growth, activity, and thermoregulation by applying multipliers to RER. Puppies require higher MER multipliers than adult dogs due to rapid growth and higher activity levels, making MER a more accurate reflection of their daily calorie needs.",
    },
    {
      question:
        "Why do large breed puppies have different calorie multipliers compared to small breed puppies?",
      answer:
        "Large breed puppies grow at a different rate and have unique nutritional needs to prevent rapid weight gain that can stress developing joints. Their MER multipliers are adjusted to moderate growth and reduce the risk of skeletal disorders. Small breed puppies, with faster growth rates and smaller frames, require different energy levels to support their metabolism and development.",
    },
    {
      question:
        "Can I use this calculator for puppies older than 1 year or adult dogs?",
      answer:
        "This calculator is specifically designed for puppies up to 52 weeks old, as their energy needs differ significantly from adults. After 1 year, dogs enter maintenance phases with different calorie requirements. For adult dogs, specialized calculators that consider activity level, weight, and health status provide more accurate calorie estimations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET INPUTS
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

        {/* Current Weight */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          />
        </div>

        {/* Age in Weeks */}
        <div>
          <Label htmlFor="ageWeeks" className="text-slate-700 dark:text-slate-300">
            Age (weeks)
          </Label>
          <Input
            id="ageWeeks"
            type="number"
            min={1}
            max={52}
            step={1}
            value={inputs.ageWeeks}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, ageWeeks: e.target.value }))
            }
            placeholder="Enter age in weeks (1-52)"
          />
        </div>

        {/* Breed Size */}
        <div>
          <Label htmlFor="breedSize" className="text-slate-700 dark:text-slate-300">
            Expected Adult Breed Size
          </Label>
          <Select
            id="breedSize"
            value={inputs.breedSize}
            onValueChange={(value) =>
              setInputs((prev) => ({ ...prev, breedSize: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small (&lt;20 lbs)</SelectItem>
              <SelectItem value="medium">Medium (20-50 lbs)</SelectItem>
              <SelectItem value="large">Large (&gt;50 lbs)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger re-render, calculation is in useMemo
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ weight: "", ageWeeks: "", breedSize: "medium" })
          }
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
              <strong>Veterinary Disclaimer:</strong> This tool is for educational
              purposes. Consult your veterinarian for a specific feeding and growth
              plan tailored to your puppy's needs.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL CONTENT (Rich SEO Content)
  const editorial = (
    <div className="space-y-12">
      {/* WHAT IS SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Puppy Calorie Needs by Age/Breed Size Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Puppies undergo rapid growth and development during their first year of
          life, requiring precise nutritional management to support healthy
          maturation. The <strong>Resting Energy Requirement (RER)</strong> forms the
          foundation for calculating a puppy's energy needs, representing the calories
          needed at rest to maintain vital bodily functions. However, puppies are
          highly active and growing, so their actual calorie needs are higher than
          RER alone.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To account for growth and activity, veterinarians use the{" "}
          <strong>Maintenance Energy Requirement (MER)</strong>, which multiplies RER
          by a factor depending on the puppy’s age and expected adult breed size.
          This calculator integrates these veterinary formulas to provide tailored
          daily calorie estimates for puppies, ensuring they receive adequate energy
          without risking overfeeding or undernutrition.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Breed size significantly influences energy requirements. Small breed
          puppies mature faster and have different metabolic rates compared to large
          breeds, which grow more slowly and require careful calorie management to
          prevent skeletal issues. By inputting your puppy’s current weight, age in
          weeks, and expected adult breed size, this tool delivers a scientifically
          grounded calorie estimate to support optimal growth.
        </p>
      </section>

      {/* HOW TO USE SECTION */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide accurate
          calorie needs for your growing puppy. Begin by selecting your preferred
          unit system—Imperial (pounds) or Metric (kilograms)—to match how you measure
          your puppy’s weight. Then, enter your puppy’s current weight, age in weeks,
          and expected adult breed size.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Current Weight:</strong> Enter your puppy’s present weight using
            the selected unit. Accurate weight measurement is crucial for precise
            calorie calculation.
          </li>
          <li>
            <strong>Age (weeks):</strong> Input your puppy’s age in weeks (1-52).
            This helps adjust calorie needs according to growth stages.
          </li>
          <li>
            <strong>Expected Adult Breed Size:</strong> Choose the size category your
            puppy will likely reach as an adult (Small, Medium, Large). This affects
            the energy multiplier used in calculations.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering these details, click “Calculate” to see the estimated daily
          calorie needs. Use this information to guide feeding amounts and discuss
          with your veterinarian to tailor a nutrition plan specific to your puppy’s
          health and lifestyle.
        </p>
      </section>

      {/* FAQ SECTION */}
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

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/nutrition-of-dogs-and-cats/nutritional-requirements-of-puppies"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Nutritional Requirements of Puppies
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive guide on puppy nutrition, energy requirements, and growth
              considerations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition-guidelines-for-dogs-and-cats.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. American Animal Hospital Association (AAHA) - Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Evidence-based guidelines for feeding growing puppies and managing energy
              needs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vetnutrition.tufts.edu/2014/04/puppy-growth-and-nutrition/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Tufts University Cummings Veterinary Nutrition - Puppy Growth and
              Nutrition
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Insights into growth rates, energy requirements, and feeding strategies
              for puppies.
            </p>
          </li>
          <li className="block">
            <a
              href="https://petobesityprevention.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Association for Pet Obesity Prevention (APOP)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Guidelines on safe weight management and caloric intake to prevent
              obesity in pets.
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
        title: "Veterinary Formula",
        formula: "RER = 70 × (Weight in kg)^0.75",
        variables: [
          { symbol: "RER", description: "Resting Energy Requirement (Calories at rest)" },
          { symbol: "MER", description: "Maintenance Energy Requirement (Activity Multiplier)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 12-week-old medium breed puppy weighing 15 lbs needs an estimate of daily calorie requirements.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kg: 15 lbs ÷ 2.20462 = 6.8 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate RER: 70 × (6.8)^0.75 ≈ 70 × 3.9 = 273 calories.",
          },
          {
            label: "Step 3",
            explanation:
              "Determine MER multiplier for 12 weeks medium breed: 3.0.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate daily calories: 273 × 3.0 = 819 calories per day.",
          },
        ],
        result:
          "The puppy requires approximately 819 calories daily to support healthy growth.",
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
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
        {
          title: "Dog Daily Water Intake Checker",
          url: "/pets/dog-daily-water-intake-checker",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Puppy Calorie Needs by Age/Breed Size Calculator",
        },
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}