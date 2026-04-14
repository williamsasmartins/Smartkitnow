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
      question: "How do I measure my dog's chest for a harness?",
      answer: "Measure around the widest part of your dog's chest using a soft measuring tape, keeping it snug but not tight. Add 1-2 inches to ensure comfort and proper fit.",
    },
    {
      question: "What's the difference between harness sizes XS, S, M, L, and XL?",
      answer: "XS fits dogs 5-15 lbs, S fits 15-30 lbs, M fits 30-50 lbs, L fits 50-80 lbs, and XL fits 80+ lbs, though measurements vary by brand.",
    },
    {
      question: "Can a harness be too loose or too tight?",
      answer: "A loose harness reduces control and escape risk, while a tight harness restricts breathing and causes discomfort; aim for 1-2 finger spacing between harness and skin.",
    },
    {
      question: "Should I measure my dog's length for harness sizing?",
      answer: "Yes, measure from the base of the neck to the tail base to ensure adequate coverage and proper weight distribution across the harness.",
    },
    {
      question: "How often should I re-measure my growing puppy?",
      answer: "Re-measure your puppy every 4-6 weeks during growth phases (typically 3-12 months) to ensure the harness remains properly fitted.",
    },
    {
      question: "Do different harness styles require different measurements?",
      answer: "Yes; front-clip harnesses need snug chest measurements, back-clip harnesses require length accuracy, and no-pull harnesses need both chest and neck dimensions.",
    },
    {
      question: "What happens if my dog is between two harness sizes?",
      answer: "Choose the larger size if your dog falls between sizes, then adjust straps for a snug fit; oversizing is safer than undersizing.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Harness Size & Fit Guide</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine the correct harness size and fit for your dog by analyzing key body measurements. It ensures proper weight distribution, comfort, and control during walks and activities.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's weight, chest measurement, length, and neck size into the calculator. The tool also considers your dog's breed and age to refine recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the recommended harness size and fit adjustments provided in your results. Use the fit checklist to verify proper spacing and support before purchasing or adjusting your current harness.</p>
        </div>
      </section>

      {/* TABLE: Dog Harness Size Chart by Weight & Breed */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dog Harness Size Chart by Weight & Breed</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this chart to match your dog's weight and common breeds to the appropriate harness size.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Harness Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Breeds</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Chest Measurement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">XS</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-15 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Chihuahua, Pomeranian, Toy Poodle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-16 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">S</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-30 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Beagle, Cocker Spaniel, Schnauzer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-22 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">M</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-50 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Springer Spaniel, Brittany, Boxer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22-28 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-80 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Labrador, Golden Retriever, German Shepherd</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-36 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">XL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80+ lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Great Dane, Saint Bernard, Mastiff</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36-45 inches</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Measurements are approximate and may vary by harness brand; always verify with manufacturer specifications.</p>
      </section>

      {/* TABLE: Harness Fit Checklist by Measurement Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Harness Fit Checklist by Measurement Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Verify your dog's harness fit using these key measurements and adjustment guidelines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Measurement</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ideal Fit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Too Tight Signs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Too Loose Signs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chest Girth</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 fingers spacing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Labored breathing, redness</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slip-over potential, no control</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Neck Opening</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Thumb width clearance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Gagging, hair loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Harness slides backward</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Shoulder Straps</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No binding</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Restricted movement, chafing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Uneven weight distribution</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Back Panel Length</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Covers midback</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Spine pressure, discomfort</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Haunches unsupported</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Recheck fit monthly during growth phases and adjust straps as needed for safety and comfort.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always measure your dog while standing in a natural position; avoid measuring while sitting or stretching, as this skews results.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check harness fit weekly for puppies and monthly for adult dogs, as even slight changes affect comfort and safety.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use soft measuring tapes or fabric rulers to get accurate measurements without discomfort to your dog.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When in doubt between sizes, order two sizes and return the incorrect one to ensure the best fit for your dog's body shape.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring Over Thick Fur</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Always measure directly on skin or under thin coat layers, as thick fur inflates measurements by 1-3 inches.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Neck Measurement</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Neglecting neck size can result in harnesses that slip over the head or cause choking; always measure neck circumference.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming All Brands Fit Identically</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Harness sizing varies significantly by manufacturer; always cross-reference calculator results with brand-specific fit guides.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping the Two-Finger Test</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to check spacing between harness and skin risks either restricting breathing or allowing escape.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure my dog's chest for a harness?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure around the widest part of your dog's chest using a soft measuring tape, keeping it snug but not tight. Add 1-2 inches to ensure comfort and proper fit.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between harness sizes XS, S, M, L, and XL?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">XS fits dogs 5-15 lbs, S fits 15-30 lbs, M fits 30-50 lbs, L fits 50-80 lbs, and XL fits 80+ lbs, though measurements vary by brand.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can a harness be too loose or too tight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A loose harness reduces control and escape risk, while a tight harness restricts breathing and causes discomfort; aim for 1-2 finger spacing between harness and skin.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I measure my dog's length for harness sizing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, measure from the base of the neck to the tail base to ensure adequate coverage and proper weight distribution across the harness.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I re-measure my growing puppy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Re-measure your puppy every 4-6 weeks during growth phases (typically 3-12 months) to ensure the harness remains properly fitted.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do different harness styles require different measurements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; front-clip harnesses need snug chest measurements, back-clip harnesses require length accuracy, and no-pull harnesses need both chest and neck dimensions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my dog is between two harness sizes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Choose the larger size if your dog falls between sizes, then adjust straps for a snug fit; oversizing is safer than undersizing.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.akc.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Kennel Club - Dog Safety</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative resource on dog breed standards and recommended equipment for safe walking and training.</p>
          </li>
          <li>
            <a href="https://www.canineprofessionals.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Association of Canine Professionals</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional guidelines for proper harness fitting, leash selection, and walking techniques for different dog sizes.</p>
          </li>
          <li>
            <a href="https://www.humanesociety.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Humane Society of the United States</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expert advice on dog care, safety equipment, and proper fitting for harnesses and collars.</p>
          </li>
          <li>
            <a href="https://www.petfinder.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Petfinder - Dog Care Articles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guides on selecting and fitting dog harnesses for comfort, safety, and training purposes.</p>
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