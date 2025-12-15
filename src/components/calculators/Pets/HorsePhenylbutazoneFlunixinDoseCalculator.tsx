import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorsePhenylbutazoneFlunixinDoseCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight only (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
    drug: "phenylbutazone",
  });

  // 2. LOGIC ENGINE
  // Dose ranges based on veterinary references:
  // Phenylbutazone: 2-4 mg/kg PO or IV q12h (max 8 mg/kg/day)
  // Flunixin meglumine: 1.1 mg/kg IV or IM q12-24h (max 2.2 mg/kg/day)
  // For simplicity, calculator will output dose per administration (mg) and daily max dose (mg)
  // User selects drug, enters weight, output dose per administration and max daily dose.

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    let doseMgPerKg = 0;
    let maxDailyMgPerKg = 0;
    let drugName = "";

    if (inputs.drug === "phenylbutazone") {
      drugName = "Phenylbutazone";
      doseMgPerKg = 4; // using upper end of typical dose per administration
      maxDailyMgPerKg = 8;
    } else if (inputs.drug === "flunixin") {
      drugName = "Flunixin meglumine";
      doseMgPerKg = 1.1;
      maxDailyMgPerKg = 2.2;
    }

    const dosePerAdministration = doseMgPerKg * weightKg;
    const maxDailyDose = maxDailyMgPerKg * weightKg;

    // Round to 2 decimals
    const doseRounded = dosePerAdministration.toFixed(2);
    const maxDailyRounded = maxDailyDose.toFixed(2);

    // Warning if weight is extremely low or high (e.g. <200kg or >1000kg)
    let warning = null;
    if (weightKg < 200) {
      warning =
        "Weight entered is below typical adult horse weight; dose calculations may not be accurate for foals or miniature horses.";
    } else if (weightKg > 1000) {
      warning =
        "Weight entered exceeds typical adult horse weight; dose calculations may require veterinary confirmation.";
    }

    return {
      value: `${doseRounded} mg per dose`,
      label: `${drugName} Dose`,
      subtext: `Max daily dose: ${maxDailyRounded} mg`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to calculate the correct dose of Phenylbutazone or Flunixin?",
      answer:
        "Accurate dosing of Phenylbutazone and Flunixin is critical to ensure effective pain and inflammation management while minimizing the risk of adverse effects such as gastrointestinal ulcers or kidney damage. Overdosing can lead to toxicity, whereas underdosing may result in insufficient therapeutic benefit. Therefore, precise dose calculation based on the horse's weight helps optimize safety and efficacy.",
    },
    {
      question: "How does the route of administration affect the dosing of these NSAIDs?",
      answer:
        "The route of administration influences the absorption and bioavailability of Phenylbutazone and Flunixin, which in turn affects dosing frequency and amount. For example, intravenous administration typically requires lower doses due to 100% bioavailability, while oral dosing may require adjustments for absorption variability. Understanding the route ensures the dose calculated is appropriate for the intended method of delivery.",
    },
    {
      question: "Can this calculator be used for foals or miniature horses?",
      answer:
        "This calculator is primarily designed for adult horses within a typical weight range and may not provide accurate dosing for foals or miniature horses due to their unique physiology and metabolic rates. Foals often require specialized dosing considerations, and miniature horses may have different drug sensitivities. Always consult a veterinarian for dosing in these special populations to ensure safety.",
    },
    {
      question: "Why is it necessary to consider the maximum daily dose when administering NSAIDs?",
      answer:
        "Considering the maximum daily dose of NSAIDs like Phenylbutazone and Flunixin is essential to prevent cumulative toxicity, which can cause serious side effects such as renal failure or gastrointestinal ulceration. Even if individual doses are safe, exceeding the total daily limit increases risk. Monitoring total daily intake ensures therapeutic benefit without compromising the horse's health.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handler for input changes
  function onInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
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

      {/* Drug selector */}
      <div className="space-y-2">
        <Label htmlFor="drug" className="text-slate-700 dark:text-slate-300">
          Select Drug
        </Label>
        <select
          id="drug"
          name="drug"
          value={inputs.drug}
          onChange={onInputChange}
          className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2"
        >
          <option value="phenylbutazone">Phenylbutazone</option>
          <option value="flunixin">Flunixin meglumine</option>
        </select>
      </div>

      {/* Weight input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          name="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          value={inputs.weight}
          onChange={onInputChange}
          aria-describedby="weight-help"
        />
        <p id="weight-help" className="text-xs text-slate-500 dark:text-slate-400">
          Enter the horse's weight to calculate the appropriate dose.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", drug: "phenylbutazone" })}
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
          Understanding Phenylbutazone / Flunixin Dose Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Phenylbutazone and Flunixin meglumine are non-steroidal anti-inflammatory drugs (NSAIDs) commonly used in equine medicine to manage pain, inflammation, and fever. Accurate dosing of these medications is essential to maximize therapeutic benefits while minimizing potential adverse effects such as gastrointestinal ulceration or renal toxicity. This calculator provides a reliable tool for veterinarians and horse owners to estimate safe and effective doses based on the horse's weight and selected drug.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator uses established veterinary dosing guidelines to determine the appropriate dose per administration and the maximum daily dose for both Phenylbutazone and Flunixin. It accounts for the differences in potency and dosing regimens between the two drugs, ensuring that users receive tailored recommendations. By converting weights between imperial and metric units, it accommodates a broad user base and promotes ease of use in diverse clinical settings.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          While this tool offers a valuable starting point for dose calculation, it is not a substitute for professional veterinary advice. Individual patient factors such as age, health status, concurrent medications, and specific clinical conditions may necessitate dose adjustments. Users should always consult with a licensed veterinarian before administering NSAIDs to ensure safe and effective treatment.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide quick, accurate dosing information for Phenylbutazone and Flunixin in horses. Begin by selecting the preferred unit system—imperial (pounds) or metric (kilograms)—to match the weight measurement you have available. Next, choose the drug you intend to dose, either Phenylbutazone or Flunixin meglumine, as dosing guidelines differ between these medications.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the horse's weight in the selected unit system. Ensure the weight is accurate to improve dosing precision.
          </li>
          <li>
            <strong>Step 2:</strong> Select the drug you plan to administer from the dropdown menu.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to generate the recommended dose per administration and the maximum daily dose.
          </li>
          <li>
            <strong>Step 4:</strong> Review the results carefully, including any warnings related to unusual weight ranges, and consult your veterinarian before proceeding.
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
              href="https://www.merckvetmanual.com/musculoskeletal-system/anti-inflammatory-drugs/phenylbutazone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Phenylbutazone
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of Phenylbutazone pharmacology, dosing, and clinical use in horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/musculoskeletal-system/anti-inflammatory-drugs/flunixin-meglumine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Flunixin Meglumine
            </a>
            <p className="text-slate-500 text-sm">
              Detailed information on Flunixin meglumine's mechanism, dosing guidelines, and safety considerations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://aaep.org/guidelines/aaep-guidelines-nsaids"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Association of Equine Practitioners (AAEP) NSAID Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Official guidelines on the use of NSAIDs in equine practice, including dosing and monitoring recommendations.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Phenylbutazone / Flunixin Dose Calculator"
      description="Calculate the safe dose for the NSAIDs **Phenylbutazone** and **Flunixin** for pain and fever management."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Dose (mg/kg) × Weight (kg)",
        variables: [
          { symbol: "Dose (mg)", description: "Dose per administration in milligrams" },
          { symbol: "Dose (mg/kg)", description: "Recommended dose per kilogram of body weight" },
          { symbol: "Weight (kg)", description: "Horse body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse requires Phenylbutazone for pain management. Calculate the dose per administration and maximum daily dose.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms: 1100 lb ÷ 2.20462 = 499.0 kg approximately.",
          },
          {
            label: "2",
            explanation:
              "Calculate dose per administration: 4 mg/kg × 499.0 kg = 1996 mg.",
          },
          {
            label: "3",
            explanation:
              "Calculate maximum daily dose: 8 mg/kg × 499.0 kg = 3992 mg.",
          },
        ],
        result: "The horse should receive approximately 1996 mg of Phenylbutazone per dose, not exceeding 3992 mg in 24 hours.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Feeder Insect Gut-Loading Ratio", url: "/pets/reptile-feeder-insect-gut-loading-ratio", icon: "🐶" },
        { title: "Ambient Temperature Safe Zone Calculator", url: "/pets/bird-ambient-temperature-safe-zone", icon: "🐱" },
        { title: "Litter Box Output Tracker (Normal vs. Increased)", url: "/pets/cat-litter-box-output-tracker", icon: "🍖" },
        { title: "Seed-to-Pellet Conversion Planner", url: "/pets/bird-seed-to-pellet-conversion-planner", icon: "💉" },
        { title: "Calcium Intake Limit (Bladder Stone Prevention)", url: "/pets/small-mammal-calcium-intake-limit", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Phenylbutazone / Flunixin Dose Calculator" },
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