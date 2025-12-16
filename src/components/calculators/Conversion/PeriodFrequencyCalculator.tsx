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
  Info,
  Scale,
  Ruler,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PeriodFrequencyCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("period_s");
  const [toUnit, setToUnit] = useState("frequency_hz");

  // 2. UNITS & LABELS
  // Period units: seconds (s), milliseconds (ms), microseconds (μs), nanoseconds (ns)
  // Frequency units: hertz (Hz), kilohertz (kHz), megahertz (MHz), gigahertz (GHz)
  const periodUnits = [
    { value: "period_s", label: "Seconds (s)", factor: 1 },
    { value: "period_ms", label: "Milliseconds (ms)", factor: 1e-3 },
    { value: "period_us", label: "Microseconds (μs)", factor: 1e-6 },
    { value: "period_ns", label: "Nanoseconds (ns)", factor: 1e-9 },
  ];

  const frequencyUnits = [
    { value: "frequency_hz", label: "Hertz (Hz)", factor: 1 },
    { value: "frequency_khz", label: "Kilohertz (kHz)", factor: 1e3 },
    { value: "frequency_mhz", label: "Megahertz (MHz)", factor: 1e6 },
    { value: "frequency_ghz", label: "Gigahertz (GHz)", factor: 1e9 },
  ];

  // Helper to get unit label and factor by value
  function getUnit(unitValue: string) {
    return (
      periodUnits.find((u) => u.value === unitValue) ||
      frequencyUnits.find((u) => u.value === unitValue)
    );
  }

  // 3. LOGIC
  // Conversion logic:
  // Period (T) and Frequency (f) are inverses: f = 1 / T
  // Need to convert input value to seconds or hertz base unit first,
  // then convert to target unit.

  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
      return {
        value: 0,
        label: "Enter a positive value...",
        formula: "Select units",
      };
    }

    const from = getUnit(fromUnit);
    const to = getUnit(toUnit);
    if (!from || !to) {
      return {
        value: 0,
        label: "Select valid units",
        formula: "Select units",
      };
    }

    // Determine if fromUnit is period or frequency
    const fromIsPeriod = fromUnit.startsWith("period");
    const toIsPeriod = toUnit.startsWith("period");

    let resultValue = 0;
    let formulaText = "";

    if (fromIsPeriod && !toIsPeriod) {
      // Period -> Frequency
      // Convert input to seconds:
      const periodInSeconds = num * from.factor;
      // Frequency in Hz = 1 / periodInSeconds
      const freqInHz = 1 / periodInSeconds;
      // Convert Hz to target frequency unit:
      resultValue = freqInHz / to.factor;

      formulaText = `f = 1 / T; 1 ${from.label} = ${
        1 / from.factor
      } s; 1 Hz = 1 ${to.label}`;
    } else if (!fromIsPeriod && toIsPeriod) {
      // Frequency -> Period
      // Convert input to Hz:
      const freqInHz = num * from.factor;
      // Period in seconds = 1 / freqInHz
      const periodInSeconds = 1 / freqInHz;
      // Convert seconds to target period unit:
      resultValue = periodInSeconds / to.factor;

      formulaText = `T = 1 / f; 1 ${from.label} = ${
        from.factor
      } Hz; 1 s = 1 ${to.label}`;
    } else if (fromIsPeriod && toIsPeriod) {
      // Period -> Period (unit conversion only)
      const periodInSeconds = num * from.factor;
      resultValue = periodInSeconds / to.factor;
      formulaText = `1 ${from.label} = ${from.factor / to.factor} ${to.label}`;
    } else {
      // Frequency -> Frequency (unit conversion only)
      const freqInHz = num * from.factor;
      resultValue = freqInHz / to.factor;
      formulaText = `1 ${from.label} = ${from.factor / to.factor} ${to.label}`;
    }

    return {
      value: resultValue.toLocaleString(undefined, {
        maximumFractionDigits: 9,
      }),
      label: `Result in ${to.label}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 4. FAQS
  const faqs = [
    {
      question: "What is the relationship between period and frequency?",
      answer:
        "Period and frequency are mathematical inverses of each other. The period is the duration of one complete cycle of a repeating event, measured in units of time such as seconds. Frequency represents how many cycles occur per second, measured in hertz (Hz), so frequency equals one divided by the period.",
    },
    {
      question: "Why are there different units for period and frequency?",
      answer:
        "Different units exist to accommodate the wide range of time scales and frequencies encountered in various fields. For example, periods can be very short (nanoseconds) or long (seconds), while frequencies can range from hertz to gigahertz. Using appropriate units ensures precision and clarity in measurements and calculations.",
    },
    {
      question: "Can I convert period to period or frequency to frequency units?",
      answer:
        "Yes, this tool supports direct conversion between different period units (like seconds to milliseconds) and frequency units (like hertz to kilohertz). These conversions involve multiplying or dividing by powers of ten to adjust the scale without changing the underlying physical quantity.",
    },
    {
      question: "What happens if I enter zero or a negative value?",
      answer:
        "Entering zero or a negative value is invalid for period and frequency because these quantities represent positive durations or rates. The calculator will prompt you to enter a positive number to ensure meaningful and physically valid results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 5. WIDGET UI
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
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              From
            </Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="period_s">Seconds (s)</SelectItem>
                <SelectItem value="period_ms">Milliseconds (ms)</SelectItem>
                <SelectItem value="period_us">Microseconds (μs)</SelectItem>
                <SelectItem value="period_ns">Nanoseconds (ns)</SelectItem>
                <SelectItem value="frequency_hz">Hertz (Hz)</SelectItem>
                <SelectItem value="frequency_khz">Kilohertz (kHz)</SelectItem>
                <SelectItem value="frequency_mhz">Megahertz (MHz)</SelectItem>
                <SelectItem value="frequency_ghz">Gigahertz (GHz)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ArrowRightLeft className="mb-3 text-slate-400" />
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              To
            </Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="period_s">Seconds (s)</SelectItem>
                <SelectItem value="period_ms">Milliseconds (ms)</SelectItem>
                <SelectItem value="period_us">Microseconds (μs)</SelectItem>
                <SelectItem value="period_ns">Nanoseconds (ns)</SelectItem>
                <SelectItem value="frequency_hz">Hertz (Hz)</SelectItem>
                <SelectItem value="frequency_khz">Kilohertz (kHz)</SelectItem>
                <SelectItem value="frequency_mhz">Megahertz (MHz)</SelectItem>
                <SelectItem value="frequency_ghz">Gigahertz (GHz)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, result updates automatically
          }}
          aria-label="Convert"
        >
          <Calculator className="mr-2 h-4 w-4" /> Convert
        </Button>
        <Button
          variant="outline"
          onClick={() => setVal("")}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset"
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

  // 6. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Period ↔ Frequency
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Period and frequency are fundamental concepts in physics and engineering that describe oscillatory phenomena. The period is the time taken for one complete cycle of a repeating event, while frequency measures how many cycles occur per unit time. These two quantities are inversely related, meaning as one increases, the other decreases proportionally.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This inverse relationship is mathematically expressed as frequency equals one divided by the period (f = 1/T). Understanding this connection is crucial for analyzing waves, signals, and various periodic processes in electronics, mechanics, and other scientific fields. Accurate conversions between period and frequency units enable precise measurements and calculations in practical applications.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To convert between period and frequency, enter the numerical value you want to convert in the input field. Then select the unit of the value you entered in the "From" dropdown and the unit you want to convert to in the "To" dropdown. Click the "Convert" button to see the result instantly displayed below.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool supports conversions between various units of period (seconds, milliseconds, microseconds, nanoseconds) and frequency (hertz, kilohertz, megahertz, gigahertz). It also allows direct unit conversions within period or frequency categories without changing the physical quantity. Use the reset button to clear the input and start a new conversion.
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

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Common Conversion Factors
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Period Units
            </p>
            <p className="text-slate-500 text-sm">
              1 second (s) = 1,000 milliseconds (ms) = 1,000,000 microseconds (μs) = 1,000,000,000 nanoseconds (ns)
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Frequency Units
            </p>
            <p className="text-slate-500 text-sm">
              1 gigahertz (GHz) = 1,000 megahertz (MHz) = 1,000,000 kilohertz (kHz) = 1,000,000,000 hertz (Hz)
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Period and Frequency Relationship
            </p>
            <p className="text-slate-500 text-sm">
              Frequency (Hz) = 1 / Period (s); for example, a period of 0.01 seconds corresponds to a frequency of 100 Hz.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // 7. EXAMPLE
  const example = {
    title: "Example Calculation",
    scenario:
      "Convert a period of 2 milliseconds (ms) to frequency in kilohertz (kHz).",
    steps: [
      {
        label: "1",
        explanation:
          "Convert 2 ms to seconds: 2 ms × 0.001 = 0.002 seconds.",
      },
      {
        label: "2",
        explanation:
          "Calculate frequency in hertz: f = 1 / T = 1 / 0.002 = 500 Hz.",
      },
      {
        label: "3",
        explanation:
          "Convert frequency to kilohertz: 500 Hz ÷ 1000 = 0.5 kHz.",
      },
    ],
    result: "Therefore, 2 milliseconds corresponds to 0.5 kilohertz.",
  };

  return (
    <CalculatorVerticalLayout
      title="Period ↔ Frequency"
      description="Calculate the relationship between period and frequency. Convert time cycles (T) to frequency (f) and vice-versa instantly."
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
            description:
              "The value you entered in " +
              (getUnit(fromUnit)?.label || "selected unit"),
          },
          {
            symbol: "Result",
            description:
              "The calculated equivalent value in " +
              (getUnit(toUnit)?.label || "target unit"),
          },
        ],
      }}
      example={example}
      relatedCalculators={[
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
          icon: "🔄",
        },
        { title: "Angle: deg ↔ rad", url: "/conversion/angle-deg-rad", icon: "📏" },
        {
          title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
          url: "/conversion/bytes-b-kb-mb-gb-tb",
          icon: "💾",
        },
        {
          title: "Bits: b ↔ kb ↔ Mb ↔ Gb",
          url: "/conversion/bits-b-kb-mb-gb",
          icon: "💾",
        },
        {
          title: "Clock Time & Timezone Shift",
          url: "/conversion/clock-time-timezone-shift",
          icon: "📐",
        },
        {
          title: "Pressure: Pa ↔ bar ↔ psi",
          url: "/conversion/pressure-pa-bar-psi",
          icon: "⏱️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Conversion" },
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "factors", label: "Common Factors" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}