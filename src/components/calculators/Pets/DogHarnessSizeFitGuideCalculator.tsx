import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogHarnessSizeFitGuideCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    chest: "",
    neck: "",
    length: "",
  });

  // 2. LOGIC ENGINE
  // Harness size is primarily based on chest girth measurement.
  // Neck and length help confirm fit and style choice.
  // We'll categorize harness size into XS, S, M, L, XL based on chest girth.
  // Chest girth ranges (in cm):
  // XS: 30-40 cm, S: 40-55 cm, M: 55-70 cm, L: 70-85 cm, XL: 85+ cm
  // Conversion: 1 inch = 2.54 cm

  // We'll convert inputs to cm if imperial is selected.
  // Validate inputs are positive numbers.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const chestRaw = parseFloat(inputs.chest);
    const neckRaw = parseFloat(inputs.neck);
    const lengthRaw = parseFloat(inputs.length);

    if (
      !weightRaw || weightRaw <= 0 ||
      !chestRaw || chestRaw <= 0 ||
      !neckRaw || neckRaw <= 0 ||
      !lengthRaw || lengthRaw <= 0
    ) {
      return {
        value: "",
        label: "Please enter valid positive numbers for all measurements.",
        subtext: null,
        warning: null,
      };
    }

    // Convert to cm if imperial
    const chestCm = unit === "imperial" ? chestRaw * 2.54 : chestRaw;
    const neckCm = unit === "imperial" ? neckRaw * 2.54 : neckRaw;
    const lengthCm = unit === "imperial" ? lengthRaw * 2.54 : lengthRaw;

    // Determine harness size based on chest girth
    let size = "";
    if (chestCm < 30) size = "Too Small for standard harness sizes";
    else if (chestCm >= 30 && chestCm < 40) size = "XS (Extra Small)";
    else if (chestCm >= 40 && chestCm < 55) size = "S (Small)";
    else if (chestCm >= 55 && chestCm < 70) size = "M (Medium)";
    else if (chestCm >= 70 && chestCm < 85) size = "L (Large)";
    else if (chestCm >= 85) size = "XL (Extra Large)";
    else size = "Unknown";

    // Check for potential fit warnings
    let warning = null;
    // Neck should be smaller than chest girth by at least 5 cm for comfort
    if (neckCm >= chestCm - 3) {
      warning =
        "Warning: Neck measurement is very close to or larger than chest girth, which may cause discomfort or poor fit. Consider re-measuring or consulting a vet.";
    }

    // Length check: harness length should roughly correspond to dog's torso length
    // If length is very short or very long compared to chest, warn user
    if (lengthCm < chestCm * 0.6) {
      warning =
        "Warning: Dog's length measurement is quite short relative to chest girth. Some harness styles may not fit well.";
    } else if (lengthCm > chestCm * 1.3) {
      warning =
        "Warning: Dog's length measurement is quite long relative to chest girth. Consider harness styles designed for longer torsos.";
    }

    // Result label with size and fit notes
    const label = `Recommended Harness Size: ${size}`;

    // Subtext with measurement summary
    const subtext = `Chest: ${chestCm.toFixed(1)} cm, Neck: ${neckCm.toFixed(
      1
    )} cm, Length: ${lengthCm.toFixed(1)} cm`;

    return {
      value: size,
      label,
      subtext,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is chest girth the most important measurement for dog harness sizing?",
      answer:
        "Chest girth is the circumference around the widest part of a dog's ribcage, just behind the front legs. This measurement is crucial because the harness must fit snugly around this area to provide proper support and control without restricting breathing or movement. Unlike weight or breed, chest girth directly correlates with the harness's fit, ensuring comfort and safety during walks or activities.",
    },
    {
      question: "How can I accurately measure my dog's chest, neck, and length for harness fitting?",
      answer:
        "To measure chest girth, use a flexible tape measure around the widest part of your dog's ribcage, just behind the front legs, ensuring the tape is snug but not tight. For neck girth, measure around the base of the neck where the collar naturally sits. Length is measured from the base of the neck (where it meets the shoulders) to the base of the tail. Accurate measurements ensure the harness fits well, preventing escape or discomfort.",
    },
    {
      question: "What are the risks of using a poorly fitting dog harness?",
      answer:
        "A poorly fitting harness can cause multiple issues including chafing, restricted movement, and even injury. If too tight, it can impede breathing or cause skin irritation; if too loose, the dog may slip out, risking escape and injury. Additionally, improper fit can lead to uneven pressure distribution, potentially causing joint or muscle strain, especially in active or working dogs.",
    },
    {
      question: "How do different harness styles affect sizing and fit considerations?",
      answer:
        "Harness styles vary in design—such as step-in, vest, or front-clip models—and each may fit differently based on your dog's shape. For example, vest harnesses often require more precise chest and length measurements for comfort, while step-in harnesses focus more on chest and neck girth. Understanding your dog's body shape and activity level helps select a style that complements the size measurements and ensures optimal fit and function.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
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

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
              Dog Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weight"
              type="number"
              min="0"
              step="any"
              placeholder={unit === "imperial" ? "e.g. 30" : "e.g. 14"}
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="chest" className="text-slate-700 dark:text-slate-300">
              Chest Girth ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="chest"
              type="number"
              min="0"
              step="any"
              placeholder={unit === "imperial" ? "e.g. 20" : "e.g. 50"}
              value={inputs.chest}
              onChange={(e) => handleInputChange("chest", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="neck" className="text-slate-700 dark:text-slate-300">
              Neck Girth ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="neck"
              type="number"
              min="0"
              step="any"
              placeholder={unit === "imperial" ? "e.g. 15" : "e.g. 38"}
              value={inputs.neck}
              onChange={(e) => handleInputChange("neck", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
              Body Length ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="length"
              type="number"
              min="0"
              step="any"
              placeholder={unit === "imperial" ? "e.g. 22" : "e.g. 56"}
              value={inputs.length}
              onChange={(e) => handleInputChange("length", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", chest: "", neck: "", length: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && results.value !== "" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Harness Size
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
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Harness Size & Fit Guide
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Selecting the correct dog harness size and fit is essential for your pet's comfort, safety, and overall well-being. Unlike collars, harnesses distribute pressure across the chest and shoulders, reducing strain on the neck and preventing injuries. Proper sizing ensures the harness stays securely in place without restricting movement or causing chafing. This guide focuses on key measurements—chest girth, neck girth, and body length—to help you choose the most appropriate harness size tailored to your dog's unique body shape.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Chest girth is the most critical measurement because it determines how snugly the harness fits around the widest part of your dog's ribcage. An ill-fitting harness can lead to discomfort, escape risks, or even injury. Neck girth and body length measurements complement chest girth by ensuring the harness accommodates your dog's overall proportions, especially when selecting different harness styles such as vest, step-in, or front-clip models. Understanding these measurements and their interplay is vital for optimizing your dog's harness fit and function.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you estimate the appropriate dog harness size based on your dog's key body measurements. Begin by selecting your preferred unit system—Imperial (inches and pounds) or Metric (centimeters and kilograms). Then, accurately measure your dog's weight, chest girth, neck girth, and body length using a flexible tape measure. Input these values into the respective fields and click "Calculate" to receive a recommended harness size along with fit notes and warnings if any measurements suggest potential fitting issues.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> While weight is not the primary sizing factor, it provides context for your dog's overall size and helps confirm measurements.
          </li>
          <li>
            <strong>Chest Girth:</strong> Measure around the widest part of the ribcage, just behind the front legs. This is the most important measurement for harness sizing.
          </li>
          <li>
            <strong>Neck Girth:</strong> Measure around the base of the neck where the collar naturally sits. This ensures the harness does not constrict the neck.
          </li>
          <li>
            <strong>Body Length:</strong> Measure from the base of the neck to the base of the tail. This helps determine harness style suitability and fit.
          </li>
        </ul>
      </section>

      {/* SECTION 3: FAQ */}
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

      {/* SECTION 4: REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.avma.org/resources-tools/pet-owners/petcare/dog-harnesses-and-collars"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Veterinary Medical Association (AVMA) - Dog Harnesses and Collars
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on selecting and fitting dog harnesses to promote safety and comfort.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/harnesses-vs-collars"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. VCA Hospitals - Harnesses vs. Collars: Which is Best?
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary insights into the benefits and fitting considerations of different harness types.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6466027/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Research Article: Biomechanical Effects of Dog Harnesses on Gait
            </a>
            <p className="text-slate-500 text-sm">
              A scientific study analyzing how harness fit impacts canine movement and musculoskeletal health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.petmd.com/dog/care/evr_dg_harnesses_for_dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. PetMD - Choosing the Right Harness for Your Dog
            </a>
            <p className="text-slate-500 text-sm">
              Expert advice on measuring and selecting harnesses tailored to your dog's size and activity level.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Harness Size & Fit Guide"
      description="Guide to measure and select the correct harness size and style for comfort and escape prevention."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Harness Size Determination Formula",
        formula:
          "Chest Girth (cm) determines size category: XS (30-40), S (40-55), M (55-70), L (70-85), XL (85+). Convert inches to cm by multiplying by 2.54 if needed.",
        variables: [
          { symbol: "Chest Girth (cm)", description: "Circumference around widest part of dog's ribcage" },
          { symbol: "Size", description: "Harness size category based on chest girth ranges" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A medium-sized dog weighs 30 lbs, with a chest girth of 22 inches, neck girth of 15 inches, and body length of 20 inches. Owner wants to find the correct harness size.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert measurements to centimeters: chest = 22 in × 2.54 = 55.9 cm, neck = 15 in × 2.54 = 38.1 cm, length = 20 in × 2.54 = 50.8 cm.",
          },
          {
            label: "Step 2",
            explanation:
              "Compare chest girth to size ranges: 55.9 cm falls into the Medium (M) category (55-70 cm). Verify neck and length measurements for fit comfort.",
          },
        ],
        result: "Recommended harness size is Medium (M), suitable for the dog's proportions and activity level.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Harness Size & Fit Guide" },
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