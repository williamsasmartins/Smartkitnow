import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Smile,
  RotateCcw,
  Sparkles,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RocksToFloodCountryCalculator() {
  /**
   * Inputs:
   * - countryArea: area of the country in square kilometers (km²)
   * - rockVolume: average volume of one rock in cubic meters (m³)
   * - rockDensity: density of the rock in kg/m³ (optional, default granite ~2700 kg/m³)
   * - oceanVolume: volume of ocean water displaced per rock (m³) (optional, default = rockVolume)
   *
   * Goal:
   * Calculate how many rocks you need to throw into the ocean to raise sea level enough to flood the country.
   *
   * Simplified assumptions:
   * - Flooding means raising sea level by 1 meter over the country's area.
   * - Volume of water needed = countryArea (m²) * 1 m = countryArea * 1,000,000 m³ (since 1 km² = 1,000,000 m²)
   * - Each rock displaces volume equal to its volume (rockVolume)
   * - Number of rocks = volume needed / rockVolume
   *
   * This is a fun, absurd physics scenario ignoring real-world complexities.
   */

  const [inputs, setInputs] = useState({
    countryArea: "",
    rockVolume: "",
  });
  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const countryAreaNum = parseFloat(inputs.countryArea);
    const rockVolumeNum = parseFloat(inputs.rockVolume);

    // Initial state safety: if inputs empty or invalid, return neutral state
    if (
      !countryAreaNum ||
      countryAreaNum <= 0 ||
      !rockVolumeNum ||
      rockVolumeNum <= 0
    ) {
      return { value: null };
    }

    // Convert country area from km² to m²
    const countryAreaM2 = countryAreaNum * 1_000_000;

    // Volume of water needed to raise sea level by 1 meter over the country area (m³)
    const volumeNeeded = countryAreaM2 * 1; // 1 meter height

    // Number of rocks needed = volumeNeeded / rockVolume
    const rocksNeeded = volumeNeeded / rockVolumeNum;

    // Format number with commas, no decimals because rocks count is integer
    const formattedRocks = Math.ceil(rocksNeeded).toLocaleString("en-US");

    return {
      value: formattedRocks,
      label: "Rocks Needed to Flood the Country",
      subtext: `Assuming 1m sea level rise over ${countryAreaNum.toLocaleString(
        "en-US"
      )} km² and rock volume of ${rockVolumeNum.toLocaleString(
        "en-US"
      )} m³ each.`,
      color: "text-blue-600",
      icon: <Smile className="w-12 h-12" />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How is the number of rocks calculated?",
      answer:
        "The calculator estimates the volume of water needed to raise the sea level by 1 meter over the specified country's area. It then divides that volume by the volume of a single rock to find out how many rocks would be required to displace enough water to cause flooding.",
    },
    {
      question: "Why is this calculation unrealistic?",
      answer:
        "This is a purely hypothetical and absurd physics scenario. It ignores many real-world factors such as ocean currents, water displacement dynamics, and the impossibility of physically throwing enough rocks to flood a country.",
    },
    {
      question: "Can I use different rock sizes?",
      answer:
        "Yes! You can input any average rock volume in cubic meters. Larger rocks mean fewer rocks needed, while smaller rocks increase the count drastically.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="countryArea" className="mb-1 block font-semibold">
          Country Area (km²)
        </Label>
        <Input
          id="countryArea"
          type="text"
          placeholder="e.g. 500000"
          value={inputs.countryArea}
          onChange={(e) => handleInputChange("countryArea", e.target.value)}
          aria-describedby="countryAreaHelp"
        />
        <p
          id="countryAreaHelp"
          className="text-sm text-slate-500 dark:text-slate-400 mt-1"
        >
          Enter the total land area of the country in square kilometers.
        </p>
      </div>

      <div>
        <Label htmlFor="rockVolume" className="mb-1 block font-semibold">
          Average Rock Volume (m³)
        </Label>
        <Input
          id="rockVolume"
          type="text"
          placeholder="e.g. 0.1"
          value={inputs.rockVolume}
          onChange={(e) => handleInputChange("rockVolume", e.target.value)}
          aria-describedby="rockVolumeHelp"
        />
        <p
          id="rockVolumeHelp"
          className="text-sm text-slate-500 dark:text-slate-400 mt-1"
        >
          Enter the average volume of one rock in cubic meters (e.g., 0.1 m³).
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already reactive)
            setInputs((p) => ({ ...p }));
          }}
          aria-label="Calculate rocks needed"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ countryArea: "", rockVolume: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">{results.icon}</div>
            <p className={`text-5xl font-extrabold ${results.color}`}>
              {results.value}
            </p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              {results.label}
            </p>
            <p className="mt-2 text-sm italic text-slate-500">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Rocks to Flood a Country Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator explores a whimsical physics scenario where you estimate how many rocks you would need to throw into the ocean to raise the sea level enough to flood an entire country. By inputting the country's land area and the average volume of a rock, the tool calculates the total number of rocks required to displace enough water for a 1-meter rise in sea level. While this is a fun and absurd thought experiment, it highlights the immense scale of natural forces and the impracticality of such an endeavor.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Did You Know?
            </h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The total volume of Earth's oceans is approximately 1.332 billion cubic kilometers, which is about 320 million times the volume of water needed to raise the sea level by 1 meter globally. This calculator focuses on flooding a single country, but even that requires an astronomical amount of displaced water.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use the Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this estimator, enter the total land area of the country you want to flood in square kilometers. Next, input the average volume of a single rock in cubic meters. The calculator will then determine how many such rocks you would theoretically need to displace enough ocean water to raise the sea level by one meter over that country’s area. Press "Calculate" to see the result, or "Reset" to clear your inputs.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-6">
          {faqs.map(({ question, answer }, i) => (
            <div key={i}>
              <dt className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                {question}
              </dt>
              <dd className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                {answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References
        </h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://oceanservice.noaa.gov/facts/oceanvolume.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              NOAA Ocean Volume Facts <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Official data on the volume of Earth's oceans and related statistics.
            </p>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Rock_(geology)"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Wikipedia: Rock (Geology) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              General information about rock types, volumes, and densities.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Rocks to Flood a Country Estimator"
      description="Absurd physics scenario. Calculate how many rocks you would need to throw into the ocean to theoretically flood a specific country."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ IMPORTANT: Use 'symbol' and 'description' keys here!
      formula={{
        title: "The Math",
        formula: "Number of Rocks = (Country Area × 1,000,000 m²) × 1 m / Rock Volume",
        variables: [
          {
            symbol: "Country Area",
            description: "Total land area of the country in square kilometers (km²)",
          },
          {
            symbol: "Rock Volume",
            description: "Average volume of one rock in cubic meters (m³)",
          },
          {
            symbol: "1,000,000 m²",
            description: "Conversion factor from km² to m²",
          },
          {
            symbol: "1 m",
            description: "Desired sea level rise height in meters",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Suppose you want to flood a country with an area of 500,000 km² using rocks that each have a volume of 0.1 m³.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert country area to square meters: 500,000 km² × 1,000,000 = 500,000,000,000 m².",
          },
          {
            label: "2",
            explanation:
              "Calculate volume of water needed for 1 meter rise: 500,000,000,000 m² × 1 m = 500,000,000,000 m³.",
          },
          {
            label: "3",
            explanation:
              "Divide volume needed by rock volume: 500,000,000,000 m³ ÷ 0.1 m³ = 5,000,000,000,000 rocks.",
          },
        ],
        result:
          "You would need approximately 5 trillion rocks of 0.1 m³ each to flood the country by 1 meter.",
      }}
      relatedCalculators={[
        {
          title: "Ideal Egg Boiling Calculator",
          url: "/funny/ideal-egg-boiling-calculator",
          icon: "🤪",
        },
        {
          title: "Hot-Dog to Bun Mismatch Solver",
          url: "/funny/hot-dog-bun-mismatch-solver",
          icon: "🍩",
        },
        {
          title: "Cat 'Ignore-o-Meter'",
          url: "/funny/cat-ignore-o-meter",
          icon: "🐈",
        },
        {
          title: "Zombie Survival Calculator",
          url: "/funny/zombie-survival-calculator",
          icon: "🧟",
        },
        {
          title: "Love Meter (Name Compatibility)",
          url: "/funny/love-meter",
          icon: "❤️",
        },
        {
          title: "Drake Equation Calculator",
          url: "/funny/drake-equation-calculator",
          icon: "🤪",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}