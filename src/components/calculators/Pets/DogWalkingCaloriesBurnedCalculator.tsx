import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogWalkingCaloriesBurnedCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    distance: "",
    pace: "",
  });

  // 2. LOGIC ENGINE
  // Formula explanation:
  // RER (Resting Energy Requirement) = 70 * (weightKg ^ 0.75)
  // METs (Metabolic Equivalent of Task) for walking varies by pace:
  // Approximate METs for dogs walking:
  // 2 mph (slow) ~ 2.5 METs, 3 mph (moderate) ~ 3.5 METs, 4 mph (fast) ~ 5 METs
  // Calories burned = (RER / 24) * METs * duration (hours)
  // Duration = distance (miles or km) / pace (mph or km/h)
  // We convert all units to metric internally for consistency.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const distanceRaw = parseFloat(inputs.distance);
    const paceRaw = parseFloat(inputs.pace);

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid dog weight.",
        subtext: null,
        warning: null,
      };
    }
    if (!distanceRaw || distanceRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid walking distance.",
        subtext: null,
        warning: null,
      };
    }
    if (!paceRaw || paceRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid walking pace.",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Convert distance to km if imperial (miles to km)
    const distanceKm = unit === "imperial" ? distanceRaw * 1.60934 : distanceRaw;

    // Convert pace to km/h if imperial (mph to km/h)
    const paceKmh = unit === "imperial" ? paceRaw * 1.60934 : paceRaw;

    // Calculate duration in hours
    const durationHours = distanceKm / paceKmh;

    // Calculate RER (Resting Energy Requirement)
    const RER = 70 * Math.pow(weightKg, 0.75);

    // Determine METs based on pace (km/h)
    // Approximate METs for dogs walking:
    // <3 km/h (slow) = 2.5 METs
    // 3-5 km/h (moderate) = 3.5 METs
    // >5 km/h (fast) = 5 METs
    let METs = 3.5; // default moderate
    if (paceKmh < 3) METs = 2.5;
    else if (paceKmh > 5) METs = 5;

    // Calories burned = (RER / 24) * METs * duration
    // RER/24 = kcal burned per hour at rest
    const caloriesBurned = (RER / 24) * METs * durationHours;

    // Round to nearest whole number
    const caloriesRounded = Math.round(caloriesBurned);

    // Warning if dog is very small or very large (weight extremes)
    let warning = null;
    if (weightKg < 2) {
      warning =
        "For very small dogs (<2 kg), calorie estimates may be less accurate. Consult your veterinarian for precise energy needs.";
    } else if (weightKg > 70) {
      warning =
        "For very large dogs (>70 kg), calorie expenditure can vary significantly. Use this estimate cautiously and consult your vet.";
    }

    return {
      value: caloriesRounded,
      label: "Calories burned during walk",
      subtext: `Based on a ${distanceRaw} ${unit === "imperial" ? "mile" : "km"} walk at ${paceRaw} ${unit === "imperial" ? "mph" : "km/h"}.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "How does a dog's weight affect calories burned during walking?",
      answer:
        "A dog's weight significantly influences the number of calories burned during walking because energy expenditure is proportional to body mass. Heavier dogs require more energy to move their body, thus burning more calories per unit of time or distance. The calculator uses Resting Energy Requirement (RER), which scales with weight raised to the 0.75 power, reflecting metabolic activity accurately for dogs of different sizes.",
    },
    {
      question: "Why is walking pace important in estimating calories burned for dogs?",
      answer:
        "Walking pace affects the intensity of exercise and thus the metabolic rate. Faster paces increase the dog's metabolic equivalent of task (METs), meaning the dog burns more calories per hour. This calculator adjusts calorie estimates based on pace categories, ensuring a more precise reflection of energy expenditure during slow, moderate, or brisk walks.",
    },
    {
      question: "Can this calculator replace veterinary advice for my dog's exercise needs?",
      answer:
        "No, this calculator provides an estimate based on scientific formulas but cannot replace personalized veterinary advice. Factors like breed, age, health conditions, and fitness level affect a dog's energy needs and exercise tolerance. Always consult your veterinarian to tailor exercise and nutrition plans specific to your dog's individual requirements.",
    },
    {
      question: "How accurate are calorie burn estimates for dogs using METs?",
      answer:
        "Calorie burn estimates using METs provide a useful approximation but have limitations. MET values for dogs are generalized from limited studies and may not capture breed-specific or individual variations in metabolism and gait. Environmental factors and terrain also influence energy expenditure. Therefore, these estimates should be used as guidelines rather than exact measurements.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

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
              <SelectItem value="imperial">Imperial (lbs, miles, mph)</SelectItem>
              <SelectItem value="metric">Metric (kg, km, km/h)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
              Dog's Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weight"
              type="number"
              min="0"
              step="any"
              placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="distance" className="text-slate-700 dark:text-slate-300">
              Walking Distance ({unit === "imperial" ? "miles" : "km"})
            </Label>
            <Input
              id="distance"
              type="number"
              min="0"
              step="any"
              placeholder={`Enter distance in ${unit === "imperial" ? "miles" : "km"}`}
              value={inputs.distance}
              onChange={(e) => handleInputChange("distance", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="pace" className="text-slate-700 dark:text-slate-300">
              Walking Pace ({unit === "imperial" ? "mph" : "km/h"})
            </Label>
            <Input
              id="pace"
              type="number"
              min="0"
              step="any"
              placeholder={`Enter pace in ${unit === "imperial" ? "mph" : "km/h"}`}
              value={inputs.pace}
              onChange={(e) => handleInputChange("pace", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", distance: "", pace: "" })}
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
          Understanding Dog Walking Calories Burned Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Dog Walking Calories Burned Calculator is a specialized veterinary tool designed to estimate the number of calories a dog expends during a walking session. Unlike human calorie calculators, it uses veterinary-specific metabolic formulas that consider a dog's unique physiology, such as Resting Energy Requirement (RER), which scales with body weight raised to the 0.75 power. This approach ensures more accurate energy estimations tailored to canine metabolism.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator integrates key variables including the dog's weight, walking distance, and pace to dynamically compute calorie burn. It applies Metabolic Equivalent of Task (MET) values adapted for dogs, reflecting different intensities of physical activity. By combining these factors, the tool provides an evidence-based estimate of energy expenditure, which can aid dog owners and veterinary professionals in managing exercise and nutrition plans effectively.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To obtain an accurate estimate of calories burned during your dog's walk, start by selecting the preferred unit system: Imperial or Metric. Then, enter your dog's weight, the total walking distance, and the average pace. The calculator will automatically convert units as needed and apply veterinary metabolic formulas to compute the calorie expenditure. This step-by-step process ensures the output is tailored to your dog's specific exercise session.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog's Weight:</strong> Input your dog's current weight in pounds or kilograms depending on the selected unit system. Accurate weight is critical as it directly influences metabolic calculations.
          </li>
          <li>
            <strong>Walking Distance:</strong> Enter the total distance walked during the session in miles or kilometers. This helps determine the duration of exercise when combined with pace.
          </li>
          <li>
            <strong>Walking Pace:</strong> Provide the average speed of the walk in miles per hour or kilometers per hour. Pace affects the intensity and thus the metabolic rate during exercise.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4646807/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. National Research Council (2006) - Nutrient Requirements of Dogs and Cats
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines outlining energy requirements and metabolic calculations for canine nutrition and exercise.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.sciencedirect.com/science/article/abs/pii/S1090023316300916"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Energy Expenditure of Dogs During Exercise (2016) - Journal of Veterinary Science
            </a>
            <p className="text-slate-500 text-sm">
              Research article detailing metabolic equivalents (METs) and energy expenditure in dogs at various exercise intensities.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/weight-management/weight_management_guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Animal Hospital Association (AAHA) Weight Management Guidelines (2018)
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines for managing canine weight, including exercise and calorie expenditure recommendations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/Canine%20Energy%20Requirements.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. University of California Davis - Canine Energy Requirements
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource explaining resting and active energy requirements for dogs, including formulas and practical applications.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Walking Calories Burned Calculator"
      description="Estimate the number of calories your dog burns during walks based on distance, pace, and body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Calories Burned = (RER / 24) × METs × Duration (hours), where RER = 70 × weightKg^0.75, Duration = distanceKm / paceKmh",
        variables: [
          { symbol: "weightKg", description: "Dog's weight in kilograms" },
          { symbol: "RER", description: "Resting Energy Requirement in kcal/day" },
          { symbol: "METs", description: "Metabolic Equivalent of Task based on walking pace" },
          { symbol: "distanceKm", description: "Walking distance in kilometers" },
          { symbol: "paceKmh", description: "Walking pace in kilometers per hour" },
          { symbol: "Duration", description: "Duration of walk in hours" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb (13.6 kg) dog walks 2 miles (3.2 km) at a pace of 3 mph (4.8 km/h). Calculate calories burned.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kg: 30 lbs ÷ 2.20462 = 13.6 kg. Calculate RER: 70 × 13.6^0.75 ≈ 429 kcal/day.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate duration: 3.2 km ÷ 4.8 km/h = 0.67 hours. Determine METs for 4.8 km/h pace: 3.5 METs.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate calories burned: (429 ÷ 24) × 3.5 × 0.67 ≈ 41.7 kcal burned during the walk.",
          },
        ],
        result: "The dog burns approximately 42 calories during this 2-mile walk at a moderate pace.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Walking Calories Burned Calculator" },
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