import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Calculator, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumFilterFlowRateCalculator() {
  // 1. STATE
  // Unit system default to imperial (gallons, LPH/GPH)
  const [unit, setUnit] = useState("imperial");

  // Inputs: Tank Volume and Turnover Rate (times per hour)
  const [inputs, setInputs] = useState({
    tankVolume: "",
    turnoverRate: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Filter Flow Rate = Tank Volume × Turnover Rate
  // Units: 
  // - Tank Volume: gallons (imperial) or liters (metric)
  // - Turnover Rate: times per hour (unitless)
  // - Result: flow rate in GPH (imperial) or LPH (metric)
  const results = useMemo(() => {
    const tankVolumeNum = parseFloat(inputs.tankVolume);
    const turnoverRateNum = parseFloat(inputs.turnoverRate);

    if (
      isNaN(tankVolumeNum) ||
      tankVolumeNum <= 0 ||
      isNaN(turnoverRateNum) ||
      turnoverRateNum <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const flowRate = tankVolumeNum * turnoverRateNum;

    return {
      value: flowRate.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }),
      label:
        unit === "imperial"
          ? "Gallons Per Hour (GPH)"
          : "Liters Per Hour (LPH)",
      subtext: `Recommended minimum flow rate to adequately turn over your aquarium volume ${turnoverRateNum} times per hour.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is filter flow rate important for aquarium health?",
      answer:
        "Filter flow rate is crucial because it determines how often the entire volume of water in the aquarium is circulated and filtered each hour. Proper turnover helps maintain water clarity, removes toxins, and ensures oxygenation, which is vital for fish and aquatic plants. Without adequate flow, waste can accumulate, leading to poor water quality and unhealthy conditions.",
    },
    {
      question: "How do I determine the appropriate turnover rate for my aquarium?",
      answer:
        "The turnover rate depends on the type of aquatic life and the tank setup. Generally, freshwater tanks require a turnover rate of 4-6 times per hour, while saltwater or reef tanks may need 10 or more times per hour due to higher biological demands. Consulting species-specific guidelines helps ensure the filter flow supports optimal water quality and habitat conditions.",
    },
    {
      question: "Can too high a filter flow rate harm my aquarium inhabitants?",
      answer:
        "Yes, excessively high flow rates can stress fish and delicate aquatic plants by creating strong currents that disrupt their natural behavior and habitat. Some species prefer calm waters and may become fatigued or injured if the water movement is too vigorous. It's important to balance filtration efficiency with the comfort and needs of your aquarium inhabitants.",
    },
    {
      question: "How does tank volume unit affect filter flow rate calculation?",
      answer:
        "Tank volume units directly impact the flow rate calculation since flow rate is volume multiplied by turnover rate. Using gallons or liters consistently ensures accurate results. Mixing units without conversion can lead to incorrect flow rates, potentially causing under- or over-filtration, which affects aquarium health and maintenance.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Unit system selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border rounded px-3 py-2 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="imperial">Imperial (Gallons)</option>
            <option value="metric">Metric (Liters)</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="tankVolume" className="text-slate-700 dark:text-slate-300">
            Aquarium Tank Volume ({unit === "imperial" ? "Gallons" : "Liters"})
          </Label>
          <Input
            id="tankVolume"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter tank volume in ${unit === "imperial" ? "gallons" : "liters"}`}
            value={inputs.tankVolume}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, tankVolume: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="turnoverRate" className="text-slate-700 dark:text-slate-300">
            Desired Turnover Rate (times per hour)
          </Label>
          <Input
            id="turnoverRate"
            type="number"
            min="0"
            step="any"
            placeholder="Enter how many times the water should cycle per hour"
            value={inputs.turnoverRate}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, turnoverRate: e.target.value }))
            }
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
          onClick={() => setInputs({ tankVolume: "", turnoverRate: "" })}
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
                Estimated Filter Flow Rate
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet or aquatic specialist for diagnosis and personalized advice.
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
          Understanding Filter Flow Rate Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Filter Flow Rate Calculator is an essential tool designed to help aquarium enthusiasts and professionals determine the minimum flow rate required to adequately circulate and filter the water in an aquarium. Proper water turnover is critical for maintaining a healthy aquatic environment, as it ensures the removal of waste products, supports oxygenation, and promotes stable water chemistry. This calculator simplifies the process by using the tank volume and desired turnover rate to estimate the necessary filter flow rate.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding the flow rate is particularly important because different aquatic species and tank setups require varying levels of water movement. For example, freshwater community tanks typically need a moderate turnover rate, while reef tanks or heavily stocked aquariums demand higher flow rates to sustain biological filtration and nutrient cycling. By accurately calculating the filter flow rate, aquarists can select appropriate filtration equipment that meets the specific needs of their aquatic environment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, this calculator helps prevent common issues such as under-filtration, which can lead to toxic buildup and poor water quality, or over-filtration, which may stress fish and plants due to excessive water movement. By providing a clear, science-based estimate, this tool supports better aquarium management and healthier aquatic life.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Filter Flow Rate Calculator is straightforward and user-friendly. Begin by selecting your preferred unit system—Imperial for gallons or Metric for liters. Next, input the total volume of your aquarium tank in the chosen unit. Then, enter the desired turnover rate, which represents how many times per hour you want the entire tank volume to be filtered. This rate varies depending on the type of aquarium and its inhabitants.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) that matches your tank volume measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the aquarium tank volume in gallons or liters.
          </li>
          <li>
            <strong>Step 3:</strong> Input the desired turnover rate (times per hour), typically between 4-6 for freshwater tanks or higher for reef tanks.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see the recommended minimum filter flow rate in gallons per hour (GPH) or liters per hour (LPH).
          </li>
          <li>
            <strong>Step 5:</strong> Use this result to select a filter that meets or exceeds the calculated flow rate for optimal aquarium health.
          </li>
        </ul>
      </section>

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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.aquariumcarebasics.com/filter-flow-rate/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Aquarium Care Basics: Filter Flow Rate Explained
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on aquarium filtration principles, including flow rate recommendations for different tank types and inhabitants.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.vetmed.ufl.edu/education/aquatic-medicine/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. University of Florida Aquatic Medicine Program
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary insights into aquatic animal health, emphasizing water quality and filtration as key factors in disease prevention.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aquariumsource.com/aquarium-filter-flow-rate/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Aquarium Source: Choosing the Right Filter Flow Rate
            </a>
            <p className="text-slate-500 text-sm">
              Practical advice on selecting filter flow rates tailored to aquarium size and species requirements, promoting optimal aquatic environments.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Filter Flow Rate Calculator"
      description="Calculate the minimum required filter flow rate (LPH/GPH) to turn over the tank volume adequately."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Filter Flow Rate = Tank Volume × Turnover Rate",
        variables: [
          { symbol: "Tank Volume", description: "Total volume of the aquarium (gallons or liters)" },
          { symbol: "Turnover Rate", description: "Number of times the water should cycle per hour" },
          { symbol: "Filter Flow Rate", description: "Required filter flow rate in GPH or LPH" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A freshwater aquarium holds 50 gallons and requires a turnover rate of 5 times per hour to maintain optimal water quality.",
        steps: [
          { label: "1", explanation: "Identify tank volume: 50 gallons." },
          { label: "2", explanation: "Determine desired turnover rate: 5 times per hour." },
          { label: "3", explanation: "Calculate filter flow rate: 50 × 5 = 250 GPH." },
        ],
        result: "The aquarium needs a filter with a minimum flow rate of 250 gallons per hour to ensure proper water turnover.",
      }}
      relatedCalculators={[
        {
          title: "Life Expectancy Estimator (lifestyle factors; educational)",
          url: "/pets/cat-life-expectancy-estimator",
          icon: "🐱",
        },
        {
          title: "Safe Stocking Density (Fish/cm per Litre)",
          url: "/pets/aquarium-safe-stocking-density-fish-per-litre",
          icon: "🐶",
        },
        {
          title: "Cat Harness Size & Fit Guide",
          url: "/pets/cat-harness-size-fit-guide",
          icon: "🐱",
        },
        {
          title: "Cat Grape/Raisin Exposure Risk (educational)",
          url: "/pets/cat-grape-raisin-exposure-risk",
          icon: "🐱",
        },
        {
          title: "pH Adjustment (Acid/Base Buffer) Calculator",
          url: "/pets/aquarium-ph-adjustment-buffer",
          icon: "💉",
        },
        {
          title: "Indoor/Outdoor Activity Calorie Adjuster",
          url: "/pets/cat-activity-calorie-adjuster",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Filter Flow Rate Calculator" },
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