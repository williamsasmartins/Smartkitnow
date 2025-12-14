import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Calculator, AlertTriangle, Info } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatSheddingCombingTimePlannerCalculator() {
  // 1. STATE
  // No unit selector needed because inputs are time/age based.
  // Inputs: Coat Type (select), Shedding Season Length (weeks), Current Week of Season, Combing Frequency (days)
  const [inputs, setInputs] = useState({
    coatType: "", // "short", "medium", "long"
    sheddingSeasonWeeks: "",
    currentWeek: "",
    combingFrequencyDays: "",
  });

  // 2. LOGIC ENGINE
  // The goal: Estimate optimal combing time per session (minutes) based on coat type and shedding intensity.
  // Formula (simplified veterinary grooming guideline):
  // Combing Time (min) = BaseTime * SheddingIntensityFactor * (SheddingSeasonProgress)
  // where BaseTime depends on coat type:
  // short = 5 min, medium = 10 min, long = 15 min
  // SheddingIntensityFactor = 1 + (currentWeek / sheddingSeasonWeeks) * 0.5 (up to 50% more time as shedding peaks)
  // SheddingSeasonProgress = currentWeek / sheddingSeasonWeeks (0 to 1)
  // Combing frequency affects total weekly combing time but not per session time here.

  const results = useMemo(() => {
    const { coatType, sheddingSeasonWeeks, currentWeek, combingFrequencyDays } = inputs;

    if (
      !coatType ||
      !sheddingSeasonWeeks ||
      !currentWeek ||
      !combingFrequencyDays ||
      isNaN(Number(sheddingSeasonWeeks)) ||
      isNaN(Number(currentWeek)) ||
      isNaN(Number(combingFrequencyDays))
    ) {
      return { value: 0, label: "", subtext: "", warning: null };
    }

    const seasonWeeks = Number(sheddingSeasonWeeks);
    const week = Number(currentWeek);
    const frequencyDays = Number(combingFrequencyDays);

    if (seasonWeeks <= 0 || week <= 0 || frequencyDays <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "All numeric inputs must be positive numbers greater than zero.",
      };
    }
    if (week > seasonWeeks) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Current week cannot exceed the total shedding season length.",
      };
    }

    // Base time per coat type (minutes)
    const baseTimes: Record<string, number> = {
      short: 5,
      medium: 10,
      long: 15,
    };

    const baseTime = baseTimes[coatType];
    if (!baseTime) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Invalid coat type selected.",
      };
    }

    // Shedding intensity factor increases combing time by up to 50% as shedding peaks
    const sheddingIntensityFactor = 1 + (week / seasonWeeks) * 0.5;

    // Shedding season progress (0 to 1)
    const sheddingProgress = week / seasonWeeks;

    // Calculate combing time per session (rounded)
    const combingTime = Math.round(baseTime * sheddingIntensityFactor * sheddingProgress);

    // Calculate weekly combing time = combingTime * (7 / combingFrequencyDays)
    const sessionsPerWeek = 7 / frequencyDays;
    const weeklyCombingTime = Math.round(combingTime * sessionsPerWeek);

    return {
      value: combingTime,
      label: "Minutes per Combing Session",
      subtext: `Estimated weekly combing time: ${weeklyCombingTime} minutes based on your frequency.`,
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why does coat type affect the combing time required during shedding?",
      answer:
        "Different coat types have varying hair lengths and densities, which influence how much grooming is necessary. Long-haired cats tend to accumulate more loose hair and tangles, requiring longer combing sessions to prevent mats and skin irritation. Short-haired cats shed less visibly and usually need shorter grooming times, but regular combing still helps maintain coat health and reduce shedding around the home.",
    },
    {
      question: "How does the shedding season length impact the grooming schedule?",
      answer:
        "The shedding season length determines how long your cat will experience increased hair loss, which affects grooming needs. A longer shedding season means you need to maintain consistent combing over several weeks to manage loose hair effectively. Understanding this duration helps you plan combing frequency and session length to minimize discomfort and hair accumulation in your living space.",
    },
    {
      question: "Why is it important to adjust combing frequency during peak shedding weeks?",
      answer:
        "During peak shedding weeks, cats lose more hair and are prone to tangles and mats, which can cause skin irritation if not addressed. Increasing combing frequency helps remove loose hair before it accumulates, reducing discomfort and potential health issues. Adjusting your grooming routine based on shedding intensity ensures your cat remains comfortable and their coat stays healthy throughout the season.",
    },
    {
      question: "Can regular combing reduce the amount of hair shed around the house?",
      answer:
        "Yes, regular combing removes loose and dead hair directly from your cat’s coat before it falls off naturally. This proactive grooming minimizes the amount of hair that ends up on furniture, floors, and clothing. Additionally, it promotes better skin health and reduces the risk of hairballs by preventing excessive ingestion of loose hair during self-grooming.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="coatType" className="text-slate-700 dark:text-slate-300">
            Coat Type
          </Label>
          <select
            id="coatType"
            name="coatType"
            value={inputs.coatType}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            <option value="" disabled>
              Select coat type
            </option>
            <option value="short">Short Hair</option>
            <option value="medium">Medium Hair</option>
            <option value="long">Long Hair</option>
          </select>
        </div>

        <div>
          <Label htmlFor="sheddingSeasonWeeks" className="text-slate-700 dark:text-slate-300">
            Shedding Season Length (weeks)
          </Label>
          <Input
            id="sheddingSeasonWeeks"
            name="sheddingSeasonWeeks"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 12"
            value={inputs.sheddingSeasonWeeks}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="currentWeek" className="text-slate-700 dark:text-slate-300">
            Current Week of Shedding Season
          </Label>
          <Input
            id="currentWeek"
            name="currentWeek"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 4"
            value={inputs.currentWeek}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="combingFrequencyDays" className="text-slate-700 dark:text-slate-300">
            Combing Frequency (days)
          </Label>
          <Input
            id="combingFrequencyDays"
            name="combingFrequencyDays"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 3"
            value={inputs.combingFrequencyDays}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              coatType: "",
              sheddingSeasonWeeks: "",
              currentWeek: "",
              combingFrequencyDays: "",
            })
          }
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
          Understanding Shedding & Combing Time Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Shedding is a natural process in cats where they lose old or damaged hair to make way for new growth. The amount and duration of shedding vary depending on factors such as coat type, season, and overall health. Managing shedding effectively requires a tailored grooming routine that considers these variables to maintain a healthy coat and minimize hair accumulation in your home.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Combing is an essential grooming activity that helps remove loose hair, prevent mats, and stimulate skin circulation. The time required for combing depends largely on the cat’s coat length and density, with longer coats needing more attention. Additionally, shedding intensity fluctuates throughout the shedding season, often peaking mid-season, which necessitates adjustments in grooming duration and frequency.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This planner helps cat owners estimate the optimal combing time per session by integrating coat type, shedding season progress, and grooming frequency. By following a structured plan, owners can reduce discomfort for their pets, maintain coat health, and effectively manage shedding-related issues. This tool is designed to empower owners with veterinary-informed guidance for better grooming outcomes.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this planner, input your cat’s coat type, the total length of the shedding season in weeks, the current week within that season, and how often you plan to comb your cat in days. The calculator will estimate the recommended combing time per session in minutes, helping you adjust your grooming routine according to shedding intensity and coat needs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your cat’s coat type from short, medium, or long hair to set the base grooming time.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total shedding season length in weeks, which varies by region and cat breed.
          </li>
          <li>
            <strong>Step 3:</strong> Input the current week of the shedding season to reflect shedding progression.
          </li>
          <li>
            <strong>Step 4:</strong> Specify your planned combing frequency in days to calculate weekly grooming time.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to see the recommended combing time per session and weekly grooming estimate.
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
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/grooming-your-cat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Cornell University Feline Health Center - Grooming Your Cat
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on feline grooming practices, including shedding management and combing techniques tailored to coat types.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/grooming-your-cat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. VCA Hospitals - Grooming Your Cat
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary insights on grooming frequency, seasonal shedding, and health benefits of regular combing for cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.petmd.com/cat/care/evr_ct_how_to_groom_your_cat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. PetMD - How to Groom Your Cat
            </a>
            <p className="text-slate-500 text-sm">
              Practical advice on grooming schedules, combing duration, and managing shedding based on coat length and seasonality.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Shedding & Combing Time Planner"
      description="Plan an optimal combing schedule to manage shedding based on coat type and season."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Combing Time (min) = BaseTime × (1 + (CurrentWeek / SeasonWeeks) × 0.5) × (CurrentWeek / SeasonWeeks)",
        variables: [
          { symbol: "BaseTime", description: "Base combing time per coat type (min)" },
          { symbol: "CurrentWeek", description: "Current week of shedding season" },
          { symbol: "SeasonWeeks", description: "Total shedding season length in weeks" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A long-haired cat is in week 6 of a 12-week shedding season, with combing planned every 3 days.",
        steps: [
          {
            label: "1",
            explanation:
              "BaseTime for long hair is 15 minutes. Calculate shedding intensity factor: 1 + (6/12)*0.5 = 1.25.",
          },
          {
            label: "2",
            explanation:
              "Shedding progress is 6/12 = 0.5. Combing time = 15 × 1.25 × 0.5 = 9.375, rounded to 9 minutes per session.",
          },
          {
            label: "3",
            explanation:
              "With combing every 3 days, sessions per week = 7/3 ≈ 2.33. Weekly combing time ≈ 9 × 2.33 = 21 minutes.",
          },
        ],
        result: "Recommended combing time is 9 minutes per session, totaling approximately 21 minutes weekly.",
      }}
      relatedCalculators={[
        { title: "Cephalexin Dose Calculator for Cats", url: "/pets/cat-cephalexin-dose", icon: "🐱" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        {
          title: "Omega-3 (EPA/DHA) Supplement Calculator for Cats",
          url: "/pets/cat-omega-3-epa-dha-supplement",
          icon: "🐱",
        },
        {
          title: "Dehydration Risk Estimator (Weight & Symptoms Aware)",
          url: "/pets/dog-dehydration-risk-estimator",
          icon: "🍖",
        },
        { title: "Dog BMI/Body Index (educational)", url: "/pets/dog-bmi-body-index-educational", icon: "🐶" },
        {
          title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)",
          url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Shedding & Combing Time Planner" },
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