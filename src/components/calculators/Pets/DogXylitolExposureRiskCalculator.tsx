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

export default function DogXylitolExposureRiskCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    xylitolAmount: "",
  });

  // 2. LOGIC ENGINE
  // Toxic dose threshold for xylitol in dogs: ~100 mg/kg body weight causes hypoglycemia
  // Severe toxicity risk threshold: >200 mg/kg
  // We calculate mg/kg dose = (xylitol ingested in mg) / (weight in kg)
  // Then categorize risk based on mg/kg dose

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const xylitolRaw = parseFloat(inputs.xylitolAmount);

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid dog weight.",
        subtext: null,
        warning: null,
      };
    }
    if (!xylitolRaw || xylitolRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid xylitol amount ingested.",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Convert xylitol amount to mg
    // Input is in grams or milligrams? We'll ask user to input in grams (common for food)
    // So convert grams to mg: 1g = 1000mg
    const xylitolMg = xylitolRaw * 1000;

    // Calculate dose in mg/kg
    const doseMgPerKg = xylitolMg / weightKg;

    // Determine risk category
    let riskLabel = "";
    let warning = null;

    if (doseMgPerKg < 50) {
      riskLabel = "Low Risk: Unlikely to cause toxicity";
    } else if (doseMgPerKg >= 50 && doseMgPerKg < 100) {
      riskLabel = "Moderate Risk: Possible mild hypoglycemia";
      warning =
        "Monitor your dog closely and seek veterinary advice if symptoms develop.";
    } else if (doseMgPerKg >= 100 && doseMgPerKg < 200) {
      riskLabel = "High Risk: Significant risk of hypoglycemia and toxicity";
      warning =
        "Immediate veterinary attention is strongly recommended.";
    } else {
      riskLabel = "Severe Risk: Life-threatening toxicity likely";
      warning =
        "Call your veterinarian or emergency animal hospital immediately.";
    }

    return {
      value: doseMgPerKg.toFixed(1),
      label: riskLabel,
      subtext: `Dose: ${doseMgPerKg.toFixed(1)} mg/kg body weight`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is xylitol toxic to dogs but safe for humans?",
      answer:
        "Xylitol is a sugar alcohol commonly used as a sweetener in human products. While safe for humans, dogs metabolize xylitol differently. In dogs, xylitol triggers a rapid release of insulin from the pancreas, causing a dangerous drop in blood sugar (hypoglycemia). This can lead to seizures, liver failure, and even death if untreated. Understanding this species-specific reaction is critical for pet safety.",
    },
    {
      question: "How does the dose of xylitol affect the severity of poisoning in dogs?",
      answer:
        "The severity of xylitol poisoning in dogs is dose-dependent, measured in milligrams per kilogram (mg/kg) of body weight. Doses above approximately 100 mg/kg can cause hypoglycemia, while higher doses (above 200 mg/kg) may lead to liver failure. The risk calculator uses this dose-response relationship to estimate toxicity risk, helping owners assess urgency and need for veterinary care.",
    },
    {
      question: "What are the clinical signs of xylitol poisoning in dogs?",
      answer:
        "Clinical signs usually appear within 30 minutes to 12 hours after ingestion and include vomiting, weakness, ataxia (loss of coordination), seizures, and collapse due to hypoglycemia. In severe cases, dogs may develop liver failure, characterized by jaundice, bleeding disorders, and lethargy. Early recognition and veterinary intervention are essential to improve outcomes.",
    },
    {
      question: "Can small amounts of xylitol cause harm to all dogs?",
      answer:
        "Even small amounts of xylitol can be harmful, especially in small or sensitive dogs. While very low doses (<50 mg/kg) may not cause clinical signs, individual sensitivity varies. Because xylitol is found in many common products like sugar-free gum and baked goods, it is safest to avoid any exposure. Prompt veterinary consultation is advised if ingestion is suspected.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(field: string, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
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

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter dog's weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
          />
        </div>

        {/* Xylitol Amount Input */}
        <div>
          <Label htmlFor="xylitolAmount" className="text-slate-700 dark:text-slate-300">
            Xylitol Amount Ingested (grams)
          </Label>
          <Input
            id="xylitolAmount"
            type="number"
            min={0}
            step="any"
            placeholder="Enter amount of xylitol ingested in grams"
            value={inputs.xylitolAmount}
            onChange={(e) => handleInputChange("xylitolAmount", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo on inputs change
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", xylitolAmount: "" })}
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value} mg/kg</p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian immediately if xylitol ingestion is suspected.
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
          Understanding Dog Xylitol Exposure Risk Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Xylitol is a widely used artificial sweetener found in many sugar-free products such as gum, candies, baked goods, and oral care items. While safe for human consumption, xylitol is highly toxic to dogs due to their unique metabolic response. When ingested, xylitol causes a rapid release of insulin from the pancreas, leading to a dangerous drop in blood sugar levels (hypoglycemia). This hypoglycemia can manifest quickly and may result in seizures, liver failure, or even death if not treated promptly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The Dog Xylitol Exposure Risk Calculator is designed to estimate the potential toxicity risk based on the dog's weight and the amount of xylitol ingested. It uses veterinary toxicology thresholds expressed in milligrams of xylitol per kilogram of body weight (mg/kg) to categorize the risk level. This tool helps pet owners and veterinary professionals assess the urgency of the situation and decide on the need for immediate veterinary intervention. Understanding these dose-dependent effects is crucial for preventing severe outcomes.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately assess the risk of xylitol toxicity in your dog, begin by selecting the appropriate unit system for your dog's weight—either imperial (pounds) or metric (kilograms). Next, enter your dog's current weight in the selected unit. Then, input the estimated amount of xylitol ingested, expressed in grams. This amount should reflect the total xylitol content in the product consumed, which can often be found on the packaging or ingredient list.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> Enter your dog's weight accurately, as the toxicity risk is calculated per kilogram of body weight. If you only know the weight in pounds, select the imperial unit system for automatic conversion.
          </li>
          <li>
            <strong>Xylitol Amount Ingested:</strong> Estimate the total grams of xylitol your dog consumed. This includes all sources such as sugar-free gum, candy, or baked goods containing xylitol. If unsure, check product labels or consult a veterinarian.
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
              href="https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/xylitol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. ASPCA Animal Poison Control Center - Xylitol Toxicity in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of xylitol poisoning, clinical signs, and treatment guidelines.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4972170/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Gwaltney-Brant SM. Xylitol Toxicity in Dogs. Veterinary Clinics of North America: Small Animal Practice, 2016.
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article detailing the pathophysiology and clinical management of xylitol poisoning.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.wsu.edu/outreach/Pet-Health-Topics/categories/diseases/toxicities/xylitol-toxicity-in-dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Washington State University - Xylitol Toxicity in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource explaining clinical signs, diagnosis, and treatment options.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/toxicology/xylitol-toxicity-in-dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Merck Veterinary Manual - Xylitol Toxicity
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative veterinary manual entry summarizing toxic dose thresholds and clinical management.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Xylitol Exposure Risk Calculator"
      description="Calculate the severe toxic risk posed by the artificial sweetener **Xylitol** based on dog weight and ingested amount."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: mg/kg dose = (xylitol ingested in mg) / (dog weight in kg)
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg/kg) = (Xylitol ingested in mg) ÷ (Dog weight in kg)",
        variables: [
          { symbol: "Dose (mg/kg)", description: "Xylitol dose per kilogram of dog's body weight" },
          { symbol: "Xylitol ingested in mg", description: "Total amount of xylitol ingested, converted to milligrams" },
          { symbol: "Dog weight in kg", description: "Dog's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 20 lb (9.07 kg) dog ingests 1 gram of xylitol from sugar-free gum. The owner wants to know the toxicity risk.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert dog weight to kilograms if needed (20 lbs ÷ 2.20462 = 9.07 kg).",
          },
          {
            label: "Step 2",
            explanation:
              "Convert xylitol amount to milligrams (1 g × 1000 = 1000 mg).",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate dose: 1000 mg ÷ 9.07 kg = 110.3 mg/kg, indicating a high risk of toxicity.",
          },
        ],
        result:
          "The calculated dose of 110.3 mg/kg exceeds the 100 mg/kg threshold for significant hypoglycemia risk, so immediate veterinary attention is recommended.",
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
        { id: "what-is", label: "Understanding Dog Xylitol Exposure Risk Calculator" },
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
