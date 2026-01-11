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
import { weightToKg } from "@/lib/utils";

export default function BirdOmega3SupplementDoseParrotsCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Omega-3 dose for parrots is generally recommended at 30-50 mg/kg body weight daily.
  // We'll use a midpoint dose of 40 mg/kg for calculation.
  // Convert weight to kg if imperial selected.
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: "",
        warning: null,
      };
    }
    const weightKg = weightToKg(weightRaw, unit);
    const doseMg = 40 * weightKg; // 40 mg/kg daily dose
    const doseRounded = Math.round(doseMg);

    return {
      value: doseRounded,
      label: "Daily Omega-3 Supplement Dose (mg)",
      subtext: `Based on a 40 mg/kg daily dose for optimal parrot health.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is Omega-3 supplementation important for parrots?",
      answer:
        "Omega-3 fatty acids play a crucial role in maintaining healthy skin, feathers, and immune function in parrots. These essential fats help reduce inflammation and support cardiovascular health. Since many captive diets lack sufficient Omega-3s, supplementation ensures parrots receive adequate amounts for optimal well-being.",
    },
    {
      question: "How is the correct Omega-3 dose determined for different parrot species?",
      answer:
        "The dose is primarily based on body weight, as metabolic needs scale with size. Veterinary research suggests a range of 30-50 mg/kg daily for most parrots, with 40 mg/kg as a safe average. Species-specific factors and health status may require dose adjustments, so consultation with an avian vet is recommended.",
    },
    {
      question: "Can overdosing Omega-3 supplements harm parrots?",
      answer:
        "Yes, excessive Omega-3 intake can lead to blood thinning, increased bleeding risk, and digestive upset in parrots. While Omega-3s are beneficial, doses above recommended levels should be avoided to prevent toxicity. Always follow veterinary guidance and avoid self-prescribing high doses.",
    },
    {
      question: "What are the best sources of Omega-3 for parrots?",
      answer:
        "High-quality fish oil, flaxseed oil, and algae-based supplements are common Omega-3 sources suitable for parrots. It's important to choose products formulated for avian use to ensure purity and proper dosing. Natural dietary sources alone often do not provide sufficient Omega-3s, making supplementation necessary.",
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
              <SelectItem value="lb">lb</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Parrot Weight ({unit})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "lb" ? "lb" : "kg"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          aria-describedby="weight-help"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
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
          Understanding Omega-3 Supplement Dose (for parrots)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Omega-3 fatty acids are essential nutrients that play a vital role in the overall health and well-being of parrots. These polyunsaturated fats contribute to maintaining healthy skin and feathers, supporting immune function, and reducing inflammation. Since many captive parrot diets may lack sufficient Omega-3 content, supplementation is often necessary to prevent deficiencies and promote optimal physiological function.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The recommended daily dose of Omega-3 supplements for parrots typically ranges between 30 to 50 mg per kilogram of body weight. This range accounts for species differences and individual health needs, with 40 mg/kg being a commonly accepted average dose for most pet parrots. Proper dosing ensures that parrots receive adequate amounts without risking potential side effects associated with overdosing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Supplementing Omega-3s can improve feather quality, reduce the risk of cardiovascular issues, and support neurological health. However, it is important to use high-quality, avian-safe supplements and consult with a qualified avian veterinarian before starting any supplementation regimen. This ensures the correct dose and formulation tailored to the specific parrot species and health status.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the daily Omega-3 supplement dose for your parrot based on its body weight. You can input the weight in either pounds or kilograms depending on your preferred unit system. The calculator uses a scientifically supported average dose of 40 mg per kilogram of body weight to provide a safe and effective supplementation guideline.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) from the dropdown menu.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the accurate weight of your parrot in the selected unit.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to see the recommended daily Omega-3 dose in milligrams.
          </li>
          <li>
            <strong>Step 4:</strong> Use the result as a guideline and consult your avian veterinarian before starting supplementation.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7071213/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Omega-3 Fatty Acids in Avian Medicine: A Review
            </a>
            <p className="text-slate-500 text-sm">
              This review article discusses the role and benefits of Omega-3 fatty acids in birds, including dosing recommendations and clinical applications.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/avian-nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Association of Avian Veterinarians - Avian Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on nutritional requirements for pet birds, including essential fatty acids and supplementation advice.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/birds/nutrition-in-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Merck Veterinary Manual - Nutrition in Birds
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive veterinary resource covering nutritional needs and supplementation protocols for avian species.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Omega-3 Supplement Dose (for parrots)"
      description="Determine the correct daily supplement dosage of Omega-3s for parrots and other large pet birds."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Omega-3 Dose (mg) = 40 mg × Body Weight (kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Parrot's body weight in kilograms" },
          { symbol: "40 mg", description: "Average recommended Omega-3 dose per kg body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A pet African Grey parrot weighs 2.5 lbs. The owner wants to calculate the daily Omega-3 supplement dose.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight from pounds to kilograms: 2.5 lbs ÷ 2.20462 = 1.13 kg.",
          },
          {
            label: "2",
            explanation:
              "Multiply weight by dose: 1.13 kg × 40 mg/kg = 45.2 mg daily Omega-3 dose.",
          },
        ],
        result: "The recommended daily Omega-3 supplement dose is approximately 45 mg.",
      }}
      relatedCalculators={[
        { title: "Fluid Replacement Volume Calculator", url: "/pets/reptile-fluid-replacement-volume", icon: "🐾" },
        { title: "Horse Selenium Toxicity Threshold (ppm)", url: "/pets/horse-selenium-toxicity-threshold", icon: "🐎" },
        { title: "Electrolyte Powder Mixing Calculator", url: "/pets/horse-electrolyte-powder-mixing", icon: "🐱" },
        { title: "Feather Plucking & Stress Risk Index", url: "/pets/bird-feather-plucking-stress-risk-index", icon: "🍖" },
        { title: "Basking Temperature & Gradient Planner", url: "/pets/reptile-basking-temperature-gradient-planner", icon: "💉" },
        { title: "Cat Age in Human Years (Breed/Size Aware)", url: "/pets/cat-age-human-years-breed-size-aware", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Omega-3 Supplement Dose (for parrots)" },
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
