import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PuppyAdultSizePredictorWeightCurveCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    currentWeight: "",
    currentAgeWeeks: "",
    breedSize: "medium",
  });

  // Breed size categories and their typical adult weight ranges (lbs)
  // Used for curve adjustment and sanity checks
  const breedSizeRanges = {
    small: { min: 5, max: 22 },
    medium: { min: 23, max: 55 },
    large: { min: 56, max: 99 },
    giant: { min: 100, max: 200 },
  };

  // 2. LOGIC ENGINE
  // Puppy Adult Size Predictor based on growth curve method:
  // Adult Weight ≈ Current Weight / (Proportion of adult weight expected at current age)
  // Proportion values are breed-size and age dependent, derived from veterinary growth curve data.
  // For example, a medium breed puppy at 12 weeks is approx 30% of adult weight.
  // We will interpolate proportions for weeks 8-52 based on typical growth curves.

  // Growth proportions by breed size and age (weeks)
  // These are approximate typical proportions of adult weight at given ages.
  // Source: Veterinary growth curve data (e.g., Kienzle et al., 1998; NRC guidelines)
  const growthProportions = {
    small: [
      { week: 8, prop: 0.45 },
      { week: 12, prop: 0.65 },
      { week: 16, prop: 0.80 },
      { week: 20, prop: 0.90 },
      { week: 24, prop: 0.95 },
      { week: 52, prop: 1.0 },
    ],
    medium: [
      { week: 8, prop: 0.30 },
      { week: 12, prop: 0.50 },
      { week: 16, prop: 0.65 },
      { week: 20, prop: 0.80 },
      { week: 24, prop: 0.90 },
      { week: 52, prop: 1.0 },
    ],
    large: [
      { week: 8, prop: 0.20 },
      { week: 12, prop: 0.35 },
      { week: 16, prop: 0.50 },
      { week: 20, prop: 0.65 },
      { week: 24, prop: 0.80 },
      { week: 52, prop: 1.0 },
    ],
    giant: [
      { week: 8, prop: 0.15 },
      { week: 12, prop: 0.25 },
      { week: 16, prop: 0.40 },
      { week: 20, prop: 0.55 },
      { week: 24, prop: 0.70 },
      { week: 52, prop: 1.0 },
    ],
  };

  // Linear interpolation helper
  function interpolate(x, x0, y0, x1, y1) {
    if (x1 === x0) return y0;
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }

  // Get proportion for current age and breed size by interpolation
  function getProportion(ageWeeks, breedSize) {
    const points = growthProportions[breedSize];
    if (ageWeeks <= points[0].week) return points[0].prop;
    if (ageWeeks >= points[points.length - 1].week) return points[points.length - 1].prop;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      if (ageWeeks >= p0.week && ageWeeks <= p1.week) {
        return interpolate(ageWeeks, p0.week, p0.prop, p1.week, p1.prop);
      }
    }
    return 1.0; // fallback
  }

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.currentWeight);
    const ageRaw = parseFloat(inputs.currentAgeWeeks);
    const breedSize = inputs.breedSize;

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid current weight.",
        subtext: null,
        warning: null,
      };
    }
    if (!ageRaw || ageRaw < 4 || ageRaw > 52) {
      return {
        value: 0,
        label: "Please enter a valid age between 4 and 52 weeks.",
        subtext: null,
        warning: null,
      };
    }
    if (!["small", "medium", "large", "giant"].includes(breedSize)) {
      return {
        value: 0,
        label: "Please select a valid breed size category.",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to lbs if metric
    const weightLbs = unit === "imperial" ? weightRaw : weightRaw * 2.20462;

    // Get proportion of adult weight expected at current age for breed size
    const proportion = getProportion(ageRaw, breedSize);

    // Calculate estimated adult weight
    // Adult Weight = Current Weight / Proportion
    const estimatedAdultWeightLbs = weightLbs / proportion;

    // Sanity check: warn if estimated adult weight is outside typical breed size range
    const range = breedSizeRanges[breedSize];
    let warning = null;
    if (estimatedAdultWeightLbs < range.min * 0.8) {
      warning = `Estimated adult weight is unusually low for a ${breedSize} breed. Consider consulting your veterinarian.`;
    } else if (estimatedAdultWeightLbs > range.max * 1.2) {
      warning = `Estimated adult weight is unusually high for a ${breedSize} breed. Consider consulting your veterinarian.`;
    }

    // Convert result to selected unit
    const displayWeight = unit === "imperial" ? estimatedAdultWeightLbs : estimatedAdultWeightLbs / 2.20462;

    return {
      value: displayWeight.toFixed(1),
      label: `Estimated Adult Weight (${unit === "imperial" ? "lbs" : "kg"})`,
      subtext: `Based on a ${ageRaw.toFixed(0)}-week-old ${breedSize} breed puppy weighing ${weightRaw} ${unit === "imperial" ? "lbs" : "kg"}.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "How accurate is the Puppy Adult Size Predictor (Weight Curve) calculator?",
      answer:
        "This calculator provides an estimate based on typical growth curves for different breed sizes, which are derived from veterinary research and clinical data. However, individual puppies may grow at different rates due to genetics, nutrition, and health status. Therefore, while useful for general guidance, it should not replace veterinary assessment and monitoring for precise adult size prediction.",
    },
    {
      question: "Why does breed size affect the growth curve and adult weight prediction?",
      answer:
        "Breed size significantly influences growth rate and final adult weight because small, medium, large, and giant breeds have distinct growth patterns. Smaller breeds mature faster and reach adult weight earlier, while larger breeds grow more slowly over a longer period. This calculator adjusts predictions accordingly to reflect these biological differences, improving accuracy.",
    },
    {
      question: "Can I use this calculator for mixed breed puppies?",
      answer:
        "For mixed breed puppies, this calculator can still provide a rough estimate if you select the breed size category that best matches the expected adult size. However, mixed breeds may have more variable growth patterns, so predictions are less precise. Consulting a veterinarian for tailored growth monitoring is recommended for mixed breeds.",
    },
    {
      question: "Why is it important to monitor a puppy's growth curve?",
      answer:
        "Monitoring a puppy's growth curve helps ensure they are developing healthily and can identify nutritional or health issues early. Deviations from expected growth patterns may indicate underlying problems such as malnutrition, illness, or genetic conditions. Regular tracking allows timely interventions to optimize health and adult size outcomes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(e) {
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

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
              Current Puppy Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="currentWeight"
              name="currentWeight"
              type="number"
              min="0"
              step="any"
              placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
              value={inputs.currentWeight}
              onChange={handleInputChange}
              aria-describedby="weightHelp"
            />
            <p id="weightHelp" className="text-xs text-slate-500 mt-1">
              Use an accurate scale for best results.
            </p>
          </div>

          <div>
            <Label htmlFor="currentAgeWeeks" className="text-slate-700 dark:text-slate-300">
              Puppy Age (weeks)
            </Label>
            <Input
              id="currentAgeWeeks"
              name="currentAgeWeeks"
              type="number"
              min="4"
              max="52"
              step="1"
              placeholder="Enter age in weeks (4-52)"
              value={inputs.currentAgeWeeks}
              onChange={handleInputChange}
              aria-describedby="ageHelp"
            />
            <p id="ageHelp" className="text-xs text-slate-500 mt-1">
              Age range: 4 to 52 weeks (1 year).
            </p>
          </div>

          <div>
            <Label htmlFor="breedSize" className="text-slate-700 dark:text-slate-300">
              Breed Size Category
            </Label>
            <Select
              id="breedSize"
              name="breedSize"
              value={inputs.breedSize}
              onValueChange={(value) => setInputs((prev) => ({ ...prev, breedSize: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (5-22 lbs)</SelectItem>
                <SelectItem value="medium">Medium (23-55 lbs)</SelectItem>
                <SelectItem value="large">Large (56-99 lbs)</SelectItem>
                <SelectItem value="giant">Giant (100+ lbs)</SelectItem>
              </SelectContent>
            </Select>
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
          aria-label="Calculate estimated adult weight"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ currentWeight: "", currentAgeWeeks: "", breedSize: "medium" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for personalized diagnosis and care.
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
          Understanding Puppy Adult Size Predictor (Weight Curve)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Predicting a puppy's adult size is a complex process that involves understanding growth patterns unique to different breeds and sizes. Puppies grow at varying rates depending on their genetic background, nutrition, and overall health. This tool leverages veterinary growth curve data to estimate adult weight by comparing a puppy's current weight and age against typical growth proportions for their breed size category. These proportions represent the expected percentage of adult weight a puppy should have at a given age.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator uses breed size categories—small, medium, large, and giant—to adjust predictions because each category follows distinct growth trajectories. For example, small breeds reach their adult weight faster than giant breeds, which continue growing for a longer period. By interpolating growth proportions between known age milestones, this tool provides a scientifically grounded estimate of adult weight. However, individual variation always exists, so this estimate should be used as a guide alongside regular veterinary check-ups.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately predict your puppy's adult size using this calculator, follow these steps carefully. First, select the unit system you prefer—Imperial (pounds) or Metric (kilograms). Next, enter your puppy's current weight using a reliable scale to ensure precision. Then, input your puppy's age in weeks, ensuring it falls between 4 and 52 weeks, as this range aligns with typical growth curve data. Finally, select the breed size category that best represents your puppy's expected adult size. Once all inputs are entered, click 'Calculate' to view the estimated adult weight.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Current Puppy Weight:</strong> Use an accurate scale to measure your puppy’s weight in the selected unit system. This value is critical for the calculation.
          </li>
          <li>
            <strong>Puppy Age (weeks):</strong> Enter the puppy’s age in weeks, between 4 and 52 weeks. This ensures the growth proportion data applies correctly.
          </li>
          <li>
            <strong>Breed Size Category:</strong> Choose the category that best fits your puppy’s expected adult size. This adjusts the growth curve used for prediction.
          </li>
          <li>
            <strong>Calculate and Interpret:</strong> Click 'Calculate' to get the estimated adult weight. Review any warnings for unusual results and consult your veterinarian if needed.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149869/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Kienzle E, Moik K. Growth curves of dogs of different breeds. Journal of Nutrition. 1998.
            </a>
            <p className="text-slate-500 text-sm">
              This study provides detailed growth curve data for various dog breeds, forming the basis for breed-specific growth predictions.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nap.edu/read/10668/chapter/6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Research Council (NRC). Nutrient Requirements of Dogs and Cats. 2006.
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on canine nutrition and growth, including energy requirements and growth monitoring recommendations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/weight-management/weight_management_guidelines_final.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Animal Hospital Association (AAHA). Canine and Feline Weight Management Guidelines. 2018.
            </a>
            <p className="text-slate-500 text-sm">
              Clinical guidelines emphasizing the importance of monitoring growth and weight to prevent obesity and related health issues.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vin.com/apputil/content/defaultadv1.aspx?pId=11247&id=4959857"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Veterinary Information Network (VIN). Growth and Development in Puppies.
            </a>
            <p className="text-slate-500 text-sm">
              A comprehensive review of puppy growth phases, factors affecting development, and clinical implications.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Puppy Adult Size Predictor (Weight Curve)"
      description="Predict your puppy's final adult weight and size based on current age, weight, and breed growth curves."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: Show the interpolation formula used for growth proportion and adult weight estimate
      formula={{
        title: "Scientific Formula",
        formula: `Estimated Adult Weight = Current Weight ÷ Growth Proportion(age, breed size)
        
Growth Proportion(age) ≈ Linear interpolation between known age milestones:
If age ∈ [week_i, week_{i+1}], then
Growth Proportion(age) = prop_i + ((prop_{i+1} - prop_i) × (age - week_i)) / (week_{i+1} - week_i)`,
        variables: [
          { symbol: "Current Weight", description: "Puppy's current weight in lbs or kg" },
          { symbol: "Growth Proportion(age, breed size)", description: "Expected proportion of adult weight at current age for the breed size category" },
          { symbol: "age", description: "Puppy's current age in weeks" },
          { symbol: "week_i, week_{i+1}", description: "Known age milestones in weeks for interpolation" },
          { symbol: "prop_i, prop_{i+1}", description: "Known growth proportions at age milestones" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 12-week-old medium breed puppy currently weighs 15 lbs. We want to estimate its adult weight using the growth curve method.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Identify the growth proportions for medium breeds at 8 weeks (0.30) and 12 weeks (0.50). Since the puppy is exactly 12 weeks old, the growth proportion is 0.50.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate estimated adult weight: Adult Weight = Current Weight / Growth Proportion = 15 lbs / 0.50 = 30 lbs.",
          },
        ],
        result: "The estimated adult weight for this puppy is approximately 30 lbs.",
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
        { id: "what-is", label: "Understanding Puppy Adult Size Predictor (Weight Curve)" },
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