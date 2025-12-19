import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Activity, Timer, TrendingUp, Dumbbell, Trophy, Medal, Flag, Flame, Zap, Heart, Scale, Calculator, Info, RotateCcw, AlertTriangle, BookOpen, ExternalLink, Waves, Gauge } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const gradeSystems = [
  { value: "yds", label: "Yosemite Decimal System (YDS)" },
  { value: "french", label: "French Sport Grade" },
  { value: "uiaa", label: "UIAA (European)" },
  { value: "british", label: "British Trad Grade" },
  { value: "vscale", label: "V-Scale (Bouldering)" },
  { value: "font", label: "Fontainebleau (Bouldering)" },
];

// Mapping climbing grades between YDS, French, UIAA, British Trad, and Bouldering scales.
// These mappings are based on consensus from climbing guidebooks and international climbing federations.
// Note: Climbing grades are inherently subjective and can vary by region and route style.

const gradeConversionTable = [
  // Format: { yds, french, uiaa, british, vscale, font }
  { yds: "5.5", french: "4a", uiaa: "IV", british: "HS", vscale: null, font: null },
  { yds: "5.6", french: "4b", uiaa: "IV+", british: "VS 4c", vscale: null, font: null },
  { yds: "5.7", french: "5a", uiaa: "V-", british: "VS 5a", vscale: null, font: null },
  { yds: "5.8", french: "5b", uiaa: "V", british: "HVS 4b", vscale: null, font: null },
  { yds: "5.9", french: "5c", uiaa: "V+", british: "HVS 5a", vscale: null, font: null },
  { yds: "5.10a", french: "6a", uiaa: "VI-", british: "E1 5b", vscale: "V0", font: "5" },
  { yds: "5.10b", french: "6a+", uiaa: "VI", british: "E2 5c", vscale: "V1", font: "5+" },
  { yds: "5.10c", french: "6b", uiaa: "VI+", british: "E2 6a", vscale: "V2", font: "6A" },
  { yds: "5.10d", french: "6b+", uiaa: "VII-", british: "E3 6a", vscale: "V3", font: "6A+" },
  { yds: "5.11a", french: "6c", uiaa: "VII", british: "E3 6b", vscale: "V4", font: "6B" },
  { yds: "5.11b", french: "6c+", uiaa: "VII+", british: "E4 6b", vscale: "V5", font: "6B+" },
  { yds: "5.11c", french: "7a", uiaa: "VIII-", british: "E4 6c", vscale: "V6", font: "6C" },
  { yds: "5.11d", french: "7a+", uiaa: "VIII", british: "E5 6c", vscale: "V7", font: "6C+" },
  { yds: "5.12a", french: "7b", uiaa: "VIII+", british: "E5 7a", vscale: "V8", font: "7A" },
  { yds: "5.12b", french: "7b+", uiaa: "IX-", british: "E6 7a", vscale: "V9", font: "7A+" },
  { yds: "5.12c", french: "7c", uiaa: "IX", british: "E6 7b", vscale: "V10", font: "7B" },
  { yds: "5.12d", french: "7c+", uiaa: "IX+", british: "E7 7b", vscale: "V11", font: "7B+" },
  { yds: "5.13a", french: "8a", uiaa: "X-", british: "E7 7c", vscale: "V12", font: "7C" },
  { yds: "5.13b", french: "8a+", uiaa: "X", british: "E8 7c", vscale: "V13", font: "7C+" },
  { yds: "5.13c", french: "8b", uiaa: "X+", british: "E8 7c", vscale: "V14", font: "8A" },
  { yds: "5.13d", french: "8b+", uiaa: "XI-", british: "E9 7c", vscale: "V15", font: "8A+" },
  { yds: "5.14a", french: "8c", uiaa: "XI", british: "E9 8a", vscale: "V16", font: "8B" },
  { yds: "5.14b", french: "8c+", uiaa: "XI+", british: "E10 8a", vscale: "V17", font: "8B+" },
  { yds: "5.14c", french: "9a", uiaa: "XII-", british: "E10 8b", vscale: "V17+", font: "8C" },
  { yds: "5.14d", french: "9a+", uiaa: "XII", british: "E11 8b", vscale: null, font: "8C+" },
  { yds: "5.15a", french: "9b", uiaa: "XII+", british: "E11 8c", vscale: null, font: "9A" },
  { yds: "5.15b", french: "9b+", uiaa: "XIII-", british: "E12 8c", vscale: null, font: "9A+" },
  { yds: "5.15c", french: "9c", uiaa: "XIII", british: "E12 9a", vscale: null, font: "9B" },
  { yds: "5.15d", french: "9c+", uiaa: "XIII+", british: "E12 9a+", vscale: null, font: "9B+" },
];

// Helper to find conversion row by input system and grade
function findConversionRow(system, grade) {
  if (!grade) return null;
  const normalizedGrade = grade.trim().toLowerCase();
  return gradeConversionTable.find(row => {
    const val = row[system];
    if (!val) return false;
    return val.toLowerCase() === normalizedGrade;
  });
}

export default function ClimbingGradeConverterYdsFrenchEuCalculator() {
  const [inputs, setInputs] = useState({ system: "yds", grade: "" });
  const handleInputChange = useCallback((name, value) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const { system, grade } = inputs;
    if (!system || !grade) return { value: "", label: "", subtext: "", warning: null, formulaUsed: "" };

    const conversionRow = findConversionRow(system, grade);
    if (!conversionRow) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: `Grade "${grade}" not recognized in the selected system (${gradeSystems.find(s => s.value === system)?.label}). Please check spelling and format.`,
        formulaUsed: "",
      };
    }

    // Build result string with all grades except input system
    const convertedGrades = gradeSystems
      .filter(s => s.value !== system)
      .map(s => {
        const val = conversionRow[s.value];
        return val ? `${s.label}: ${val}` : null;
      })
      .filter(Boolean)
      .join(" | ");

    return {
      value: grade,
      label: `Input: ${gradeSystems.find(s => s.value === system)?.label}`,
      subtext: convertedGrades,
      warning: null,
      formulaUsed: "Lookup table based on international climbing grade consensus.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why are climbing grades different across systems?",
      answer:
        "Climbing grades vary internationally due to differences in climbing styles, rock types, and historical grading traditions. For example, the Yosemite Decimal System (YDS) is primarily used in the United States for roped climbs, while the French system is common in Europe for sport climbing. Bouldering grades like the V-scale and Fontainebleau scale focus on short, powerful climbs and have their own grading nuances.",
    },
    {
      question: "Can I rely solely on this converter for grading my climbs?",
      answer:
        "While this converter provides a reliable reference based on widely accepted grade equivalencies, climbing grades are inherently subjective and can vary by route setter, location, and personal ability. Always consider local guidebooks, climbing community consensus, and personal experience when assessing climb difficulty.",
    },
    {
      question: "What is the difference between trad and sport climbing grades?",
      answer:
        "Sport climbing grades (e.g., French system) focus on the physical difficulty of the moves on a route with fixed protection, while traditional (trad) climbing grades (e.g., British system) also factor in the risk and complexity of placing protection gear. Therefore, trad grades often include an adjectival component indicating danger or seriousness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="system" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          Select Grade System <Calculator className="w-4 h-4 text-blue-600" />
        </Label>
        <Select
          id="system"
          value={inputs.system || ""}
          onValueChange={v => handleInputChange("system", v)}
          aria-label="Select climbing grade system"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select grade system" />
          </SelectTrigger>
          <SelectContent>
            {gradeSystems.map(s => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="grade" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          Enter Grade <Info className="w-4 h-4 text-blue-600" />
        </Label>
        <Input
          id="grade"
          placeholder={`e.g. ${inputs.system === "yds" ? "5.10a" : inputs.system === "french" ? "6a" : "VI"}`}
          value={inputs.grade || ""}
          onChange={e => handleInputChange("grade", e.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-describedby="gradeHelp"
        />
        <p id="gradeHelp" className="text-sm text-slate-500 mt-1">
          Enter the climbing grade exactly as used in the selected system.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          aria-label="Calculate climbing grade conversion"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ system: "yds", grade: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-red-50 border-red-300 text-red-700 dark:bg-red-900 dark:text-red-300 dark:border-red-700 shadow">
          <CardContent className="p-4 text-center flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <p>{results.warning}</p>
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{results.subtext}</p>
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
          Climbing grades are a standardized way to communicate the difficulty of climbing routes and boulder problems. However, these grading systems vary significantly across regions and climbing disciplines, reflecting differences in climbing style, protection availability, and local traditions. This converter bridges these differences by providing an authoritative cross-reference between popular grading systems such as the Yosemite Decimal System (YDS), French sport grades, UIAA European grades, British traditional grades, and bouldering scales like the V-scale and Fontainebleau system. Understanding these conversions helps climbers plan their ascents and assess difficulty when climbing internationally.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The conversion table used here is based on consensus from climbing guidebooks, federations, and expert climbers worldwide. It is important to note that climbing grades are inherently subjective and can vary based on route conditions, style, and individual climber strengths. This tool aims to provide a reliable reference point for climbers seeking to understand and compare grades across systems.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this climbing grade converter is straightforward and designed for climbers of all levels. Begin by selecting the grading system you want to convert from using the dropdown menu. Next, enter the climbing grade exactly as it appears in that system, including any letter or plus/minus modifiers. Once you click "Calculate," the tool will display equivalent grades in other popular systems, helping you understand the difficulty across different grading scales.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Step 1:</strong> Select the climbing grade system you are familiar with (e.g., YDS, French, UIAA).</li>
          <li><strong>Step 2:</strong> Enter the exact grade of the route or boulder problem you want to convert.</li>
          <li><strong>Step 3:</strong> Click the "Calculate" button to see the equivalent grades in other systems.</li>
          <li><strong>Step 4:</strong> Review the results and use them to plan your climbing or compare route difficulties internationally.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To improve your climbing grade, focus on a balanced training program that develops strength, endurance, technique, and mental resilience. Incorporate hangboard training, campus board exercises, and route climbing to build finger strength and power. Additionally, practicing different climbing styles and terrains will enhance your adaptability and skill set. Tracking your progress using grade conversions can help set realistic goals and measure improvements across different climbing disciplines.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember to allow adequate rest and recovery to prevent overuse injuries, and consider working with a coach or experienced climber to tailor your training plan. Using this grade converter, you can better understand the difficulty of your training routes and adjust your workouts accordingly to target specific weaknesses or strengths.
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

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on climbing grading systems, training science, and performance standards, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.acsm.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American College of Sports Medicine <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Global leader in sports medicine and exercise science research, providing evidence-based training guidelines.
            </p>
          </li>
          <li>
            <a
              href="https://www.ifsc-climbing.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              International Federation of Sport Climbing (IFSC) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Governing body for competition climbing, setting standards for grading and route setting in sport climbing.
            </p>
          </li>
          <li>
            <a
              href="https://www.ukclimbing.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              UKClimbing <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive resource for British climbing grades, trad climbing standards, and community discussions.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Climbing Grade Converter"
      description="Convert climbing grades. Switch between YDS, French, UIAA, British, and Bouldering scales to understand route difficulty worldwide."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Conversion Methodology",
        formula: "Lookup Table Matching",
        variables: [
          { symbol: "grade", description: "Input climbing grade in selected system" },
          { symbol: "system", description: "Selected climbing grade system" },
          { symbol: "convertedGrades", description: "Equivalent grades in other systems" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have climbed a route graded 5.11a in the Yosemite Decimal System and want to know its equivalent in the French and UIAA systems.",
        steps: [
          {
            label: "Step 1",
            explanation: "Select 'Yosemite Decimal System (YDS)' from the grade system dropdown.",
          },
          {
            label: "Step 2",
            explanation: "Enter '5.11a' in the grade input field.",
          },
          {
            label: "Step 3",
            explanation: "Click 'Calculate' to see the equivalent grades displayed below.",
          },
        ],
        result: "The converter shows French: 6c and UIAA: VII, helping you understand the difficulty in European grading terms.",
      }}
      relatedCalculators={[
        { title: "Body Fat Percentage Calculator (Athletes)", url: "/sports/body-fat-percentage", icon: "🔥" },
        { title: "xG (Expected Goals) Reading Helper", url: "/sports/expected-goals-xg-helper", icon: "🏆" },
        { title: "Ground Ball to Fly Ball Ratio (GB/FB)", url: "/sports/ground-ball-to-fly-ball-ratio-gb-fb", icon: "⚽" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
        { title: "Swimming Power Points Calculator", url: "/sports/swimming-power-points", icon: "🏊" },
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
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