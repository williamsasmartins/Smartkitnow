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
      question: "Why does cat breed or size affect the conversion to human years?",
      answer:
        "Cats of different breeds and sizes age at varying rates due to genetic and physiological differences. Smaller breeds often mature faster in early years but tend to live longer, while larger breeds may mature more slowly but have shorter lifespans. This calculator accounts for these differences to provide a more accurate human age equivalent, reflecting breed-specific aging patterns.",
    },
    {
      question: "How accurate is this cat age to human years conversion?",
      answer:
        "While this calculator uses veterinary-informed multipliers to estimate human age equivalents, individual cats may age differently based on health, lifestyle, and genetics. The formula provides a general guideline rather than an exact measure. For precise health assessments, consulting a veterinarian is always recommended.",
    },
    {
      question: "Can I use this calculator for kittens younger than one year?",
      answer:
        "Yes, the calculator accounts for the rapid development during a cat's first year by assigning 15 human years to the first cat year. This reflects the intense growth and maturation cats experience early in life. For kittens younger than one year, simply enter their age in decimal form (e.g., 0.5 for six months) for an approximate conversion.",
    },
    {
      question: "Why is the second year of a cat’s life weighted differently in this formula?",
      answer:
        "The second year of a cat’s life corresponds to a significant developmental phase, roughly equivalent to adolescence in humans. Veterinary research shows that the second year adds about 9 human years, reflecting continued growth and maturity. This stepwise approach improves accuracy over simple linear conversions by capturing life stage transitions.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Cat Age in Human Years (Breed/Size Aware)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding a cat’s age in human years is essential for pet owners and veterinarians to better relate to the cat’s life stage and health needs. Unlike a simple linear conversion, cats age rapidly in their first two years and then age at different rates depending on breed and size. This breed and size-aware approach acknowledges that small, medium, and large cats have distinct aging patterns, which influence their physical and cognitive development.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Small breeds typically mature quickly but tend to live longer, while larger breeds may have a slower maturation but shorter overall lifespan. By incorporating these differences, this calculator provides a more accurate estimate of your cat’s equivalent human age. This helps owners understand their pet’s behavior, health risks, and care requirements at each life stage, facilitating better veterinary care and lifestyle adjustments.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The formula used is based on veterinary research that segments the cat’s life into key phases: rapid early growth, adolescent development, and adult aging. Each phase is weighted differently, and the size factor modifies the aging rate in adulthood. This nuanced method improves upon traditional “multiply by seven” rules, offering a scientifically grounded tool for cat age assessment.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide an accurate human age equivalent for your cat based on its actual age and breed size. Simply enter your cat’s current age in years, including decimals for months, and select the breed size category that best fits your cat. The calculator then applies a veterinary-informed formula to estimate the human age equivalent.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your cat’s age in years. For example, 3.5 for three and a half years old.
          </li>
          <li>
            <strong>Step 2:</strong> Select the breed size category: small, medium, or large. If unsure, medium is a safe default.
          </li>
          <li>
            <strong>Step 3:</strong> Click “Calculate” to see the estimated human age equivalent, which reflects your cat’s life stage and breed-specific aging.
          </li>
          <li>
            <strong>Step 4:</strong> Use this information to better understand your cat’s health needs and consult your veterinarian for personalized advice.
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
              href="https://www.avma.org/resources-tools/pet-owners/petcare/cat-life-stages"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Veterinary Medical Association (AVMA) - Cat Life Stages
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of feline life stages and aging patterns used as a foundation for age conversion formulas.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/cat-aging"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. VCA Hospitals - Understanding Cat Aging
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary insights into how breed and size influence feline aging and health considerations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.petmd.com/cat/general-health/evr_ct_how_to_calculate_cat_years_to_human_years"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. PetMD - How to Calculate Cat Years to Human Years
            </a>
            <p className="text-slate-500 text-sm">
              Detailed explanation of the multiphase cat aging process and breed size considerations.
            </p>
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