import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogCrateSizeFinderCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    length: "",
    height: "",
  });

  // 2. LOGIC ENGINE
  // Dog crate size is based on the dog's length and height.
  // Recommended crate length = Dog length + 6 inches (15 cm)
  // Recommended crate height = Dog height + 2 inches (5 cm)
  // We will output crate size in inches or cm depending on unit system.
  // If metric, inputs are in cm, output in cm; if imperial, inputs in inches, output in inches.

  const results = useMemo(() => {
    const lengthRaw = parseFloat(inputs.length);
    const heightRaw = parseFloat(inputs.height);

    if (!lengthRaw || lengthRaw <= 0 || !heightRaw || heightRaw <= 0) {
      return {
        value: 0,
        label: "Enter valid length and height...",
        subtext: null,
        warning: null,
      };
    }

    // Calculate crate dimensions
    // Add 6 inches (15 cm) to length, 2 inches (5 cm) to height for comfort
    const lengthAddition = unit === "imperial" ? 6 : 15;
    const heightAddition = unit === "imperial" ? 2 : 5;

    const crateLength = lengthRaw + lengthAddition;
    const crateHeight = heightRaw + heightAddition;

    // Provide a label with dimensions
    const label =
      unit === "imperial"
        ? `Recommended crate size: ${crateLength.toFixed(
            1
          )}" (L) x ${crateHeight.toFixed(1)}" (H)`
        : `Recommended crate size: ${crateLength.toFixed(
            1
          )} cm (L) x ${crateHeight.toFixed(1)} cm (H)`;

    // Warning if inputs are unusually small or large
    let warning = null;
    if (lengthRaw < 10 || heightRaw < 10) {
      warning =
        "The dimensions entered are very small. Please ensure you measured your dog correctly.";
    } else if (lengthRaw > 150 || heightRaw > 120) {
      warning =
        "The dimensions entered are very large. For very large dogs, custom crates may be required.";
    }

    return {
      value: 1,
      label,
      subtext:
        "This size ensures your dog can stand, turn around, and lie down comfortably.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is it important to add extra length and height to my dog's measurements?",
      answer:
        "Adding extra length and height to your dog's measurements when selecting a crate ensures that your dog has enough space to stand up, turn around, and lie down comfortably. Without this allowance, the crate may be too cramped, causing stress or discomfort. The additional 6 inches (15 cm) in length and 2 inches (5 cm) in height provide a buffer for movement and comfort, which is essential for your dog's well-being during crate time.",
    },
    {
      question: "How do I accurately measure my dog for the crate size?",
      answer:
        "To measure your dog accurately, have your dog stand naturally on a flat surface. Measure the length from the tip of the nose to the base of the tail (not including the tail). For height, measure from the floor to the top of the shoulders (withers). These measurements reflect the space your dog occupies and are critical for selecting a crate that fits well. Using a flexible tape measure or a rigid ruler can help ensure precision.",
    },
    {
      question: "Can I use this calculator for puppies or only adult dogs?",
      answer:
        "This calculator is primarily designed for adult dogs, as it uses their current length and height to estimate crate size. For puppies, it's advisable to consider their expected adult size, which varies by breed and growth rate. Selecting a crate that accommodates their future size can prevent the need for frequent replacements. Consulting your veterinarian about your puppy’s growth projections can help you choose an appropriately sized crate.",
    },
    {
      question: "What if my dog has an unusual body shape or mobility issues?",
      answer:
        "Dogs with unique body shapes, such as those with long backs or short legs, or those with mobility challenges, may require customized crate dimensions beyond standard recommendations. In such cases, it's important to prioritize comfort and accessibility, possibly consulting a veterinary professional or a pet equipment specialist. Adjustments to crate size or design, such as ramps or extra padding, can improve your dog's safety and comfort during crate time.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  const onInputChange = (field: "length" | "height") => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const onCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculation is reactive via useMemo, no extra action needed
  };

  const onReset = () => {
    setInputs({ length: "", height: "" });
  };

  const widget = (
    <form onSubmit={onCalculate} className="space-y-6">
      {/* Unit Switcher */}
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

        {/* Length Input */}
        <div>
          <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
            Dog Length ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="length"
            type="number"
            min="0"
            step="0.1"
            placeholder={`Enter your dog's length in ${unit === "imperial" ? "inches" : "cm"}`}
            value={inputs.length}
            onChange={onInputChange("length")}
            required
          />
          <p className="text-xs text-slate-500 mt-1">
            Measure from nose tip to base of tail.
          </p>
        </div>

        {/* Height Input */}
        <div>
          <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">
            Dog Height ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="height"
            type="number"
            min="0"
            step="0.1"
            placeholder={`Enter your dog's height in ${unit === "imperial" ? "inches" : "cm"}`}
            value={inputs.height}
            onChange={onInputChange("height")}
            required
          />
          <p className="text-xs text-slate-500 mt-1">
            Measure from floor to top of shoulders (withers).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
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
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2 font-medium">{results.subtext}</p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </form>
  );

  const editorial = (
    <div className="space-y-12">
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Crate Size Finder
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Selecting the appropriate crate size for your dog is essential for their comfort, safety, and well-being. A crate that is too small can cause stress, restrict movement, and lead to behavioral issues, while a crate that is too large may not provide the sense of security dogs often seek. This tool helps you determine the ideal crate dimensions based on your dog’s physical measurements, ensuring a perfect fit.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The key measurements used are the dog’s length (from nose to base of tail) and height (from floor to top of shoulders). These dimensions are augmented with additional space allowances to accommodate natural movements such as standing, turning around, and lying down comfortably. This approach aligns with veterinary recommendations for crate sizing, promoting a stress-free environment for your pet.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding these measurements and their importance helps pet owners make informed decisions when purchasing crates. It also aids in recognizing when a crate may no longer be suitable due to growth, weight changes, or health conditions. Proper crate sizing is a fundamental aspect of responsible pet care and contributes to your dog’s overall happiness and health.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this Dog Crate Size Finder, start by selecting your preferred unit system: Imperial (inches) or Metric (centimeters). Next, accurately measure your dog’s length and height using a tape measure or ruler. Enter these values into the respective fields. Once both measurements are input, click the “Calculate” button to receive your recommended crate dimensions.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Length:</strong> Measure from the tip of your dog’s nose to the base of the tail, excluding the tail itself. This measurement determines the crate’s length.
          </li>
          <li>
            <strong>Dog Height:</strong> Measure from the floor to the top of your dog’s shoulders (withers). This measurement determines the crate’s height.
          </li>
          <li>
            <strong>Review Results:</strong> The calculator will add standard allowances to these measurements to recommend a crate size that ensures comfort and mobility.
          </li>
          <li>
            <strong>Adjust and Confirm:</strong> If your dog has special needs or an unusual body shape, consider consulting a veterinarian for personalized advice.
          </li>
        </ul>
      </section>

      {/* SECTION 3: FAQ */}
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

      {/* SECTION 4: REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.avma.org/resources-tools/pet-owners/petcare/dog-crate-training"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Veterinary Medical Association (AVMA) - Dog Crate Training Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on crate training and sizing to promote canine welfare and safety.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/crate-training-your-dog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. VCA Hospitals - Crate Training Your Dog
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary advice on crate selection, sizing, and training techniques for dogs of all sizes.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.petmd.com/dog/care/evr_dg_crate_training"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. PetMD - Crate Training Basics for Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Expert insights into crate benefits, sizing recommendations, and behavioral considerations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aspca.org/pet-care/dog-care/dog-care-crate-training"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. ASPCA - Dog Crate Training Tips
            </a>
            <p className="text-slate-500 text-sm">
              Practical advice on crate use, sizing, and training to ensure a positive experience for your dog.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Crate Size Finder"
      description="Find the correct and comfortable crate size for your dog based on their standing height and length."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          'Crate Length = Dog Length + 6 inches (15 cm)\nCrate Height = Dog Height + 2 inches (5 cm)',
        variables: [
          { symbol: "Dog Length", description: "Measured from nose tip to base of tail" },
          { symbol: "Dog Height", description: "Measured from floor to top of shoulders (withers)" },
          { symbol: "Crate Length", description: "Recommended crate length for comfort" },
          { symbol: "Crate Height", description: "Recommended crate height for comfort" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A dog owner measures their medium-sized dog and finds the length to be 30 inches and height to be 22 inches.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Add 6 inches to the dog's length: 30 + 6 = 36 inches for crate length.",
          },
          {
            label: "Step 2",
            explanation:
              "Add 2 inches to the dog's height: 22 + 2 = 24 inches for crate height.",
          },
        ],
        result:
          "The recommended crate size is 36 inches (length) by 24 inches (height), ensuring the dog can stand, turn, and lie down comfortably.",
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
        { id: "what-is", label: "Understanding Dog Crate Size Finder" },
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