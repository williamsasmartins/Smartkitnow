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

const TIMEZONES = [
  { label: "UTC (Coordinated Universal Time)", value: "UTC", offset: 0 },
  { label: "GMT (Greenwich Mean Time)", value: "GMT", offset: 0 },
  { label: "EST (Eastern Standard Time, US)", value: "EST", offset: -5 },
  { label: "EDT (Eastern Daylight Time, US)", value: "EDT", offset: -4 },
  { label: "CST (Central Standard Time, US)", value: "CST", offset: -6 },
  { label: "CDT (Central Daylight Time, US)", value: "CDT", offset: -5 },
  { label: "MST (Mountain Standard Time, US)", value: "MST", offset: -7 },
  { label: "MDT (Mountain Daylight Time, US)", value: "MDT", offset: -6 },
  { label: "PST (Pacific Standard Time, US)", value: "PST", offset: -8 },
  { label: "PDT (Pacific Daylight Time, US)", value: "PDT", offset: -7 },
  { label: "CET (Central European Time)", value: "CET", offset: 1 },
  { label: "CEST (Central European Summer Time)", value: "CEST", offset: 2 },
  { label: "IST (India Standard Time)", value: "IST", offset: 5.5 },
  { label: "JST (Japan Standard Time)", value: "JST", offset: 9 },
  { label: "AEST (Australian Eastern Standard Time)", value: "AEST", offset: 10 },
  { label: "AEDT (Australian Eastern Daylight Time)", value: "AEDT", offset: 11 },
];

function formatTime(decimalHours: number) {
  // Normalize to 0-24 range
  let hours = decimalHours % 24;
  if (hours < 0) hours += 24;

  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const hh = h.toString().padStart(2, "0");
  const mm = m.toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function ClockTimeTimezoneShiftCalculator() {
  // 1. STATE
  // Default: 12:00 in UTC to EST
  const [val, setVal] = useState("12");
  const [fromUnit, setFromUnit] = useState("UTC");
  const [toUnit, setToUnit] = useState("EST");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a valid time (0-23.99)",
        formula: "Select valid time and time zones",
      };
    }
    if (num < 0 || num >= 24) {
      return {
        value: "",
        label: "Time must be between 0 and less than 24",
        formula: "Input time should be in 24-hour format (0-23.99)",
      };
    }

    const fromTz = TIMEZONES.find((tz) => tz.value === fromUnit);
    const toTz = TIMEZONES.find((tz) => tz.value === toUnit);
    if (!fromTz || !toTz) {
      return {
        value: "",
        label: "Select valid time zones",
        formula: "Select valid time zones",
      };
    }

    // Convert input time from fromUnit to UTC
    // val is decimal hours in fromUnit timezone
    // UTC time = val - offset(fromUnit)
    const utcTime = num - fromTz.offset;

    // Convert UTC time to toUnit timezone
    // result = utcTime + offset(toUnit)
    const convertedTime = utcTime + toTz.offset;

    const formattedResult = formatTime(convertedTime);

    // Formula text example:
    // 1 hour in EST = 1 hour in UTC - 5 hours offset
    // So formula: time_in_toUnit = time_in_fromUnit - offset_from + offset_to
    const formulaText = `Time_in_${toUnit} = Time_in_${fromUnit} - (${fromTz.offset}h) + (${toTz.offset}h)`;

    return {
      value: formattedResult,
      label: `Time in ${toUnit} (24-hour format HH:mm)`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "How does this converter handle daylight saving time?",
      answer:
        "This converter includes common daylight saving time (DST) offsets for major time zones, such as EDT and PDT. When selecting a time zone with DST, the offset reflects the adjusted time difference from UTC. However, it does not dynamically adjust for DST start/end dates, so users should verify if DST applies on their specific date.",
    },
    {
      question: "Can I enter minutes in the input time?",
      answer:
        "Yes, you can enter decimal values to represent minutes in the input time. For example, 14.5 corresponds to 14:30 (2:30 PM). The converter will accurately convert and display the result in HH:mm format. This allows precise time conversion including fractional hours.",
    },
    {
      question: "What happens if I enter a time outside 0-23.99 range?",
      answer:
        "The converter expects input times in a 24-hour format ranging from 0 up to but not including 24. If you enter a value outside this range, it will prompt you to enter a valid time. This ensures the conversion remains meaningful within a single day cycle.",
    },
    {
      question: "Why is the conversion formula important to understand?",
      answer:
        "Understanding the conversion formula helps clarify how time zone shifts are calculated using offsets from UTC. It shows that converting times involves adding or subtracting these offsets rather than simple multiplication. This knowledge aids in verifying results and troubleshooting time-related calculations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">Value (Hour in 24h format)</Label>
          <Input
            type="number"
            min={0}
            max={23.99}
            step={0.01}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Enter time (e.g., 14.5 for 14:30)"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ArrowRightLeft className="mb-3 text-slate-400" />
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
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
            // No special action needed, conversion is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Convert
        </Button>
        <Button
          variant="outline"
          onClick={() => setVal("")}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Converted Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
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
          Understanding Clock Time & Timezone Shift
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Clock time represents the local time displayed on a clock, usually in a 24-hour format for clarity. Timezone shift refers to the difference in hours and minutes between two geographic regions based on their longitudinal position relative to the Prime Meridian (UTC). This shift is crucial for coordinating activities across different regions, especially for travel, communication, and business.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Timezones are defined by their offset from Coordinated Universal Time (UTC), which serves as the global time standard. Some regions observe daylight saving time, temporarily shifting their clocks forward or backward to make better use of daylight. Understanding these shifts helps avoid confusion and ensures accurate scheduling across borders.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter the local time you want to convert in the input box using a decimal number to represent hours and fractional minutes (e.g., 14.5 for 2:30 PM). Select the original timezone of the input time in the "From" dropdown and the target timezone you want to convert to in the "To" dropdown. The converter will then display the equivalent time in the target timezone in a clear 24-hour HH:mm format.
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
            <a href="https://www.nist.gov/search?s=Timezone%20Converter" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Timezone Converter - NIST
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Official guide and standards for Timezone Converter from the National Institute of Standards and Technology.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Timezone%20Converter" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Timezone Converter - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Learn the math and science behind Timezone Converter with free interactive lessons and videos from Khan Academy.
            </p>
          </li>
          <li>
            <a href="https://www.calculator.net/search?q=Timezone%20Converter" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Timezone Converter - Calculator.net
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Compare results and explore alternative calculation methods for Timezone Converter on Calculator.net.
            </p>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Timezone%20Converter" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Timezone Converter - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Detailed encyclopedia article covering the history, standards, and usage of Timezone Converter.
            </p>
          </li>
        </ul>
      </section>

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Common Conversion Factors
        </h2>
        <ul className="space-y-4">
          {TIMEZONES.map((tz) => (
            <li key={tz.value} className="block">
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {tz.label}
              </p>
              <p className="text-slate-500 text-sm">
                Offset from UTC: {tz.offset >= 0 ? "+" : ""}
                {tz.offset} hours
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Clock Time & Timezone Shift"
      description="Calculate time differences. Shift clock times across different time zones to plan meetings and travel effectively."
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
            description: "Value in " + fromUnit + " timezone (hours in 24h format)",
          },
          {
            symbol: "Result",
            description: "Value converted to " + toUnit + " timezone (HH:mm format)",
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert 14.25 (2:15 PM) from EST (UTC-5) to CET (UTC+1) to find the corresponding time in Central Europe.",
        steps: [
          {
            label: "1",
            explanation:
              "Subtract EST offset (-5) from input time: 14.25 - (-5) = 19.25 UTC time.",
          },
          {
            label: "2",
            explanation:
              "Add CET offset (+1) to UTC time: 19.25 + 1 = 20.25 CET time.",
          },
          {
            label: "3",
            explanation:
              "Convert decimal 20.25 to HH:mm format: 20:15 (8:15 PM CET).",
          },
        ],
        result: "The equivalent time is 20:15 in CET.",
      }}
      relatedCalculators={[
        {
          title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
          url: "/conversion/bytes-b-kb-mb-gb-tb",
          icon: "💾",
        },
        {
          title: "Transfer Speed: Mbps ↔ MB/s",
          url: "/conversion/transfer-speed-mbps-mbs",
          icon: "📏",
        },
        {
          title: "Shoe Size: EU ↔ US ↔ UK",
          url: "/conversion/shoe-size-eu-us-uk",
          icon: "⚖️",
        },
        {
          title: "Compression Ratio & Size",
          url: "/conversion/compression-ratio-size",
          icon: "🌡️",
        },
        {
          title: "Currency: FX quick convert",
          url: "/conversion/currency-fx-quick-convert",
          icon: "📐",
        },
        {
          title: "Angle: deg ↔ rad",
          url: "/conversion/angle-deg-rad",
          icon: "⏱️",
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