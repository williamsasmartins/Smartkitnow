import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatCarrierSizeFitGuideCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: Cat length (nose to base of tail), height (floor to top of head), and weight
  const [inputs, setInputs] = useState({
    length: "",
    height: "",
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Logic: Recommend carrier internal dimensions based on cat size + clearance
  // Clearance: Add 2-3 inches (5-7.5 cm) to length and height for comfort
  // Weight used to suggest sturdiness category (light, medium, heavy)
  // Convert inputs to metric internally for consistent calculation
  const results = useMemo(() => {
    const lengthRaw = parseFloat(inputs.length);
    const heightRaw = parseFloat(inputs.height);
    const weightRaw = parseFloat(inputs.weight);

    if (
      isNaN(lengthRaw) ||
      isNaN(heightRaw) ||
      isNaN(weightRaw) ||
      lengthRaw <= 0 ||
      heightRaw <= 0 ||
      weightRaw <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert to cm and kg if imperial
    const lengthCm = unit === "imperial" ? lengthRaw * 2.54 : lengthRaw;
    const heightCm = unit === "imperial" ? heightRaw * 2.54 : heightRaw;
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Recommended carrier internal dimensions (cm)
    // Add 7.5 cm (~3 inches) length clearance, 7.5 cm height clearance
    const recLength = Math.ceil(lengthCm + 7.5);
    const recHeight = Math.ceil(heightCm + 7.5);

    // Width: Approximate as 2/3 length (cats are slender)
    const recWidth = Math.ceil(recLength * 0.66);

    // Convert back to user's unit system for display
    const recLengthDisplay = unit === "imperial" ? (recLength / 2.54).toFixed(1) : recLength.toFixed(1);
    const recWidthDisplay = unit === "imperial" ? (recWidth / 2.54).toFixed(1) : recWidth.toFixed(1);
    const recHeightDisplay = unit === "imperial" ? (recHeight / 2.54).toFixed(1) : recHeight.toFixed(1);

    // Sturdiness recommendation based on weight
    let sturdiness = "";
    let warning = null;
    if (weightKg < 3) {
      sturdiness = "Lightweight carrier recommended";
    } else if (weightKg < 6) {
      sturdiness = "Medium-duty carrier recommended";
    } else {
      sturdiness = "Heavy-duty carrier recommended for larger cats";
      warning = "Ensure carrier has reinforced handles and secure locking mechanisms for safety.";
    }

    return {
      value: `${recLengthDisplay} × ${recWidthDisplay} × ${recHeightDisplay} ${unit === "imperial" ? "inches" : "cm"}`,
      label: "Recommended Carrier Internal Dimensions (L × W × H)",
      subtext: sturdiness,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to have extra space inside the cat carrier?",
      answer:
        "Cats need enough room inside their carrier to turn around, lie down comfortably, and sit upright without feeling cramped. Adequate space reduces stress and anxiety during travel, which is crucial for their well-being. A carrier that is too small can cause discomfort and increase the risk of injury if the cat struggles or panics.",
    },
    {
      question: "How does my cat’s weight affect the choice of carrier?",
      answer:
        "Weight influences the sturdiness and durability requirements of a carrier. Heavier cats require carriers with reinforced materials, stronger handles, and secure locking mechanisms to ensure safety during transport. Choosing a carrier rated for your cat’s weight prevents accidents and provides peace of mind during travel.",
    },
    {
      question: "Can I use a carrier that fits my cat’s size exactly without extra clearance?",
      answer:
        "It is not advisable to use a carrier that fits your cat’s exact size because cats need additional space to move comfortably and reduce stress. Extra clearance allows for natural movements and prevents the cat from feeling confined or trapped. This space also accommodates bedding or padding, enhancing comfort and safety.",
    },
    {
      question: "How do I measure my cat accurately for selecting a carrier?",
      answer:
        "To measure your cat, use a soft measuring tape to find the length from the tip of the nose to the base of the tail, and the height from the floor to the top of the head when the cat is standing naturally. Weigh your cat on a reliable scale to determine the appropriate sturdiness of the carrier. Accurate measurements ensure you select a carrier that fits well and keeps your cat safe.",
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
              <SelectItem value="imperial">Imperial (inches, lbs)</SelectItem>
              <SelectItem value="metric">Metric (cm, kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
            Cat Length (nose to base of tail) [{unit === "imperial" ? "inches" : "cm"}]
          </Label>
          <Input
            id="length"
            type="number"
            min={0}
            step="0.1"
            value={inputs.length}
            onChange={(e) => setInputs((prev) => ({ ...prev, length: e.target.value }))}
            placeholder={`e.g. ${unit === "imperial" ? "18" : "45"}`}
          />
        </div>
        <div>
          <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">
            Cat Height (floor to top of head) [{unit === "imperial" ? "inches" : "cm"}]
          </Label>
          <Input
            id="height"
            type="number"
            min={0}
            step="0.1"
            value={inputs.height}
            onChange={(e) => setInputs((prev) => ({ ...prev, height: e.target.value }))}
            placeholder={`e.g. ${unit === "imperial" ? "10" : "25"}`}
          />
        </div>
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat Weight [{unit === "imperial" ? "lbs" : "kg"}]
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="0.1"
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
            placeholder={`e.g. ${unit === "imperial" ? "12" : "5.5"}`}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here, calculation is memoized)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ length: "", height: "", weight: "" })}
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
          Understanding Cat Carrier Size & Fit Guide
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Selecting the appropriate size and fit for a cat carrier is essential to ensure your feline companion's comfort and safety during travel. Cats are naturally sensitive to confined spaces, and a carrier that is too small can cause stress, anxiety, and even physical harm. This guide helps pet owners understand how to measure their cat accurately and interpret those measurements to find a carrier that provides enough room for movement without being excessively large.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The ideal carrier should allow your cat to stand upright, turn around, and lie down comfortably. This means adding clearance to your cat’s natural body dimensions to accommodate movement and padding. Additionally, the carrier’s sturdiness must correspond to your cat’s weight to prevent accidents during transport. Choosing the right carrier size and fit not only promotes physical comfort but also reduces behavioral stress, making trips to the vet or travel more manageable for both cat and owner.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This guide integrates veterinary insights and practical measurement techniques to empower cat owners with the knowledge needed to select the best carrier. By understanding the relationship between your cat’s size, weight, and carrier dimensions, you can make informed decisions that prioritize your pet’s well-being. Proper fit and sizing are foundational to safe and stress-free travel experiences for cats of all breeds and sizes.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you determine the recommended internal dimensions for a cat carrier based on your cat’s body measurements and weight. By entering your cat’s length, height, and weight in your preferred unit system, the tool calculates the ideal carrier size with appropriate clearance for comfort and safety. It also provides guidance on the sturdiness level needed to support your cat’s weight during transport.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your cat’s length from the tip of the nose to the base of the tail using a soft tape measure while your cat is relaxed and standing naturally.
          </li>
          <li>
            <strong>Step 2:</strong> Measure your cat’s height from the floor to the top of the head in a similar relaxed standing position.
          </li>
          <li>
            <strong>Step 3:</strong> Weigh your cat using a reliable scale to determine the appropriate sturdiness category for the carrier.
          </li>
          <li>
            <strong>Step 4:</strong> Enter these measurements into the calculator, select your preferred unit system, and click “Calculate” to receive your recommended carrier dimensions and sturdiness advice.
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
              href="https://www.avma.org/resources-tools/pet-owners/petcare/cat-carriers-and-travel-safety"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Veterinary Medical Association (AVMA) - Cat Carriers and Travel Safety
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on selecting safe and comfortable carriers for cats during travel, emphasizing size, fit, and material considerations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/cat-carrier-safety-tips"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. VCA Hospitals - Cat Carrier Safety Tips
            </a>
            <p className="text-slate-500 text-sm">
              Expert advice on measuring your cat and choosing the right carrier to minimize stress and ensure safety during veterinary visits and travel.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.petmd.com/cat/general-health/how-choose-best-cat-carrier"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. PetMD - How to Choose the Best Cat Carrier
            </a>
            <p className="text-slate-500 text-sm">
              Detailed explanation of carrier types, sizing, and features that promote comfort and security for cats in transit.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Carrier Size & Fit Guide"
      description="Guide to select the proper carrier size for your cat, ensuring comfort and safety during travel."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Recommended Carrier Size = Cat Length + Clearance × Width ≈ 2/3 Length × Height + Clearance",
        variables: [
          { symbol: "Cat Length", description: "Length from nose to base of tail" },
          { symbol: "Clearance", description: "Additional space for comfort (approx. 3 inches or 7.5 cm)" },
          { symbol: "Width", description: "Approximately two-thirds of carrier length" },
          { symbol: "Height", description: "Cat height from floor to top of head plus clearance" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A cat measures 18 inches in length, 10 inches in height, and weighs 12 lbs. The owner wants to find the ideal carrier size and sturdiness.",
        steps: [
          {
            label: "1",
            explanation:
              "Add 3 inches clearance to length and height: 18 + 3 = 21 inches length, 10 + 3 = 13 inches height.",
          },
          {
            label: "2",
            explanation:
              "Calculate width as two-thirds of length: 21 × 0.66 ≈ 14 inches width.",
          },
          {
            label: "3",
            explanation:
              "Select a carrier with internal dimensions approximately 21 × 14 × 13 inches and medium-duty sturdiness for 12 lbs weight.",
          },
        ],
        result: "Recommended carrier size: 21 × 14 × 13 inches (L × W × H), medium-duty carrier.",
      }}
      relatedCalculators={[
        { title: "Hand-Feeding Formula Amount (Chicks)", url: "/pets/bird-hand-feeding-formula-amount-chicks", icon: "🐾" },
        { title: "Meloxicam Dose Calculator for Cats", url: "/pets/cat-meloxicam-dose", icon: "🐱" },
        { title: "Whelping Countdown & Stage Timeline", url: "/pets/dog-whelping-countdown-stage-timeline", icon: "🐱" },
        { title: "Senior Cat Nutrition & Calorie Adjuster", url: "/pets/senior-cat-nutrition-calorie-adjuster", icon: "🐱" },
        { title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator", url: "/pets/dog-onion-garlic-exposure-risk", icon: "🐶" },
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Carrier Size & Fit Guide" },
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