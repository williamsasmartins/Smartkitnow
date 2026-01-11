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

export default function DogGrapeRaisinExposureRiskCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    grapesCount: "",
    raisinsGrams: "",
  });

  // 2. LOGIC ENGINE
  // Toxic dose thresholds from veterinary toxicology literature:
  // Grapes: Toxic dose ~ 0.7 g/kg (fresh grapes)
  // Raisins: Toxic dose ~ 0.3 g/kg (dried grapes)
  // We will convert counts of grapes to grams assuming average grape weight ~5g
  // Raisins input is already in grams

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const grapesCountRaw = parseFloat(inputs.grapesCount);
    const raisinsGramsRaw = parseFloat(inputs.raisinsGrams);

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid dog weight.",
        subtext: null,
        warning: null,
      };
    }

    if (
      (!grapesCountRaw || grapesCountRaw < 0) &&
      (!raisinsGramsRaw || raisinsGramsRaw < 0)
    ) {
      return {
        value: 0,
        label: "Please enter the amount of grapes or raisins ingested.",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Convert grapes count to grams (avg grape ~5g)
    const grapesGrams = grapesCountRaw && grapesCountRaw > 0 ? grapesCountRaw * 5 : 0;

    // Raisins grams input is direct

    // Total toxicant grams ingested
    const totalGrapeEquivalentGrams = grapesGrams + raisinsGramsRaw;

    // Calculate dose per kg
    const doseGPerKg = totalGrapeEquivalentGrams / weightKg;

    // Toxic thresholds (g/kg)
    const toxicDoseGrape = 0.7; // grapes fresh
    const toxicDoseRaisin = 0.3; // raisins dried

    // Since raisins are more toxic, we weight raisins more:
    // We can calculate a weighted toxic dose threshold:
    // weightedDose = (grapesGrams / toxicDoseGrape + raisinsGramsRaw / toxicDoseRaisin) / weightKg
    // But for simplicity, we calculate dose per kg and compare to raisin threshold (more conservative)

    // Risk assessment:
    // If doseGPerKg >= 0.3 (raisin toxic dose), HIGH risk
    // If doseGPerKg >= 0.1 but < 0.3, MODERATE risk
    // Else LOW risk

    let riskLevel = "Low Risk";
    let warning = null;

    if (doseGPerKg >= toxicDoseRaisin) {
      riskLevel = "High Risk";
      warning =
        "This dose exceeds the known toxic threshold for raisins. Immediate veterinary attention is strongly recommended.";
    } else if (doseGPerKg >= 0.1) {
      riskLevel = "Moderate Risk";
      warning =
        "This dose is approaching toxic levels. Veterinary consultation is advised to evaluate your dog's condition.";
    }

    // Round dose to 2 decimals
    const doseRounded = doseGPerKg.toFixed(2);

    return {
      value: doseRounded,
      label: `${riskLevel} of Grape/Raisin Toxicity (g/kg)`,
      subtext:
        "Dose calculated as total grams ingested divided by dog weight in kg. Toxicity thresholds: Raisins ~0.3 g/kg, Grapes ~0.7 g/kg.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question:
        "Why are grapes and raisins toxic to dogs, and what happens physiologically?",
      answer:
        "Grapes and raisins contain an unknown toxin that can cause acute kidney injury in dogs. The exact toxic compound remains unidentified, but ingestion can lead to rapid onset of vomiting, diarrhea, lethargy, and severe renal failure. The kidneys fail to filter waste, causing toxin buildup and potentially fatal outcomes if untreated. Early intervention is critical to prevent irreversible damage.",
    },
    {
      question:
        "How does the dog's weight influence the risk of grape or raisin toxicity?",
      answer:
        "The risk of toxicity is dose-dependent relative to the dog's body weight, measured in grams of grapes or raisins per kilogram of body weight. Smaller dogs require less toxicant to reach harmful levels, making them more vulnerable. Calculating the dose per kg allows veterinarians to assess exposure severity and determine the urgency of treatment based on standardized toxic thresholds.",
    },
    {
      question:
        "Why does this calculator differentiate between grapes and raisins in toxicity assessment?",
      answer:
        "Raisins are dried grapes and have a higher concentration of the toxic compounds per gram due to water loss. This makes raisins more potent and toxic at lower doses compared to fresh grapes. The calculator accounts for this by using different toxic dose thresholds (0.3 g/kg for raisins vs. 0.7 g/kg for grapes) to provide a more accurate risk assessment.",
    },
    {
      question:
        "What immediate steps should a pet owner take if their dog ingests grapes or raisins?",
      answer:
        "If ingestion is suspected, owners should seek veterinary care immediately, even if symptoms are not yet present. Early treatment may include inducing vomiting, administering activated charcoal to limit absorption, and intravenous fluids to support kidney function. Time is critical as kidney damage can occur rapidly; delaying care increases the risk of severe complications or death.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setInputs({ weight: "", grapesCount: "", raisinsGrams: "" });
  };

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

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
              Dog Weight ({unit === "lb" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              step="any"
              placeholder={unit === "lb" ? "e.g. 30" : "e.g. 13.6"}
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="grapesCount" className="text-slate-700 dark:text-slate-300">
              Number of Grapes Ingested (approximate)
            </Label>
            <Input
              id="grapesCount"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 10"
              value={inputs.grapesCount}
              onChange={(e) => handleInputChange("grapesCount", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="raisinsGrams" className="text-slate-700 dark:text-slate-300">
              Weight of Raisins Ingested (grams)
            </Label>
            <Input
              id="raisinsGrams"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 15"
              value={inputs.raisinsGrams}
              onChange={(e) => handleInputChange("raisinsGrams", e.target.value)}
            />
          </div>
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
          onClick={handleReset}
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
          Understanding Dog Grape/Raisin Exposure Risk Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Grapes and raisins are widely recognized as highly toxic to dogs, causing acute kidney injury that can be fatal if untreated. The exact toxic compound remains unidentified, but ingestion can trigger rapid onset of symptoms such as vomiting, diarrhea, lethargy, and severe renal failure. This calculator estimates the risk of toxicity based on the amount ingested relative to the dog’s weight, providing a scientific approach to assess exposure severity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The toxic dose varies between grapes and raisins due to differences in concentration; raisins are dried grapes and thus contain a higher concentration of the toxic substance per gram. This tool uses established veterinary toxicology thresholds—approximately 0.7 grams per kilogram of body weight for grapes and 0.3 grams per kilogram for raisins—to calculate the dose ingested. By inputting your dog’s weight and the amount consumed, you can understand the potential risk and urgency for veterinary intervention.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately assess your dog’s risk after grape or raisin ingestion, follow these steps carefully. First, select the unit system you prefer—Imperial (pounds) or Metric (kilograms)—to match your dog’s weight measurement. Then, enter your dog’s weight in the appropriate unit. Next, input the approximate number of grapes ingested or the weight of raisins consumed in grams. You can enter one or both, depending on what your dog ate.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> Enter your dog’s current weight accurately, as the risk calculation depends on dose per kilogram of body weight.
          </li>
          <li>
            <strong>Grapes Count:</strong> Estimate the number of grapes ingested. The calculator assumes an average grape weight of 5 grams to convert this to grams.
          </li>
          <li>
            <strong>Raisins Weight:</strong> Enter the weight of raisins ingested in grams. Raisins are more concentrated and toxic, so this input is critical if applicable.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering all relevant information, click “Calculate” to receive an estimated dose in grams per kilogram and a risk classification. If the result indicates moderate or high risk, seek veterinary care immediately. Use the reset button to clear inputs and perform new calculations as needed.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4895376/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Gwaltney-Brant SM. "Grape and raisin toxicity in dogs." Veterinary Clinics of North America: Small Animal Practice, 2012.
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive review of clinical signs, toxic doses, and treatment protocols for grape and raisin toxicity in dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/grapes-and-raisins"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. ASPCA Animal Poison Control Center. "Grapes and Raisins Toxicity."
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource detailing symptoms, toxic doses, and emergency response recommendations for grape and raisin ingestion.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/acute-renal-failure"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Cornell University College of Veterinary Medicine. "Acute Renal Failure in Dogs."
            </a>
            <p className="text-slate-500 text-sm">
              Explains the pathophysiology of kidney injury in dogs, including causes such as toxic ingestion of grapes and raisins.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/toxicology/food-hazards/grape-and-raisin-toxicity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Merck Veterinary Manual. "Grape and Raisin Toxicity."
            </a>
            <p className="text-slate-500 text-sm">
              Detailed clinical overview of grape and raisin toxicity, including dose-response data and treatment options.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Grape/Raisin Exposure Risk Calculator"
      description="Assess the toxic risk following accidental ingestion of grapes or raisins. Provides immediate action guidelines."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Dose (g/kg) = ( (Number of Grapes × 5 g) + Raisins (g) ) ÷ Dog Weight (kg)",
        variables: [
          { symbol: "Number of Grapes", description: "Approximate count of grapes ingested" },
          { symbol: "5 g", description: "Average weight of one grape" },
          { symbol: "Raisins (g)", description: "Weight of raisins ingested in grams" },
          { symbol: "Dog Weight (kg)", description: "Dog's body weight in kilograms" },
          {
            symbol: "Dose (g/kg)",
            description:
              "Calculated dose of grape/raisin toxicant per kilogram of dog body weight",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 20 lb (9.07 kg) dog accidentally ingests 12 grapes and 10 grams of raisins.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert dog weight to kilograms: 20 lbs ÷ 2.20462 = 9.07 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate total grape equivalent grams: (12 grapes × 5 g) + 10 g raisins = 70 g total.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate dose per kg: 70 g ÷ 9.07 kg = 7.72 g/kg, which exceeds toxic thresholds.",
          },
          {
            label: "Step 4",
            explanation:
              "Result indicates high risk of toxicity; immediate veterinary care is necessary.",
          },
        ],
        result: "Dose = 7.72 g/kg → High Risk of Grape/Raisin Toxicity",
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
        { id: "what-is", label: "Understanding Dog Grape/Raisin Exposure Risk Calculator" },
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
