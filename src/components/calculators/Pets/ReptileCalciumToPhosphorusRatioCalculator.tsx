import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileCalciumToPhosphorusRatioCalculator() {
  // 1. STATE
  // Unit selector needed because calcium and phosphorus can be entered in mg or ppm, but here we simplify to mg.
  const [unit, setUnit] = useState("imperial");

  // Inputs: Calcium and Phosphorus content in mg
  const [inputs, setInputs] = useState({
    calciumMg: "",
    phosphorusMg: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const calcium = parseFloat(inputs.calciumMg);
    const phosphorus = parseFloat(inputs.phosphorusMg);

    if (isNaN(calcium) || calcium <= 0 || isNaN(phosphorus) || phosphorus <= 0) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter positive numeric values for both Calcium and Phosphorus.",
        warning: null,
      };
    }

    const ratio = +(calcium / phosphorus).toFixed(2);

    let warning = null;
    if (ratio < 1) {
      warning =
        "Warning: The Calcium-to-Phosphorus ratio is below 1:1, which may lead to metabolic bone disease in reptiles. Consider adjusting the diet to increase calcium or reduce phosphorus.";
    } else if (ratio > 2.5) {
      warning =
        "Caution: The Calcium-to-Phosphorus ratio is above 2.5:1, which might cause calcium excess and related health issues. Balance is key for optimal reptile health.";
    }

    return {
      value: ratio,
      label: "Calcium-to-Phosphorus Ratio",
      subtext: "Ideal ratio is generally between 1:1 and 2.5:1 for reptiles.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is the Calcium-to-Phosphorus ratio important for reptiles?",
      answer:
        "The Calcium-to-Phosphorus ratio is critical because it influences bone development, metabolic functions, and overall health in reptiles. An imbalance, especially low calcium relative to phosphorus, can lead to metabolic bone disease, a common and serious condition. Maintaining an appropriate ratio ensures proper calcium absorption and utilization, supporting skeletal strength and physiological processes.",
    },
    {
      question: "How can I accurately measure calcium and phosphorus in my reptile’s diet?",
      answer:
        "Accurate measurement involves analyzing the calcium and phosphorus content of all dietary components, including supplements, insects, and plants. Laboratory testing or reliable nutritional databases can provide precise values. Consistently tracking these values helps maintain a balanced diet and prevents nutritional deficiencies or excesses that could harm your reptile.",
    },
    {
      question: "What are the risks of having a Calcium-to-Phosphorus ratio that is too high?",
      answer:
        "A ratio that is too high, meaning excessive calcium relative to phosphorus, can cause hypercalcemia, leading to kidney damage and impaired phosphorus metabolism. This imbalance may also interfere with the absorption of other minerals. Therefore, while calcium is essential, it must be balanced carefully with phosphorus to avoid adverse health effects.",
    },
    {
      question: "Can this calculator be used for all reptile species?",
      answer:
        "While this calculator provides a general guideline for the Calcium-to-Phosphorus ratio, specific requirements can vary among reptile species due to differences in metabolism and diet. It is best used as a starting point, and consulting a reptile veterinarian or nutritionist is recommended for species-specific dietary planning. Tailoring the ratio ensures optimal health and prevents species-specific nutritional disorders.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
              <SelectItem value="imperial">Imperial (mg)</SelectItem>
              <SelectItem value="metric">Metric (mg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="calciumMg" className="text-slate-700 dark:text-slate-300">
            Calcium Content (mg)
          </Label>
          <Input
            id="calciumMg"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 500"
            value={inputs.calciumMg}
            onChange={(e) => setInputs((prev) => ({ ...prev, calciumMg: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="phosphorusMg" className="text-slate-700 dark:text-slate-300">
            Phosphorus Content (mg)
          </Label>
          <Input
            id="phosphorusMg"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 300"
            value={inputs.phosphorusMg}
            onChange={(e) => setInputs((prev) => ({ ...prev, phosphorusMg: e.target.value }))}
          />
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
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ calciumMg: "", phosphorusMg: "" })}
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
          Understanding Calcium-to-Phosphorus Ratio Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Calcium-to-Phosphorus ratio calculator is a vital tool designed to help reptile owners and veterinarians assess the balance of these two essential minerals in a reptile’s diet. Calcium and phosphorus play critical roles in skeletal development, metabolic processes, and overall health. An imbalance, particularly a low calcium-to-phosphorus ratio, can lead to metabolic bone disease, a common and serious condition in captive reptiles.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator simplifies the evaluation process by allowing users to input the calcium and phosphorus content of their reptile’s diet and receive an immediate ratio. Maintaining a ratio above 1:1 is generally recommended to ensure proper calcium absorption and utilization. The tool also provides warnings if the ratio falls outside the optimal range, helping prevent nutritional imbalances that could compromise reptile health.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By using this calculator, caretakers can make informed decisions about dietary adjustments, supplementation, and feeding strategies. It serves as an educational resource to promote better understanding of reptile nutrition and to support proactive health management. Ultimately, this tool contributes to improving the welfare and longevity of captive reptiles through precise nutritional balance.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Calcium-to-Phosphorus Ratio Calculator is straightforward and user-friendly. Begin by gathering accurate nutritional information about the calcium and phosphorus content in your reptile’s diet, typically measured in milligrams (mg). This information can be obtained from supplement labels, nutritional databases, or laboratory analysis.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system if needed (default is mg for both calcium and phosphorus).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the calcium content (in mg) of the dietary portion you are evaluating.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the phosphorus content (in mg) corresponding to the same dietary portion.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to compute the calcium-to-phosphorus ratio.
          </li>
          <li>
            <strong>Step 5:</strong> Review the result and any warnings provided to determine if dietary adjustments are necessary.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          Regular use of this calculator can help maintain optimal mineral balance and prevent common nutritional disorders in reptiles. Always consult a qualified veterinarian for personalized dietary advice and before making significant changes to your reptile’s nutrition.
        </p>
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Calcium and Phosphorus Metabolism in Reptiles: A Review
            </a>
            <p className="text-slate-500 text-sm">
              This comprehensive review discusses the importance of calcium and phosphorus balance in reptiles, highlighting metabolic bone disease and dietary considerations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/Reptile%20Nutrition.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Reptile Nutrition Guidelines - UC Davis Veterinary Medicine
            </a>
            <p className="text-slate-500 text-sm">
              This guideline provides detailed information on reptile dietary requirements, including mineral ratios and supplementation strategies.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/page/MetabolicBoneDisease"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Metabolic Bone Disease in Reptiles - Association of Avian Veterinarians
            </a>
            <p className="text-slate-500 text-sm">
              An authoritative source on the causes, prevention, and treatment of metabolic bone disease, emphasizing the role of calcium and phosphorus balance.
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
          { symbol: "Calcium (mg)", description: "Amount of calcium in milligrams in the diet" },
          { symbol: "Phosphorus (mg)", description: "Amount of phosphorus in milligrams in the diet" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A reptile owner wants to evaluate the calcium-to-phosphorus ratio of a supplement containing 500 mg calcium and 300 mg phosphorus per serving.",
        steps: [
          { label: "1", explanation: "Input calcium content as 500 mg." },
          { label: "2", explanation: "Input phosphorus content as 300 mg." },
          { label: "3", explanation: "Calculate the ratio: 500 ÷ 300 = 1.67." },
        ],
        result: "The calcium-to-phosphorus ratio is 1.67:1, which is within the ideal range for reptile health.",
      }}
      relatedCalculators={[
        { title: "Water Change Volume Planner", url: "/pets/aquarium-water-change-volume-planner", icon: "🐾" },
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dehydration Risk Estimator (Weight & Symptoms Aware)", url: "/pets/dog-dehydration-risk-estimator", icon: "🐱" },
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
        { title: "Heat Risk/Walk Safety Window (Temp & Humidity)", url: "/pets/dog-heat-risk-walk-safety-window", icon: "💉" },
        { title: "Dewormer & Antibiotic Dose Reference", url: "/pets/reptile-dewormer-antibiotic-dose-reference", icon: "💧" },
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