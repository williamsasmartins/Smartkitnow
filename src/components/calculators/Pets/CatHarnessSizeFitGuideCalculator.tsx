import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatHarnessSizeFitGuideCalculator() {
  // 1. STATE
  // Unit system for length measurement: imperial (inches) or metric (cm)
  const [unit, setUnit] = useState("imperial");

  // Inputs: Neck circumference and Chest circumference (girth)
  const [inputs, setInputs] = useState({
    neck: "",
    chest: "",
  });

  // 2. LOGIC ENGINE
  // Logic: Determine harness size category based on neck and chest circumference.
  // Typical harness sizes for cats:
  // Small: Neck 8-10 in (20-25 cm), Chest 12-14 in (30-36 cm)
  // Medium: Neck 10-12 in (25-30 cm), Chest 14-16 in (36-41 cm)
  // Large: Neck 12-14 in (30-36 cm), Chest 16-18 in (41-46 cm)
  // If measurements fall outside these ranges, recommend custom or consult vet.

  const results = useMemo(() => {
    const neckRaw = parseFloat(inputs.neck);
    const chestRaw = parseFloat(inputs.chest);
    if (isNaN(neckRaw) || isNaN(chestRaw) || neckRaw <= 0 || chestRaw <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert to inches if metric
    const neckIn = unit === "metric" ? neckRaw / 2.54 : neckRaw;
    const chestIn = unit === "metric" ? chestRaw / 2.54 : chestRaw;

    let size = "";
    let warning = null;

    if (neckIn >= 8 && neckIn <= 10 && chestIn >= 12 && chestIn <= 14) {
      size = "Small";
    } else if (neckIn > 10 && neckIn <= 12 && chestIn > 14 && chestIn <= 16) {
      size = "Medium";
    } else if (neckIn > 12 && neckIn <= 14 && chestIn > 16 && chestIn <= 18) {
      size = "Large";
    } else {
      size = "Custom or Consult Vet";
      warning =
        "Your cat's measurements fall outside standard harness sizes. Please consult your veterinarian or a pet specialist for a custom fit to ensure safety and comfort.";
    }

    return {
      value: size,
      label: "Recommended Harness Size",
      subtext:
        "Based on your cat's neck and chest circumference measurements.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to measure both neck and chest for a cat harness?",
      answer:
        "Measuring both the neck and chest circumference ensures the harness fits securely without causing discomfort or restricting movement. The neck measurement prevents the harness from slipping off, while the chest measurement ensures it is snug but not too tight around the ribcage. Proper fit reduces the risk of injury and increases your cat's comfort during walks or outdoor time.",
    },
    {
      question: "How can I accurately measure my cat for a harness at home?",
      answer:
        "Use a flexible measuring tape to measure your cat’s neck just above the shoulders where the collar would naturally sit, and the chest at the widest part behind the front legs. It helps to have someone gently hold the cat to keep it calm and still. Always measure snugly but not tightly, allowing space for two fingers between the tape and your cat’s body for comfort.",
    },
    {
      question: "What are the risks of using an ill-fitting harness on my cat?",
      answer:
        "An ill-fitting harness can cause chafing, restrict breathing, or allow your cat to escape, which may lead to injury or stress. Too tight a harness can cause discomfort and skin irritation, while too loose a harness may slip off or catch on objects. Ensuring a proper fit is essential for your cat’s safety and to build their confidence during outdoor activities.",
    },
    {
      question: "When should I consider a custom harness for my cat?",
      answer:
        "If your cat’s measurements fall outside standard size ranges or if your cat has unique body shapes or medical conditions, a custom harness is advisable. Custom harnesses provide tailored comfort and security, reducing the risk of pressure sores or escape. Consulting with a veterinarian or pet fitting specialist can guide you to the best option for your cat’s specific needs.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
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
              <SelectItem value="imperial">Imperial (inches)</SelectItem>
              <SelectItem value="metric">Metric (cm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="neck" className="text-slate-700 dark:text-slate-300">
            Neck Circumference ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="neck"
            type="number"
            min="0"
            step="0.1"
            placeholder={`e.g. ${unit === "imperial" ? "9" : "23"}`}
            value={inputs.neck}
            onChange={(e) => setInputs((prev) => ({ ...prev, neck: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="chest" className="text-slate-700 dark:text-slate-300">
            Chest Circumference ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="chest"
            type="number"
            min="0"
            step="0.1"
            placeholder={`e.g. ${unit === "imperial" ? "13" : "33"}`}
            value={inputs.chest}
            onChange={(e) => setInputs((prev) => ({ ...prev, chest: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ neck: "", chest: "" })}
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Cat Harness Size & Fit Guide
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Selecting the correct harness size and fit for your cat is crucial for their safety, comfort, and overall well-being during outdoor activities. Unlike dogs, cats have more delicate and flexible bodies, so a harness must be snug enough to prevent escape but loose enough to avoid restricting movement or causing discomfort. Proper sizing involves measuring both the neck circumference and the chest girth, as these dimensions determine how the harness will sit and function on your cat’s body.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Harnesses come in various sizes, typically categorized as small, medium, and large, but these can vary between manufacturers. It is important to use precise measurements rather than relying solely on weight or breed, as cats of the same weight may have different body shapes. Additionally, an ill-fitting harness can lead to chafing, skin irritation, or even injury if the cat tries to escape or if the harness restricts breathing or movement.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This guide and calculator help you determine the best harness size based on your cat’s neck and chest measurements. By following the recommended sizing, you can ensure your cat enjoys safe and comfortable outdoor experiences, reducing stress for both you and your feline companion. Always remember to monitor your cat’s behavior and comfort when introducing a new harness and adjust as necessary.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you identify the appropriate harness size for your cat by using two key measurements: neck circumference and chest circumference. Begin by selecting your preferred unit system, either imperial (inches) or metric (centimeters), to match your measuring tape. Enter the measurements carefully, ensuring accuracy for the best results.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your cat’s neck circumference just above the shoulders where a collar would naturally rest.
          </li>
          <li>
            <strong>Step 2:</strong> Measure the chest circumference at the widest part behind the front legs.
          </li>
          <li>
            <strong>Step 3:</strong> Input these measurements into the calculator fields and click “Calculate” to see the recommended harness size.
          </li>
          <li>
            <strong>Step 4:</strong> If your cat’s measurements fall outside the standard size ranges, consider a custom harness or consult your veterinarian for advice.
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
              href="https://www.avma.org/resources-tools/pet-owners/petcare/cat-harness-safety"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Veterinary Medical Association (AVMA) - Cat Harness Safety
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on selecting and fitting cat harnesses to ensure safety and comfort during outdoor activities.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/cat-harnesses-and-leashes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. VCA Hospitals - Cat Harnesses and Leashes
            </a>
            <p className="text-slate-500 text-sm">
              Expert advice on harness types, fitting techniques, and the importance of proper sizing for feline health and safety.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.petmd.com/cat/care/evr_ct_harnesses_for_cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. PetMD - Harnesses for Cats: What You Need to Know
            </a>
            <p className="text-slate-500 text-sm">
              Detailed overview of harness benefits, fitting tips, and how to introduce your cat to harness training safely.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Harness Size & Fit Guide"
      description="Guide to measure and select the correct harness size and fit for walking or outdoor time."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Recommended Size = f(Neck Circumference, Chest Circumference)",
        variables: [
          { symbol: "Neck Circumference", description: "Measured just above the shoulders" },
          { symbol: "Chest Circumference", description: "Measured at the widest part behind front legs" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A cat owner measures their cat’s neck at 9 inches and chest at 13 inches using imperial units. They want to find the correct harness size for safe outdoor walks.",
        steps: [
          { label: "1", explanation: "Input neck measurement: 9 inches" },
          { label: "2", explanation: "Input chest measurement: 13 inches" },
          { label: "3", explanation: "Calculate to determine size category" },
        ],
        result: "Recommended Harness Size: Small",
      }}
      relatedCalculators={[
        { title: "Aquarium Salt Dosage Calculator (Therapeutic)", url: "/pets/aquarium-salt-dosage-therapeutic", icon: "🐾" },
        { title: "Vitamin A Requirement Calculator", url: "/pets/bird-vitamin-a-requirement", icon: "🐶" },
        { title: "Hand-Feeding Formula Amount (Chicks)", url: "/pets/bird-hand-feeding-formula-amount-chicks", icon: "🐱" },
        { title: "Vitamin D3 Requirement (Supplemental)", url: "/pets/reptile-vitamin-d3-requirement", icon: "🍖" },
        { title: "Horse Selenium Toxicity Threshold (ppm)", url: "/pets/horse-selenium-toxicity-threshold", icon: "🐎" },
        { title: "Omega-3 Supplement Planner (EPA/DHA per kg)", url: "/pets/horse-omega-3-supplement-planner", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Harness Size & Fit Guide" },
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