import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { convertWeight, formatNumberForInput, weightToKg } from "@/lib/utils";

export default function CatGrapeRaisinExposureRiskCalculator() {
  // 1. STATE
  // No unit selector needed since inputs are count-based
  // Inputs: number of grapes or raisins ingested
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    grapes: "",
    raisins: "",
    catWeight: "",
  });

  // 2. LOGIC ENGINE
  // Risk assessment based on number of grapes/raisins ingested and cat weight
  // Toxicity threshold in cats is not well established, but we use a conservative approach:
  // Toxic dose estimated ~0.5 g/kg of grapes/raisins (based on dog data, cats likely similar or more sensitive)
  // Average grape weight ~5 g, raisin ~1 g
  // Calculate total grape/raisin weight ingested, then mg/kg dose
  // Risk categories:
  //   Low: < 10 mg/kg
  //   Moderate: 10-50 mg/kg
  //   High: > 50 mg/kg
  const results = useMemo(() => {
    const grapesNum = parseInt(inputs.grapes);
    const raisinsNum = parseInt(inputs.raisins);
    const weightRaw = parseFloat(inputs.catWeight);

    if (
      isNaN(grapesNum) ||
      grapesNum < 0 ||
      isNaN(raisinsNum) ||
      raisinsNum < 0 ||
      isNaN(weightRaw) ||
      weightRaw <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Calculate total grape/raisin weight in grams
    const grapeWeightG = grapesNum * 5; // 5 g per grape
    const raisinWeightG = raisinsNum * 1; // 1 g per raisin
    const totalIngestedG = grapeWeightG + raisinWeightG;

    // Dose in mg/kg
    const doseMgPerKg = (totalIngestedG * 1000) / weightKg;

    let riskLabel = "Low Risk";
    let warning = null;

    if (doseMgPerKg >= 50) {
      riskLabel = "High Risk";
      warning =
        "This exposure level is considered high risk for kidney toxicity in cats. Immediate veterinary evaluation is strongly recommended.";
    } else if (doseMgPerKg >= 10) {
      riskLabel = "Moderate Risk";
      warning =
        "This exposure level poses a moderate risk. Monitor your cat closely and consult your veterinarian promptly.";
    }

    return {
      value: doseMgPerKg.toFixed(1),
      label: `Estimated Grape/Raisin Exposure Dose (mg/kg) - ${riskLabel}`,
      subtext:
        "Dose calculated based on estimated grape and raisin weights relative to cat's body weight.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why are grapes and raisins toxic to cats?",
      answer:
        "Grapes and raisins contain unknown nephrotoxic compounds that can cause acute kidney injury in cats, although the exact toxin has not been identified. Even small amounts can trigger severe kidney damage, leading to symptoms like vomiting, lethargy, and decreased appetite. Because cats metabolize substances differently than dogs, their sensitivity may be higher, making any exposure potentially dangerous.",
    },
    {
      question: "How is the risk of toxicity assessed after ingestion?",
      answer:
        "Risk assessment involves estimating the amount of grapes or raisins ingested relative to the cat's body weight, expressed as milligrams per kilogram. Since exact toxic doses in cats are not well established, veterinarians use conservative thresholds based on available data and clinical experience. This calculator helps estimate exposure dose to guide urgency of veterinary care, but clinical signs and timing are also critical factors.",
    },
    {
      question: "What should I do if my cat eats grapes or raisins?",
      answer:
        "If you suspect your cat has ingested grapes or raisins, seek veterinary attention immediately, even if no symptoms are present. Early intervention can include inducing vomiting, administering activated charcoal, and providing intravenous fluids to prevent kidney damage. Time is critical because kidney injury can develop rapidly and may be irreversible without prompt treatment.",
    },
    {
      question: "Are all cats equally sensitive to grape or raisin toxicity?",
      answer:
        "Sensitivity to grape and raisin toxicity can vary between individual cats, with some showing severe reactions to very small amounts while others may tolerate slightly higher doses. Factors influencing sensitivity include age, overall health, and individual metabolic differences. Because of this variability and the potential severity, any ingestion should be treated as a medical emergency.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "kg" && next !== "lb") return;
              const weightRaw = parseFloat(inputs.catWeight);
              if (Number.isFinite(weightRaw) && weightRaw > 0) {
                const nextWeight = convertWeight(weightRaw, unit, next);
                setInputs((prev) => ({
                  ...prev,
                  catWeight: formatNumberForInput(nextWeight, 2),
                }));
              }
              setUnit(next);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="catWeight" className="text-slate-700 dark:text-slate-300">
            Cat Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="catWeight"
            type="number"
            min="0"
            step="0.1"
            placeholder={unit === "lb" ? "e.g. 10.5" : "e.g. 4.8"}
            value={inputs.catWeight}
            onChange={(e) => setInputs({ ...inputs, catWeight: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="grapes" className="text-slate-700 dark:text-slate-300">
            Number of Grapes Ingested
          </Label>
          <Input
            id="grapes"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 3"
            value={inputs.grapes}
            onChange={(e) => setInputs({ ...inputs, grapes: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="raisins" className="text-slate-700 dark:text-slate-300">
            Number of Raisins Ingested
          </Label>
          <Input
            id="raisins"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 5"
            value={inputs.raisins}
            onChange={(e) => setInputs({ ...inputs, raisins: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
            setInputs((i) => ({ ...i }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ grapes: "", raisins: "", catWeight: "" })}
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

  // 5. EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Cat Grape/Raisin Exposure Risk (educational)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Grapes and raisins have been identified as potentially nephrotoxic substances in companion animals, primarily dogs, but cats are also at risk. Although the exact toxic compound remains unknown, ingestion can lead to acute kidney injury, which may be life-threatening. Cats metabolize toxins differently than dogs, and their sensitivity to grapes and raisins is believed to be equal or greater, making any exposure a serious concern.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The clinical signs of toxicity in cats can include vomiting, lethargy, anorexia, and signs of kidney failure such as decreased urine production. Because the toxic dose is not definitively established in cats, veterinarians often rely on conservative thresholds and clinical judgment to assess risk. Early veterinary intervention is critical to prevent irreversible kidney damage and improve outcomes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This educational tool estimates the relative risk of kidney toxicity based on the estimated amount of grapes or raisins ingested in relation to the cat’s body weight. It is designed to help pet owners and veterinary professionals understand potential exposure severity, but it does not replace professional veterinary evaluation. Immediate consultation with a veterinarian is always recommended if ingestion is suspected.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, enter your cat’s weight in pounds and the estimated number of grapes and/or raisins ingested. The tool uses average weights for grapes and raisins to estimate the total toxic load relative to your cat’s body weight. The result provides an estimated dose in milligrams per kilogram and categorizes the risk level to guide urgency of veterinary care.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your cat’s current weight in pounds as accurately as possible.
          </li>
          <li>
            <strong>Step 2:</strong> Input the number of grapes and/or raisins your cat has ingested.
          </li>
          <li>
            <strong>Step 3:</strong> Click “Calculate” to see the estimated exposure dose and risk category.
          </li>
          <li>
            <strong>Step 4:</strong> Use the risk category and warnings to decide if immediate veterinary attention is needed.
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
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/grape-and-raisin-toxicity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Cornell Feline Health Center - Grape and Raisin Toxicity in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of grape and raisin toxicity in cats, including clinical signs and treatment recommendations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.veterinarypartner.com/Content.plx?P=A&A=2796&S=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Veterinary Partner - Grapes and Raisins Toxicity in Dogs and Cats
            </a>
            <p className="text-slate-500 text-sm">
              Detailed article discussing toxic doses, clinical effects, and emergency care for grape and raisin ingestion.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151219/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Center for Biotechnology Information - Acute Kidney Injury from Grapes and Raisins
            </a>
            <p className="text-slate-500 text-sm">
              Scientific publication reviewing the pathophysiology and clinical management of grape and raisin toxicity in small animals.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Grape/Raisin Exposure Risk (educational)"
      description="Educational tool on the potential, though rare, kidney toxicity risk from grapes and raisins in cats."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Exposure Dose (mg/kg) = (Number of Grapes × 5000 + Number of Raisins × 1000) / Cat Weight (g)",
        variables: [
          { symbol: "Number of Grapes", description: "Count of grapes ingested" },
          { symbol: "Number of Raisins", description: "Count of raisins ingested" },
          { symbol: "Cat Weight (g)", description: "Cat body weight in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb cat ingests 3 grapes and 5 raisins. The owner wants to estimate the risk of kidney toxicity.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert cat weight to grams: 10 lb × 453.592 = 4535.92 g.",
          },
          {
            label: "2",
            explanation:
              "Calculate total grape and raisin weight: (3 × 5 g) + (5 × 1 g) = 15 g + 5 g = 20 g.",
          },
          {
            label: "3",
            explanation:
              "Calculate exposure dose: (20,000 mg) / 4535.92 g = 4.41 mg/g = 4.41 mg/kg.",
          },
          {
            label: "4",
            explanation:
              "Interpret dose: 4.41 mg/kg is considered low risk but still warrants monitoring and veterinary consultation.",
          },
        ],
        result: "Estimated exposure dose is 4.4 mg/kg, categorized as Low Risk.",
      }}
      relatedCalculators={[
        { title: "Dog Walking Calories Burned Calculator", url: "/pets/dog-walking-calories-burned", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Cat BMI/Body Index (educational)", url: "/pets/cat-bmi-body-index-educational", icon: "🐱" },
        { title: "Dewormer & Antibiotic Dose Reference", url: "/pets/reptile-dewormer-antibiotic-dose-reference", icon: "🍖" },
        { title: "Dog Crate Size Finder", url: "/pets/dog-crate-size-finder", icon: "🐶" },
        { title: "Horse Feeding Rate Calculator (Forage + Concentrate)", url: "/pets/horse-feeding-rate-forage-concentrate", icon: "🐎" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Grape/Raisin Exposure Risk (educational)" },
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
