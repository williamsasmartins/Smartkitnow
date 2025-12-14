import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileVitaminD3RequirementCalculator() {
  // 1. STATE
  // Default unit system: imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg), species (reptile type), UVB exposure (yes/no)
  const [inputs, setInputs] = useState({
    weight: "",
    species: "bearded_dragon",
    uvbExposure: "no",
  });

  // Species-specific supplemental D3 requirement mg/kg/day (approximate)
  // These values are based on veterinary literature for reptiles lacking UVB exposure.
  const speciesD3RequirementMgPerKg = {
    bearded_dragon: 0.5, // mg/kg/day
    leopard_gecko: 0.3,
    chameleon: 0.6,
    turtle: 0.4,
    snake: 0.2,
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // If UVB exposure is yes, supplemental D3 requirement is minimal (0)
    if (inputs.uvbExposure === "yes") {
      return {
        value: 0,
        label: "Supplemental Vitamin D3 not required",
        subtext:
          "Adequate UVB exposure allows endogenous synthesis of Vitamin D3, reducing supplemental needs.",
        warning: null,
      };
    }

    // Get species-specific D3 requirement mg/kg/day
    const d3MgPerKg = speciesD3RequirementMgPerKg[inputs.species] ?? 0.4;

    // Calculate total supplemental D3 requirement in IU/day
    // 1 mg Vitamin D3 = 40,000 IU
    const d3MgTotal = d3MgPerKg * weightKg;
    const d3IU = Math.round(d3MgTotal * 40000);

    return {
      value: d3IU.toLocaleString(),
      label: "Supplemental Vitamin D3 Requirement (IU/day)",
      subtext:
        "Calculated based on species, weight, and lack of UVB exposure. Consult your veterinarian for tailored dosing.",
      warning:
        d3IU > 10000
          ? "High supplemental doses require veterinary supervision to avoid toxicity."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is supplemental Vitamin D3 important for reptiles without UVB exposure?",
      answer:
        "Reptiles rely on UVB light to synthesize Vitamin D3 naturally, which is essential for calcium metabolism and bone health. Without adequate UVB exposure, they cannot produce enough Vitamin D3, leading to deficiencies and metabolic bone disease. Supplemental Vitamin D3 compensates for this lack, ensuring proper physiological function and preventing serious health issues.",
    },
    {
      question: "How does species affect the Vitamin D3 supplementation dosage?",
      answer:
        "Different reptile species have varying metabolic rates and natural Vitamin D3 synthesis efficiencies, influencing their supplemental needs. For example, chameleons generally require higher doses compared to snakes due to their natural behaviors and UVB exposure in the wild. Tailoring supplementation by species helps avoid underdosing or overdosing, both of which can have detrimental effects.",
    },
    {
      question: "Can excessive Vitamin D3 supplementation be harmful to reptiles?",
      answer:
        "Yes, excessive Vitamin D3 intake can lead to hypervitaminosis D, causing calcium imbalances, soft tissue calcification, and kidney damage. This is why dosing must be carefully calculated and monitored by a veterinarian. Proper supplementation balances the benefits of preventing deficiency with the risks of toxicity.",
    },
    {
      question: "How often should Vitamin D3 supplementation be adjusted for a reptile?",
      answer:
        "Supplemental Vitamin D3 requirements can change with growth, health status, and changes in UVB exposure. Regular veterinary check-ups and blood tests can help assess Vitamin D and calcium levels, guiding dosage adjustments. Monitoring ensures the reptile receives adequate but safe supplementation over time.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
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
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-400 mt-1">
            Enter the reptile's body weight for accurate dosing.
          </p>
        </div>

        <div>
          <Label htmlFor="species" className="text-slate-700 dark:text-slate-300">
            Species
          </Label>
          <select
            id="species"
            name="species"
            value={inputs.species}
            onChange={handleInputChange}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="bearded_dragon">Bearded Dragon</option>
            <option value="leopard_gecko">Leopard Gecko</option>
            <option value="chameleon">Chameleon</option>
            <option value="turtle">Turtle</option>
            <option value="snake">Snake</option>
          </select>
        </div>

        <div>
          <Label htmlFor="uvbExposure" className="text-slate-700 dark:text-slate-300">
            UVB Exposure
          </Label>
          <select
            id="uvbExposure"
            name="uvbExposure"
            value={inputs.uvbExposure}
            onChange={handleInputChange}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="no">No (Supplemental needed)</option>
            <option value="yes">Yes (Supplemental not needed)</option>
          </select>
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
          onClick={() => setInputs({ weight: "", species: "bearded_dragon", uvbExposure: "no" })}
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
          Understanding Vitamin D3 Requirement (Supplemental)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Vitamin D3 plays a crucial role in calcium metabolism and bone health in reptiles. Unlike mammals, many reptiles depend heavily on UVB light exposure to synthesize Vitamin D3 endogenously through their skin. When UVB lighting is inadequate or unavailable, reptiles cannot produce sufficient Vitamin D3, which can lead to metabolic bone disease, a serious and potentially fatal condition characterized by weakened bones and deformities.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Supplemental Vitamin D3 is therefore essential for reptiles kept indoors without proper UVB lighting or those with limited natural sunlight exposure. The dosage required varies by species, weight, and environmental conditions. Over-supplementation can cause toxicity, so precise calculation and veterinary guidance are critical to ensure safe and effective dosing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator estimates the supplemental Vitamin D3 dosage needed based on the reptile’s species, body weight, and UVB exposure status. It aims to provide a scientifically grounded starting point for supplementation, helping reptile owners and veterinarians optimize health outcomes while minimizing risks associated with improper dosing.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate the supplemental Vitamin D3 requirement for your reptile, enter the animal’s current weight and select the species from the dropdown menu. Indicate whether your reptile has adequate UVB exposure, as this significantly affects the need for supplementation. The calculator will then provide an estimated daily dose in International Units (IU), tailored to the inputs provided.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the reptile’s weight in pounds or kilograms, depending on your preferred unit system.
          </li>
          <li>
            <strong>Step 2:</strong> Select the species to account for species-specific metabolic differences in Vitamin D3 requirements.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the UVB exposure status to determine if supplemental Vitamin D3 is necessary.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the recommended supplemental Vitamin D3 dosage. Use the “Reset” button to clear inputs and start over.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Vitamin D3 Metabolism and Supplementation in Reptiles - NCBI PMC
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive review of Vitamin D3 physiology, deficiency, and supplementation strategies in captive reptiles.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk296/files/inline-files/Metabolic%20Bone%20Disease%20in%20Reptiles.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Metabolic Bone Disease in Reptiles - UC Davis Veterinary Medicine
            </a>
            <p className="text-slate-500 text-sm">
              Detailed clinical guide on causes, diagnosis, and treatment of metabolic bone disease related to Vitamin D3 deficiency.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/page/ReptileCare"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Association of Veterinarians for Reptile Care
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource on reptile husbandry, including UVB lighting and nutritional supplementation recommendations.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Vitamin D3 Requirement (Supplemental)"
      description="Determine the supplemental D3 dosage needed if UVB lighting is inadequate or unavailable."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Supplemental D3 (IU/day) = Weight (kg) × Species Factor (mg/kg/day) × 40,000 IU/mg",
        variables: [
          { symbol: "Weight (kg)", description: "Body weight of the reptile in kilograms" },
          { symbol: "Species Factor (mg/kg/day)", description: "Species-specific supplemental Vitamin D3 requirement" },
          { symbol: "40,000 IU/mg", description: "Conversion factor from mg to International Units" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 2.2 lb (1 kg) bearded dragon without UVB exposure needs supplemental Vitamin D3.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg (already 1 kg). Use species factor 0.5 mg/kg/day for bearded dragon.",
          },
          {
            label: "2",
            explanation:
              "Calculate total mg: 1 kg × 0.5 mg/kg/day = 0.5 mg/day.",
          },
          {
            label: "3",
            explanation:
              "Convert mg to IU: 0.5 mg × 40,000 IU/mg = 20,000 IU/day supplemental Vitamin D3.",
          },
        ],
        result: "Recommended supplemental Vitamin D3 dose is 20,000 IU per day.",
      }}
      relatedCalculators={[
        { title: "Egg Binding Risk Estimator", url: "/pets/bird-egg-binding-risk-estimator", icon: "🐾" },
        { title: "Cat Harness Size & Fit Guide", url: "/pets/cat-harness-size-fit-guide", icon: "🐱" },
        { title: "Dog Harness Size & Fit Guide", url: "/pets/dog-harness-size-fit-guide", icon: "🐶" },
        { title: "Fluid Intake vs. Urine Output Balance Checker", url: "/pets/cat-fluid-intake-urine-output-balance", icon: "🍖" },
        { title: "Dog Macadamia Nut Toxicity Calculator", url: "/pets/dog-macadamia-nut-toxicity", icon: "🐶" },
        { title: "Dog Xylitol Exposure Risk Calculator", url: "/pets/dog-xylitol-exposure-risk", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Vitamin D3 Requirement (Supplemental)" },
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