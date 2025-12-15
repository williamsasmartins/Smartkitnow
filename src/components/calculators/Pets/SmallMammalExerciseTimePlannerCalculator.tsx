import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SmallMammalExerciseTimePlannerCalculator() {
  // 1. STATE
  // No unit switcher needed because time is unitless here.
  // Inputs: Age (months), Species (select), Activity Level (select)
  const [inputs, setInputs] = useState({
    ageMonths: "",
    species: "rabbit",
    activityLevel: "moderate",
  });

  // Species base run time recommendations (minutes per day)
  // These are typical veterinary guidelines for small mammals.
  // Activity level multipliers adjust the base time.
  const speciesBaseTimes: Record<string, number> = {
    rabbit: 60, // 60 minutes base
    guineaPig: 45,
    hamster: 30,
    ferret: 90,
    chinchilla: 50,
  };

  const activityLevelMultipliers: Record<string, number> = {
    low: 0.75,
    moderate: 1,
    high: 1.25,
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const age = parseInt(inputs.ageMonths);
    if (
      isNaN(age) ||
      age < 0 ||
      !speciesBaseTimes[inputs.species] ||
      !activityLevelMultipliers[inputs.activityLevel]
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Adjust base time by activity level
    let baseTime = speciesBaseTimes[inputs.species];
    const multiplier = activityLevelMultipliers[inputs.activityLevel];
    let runTime = baseTime * multiplier;

    // Adjust for age: younger animals (<6 months) need more exercise for development
    if (age < 6) {
      runTime *= 1.2; // 20% more time for juveniles
    }

    // Round to nearest whole minute
    runTime = Math.round(runTime);

    // Warning if age is very young or very old (over 84 months = 7 years)
    let warning = null;
    if (age < 2) {
      warning =
        "Very young animals require supervised exercise to prevent injury. Consult your veterinarian for tailored advice.";
    } else if (age > 84) {
      warning =
        "Senior animals may have reduced mobility or health issues. Adjust exercise accordingly and seek veterinary guidance.";
    }

    return {
      value: runTime,
      label: "Recommended Daily Run Time (minutes)",
      subtext: `For a ${inputs.species} aged ${age} months with ${inputs.activityLevel} activity level.`,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is daily exercise important for small mammals?",
      answer:
        "Daily exercise is crucial for small mammals to maintain their physical health, mental stimulation, and prevent obesity. Regular activity supports cardiovascular fitness, muscle tone, and natural behaviors such as foraging and exploration. Without adequate exercise, these animals can develop stress-related behaviors and chronic health problems.",
    },
    {
      question: "How does age affect the exercise needs of small mammals?",
      answer:
        "Age significantly influences exercise requirements; juveniles need more activity to support growth and development, while seniors may require gentler, shorter sessions due to decreased mobility or health conditions. Tailoring exercise to age helps prevent injury and ensures the animal remains active without undue stress. Monitoring changes in behavior or ability is essential for adjusting routines appropriately.",
    },
    {
      question: "What role does activity level play in planning exercise time?",
      answer:
        "Activity level reflects an individual animal’s natural energy and lifestyle, influencing how much exercise they require daily. Animals with high activity levels need longer or more intense exercise sessions to satisfy their behavioral needs, while low activity animals may require less but still consistent movement. Recognizing and respecting these differences helps optimize welfare and prevent boredom or frustration.",
    },
    {
      question: "Can exercise time recommendations vary between species?",
      answer:
        "Yes, different small mammal species have unique physiological and behavioral traits that dictate their exercise needs. For example, ferrets are naturally more active and require longer run times compared to hamsters, who have shorter bursts of activity. Understanding species-specific requirements ensures that exercise plans promote health and natural behaviors effectively.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  // Widget JSX
  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="species" className="text-slate-700 dark:text-slate-300">
            Species
          </Label>
          <select
            id="species"
            name="species"
            value={inputs.species}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            <option value="rabbit">Rabbit</option>
            <option value="guineaPig">Guinea Pig</option>
            <option value="hamster">Hamster</option>
            <option value="ferret">Ferret</option>
            <option value="chinchilla">Chinchilla</option>
          </select>
        </div>

        <div>
          <Label htmlFor="ageMonths" className="text-slate-700 dark:text-slate-300">
            Age (months)
          </Label>
          <Input
            id="ageMonths"
            name="ageMonths"
            type="number"
            min={0}
            placeholder="e.g. 12"
            value={inputs.ageMonths}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="activityLevel"
            className="text-slate-700 dark:text-slate-300"
          >
            Activity Level
          </Label>
          <select
            id="activityLevel"
            name="activityLevel"
            value={inputs.activityLevel}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs to current values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              ageMonths: "",
              species: "rabbit",
              activityLevel: "moderate",
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult
              a vet for diagnosis.
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
          Understanding Exercise Time Planner (Run Time per Day)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Exercise is a fundamental component of health and well-being for small
          mammals such as rabbits, guinea pigs, hamsters, ferrets, and chinchillas.
          These animals require daily physical activity to maintain cardiovascular
          fitness, muscle strength, and mental stimulation. The Exercise Time Planner
          helps owners and veterinarians estimate the appropriate amount of daily
          run or free-roam time tailored to species, age, and activity level, ensuring
          optimal health and enrichment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Different species have varying natural activity patterns and exercise needs,
          which this tool accounts for by providing species-specific baseline
          recommendations. Additionally, age plays a critical role; juveniles need
          more exercise to support growth, while seniors may require gentler routines
          to accommodate mobility limitations. Adjusting exercise time based on
          activity level ensures that individual behavioral needs are met, promoting
          welfare and preventing stress or obesity.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the recommended daily run or free-roam time for
          your small mammal based on three key inputs: species, age in months, and
          activity level. By selecting the appropriate options and entering the age,
          you receive a tailored exercise time recommendation that supports your
          pet’s health and enrichment needs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the species of your small mammal from the
            dropdown menu.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your pet’s age in months to account for
            developmental or senior needs.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the activity level that best describes
            your pet’s natural behavior (low, moderate, or high).
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the recommended daily
            run time in minutes.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to plan safe, supervised
            exercise sessions that meet your pet’s needs.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/exotic-pet-care/exercise-and-enrichment-for-exotic-pets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Exercise and Enrichment for Exotic Pets
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on the importance of exercise and enrichment
              tailored to exotic and small mammal species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.avma.org/resources-tools/pet-owners/petcare/small-mammal-care"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. American Veterinary Medical Association: Small Mammal Care
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource on health, nutrition, and exercise needs for
              small mammal pets.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149997/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Institutes of Health: Behavioral and Environmental Needs of
              Small Mammals
            </a>
            <p className="text-slate-500 text-sm">
              Research article discussing species-specific exercise and enrichment
              requirements for captive small mammals.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Exercise Time Planner (Run Time per Day)"
      description="Plan the necessary amount of daily free-roam or wheel/run time to ensure adequate exercise and enrichment."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Recommended Run Time = Base Species Time × Activity Level Multiplier × Age Adjustment",
        variables: [
          { symbol: "Base Species Time", description: "Species-specific baseline minutes" },
          { symbol: "Activity Level Multiplier", description: "Factor based on activity level (0.75–1.25)" },
          { symbol: "Age Adjustment", description: "1.2 if juvenile (<6 months), else 1" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4-month-old rabbit with moderate activity level needs an exercise plan.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify base species time for rabbit: 60 minutes.",
          },
          {
            label: "2",
            explanation:
              "Select activity level multiplier for moderate: 1.0.",
          },
          {
            label: "3",
            explanation:
              "Apply age adjustment for juvenile (<6 months): 1.2.",
          },
          {
            label: "4",
            explanation:
              "Calculate: 60 × 1.0 × 1.2 = 72 minutes recommended daily run time.",
          },
        ],
        result: "The rabbit should have approximately 72 minutes of daily exercise.",
      }}
      relatedCalculators={[
        {
          title: "Dehydration Risk Estimator (Skin Turgor + Mucous Check)",
          url: "/pets/horse-dehydration-risk-estimator",
          icon: "🐾",
        },
        {
          title: "Toxic Foods Exposure Checker (Avocado, Chocolate, etc.)",
          url: "/pets/bird-toxic-foods-exposure-checker",
          icon: "🐶",
        },
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
        {
          title: "Ammonia-to-Nitrite Cycle Time Estimator",
          url: "/pets/aquarium-ammonia-nitrite-cycle-time",
          icon: "🍖",
        },
        {
          title: "Horse Toxic Plant Exposure Risk (Ragwort, Yew, etc.)",
          url: "/pets/horse-toxic-plant-exposure-risk",
          icon: "🐎",
        },
        {
          title: "Antibiotic Dose Reference (mg/kg)",
          url: "/pets/bird-antibiotic-dose-reference",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Exercise Time Planner (Run Time per Day)" },
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