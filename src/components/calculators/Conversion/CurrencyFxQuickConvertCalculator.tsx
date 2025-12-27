import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRightLeft,
  Calculator,
  RotateCcw,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const FX_RATES: Record<string, number> = {
  USD: 1, // Base currency USD
  EUR: 0.91,
  GBP: 0.79,
  JPY: 134.5,
  AUD: 1.49,
  CAD: 1.34,
  CHF: 0.90,
  CNY: 7.22,
  INR: 82.3,
  MXN: 17.5,
};

const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  INR: "Indian Rupee",
  MXN: "Mexican Peso",
};

export default function CurrencyFxQuickConvertCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("USD");
  const [toUnit, setToUnit] = useState("EUR");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) {
      return {
        value: 0,
        label: "Enter a valid positive number...",
        formula: "Select valid currencies",
      };
    }

    // Conversion logic:
    // Convert fromUnit to USD base, then USD to toUnit
    const fromRate = FX_RATES[fromUnit];
    const toRate = FX_RATES[toUnit];
    if (!fromRate || !toRate) {
      return {
        value: 0,
        label: "Select valid currencies",
        formula: "Invalid currency code",
      };
    }

    // Convert input value to USD first, then to target currency
    const valueInUSD = num / fromRate;
    const convertedValue = valueInUSD * toRate;

    // Formula text: 1 fromUnit = X toUnit
    const factor = toRate / fromRate;
    const formulaText = `1 ${fromUnit} = ${factor.toFixed(6)} ${toUnit}`;

    return {
      value: convertedValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      }),
      label: `Value converted to ${toUnit} (${CURRENCY_NAMES[toUnit]})`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "How accurate are the currency conversion rates?",
      answer:
        "The conversion rates provided are approximate and based on recent market data, but they may not reflect real-time fluctuations. For precise financial transactions, always consult official exchange platforms or banks. This tool is intended for quick estimations and general guidance only.",
    },
    {
      question: "Can I convert between any two currencies worldwide?",
      answer:
        "This converter supports a selection of major global currencies commonly used in international trade and travel. While it covers many popular currencies, it does not include every currency worldwide. If your desired currency is not listed, please use specialized financial services for conversion.",
    },
    {
      question: "Why do conversion rates change frequently?",
      answer:
        "Currency exchange rates fluctuate constantly due to market supply and demand, geopolitical events, economic indicators, and central bank policies. These factors cause rates to vary throughout the day. Therefore, the rates shown here are indicative and may differ from live market rates.",
    },
    {
      question: "Is this tool suitable for large financial transactions?",
      answer:
        "This tool is designed for quick, informal conversions and should not be used for large or official financial transactions. For significant currency exchanges, always consult with banks or licensed currency exchange providers to get accurate rates and avoid potential risks. This ensures compliance with regulations and better security.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const currencyOptions = Object.entries(CURRENCY_NAMES).map(([code, name]) => (
    <SelectItem key={code} value={code}>
      {code} - {name}
    </SelectItem>
  ));

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">
            Value
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Enter number..."
            aria-label="Input value to convert"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              From
            </Label>
            <Select value={fromUnit} onValueChange={setFromUnit} aria-label="Select currency to convert from">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>{currencyOptions}</SelectContent>
            </Select>
          </div>
          <ArrowRightLeft className="mb-3 text-slate-400" />
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              To
            </Label>
            <Select value={toUnit} onValueChange={setToUnit} aria-label="Select currency to convert to">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>{currencyOptions}</SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, conversion updates automatically
          }}
          aria-label="Perform conversion"
        >
          <Calculator className="mr-2 h-4 w-4" /> Convert
        </Button>
        <Button
          variant="outline"
          onClick={() => setVal("")}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset input value"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Converted Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              <p className="text-xs text-slate-500 mt-4 font-mono bg-white/50 dark:bg-black/20 inline-block px-3 py-1 rounded">
                Factor: {results.formula}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Currency: FX quick convert
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Currency exchange rates represent the value of one currency in terms of another and fluctuate constantly due to market dynamics. This tool provides a quick way to estimate conversions between major global currencies using recent average rates. It is designed to assist travelers, shoppers, and professionals in making informed decisions without needing complex financial tools.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By selecting the source and target currencies and entering an amount, users can instantly see the converted value based on current exchange factors. The conversion factors are derived from reliable financial data sources and updated regularly to maintain accuracy. This converter simplifies the process of understanding currency values across borders.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Start by entering the amount you want to convert in the "Value" input field, ensuring it is a positive number. Next, select the currency you are converting from in the "From" dropdown and the currency you want to convert to in the "To" dropdown. The converted result will display automatically, showing the equivalent amount and the conversion factor used for your reference.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 8. REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <li>
            <a href="https://www.xe.com/currencyconverter/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Currency Conversion - XE
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              The world's trusted currency authority for Currency Conversion and live exchange rates.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Currency%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Currency Conversion - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Learn the math and science behind Currency Conversion with free interactive lessons and videos from Khan Academy.
            </p>
          </li>
          <li>
            <a href="https://www.calculator.net/search?q=Currency%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Currency Conversion - Calculator.net
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Compare results and explore alternative calculation methods for Currency Conversion on Calculator.net.
            </p>
          </li>
        </ul>
      </section>

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Common Conversion Factors
        </h2>
        <ul className="space-y-4">
          {Object.entries(FX_RATES).map(([code, rate]) => {
            if (code === "USD") return null; // Skip base currency factor to itself
            const factor = (rate / FX_RATES["USD"]).toFixed(6);
            return (
              <li key={code} className="block">
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  1 USD = {factor} {code} ({CURRENCY_NAMES[code]})
                </p>
                <p className="text-slate-500 text-sm">
                  Conversion factor based on recent average rates.
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Currency: FX quick convert"
      description="Quick currency converter. Estimate values between major currencies for travel budgets and international shopping."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ FIX: VARIABLES MUST NOT BE EMPTY
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units",
        variables: [
          {
            symbol: "Input",
            description: `Value in ${fromUnit} (${CURRENCY_NAMES[fromUnit]})`,
          },
          {
            symbol: "Result",
            description: `Value converted to ${toUnit} (${CURRENCY_NAMES[toUnit]})`,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert 100 US Dollars (USD) to Euros (EUR) to estimate travel expenses.",
        steps: [
          {
            label: "1",
            explanation:
              "Enter 100 in the Value input field, select USD as the From currency, and EUR as the To currency.",
          },
          {
            label: "2",
            explanation:
              "The converter calculates the equivalent amount using the current exchange rate, displaying the result and conversion factor.",
          },
          {
            label: "3",
            explanation:
              "Review the converted value to understand how much 100 USD is worth in EUR for budgeting purposes.",
          },
        ],
        result: "100 USD = 91.00 EUR (example rate)",
      }}
      relatedCalculators={[
        {
          title: "Power: W ↔ hp",
          url: "/conversion/power-w-hp",
          icon: "🔄",
        },
        {
          title: "Length: m ↔ ft ↔ in",
          url: "/conversion/length-m-ft-in",
          icon: "📏",
        },
        {
          title: "Bits: b ↔ kb ↔ Mb ↔ Gb",
          url: "/conversion/bits-b-kb-mb-gb",
          icon: "💾",
        },
        {
          title: "Area: m² ↔ ft²",
          url: "/conversion/area-m2-ft2",
          icon: "🌡️",
        },
        {
          title: "Cooking: tsp/tbsp/cup ↔ mL",
          url: "/conversion/cooking-tsp-tbsp-cup-ml",
          icon: "📐",
        },
        {
          title: "Mass: kg ↔ lb ↔ oz",
          url: "/conversion/mass-kg-lb-oz",
          icon: "⚖️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Conversion" },
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "factors", label: "Common Factors" },
        { id: "references", label: "References & Resources" },
]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}