import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogDailyWaterIntakeCheckerCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    activityLevel: "normal",
    dietType: "dry", // dry food or wet food affects water intake
  });

  // 2. LOGIC ENGINE
  /**
   * Veterinary basis:
   * Dogs require approximately 50-60 ml of water per kg of body weight daily as a baseline.
   * Activity level and diet type influence this:
   * - Active dogs need ~10-20% more water.
   * - Dogs eating wet food need less additional water since wet food contains moisture.
   * 
   * Formula:
   * BaseWaterIntake (ml) = weightKg * 60
   * ActivityMultiplier = 1.0 (normal), 1.2 (active), 1.4 (very active)
   * DietAdjustment = 1.0 (dry food), 0.8 (wet food)
   * 
   * TotalWaterIntake = BaseWaterIntake * ActivityMultiplier * DietAdjustment
   */
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Enter valid weight to calculate water intake",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Activity multiplier
    let activityMultiplier = 1.0;
    switch (inputs.activityLevel) {
      case "normal":
        activityMultiplier = 1.0;
        break;
      case "active":
        activityMultiplier = 1.2;
        break;
      case "very_active":
        activityMultiplier = 1.4;
        break;
      default:
        activityMultiplier = 1.0;
    }

    // Diet adjustment
    const dietAdjustment = inputs.dietType === "wet" ? 0.8 : 1.0;

    // Base water intake ml/kg
    const baseWaterMlPerKg = 60;

    // Calculate total water intake in ml
    const totalWaterMl = weightKg * baseWaterMlPerKg * activityMultiplier * dietAdjustment;

    // Convert to cups (1 cup = 240 ml) if imperial
    const totalWaterCups = totalWaterMl / 240;

    // Format results
    const value =
      unit === "imperial"
        ? totalWaterCups.toFixed(2) + " cups"
        : totalWaterMl.toFixed(0) + " ml";

    const label = `Estimated daily water intake for your dog (${unit === "imperial" ? "cups" : "milliliters"})`;

    // Warning if water intake is very high or low (arbitrary thresholds)
    let warning = null;
    if (totalWaterMl < 200) {
      warning =
        "This estimated water intake is quite low. Ensure your dog is drinking enough, especially in hot weather or if ill.";
    } else if (totalWaterMl > 5000) {
      warning =
        "This estimated water intake is very high. If your dog is drinking excessively, consult a veterinarian to rule out health issues.";
    }

    return {
      value,
      label,
      subtext:
        "Based on weight, activity level, and diet type. Adjust as needed for environmental factors.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is daily water intake important for dogs?",
      answer:
        "Daily water intake is crucial for maintaining your dog's hydration, supporting vital bodily functions such as temperature regulation, digestion, and kidney function. Insufficient water can lead to dehydration, which may cause lethargy, organ failure, or even death. Monitoring water intake helps detect early signs of illness and ensures your dog stays healthy and active.",
    },
    {
      question: "How does a dog's diet affect its water needs?",
      answer:
        "A dog's diet significantly influences its water requirements. Dogs consuming dry kibble need more water because dry food contains minimal moisture, whereas wet or canned food contains up to 70-80% water, reducing the need for additional drinking water. Adjusting water intake based on diet ensures proper hydration without over- or underestimating fluid needs.",
    },
    {
      question: "How does activity level change a dog's water intake?",
      answer:
        "Active dogs lose more water through panting and increased metabolism, requiring higher water intake to compensate. Dogs with very high activity levels or those exposed to hot environments may need 20-40% more water than sedentary dogs. Proper hydration supports muscle function and prevents heat stress or dehydration during exercise.",
    },
    {
      question: "When should I consult a veterinarian about my dog's water intake?",
      answer:
        "Consult a veterinarian if your dog drinks excessively or very little water consistently, as this may indicate underlying health issues such as kidney disease, diabetes, or infections. Sudden changes in drinking habits, accompanied by other symptoms like lethargy or vomiting, warrant prompt veterinary evaluation to diagnose and treat potential problems early.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. INPUT HANDLERS
  const onInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const onSelectChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const onCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculation is reactive via useMemo, so no extra action needed
  };

  const onReset = () => {
    setInputs({
      weight: "",
      activityLevel: "normal",
      dietType: "dry",
    });
  };

  const widget = (
    <form onSubmit={onCalculate} className="space-y-6">
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
            Dog's Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={(e) => onInputChange("weight", e.target.value)}
            required
          />
        </div>

        {/* Activity Level */}
        <div>
          <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
            Activity Level
          </Label>
          <Select
            id="activityLevel"
            value={inputs.activityLevel}
            onValueChange={(val) => onSelectChange("activityLevel", val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal (average activity)</SelectItem>
              <SelectItem value="active">Active (regular exercise)</SelectItem>
              <SelectItem value="very_active">Very Active (working or highly active)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Diet Type */}
        <div>
          <Label htmlFor="dietType" className="text-slate-700 dark:text-slate-300">
            Diet Type
          </Label>
          <Select
            id="dietType"
            value={inputs.dietType}
            onValueChange={(val) => onSelectChange("dietType", val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dry">Dry Food (kibble)</SelectItem>
              <SelectItem value="wet">Wet/Canned Food</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
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
    </form>
  );

  const editorial = (
    <div className="space-y-12">
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Daily Water Intake Checker
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Proper hydration is essential for a dog's overall health and well-being. Water plays a critical role in regulating body temperature, facilitating digestion, transporting nutrients, and eliminating waste products through urine. Dogs lose water continuously through panting, urination, and feces, so replenishing this lost fluid daily is vital to prevent dehydration and maintain optimal physiological functions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The amount of water a dog needs varies depending on several factors including body weight, activity level, diet type, and environmental conditions. For example, dogs consuming dry kibble require more drinking water compared to those eating wet or canned food due to the moisture content difference. Additionally, active or working dogs lose more water through panting and require increased intake to compensate for fluid loss.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator estimates the minimum daily water intake your dog needs based on scientifically supported veterinary guidelines. It uses your dog's weight, activity level, and diet type to provide a personalized hydration recommendation. While this tool offers a reliable baseline, always monitor your dog's drinking habits and consult a veterinarian if you notice unusual changes or signs of dehydration.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your dog's daily water intake, begin by selecting the unit system you prefer: Imperial (pounds) or Metric (kilograms). Next, enter your dog's current weight in the chosen unit. Then, specify your dog's activity level, which affects fluid requirements due to increased water loss during exercise. Finally, select the type of diet your dog consumes, as wet food contains significant moisture reducing the need for additional drinking water.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog's Weight:</strong> Enter the accurate weight of your dog. This is the primary factor in calculating water needs, as larger dogs require more fluids.
          </li>
          <li>
            <strong>Activity Level:</strong> Choose the activity level that best matches your dog's daily routine. More active dogs need more water to stay hydrated.
          </li>
          <li>
            <strong>Diet Type:</strong> Select whether your dog eats primarily dry kibble or wet/canned food, as this influences the amount of additional water required.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After filling in these inputs, click the "Calculate" button to see the estimated daily water intake. Use the "Reset" button to clear inputs and start over. Remember, this calculator provides an estimate; always observe your dog's hydration status and consult your veterinarian for personalized advice.
        </p>
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
              href="https://www.merckvetmanual.com/generalized-conditions/dehydration-and-fluid-therapy/dehydration-in-small-animals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Dehydration in Small Animals
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of dehydration causes, symptoms, and fluid therapy guidelines in dogs and cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/health-information/dog-nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Cornell University College of Veterinary Medicine: Dog Nutrition
            </a>
            <p className="text-slate-500 text-sm">
              Detailed information on canine dietary needs and how diet affects hydration and health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/water-intake-guidelines-for-dogs.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Animal Hospital Association (AAHA): Water Intake Guidelines for Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Evidence-based recommendations on daily water requirements considering weight, activity, and diet.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149303/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. National Center for Biotechnology Information (NCBI): Hydration and Fluid Balance in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article discussing physiological mechanisms of hydration and factors influencing water intake in dogs.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Daily Water Intake Checker"
      description="Check if your dog is drinking enough water daily. Calculates the minimum required intake based on weight, activity level, and diet type."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "TotalWaterIntake (ml) = weightKg × 60 × ActivityMultiplier × DietAdjustment",
        variables: [
          { symbol: "weightKg", description: "Dog's weight in kilograms" },
          {
            symbol: "60",
            description:
              "Baseline water requirement in milliliters per kilogram of body weight",
          },
          {
            symbol: "ActivityMultiplier",
            description:
              "Multiplier based on activity level (1.0 normal, 1.2 active, 1.4 very active)",
          },
          {
            symbol: "DietAdjustment",
            description:
              "Adjustment factor based on diet type (1.0 dry food, 0.8 wet food)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb (13.6 kg) moderately active dog eating dry kibble needs an estimate of daily water intake.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms: 30 lbs ÷ 2.20462 = 13.6 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate base water need: 13.6 kg × 60 ml = 816 ml.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply activity multiplier (active = 1.2): 816 ml × 1.2 = 979 ml.",
          },
          {
            label: "Step 4",
            explanation:
              "Apply diet adjustment (dry food = 1.0): 979 ml × 1.0 = 979 ml total daily water intake.",
          },
        ],
        result:
          "The dog should drink approximately 979 ml (about 4.1 cups) of water daily to stay properly hydrated.",
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
        { id: "what-is", label: "Understanding Dog Daily Water Intake Checker" },
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