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
import { convertWeight, formatNumberForInput, LB_PER_KG, weightToKg } from "@/lib/utils";

export default function DogAlcoholEthanolExposureRiskCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    ethanolConcentration: "",
    volumeConsumed: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const ethanolConcRaw = parseFloat(inputs.ethanolConcentration);
    const volumeRaw = parseFloat(inputs.volumeConsumed);

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid dog weight.",
        subtext: null,
        warning: null,
      };
    }
    if (!ethanolConcRaw || ethanolConcRaw <= 0 || ethanolConcRaw > 100) {
      return {
        value: 0,
        label: "Please enter a valid ethanol concentration (0-100%).",
        subtext: null,
        warning: null,
      };
    }
    if (!volumeRaw || volumeRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid volume of ethanol-containing liquid consumed.",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Ethanol density approx 0.789 g/mL
    // Calculate ethanol mass consumed in grams:
    // ethanol_mass_g = volume_ml * (ethanol_conc/100) * 0.789
    const ethanolMassGrams = volumeRaw * (ethanolConcRaw / 100) * 0.789;

    // Convert grams to mg
    const ethanolMassMg = ethanolMassGrams * 1000;

    // Calculate mg/kg dose:
    const doseMgPerKg = ethanolMassMg / weightKg;
    const displayedDose = unit === "kg" ? doseMgPerKg : doseMgPerKg / LB_PER_KG;
    const doseUnitLabel = unit === "kg" ? "mg/kg" : "mg/lb";
    const weightUnitLabel = unit === "kg" ? "kg" : "lb";

    // Toxicity thresholds (approximate, from veterinary toxicology literature):
    // Mild signs: > 100 mg/kg
    // Severe signs: > 200 mg/kg
    // Potentially lethal: > 300 mg/kg

    let riskLabel = "";
    let warning = null;

    if (doseMgPerKg < 50) {
      riskLabel = "Low risk of ethanol toxicity.";
    } else if (doseMgPerKg < 100) {
      riskLabel = "Mild risk: Watch for mild intoxication signs.";
    } else if (doseMgPerKg < 200) {
      riskLabel = "Moderate risk: Possible clinical signs, veterinary attention advised.";
      warning =
        "Ethanol dose is high enough to cause clinical signs. Immediate veterinary consultation recommended.";
    } else if (doseMgPerKg < 300) {
      riskLabel = "High risk: Severe intoxication likely, urgent veterinary care needed.";
      warning =
        "Severe ethanol toxicity risk. Immediate emergency veterinary care is critical.";
    } else {
      riskLabel = "Critical risk: Potentially lethal ethanol dose.";
      warning =
        "Dose exceeds lethal thresholds. Emergency veterinary intervention required immediately.";
    }

    return {
      value: displayedDose.toFixed(1),
      label: riskLabel,
      unitLabel: doseUnitLabel,
      subtext: `Dose: ${displayedDose.toFixed(1)} mg ethanol per ${weightUnitLabel} body weight.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question:
        "Why is ethanol toxic to dogs, and how does it affect their body differently than humans?",
      answer:
        "Ethanol is toxic to dogs because their metabolism and physiology differ significantly from humans. Dogs have a lower tolerance for ethanol due to differences in liver enzyme activity, leading to slower breakdown and accumulation of toxic metabolites. Ethanol affects the central nervous system, causing depression, hypoglycemia, and metabolic acidosis. Unlike humans, even small amounts can cause severe symptoms in dogs, making early recognition and intervention critical.",
    },
    {
      question:
        "How is the toxic dose of ethanol calculated for dogs, and why is mg/kg used instead of other units?",
      answer:
        "The toxic dose of ethanol in dogs is calculated based on milligrams of ethanol per kilogram of body weight (mg/kg) to standardize dosing relative to size. This approach accounts for the wide range of dog sizes and ensures accuracy in assessing risk. Using mg/kg allows veterinarians to predict clinical effects more reliably than absolute amounts, as toxicity depends on the concentration of ethanol relative to the dog's mass.",
    },
    {
      question:
        "What clinical signs should owners watch for if they suspect their dog has ingested alcohol or ethanol?",
      answer:
        "Owners should watch for signs such as vomiting, disorientation, ataxia (loss of coordination), excessive drooling, lethargy, tremors, hypothermia, and in severe cases, seizures or coma. These symptoms indicate ethanol toxicity affecting the nervous system and metabolic balance. Immediate veterinary evaluation is essential because symptoms can progress rapidly and may require supportive care or antidotal treatment.",
    },
    {
      question:
        "Can this calculator replace veterinary advice in cases of suspected ethanol poisoning in dogs?",
      answer:
        "No, this calculator is an educational tool designed to estimate ethanol exposure risk but cannot replace professional veterinary assessment. Ethanol toxicity can progress unpredictably, and individual dogs may respond differently. If ethanol ingestion is suspected, prompt veterinary consultation is critical for diagnosis, monitoring, and treatment to prevent serious complications or death.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
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
            min="0"
            step="any"
            placeholder={`Enter dog's weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>

        {/* Ethanol Concentration Input */}
        <div>
          <Label htmlFor="ethanolConcentration" className="text-slate-700 dark:text-slate-300">
            Ethanol Concentration (% v/v)
          </Label>
          <Input
            id="ethanolConcentration"
            type="number"
            min="0"
            max="100"
            step="any"
            placeholder="Ethanol concentration in the liquid (e.g., 40 for 40%)"
            value={inputs.ethanolConcentration}
            onChange={(e) => setInputs({ ...inputs, ethanolConcentration: e.target.value })}
          />
        </div>

        {/* Volume Consumed Input */}
        <div>
          <Label htmlFor="volumeConsumed" className="text-slate-700 dark:text-slate-300">
            Volume Consumed (mL)
          </Label>
          <Input
            id="volumeConsumed"
            type="number"
            min="0"
            step="any"
            placeholder="Volume of ethanol-containing liquid ingested in milliliters"
            value={inputs.volumeConsumed}
            onChange={(e) => setInputs({ ...inputs, volumeConsumed: e.target.value })}
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
          onClick={() => setInputs({ weight: "", ethanolConcentration: "", volumeConsumed: "" })}
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
                Estimated Ethanol Dose
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value} {results.unitLabel}
              </p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian immediately if ethanol ingestion is suspected.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Alcohol/Ethanol Exposure Risk Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Ethanol, commonly found in alcoholic beverages and various household products, poses a significant toxic risk to dogs even at relatively low doses. Unlike humans, dogs metabolize ethanol differently, making them more susceptible to its toxic effects. This calculator estimates the risk of ethanol toxicity based on the dog’s body weight, the concentration of ethanol in the ingested liquid, and the volume consumed. Understanding these parameters helps pet owners and veterinarians assess the severity of exposure and urgency of treatment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator uses veterinary toxicology principles to convert the ingested volume and ethanol concentration into a dose expressed in milligrams of ethanol per kilogram of body weight (mg/kg). This unit is critical because toxicity thresholds are established relative to body mass, allowing for accurate risk stratification across different dog sizes. The tool also incorporates known clinical toxicity thresholds to provide context on the potential severity of exposure, guiding decisions on monitoring and veterinary intervention.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to note that individual dogs may vary in their sensitivity to ethanol due to factors such as age, health status, and concurrent ingestion of other substances. Therefore, while this calculator provides an evidence-based estimate, it should be used as a supplementary tool alongside professional veterinary evaluation. Prompt recognition and treatment of ethanol poisoning can significantly improve outcomes and reduce the risk of serious complications or death.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately assess the risk of ethanol toxicity in your dog, follow these steps carefully. Begin by selecting the appropriate unit system—Imperial or Metric—based on your preference or the units available for the inputs. Next, enter your dog’s current body weight, ensuring the value is positive and realistic. Then, input the ethanol concentration of the liquid ingested, expressed as a percentage volume (e.g., 40% for whiskey). Finally, enter the volume of the ethanol-containing liquid your dog consumed, using fluid ounces for Imperial units or milliliters for Metric.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> Enter the accurate weight of your dog. This is essential because the toxicity dose is calculated per kilogram of body weight, allowing for precise risk estimation.
          </li>
          <li>
            <strong>Ethanol Concentration (% v/v):</strong> This is the percentage of ethanol in the liquid your dog ingested. For example, standard spirits like vodka or whiskey typically contain around 40% ethanol.
          </li>
          <li>
            <strong>Volume Consumed:</strong> Enter the amount of the ethanol-containing liquid your dog ingested. Use fluid ounces for Imperial units or milliliters for Metric units. Accurate measurement is important for reliable results.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering all inputs, click the “Calculate” button to view the estimated ethanol dose in mg/kg and the associated risk level. If the calculated dose indicates moderate to critical risk, seek immediate veterinary care. Use the “Reset” button to clear all inputs and start a new calculation if needed.
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
              href="https://www.merckvetmanual.com/toxicology/ethanol-toxicity/ethanol-toxicity-in-small-animals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Ethanol Toxicity in Small Animals
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of ethanol toxicity mechanisms, clinical signs, and treatment protocols in dogs and cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151216/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Veterinary Toxicology: Basic and Clinical Principles, 3rd Edition
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative textbook detailing toxicokinetics and clinical management of ethanol poisoning in veterinary patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.avma.org/resources-tools/pet-owners/petcare/ethanol-toxicity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Veterinary Medical Association (AVMA) - Ethanol Toxicity
            </a>
            <p className="text-slate-500 text-sm">
              Practical guidance for pet owners and veterinarians on recognizing and responding to ethanol ingestion in pets.
            </p>
          </li>
          <li className="block">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/12745862/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Clinical Veterinary Toxicology, 2nd Edition
            </a>
            <p className="text-slate-500 text-sm">
              Detailed clinical case studies and toxic dose thresholds for ethanol and other common toxins in dogs.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Alcohol/Ethanol Exposure Risk Calculator"
      description="Calculate the toxic risk of ethanol/alcohol exposure based on concentration and dog's body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula:
          "Dose (mg/kg) = [Volume (mL) × Ethanol Concentration (%) × 0.789 (g/mL) × 1000 (mg/g)] ÷ Weight (kg)",
        variables: [
          { symbol: "Volume (mL)", description: "Volume of ethanol-containing liquid ingested" },
          { symbol: "Ethanol Concentration (%)", description: "Percentage volume of ethanol in the liquid" },
          { symbol: "0.789 (g/mL)", description: "Density of ethanol" },
          { symbol: "1000 (mg/g)", description: "Conversion factor from grams to milligrams" },
          { symbol: "Weight (kg)", description: "Dog's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 20 lb (9.07 kg) dog ingests 2 fl oz (59.15 mL) of whiskey with 40% ethanol concentration.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert dog weight to kg: 20 lbs ÷ 2.20462 = 9.07 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate ethanol mass: 59.15 mL × 0.40 × 0.789 g/mL = 18.67 g ethanol.",
          },
          {
            label: "Step 3",
            explanation:
              "Convert to mg: 18.67 g × 1000 = 18,670 mg ethanol.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate dose: 18,670 mg ÷ 9.07 kg = 205.9 mg/kg ethanol.",
          },
        ],
        result:
          "The dog received approximately 206 mg/kg ethanol, indicating a high risk of severe intoxication requiring immediate veterinary care.",
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
        { id: "what-is", label: "Understanding Dog Alcohol/Ethanol Exposure Risk Calculator" },
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
