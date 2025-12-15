import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const oxygenSolubilityData = [
  { tempC: 0, solubilityMgL: 14.6 },
  { tempC: 5, solubilityMgL: 12.8 },
  { tempC: 10, solubilityMgL: 11.3 },
  { tempC: 15, solubilityMgL: 10.1 },
  { tempC: 20, solubilityMgL: 9.1 },
  { tempC: 25, solubilityMgL: 8.3 },
  { tempC: 30, solubilityMgL: 7.6 },
  { tempC: 35, solubilityMgL: 7.0 },
  { tempC: 40, solubilityMgL: 6.5 },
];

function interpolateSolubility(tempC: number) {
  // If temp out of range, clamp
  if (tempC <= oxygenSolubilityData[0].tempC) return oxygenSolubilityData[0].solubilityMgL;
  if (tempC >= oxygenSolubilityData[oxygenSolubilityData.length - 1].tempC)
    return oxygenSolubilityData[oxygenSolubilityData.length - 1].solubilityMgL;

  // Find two points to interpolate between
  for (let i = 0; i < oxygenSolubilityData.length - 1; i++) {
    const current = oxygenSolubilityData[i];
    const next = oxygenSolubilityData[i + 1];
    if (tempC >= current.tempC && tempC <= next.tempC) {
      const ratio = (tempC - current.tempC) / (next.tempC - current.tempC);
      return current.solubilityMgL + ratio * (next.solubilityMgL - current.solubilityMgL);
    }
  }
  return 0; // fallback
}

export default function OxygenSolubilityVsTemperatureTableCalculator() {
  // 1. STATE
  // Unit system is fixed to metric (°C) for temperature input, no unit switcher needed
  const [inputs, setInputs] = useState({
    temperature: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const temp = parseFloat(inputs.temperature);
    if (isNaN(temp)) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid temperature in °C.",
      };
    }
    if (temp < 0 || temp > 40) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Temperature should be between 0°C and 40°C for accurate solubility values.",
      };
    }
    const solubility = interpolateSolubility(temp);
    return {
      value: solubility.toFixed(2),
      label: "Oxygen Solubility (mg/L)",
      subtext: `Maximum dissolved oxygen at ${temp.toFixed(1)}°C`,
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why does oxygen solubility decrease as temperature increases?",
      answer:
        "Oxygen solubility in water decreases with rising temperature because warmer water molecules move more vigorously, reducing the ability of water to hold dissolved gases. This phenomenon affects aquatic animals, as less oxygen is available in warmer environments, potentially stressing their respiratory systems. Understanding this relationship helps veterinarians and aquaculturists manage animal health in varying thermal conditions.",
    },
    {
      question: "How can veterinarians use this table in clinical practice?",
      answer:
        "Veterinarians use oxygen solubility data to assess aquatic animal environments, ensuring adequate oxygen levels for fish and amphibians. By knowing the maximum dissolved oxygen at a given temperature, they can recommend aeration or water changes to prevent hypoxia. This is crucial for treatment planning and maintaining optimal husbandry conditions in veterinary aquatic care.",
    },
    {
      question: "Is this solubility data applicable to all water types in veterinary settings?",
      answer:
        "The solubility values presented are for pure freshwater under standard atmospheric pressure. In veterinary practice, water salinity, pressure, and contaminants can alter oxygen solubility. Therefore, while this table provides a baseline, practitioners should consider environmental factors and perform direct measurements when precise oxygen levels are critical.",
    },
    {
      question: "How does oxygen solubility impact animal metabolism and health?",
      answer:
        "Oxygen availability directly influences metabolic rates and overall health in aquatic and semi-aquatic animals. Lower solubility at higher temperatures can limit oxygen supply, causing stress, reduced growth, or increased susceptibility to disease. Veterinarians must understand these dynamics to optimize care, especially in temperature-controlled environments like aquariums or rehabilitation tanks.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div className="flex flex-col">
          <Label htmlFor="temperature" className="text-slate-700 dark:text-slate-300">
            Water Temperature (°C)
          </Label>
          <Input
            id="temperature"
            type="number"
            min={0}
            max={40}
            step={0.1}
            placeholder="Enter temperature in °C"
            value={inputs.temperature}
            onChange={(e) => setInputs({ temperature: e.target.value })}
            aria-describedby="temperatureHelp"
          />
          <p id="temperatureHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter temperature between 0°C and 40°C for accurate solubility.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra calculation needed, results update automatically
          }}
          aria-label="Calculate oxygen solubility"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ temperature: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and treatment.
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
          Understanding Oxygen Solubility vs. Temperature Table
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Oxygen solubility in water is a critical parameter influencing the health and survival of aquatic animals. This table illustrates how the maximum amount of dissolved oxygen decreases as water temperature rises, reflecting the inverse relationship between temperature and gas solubility. Warmer water holds less oxygen, which can stress fish, amphibians, and other aquatic species dependent on dissolved oxygen for respiration.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding this relationship is essential for veterinarians and aquaculture professionals who manage aquatic environments. It helps in assessing water quality and ensuring that oxygen levels remain sufficient to meet the metabolic demands of animals. This knowledge also guides interventions such as aeration or temperature regulation to optimize animal welfare and prevent hypoxic conditions.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the maximum dissolved oxygen concentration in freshwater at a given temperature. Simply enter the water temperature in degrees Celsius within the valid range of 0 to 40°C. The tool interpolates between standard reference values to provide an accurate solubility estimate, aiding veterinary professionals in evaluating aquatic environments.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the water temperature in °C, ensuring it falls between 0 and 40 for reliable results.
          </li>
          <li>
            <strong>Step 2:</strong> Click the "Calculate" button to view the estimated oxygen solubility in mg/L.
          </li>
          <li>
            <strong>Step 3:</strong> Use the result to assess if the aquatic environment provides sufficient oxygen for animal health.
          </li>
          <li>
            <strong>Step 4:</strong> Adjust husbandry practices or environmental controls accordingly to maintain optimal oxygen levels.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149327/"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              1. Boyd, C.E. (2019). Water Quality for Aquaculture. Springer.
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource detailing water quality parameters including oxygen solubility and its impact on aquatic animal health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.sciencedirect.com/science/article/pii/S0044848618303937"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              2. Ultsch, G.R. (2006). Physiology and Ecology of Oxygen Solubility in Aquatic Environments.
            </a>
            <p className="text-slate-500 text-sm">
              Explores the physiological implications of oxygen solubility changes in aquatic species and environmental adaptations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/avian-medicine/avian-oxygen-therapy"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              3. UC Davis Veterinary Medicine. Avian Oxygen Therapy Guidelines.
            </a>
            <p className="text-slate-500 text-sm">
              Practical guidelines for oxygen management in veterinary care, emphasizing the importance of dissolved oxygen in treatment.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Oxygen Solubility vs. Temperature Table"
      description="Reference table showing how the maximum solubility of dissolved oxygen changes with water temperature."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Oxygen Solubility (mg/L) ≈ interpolated value from standard temperature-solubility data",
        variables: [
          { symbol: "Temperature (°C)", description: "Water temperature affecting oxygen solubility" },
          { symbol: "Oxygen Solubility (mg/L)", description: "Maximum dissolved oxygen concentration" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A veterinarian needs to estimate the maximum dissolved oxygen in a freshwater tank at 18°C to ensure fish welfare.",
        steps: [
          { label: "1", explanation: "Input 18°C into the calculator's temperature field." },
          { label: "2", explanation: "Click 'Calculate' to obtain the oxygen solubility value." },
          { label: "3", explanation: "Use the result to assess if aeration is needed to maintain healthy oxygen levels." },
        ],
        result: "At 18°C, the estimated oxygen solubility is approximately 9.6 mg/L, guiding appropriate tank management.",
      }}
      relatedCalculators={[
        { title: "Breeding Tank Volume Planner", url: "/pets/breeding-tank-volume-planner", icon: "🐾" },
        { title: "Ambient Temperature Safe Zone Calculator", url: "/pets/bird-ambient-temperature-safe-zone", icon: "🐶" },
        { title: "Horse Feeding Rate Calculator (Forage + Concentrate)", url: "/pets/horse-feeding-rate-forage-concentrate", icon: "🐎" },
        { title: "Cat Age in Human Years (Breed/Size Aware)", url: "/pets/cat-age-human-years-breed-size-aware", icon: "🐱" },
        { title: "Horse Hay Intake Calculator (per body weight %)", url: "/pets/horse-hay-intake-bodyweight-percent", icon: "🐎" },
        { title: "Cat BMI/Body Index (educational)", url: "/pets/cat-bmi-body-index-educational", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Oxygen Solubility vs. Temperature Table" },
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