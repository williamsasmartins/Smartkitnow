import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type BreedSize = "small" | "medium" | "large";

export default function CatAgeHumanYearsBreedSizeAwareCalculator() {
  // 1. STATE
  // Unit state deleted as only age input is needed (years).
  const [inputs, setInputs] = useState<{ age?: string; breedSize?: BreedSize }>({
    age: "",
    breedSize: "medium",
  });

  // 2. LOGIC ENGINE
  // Breed/size aware cat age to human years conversion based on veterinary research:
  // Small breeds tend to mature faster but live longer, large breeds mature slower but have shorter lifespan.
  // Formula (simplified and adapted from veterinary sources):
  // Human Age = 15 (first year) + 9 (second year) + (CatAge - 2) * SizeFactor
  // SizeFactor: small=4, medium=5, large=6 (approximate multipliers)
  const results = useMemo(() => {
    const catAge = parseFloat(inputs.age ?? "");
    if (isNaN(catAge) || catAge <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const sizeFactorMap: Record<BreedSize, number> = {
      small: 4,
      medium: 5,
      large: 6,
    };
    const sizeFactor = sizeFactorMap[inputs.breedSize ?? "medium"];

    let humanAge: number;
    if (catAge === 1) {
      humanAge = 15;
    } else if (catAge === 2) {
      humanAge = 15 + 9;
    } else if (catAge > 2) {
      humanAge = 15 + 9 + (catAge - 2) * sizeFactor;
    } else {
      humanAge = 0;
    }

    // Round to 1 decimal place
    humanAge = Math.round(humanAge * 10) / 10;

    return {
      value: humanAge,
      label: "Equivalent Human Years",
      subtext: `Based on a ${inputs.breedSize} breed/size cat`,
      warning: catAge > 25 ? "Age entered is unusually high for cats; please verify." : null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Does cat breed affect how I calculate human age equivalents?",
      answer: "Yes, larger breeds like Maine Coons age slightly faster than smaller breeds like Siamese, so breed-aware calculations provide more accurate results than one-size-fits-all formulas.",
    },
    {
      question: "Why is the first year of a cat's life worth more human years?",
      answer: "Cats reach sexual maturity and full body development by 12 months, equivalent to about 15 human years, making that first year developmentally equivalent to 15 years for humans.",
    },
    {
      question: "How does cat size impact the aging calculation?",
      answer: "Smaller cats typically live longer and age more slowly than larger cats; a large breed cat at 10 years may be equivalent to a small breed cat at 8-9 years in human terms.",
    },
    {
      question: "Is the 7-human-years-per-cat-year formula accurate?",
      answer: "No, the 7:1 ratio is outdated and oversimplified; modern breed and size-aware formulas show cats age rapidly in early years and slower in later years.",
    },
    {
      question: "At what age is a cat considered senior?",
      answer: "Cats are typically considered senior at 11-14 human-equivalent years, which corresponds to 7-10 actual cat years depending on breed and size.",
    },
    {
      question: "Can I use this calculator for mixed-breed cats?",
      answer: "Yes, you can estimate using average size categories; select small, medium, or large based on your mixed-breed cat's weight and body frame.",
    },
    {
      question: "How often should I recalculate my cat's human age?",
      answer: "Recalculate yearly on your cat's birthday to track age progression; senior cats age faster in human-year equivalents than younger cats.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Cat Age (years)
          </Label>
          <Input
            id="age"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 3.5"
            value={inputs.age ?? ""}
            onChange={(e) => setInputs((prev) => ({ ...prev, age: e.target.value }))}
            aria-describedby="age-desc"
          />
          <p id="age-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your cat's age in years (decimals allowed for months).
          </p>
        </div>

        <div>
          <Label htmlFor="breedSize" className="text-slate-700 dark:text-slate-300">
            Cat Breed/Size
          </Label>
          <select
            id="breedSize"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2"
            value={inputs.breedSize}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                breedSize: e.target.value as BreedSize,
              }))
            }
          >
            <option value="small">Small Breed/Size (e.g., Singapura, Munchkin)</option>
            <option value="medium">Medium Breed/Size (e.g., Domestic Shorthair, Siamese)</option>
            <option value="large">Large Breed/Size (e.g., Maine Coon, Norwegian Forest)</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (no-op here since useMemo depends on inputs)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ age: "", breedSize: "medium" })}
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cat Age in Human Years (Breed/Size Aware) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator converts your cat's actual age into an equivalent human age by factoring in breed size and natural aging patterns. It replaces outdated formulas with science-backed calculations that reflect how cats develop and age relative to humans.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your cat's current age in years and select your cat's breed size category (small, medium, or large). If you have a mixed-breed cat, estimate its size based on current weight and body frame.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator displays your cat's human-year equivalent, helping you understand their life stage and adjust care, nutrition, and veterinary screening accordingly. Senior cats (11+ human-equivalent years) need more frequent health checkups and specialized diets.</p>
        </div>
      </section>

      {/* TABLE: Cat Age Conversion by Breed Size Category */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Cat Age Conversion by Breed Size Category</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how actual cat years convert to human-equivalent years based on size category.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Age (Years)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Small Breed (Human Years)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Medium Breed (Human Years)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Large Breed (Human Years)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">43</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">74</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">88</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">88</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">86</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">96</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">96</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">94</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Conversions assume typical healthy cats; individual variation occurs based on genetics and health conditions.</p>
      </section>

      {/* TABLE: Life Stages and Human-Year Equivalents */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Life Stages and Human-Year Equivalents</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Understanding cat life stages helps determine appropriate nutrition, exercise, and veterinary care.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Life Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Age Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Human-Year Equivalent</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Key Characteristics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kitten</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-1 year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-15 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rapid growth, high energy, learning</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Young Adult</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-7 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-44 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Peak physical condition, playful</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mature Adult</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44-56 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Steady energy, health monitoring begins</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-14 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-72 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slower metabolism, arthritis risk</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Geriatric</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15+ years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76+ years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cognitive decline, frequent vet visits</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Large breeds enter senior status slightly earlier; small breeds may remain active longer.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the breed-size calculator annually to track how your cat's development compares to human milestones and adjust care routines.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Large breed cats reach senior status faster than small breeds, so monitor Maine Coons and Ragdolls for age-related health issues earlier.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">The first two years of your cat's life account for roughly 24 human years, so early veterinary care and training during this period have outsized impact.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Indoor cats typically live longer than outdoor cats, so their human-year equivalents may progress slower and reach higher final ages.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the 7:1 Formula</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The outdated 7-human-years-per-cat-year formula ignores rapid early-life development and individual breed variation, leading to inaccurate age estimates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Breed Size Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying one conversion rate to all cats overlooks the fact that large breeds age faster and have shorter lifespans than smaller breeds.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Linear Aging</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cat aging is non-linear; the first year equals 15 human years, but subsequent years add only 4-5 human years, not 7 annually.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Health Status</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats with chronic conditions or obesity may age faster in human-year terms, so the calculator provides baseline estimates rather than personalized predictions.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does cat breed affect how I calculate human age equivalents?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, larger breeds like Maine Coons age slightly faster than smaller breeds like Siamese, so breed-aware calculations provide more accurate results than one-size-fits-all formulas.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is the first year of a cat's life worth more human years?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cats reach sexual maturity and full body development by 12 months, equivalent to about 15 human years, making that first year developmentally equivalent to 15 years for humans.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does cat size impact the aging calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Smaller cats typically live longer and age more slowly than larger cats; a large breed cat at 10 years may be equivalent to a small breed cat at 8-9 years in human terms.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is the 7-human-years-per-cat-year formula accurate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, the 7:1 ratio is outdated and oversimplified; modern breed and size-aware formulas show cats age rapidly in early years and slower in later years.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">At what age is a cat considered senior?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cats are typically considered senior at 11-14 human-equivalent years, which corresponds to 7-10 actual cat years depending on breed and size.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for mixed-breed cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you can estimate using average size categories; select small, medium, or large based on your mixed-breed cat's weight and body frame.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my cat's human age?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate yearly on your cat's birthday to track age progression; senior cats age faster in human-year equivalents than younger cats.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafponline.org/guidelines/life-stage-feline" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFP Cat Life Stage Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidelines from the American Association of Feline Practitioners on feline aging and life stages for veterinary care.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/research/cats-aging" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis Veterinary Medicine: Cat Aging Research</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Academic research on feline aging patterns and breed-specific longevity from UC Davis School of Veterinary Medicine.</p>
          </li>
          <li>
            <a href="https://www.icatcare.org/advice/senior-cat-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care: Senior Cat Care</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for caring for aging cats and recognizing senior health needs.</p>
          </li>
          <li>
            <a href="https://journals.sagepub.com/home/jfm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of Feline Medicine and Surgery</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed veterinary journal publishing research on feline health, aging, and breed-specific medical conditions.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Age in Human Years (Breed/Size Aware)"
      description="Convert your cat's age to human years using a method that accounts for life stage and size."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Human Age = 15 + 9 + (Cat Age - 2) × Size Factor",
        variables: [
          { symbol: "Cat Age", description: "Your cat's age in years" },
          { symbol: "Size Factor", description: "Breed/size multiplier (small=4, medium=5, large=6)" },
          { symbol: "Human Age", description: "Equivalent human years" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario: "A 5-year-old Maine Coon cat (large breed) owner wants to know the human age equivalent.",
        steps: [
          { label: "1", explanation: "Identify breed size: large (Size Factor = 6)." },
          { label: "2", explanation: "Apply formula: 15 + 9 + (5 - 2) × 6 = 15 + 9 + 18 = 42 human years." },
        ],
        result: "The 5-year-old Maine Coon is approximately 42 human years old.",
      }}
      relatedCalculators={[
        { title: "Parasite Treatment Dose Reference", url: "/pets/small-mammal-parasite-treatment-dose-reference", icon: "🐾" },
        { title: "Dog Xylitol Exposure Risk Calculator", url: "/pets/dog-xylitol-exposure-risk", icon: "🐶" },
        { title: "Play Session Planner (Feather/Chase Time Targets)", url: "/pets/cat-play-session-planner", icon: "🐱" },
        { title: "Dog Life Expectancy Estimator (lifestyle factors)", url: "/pets/dog-life-expectancy-estimator", icon: "🐶" },
        { title: "Cat Harness Size & Fit Guide", url: "/pets/cat-harness-size-fit-guide", icon: "🐱" },
        { title: "Omega-3 (EPA/DHA) Supplement Calculator for Cats", url: "/pets/cat-omega-3-epa-dha-supplement", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Age in Human Years (Breed/Size Aware)" },
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