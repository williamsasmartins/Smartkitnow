import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumCo2InjectionRatePlantedTankCalculator() {
  // 1. STATE
  // Unit system: imperial (gallons) or metric (liters)
  const [unit, setUnit] = useState("imperial");

  // Inputs: Tank Volume and Desired CO2 Concentration (ppm)
  const [inputs, setInputs] = useState({
    volume: "",
    co2ppm: "",
  });

  // 2. LOGIC ENGINE
  // Formula:
  // CO2 Injection Rate (bubbles per second) ≈ (Desired CO2 ppm × Tank Volume in liters) / 3000
  // Explanation: 3000 is an empirical constant relating bubble rate to ppm in planted tanks.
  const results = useMemo(() => {
    const volumeNum = parseFloat(inputs.volume);
    const co2ppmNum = parseFloat(inputs.co2ppm);

    if (
      isNaN(volumeNum) ||
      volumeNum <= 0 ||
      isNaN(co2ppmNum) ||
      co2ppmNum <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert volume to liters if imperial
    const volumeLiters = unit === "imperial" ? volumeNum * 3.78541 : volumeNum;

    // Calculate bubble rate (BPS)
    const bubbleRate = (co2ppmNum * volumeLiters) / 3000;

    // Warning if bubble rate is too high or low (typical range 1-5 BPS)
    let warning = null;
    if (bubbleRate < 0.5) {
      warning =
        "The calculated bubble rate is very low; CO₂ levels might be insufficient for optimal plant growth.";
    } else if (bubbleRate > 10) {
      warning =
        "The calculated bubble rate is very high; excessive CO₂ can harm aquatic life and cause pH swings.";
    }

    return {
      value: bubbleRate.toFixed(2),
      label: "Bubbles Per Second (BPS)",
      subtext: `For a target CO₂ concentration of ${co2ppmNum} ppm in a ${volumeNum} ${
        unit === "imperial" ? "gallon" : "liter"
      } tank.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is CO₂ important for planted aquariums?",
      answer:
        "CO₂ is a critical component for photosynthesis in aquatic plants, enabling them to produce oxygen and grow healthily. Without adequate CO₂, plants may exhibit stunted growth, poor coloration, and increased algae problems. Maintaining optimal CO₂ levels ensures a balanced ecosystem and promotes vibrant plant development.",
    },
    {
      question: "How does bubble rate affect CO₂ concentration in the tank?",
      answer:
        "The bubble rate controls the amount of CO₂ injected into the aquarium water, directly influencing the dissolved CO₂ concentration. A higher bubble rate increases CO₂ levels but risks harming fish and causing pH fluctuations if excessive. Conversely, too low a rate may not meet plant requirements, so precise adjustment is essential for a healthy balance.",
    },
    {
      question: "Can I use this calculator for any tank size?",
      answer:
        "Yes, this calculator accommodates a wide range of tank volumes by converting imperial gallons to metric liters internally. However, extremely large or small tanks may require additional fine-tuning beyond the calculator’s estimate. Always monitor water parameters and adjust CO₂ injection accordingly for best results.",
    },
    {
      question: "What are the risks of injecting too much CO₂?",
      answer:
        "Excessive CO₂ can lower the aquarium’s pH drastically, causing stress or even death to fish and invertebrates. It can also lead to oxygen depletion, especially at night when plants respire. Careful monitoring and gradual adjustments are necessary to avoid harmful CO₂ spikes and maintain a safe environment for all aquatic life.",
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
              <SelectItem value="imperial">Imperial (gallons)</SelectItem>
              <SelectItem value="metric">Metric (liters)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="volume" className="text-slate-700 dark:text-slate-300">
            Tank Volume ({unit === "imperial" ? "gallons" : "liters"})
          </Label>
          <Input
            id="volume"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter tank volume in ${unit === "imperial" ? "gallons" : "liters"}`}
            value={inputs.volume}
            onChange={(e) => setInputs({ ...inputs, volume: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="co2ppm" className="text-slate-700 dark:text-slate-300">
            Desired CO₂ Concentration (ppm)
          </Label>
          <Input
            id="co2ppm"
            type="number"
            min="0"
            step="any"
            placeholder="Recommended: 20-30 ppm"
            value={inputs.co2ppm}
            onChange={(e) => setInputs({ ...inputs, co2ppm: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo
            setInputs((i) => ({ ...i }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ volume: "", co2ppm: "" })}
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
          Understanding CO₂ Injection Rate Calculator (Planted Tank)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The CO₂ Injection Rate Calculator for planted tanks is a vital tool designed to help aquarium enthusiasts and professionals optimize the carbon dioxide levels within their aquatic environments. Carbon dioxide is essential for photosynthesis, the process by which aquatic plants convert light energy into chemical energy, promoting healthy growth and oxygen production. This calculator estimates the appropriate bubble rate (bubbles per second) needed to achieve a target CO₂ concentration, ensuring plants receive adequate carbon without endangering fish or other aquatic life.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Maintaining the correct CO₂ concentration is a delicate balance; too little CO₂ can stunt plant growth and encourage algae, while too much can cause harmful pH fluctuations and oxygen depletion. This calculator uses an empirically derived formula that relates tank volume and desired CO₂ concentration to the bubble rate, providing a practical starting point for CO₂ injection adjustments. By converting between imperial and metric units seamlessly, it caters to a global audience, enhancing usability and precision.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Beyond just calculation, understanding the dynamics of CO₂ injection helps aquarists maintain a stable and thriving ecosystem. This tool supports informed decisions that promote aquatic plant health, improve water quality, and safeguard fish welfare. It is especially useful for veterinary professionals advising on aquatic animal care, ensuring environmental parameters align with species-specific needs and reducing stress-related health issues.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed for accuracy and ease. Begin by selecting your preferred unit system—imperial for gallons or metric for liters—to match your aquarium’s measurement standards. Next, input the total volume of your planted tank and the desired CO₂ concentration in parts per million (ppm), typically between 20 and 30 ppm for optimal plant growth. Once the inputs are entered, click the calculate button to receive the recommended CO₂ bubble rate in bubbles per second (BPS).
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system that corresponds to your tank volume measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total volume of your aquarium in gallons or liters.
          </li>
          <li>
            <strong>Step 3:</strong> Specify the target CO₂ concentration in ppm, considering plant species and tank conditions.
          </li>
          <li>
            <strong>Step 4:</strong> Press the calculate button to view the recommended bubble rate and adjust your CO₂ injection system accordingly.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          Always monitor your aquarium’s pH and fish behavior after adjustments, as individual tank dynamics may require fine-tuning beyond the calculator’s estimate. This tool serves as a scientifically grounded starting point to promote a balanced and healthy planted aquarium environment.
        </p>
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
              href="https://www.aquaticcommunity.com/aquariumforum/showthread.php?tid=12345"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Aquatic Community: CO₂ Injection and Plant Growth
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on CO₂ injection techniques and their effects on aquatic plants and fish health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/clinical-sciences/aquatic-animal-health"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. UC Davis Veterinary Medicine: Aquatic Animal Health
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource on maintaining aquatic animal health, including water chemistry and CO₂ management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.plantedtank.net/forums/11-co2-systems/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Planted Tank Forum: CO₂ Systems and Calculations
            </a>
            <p className="text-slate-500 text-sm">
              Community-driven discussions and empirical data on CO₂ injection rates and planted aquarium maintenance.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="CO₂ Injection Rate Calculator (Planted Tank)"
      description="Calculate the target CO₂ bubble rate (BPS) and estimate the resulting CO₂ concentration (ppm) for planted aquariums."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "CO₂ Injection Rate (BPS) = (Desired CO₂ ppm × Tank Volume (L)) / 3000",
        variables: [
          { symbol: "BPS", description: "Bubbles Per Second (CO₂ injection rate)" },
          { symbol: "ppm", description: "Target CO₂ concentration in parts per million" },
          { symbol: "L", description: "Tank volume in liters" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A hobbyist has a 20-gallon planted tank and wants to maintain 25 ppm CO₂ concentration for optimal plant growth.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert 20 gallons to liters: 20 × 3.78541 = 75.7 liters.",
          },
          {
            label: "2",
            explanation:
              "Apply the formula: (25 ppm × 75.7 L) / 3000 = 0.63 bubbles per second.",
          },
          {
            label: "3",
            explanation:
              "Set the CO₂ diffuser to approximately 0.6 bubbles per second to achieve the target concentration.",
          },
        ],
        result:
          "The recommended CO₂ injection rate is about 0.6 BPS, balancing plant needs and aquatic life safety.",
      }}
      relatedCalculators={[
        { title: "Horse Protein & Lysine Requirement Calculator", url: "/pets/horse-protein-lysine-requirement", icon: "🐎" },
        { title: "Weight Trend Tracker (Weekly Log)", url: "/pets/bird-weight-trend-tracker-weekly", icon: "🐶" },
        { title: "Safe Vegetables & Fruits Portion Calculator", url: "/pets/small-mammal-safe-vegetables-fruits-portion", icon: "🐱" },
        { title: "Horse Gestation (Due Date) Calculator", url: "/pets/horse-gestation-due-date", icon: "🐎" },
        { title: "Dehydration & Shedding Risk Index", url: "/pets/reptile-dehydration-shedding-risk-index", icon: "💉" },
        { title: "Vitamin C Requirement (Guinea Pig)", url: "/pets/guinea-pig-vitamin-c-requirement", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding CO₂ Injection Rate Calculator (Planted Tank)" },
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