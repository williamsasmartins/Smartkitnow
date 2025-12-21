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

export default function MedicalTourismCostSaverCalculator() {
  /*
    Inputs:
    - Domestic Procedure Cost (USD)
    - Abroad Procedure Cost (USD)
    - Additional Travel & Accommodation Cost (USD)
    - Recovery Vacation Cost (USD)

    Calculation:
    Total Abroad Cost = Abroad Procedure + Travel + Recovery Vacation
    Savings = Domestic Procedure - Total Abroad Cost

    Output:
    - Savings amount (USD)
    - Label: "Estimated Savings"
    - Subtext: "Compared to domestic medical procedure cost"
    - Color: green if positive savings, red if negative (no savings)
  */

  const [inputs, setInputs] = useState({
    domesticCost: "",
    abroadCost: "",
    travelCost: "",
    recoveryCost: "",
  });
  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const {
      domesticCost,
      abroadCost,
      travelCost,
      recoveryCost,
    } = inputs;

    // If any input is empty, return neutral state (no error)
    if (
      domesticCost === "" ||
      abroadCost === "" ||
      travelCost === "" ||
      recoveryCost === ""
    ) {
      return { value: null };
    }

    // Parse inputs to floats
    const domestic = parseFloat(domesticCost);
    const abroad = parseFloat(abroadCost);
    const travel = parseFloat(travelCost);
    const recovery = parseFloat(recoveryCost);

    // If any parsed input is NaN or negative, return neutral state
    if (
      isNaN(domestic) ||
      isNaN(abroad) ||
      isNaN(travel) ||
      isNaN(recovery) ||
      domestic < 0 ||
      abroad < 0 ||
      travel < 0 ||
      recovery < 0
    ) {
      return { value: null };
    }

    const totalAbroadCost = abroad + travel + recovery;
    const savings = domestic - totalAbroadCost;

    // Format currency
    const formattedSavings = savings.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    // If savings <= 0, no savings
    if (savings <= 0) {
      return {
        value: formattedSavings,
        label: "No Savings",
        subtext:
          "Medical tourism may not save you money in this scenario.",
        color: "text-red-600",
        icon: <RotateCcw className="mx-auto w-10 h-10" />,
      };
    }

    return {
      value: formattedSavings,
      label: "Estimated Savings",
      subtext: "Compared to domestic medical procedure cost",
      color: "text-green-600",
      icon: <Smile className="mx-auto w-10 h-10" />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What costs are included in medical tourism savings?",
      answer:
        "The calculation includes the cost of the medical procedure abroad, travel expenses, accommodation, and any recovery vacation costs. Comparing these to domestic procedure costs helps estimate potential savings.",
    },
    {
      question: "Are there risks associated with medical tourism?",
      answer:
        "Yes, while medical tourism can save money, it may involve risks such as differences in medical standards, follow-up care challenges, and travel-related health concerns. Always research providers carefully.",
    },
    {
      question: "Can I use this calculator for any medical procedure?",
      answer:
        "This calculator provides a general estimate and can be used for various procedures. However, actual costs and savings may vary based on procedure complexity, location, and individual circumstances.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="domesticCost">Domestic Procedure Cost (USD)</Label>
          <Input
            id="domesticCost"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 15000"
            value={inputs.domesticCost}
            onChange={(e) => handleInputChange("domesticCost", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="abroadCost">Abroad Procedure Cost (USD)</Label>
          <Input
            id="abroadCost"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 7000"
            value={inputs.abroadCost}
            onChange={(e) => handleInputChange("abroadCost", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="travelCost">Travel & Accommodation Cost (USD)</Label>
          <Input
            id="travelCost"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 2000"
            value={inputs.travelCost}
            onChange={(e) => handleInputChange("travelCost", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="recoveryCost">Recovery Vacation Cost (USD)</Label>
          <Input
            id="recoveryCost"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 1500"
            value={inputs.recoveryCost}
            onChange={(e) => handleInputChange("recoveryCost", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit calculation needed here because useMemo updates automatically
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              domesticCost: "",
              abroadCost: "",
              travelCost: "",
              recoveryCost: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value !== null && (
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
          Understanding Medical Tourism Cost Saver
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Medical tourism is the practice of traveling abroad to receive medical
          care, often at a lower cost than in one's home country. This calculator
          helps estimate potential savings by comparing domestic procedure costs
          with the total expenses incurred abroad, including travel and recovery
          vacation costs. Understanding these factors can help patients make
          informed decisions about seeking treatment internationally.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Did You Know?
            </h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Over 14 million patients worldwide travel abroad each year for medical
            care, with many saving up to 60% on procedures compared to domestic
            prices.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use the Medical Tourism Cost Saver Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter the estimated cost of your medical procedure in your home country,
          then input the expected cost of the same procedure abroad. Add your
          anticipated travel and accommodation expenses, as well as any costs for
          a recovery vacation. Click "Calculate" to see your potential savings.
          Use the reset button to clear inputs and start over.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="list-disc list-inside space-y-3 text-slate-700 dark:text-slate-300">
          {faqs.map(({ question, answer }, i) => (
            <li key={i}>
              <strong>{question}</strong>
              <p className="mt-1">{answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References
        </h2>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.usa.gov/medical-tourism"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USA.gov - Medical Tourism <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official government resource on medical tourism and patient safety.
            </p>
          </li>
          <li>
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6079604/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              NCBI - Medical Tourism Trends <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Research article on global medical tourism trends and economic impact.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Medical Tourism Cost Saver"
      description="Calculate savings on medical procedures. Compare the cost of surgery abroad versus domestic prices (plus a recovery vacation)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ IMPORTANT: Use 'symbol' and 'description' keys here!
      formula={{
        title: "The Math",
        formula: "Savings = Domestic Cost - (Abroad Cost + Travel Cost + Recovery Vacation Cost)",
        variables: [
          { symbol: "Savings", description: "Estimated money saved by choosing medical tourism" },
          { symbol: "Domestic Cost", description: "Cost of the medical procedure in your home country (USD)" },
          { symbol: "Abroad Cost", description: "Cost of the medical procedure abroad (USD)" },
          { symbol: "Travel Cost", description: "Travel and accommodation expenses (USD)" },
          { symbol: "Recovery Vacation Cost", description: "Cost of recovery vacation after procedure (USD)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You need a surgery that costs $15,000 domestically. Abroad, the surgery costs $7,000, travel and accommodation cost $2,000, and you plan a $1,500 recovery vacation.",
        steps: [
          {
            label: "1",
            explanation:
              "Add abroad procedure cost, travel, and recovery vacation: $7,000 + $2,000 + $1,500 = $10,500",
          },
          {
            label: "2",
            explanation:
              "Subtract total abroad cost from domestic cost: $15,000 - $10,500 = $4,500 savings",
          },
        ],
        result: "You save $4,500 by choosing medical tourism in this scenario.",
      }}
      relatedCalculators={[
        { title: "Rocks to Flood a Country Estimator", url: "/funny/rocks-to-flood-country", icon: "✈️" },
        { title: "Commit Message Quality Judge", url: "/funny/commit-message-quality-judge", icon: "🤪" },
        { title: "Lost Socks Calculator", url: "/funny/lost-socks-calculator", icon: "🤪" },
        { title: "Pizza Slices per Person & Regret Index", url: "/funny/pizza-slices-per-person-regret-index", icon: "🍕" },
        { title: "Death by Caffeine (Max Safe Intake)", url: "/funny/death-by-caffeine", icon: "☕" },
        { title: "Meme Virality Calculator", url: "/funny/meme-virality-calculator", icon: "🤪" },
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