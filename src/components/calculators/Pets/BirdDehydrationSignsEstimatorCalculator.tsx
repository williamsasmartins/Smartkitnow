import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdDehydrationSignsEstimatorCalculator() {
  // 1. STATE
  // No unit switcher needed because inputs are % dehydration signs and water intake deficit (both unitless or %)
  // But we keep imperial for weight input if needed, but here no weight input is required by formula.
  // According to formula, inputs are: Dehydration Signs Score (%) and Intake Deficit (%)
  // So no weight or unit needed.
  
  const [inputs, setInputs] = useState({
    dehydrationSignsPercent: "",
    intakeDeficitPercent: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const dSigns = parseFloat(inputs.dehydrationSignsPercent);
    const intakeDef = parseFloat(inputs.intakeDeficitPercent);

    if (
      isNaN(dSigns) ||
      isNaN(intakeDef) ||
      dSigns < 0 ||
      dSigns > 100 ||
      intakeDef < 0 ||
      intakeDef > 100
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid percentages between 0 and 100.",
        warning: null,
      };
    }

    // Hydration Score = Dehydration % + Intake Deficit %
    const hydrationScore = dSigns + intakeDef;

    let label = "";
    let warning = null;

    if (hydrationScore < 10) {
      label = "Normal hydration status";
    } else if (hydrationScore < 20) {
      label = "Mild dehydration suspected";
      warning =
        "Monitor bird closely and encourage fluid intake. Consult a vet if signs worsen.";
    } else if (hydrationScore < 40) {
      label = "Moderate dehydration likely";
      warning =
        "Immediate veterinary attention recommended. Dehydration can rapidly worsen.";
    } else {
      label = "Severe dehydration risk";
      warning =
        "Urgent veterinary care required. Severe dehydration is life-threatening.";
    }

    return {
      value: hydrationScore.toFixed(1) + "%",
      label,
      subtext:
        "Hydration Score combines clinical signs and water intake deficit to estimate dehydration severity.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to assess both dehydration signs and water intake?",
      answer:
        "Assessing both clinical dehydration signs and water intake deficit provides a more accurate picture of a bird's hydration status. Clinical signs alone can be subtle or misleading, especially in small birds, while water intake reflects ongoing hydration behavior. Combining these factors helps identify dehydration early, enabling timely intervention and preventing complications.",
    },
    {
      question: "How can dehydration affect a bird's health if left untreated?",
      answer:
        "Dehydration reduces blood volume and impairs circulation, which can lead to organ dysfunction and shock in birds. Birds have a high metabolic rate and small body reserves, making them particularly vulnerable to rapid dehydration. Early detection and treatment are critical to avoid severe health consequences and improve recovery chances.",
    },
    {
      question: "What are common signs of dehydration in birds that owners should watch for?",
      answer:
        "Common signs include sunken eyes, dry or sticky mucous membranes, lethargy, and poor skin elasticity. Birds may also show reduced appetite and decreased activity levels. Recognizing these subtle signs early allows owners to seek veterinary care before dehydration becomes severe.",
    },
    {
      question: "How can owners encourage proper hydration in their birds?",
      answer:
        "Providing fresh, clean water daily and offering water-rich foods like fruits and vegetables can promote hydration. Some birds may prefer dripping water or misting to stimulate drinking. Monitoring water intake and behavior regularly helps detect changes early and maintain optimal hydration.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="dehydrationSignsPercent" className="text-slate-700 dark:text-slate-300">
            Dehydration Signs (%)
          </Label>
          <Input
            id="dehydrationSignsPercent"
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="e.g. 5"
            value={inputs.dehydrationSignsPercent}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, dehydrationSignsPercent: e.target.value }))
            }
            aria-describedby="dehydrationSignsHelp"
          />
          <p
            id="dehydrationSignsHelp"
            className="text-xs text-slate-500 dark:text-slate-400 mt-1"
          >
            Estimate the percentage severity of clinical dehydration signs observed.
          </p>
        </div>

        <div>
          <Label htmlFor="intakeDeficitPercent" className="text-slate-700 dark:text-slate-300">
            Water Intake Deficit (%)
          </Label>
          <Input
            id="intakeDeficitPercent"
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="e.g. 10"
            value={inputs.intakeDeficitPercent}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, intakeDeficitPercent: e.target.value }))
            }
            aria-describedby="intakeDeficitHelp"
          />
          <p id="intakeDeficitHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Estimate the percentage reduction in normal water intake compared to usual.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Trigger recalculation by updating state with same values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ dehydrationSignsPercent: "", intakeDeficitPercent: "" })}
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
          Understanding Dehydration Signs Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dehydration in birds is a critical health concern that can often be difficult to detect due to their small size and subtle clinical signs. This estimator combines observable dehydration signs with the bird’s water intake deficit to provide a more comprehensive assessment of hydration status. By quantifying these factors into a single hydration score, owners and veterinarians can better identify early dehydration and intervene promptly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Birds lose water rapidly through respiration and excretion, making them highly susceptible to dehydration during illness or environmental stress. Clinical signs such as sunken eyes, dry mucous membranes, and lethargy may not always be obvious, especially to untrained observers. Therefore, incorporating water intake reduction into the assessment helps capture changes in hydration behavior that precede visible signs, enhancing early detection.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is designed to empower bird owners with a reliable method to estimate dehydration severity using simple percentage inputs. It supports timely decision-making and encourages veterinary consultation when necessary. Understanding and monitoring hydration status is essential for maintaining avian health and preventing complications associated with fluid imbalances.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this estimator, carefully observe your bird for clinical signs of dehydration and estimate their severity as a percentage. Next, evaluate how much less water your bird is drinking compared to its normal intake, also expressed as a percentage. Enter these two values into the respective fields and click “Calculate” to receive an overall hydration score and interpretation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Observe your bird for signs such as sunken eyes, dry mouth, or lethargy and estimate their severity on a scale from 0% (none) to 100% (severe).
          </li>
          <li>
            <strong>Step 2:</strong> Estimate the reduction in your bird’s water intake compared to normal, again as a percentage from 0% (normal intake) to 100% (no intake).
          </li>
          <li>
            <strong>Step 3:</strong> Input these percentages into the calculator and press “Calculate” to get the hydration score and guidance on severity.
          </li>
          <li>
            <strong>Step 4:</strong> Use the result to decide if veterinary consultation is needed, especially if moderate or severe dehydration is indicated.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/birds/dehydration-in-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Dehydration in Birds
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of dehydration causes, clinical signs, and treatment in avian species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151200/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Center for Biotechnology Information - Avian Fluid Therapy
            </a>
            <p className="text-slate-500 text-sm">
              Detailed discussion on fluid therapy protocols and hydration assessment in birds.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/page/avianmedicine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians - Clinical Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines for recognizing and managing dehydration and other common avian health issues.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dehydration Signs Estimator"
      description="Tool to help owners identify early signs of dehydration in birds, which can be subtle."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Hydration Score = Dehydration % + Intake Deficit %",
        variables: [
          { symbol: "Dehydration %", description: "Estimated severity of clinical dehydration signs" },
          { symbol: "Intake Deficit %", description: "Estimated reduction in water intake compared to normal" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A pet owner notices mild sunken eyes and dry mucous membranes in their parakeet, estimating dehydration signs at 8%. They also observe the bird drinking about 12% less water than usual.",
        steps: [
          {
            label: "1",
            explanation:
              "Input 8% for Dehydration Signs and 12% for Water Intake Deficit into the calculator.",
          },
          {
            label: "2",
            explanation:
              "Calculate the Hydration Score: 8% + 12% = 20%, indicating moderate dehydration likely.",
          },
          {
            label: "3",
            explanation:
              "The result advises immediate veterinary attention to prevent worsening dehydration.",
          },
        ],
        result: "Hydration Score: 20% - Moderate dehydration likely; seek veterinary care promptly.",
      }}
      relatedCalculators={[
        { title: "Daily Water Intake Checker for Cats", url: "/pets/cat-daily-water-intake-checker", icon: "🐱" },
        { title: "Weight Maintenance vs. Gain/Loss Planner", url: "/pets/small-mammal-weight-maintenance-gain-loss-planner", icon: "🐶" },
        { title: "Gabapentin Dose Calculator for Dogs", url: "/pets/dog-gabapentin-dose", icon: "🐶" },
        { title: "Protein/Fat Intake Guide for Cats (by Goal)", url: "/pets/cat-protein-fat-intake-guide", icon: "🐱" },
        { title: "Cat Treat Calories & Daily Allowance", url: "/pets/cat-treat-calories-daily-allowance", icon: "🐱" },
        { title: "Heat Risk/Walk Safety Window (Temp & Humidity)", url: "/pets/dog-heat-risk-walk-safety-window", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dehydration Signs Estimator" },
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