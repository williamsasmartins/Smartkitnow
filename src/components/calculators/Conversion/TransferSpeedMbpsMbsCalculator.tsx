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

export default function TransferSpeedMbpsMbsCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("Mbps");
  const [toUnit, setToUnit] = useState("MB/s");

  // 2. LOGIC
  /**
   * Conversion logic:
   * 1 Mbps = 1,000,000 bits per second
   * 1 Byte = 8 bits
   * Therefore:
   * Mbps to MB/s: divide by 8
   * MB/s to Mbps: multiply by 8
   */
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a value to convert",
        formula: "Select units to see conversion factor",
      };
    }

    let result = 0;
    let formulaText = "";

    if (fromUnit === toUnit) {
      result = num;
      formulaText = `1 ${fromUnit} = 1 ${toUnit}`;
    } else if (fromUnit === "Mbps" && toUnit === "MB/s") {
      result = num / 8;
      formulaText = "1 Mbps = 0.125 MB/s (divide by 8)";
    } else if (fromUnit === "MB/s" && toUnit === "Mbps") {
      result = num * 8;
      formulaText = "1 MB/s = 8 Mbps (multiply by 8)";
    } else {
      // fallback (should not happen)
      result = 0;
      formulaText = "Conversion not supported";
    }

    return {
      value: result.toLocaleString(undefined, {
        maximumFractionDigits: 6,
      }),
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between Mbps and MB/s?",
      answer:
        "Mbps stands for Megabits per second and is commonly used to measure internet connection speeds, while MB/s stands for Megabytes per second and is often used to describe file transfer speeds. Since 1 Byte equals 8 bits, MB/s is typically 8 times smaller than Mbps for the same data rate. Understanding this difference helps in accurately interpreting speed and transfer rates.",
    },
    {
      question: "Why do I need to convert Mbps to MB/s?",
      answer:
        "Converting Mbps to MB/s helps you understand how fast files will actually download or transfer on your device, as file sizes are usually measured in bytes, not bits. Internet speeds are often advertised in Mbps, but when you download files, the speed is shown in MB/s. This conversion bridges the gap between network speed and actual file transfer speed.",
    },
    {
      question: "Is the conversion factor always exactly 8?",
      answer:
        "Yes, the conversion factor between bits and bytes is always 8 because 1 byte consists of 8 bits by definition. However, actual transfer speeds can be affected by network overhead, protocol inefficiencies, and hardware limitations, so the real-world speeds might differ slightly. The factor of 8 is a precise mathematical conversion used for calculations.",
    },
    {
      question: "Can I convert other units like Gbps or KB/s with this tool?",
      answer:
        "This specific converter focuses on Mbps and MB/s to provide precise and clear conversions between internet speed and file transfer rate. For other units like Gbps (Gigabits per second) or KB/s (Kilobytes per second), you would need a different converter or additional functionality. However, the principles of conversion remain similar, involving bit-to-byte conversions and unit scaling.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">
            Value
          </Label>
          <Input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Enter number..."
            min="0"
            step="any"
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
                <SelectItem value="Mbps">Mbps (Megabits per second)</SelectItem>
                <SelectItem value="MB/s">MB/s (Megabytes per second)</SelectItem>
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
                <SelectItem value="Mbps">Mbps (Megabits per second)</SelectItem>
                <SelectItem value="MB/s">MB/s (Megabytes per second)</SelectItem>
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
            // No extra action needed, conversion is reactive
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
      {val !== "" && results.value !== "" && (
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

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Transfer Speed: Mbps ↔ MB/s
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Transfer speed is a measure of how quickly data moves from one point to
          another, typically expressed in bits or bytes per second. Mbps (Megabits
          per second) is commonly used to describe internet connection speeds,
          whereas MB/s (Megabytes per second) is often used to indicate file
          transfer speeds on your device. Since 1 byte equals 8 bits, converting
          between these units is essential for understanding actual download or
          upload speeds.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This converter helps bridge the gap between network speeds and file
          transfer rates by accurately converting Mbps to MB/s and vice versa. By
          understanding these units and their relationship, you can better estimate
          how long it will take to download or upload files based on your internet
          speed. This knowledge empowers you to make informed decisions about your
          network usage and expectations.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter the numeric value of your transfer speed in the "Value" input field,
          then select the unit you want to convert from (Mbps or MB/s) and the unit
          you want to convert to. Click the "Convert" button to see the converted
          result instantly displayed below. Use the "Reset" button to clear your
          input and start a new conversion.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is designed to provide precise conversions between Mbps and MB/s,
          helping you understand your internet speed in terms of actual file transfer
          rates. Whether you are checking your internet plan or estimating download
          times, this converter makes the process straightforward and accurate.
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
              Mbps to MB/s
            </p>
            <p className="text-slate-500 text-sm">
              1 Mbps = 0.125 MB/s (divide by 8)
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              MB/s to Mbps
            </p>
            <p className="text-slate-500 text-sm">
              1 MB/s = 8 Mbps (multiply by 8)
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Transfer Speed: Mbps ↔ MB/s"
      description="Convert internet speed to file transfer rate. See how fast a file will download by converting Mbps (Megabits) to MB/s (Megabytes)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ FIX: VARIABLES MUST NOT BE EMPTY
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units to see formula",
        variables: [
          {
            symbol: "Input",
            description: `Value in ${fromUnit} (Megabits or Megabytes per second)`,
          },
          {
            symbol: "Result",
            description: `Equivalent value in ${toUnit} (Megabits or Megabytes per second)`,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "You have an internet speed of 100 Mbps and want to know the equivalent file transfer speed in MB/s.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Identify the units: from Mbps to MB/s. Since 1 Byte = 8 bits, divide the Mbps value by 8.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate: 100 Mbps ÷ 8 = 12.5 MB/s. This means your file transfer speed is 12.5 Megabytes per second.",
          },
          {
            label: "Step 3",
            explanation:
              "Interpret the result: At 12.5 MB/s, a 1 GB file would take approximately 80 seconds to download.",
          },
        ],
        result: "100 Mbps = 12.5 MB/s",
      }}
      relatedCalculators={[
        {
          title: "Pressure: Pa ↔ bar ↔ psi",
          url: "/conversion/pressure-pa-bar-psi",
          icon: "🔄",
        },
        {
          title: "Frequency: Hz ↔ kHz ↔ MHz",
          url: "/conversion/frequency-hz-khz-mhz",
          icon: "📏",
        },
        {
          title: "Energy: J ↔ cal ↔ kWh",
          url: "/conversion/energy-j-cal-kwh",
          icon: "⚖️",
        },
        {
          title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
          url: "/conversion/bytes-b-kb-mb-gb-tb",
          icon: "💾",
        },
        {
          title: "Length: m ↔ ft ↔ in",
          url: "/conversion/length-m-ft-in",
          icon: "📏",
        },
        {
          title: "Torque: N·m ↔ lbf·ft",
          url: "/conversion/torque-nm-lbfft",
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