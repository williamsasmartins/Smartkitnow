import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileCalciumToPhosphorusRatioCalculator() {
  // 1. STATE
  // Unit selector is needed because calcium and phosphorus can be input in mg or g, but here we keep it simple: inputs in mg.
  // We keep imperial/metric for weight if needed, but this calculator only needs Ca and P in mg.
  // So no unit switcher needed.
  
  // Inputs: Calcium (mg), Phosphorus (mg)
  const [inputs, setInputs] = useState({
    calciumMg: "",
    phosphorusMg: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const calcium = parseFloat(inputs.calciumMg);
    const phosphorus = parseFloat(inputs.phosphorusMg);

    if (
      isNaN(calcium) ||
      isNaN(phosphorus) ||
      calcium <= 0 ||
      phosphorus <= 0
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter positive numeric values for both Calcium and Phosphorus in mg.",
        warning: null,
      };
    }

    const ratio = +(calcium / phosphorus).toFixed(2);

    let warning = null;
    if (ratio < 1) {
      warning =
        "Warning: A Calcium-to-Phosphorus ratio below 1:1 may lead to metabolic bone disease in reptiles. Consult a veterinarian for dietary adjustments.";
    } else if (ratio > 2) {
      warning =
        "Caution: A Calcium-to-Phosphorus ratio above 2:1 might cause phosphorus deficiency. Balanced nutrition is essential for reptile health.";
    }

    return {
      value: ratio,
      label: "Calcium-to-Phosphorus Ratio (Ca:P)",
      subtext:
        "Ideal dietary ratio is generally between 1:1 and 2:1 for most reptiles to maintain bone and metabolic health.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is the Calcium-to-Phosphorus ratio important for reptiles?",
      answer:
        "The Calcium-to-Phosphorus ratio is crucial because it influences bone development, metabolic functions, and overall health in reptiles. An imbalance, especially a low calcium ratio, can lead to metabolic bone disease, causing deformities and fractures. Maintaining an appropriate ratio ensures proper absorption and utilization of these minerals.",
    },
    {
      question: "How can I measure calcium and phosphorus content in my reptile’s diet?",
      answer:
        "Calcium and phosphorus content can be measured through nutritional analysis of the food items or supplements provided. Many commercial reptile diets list mineral content on packaging, but for homemade diets, laboratory testing or consulting veterinary nutritionists is recommended. Accurate measurement helps maintain the ideal Ca:P ratio.",
    },
    {
      question: "What are the risks of having a Calcium-to-Phosphorus ratio that is too high?",
      answer:
        "A ratio that is too high, meaning excessive calcium relative to phosphorus, can cause phosphorus deficiency, leading to impaired energy metabolism and skeletal problems. This imbalance may reduce phosphorus absorption, affecting cellular functions and overall reptile vitality. Balanced mineral intake is essential to avoid such complications.",
    },
    {
      question: "Can supplements help correct an imbalanced Calcium-to-Phosphorus ratio?",
      answer:
        "Yes, supplements can help restore balance when dietary intake is insufficient or skewed. Calcium powders or phosphorus additives are commonly used under veterinary guidance to adjust ratios safely. However, improper supplementation without professional advice may worsen imbalances or cause toxicity.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="calciumMg" className="text-slate-700 dark:text-slate-300">
            Calcium (mg)
          </Label>
          <Input
            id="calciumMg"
            type="number"
            min="0"
            step="any"
            placeholder="Enter calcium content in mg"
            value={inputs.calciumMg}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, calciumMg: e.target.value }))
            }
            aria-describedby="calciumHelp"
          />
          <p id="calciumHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the amount of calcium in milligrams (mg) present in the diet portion.
          </p>
        </div>

        <div>
          <Label htmlFor="phosphorusMg" className="text-slate-700 dark:text-slate-300">
            Phosphorus (mg)
          </Label>
          <Input
            id="phosphorusMg"
            type="number"
            min="0"
            step="any"
            placeholder="Enter phosphorus content in mg"
            value={inputs.phosphorusMg}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, phosphorusMg: e.target.value }))
            }
            aria-describedby="phosphorusHelp"
          />
          <p id="phosphorusHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the amount of phosphorus in milligrams (mg) present in the diet portion.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs to current values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate Calcium-to-Phosphorus Ratio"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ calciumMg: "", phosphorusMg: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized dietary advice.
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
          Understanding Calcium-to-Phosphorus Ratio Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Calcium-to-Phosphorus ratio calculator is a vital tool designed to assess the balance of these two essential minerals in a reptile's diet. Calcium and phosphorus play critical roles in skeletal development, metabolic processes, and overall physiological health. An improper ratio can lead to serious health issues such as metabolic bone disease, which is common in captive reptiles due to dietary imbalances.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator simplifies the evaluation by allowing caretakers and veterinarians to input the dietary calcium and phosphorus content, providing an immediate ratio. Maintaining a ratio generally between 1:1 and 2:1 is crucial for optimal absorption and utilization of these minerals. The tool also highlights potential risks when the ratio falls outside this ideal range, guiding dietary adjustments.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By using this calculator, reptile owners can make informed decisions about supplementation and diet formulation, ensuring their pets receive balanced nutrition. It serves as an educational resource and a practical aid in preventing nutritional diseases, promoting long-term health and wellbeing in reptiles.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this Calcium-to-Phosphorus ratio calculator is straightforward and requires only two inputs: the amount of calcium and phosphorus in milligrams present in the reptile’s diet portion. These values can be obtained from nutritional labels, laboratory analysis, or veterinary guidance. Once entered, the calculator computes the ratio instantly, providing an easy-to-understand result.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Determine the calcium content (mg) in the diet portion you want to evaluate.
          </li>
          <li>
            <strong>Step 2:</strong> Determine the phosphorus content (mg) in the same diet portion.
          </li>
          <li>
            <strong>Step 3:</strong> Enter both values into the respective input fields and click "Calculate."
          </li>
          <li>
            <strong>Step 4:</strong> Review the calculated ratio and any warnings to assess dietary balance.
          </li>
          <li>
            <strong>Step 5:</strong> Adjust the diet or supplements accordingly, consulting a veterinarian if needed.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/clinical-nutrition/nutrition-reptiles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. UC Davis Veterinary Medicine: Nutrition for Reptiles
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on reptile nutrition including mineral balance and dietary recommendations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Metabolic Bone Disease in Reptiles - A Review (NCBI)
            </a>
            <p className="text-slate-500 text-sm">
              Scientific review discussing the importance of calcium and phosphorus balance in preventing metabolic bone disease.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/resources/nutrition/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Association of Veterinarian Nutritionists (AAVN)
            </a>
            <p className="text-slate-500 text-sm">
              Resource center for veterinary nutrition including mineral requirements and supplementation guidelines.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Calcium-to-Phosphorus Ratio Calculator"
      description="Calculate the vital **Calcium-to-Phosphorus ratio** of a reptile's diet, which should be maintained above 1:1."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Calcium-to-Phosphorus Ratio = Calcium (mg) ÷ Phosphorus (mg)",
        variables: [
          { symbol: "Calcium (mg)", description: "Amount of calcium in milligrams in the diet portion" },
          { symbol: "Phosphorus (mg)", description: "Amount of phosphorus in milligrams in the diet portion" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A reptile owner wants to evaluate the calcium-to-phosphorus ratio in a homemade diet containing 500 mg of calcium and 300 mg of phosphorus per serving.",
        steps: [
          { label: "1", explanation: "Input calcium content: 500 mg" },
          { label: "2", explanation: "Input phosphorus content: 300 mg" },
          { label: "3", explanation: "Calculate ratio: 500 ÷ 300 = 1.67" },
        ],
        result:
          "The resulting ratio is 1.67, which is within the ideal range of 1:1 to 2:1, indicating a balanced mineral profile for the reptile's diet.",
      }}
      relatedCalculators={[
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
        {
          title: "Cat Chocolate Toxicity Calculator",
          url: "/pets/cat-chocolate-toxicity",
          icon: "🐱",
        },
        {
          title: "Dehydration Risk Estimator (Weight & Symptoms Aware)",
          url: "/pets/dog-dehydration-risk-estimator",
          icon: "🐱",
        },
        {
          title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)",
          url: "/pets/dog-human-medication-exposure-alert",
          icon: "🐶",
        },
        {
          title: "Dehydration Risk Estimator (Symptoms + Intake)",
          url: "/pets/cat-dehydration-risk-estimator",
          icon: "💉",
        },
        {
          title: "Lilies Poisoning Risk Guide (cats)",
          url: "/pets/cat-lilies-poisoning-risk-guide",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Calcium-to-Phosphorus Ratio Calculator" },
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