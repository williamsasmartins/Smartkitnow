import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileMetabolicBoneDiseaseRiskCalculator() {
  // 1. STATE
  // No unit switcher needed as inputs are unitless or fixed (Age in months, UVB hours, Calcium mg/kg)
  // Default unit state removed as per instructions

  // Inputs: Age (months), Dietary Calcium (mg/kg), UVB Exposure (hours/day), Vitamin D3 Supplementation (IU/kg)
  const [inputs, setInputs] = useState({
    ageMonths: "",
    dietaryCalcium: "",
    uvbHours: "",
    vitaminD3: "",
  });

  // 2. LOGIC ENGINE
  // Risk Score = (Age Factor) + (Calcium Deficit Factor) + (UVB Deficit Factor) + (Vitamin D3 Deficit Factor)
  // Age Factor: Higher risk if <12 months (juvenile reptiles)
  // Calcium Deficit: Dietary calcium below 1000 mg/kg increases risk
  // UVB Deficit: UVB exposure below 8 hours/day increases risk
  // Vitamin D3 Deficit: Supplementation below 100 IU/kg increases risk
  // Score scaled 0-100, higher means higher risk

  const results = useMemo(() => {
    const age = parseFloat(inputs.ageMonths);
    const calcium = parseFloat(inputs.dietaryCalcium);
    const uvb = parseFloat(inputs.uvbHours);
    const vitaminD3 = parseFloat(inputs.vitaminD3);

    if (
      isNaN(age) ||
      isNaN(calcium) ||
      isNaN(uvb) ||
      isNaN(vitaminD3) ||
      age <= 0 ||
      calcium < 0 ||
      uvb < 0 ||
      vitaminD3 < 0
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid positive numbers for all fields.",
        warning: null,
      };
    }

    // Age factor: max 30 points if < 12 months, linearly decreasing to 0 at 24 months
    const ageFactor = age < 12 ? 30 : age < 24 ? 30 * (24 - age) / 12 : 0;

    // Calcium deficit factor: if calcium < 1000 mg/kg, risk increases linearly up to 30 points at 0 mg/kg
    const calciumFactor = calcium < 1000 ? 30 * (1000 - calcium) / 1000 : 0;

    // UVB deficit factor: if UVB < 8 hours, risk increases linearly up to 20 points at 0 hours
    const uvbFactor = uvb < 8 ? 20 * (8 - uvb) / 8 : 0;

    // Vitamin D3 deficit factor: if D3 < 100 IU/kg, risk increases linearly up to 20 points at 0 IU/kg
    const vitaminD3Factor = vitaminD3 < 100 ? 20 * (100 - vitaminD3) / 100 : 0;

    const riskScore = ageFactor + calciumFactor + uvbFactor + vitaminD3Factor;

    let riskLabel = "Low Risk";
    let warning = null;
    if (riskScore >= 60) {
      riskLabel = "High Risk";
      warning =
        "This reptile is at high risk for Metabolic Bone Disease. Immediate veterinary consultation is recommended.";
    } else if (riskScore >= 30) {
      riskLabel = "Moderate Risk";
      warning =
        "Moderate risk detected. Review husbandry practices and consider veterinary advice.";
    }

    return {
      value: riskScore.toFixed(1),
      label: riskLabel,
      subtext: "Risk score ranges from 0 (lowest) to 100 (highest).",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What factors contribute most to Metabolic Bone Disease risk in reptiles?",
      answer:
        "Metabolic Bone Disease (MBD) risk in reptiles is primarily influenced by inadequate calcium intake, insufficient UVB light exposure, and lack of vitamin D3 supplementation. Calcium is essential for bone strength, while UVB light enables vitamin D3 synthesis, which facilitates calcium absorption. Young reptiles are especially vulnerable due to their rapid growth and higher calcium demands, making husbandry practices critical in prevention.",
    },
    {
      question: "Why is UVB exposure important for preventing Metabolic Bone Disease?",
      answer:
        "UVB exposure is crucial because it enables reptiles to synthesize vitamin D3 in their skin, a vital hormone for calcium metabolism. Without adequate UVB, reptiles cannot properly absorb calcium from their diet, leading to weakened bones and MBD. Therefore, providing appropriate UVB lighting for the correct duration daily is essential to maintain healthy skeletal development and prevent disease.",
    },
    {
      question: "How does vitamin D3 supplementation affect Metabolic Bone Disease risk?",
      answer:
        "Vitamin D3 supplementation helps compensate when UVB exposure is insufficient or inconsistent, ensuring reptiles maintain proper calcium absorption. However, supplementation must be carefully dosed, as excessive vitamin D3 can cause toxicity. Balanced supplementation alongside adequate UVB and dietary calcium is key to minimizing MBD risk and promoting optimal bone health.",
    },
    {
      question: "Can juvenile reptiles recover from Metabolic Bone Disease if caught early?",
      answer:
        "Early detection and intervention can significantly improve outcomes for juvenile reptiles with Metabolic Bone Disease. Correcting husbandry factors such as diet, UVB exposure, and supplementation can halt progression and allow bone remodeling and healing. However, advanced cases may cause permanent deformities, so proactive prevention and veterinary care are essential for young reptiles.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="ageMonths" className="text-slate-700 dark:text-slate-300">
            Age (months)
          </Label>
          <Input
            id="ageMonths"
            type="number"
            min={0}
            step="0.1"
            placeholder="e.g. 6"
            value={inputs.ageMonths}
            onChange={(e) => setInputs((prev) => ({ ...prev, ageMonths: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="dietaryCalcium" className="text-slate-700 dark:text-slate-300">
            Dietary Calcium (mg/kg)
          </Label>
          <Input
            id="dietaryCalcium"
            type="number"
            min={0}
            step="1"
            placeholder="e.g. 800"
            value={inputs.dietaryCalcium}
            onChange={(e) => setInputs((prev) => ({ ...prev, dietaryCalcium: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="uvbHours" className="text-slate-700 dark:text-slate-300">
            UVB Exposure (hours/day)
          </Label>
          <Input
            id="uvbHours"
            type="number"
            min={0}
            max={24}
            step="0.1"
            placeholder="e.g. 6"
            value={inputs.uvbHours}
            onChange={(e) => setInputs((prev) => ({ ...prev, uvbHours: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="vitaminD3" className="text-slate-700 dark:text-slate-300">
            Vitamin D3 Supplementation (IU/kg)
          </Label>
          <Input
            id="vitaminD3"
            type="number"
            min={0}
            step="1"
            placeholder="e.g. 50"
            value={inputs.vitaminD3}
            onChange={(e) => setInputs((prev) => ({ ...prev, vitaminD3: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              ageMonths: "",
              dietaryCalcium: "",
              uvbHours: "",
              vitaminD3: "",
            })
          }
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
          Understanding Metabolic Bone Disease Risk Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Metabolic Bone Disease (MBD) is a common and serious condition affecting reptiles, characterized by weakened bones due to imbalances in calcium, phosphorus, vitamin D3, or UVB exposure. This risk estimator tool synthesizes key husbandry factors—age, dietary calcium, UVB light exposure, and vitamin D3 supplementation—to provide an evidence-based risk score for MBD. By quantifying these variables, the tool helps caretakers identify reptiles at risk and take preventive measures early.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Juvenile reptiles are particularly vulnerable to MBD because their rapid growth demands higher calcium and vitamin D3 availability. Insufficient UVB exposure impairs endogenous vitamin D3 synthesis, which is essential for calcium absorption and bone mineralization. This estimator integrates these critical factors into a single risk score, enabling caretakers and veterinarians to assess husbandry adequacy and optimize reptile health proactively.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this Metabolic Bone Disease Risk Estimator, input your reptile's age in months, the dietary calcium concentration in mg/kg, the average daily UVB exposure in hours, and the vitamin D3 supplementation level in IU/kg. These inputs reflect the most influential factors affecting MBD risk. After entering all values, click "Calculate" to receive a risk score and interpretation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the reptile's age in months to account for growth-related risk factors.
          </li>
          <li>
            <strong>Step 2:</strong> Provide the dietary calcium content, which should ideally be above 1000 mg/kg for healthy bone development.
          </li>
          <li>
            <strong>Step 3:</strong> Input the average daily UVB exposure hours, aiming for at least 8 hours to ensure adequate vitamin D3 synthesis.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the vitamin D3 supplementation level, which supports calcium metabolism especially if UVB exposure is limited.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view the risk score and recommendations. Use the results to adjust husbandry practices or seek veterinary advice.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4997405/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Metabolic Bone Disease in Reptiles: A Review
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive review of MBD pathophysiology, husbandry factors, and treatment options in reptiles. Published in Frontiers in Veterinary Science, 2016.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/Reptile%20Calcium%20and%20Vitamin%20D3%20Requirements.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Calcium and Vitamin D3 Requirements in Reptiles
            </a>
            <p className="text-slate-500 text-sm">
              Detailed guidelines on dietary calcium and vitamin D3 supplementation for captive reptiles from UC Davis Veterinary Medicine.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.reptilesmagazine.com/uvb-lighting-for-reptiles/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. UVB Lighting for Reptiles: Importance and Best Practices
            </a>
            <p className="text-slate-500 text-sm">
              Practical advice on UVB lighting duration and intensity to prevent metabolic bone disease in captive reptiles.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Metabolic Bone Disease Risk Estimator"
      description="Estimate the risk of **Metabolic Bone Disease (MBD)** based on calcium/D3/UVB light availability."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Risk Score = Age Factor + Calcium Deficit Factor + UVB Deficit Factor + Vitamin D3 Deficit Factor",
        variables: [
          { symbol: "Age Factor", description: "Risk contribution based on reptile age (months)" },
          { symbol: "Calcium Deficit Factor", description: "Risk from dietary calcium below 1000 mg/kg" },
          { symbol: "UVB Deficit Factor", description: "Risk from UVB exposure below 8 hours/day" },
          { symbol: "Vitamin D3 Deficit Factor", description: "Risk from vitamin D3 supplementation below 100 IU/kg" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 6-month-old bearded dragon with dietary calcium of 800 mg/kg, UVB exposure of 6 hours/day, and vitamin D3 supplementation of 50 IU/kg.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate Age Factor: Since age is 6 months (<12), Age Factor = 30 points.",
          },
          {
            label: "2",
            explanation:
              "Calculate Calcium Deficit Factor: Calcium is 800 mg/kg, deficit from 1000 mg/kg is 200 mg/kg, so factor = 30 * (200/1000) = 6 points.",
          },
          {
            label: "3",
            explanation:
              "Calculate UVB Deficit Factor: UVB is 6 hours, deficit from 8 hours is 2 hours, so factor = 20 * (2/8) = 5 points.",
          },
          {
            label: "4",
            explanation:
              "Calculate Vitamin D3 Deficit Factor: Supplementation is 50 IU/kg, deficit from 100 IU/kg is 50 IU/kg, so factor = 20 * (50/100) = 10 points.",
          },
          {
            label: "5",
            explanation:
              "Sum all factors: 30 + 6 + 5 + 10 = 51 points, indicating moderate risk for MBD.",
          },
        ],
        result: "Risk Score = 51 (Moderate Risk). Recommend improving diet and UVB exposure, and consulting a veterinarian.",
      }}
      relatedCalculators={[
        {
          title: "Horse Electrolyte Need Estimator (Exercise & Heat)",
          url: "/pets/horse-electrolyte-need-estimator",
          icon: "🐎",
        },
        {
          title: "Nail Trim Interval Planner (activity/surface based)",
          url: "/pets/cat-nail-trim-interval-planner",
          icon: "🐶",
        },
        {
          title: "Puppy Adult Size Predictor (Weight Curve)",
          url: "/pets/puppy-adult-size-predictor-weight-curve",
          icon: "🐱",
        },
        {
          title: "Phosphorus per Meal Estimator (diet label helper)",
          url: "/pets/cat-phosphorus-per-meal-estimator",
          icon: "🍖",
        },
        {
          title: "Horse Calorie & Energy Requirement Calculator (DE / TDN)",
          url: "/pets/horse-calorie-energy-requirement-de-tdn",
          icon: "🐎",
        },
        {
          title: "Dehydration Risk Estimator (Symptoms + Intake)",
          url: "/pets/cat-dehydration-risk-estimator",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Metabolic Bone Disease Risk Estimator" },
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