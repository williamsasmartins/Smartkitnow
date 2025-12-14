import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseOmega3SupplementPlannerCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg), desired EPA/DHA dose mg per kg bodyweight
  const [inputs, setInputs] = useState({
    weight: "",
    doseMgPerKg: "0.5", // default dose mg/kg (typical range 0.3-1.0 mg/kg)
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const doseRaw = parseFloat(inputs.doseMgPerKg);

    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: "",
        warning: null,
      };
    }
    if (isNaN(doseRaw) || doseRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid dose (mg/kg)",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Calculate total EPA/DHA supplement dose in mg
    const totalDoseMg = weightKg * doseRaw;

    // Format result with commas and 1 decimal place
    const formattedDose = totalDoseMg.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

    return {
      value: formattedDose,
      label: "Total EPA/DHA Supplement Dose (mg)",
      subtext: `Based on ${weightKg.toFixed(1)} kg bodyweight and ${doseRaw.toFixed(2)} mg/kg dose`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is EPA/DHA dosing based on mg per kg bodyweight important?",
      answer:
        "Dosing EPA and DHA based on mg per kg bodyweight ensures accurate and safe supplementation tailored to each horse's size. This individualized approach helps avoid underdosing, which may be ineffective, or overdosing, which could cause adverse effects. Weight-based dosing aligns with veterinary best practices for nutrient supplementation, optimizing health benefits while minimizing risks.",
    },
    {
      question: "How do I determine the correct EPA/DHA dose for my horse?",
      answer:
        "The appropriate EPA/DHA dose depends on the horse's health status, diet, and veterinary recommendations. Typical doses range from 0.3 to 1.0 mg per kg bodyweight daily, but specific conditions like inflammation or skin disorders may require adjustments. Always consult a veterinarian to tailor the dose based on clinical needs and current scientific evidence.",
    },
    {
      question: "Can I use this calculator for other animals besides horses?",
      answer:
        "This calculator is specifically designed for horses, using equine weight and dosing guidelines. While the mg/kg dosing principle applies broadly, other species have different metabolic rates and nutritional requirements. For accurate dosing in other animals, consult species-specific veterinary resources or professionals.",
    },
    {
      question: "What are the benefits of supplementing Omega-3 fatty acids in horses?",
      answer:
        "Omega-3 fatty acids, particularly EPA and DHA, support anti-inflammatory processes, skin and coat health, and cardiovascular function in horses. Supplementation can improve immune response and may aid in managing chronic inflammatory conditions. Providing the correct dose ensures these benefits while maintaining overall nutritional balance.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
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
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-400 mt-1">
            Please enter the horse's current body weight.
          </p>
        </div>

        <div>
          <Label htmlFor="doseMgPerKg" className="text-slate-700 dark:text-slate-300">
            Desired EPA/DHA Dose (mg per kg bodyweight)
          </Label>
          <Input
            id="doseMgPerKg"
            name="doseMgPerKg"
            type="text"
            inputMode="decimal"
            placeholder="Typical: 0.3 - 1.0 mg/kg"
            value={inputs.doseMgPerKg}
            onChange={handleInputChange}
            aria-describedby="dose-desc"
          />
          <p id="dose-desc" className="text-xs text-slate-400 mt-1">
            Enter the target daily dose of EPA/DHA per kilogram of bodyweight.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", doseMgPerKg: "0.5" })}
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Omega-3 Supplement Planner (EPA/DHA per kg)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Omega-3 fatty acids, specifically eicosapentaenoic acid (EPA) and docosahexaenoic acid (DHA), are essential nutrients that play a critical role in equine health. These long-chain polyunsaturated fatty acids contribute to anti-inflammatory processes, support cardiovascular function, and promote healthy skin and coat condition. Because horses cannot efficiently synthesize EPA and DHA, supplementation is often necessary to meet optimal physiological needs, especially in performance or compromised animals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The Omega-3 Supplement Planner calculates the total EPA/DHA dose required based on the horse’s bodyweight, expressed in milligrams per kilogram (mg/kg). This weight-based dosing ensures precise and individualized supplementation, which is crucial given the variability in horse sizes and metabolic demands. By tailoring the dose to bodyweight, the planner helps avoid under- or overdosing, optimizing health benefits while minimizing potential risks associated with excessive fatty acid intake.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator is designed to provide an accurate total daily dose of EPA and DHA supplements based on your horse’s weight and the desired mg/kg dose. Begin by selecting the unit system that corresponds to your measurement preference—either imperial (pounds) or metric (kilograms). Then, enter the horse’s current bodyweight and the target EPA/DHA dose per kilogram, which typically ranges from 0.3 to 1.0 mg/kg depending on veterinary guidance.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (imperial or metric) to match your weight measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the horse’s weight in the chosen unit system.
          </li>
          <li>
            <strong>Step 3:</strong> Input the desired EPA/DHA dose in mg per kg bodyweight, based on veterinary recommendations.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to obtain the total daily supplement dose in milligrams.
          </li>
          <li>
            <strong>Step 5:</strong> Consult your veterinarian to confirm the dose and adjust as necessary for your horse’s specific health needs.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6266234/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Omega-3 Fatty Acids in Equine Health: A Review
            </a>
            <p className="text-slate-500 text-sm">
              This comprehensive review discusses the role of EPA and DHA in equine nutrition, highlighting their anti-inflammatory effects and clinical applications.
            </p>
          </li>
          <li className="block">
            <a
              href="https://aaep.org/guidelines/omega-3-fatty-acids"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. AAEP Guidelines on Omega-3 Supplementation
            </a>
            <p className="text-slate-500 text-sm">
              The American Association of Equine Practitioners provides dosing recommendations and safety considerations for omega-3 fatty acid supplementation in horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/20441861/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Effects of Omega-3 Fatty Acids on Equine Inflammatory Conditions
            </a>
            <p className="text-slate-500 text-sm">
              This study evaluates the clinical benefits of EPA/DHA supplementation in managing equine inflammatory diseases and optimizing immune function.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Omega-3 Supplement Planner (EPA/DHA per kg)"
      description="Determine the required supplement dosage of Omega-3 fatty acids based on the horse's weight (kg)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Total EPA/DHA Dose (mg) = Bodyweight (kg) × Dose (mg/kg)",
        variables: [
          { symbol: "Bodyweight (kg)", description: "Horse's bodyweight in kilograms" },
          { symbol: "Dose (mg/kg)", description: "Desired EPA/DHA dose per kilogram bodyweight" },
          { symbol: "Total EPA/DHA Dose (mg)", description: "Total daily supplement dose in milligrams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse requires an EPA/DHA supplement dose of 0.5 mg per kg bodyweight daily. Calculate the total daily dose in milligrams.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert the horse's weight from pounds to kilograms: 1100 lb ÷ 2.20462 = 499 kg (approx).",
          },
          {
            label: "2",
            explanation:
              "Multiply the bodyweight by the dose: 499 kg × 0.5 mg/kg = 249.5 mg total EPA/DHA per day.",
          },
        ],
        result: "The horse should receive approximately 250 mg of EPA/DHA daily.",
      }}
      relatedCalculators={[
        { title: "Calcium Supplement Dosage (Breeding Females)", url: "/pets/bird-calcium-supplement-dosage-breeding-females", icon: "🐾" },
        { title: "Dehydration Risk Estimator (Weight & Symptoms Aware)", url: "/pets/dog-dehydration-risk-estimator", icon: "🐶" },
        { title: "Meloxicam/Metacam Dose Calculator for Dogs", url: "/pets/dog-meloxicam-metacam-dose", icon: "🐶" },
        { title: "Horse Electrolyte Need Estimator (Exercise & Heat)", url: "/pets/horse-electrolyte-need-estimator", icon: "🐎" },
        { title: "Fluid Replacement Volume Calculator", url: "/pets/reptile-fluid-replacement-volume", icon: "💉" },
        { title: "Egg Binding Risk Estimator", url: "/pets/bird-egg-binding-risk-estimator", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Omega-3 Supplement Planner (EPA/DHA per kg)" },
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