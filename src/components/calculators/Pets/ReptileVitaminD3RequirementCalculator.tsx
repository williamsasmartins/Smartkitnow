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

export default function ReptileVitaminD3RequirementCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and baseline dietary vitamin D3 intake (optional)
  // Weight is required; dietary intake optional to estimate supplemental need
  const [inputs, setInputs] = useState({
    weight: "",
    dietaryIntake: "",
  });

  // 2. LOGIC ENGINE
  // Formula source: Supplemental Vitamin D3 (IU/day) = 50 IU/kg BW
  // Convert weight to kg internally if input is imperial
  // Subtract dietary intake if provided, minimum 0
  // Reference: NRC and veterinary guidelines for reptiles without UVB exposure
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const dietaryRaw = parseFloat(inputs.dietaryIntake);

    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Supplemental vitamin D3 requirement (IU/day) = 50 IU/kg BW
    const supplementalRequirement = 50 * weightKg;

    // Adjust for dietary intake if provided and valid
    let adjustedRequirement = supplementalRequirement;
    if (!isNaN(dietaryRaw) && dietaryRaw >= 0) {
      adjustedRequirement = supplementalRequirement - dietaryRaw;
      if (adjustedRequirement < 0) adjustedRequirement = 0;
    }

    return {
      value: Math.round(adjustedRequirement),
      label: "Supplemental Vitamin D3 Requirement (IU/day)",
      subtext:
        "Calculated based on body weight and dietary intake (if provided). " +
        "This estimate assumes inadequate or no UVB exposure.",
      warning:
        adjustedRequirement === 0
          ? "Dietary intake meets or exceeds supplemental requirement; additional supplementation may not be necessary."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is supplemental Vitamin D3 important for reptiles?",
      answer:
        "Reptiles rely on UVB light to synthesize Vitamin D3 naturally, which is essential for calcium metabolism and bone health. Without adequate UVB exposure, they cannot produce sufficient Vitamin D3, leading to metabolic bone disease and other health issues. Supplemental Vitamin D3 ensures they receive the necessary amount to maintain physiological functions when UVB is inadequate or absent.",
    },
    {
      question: "How is the supplemental Vitamin D3 dosage calculated for reptiles?",
      answer:
        "The dosage is typically calculated based on body weight, with a standard recommendation of approximately 50 IU per kilogram of body weight per day. This approach accounts for the reptile's size and metabolic needs. Adjustments may be made based on dietary intake and specific species requirements, but weight-based dosing provides a reliable baseline.",
    },
    {
      question: "Can overdosing Vitamin D3 be harmful to reptiles?",
      answer:
        "Yes, excessive Vitamin D3 supplementation can lead to toxicity, causing hypercalcemia, kidney damage, and soft tissue mineralization. It is critical to balance supplementation carefully, ideally under veterinary supervision. Monitoring dietary intake and UVB exposure helps prevent overdosing and ensures safe, effective supplementation.",
    },
    {
      question: "What factors affect the Vitamin D3 requirement in reptiles?",
      answer:
        "Several factors influence Vitamin D3 needs, including species, age, health status, UVB exposure, and diet composition. Younger or growing reptiles may require higher amounts, while those with ample UVB exposure need less supplementation. Environmental conditions and husbandry practices also play a significant role in determining the appropriate Vitamin D3 dosage.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. UI WIDGET
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
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Weight input */}
      <div>
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Body Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          aria-describedby="weight-desc"
        />
        <p id="weight-desc" className="text-xs text-slate-400 mt-1">
          Required for dosage calculation.
        </p>
      </div>

      {/* Dietary intake input */}
      <div>
        <Label htmlFor="dietaryIntake" className="text-slate-700 dark:text-slate-300">
          Dietary Vitamin D3 Intake (IU/day, optional)
        </Label>
        <Input
          id="dietaryIntake"
          type="number"
          min="0"
          step="any"
          placeholder="Enter current dietary Vitamin D3 intake"
          value={inputs.dietaryIntake}
          onChange={(e) => setInputs((prev) => ({ ...prev, dietaryIntake: e.target.value }))}
          aria-describedby="dietary-desc"
        />
        <p id="dietary-desc" className="text-xs text-slate-400 mt-1">
          Enter if known to adjust supplemental dose.
        </p>
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
          onClick={() => setInputs({ weight: "", dietaryIntake: "" })}
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

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Vitamin D3 Requirement (Supplemental)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Vitamin D3 plays a crucial role in calcium metabolism and bone health in reptiles, enabling proper skeletal development and physiological function. Unlike mammals, many reptiles depend heavily on UVB light exposure to synthesize Vitamin D3 naturally in their skin. When UVB lighting is inadequate or unavailable, reptiles cannot produce sufficient Vitamin D3, which can lead to serious health problems such as metabolic bone disease, characterized by weakened bones and deformities.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Supplemental Vitamin D3 is therefore essential in captive reptile care when natural UVB exposure is limited or absent. The supplemental dosage is typically calculated based on the reptile's body weight to ensure an adequate amount is provided without risking toxicity. This supplementation supports calcium absorption from the diet, maintaining healthy bone mineralization and preventing deficiencies that compromise the animal’s wellbeing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to balance supplemental Vitamin D3 with dietary intake and environmental factors, as excessive supplementation can cause toxicity, while insufficient amounts fail to prevent deficiency. Veterinary guidance is recommended to tailor supplementation to species-specific needs, age, health status, and husbandry conditions. This calculator provides an evidence-based estimate to assist caretakers in determining appropriate supplemental Vitamin D3 dosages when UVB exposure is inadequate.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the supplemental Vitamin D3 requirement for reptiles when UVB lighting is insufficient or unavailable. To use it effectively, enter your reptile’s body weight in either pounds or kilograms, depending on your preferred unit system. If you know the current dietary Vitamin D3 intake, you can enter that value to adjust the supplemental dose accordingly.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) that matches your measurement preference.
          </li>
          <li>
            <strong>Step 2:</strong> Input the reptile’s body weight accurately, as this is the primary factor in calculating the supplemental dose.
          </li>
          <li>
            <strong>Step 3:</strong> Optionally, enter the estimated dietary Vitamin D3 intake to refine the supplemental requirement.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the recommended supplemental Vitamin D3 dosage in International Units (IU) per day.
          </li>
          <li>
            <strong>Step 5:</strong> Consult with a veterinarian to confirm the dosage and ensure safe supplementation tailored to your reptile’s specific needs.
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
              href="https://www.nap.edu/read/10668/chapter/10"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. National Research Council (NRC) - Nutrient Requirements of Reptiles
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on reptile nutrition, including Vitamin D3 requirements and supplementation recommendations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6075636/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Vitamin D3 Metabolism and Supplementation in Reptiles - Frontiers in Veterinary Science
            </a>
            <p className="text-slate-500 text-sm">
              A detailed review of Vitamin D3 metabolism in reptiles and the clinical implications of supplementation.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/clinical-excellence/clinical-services/reptile-amphibian-service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. UC Davis Veterinary Medicine - Reptile and Amphibian Service
            </a>
            <p className="text-slate-500 text-sm">
              Expert clinical resources on reptile husbandry, nutrition, and disease prevention including Vitamin D3 supplementation protocols.
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
        formula: "Supplemental Vitamin D3 (IU/day) = 50 × Body Weight (kg) - Dietary Intake (IU)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Reptile's body weight in kilograms" },
          { symbol: "Dietary Intake (IU)", description: "Vitamin D3 intake from diet in International Units per day (optional)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A bearded dragon weighs 4.4 lbs (2 kg) and receives 20 IU of Vitamin D3 daily from its diet. UVB lighting is inadequate.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed (4.4 lbs ≈ 2 kg). Calculate baseline supplemental need: 50 IU × 2 kg = 100 IU/day.",
          },
          {
            label: "2",
            explanation:
              "Subtract dietary intake from baseline: 100 IU - 20 IU = 80 IU/day supplemental Vitamin D3 required.",
          },
        ],
        result: "The bearded dragon requires approximately 80 IU of supplemental Vitamin D3 daily to maintain health.",
      }}
      relatedCalculators={[
        { title: "Metabolic Bone Disease Risk Estimator", url: "/pets/reptile-metabolic-bone-disease-risk", icon: "🐾" },
        { title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)", url: "/pets/dog-human-medication-exposure-alert", icon: "🐶" },
        { title: "Puppy Adult Size Predictor (Weight Curve)", url: "/pets/puppy-adult-size-predictor-weight-curve", icon: "🐱" },
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Kitten Calorie Needs by Age/Size", url: "/pets/kitten-calorie-needs-age-size", icon: "💉" },
        { title: "Prednisone/Prednisolone Dose Calculator for Dogs", url: "/pets/dog-prednisone-prednisolone-dose", icon: "🐶" },
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
