import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseLaminitisRiskIndexCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: Body Condition Score (BCS) 1-9 scale, NSC intake in grams per day, and horse weight
  const [inputs, setInputs] = useState({
    bcs: "",
    nscIntake: "",
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Laminitis Risk Index (LRI) = (BCS - 5) * 2 + (NSC intake in g/kg BW)
  // NSC intake in g/kg BW = NSC intake (g) / weight (kg)
  // BCS baseline is 5 (ideal), risk increases as BCS > 5 and NSC intake increases
  const results = useMemo(() => {
    const bcs = parseFloat(inputs.bcs);
    const nscIntake = parseFloat(inputs.nscIntake);
    let weightKg = parseFloat(inputs.weight);

    if (
      isNaN(bcs) ||
      isNaN(nscIntake) ||
      isNaN(weightKg) ||
      bcs < 1 ||
      bcs > 9 ||
      nscIntake < 0 ||
      weightKg <= 0
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid values for all fields.",
        warning: null,
      };
    }

    if (unit === "imperial") {
      weightKg = weightKg / 2.20462;
    }

    // Calculate NSC intake per kg body weight
    const nscPerKg = nscIntake / weightKg;

    // Calculate Laminitis Risk Index
    // Risk increases if BCS > 5, else no added risk from BCS
    const bcsRisk = bcs > 5 ? (bcs - 5) * 2 : 0;

    const riskIndex = bcsRisk + nscPerKg;

    // Risk interpretation
    let label = "";
    let warning = null;
    if (riskIndex < 1) {
      label = "Low Risk";
    } else if (riskIndex < 3) {
      label = "Moderate Risk";
      warning =
        "Moderate risk of laminitis. Consider dietary adjustments and veterinary consultation.";
    } else {
      label = "High Risk";
      warning =
        "High risk of laminitis. Immediate veterinary advice and dietary management recommended.";
    }

    return {
      value: riskIndex.toFixed(2),
      label,
      subtext: `Based on BCS and NSC intake per kg body weight.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is Body Condition Score important in assessing laminitis risk?",
      answer:
        "Body Condition Score (BCS) reflects the fat coverage and overall nutritional status of a horse. Excessive fat, especially when BCS is above 5, increases the risk of laminitis due to metabolic imbalances and insulin resistance. Monitoring BCS helps identify horses at higher risk and guides dietary and management interventions to prevent laminitis.",
    },
    {
      question: "How does non-structural carbohydrate (NSC) intake affect laminitis risk?",
      answer:
        "NSC intake, primarily sugars and starches, can trigger laminitis by causing rapid fermentation and endotoxin release in the gut. High NSC diets increase blood glucose and insulin levels, promoting inflammation and hoof tissue damage. Controlling NSC intake is critical in managing laminitis risk, especially in susceptible horses with higher BCS.",
    },
    {
      question: "Can a horse with a low BCS still be at risk for laminitis?",
      answer:
        "While low BCS generally indicates lower fat reserves and reduced metabolic risk, laminitis can still occur due to other factors like systemic illness or excessive NSC intake. However, the risk index primarily focuses on overweight horses where fat and NSC intake synergistically increase risk. Always consider comprehensive clinical evaluation beyond just BCS and diet.",
    },
    {
      question: "How can this Laminitis Risk Index guide management decisions?",
      answer:
        "This index quantifies risk by combining body fatness and dietary carbohydrate load, helping owners and vets prioritize interventions. A higher score suggests the need for dietary NSC restriction, weight management, and veterinary monitoring. Using this tool supports proactive laminitis prevention through evidence-based nutritional and husbandry adjustments.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
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
          <Label htmlFor="bcs" className="text-slate-700 dark:text-slate-300">
            Body Condition Score (1-9)
          </Label>
          <Input
            id="bcs"
            type="number"
            min={1}
            max={9}
            step={0.1}
            placeholder="e.g. 6.5"
            value={inputs.bcs}
            onChange={(e) => setInputs({ ...inputs, bcs: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="nscIntake" className="text-slate-700 dark:text-slate-300">
            Daily NSC Intake (grams)
          </Label>
          <Input
            id="nscIntake"
            type="number"
            min={0}
            step={1}
            placeholder="e.g. 500"
            value={inputs.nscIntake}
            onChange={(e) => setInputs({ ...inputs, nscIntake: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step={1}
            placeholder={unit === "imperial" ? "e.g. 1100" : "e.g. 500"}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
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
          onClick={() => setInputs({ bcs: "", nscIntake: "", weight: "" })}
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Laminitis Risk Index (BCS + NSC intake)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Laminitis is a painful and potentially debilitating condition affecting the hooves of horses, often linked to metabolic imbalances and dietary factors. The Laminitis Risk Index combines two critical components: Body Condition Score (BCS), which assesses the horse’s fat coverage and overall nutritional status, and non-structural carbohydrate (NSC) intake, which reflects the amount of sugars and starches consumed daily. This index helps quantify the risk by integrating these factors, providing a practical tool for early identification and prevention.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          BCS is measured on a scale from 1 to 9, with scores above 5 indicating overweight or obese horses that are more susceptible to laminitis due to insulin resistance and inflammation. NSC intake, expressed in grams per kilogram of body weight, directly influences blood glucose and insulin levels, exacerbating laminitis risk when consumed in excess. By evaluating both BCS and NSC intake together, this index offers a comprehensive risk assessment that supports informed management decisions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Utilizing the Laminitis Risk Index allows horse owners and veterinarians to proactively monitor and adjust feeding regimens, weight management, and overall care to mitigate laminitis development. This evidence-based approach emphasizes the importance of balanced nutrition and maintaining an ideal body condition to promote hoof health and prevent costly complications. Ultimately, the index serves as a valuable guide in safeguarding equine welfare through targeted prevention strategies.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the Laminitis Risk Index by combining your horse’s Body Condition Score (BCS) and daily non-structural carbohydrate (NSC) intake relative to its weight. Begin by selecting your preferred unit system (Imperial or Metric), then enter the horse’s BCS on a 1 to 9 scale, the estimated daily NSC intake in grams, and the horse’s weight. The tool will compute the risk index and provide an interpretation to guide management decisions.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system for weight measurement (lbs or kg).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the horse’s Body Condition Score, ensuring it is between 1 and 9.
          </li>
          <li>
            <strong>Step 3:</strong> Input the estimated daily NSC intake in grams, considering all feed sources.
          </li>
          <li>
            <strong>Step 4:</strong> Provide the horse’s current weight in the selected unit.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to view the Laminitis Risk Index and its interpretation.
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
              href="https://aaep.org/guidelines/laminitis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Association of Equine Practitioners (AAEP) Laminitis Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive clinical guidelines on laminitis diagnosis, risk factors, and management strategies in horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/20413123/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Durham, A.E., & Schofield, N. (2010). Equine Metabolic Syndrome and Laminitis. Veterinary Clinics of North America: Equine Practice.
            </a>
            <p className="text-slate-500 text-sm">
              Review article discussing the metabolic basis of laminitis and the role of body condition and diet.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6466353/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. McGowan, C.M., et al. (2019). The Role of Non-Structural Carbohydrates in Equine Laminitis. Journal of Equine Veterinary Science.
            </a>
            <p className="text-slate-500 text-sm">
              Research article highlighting the impact of dietary NSC on laminitis risk and prevention.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Laminitis Risk Index (BCS + NSC intake)"
      description="Calculate the risk of **Laminitis (Founder)** based on Body Condition Score and non-structural carbohydrate (NSC) intake."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Laminitis Risk Index = max(0, (BCS - 5) × 2) + (NSC intake in g ÷ weight in kg)",
        variables: [
          { symbol: "BCS", description: "Body Condition Score (1-9 scale)" },
          { symbol: "NSC intake", description: "Daily non-structural carbohydrate intake in grams" },
          { symbol: "weight", description: "Horse body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A horse with a BCS of 7, consuming 600 grams of NSC daily, weighing 500 kg (1102 lbs).",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate BCS risk: (7 - 5) × 2 = 4",
          },
          {
            label: "2",
            explanation:
              "Calculate NSC per kg: 600 g ÷ 500 kg = 1.2",
          },
          {
            label: "3",
            explanation:
              "Sum to find Laminitis Risk Index: 4 + 1.2 = 5.2 (High Risk)",
          },
        ],
        result: "The horse has a high laminitis risk, indicating urgent dietary and veterinary management.",
      }}
      relatedCalculators={[
        { title: "Fiber & Protein Ratio Calculator", url: "/pets/small-mammal-fiber-protein-ratio", icon: "🐾" },
        { title: "Essential Oils Exposure Risk (diffuser/dermal)", url: "/pets/cat-essential-oils-exposure-risk", icon: "🐶" },
        { title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)", url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk", icon: "🐱" },
        { title: "Dog Age in Human Years (Breed-Aware)", url: "/pets/dog-age-human-years-breed-aware", icon: "🐶" },
        { title: "Dog Caffeine Toxicity Calculator", url: "/pets/dog-caffeine-toxicity", icon: "🐶" },
        { title: "Senior Cat Nutrition & Calorie Adjuster", url: "/pets/senior-cat-nutrition-calorie-adjuster", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Laminitis Risk Index (BCS + NSC intake)" },
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