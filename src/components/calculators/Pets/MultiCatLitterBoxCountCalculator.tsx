import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MultiCatLitterBoxCountCalculator() {
  // 1. STATE
  // No unit switcher needed since inputs are counts and cats number
  const [inputs, setInputs] = useState({
    numberOfCats: "",
    numberOfLitterBoxes: "",
  });

  // 2. LOGIC ENGINE
  // Veterinary recommendation: Number of litter boxes = Number of cats + 1
  // Calculate if current litter boxes are sufficient or not
  const results = useMemo(() => {
    const cats = parseInt(inputs.numberOfCats);
    const boxes = parseInt(inputs.numberOfLitterBoxes);

    if (isNaN(cats) || cats <= 0) {
      return {
        value: 0,
        label: "Please enter a valid number of cats (at least 1).",
        subtext: "",
        warning: null,
      };
    }
    if (isNaN(boxes) || boxes < 0) {
      return {
        value: 0,
        label: "Please enter a valid number of litter boxes (0 or more).",
        subtext: "",
        warning: null,
      };
    }

    const recommendedBoxes = cats + 1;
    const difference = boxes - recommendedBoxes;

    let warning = null;
    let subtext = `Recommended litter boxes: ${recommendedBoxes}`;

    if (difference < 0) {
      warning =
        "You have fewer litter boxes than recommended. This can increase stress and lead to inappropriate elimination.";
    } else if (difference === 0) {
      subtext += " - This matches the veterinary recommended count.";
    } else {
      subtext += " - You have more than the recommended number, which can help reduce territorial disputes.";
    }

    return {
      value: recommendedBoxes,
      label: "Recommended Number of Litter Boxes",
      subtext,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it recommended to have one more litter box than the number of cats?",
      answer:
        "Cats are territorial animals and prefer to have their own space for elimination. Having one extra litter box reduces competition and stress, which decreases the likelihood of inappropriate elimination outside the box. This recommendation helps maintain harmony in multi-cat households and promotes better litter box hygiene.",
    },
    {
      question: "What problems can arise if there are not enough litter boxes for multiple cats?",
      answer:
        "Insufficient litter boxes can lead to increased stress, territorial disputes, and marking behaviors among cats. This often results in inappropriate urination or defecation outside the boxes, which can be frustrating for owners. Providing enough litter boxes helps prevent these behavioral issues and supports cats’ natural instincts.",
    },
    {
      question: "Can having too many litter boxes be harmful or unnecessary?",
      answer:
        "While having more litter boxes than cats is generally beneficial, excessive numbers may be unnecessary and take up space. However, it rarely causes harm and can provide cats with more options to avoid conflict. The key is to balance practicality with the cats’ comfort and preferences.",
    },
    {
      question: "How should litter boxes be placed in a multi-cat household?",
      answer:
        "Litter boxes should be placed in quiet, easily accessible locations separated from food and water areas. Spacing them out reduces territorial disputes and encourages use by all cats. Proper placement combined with adequate numbers ensures a stress-free environment and promotes healthy elimination habits.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="numberOfCats" className="text-slate-700 dark:text-slate-300">
            Number of Cats
          </Label>
          <Input
            id="numberOfCats"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 3"
            value={inputs.numberOfCats}
            onChange={(e) => setInputs({ ...inputs, numberOfCats: e.target.value })}
            aria-describedby="numberOfCatsHelp"
          />
          <p id="numberOfCatsHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the total number of cats in your household.
          </p>
        </div>
        <div>
          <Label htmlFor="numberOfLitterBoxes" className="text-slate-700 dark:text-slate-300">
            Current Number of Litter Boxes
          </Label>
          <Input
            id="numberOfLitterBoxes"
            type="number"
            min={0}
            step={1}
            placeholder="e.g. 3"
            value={inputs.numberOfLitterBoxes}
            onChange={(e) => setInputs({ ...inputs, numberOfLitterBoxes: e.target.value })}
            aria-describedby="numberOfLitterBoxesHelp"
          />
          <p id="numberOfLitterBoxesHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter how many litter boxes you currently have.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
          aria-label="Calculate recommended litter box count"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ numberOfCats: "", numberOfLitterBoxes: "" })}
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
          Understanding Multi-Cat Litter Box Count Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Multi-cat households require careful management of litter boxes to ensure feline health and wellbeing. This calculator helps determine the optimal number of litter boxes needed based on the number of cats, following veterinary guidelines. Proper litter box count reduces stress, territorial disputes, and inappropriate elimination behaviors that are common in multi-cat environments.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The widely accepted veterinary recommendation is to provide one litter box per cat plus one additional box. This formula accounts for cats’ territorial nature and their preference for having multiple elimination options. By adhering to this guideline, owners can minimize behavioral problems and maintain a cleaner, more harmonious household.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is designed to be simple yet authoritative, providing clear guidance for cat owners and veterinary professionals alike. It emphasizes the importance of environmental enrichment and stress reduction in feline care, which are critical factors for preventing litter box avoidance and promoting overall feline health.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires only two inputs: the number of cats in your household and the number of litter boxes currently available. After entering these values, click the calculate button to receive the recommended litter box count based on veterinary standards. The tool will also provide feedback on whether your current setup meets the recommendation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total number of cats you have in the "Number of Cats" field. This must be at least one.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the number of litter boxes you currently have in the "Current Number of Litter Boxes" field. Zero or more is acceptable.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to see the recommended number of litter boxes and advice on your current setup.
          </li>
          <li>
            <strong>Step 4:</strong> Adjust your litter box count accordingly to reduce stress and promote healthy elimination habits among your cats.
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
              href="https://www.aspcapro.org/resource/multi-cat-households-and-litter-box-management"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. ASPCA Pro: Multi-Cat Households and Litter Box Management
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on managing litter boxes in multi-cat environments to reduce stress and behavioral issues.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/litter-box-problems"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Cornell Feline Health Center: Litter Box Problems
            </a>
            <p className="text-slate-500 text-sm">
              Expert insights into causes and prevention of litter box issues, emphasizing the importance of adequate litter box numbers.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/litter-box-problems-in-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. VCA Hospitals: Litter Box Problems in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary advice on managing litter box usage and environmental enrichment for multi-cat households.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Multi-Cat Litter Box Count Calculator"
      description="Calculate the correct number of litter boxes needed for a multi-cat household to minimize stress and accidents."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Recommended Litter Boxes = Number of Cats + 1",
        variables: [
          { symbol: "Number of Cats", description: "Total cats in the household" },
          { symbol: "Recommended Litter Boxes", description: "Optimal litter box count" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A household has 4 cats and currently owns 3 litter boxes. The owner wants to know if this is sufficient.",
        steps: [
          {
            label: "1",
            explanation: "Calculate recommended boxes: 4 cats + 1 = 5 litter boxes.",
          },
          {
            label: "2",
            explanation: "Compare current boxes (3) to recommended (5).",
          },
          {
            label: "3",
            explanation:
              "Since 3 < 5, the owner should add 2 more litter boxes to reduce stress and prevent accidents.",
          },
        ],
        result: "Recommended litter boxes: 5. Current boxes are insufficient.",
      }}
      relatedCalculators={[
        { title: "Gabapentin Dose Calculator for Dogs", url: "/pets/dog-gabapentin-dose", icon: "🐶" },
        { title: "Dehydration Signs Estimator", url: "/pets/bird-dehydration-signs-estimator", icon: "🐶" },
        { title: "Lilies Poisoning Risk Guide (cats)", url: "/pets/cat-lilies-poisoning-risk-guide", icon: "🐱" },
        { title: "Horse Electrolyte Need Estimator (Exercise & Heat)", url: "/pets/horse-electrolyte-need-estimator", icon: "🐎" },
        { title: "Dog BMI/Body Index (educational)", url: "/pets/dog-bmi-body-index-educational", icon: "🐶" },
        { title: "Horse Water Intake by Temperature & Weight", url: "/pets/horse-water-intake-temperature-weight", icon: "🐎" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Multi-Cat Litter Box Count Calculator" },
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