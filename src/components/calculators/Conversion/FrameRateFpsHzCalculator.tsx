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

export default function FrameRateFpsHzCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("fps");
  const [toUnit, setToUnit] = useState("Hz");

  // 2. LOGIC
  // Conversion logic:
  // 1 fps = 1 Hz (frequency)
  // So conversion is direct: value in fps = value in Hz
  // But for clarity, we keep conversion logic explicit.

  const units = [
    { value: "fps", label: "Frames Per Second (fps)" },
    { value: "Hz", label: "Hertz (Hz)" },
  ];

  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a valid number",
        formula: `1 ${fromUnit} = 1 ${toUnit}`,
      };
    }

    // Conversion factor is 1:1 for fps <-> Hz
    // But let's keep logic flexible if needed in future.

    let result = num;
    let formulaText = `1 ${fromUnit} = 1 ${toUnit}`;

    // If fromUnit and toUnit are the same, result = input
    // Otherwise, conversion is 1:1

    if (fromUnit === toUnit) {
      result = num;
      formulaText = `1 ${fromUnit} = 1 ${toUnit}`;
    } else if (
      (fromUnit === "fps" && toUnit === "Hz") ||
      (fromUnit === "Hz" && toUnit === "fps")
    ) {
      result = num;
      formulaText = `1 ${fromUnit} = 1 ${toUnit}`;
    } else {
      // fallback, no conversion
      result = num;
      formulaText = `1 ${fromUnit} = 1 ${toUnit}`;
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
      question: "What is the difference between fps and Hz?",
      answer:
        "Frames Per Second (fps) measures how many individual frames are displayed each second in a video or animation, while Hertz (Hz) measures the refresh rate of a display, indicating how many times per second the screen updates. Although both are measured in cycles per second, fps relates to content creation and playback, whereas Hz relates to hardware display capabilities. Understanding both helps optimize smoothness and visual quality in video playback and gaming.",
    },
    {
      question: "Can fps and Hz values be different for smooth video playback?",
      answer:
        "Yes, fps and Hz can differ, and this difference can affect visual smoothness. For example, a video running at 30 fps on a monitor with a 60 Hz refresh rate will display each frame twice, which can cause judder or stutter. Matching fps to the display's Hz or using technologies like V-Sync or adaptive sync can help achieve smoother motion and reduce visual artifacts.",
    },
    {
      question: "Why is it important to match fps with monitor refresh rate?",
      answer:
        "Matching fps with the monitor's refresh rate ensures that each frame is displayed cleanly without tearing or stuttering, providing a smoother viewing experience. When fps exceeds or doesn’t align with the refresh rate, frames may be partially displayed or repeated, causing visual artifacts. Proper synchronization improves perceived fluidity, especially in fast-paced gaming or high-quality video playback.",
    },
    {
      question: "Does a higher Hz monitor always mean better performance?",
      answer:
        "A higher Hz monitor can display more frames per second, which potentially results in smoother motion and reduced input lag, especially beneficial in gaming and fast-action content. However, the actual performance depends on the fps output of the content or graphics card; if fps is lower than the monitor’s refresh rate, the benefits of a higher Hz may not be fully realized. Additionally, other factors like response time and color accuracy also influence overall display quality.",
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
                {units.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
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
                {units.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
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
            // No special action needed on convert, result updates automatically
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
      {val !== "" && !isNaN(parseFloat(val)) && (
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
          Understanding Frame Rate: fps ↔ Hz
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Frame rate, measured in frames per second (fps), indicates how many
          individual images or frames are displayed each second in a video or
          animation. Hertz (Hz), on the other hand, measures the refresh rate
          of a display device, representing how many times per second the
          screen updates its image. Understanding the relationship between fps
          and Hz is crucial for achieving smooth video playback and optimal
          visual performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          While fps relates to the content being played, Hz relates to the
          hardware displaying that content. A mismatch between these values can
          cause visual artifacts such as screen tearing or stuttering. This
          converter helps you precisely match and convert between fps and Hz to
          optimize your viewing or gaming experience.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter the numeric value you want to convert in the "Value" input
          field. Then, select the unit you want to convert from (fps or Hz) and
          the unit you want to convert to using the dropdown selectors. Click
          the "Convert" button to see the converted result displayed below,
          along with the conversion factor used.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          You can reset the input at any time by clicking the "Reset" button,
          which clears the value and allows you to start a new conversion.
          This tool is designed to provide accurate and immediate conversions
          between frame rate and refresh rate units, helping you make informed
          decisions for video playback and display settings.
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
            <a href="https://www.nist.gov/search?s=Frame%20Rate%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Frame Rate Conversion - NIST
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Official guide and standards for Frame Rate Conversion from the National Institute of Standards and Technology.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Frame%20Rate%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Frame Rate Conversion - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Learn the math and science behind Frame Rate Conversion with free interactive lessons and videos from Khan Academy.
            </p>
          </li>
          <li>
            <a href="https://www.calculator.net/search?q=Frame%20Rate%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Frame Rate Conversion - Calculator.net
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Compare results and explore alternative calculation methods for Frame Rate Conversion on Calculator.net.
            </p>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Frame%20Rate%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Frame Rate Conversion - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Detailed encyclopedia article covering the history, standards, and usage of Frame Rate Conversion.
            </p>
          </li>
        </ul>
      </section>

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Common Conversion Factors
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 fps = 1 Hz
            </p>
            <p className="text-slate-500 text-sm">
              Frames per second and Hertz are equivalent units when measuring
              frame rate and refresh rate, respectively. This means that 1 fps
              corresponds exactly to 1 Hz.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Matching fps and Hz
            </p>
            <p className="text-slate-500 text-sm">
              For smooth video playback, it is ideal to have the fps of the
              content match the Hz of the display to avoid visual artifacts
              such as tearing or stuttering.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Frame Rate: fps ↔ Hz"
      description="Convert video frame rates to refresh rates. Match FPS (Frames Per Second) with monitor Hz for smooth video playback."
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
            description: `Value in ${fromUnit === "fps" ? "Frames Per Second (fps)" : "Hertz (Hz)"}`,
          },
          {
            symbol: "Result",
            description: `Value converted to ${toUnit === "fps" ? "Frames Per Second (fps)" : "Hertz (Hz)"}`,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert 60 frames per second (fps) to Hertz (Hz) to understand the equivalent refresh rate.",
        steps: [
          {
            label: "1",
            explanation:
              "Since 1 fps equals 1 Hz, the conversion factor is 1:1.",
          },
          {
            label: "2",
            explanation:
              "Multiply the input value (60 fps) by the conversion factor (1) to get the result.",
          },
          {
            label: "3",
            explanation:
              "The result is 60 Hz, meaning 60 frames per second corresponds to a 60 Hz refresh rate.",
          },
        ],
        result: "60 fps = 60 Hz",
      }}
      relatedCalculators={[
        {
          title: "Angle: deg ↔ rad",
          url: "/conversion/angle-deg-rad",
          icon: "🔄",
        },
        {
          title: "Compression Ratio & Size",
          url: "/conversion/compression-ratio-size",
          icon: "📏",
        },
        {
          title: "Checksum & Hash Quick Tools",
          url: "/conversion/checksum-hash-quick-tools",
          icon: "⚖️",
        },
        {
          title: "Temperature: °C ↔ °F ↔ K",
          url: "/conversion/temperature-c-f-k",
          icon: "🌡️",
        },
        {
          title: "Bits: b ↔ kb ↔ Mb ↔ Gb",
          url: "/conversion/bits-b-kb-mb-gb",
          icon: "💾",
        },
        {
          title: "Frequency: Hz ↔ kHz ↔ MHz",
          url: "/conversion/frequency-hz-khz-mhz",
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