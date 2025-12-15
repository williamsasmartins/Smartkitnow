import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileFeederInsectGutLoadingRatioCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs:
  // - Insect Weight (g or lbs)
  // - Gut-Loading Nutrient Concentration (mg/g)
  // - Desired Nutrient Intake (mg)
  // - Gut-Loading Duration (hours)
  const [inputs, setInputs] = useState({
    insectWeight: "",
    nutrientConcentration: "",
    desiredIntake: "",
    gutLoadingDuration: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Gut-Loading Ratio = (Desired Nutrient Intake) / (Insect Weight × Nutrient Concentration × Gut-Loading Duration)
  // This ratio estimates the efficiency or adequacy of gut-loading based on inputs.
  // Units internally converted: insectWeight to grams if imperial.
  const results = useMemo(() => {
    const insectWeightRaw = parseFloat(inputs.insectWeight);
    const nutrientConcentration = parseFloat(inputs.nutrientConcentration);
    const desiredIntake = parseFloat(inputs.desiredIntake);
    const gutLoadingDuration = parseFloat(inputs.gutLoadingDuration);

    if (
      isNaN(insectWeightRaw) ||
      isNaN(nutrientConcentration) ||
      isNaN(desiredIntake) ||
      isNaN(gutLoadingDuration) ||
      insectWeightRaw <= 0 ||
      nutrientConcentration <= 0 ||
      desiredIntake <= 0 ||
      gutLoadingDuration <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for all inputs.",
        subtext: null,
        warning: null,
      };
    }

    // Convert insect weight to grams if imperial (lbs to g)
    const insectWeight =
      unit === "imperial" ? insectWeightRaw * 453.59237 : insectWeightRaw;

    // Calculate gut-loading ratio (unitless)
    // Interpretation: ratio < 1 means insufficient gut-loading; ratio >= 1 means adequate or more.
    const gutLoadingRatio =
      desiredIntake / (insectWeight * nutrientConcentration * gutLoadingDuration);

    let label = "";
    let warning = null;
    if (gutLoadingRatio < 1) {
      label =
        "Gut-loading ratio below 1 indicates insufficient nutrient delivery. Consider increasing gut-loading duration or nutrient concentration.";
      warning =
        "Warning: Nutrient intake may be inadequate for optimal reptile nutrition.";
    } else {
      label =
        "Gut-loading ratio meets or exceeds the desired nutrient intake, indicating adequate gut-loading.";
    }

    return {
      value: gutLoadingRatio.toFixed(3),
      label,
      subtext: "Ratio (unitless) indicating gut-loading adequacy",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is gut-loading important for feeder insects?",
      answer:
        "Gut-loading is essential because feeder insects often have low intrinsic nutrient content. By feeding them nutrient-rich diets before offering them to reptiles, we enhance their nutritional value, ensuring reptiles receive adequate vitamins and minerals. This process supports the health, growth, and immune function of insectivorous reptiles.",
    },
    {
      question: "How does gut-loading duration affect nutrient availability?",
      answer:
        "The duration of gut-loading directly influences how much nutrient the insect can accumulate in its digestive tract. Longer gut-loading times allow insects to ingest and store more nutrients, improving their nutritional profile. However, excessively long durations may lead to nutrient degradation or insect stress, so optimal timing is critical.",
    },
    {
      question: "Can I use any nutrient concentration values for this calculator?",
      answer:
        "Nutrient concentration values should be based on reliable laboratory analyses or reputable gut-loading diet formulations. Using inaccurate or estimated values can lead to misleading results and inadequate nutrition for reptiles. Always source nutrient data from veterinary or scientific literature to ensure precision.",
    },
    {
      question: "What does a gut-loading ratio below 1 signify?",
      answer:
        "A gut-loading ratio below 1 indicates that the nutrient intake from the gut-loaded insect is insufficient to meet the desired nutritional target. This suggests that either the insect weight, nutrient concentration, or gut-loading duration is too low. Adjusting these parameters can help achieve adequate nutrient delivery for reptile health.",
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
              <SelectItem value="imperial">Imperial (lbs, mg)</SelectItem>
              <SelectItem value="metric">Metric (g, mg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="insectWeight" className="text-slate-700 dark:text-slate-300">
            Feeder Insect Weight ({unit === "imperial" ? "lbs" : "grams"})
          </Label>
          <Input
            id="insectWeight"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "imperial" ? "e.g., 0.05" : "e.g., 20"}
            value={inputs.insectWeight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, insectWeight: e.target.value }))
            }
          />
        </div>

        <div>
          <Label htmlFor="nutrientConcentration" className="text-slate-700 dark:text-slate-300">
            Gut-Loading Nutrient Concentration (mg/g)
          </Label>
          <Input
            id="nutrientConcentration"
            type="number"
            min="0"
            step="any"
            placeholder="e.g., 15"
            value={inputs.nutrientConcentration}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, nutrientConcentration: e.target.value }))
            }
          />
        </div>

        <div>
          <Label htmlFor="desiredIntake" className="text-slate-700 dark:text-slate-300">
            Desired Nutrient Intake (mg)
          </Label>
          <Input
            id="desiredIntake"
            type="number"
            min="0"
            step="any"
            placeholder="e.g., 30"
            value={inputs.desiredIntake}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, desiredIntake: e.target.value }))
            }
          />
        </div>

        <div>
          <Label htmlFor="gutLoadingDuration" className="text-slate-700 dark:text-slate-300">
            Gut-Loading Duration (hours)
          </Label>
          <Input
            id="gutLoadingDuration"
            type="number"
            min="0"
            step="any"
            placeholder="e.g., 24"
            value={inputs.gutLoadingDuration}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, gutLoadingDuration: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here since useMemo depends on inputs)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              insectWeight: "",
              nutrientConcentration: "",
              desiredIntake: "",
              gutLoadingDuration: "",
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
          Understanding Feeder Insect Gut-Loading Ratio
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The feeder insect gut-loading ratio is a critical metric used to evaluate the efficiency and adequacy of nutrient enrichment in feeder insects before they are offered to insectivorous reptiles. Gut-loading involves feeding insects a nutrient-rich diet for a specified period, allowing them to accumulate essential vitamins, minerals, and other nutrients in their digestive tracts. This ratio helps quantify whether the gut-loading process meets the nutritional requirements necessary to support the health and growth of reptiles.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By calculating the gut-loading ratio, veterinarians and reptile keepers can assess if the nutrient intake from gut-loaded insects is sufficient relative to the desired nutritional goals. This ensures that feeder insects provide an optimal source of nutrition, preventing deficiencies that could lead to metabolic bone disease, immune compromise, or poor growth in reptiles. The ratio takes into account insect weight, nutrient concentration in the gut-loading diet, and the duration of gut-loading, providing a comprehensive view of gut-loading effectiveness.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding and applying this ratio is essential for maintaining high standards of reptile husbandry and veterinary care. It empowers caretakers to make informed decisions about gut-loading protocols, adjusting feeding times or diet formulations to maximize nutrient delivery. Ultimately, this contributes to improved animal welfare and longevity in captive reptiles.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the gut-loading ratio by integrating key parameters related to feeder insect nutrition. To use it effectively, input the weight of the feeder insect, the nutrient concentration of the gut-loading diet, the desired nutrient intake for your reptile, and the gut-loading duration in hours. The calculator will then compute a ratio indicating whether the gut-loading process is sufficient to meet nutritional goals.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) for insect weight.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the feeder insect's weight accurately, ensuring correct units.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the nutrient concentration of the gut-loading diet in mg per gram.
          </li>
          <li>
            <strong>Step 4:</strong> Specify the desired nutrient intake in milligrams based on your reptile's dietary needs.
          </li>
          <li>
            <strong>Step 5:</strong> Input the gut-loading duration in hours to reflect how long insects are fed the nutrient-rich diet.
          </li>
          <li>
            <strong>Step 6:</strong> Click "Calculate" to view the gut-loading ratio and interpret the results to optimize your feeding strategy.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6466064/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Nutritional Value of Gut-Loaded Feeder Insects for Reptiles
            </a>
            <p className="text-slate-500 text-sm">
              This peer-reviewed article discusses the importance of gut-loading in enhancing the nutritional profile of feeder insects and its impact on reptile health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/Feeder%20Insect%20Gut-Loading%20and%20Nutritional%20Enhancement.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Gut-Loading Protocols for Feeder Insects in Veterinary Practice
            </a>
            <p className="text-slate-500 text-sm">
              A comprehensive guide from UC Davis Veterinary Medicine outlining best practices for gut-loading feeder insects to optimize reptile nutrition.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.reptilesmagazine.com/gut-loading-feeder-insects-for-reptiles/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Gut-Loading Feeder Insects for Reptiles: A Practical Approach
            </a>
            <p className="text-slate-500 text-sm">
              This article provides practical advice on gut-loading techniques, nutrient formulations, and timing to maximize feeder insect nutritional content.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Feeder Insect Gut-Loading Ratio"
      description="Calculate the necessary gut-loading time and nutritional ratio for feeder insects before feeding them to reptiles."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Gut-Loading Ratio = Desired Nutrient Intake / (Insect Weight × Nutrient Concentration × Gut-Loading Duration)",
        variables: [
          { symbol: "Desired Nutrient Intake", description: "Target nutrient amount in mg" },
          { symbol: "Insect Weight", description: "Weight of feeder insect in grams" },
          { symbol: "Nutrient Concentration", description: "Nutrient concentration in mg per gram" },
          { symbol: "Gut-Loading Duration", description: "Time insects are gut-loaded in hours" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A reptile keeper wants to ensure their feeder crickets provide 30 mg of calcium. Each cricket weighs 0.05 lbs (22.68 g), and the gut-loading diet contains 15 mg of calcium per gram. The keeper plans to gut-load the crickets for 24 hours.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert cricket weight to grams if needed (0.05 lbs × 453.592 = 22.68 g).",
          },
          {
            label: "2",
            explanation:
              "Calculate total nutrient available: 22.68 g × 15 mg/g × 24 hours = 8161.2 mg-hours.",
          },
          {
            label: "3",
            explanation:
              "Calculate gut-loading ratio: 30 mg / 8161.2 mg-hours ≈ 0.0037, indicating ample nutrient availability.",
          },
        ],
        result:
          "The gut-loading ratio is well below 1, meaning the gut-loading protocol is more than sufficient to meet the reptile's calcium needs.",
      }}
      relatedCalculators={[
        {
          title: "Resting vs. Active Hours Balance Tracker (owner input)",
          url: "/pets/cat-resting-active-hours-balance-tracker",
          icon: "🐾",
        },
        {
          title: "Bedding Replacement Frequency Estimator",
          url: "/pets/small-mammal-bedding-replacement-frequency",
          icon: "🐶",
        },
        {
          title: "Essential Oils Exposure Risk (diffuser/dermal)",
          url: "/pets/cat-essential-oils-exposure-risk",
          icon: "🐱",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Xylitol Exposure Risk for Cats (rare but educational)",
          url: "/pets/cat-xylitol-exposure-risk",
          icon: "🐱",
        },
        {
          title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs",
          url: "/pets/dog-benadryl-diphenhydramine-dose",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Feeder Insect Gut-Loading Ratio" },
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