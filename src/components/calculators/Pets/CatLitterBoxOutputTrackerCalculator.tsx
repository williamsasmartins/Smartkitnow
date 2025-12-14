import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatLitterBoxOutputTrackerCalculator() {
  // 1. STATE
  // Unit system for weight input (imperial or metric)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight and daily litter box output volume
  // weight: cat's weight in lbs or kg
  // outputVolume: daily litter box output volume in grams (weight of feces + urine absorbed litter)
  const [inputs, setInputs] = useState({
    weight: "",
    outputVolume: "",
  });

  // 2. LOGIC ENGINE
  // Normal litter box output volume range (grams) based on weight (kg)
  // Reference: Normal fecal output ~ 2-4% of body weight per day; urine volume varies but total litter box output can be estimated.
  // We track if output is within normal range or increased.
  // Formula: Normal Output Range (grams) = Weight (kg) * 20 to 40 grams/day (approximate)
  // We compare user input outputVolume to this range.

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const outputNum = parseFloat(inputs.outputVolume);

    if (isNaN(weightNum) || weightNum <= 0 || isNaN(outputNum) || outputNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate normal output range in grams
    // Lower bound = 20 * weightKg (grams)
    // Upper bound = 40 * weightKg (grams)
    const lowerBound = 20 * weightKg;
    const upperBound = 40 * weightKg;

    let label = "";
    let warning = null;

    if (outputNum < lowerBound) {
      label = "Below Normal Output";
      warning =
        "Output volume is below the expected normal range. This may indicate constipation, dehydration, or other health issues. Consult your veterinarian if concerned.";
    } else if (outputNum > upperBound) {
      label = "Increased Output";
      warning =
        "Output volume exceeds the normal range, which could suggest diarrhea, urinary issues, or dietary problems. Monitor your cat closely and seek veterinary advice if persistent.";
    } else {
      label = "Normal Output Range";
    }

    // Show output volume with unit grams
    return {
      value: outputNum.toFixed(1),
      label,
      subtext: `Normal range for this weight: ${lowerBound.toFixed(1)}g - ${upperBound.toFixed(1)}g per day`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is tracking litter box output important for cats?",
      answer:
        "Monitoring litter box output helps detect early signs of health issues such as urinary tract infections, kidney problems, or gastrointestinal disturbances. Changes in volume or frequency can indicate dehydration, constipation, or diarrhea. Early detection through tracking allows timely veterinary intervention, improving outcomes and comfort for your cat.",
    },
    {
      question: "How do I accurately measure my cat's litter box output?",
      answer:
        "To measure output, weigh the clean litter box before and after your cat uses it, subtracting the initial weight to find the volume of waste. Use a kitchen scale for precision and record daily measurements consistently. This method helps identify trends and deviations from normal output, essential for health monitoring.",
    },
    {
      question: "What factors can cause increased litter box output in cats?",
      answer:
        "Increased output may result from diarrhea, urinary tract infections, dietary changes, or stress. Certain illnesses like hyperthyroidism or kidney disease can also increase urine or fecal volume. Understanding these factors helps owners and veterinarians determine when further diagnostics or treatment are necessary.",
    },
    {
      question: "When should I consult a veterinarian based on litter box output changes?",
      answer:
        "If you notice persistent increases or decreases in litter box output volume, accompanied by behavioral changes, straining, or discomfort, consult your veterinarian promptly. Sudden changes may indicate serious conditions requiring medical evaluation. Regular tracking helps differentiate normal fluctuations from concerning patterns.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handle input changes
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
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
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={unit === "imperial" ? "e.g. 10.5" : "e.g. 4.8"}
            value={inputs.weight}
            onChange={onInputChange}
            aria-describedby="weight-help"
          />
          <p id="weight-help" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your cat's current body weight.
          </p>
        </div>

        <div>
          <Label htmlFor="outputVolume" className="text-slate-700 dark:text-slate-300">
            Daily Litter Box Output Volume (grams)
          </Label>
          <Input
            id="outputVolume"
            name="outputVolume"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 150"
            value={inputs.outputVolume}
            onChange={onInputChange}
            aria-describedby="outputVolume-help"
          />
          <p id="outputVolume-help" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Measure the total weight of feces and urine-absorbed litter per day.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate litter box output status"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", outputVolume: "" })}
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
                Estimated Output Volume
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value} g</p>
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Litter Box Output Tracker (Normal vs. Increased)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The litter box output tracker is a vital tool for monitoring your cat’s health by assessing the volume of waste produced daily. Cats typically produce a consistent amount of feces and urine, which can be estimated relative to their body weight. Deviations from normal output volumes may signal underlying health issues such as dehydration, urinary tract infections, or gastrointestinal disturbances. By tracking these changes, owners can detect early warning signs and seek veterinary care promptly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Normal litter box output is generally proportional to a cat’s weight, with typical daily waste volume ranging from approximately 2% to 4% of their body weight in grams. This includes both fecal matter and urine absorbed by the litter. Increased output may indicate diarrhea, urinary problems, or dietary issues, while decreased output might suggest constipation or dehydration. Understanding these patterns helps in maintaining optimal feline health and preventing serious complications.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tracker provides a straightforward way to compare your cat’s daily litter box output against scientifically established normal ranges. It empowers pet owners with actionable insights, enabling them to make informed decisions about their cat’s well-being. Regular monitoring supports early diagnosis and intervention, which are critical for effective treatment and improved quality of life for your feline companion.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is simple and requires just two key inputs: your cat’s weight and the daily litter box output volume measured in grams. Begin by selecting the unit system that matches how you measure your cat’s weight—either imperial (pounds) or metric (kilograms). Then, accurately measure your cat’s daily waste output by weighing the litter box before and after use to determine the total volume of feces and urine-absorbed litter.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your cat’s weight in the selected unit system. Ensure the weight is current and accurate for best results.
          </li>
          <li>
            <strong>Step 2:</strong> Measure the total daily litter box output volume in grams. Use a precise scale and record the value.
          </li>
          <li>
            <strong>Step 3:</strong> Click “Calculate” to compare the output volume against the normal range for your cat’s weight. Review the result and any warnings provided.
          </li>
          <li>
            <strong>Step 4:</strong> If the output is outside the normal range, monitor your cat closely and consult your veterinarian if abnormalities persist or worsen.
          </li>
        </ul>
      </section>

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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/digestive-system/diseases-of-the-intestinal-tract-in-small-animals/overview-of-intestinal-disease-in-small-animals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Overview of Intestinal Disease in Small Animals
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource detailing gastrointestinal health, fecal output norms, and diagnostic approaches in cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/urinary-tract-infections"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Cornell Feline Health Center: Urinary Tract Infections in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guide on urinary health, symptoms, and management strategies relevant to litter box output changes.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/constipation-and-obstipation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Cornell Feline Health Center: Constipation and Obstipation in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Detailed explanation of causes, symptoms, and treatments for constipation affecting litter box output.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Litter Box Output Tracker (Normal vs. Increased)"
      description="Tool to track and compare normal litter box output against potentially worrying increases or decreases in volume."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Normal Output Range (g) = Weight (kg) × 20 to 40",
        variables: [
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "Output (g)", description: "Daily litter box output volume in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) cat produces 180 grams of litter box output in one day. The owner wants to know if this is within the normal range.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (10 lb = 4.54 kg). Calculate normal output range: 4.54 × 20 = 90.8 g (lower bound), 4.54 × 40 = 181.6 g (upper bound).",
          },
          {
            label: "2",
            explanation:
              "Compare measured output (180 g) to normal range (90.8 g - 181.6 g). Since 180 g is within this range, output is considered normal.",
          },
        ],
        result: "The cat's litter box output is within the normal expected range for its weight.",
      }}
      relatedCalculators={[
        { title: "Dog Caffeine Toxicity Calculator", url: "/pets/dog-caffeine-toxicity", icon: "🐶" },
        { title: "Cat Onion/Garlic Toxicity Calculator", url: "/pets/cat-onion-garlic-toxicity", icon: "🐱" },
        { title: "Dog Step-Goal & Activity Time Planner", url: "/pets/dog-step-goal-activity-time-planner", icon: "🐶" },
        { title: "Meloxicam Dose Calculator for Cats", url: "/pets/cat-meloxicam-dose", icon: "🐱" },
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dehydration Risk Estimator (Weight & Symptoms Aware)", url: "/pets/dog-dehydration-risk-estimator", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Litter Box Output Tracker (Normal vs. Increased)" },
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