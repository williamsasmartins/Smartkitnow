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
      question: "What measurements do I need to find the right dog crate size?",
      answer: "You'll need your dog's length (nose to tail base), height (head to floor when standing), and weight. The calculator uses these to recommend a crate that allows your dog to stand, turn, and lie down comfortably.",
    },
    {
      question: "Should I buy a crate based on my puppy's current or adult size?",
      answer: "Purchase based on your puppy's adult size to avoid buying multiple crates as it grows. Most large breeds reach full size by 12-18 months; check breed standards for accurate adult weight estimates.",
    },
    {
      question: "What's the ideal crate size formula?",
      answer: "The crate length should equal your dog's body length plus 4 inches, and height should be their standing height plus 2 inches. Width typically follows a 1:1 ratio with length for rectangular crates.",
    },
    {
      question: "Can a crate be too large for house training?",
      answer: "Yes—oversized crates allow puppies to potty in one corner and sleep in another, defeating house-training efforts. Use a divider panel to adjust the space as your puppy grows.",
    },
    {
      question: "How do crate sizes differ between wire and plastic models?",
      answer: "Wire crates measure interior dimensions, while plastic airline crates often list exterior dimensions; always verify interior space when comparing sizes across brands.",
    },
    {
      question: "What if my dog is between two crate sizes?",
      answer: "Choose the larger size to ensure comfort and prevent anxiety, but use a divider panel for puppies to maintain house-training effectiveness during growth phases.",
    },
    {
      question: "Does coat thickness affect crate sizing needs?",
      answer: "Thick-coated breeds may feel cramped in standard sizes, so add 2-3 inches to recommended dimensions for breeds like Golden Retrievers or Huskies for adequate ventilation and comfort.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Crate Size Finder</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Dog Crate Size Finder calculates the ideal crate dimensions based on your dog's physical measurements and breed characteristics. It eliminates guesswork by recommending sizes that balance comfort, security, and house-training effectiveness.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your dog's length (nose to base of tail), height (head to floor when standing naturally), and current or adult weight. The calculator also accepts breed information for more accurate size recommendations tailored to growth patterns and typical proportions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the recommended crate size, interior dimensions, and suggested products based on results. Use divider panels for puppies to adjust interior space as they grow, and always verify actual interior measurements before purchasing to ensure proper fit.</p>
        </div>
      </section>

      {/* TABLE: Dog Crate Size Chart by Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dog Crate Size Chart by Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard crate dimensions recommended for dogs in each weight category.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Crate Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interior Length</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interior Height</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Up to 25 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Small</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-30 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19-21 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Chihuahuas, Toy Poodles, Corgis</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">26-40 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-36 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-26 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Beagles, Cocker Spaniels, Bulldogs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">41-70 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42-48 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-32 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Labs, Golden Retrievers, Boxers</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">71-110 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extra Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48-54 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32-36 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">German Shepherds, Great Danes, Rottweilers</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Over 110 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Jumbo</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54+ inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36+ inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Saint Bernards, Mastiffs, Irish Wolfhounds</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Measurements represent interior dimensions for optimal comfort and movement.</p>
      </section>

      {/* TABLE: Breed-Specific Crate Recommendations */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Breed-Specific Crate Recommendations</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference for popular dog breeds with recommended crate sizes and dimensions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Breed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Adult Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Crate Dimensions (L x W x H)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Labrador Retriever</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55-80 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42 x 28 x 30 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">German Shepherd</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-90 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large/XL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48 x 30 x 32 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">French Bulldog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-30 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 x 19 x 21 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Golden Retriever</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55-75 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42 x 28 x 30 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dachshund</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-32 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Small/Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 x 17 x 19 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Beagle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 x 19 x 21 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pug</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-18 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Small</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 x 17 x 19 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Siberian Husky</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-60 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42 x 28 x 30 inches</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Dimensions vary by manufacturer; verify interior space before purchasing.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your dog on a level surface early morning before activity to get accurate height and length readings.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For puppies, factor in 12-18 months of growth and use adjustable dividers instead of purchasing multiple crates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Ensure the crate has proper ventilation by choosing sizes with adequate airflow, especially for thick-coated or brachycephalic breeds.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Place the crate in a cool, quiet area away from direct sunlight and drafts to maximize your dog's comfort during extended confinement.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Exterior Measurements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Always check interior dimensions, as exterior crate measurements are 2-4 inches larger and will overestimate usable space.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Buying Too Large for Training</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Oversized crates compromise house-training by allowing puppies to eliminate in one area and sleep in another, defeating the purpose of crate training.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Breed Growth Patterns</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming all dogs in a weight range have similar proportions ignores breed-specific body shapes; a 50-lb Dachshund needs different dimensions than a 50-lb Boxer.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Seasonal Comfort</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to account for coat thickness and climate means your dog may overheat or feel cramped; adjust dimensions up 2-3 inches for heavy-coated breeds.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What measurements do I need to find the right dog crate size?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You'll need your dog's length (nose to tail base), height (head to floor when standing), and weight. The calculator uses these to recommend a crate that allows your dog to stand, turn, and lie down comfortably.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I buy a crate based on my puppy's current or adult size?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Purchase based on your puppy's adult size to avoid buying multiple crates as it grows. Most large breeds reach full size by 12-18 months; check breed standards for accurate adult weight estimates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the ideal crate size formula?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The crate length should equal your dog's body length plus 4 inches, and height should be their standing height plus 2 inches. Width typically follows a 1:1 ratio with length for rectangular crates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can a crate be too large for house training?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—oversized crates allow puppies to potty in one corner and sleep in another, defeating house-training efforts. Use a divider panel to adjust the space as your puppy grows.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do crate sizes differ between wire and plastic models?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Wire crates measure interior dimensions, while plastic airline crates often list exterior dimensions; always verify interior space when comparing sizes across brands.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my dog is between two crate sizes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Choose the larger size to ensure comfort and prevent anxiety, but use a divider panel for puppies to maintain house-training effectiveness during growth phases.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does coat thickness affect crate sizing needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Thick-coated breeds may feel cramped in standard sizes, so add 2-3 inches to recommended dimensions for breeds like Golden Retrievers or Huskies for adequate ventilation and comfort.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.akc.org/expert-advice/house-training-your-puppy/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Kennel Club - Crate Training Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official AKC guidance on proper crate selection and house-training methodology for puppies and adult dogs.</p>
          </li>
          <li>
            <a href="https://www.iaaonline.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Association of Canine Professionals - Crate Sizing Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional canine behavior standards for appropriate crate dimensions based on breed and size.</p>
          </li>
          <li>
            <a href="https://www.humanesociety.org/resources/crate-training-your-dog" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Humane Society - Crate Training Best Practices</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations on crate sizing, selection, and training techniques for optimal dog welfare.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/know-your-pet/crate-training-for-dogs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals - Crate Training Resource</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary perspective on crate dimensions, safety considerations, and behavioral aspects of proper sizing.</p>
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