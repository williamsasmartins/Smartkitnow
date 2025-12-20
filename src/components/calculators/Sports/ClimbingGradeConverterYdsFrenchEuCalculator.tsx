import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Activity,
  Timer,
  TrendingUp,
  Dumbbell,
  Trophy,
  Medal,
  Flag,
  Flame,
  Zap,
  Heart,
  Scale,
  Calculator,
  Info,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Waves,
  Gauge,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const gradeScales = {
  yds: [
    "5.0",
    "5.1",
    "5.2",
    "5.3",
    "5.4",
    "5.5",
    "5.6",
    "5.7",
    "5.8",
    "5.9",
    "5.10a",
    "5.10b",
    "5.10c",
    "5.10d",
    "5.11a",
    "5.11b",
    "5.11c",
    "5.11d",
    "5.12a",
    "5.12b",
    "5.12c",
    "5.12d",
    "5.13a",
    "5.13b",
    "5.13c",
    "5.13d",
    "5.14a",
    "5.14b",
    "5.14c",
    "5.14d",
    "5.15a",
    "5.15b",
    "5.15c",
    "5.15d",
  ],
  french: [
    "3",
    "4a",
    "4b",
    "4c",
    "5a",
    "5b",
    "5c",
    "6a",
    "6a+",
    "6b",
    "6b+",
    "6c",
    "6c+",
    "7a",
    "7a+",
    "7b",
    "7b+",
    "7c",
    "7c+",
    "8a",
    "8a+",
    "8b",
    "8b+",
    "8c",
    "8c+",
    "9a",
    "9a+",
    "9b",
    "9b+",
    "9c",
  ],
  eu: [
    "III",
    "IV",
    "IV+",
    "V-",
    "V",
    "V+",
    "VI-",
    "VI",
    "VI+",
    "VII-",
    "VII",
    "VII+",
    "VIII-",
    "VIII",
    "VIII+",
    "IX-",
    "IX",
    "IX+",
    "X-",
    "X",
    "X+",
    "XI-",
    "XI",
    "XI+",
    "XII-",
    "XII",
    "XII+",
    "XIII-",
    "XIII",
    "XIII+",
  ],
};

// Mapping YDS index to French and EU indexes (approximate)
const ydsToFrenchIndex = [
  0, // 5.0 -> 3
  1, // 5.1 -> 4a
  2, // 5.2 -> 4b
  3, // 5.3 -> 4c
  4, // 5.4 -> 5a
  5, // 5.5 -> 5b
  6, // 5.6 -> 5c
  7, // 5.7 -> 6a
  8, // 5.8 -> 6a+
  9, // 5.9 -> 6b
  10, // 5.10a -> 6b+
  11, // 5.10b -> 6c
  12, // 5.10c -> 6c+
  13, // 5.10d -> 7a
  14, // 5.11a -> 7a+
  15, // 5.11b -> 7b
  16, // 5.11c -> 7b+
  17, // 5.11d -> 7c
  18, // 5.12a -> 7c+
  19, // 5.12b -> 8a
  20, // 5.12c -> 8a+
  21, // 5.12d -> 8b
  22, // 5.13a -> 8b+
  23, // 5.13b -> 8c
  24, // 5.13c -> 8c+
  25, // 5.13d -> 9a
  26, // 5.14a -> 9a+
  27, // 5.14b -> 9b
  28, // 5.14c -> 9b+
  29, // 5.14d -> 9c
  30, // 5.15a -> 9c (top scale)
  31, // 5.15b -> 9c (top scale)
  32, // 5.15c -> 9c (top scale)
  33, // 5.15d -> 9c (top scale)
];

const ydsToEuIndex = [
  0, // 5.0 -> III
  1, // 5.1 -> IV
  2, // 5.2 -> IV+
  3, // 5.3 -> V-
  4, // 5.4 -> V
  5, // 5.5 -> V+
  6, // 5.6 -> VI-
  7, // 5.7 -> VI
  8, // 5.8 -> VI+
  9, // 5.9 -> VII-
  10, // 5.10a -> VII
  11, // 5.10b -> VII+
  12, // 5.10c -> VIII-
  13, // 5.10d -> VIII
  14, // 5.11a -> VIII+
  15, // 5.11b -> IX-
  16, // 5.11c -> IX
  17, // 5.11d -> IX+
  18, // 5.12a -> X-
  19, // 5.12b -> X
  20, // 5.12c -> X+
  21, // 5.12d -> XI-
  22, // 5.13a -> XI
  23, // 5.13b -> XI+
  24, // 5.13c -> XII-
  25, // 5.13d -> XII
  26, // 5.14a -> XII+
  27, // 5.14b -> XIII-
  28, // 5.14c -> XIII
  29, // 5.14d -> XIII+
  30, // 5.15a -> XIII+ (top scale)
  31, // 5.15b -> XIII+ (top scale)
  32, // 5.15c -> XIII+ (top scale)
  33, // 5.15d -> XIII+ (top scale)
];

function findIndexInScale(scale, grade) {
  return scale.findIndex((g) => g.toLowerCase() === grade.toLowerCase());
}

function clampIndex(index, max) {
  if (index < 0) return 0;
  if (index > max) return max;
  return index;
}

export default function ClimbingGradeConverterYdsFrenchEuCalculator() {
  const [inputs, setInputs] = useState({ scale: "yds", grade: "" });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const { scale, grade } = inputs;
    if (!scale || !grade) return { value: "", label: "", subtext: "", warning: null, formulaUsed: "" };

    let ydsIndex = -1;
    let frenchIndex = -1;
    let euIndex = -1;

    if (scale === "yds") {
      ydsIndex = findIndexInScale(gradeScales.yds, grade);
      if (ydsIndex === -1) return { value: "", label: "", subtext: `Grade "${grade}" not recognized in YDS scale.`, warning: true, formulaUsed: "" };
      frenchIndex = ydsToFrenchIndex[ydsIndex];
      euIndex = ydsToEuIndex[ydsIndex];
    } else if (scale === "french") {
      frenchIndex = findIndexInScale(gradeScales.french, grade);
      if (frenchIndex === -1) return { value: "", label: "", subtext: `Grade "${grade}" not recognized in French scale.`, warning: true, formulaUsed: "" };
      // Find closest yds index by reverse lookup
      ydsIndex = ydsToFrenchIndex.findIndex((fi) => fi === frenchIndex);
      if (ydsIndex === -1) {
        // If not found, approximate by closest
        ydsIndex = ydsToFrenchIndex.reduce((prev, curr, idx) => {
          return Math.abs(curr - frenchIndex) < Math.abs(ydsToFrenchIndex[prev] - frenchIndex) ? idx : prev;
        }, 0);
      }
      euIndex = ydsToEuIndex[ydsIndex];
    } else if (scale === "eu") {
      euIndex = findIndexInScale(gradeScales.eu, grade);
      if (euIndex === -1) return { value: "", label: "", subtext: `Grade "${grade}" not recognized in European scale.`, warning: true, formulaUsed: "" };
      // Find closest yds index by reverse lookup
      ydsIndex = ydsToEuIndex.findIndex((ei) => ei === euIndex);
      if (ydsIndex === -1) {
        ydsIndex = ydsToEuIndex.reduce((prev, curr, idx) => {
          return Math.abs(curr - euIndex) < Math.abs(ydsToEuIndex[prev] - euIndex) ? idx : prev;
        }, 0);
      }
      frenchIndex = ydsToFrenchIndex[ydsIndex];
    }

    // Clamp indexes to valid ranges
    ydsIndex = clampIndex(ydsIndex, gradeScales.yds.length - 1);
    frenchIndex = clampIndex(frenchIndex, gradeScales.french.length - 1);
    euIndex = clampIndex(euIndex, gradeScales.eu.length - 1);

    return {
      value: "",
      label: "",
      subtext: "",
      warning: null,
      formulaUsed: "Conversion based on established grade equivalences and consensus tables.",
      yds: gradeScales.yds[ydsIndex],
      french: gradeScales.french[frenchIndex],
      eu: gradeScales.eu[euIndex],
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do climbing grades differ between regions?",
      answer:
        "Climbing grades vary globally due to differences in climbing styles, rock types, and historical grading systems. For example, the Yosemite Decimal System (YDS) is common in the US, while the French and European scales are prevalent in Europe. Each system reflects local climbing culture and difficulty perception, making direct comparisons challenging without a converter.",
    },
    {
      question: "Can I rely on grade conversions for training and planning?",
      answer:
        "Grade conversions provide a useful approximation to understand route difficulty across systems, but they are not exact. Variations in route style, protection, and personal strengths mean that a grade in one system might feel harder or easier than its equivalent. Use conversions as a guideline, but always consider local context and personal experience.",
    },
    {
      question: "How often are climbing grade conversion tables updated?",
      answer:
        "Conversion tables are periodically updated as climbing evolves and new routes push difficulty boundaries. Consensus among climbers and guidebooks helps refine these tables. However, because grading is subjective, no conversion is perfect. It's best to stay informed through climbing communities and updated resources.",
    },
    {
      question: "What should I do if my grade isn't listed in the converter?",
      answer:
        "If your grade isn't listed, it might be a very new or rare grade, or a sub-grade not included in standard tables. In such cases, try to find the closest grade available or consult local climbing guides and experts. You can also provide feedback to improve the converter's database for future updates.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="scale" className="mb-1 flex items-center gap-1">
          Select Input Scale <Scale className="w-4 h-4 text-blue-600" />
        </Label>
        <Select
          value={inputs.scale || "yds"}
          onValueChange={(v) => handleInputChange("scale", v)}
          aria-label="Select climbing grade scale"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select scale" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yds">Yosemite Decimal System (YDS)</SelectItem>
            <SelectItem value="french">French Scale</SelectItem>
            <SelectItem value="eu">European (UIAA) Scale</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="grade" className="mb-1 flex items-center gap-1">
          Enter Grade <Calculator className="w-4 h-4 text-blue-600" />
        </Label>
        <Input
          id="grade"
          type="text"
          placeholder={`Enter grade (e.g. ${inputs.scale === "french" ? "6a" : inputs.scale === "eu" ? "VII" : "5.10a"})`}
          value={inputs.grade || ""}
          onChange={(e) => handleInputChange("grade", e.target.value.trim())}
          spellCheck={false}
          autoComplete="off"
          aria-describedby="gradeHelp"
        />
        <p id="gradeHelp" className="text-xs text-slate-500 mt-1">
          Input is case-insensitive. Use standard grade notation for selected scale.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
          aria-label="Calculate climbing grade conversion"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ scale: "yds", grade: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-red-50 border-red-300 dark:bg-red-900 dark:border-red-700 border shadow-sm">
          <CardContent className="p-4 text-center text-red-700 dark:text-red-300 font-semibold">{results.subtext}</CardContent>
        </Card>
      )}

      {!results.warning && results.yds && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-4xl font-extrabold text-blue-900 dark:text-white">Equivalent Grades</p>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">YDS</p>
                <p className="text-3xl font-semibold">{results.yds}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">French</p>
                <p className="text-3xl font-semibold">{results.french}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">European (UIAA)</p>
                <p className="text-3xl font-semibold">{results.eu}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 italic">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Climbing Grade Converter</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Climbing grades are a standardized way to communicate the difficulty of climbing routes. However, multiple grading systems exist worldwide, each developed to suit local climbing styles, rock types, and cultural preferences. The most common systems include the Yosemite Decimal System (YDS) used primarily in North America, the French grading scale popular in Europe, and the UIAA (European) scale used in parts of Central Europe.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This converter bridges the gap between these systems, allowing climbers to understand and compare route difficulties across different regions. It uses consensus-based equivalences derived from climbing guidebooks, expert opinions, and community feedback to provide approximate conversions. While no conversion is perfect due to subjective grading and route variability, this tool offers a reliable reference point.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding these grades helps climbers plan trips, set training goals, and communicate effectively with climbers from other regions. It also aids in assessing progression and setting realistic challenges based on known difficulty levels.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The climbing grade converter is designed to be intuitive and accessible, supporting climbers of all levels in their journey to master the vertical world.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the climbing grade converter is straightforward. First, select the grading system you want to convert from using the dropdown menu. The available options are the Yosemite Decimal System (YDS), French scale, and European (UIAA) scale. Each system has its unique notation and range of grades.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Next, enter the climbing grade you want to convert in the input box. Ensure you use the correct notation for the selected scale — for example, "5.10a" for YDS, "6a+" for French, or "VII" for European. The input is case-insensitive, but accuracy in notation ensures the best conversion results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After entering your grade, click the "Calculate" button to see the equivalent grades in the other two systems. The results will display below, showing the closest matching grades based on established conversion tables. If the input grade is not recognized, a warning message will guide you to check your input.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          You can reset the inputs anytime using the "Reset" button to start a new conversion. This tool is reactive, so you can also change inputs and see results update instantly.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300 mt-4">
          <li>
            <strong>Step 1:</strong> Select the input grading scale (YDS, French, or European).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the climbing grade in the selected scale.
          </li>
          <li>
            <strong>Step 3:</strong> Click "Calculate" to view equivalent grades.
          </li>
          <li>
            <strong>Step 4:</strong> Use the results to understand route difficulty across systems.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When training for climbing, understanding your target grade across different systems can help you set clear, achievable goals. Use the converter to benchmark your current level and identify the next grade to aim for, regardless of the grading system used in your local gym or outdoor crag.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporate a mix of endurance, strength, and technique training tailored to the demands of your target grades. For example, routes graded 5.10 and above often require finger strength and precise footwork, while lower grades may emphasize movement fluidity and balance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Regularly test yourself on routes or problems at your current grade and one grade above to monitor progress. Use the conversion tool to understand how your performance might translate when climbing abroad or on different rock types.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, remember that climbing is as much mental as physical. Build confidence gradually, respect your limits, and use the grade converter as a guide, not a strict rule.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.mountainproject.com/guide/105745857/yosemite-decimal-system"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Mountain Project - Yosemite Decimal System <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guide to the YDS grading system, widely used in North America for rock climbing difficulty.
            </p>
          </li>
          <li>
            <a
              href="https://www.ukclimbing.com/articles/skills/understanding_climbing_grades-11194"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              UKClimbing - Understanding Climbing Grades <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed explanation of various climbing grading systems and their comparisons, including French and UIAA scales.
            </p>
          </li>
          <li>
            <a
              href="https://www.planetmountain.com/en/news/climbing/conversion-tables-for-climbing-grades.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              PlanetMountain - Conversion Tables for Climbing Grades <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Authoritative resource providing conversion tables and insights into the nuances of climbing grade systems worldwide.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Climbing Grade Converter"
      description="Convert climbing grades. Switch between YDS, French, and European scales to understand route difficulty worldwide."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Conversion based on consensus equivalence tables between YDS, French, and European (UIAA) climbing grades.",
        variables: [
          { symbol: "YDS", description: "Yosemite Decimal System grade" },
          { symbol: "French", description: "French climbing grade" },
          { symbol: "EU", description: "European UIAA climbing grade" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You are planning a climbing trip to Europe but are familiar only with the YDS grades used in your local gym. You want to understand what a 5.11a route corresponds to in the French and European systems.",
        steps: [
          { label: "Step 1", explanation: "Select 'YDS' as your input scale." },
          { label: "Step 2", explanation: "Enter '5.11a' in the grade input field." },
          { label: "Step 3", explanation: "Click 'Calculate' to see the equivalent grades." },
          { label: "Step 4", explanation: "Review the results: French 7a+, European IX-." },
        ],
        result: "You now know that a 5.11a route is approximately a 7a+ in French grading and IX- in European UIAA grading.",
      }}
      relatedCalculators={[
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "Golf Expected Putts per Round", url: "/sports/golf-expected-putts-per-round", icon: "⛳" },
        { title: "Macronutrient Calculator (Sports)", url: "/sports/macronutrient-calculator", icon: "🏆" },
        { title: "Ground Ball to Fly Ball Ratio (GB/FB)", url: "/sports/ground-ball-to-fly-ball-ratio-gb-fb", icon: "⚽" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Training Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}