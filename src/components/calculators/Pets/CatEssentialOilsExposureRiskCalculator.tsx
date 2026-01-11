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

export default function CatEssentialOilsExposureRiskCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs:
  // weight (lbs or kg)
  // essential oil concentration (%) - typical range 0.1% to 10%
  // exposure duration (minutes)
  // exposure type: "diffuser" or "dermal"
  const [inputs, setInputs] = useState({
    weight: "",
    concentration: "",
    duration: "",
    exposureType: "diffuser",
  });

  // 2. LOGIC ENGINE
  // Toxicity risk score (arbitrary scale 0-100) based on exposure type, concentration, duration, and weight.
  // Higher concentration, longer duration, and lower weight increase risk.
  // Diffuser exposure generally less risky than dermal due to dilution.
  // Formula (simplified risk index):
  // Risk Score = (Concentration % * Duration minutes * Exposure Factor) / Weight (kg)
  // Exposure Factor: diffuser = 1, dermal = 5 (dermal more direct absorption)
  const results = useMemo(() => {
    const w = parseFloat(inputs.weight);
    const c = parseFloat(inputs.concentration);
    const d = parseFloat(inputs.duration);
    const type = inputs.exposureType;

    if (
      isNaN(w) || w <= 0 ||
      isNaN(c) || c <= 0 ||
      isNaN(d) || d <= 0 ||
      (type !== "diffuser" && type !== "dermal")
    ) {
      return {
        value: 0,
        label: "Please enter valid inputs",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = weightToKg(w, unit);

    const exposureFactor = type === "diffuser" ? 1 : 5;

    // Calculate risk score
    const rawRisk = (c * d * exposureFactor) / weightKg;

    // Normalize risk to 0-100 scale (arbitrary max risk threshold = 10)
    const riskScore = Math.min(100, Math.round((rawRisk / 10) * 100));

    let label = "";
    let warning = null;

    if (riskScore === 0) {
      label = "Minimal risk";
    } else if (riskScore <= 25) {
      label = "Low risk";
    } else if (riskScore <= 50) {
      label = "Moderate risk";
    } else if (riskScore <= 75) {
      label = "High risk - caution advised";
      warning = "Consider reducing exposure or consult a veterinarian.";
    } else {
      label = "Severe risk - veterinary attention recommended";
      warning = "Immediate action may be necessary to prevent toxicity.";
    }

    return {
      value: riskScore,
      label,
      subtext: `Exposure Type: ${type.charAt(0).toUpperCase() + type.slice(1)}, Weight: ${weightKg.toFixed(
        1
      )} kg`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why are essential oils risky for cats when diffused or applied dermally?",
      answer:
        "Cats lack certain liver enzymes needed to metabolize many compounds found in essential oils, making them more susceptible to toxicity. Diffused oils can still be inhaled in harmful concentrations, while dermal exposure allows direct absorption through the skin. This can lead to symptoms ranging from mild irritation to severe organ damage depending on exposure level and oil type.",
    },
    {
      question: "How does exposure duration affect the risk of essential oil toxicity?",
      answer:
        "Longer exposure duration increases the total amount of essential oil absorbed by the cat, raising the risk of toxic effects. Even low concentrations can accumulate over time, especially in poorly ventilated areas or with repeated dermal contact. Therefore, limiting exposure time is crucial to minimize potential harm.",
    },
    {
      question: "Why is dermal exposure considered more dangerous than diffuser exposure?",
      answer:
        "Dermal exposure delivers essential oils directly through the skin, bypassing some natural barriers and leading to higher systemic absorption. Diffuser exposure dilutes oils in the air, reducing concentration and absorption rate. Consequently, dermal contact often results in a higher and faster toxic load compared to inhalation.",
    },
    {
      question: "Can all essential oils cause toxicity in cats, or are some safer than others?",
      answer:
        "Not all essential oils pose the same risk; some contain compounds highly toxic to cats, such as tea tree, eucalyptus, and cinnamon oils. Others may be less harmful but still require caution due to cats’ limited detoxification ability. Always research specific oils and consult a veterinarian before use around cats.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "kg" && next !== "lb") return;
              const weightRaw = parseFloat(inputs.weight);
              if (Number.isFinite(weightRaw) && weightRaw > 0) {
                const nextWeight = convertWeight(weightRaw, unit, next);
                setInputs((prev) => ({ ...prev, weight: formatNumberForInput(nextWeight, 2) }));
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

      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "lb" ? "e.g. 10" : "e.g. 4.5"}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="concentration" className="text-slate-700 dark:text-slate-300">
            Essential Oil Concentration (%) in Diffuser or Applied Solution
          </Label>
          <Input
            id="concentration"
            type="number"
            min="0"
            max="100"
            step="any"
            placeholder="e.g. 1.5"
            value={inputs.concentration}
            onChange={(e) => setInputs({ ...inputs, concentration: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="duration" className="text-slate-700 dark:text-slate-300">
            Exposure Duration (minutes)
          </Label>
          <Input
            id="duration"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 30"
            value={inputs.duration}
            onChange={(e) => setInputs({ ...inputs, duration: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="exposureType" className="text-slate-700 dark:text-slate-300">
            Exposure Type
          </Label>
          <Select
            id="exposureType"
            value={inputs.exposureType}
            onValueChange={(value) => setInputs({ ...inputs, exposureType: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diffuser">Diffuser (Inhalation)</SelectItem>
              <SelectItem value="dermal">Dermal (Skin Contact)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (no-op here)
            setInputs((i) => ({ ...i }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              concentration: "",
              duration: "",
              exposureType: "diffuser",
            })
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
          Understanding Essential Oils Exposure Risk (diffuser/dermal)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Essential oils are concentrated plant extracts that contain volatile compounds capable of causing toxicity in cats. Due to their unique metabolism, cats lack certain liver enzymes, such as glucuronyl transferase, which are essential for detoxifying many of these compounds. Exposure through diffusers or dermal contact can lead to accumulation of toxic substances, resulting in symptoms ranging from mild irritation to severe systemic effects including liver failure.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Diffuser exposure involves inhalation of airborne essential oil particles, which are typically diluted but can still pose risks depending on concentration and duration. Dermal exposure, on the other hand, allows direct absorption through the skin, often leading to higher systemic levels of toxins. Understanding the differences in exposure routes and their impact on toxicity risk is critical for pet owners to prevent accidental poisoning and ensure feline safety.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator estimates the relative risk of essential oil toxicity based on key factors such as the cat’s weight, essential oil concentration, exposure duration, and exposure type. By quantifying these variables, it provides a practical tool to assess potential danger and guide safer use of essential oils around cats. However, it is important to remember that individual sensitivity and specific oil types also influence toxicity risk.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, input your cat’s weight in pounds or kilograms, select the essential oil concentration percentage present in the diffuser or topical solution, specify the duration of exposure in minutes, and choose the exposure type—either diffuser (inhalation) or dermal (skin contact). The calculator will then estimate a risk score indicating the potential toxicity level.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your cat’s weight accurately to ensure the risk is scaled appropriately to their size and metabolism.
          </li>
          <li>
            <strong>Step 2:</strong> Provide the concentration of essential oil in the product or diffuser, usually found on the label or product information.
          </li>
          <li>
            <strong>Step 3:</strong> Input the estimated duration your cat is exposed to the essential oil, as longer exposure increases risk.
          </li>
          <li>
            <strong>Step 4:</strong> Select the exposure type to reflect whether the oil is inhaled via diffuser or absorbed through skin contact, as dermal exposure carries a higher risk.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to view the estimated risk score and follow any safety recommendations provided.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5871319/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Essential Oil Toxicity in Cats: A Review
            </a>
            <p className="text-slate-500 text-sm">
              This comprehensive review discusses the metabolic limitations of cats regarding essential oil exposure and outlines clinical signs and treatment protocols.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/essential-oil-toxicity-in-pets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. VCA Hospitals: Essential Oil Toxicity in Pets
            </a>
            <p className="text-slate-500 text-sm">
              A trusted veterinary source providing practical advice on essential oil safety, symptoms of toxicity, and emergency care for pets.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.petpoisonhelpline.com/poison/essential-oils/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Pet Poison Helpline: Essential Oils
            </a>
            <p className="text-slate-500 text-sm">
              Detailed toxicology information on various essential oils, exposure routes, and clinical management for veterinary professionals.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Essential Oils Exposure Risk (diffuser/dermal)"
      description="Assess the toxic risk from exposure to essential oils (e.g., concentrated tea tree oil) via diffusers or skin contact."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Risk Score = (Concentration % × Duration (min) × Exposure Factor) ÷ Weight (kg)",
        variables: [
          { symbol: "Concentration %", description: "Essential oil concentration in the product or diffuser" },
          { symbol: "Duration (min)", description: "Exposure duration in minutes" },
          { symbol: "Exposure Factor", description: "1 for diffuser inhalation, 5 for dermal contact" },
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) cat is exposed to a diffuser emitting 2% tea tree oil concentration for 30 minutes.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg: 10 lb ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate risk: (2 × 30 × 1) ÷ 4.54 = 13.22 (raw risk score).",
          },
          {
            label: "3",
            explanation:
              "Normalize risk to 0-100 scale: (13.22 ÷ 10) × 100 = 100 (capped at 100).",
          },
        ],
        result:
          "The risk score of 100 indicates severe risk; immediate reduction of exposure and veterinary consultation are recommended.",
      }}
      relatedCalculators={[
        { title: "Common Toxic Foods Reference", url: "/pets/small-mammal-common-toxic-foods-reference", icon: "🐾" },
        { title: "Horse Electrolyte Need Estimator (Exercise & Heat)", url: "/pets/horse-electrolyte-need-estimator", icon: "🐎" },
        { title: "Daily Calorie Needs by Body Weight", url: "/pets/bird-daily-calorie-needs-body-weight", icon: "🐱" },
        { title: "Dehydration Risk Estimator (Symptoms + Intake)", url: "/pets/cat-dehydration-risk-estimator", icon: "🍖" },
        { title: "Seed-to-Pellet Conversion Planner", url: "/pets/bird-seed-to-pellet-conversion-planner", icon: "💉" },
        { title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)", url: "/pets/dog-human-medication-exposure-alert", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Essential Oils Exposure Risk (diffuser/dermal)" },
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
