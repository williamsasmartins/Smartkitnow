import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sigma, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function parseNumberArray(input: string): number[] | null {
  if (!input) return null;
  // Split by comma or space, trim, filter empty, parse floats
  const parts = input
    .split(/[\s,]+/)
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
  const nums: number[] = [];
  for (const p of parts) {
    const n = Number(p);
    if (isNaN(n)) return null;
    nums.push(n);
  }
  return nums.length > 0 ? nums : null;
}

function calculateMean(nums: number[]): string {
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = sum / nums.length;
  return mean.toFixed(4);
}

function calculateMedian(nums: number[]): string {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  let median: number;
  if (sorted.length % 2 === 0) {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    median = sorted[mid];
  }
  return median.toFixed(4);
}

function calculateMode(nums: number[]): string {
  const freqMap = new Map<number, number>();
  nums.forEach((num) => {
    freqMap.set(num, (freqMap.get(num) ?? 0) + 1);
  });
  let maxFreq = 0;
  freqMap.forEach((count) => {
    if (count > maxFreq) maxFreq = count;
  });
  if (maxFreq === 1) return "No mode";
  const modes = Array.from(freqMap.entries())
    .filter(([, count]) => count === maxFreq)
    .map(([num]) => num)
    .sort((a, b) => a - b);
  return modes.join(", ");
}

export default function MeanMedianModeCalculator() {
  const [inputs, setInputs] = useState({ numbers: "" });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const nums = parseNumberArray(inputs.numbers);
    if (!nums) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Please enter a valid list of numbers separated by commas or spaces.",
        formulaUsed: null,
      };
    }
    if (nums.length === 0) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Input list cannot be empty.",
        formulaUsed: null,
      };
    }
    const mean = calculateMean(nums);
    const median = calculateMedian(nums);
    const mode = calculateMode(nums);

    return {
      value: "",
      label: "",
      subtext: "",
      warning: null,
      formulaUsed: null,
      mean,
      median,
      mode,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between mean, median, and mode?",
      answer:
        "All three measure the center of a data set but in different ways. The mean sums all values and divides by count — for [2, 3, 3, 7, 9, 10], mean = 34/6 ≈ 5.67. The median is the middle value of the sorted list — here (3 + 7)/2 = 5, since there are 6 values. The mode is the most frequent value — here 3 (appears twice). When data is symmetric and has no outliers, all three are close. When data is skewed, they diverge significantly.",
    },
    {
      question: "When should I use median instead of mean?",
      answer:
        "Use the median when your data is skewed or contains outliers that would distort the mean. Classic examples: (1) Income data — a few billionaires make the mean household income misleadingly high; the median gives a better picture of what a typical household earns. (2) Home prices — one luxury property skews the mean for a neighborhood. (3) Response times — a few slow responses inflate the mean; the median reflects the typical user experience. The U.S. Census Bureau reports median household income precisely for this reason.",
    },
    {
      question: "Can a data set have more than one mode?",
      answer:
        "Yes. A data set is unimodal if one value appears most frequently, bimodal if two values tie for most frequent, and multimodal if three or more tie. Example: [1, 2, 2, 3, 3, 4] has modes 2 and 3 (bimodal). If all values appear exactly once, there is no mode — no single value stands out. Bimodal distributions are common in real data and often signal two distinct subgroups (e.g., a class with two separate skill clusters).",
    },
    {
      question: "What is the difference between population mean and sample mean?",
      answer:
        "The population mean (μ) is the true average of an entire group — all test scores from every student ever, for example. The sample mean (x̄) is the average of a subset drawn from that population, used to estimate μ when measuring everyone is impractical. The formulas are identical (sum ÷ count), but the notation differs. For variance, the population version divides by n and the sample version divides by (n−1) to correct for underestimation bias — this is called Bessel's correction.",
    },
    {
      question: "Why is the median important in statistics?",
      answer:
        "The median is a robust measure of central tendency because it is not affected by extreme values. Consider salaries [30K, 35K, 40K, 42K, 500K]: mean = 129.4K (misleading), median = 40K (representative). The median is also the 50th percentile — half of data falls below it, half above. In right-skewed distributions (income, home prices, survival times), median > mean signals the skew. In left-skewed distributions (exam scores near a ceiling), mean > median signals skew in the other direction.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <Label htmlFor="numbers" className="font-semibold text-slate-900 dark:text-slate-100 mb-2 block">
          Enter numbers (comma or space separated)
        </Label>
        <Input
          id="numbers"
          type="text"
          placeholder="e.g. 1, 2, 2, 3, 4"
          value={inputs.numbers}
          onChange={(e) => handleInputChange("numbers", e.target.value)}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed, results update automatically
          }}
          type="button"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ numbers: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.warning ? (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-200">{results.warning}</p>
        </div>
      ) : results.mean ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center space-y-6">
              <div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">Mean (Average)</p>
                <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.mean}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">Median (Middle Value)</p>
                <p className="text-4xl font-bold text-blue-800 dark:text-white">{results.median}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">Mode (Most Frequent)</p>
                <p className="text-3xl font-semibold text-blue-700 dark:text-white">{results.mode}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Mean, Median, Mode Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Mean, Median, and Mode are fundamental measures of central tendency in statistics, each providing unique insights into a data set. The mean, often called the average, sums all values and divides by the number of values, offering a general sense of the data's center. However, it can be influenced by extreme values or outliers.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The median represents the middle value when the data is sorted in ascending order. It is especially useful for skewed distributions, as it is not affected by outliers. The mode identifies the most frequently occurring value(s) in the data set, which can be helpful in understanding common or repeated values.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator allows you to input any list of numbers separated by commas or spaces and instantly find the mean, median, and mode. It ensures precision by rounding decimal results to four decimal places, making it a reliable tool for students, educators, and professionals alike.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Mean (μ) = (Σ xᵢ) / n

Median:
- Sort data: x₁ ≤ x₂ ≤ ... ≤ xₙ
- If n odd: Median = x_{(n+1)/2}
- If n even: Median = (x_{n/2} + x_{(n/2)+1}) / 2

Mode:
- The value(s) that appear most frequently in the data set.
- If all values appear once, no mode exists.`}
        </pre>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">FAQ</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Mean, Median, Mode Calculator"
      description="Calculate Mean, Median, and Mode. Find the average, middle value, and most frequent number in any data set."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `Mean (μ) = (Σ xᵢ) / n

Median:
- Sort data: x₁ ≤ x₂ ≤ ... ≤ xₙ
- If n odd: Median = x_{(n+1)/2}
- If n even: Median = (x_{n/2} + x_{(n/2)+1}) / 2

Mode:
- The value(s) that appear most frequently in the data set.
- If all values appear once, no mode exists.`,
        variables: [
          { symbol: "xᵢ", description: "Each individual number in the data set" },
          { symbol: "n", description: "Total number of values in the data set" },
          { symbol: "μ", description: "Mean (average) of the data set" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate the mean, median, and mode for the data set: 3, 7, 7, 2, 9, 10, 3",
        steps: [
          { label: "1", explanation: "Sort the data: 2, 3, 3, 7, 7, 9, 10" },
          { label: "2", explanation: "Mean = (3 + 7 + 7 + 2 + 9 + 10 + 3) / 7 = 41 / 7 ≈ 5.8571" },
          { label: "3", explanation: "Median = middle value = 7 (4th value in sorted list)" },
          { label: "4", explanation: "Mode = 3 and 7 (both appear twice, most frequent)" },
        ],
        result: "Mean ≈ 5.8571, Median = 7, Mode = 3, 7",
      }}
      relatedCalculators={[
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}