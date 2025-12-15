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
  // Default unit system is imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg), desired EPA/DHA dose mg per kg body weight
  const [inputs, setInputs] = useState({
    weight: "",
    doseMgPerKg: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const doseNum = parseFloat(inputs.doseMgPerKg);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(doseNum) ||
      doseNum <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if input is imperial (lbs)
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Total EPA/DHA supplement dose in mg = dose (mg/kg) * weight (kg)
    const totalDoseMg = doseNum * weightKg;

    // Format result with commas and 1 decimal place
    const formattedDose = totalDoseMg.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

    // Warning if dose is unusually high (e.g. > 100 mg/kg)
    const warning =
      doseNum > 100
        ? "The dose entered is quite high. Please consult a veterinarian before administering such amounts."
        : null;

    return {
      value: formattedDose,
      label: "Total EPA/DHA Supplement Dose (mg)",
      subtext: `Based on ${weightKg.toFixed(2)} kg body weight and ${doseNum} mg/kg dose`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to calculate Omega-3 dosage based on weight?",
      answer:
        "Calculating Omega-3 dosage based on the horse's weight ensures precise and safe supplementation tailored to individual needs. Over- or under-dosing can lead to ineffective results or potential health risks. Weight-based dosing accounts for metabolic differences and optimizes the therapeutic benefits of EPA and DHA fatty acids.",
    },
    {
      question: "How do EPA and DHA benefit horses when supplemented correctly?",
      answer:
        "EPA and DHA are essential Omega-3 fatty acids that support anti-inflammatory processes, joint health, and cardiovascular function in horses. Proper supplementation can improve coat condition, immune response, and overall well-being. These fatty acids also play a role in modulating cellular functions critical for recovery and performance.",
    },
    {
      question: "Can I use this calculator for other animals besides horses?",
      answer:
        "While this calculator is specifically designed for horses, the principle of dosing EPA/DHA per kilogram applies broadly. However, different species have unique metabolic rates and nutritional requirements, so it is crucial to consult a veterinarian before applying these calculations to other animals. Species-specific guidelines ensure safety and efficacy.",
    },
    {
      question: "What factors can influence the required Omega-3 dosage for a horse?",
      answer:
        "Several factors affect Omega-3 requirements, including the horse's age, activity level, health status, and diet composition. Horses with inflammatory conditions or those in heavy training may require higher doses. Additionally, the bioavailability of the supplement and the balance with Omega-6 fatty acids influence the effective dosage.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
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
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="doseMgPerKg" className="text-slate-700 dark:text-slate-300">
            Desired EPA/DHA Dose (mg per kg body weight)
          </Label>
          <Input
            id="doseMgPerKg"
            type="number"
            min="0"
            step="any"
            placeholder="Typical range: 30 - 60 mg/kg"
            value={inputs.doseMgPerKg}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, doseMgPerKg: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", doseMgPerKg: "" })}
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
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

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Omega-3 Supplement Planner (EPA/DHA per kg)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Omega-3 fatty acids, particularly eicosapentaenoic acid (EPA) and docosahexaenoic acid (DHA), are vital nutrients that play a crucial role in equine health. These long-chain polyunsaturated fats contribute to anti-inflammatory processes, support cardiovascular function, and enhance immune responses. Supplementing horses with EPA and DHA can improve coat quality, joint mobility, and overall vitality, especially in animals under stress or with inflammatory conditions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The Omega-3 Supplement Planner calculates the precise amount of EPA/DHA required based on the horse’s body weight, ensuring accurate dosing tailored to individual needs. This weight-based approach accounts for metabolic differences and helps avoid under- or overdosing, which can compromise efficacy or safety. By using this tool, caretakers and veterinarians can optimize supplementation strategies to support the horse’s health and performance effectively.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps determine the total EPA/DHA supplement dose based on the horse’s weight and the desired dose per kilogram of body weight. Begin by selecting the unit system that corresponds to your measurement preference—imperial (lbs) or metric (kg). Then, enter the horse’s weight and the target EPA/DHA dose in milligrams per kilogram.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) to match your weight measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Input the horse’s weight in the chosen unit.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the desired EPA/DHA dose in mg per kg body weight, typically ranging from 30 to 60 mg/kg depending on veterinary guidance.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the total EPA/DHA supplement dose in milligrams.
          </li>
          <li>
            <strong>Step 5:</strong> Use the result to guide supplementation, and consult your veterinarian for personalized recommendations.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6266232/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Omega-3 Fatty Acids in Equine Health: A Review
            </a>
            <p className="text-slate-500 text-sm">
              This comprehensive review discusses the role of EPA and DHA in equine health, highlighting their anti-inflammatory effects and benefits for joint and cardiovascular function.
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
              The American Association of Equine Practitioners provides clinical guidelines on appropriate dosing and use of Omega-3 supplements in horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/Equine-Nutrition-Omega-3.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. University of California Davis - Equine Nutrition: Omega-3 Fatty Acids
            </a>
            <p className="text-slate-500 text-sm">
              This resource outlines the nutritional importance of Omega-3 fatty acids and practical supplementation strategies for horses.
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
        formula: "Total EPA/DHA Dose (mg) = Dose (mg/kg) × Body Weight (kg)",
        variables: [
          { symbol: "Dose (mg/kg)", description: "Desired EPA/DHA dose per kilogram of body weight" },
          { symbol: "Body Weight (kg)", description: "Horse's body weight in kilograms" },
          { symbol: "Total EPA/DHA Dose (mg)", description: "Total supplement dose in milligrams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse requires an EPA/DHA dose of 50 mg/kg to support joint health during training.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight from pounds to kilograms: 1100 lbs ÷ 2.20462 = 499.0 kg (approx).",
          },
          {
            label: "2",
            explanation:
              "Multiply the dose by the weight: 50 mg/kg × 499.0 kg = 24,950 mg total EPA/DHA required.",
          },
          {
            label: "3",
            explanation:
              "Administer approximately 24,950 mg (24.95 grams) of EPA/DHA daily as per supplement instructions.",
          },
        ],
        result: "Total EPA/DHA Supplement Dose = 24,950 mg",
      }}
      relatedCalculators={[
        {
          title: "Dehydration Signs Estimator",
          url: "/pets/bird-dehydration-signs-estimator",
          icon: "🐾",
        },
        {
          title: "Dog Step-Goal & Activity Time Planner",
          url: "/pets/dog-step-goal-activity-time-planner",
          icon: "🐶",
        },
        {
          title: "Horse Calorie & Energy Requirement Calculator (DE / TDN)",
          url: "/pets/horse-calorie-energy-requirement-de-tdn",
          icon: "🐎",
        },
        {
          title: "Benadryl (Diphenhydramine) Dose Calculator for Cats",
          url: "/pets/cat-benadryl-diphenhydramine-dose",
          icon: "🐱",
        },
        {
          title: "Prednisolone Dose Calculator for Cats",
          url: "/pets/cat-prednisolone-dose",
          icon: "🐱",
        },
        {
          title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs",
          url: "/pets/dog-benadryl-diphenhydramine-dose",
          icon: "🐶",
        },
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