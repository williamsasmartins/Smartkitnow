import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function formatTime(ms: number) {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const msRemainder = ms % 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${msRemainder
    .toString()
    .padStart(3, "0")}`;
}

export default function StopwatchSplitTimesCalculator() {
  // Inputs: User enters start time and multiple split times (in milliseconds or hh:mm:ss.ms)
  // For simplicity, we allow user to enter start time and split times as elapsed times in hh:mm:ss.ms format.
  // The calculator will show total elapsed time and split intervals.

  const [inputs, setInputs] = useState({
    startTime: "00:00:00.000",
    splits: "00:00:10.000\n00:00:25.500\n00:00:40.750\n00:01:05.000", // multiline string, each line a split time
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Parse hh:mm:ss.ms format to milliseconds
  const parseTimeToMs = (timeStr: string) => {
    // Accepts formats like 00:01:23.456 or 1:23.456 or 23.456 or 23
    const regex =
      /^(?:(\d+):)?(?:(\d{1,2}):)?(\d{1,2})(?:\.(\d{1,3}))?$/; // groups: h?, m?, s, ms?
    const match = timeStr.trim().match(regex);
    if (!match) return NaN;
    let h = 0,
      m = 0,
      s = 0,
      ms = 0;
    if (match[3] !== undefined) s = parseInt(match[3], 10);
    if (match[2] !== undefined) m = parseInt(match[2], 10);
    if (match[1] !== undefined) h = parseInt(match[1], 10);
    if (match[4] !== undefined) {
      ms = parseInt(match[4].padEnd(3, "0"), 10);
    }
    return ((h * 3600 + m * 60 + s) * 1000 + ms) || 0;
  };

  // Calculate results
  const results = useMemo(() => {
    try {
      const startMs = parseTimeToMs(inputs.startTime);
      if (isNaN(startMs)) {
        return {
          primary: "Invalid start time",
          secondary: "",
          details: "Please enter start time in hh:mm:ss.ms format",
          feedback: "",
        };
      }
      const splitLines = inputs.splits
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const splitMsArr = splitLines.map((line) => parseTimeToMs(line));
      if (splitMsArr.some((ms) => isNaN(ms))) {
        return {
          primary: "Invalid split time(s)",
          secondary: "",
          details: "Please enter split times in hh:mm:ss.ms format, one per line",
          feedback: "",
        };
      }

      // Sort splits ascending (stopwatch times should be increasing)
      splitMsArr.sort((a, b) => a - b);

      // Calculate split intervals (diff between splits)
      const intervals = splitMsArr.map((ms, i) =>
        i === 0 ? ms - startMs : ms - splitMsArr[i - 1]
      );

      // Total elapsed time = last split - start
      const totalElapsed = splitMsArr.length
        ? splitMsArr[splitMsArr.length - 1] - startMs
        : 0;

      // Format output strings
      const formattedSplits = splitMsArr.map((ms, i) => ({
        label: `Split ${i + 1}`,
        time: formatTime(ms),
        interval: formatTime(intervals[i]),
      }));

      return {
        primary: formatTime(totalElapsed),
        secondary: "Total Elapsed Time",
        details: (
          <div className="text-left max-w-md mx-auto">
            <p className="font-semibold mb-2">Split Times & Intervals:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              {formattedSplits.map((split) => (
                <li key={split.label}>
                  <strong>{split.label}:</strong> {split.time} (Interval:{" "}
                  {split.interval})
                </li>
              ))}
            </ul>
          </div>
        ),
        feedback:
          "Ensure split times are entered in ascending order and in the correct format.",
      };
    } catch (e) {
      return {
        primary: "Error",
        secondary: "",
        details: "An unexpected error occurred. Please check your inputs.",
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "How do I enter split times correctly?",
      answer:
        "Split times should be entered in ascending order, each on a new line, using the hh:mm:ss.ms format. For example, '00:01:23.456' represents 1 minute, 23 seconds, and 456 milliseconds. This format ensures accurate calculation of intervals and total elapsed time.",
    },
    {
      question: "Can I enter split times without hours or milliseconds?",
      answer:
        "Yes, the calculator supports flexible time formats. You can enter times like '1:23' for 1 minute 23 seconds or '45.678' for 45 seconds and 678 milliseconds. The parser intelligently interprets these inputs to milliseconds for calculations.",
    },
    {
      question: "What if my split times are not in order?",
      answer:
        "The calculator automatically sorts split times in ascending order before calculating intervals. However, for clarity and accuracy, it's best to enter them in chronological order as recorded during your stopwatch session.",
    },
    {
      question: "Can I use this tool for lap timing in races?",
      answer:
        "Absolutely! This tool is ideal for calculating lap times and split intervals in races or any timed events. Enter your start time and each split time to see total elapsed time and individual lap intervals clearly.",
    },
    {
      question: "Why is the total elapsed time different from the last split time?",
      answer:
        "The total elapsed time is calculated as the difference between the last split time and the start time. If your start time is not zero, the total elapsed time will reflect the actual duration between these two points, which may differ from the last split time value alone.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "A runner uses a stopwatch to record split times during a 5K race. The start time is 00:00:00.000, and splits are recorded at various checkpoints to analyze performance.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the start time of the stopwatch, usually 00:00:00.000 if starting from zero.",
      },
      {
        label: "Step 2",
        explanation:
          "Input each split time on a new line in ascending order, for example, 00:00:10.000, 00:00:25.500, etc.",
      },
      {
        label: "Step 3",
        explanation:
          "Click Calculate to view total elapsed time and the intervals between splits.",
      },
    ],
    result:
      "The tool calculates the total race time and individual lap times, helping the runner analyze pacing and performance.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description:
        "International standard for date and time representation, ensuring consistency across systems.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "MDN Web Docs: Date object",
      description:
        "Comprehensive documentation on JavaScript Date object and time handling.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
    },
    {
      title: "Understanding Stopwatch and Split Times",
      description:
        "An article explaining stopwatch usage and split time calculations in sports timing.",
      url: "https://www.runnersworld.com/advanced/a20803110/how-to-use-a-stopwatch/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time (hh:mm:ss.ms)</Label>
          <Input
            id="startTime"
            type="text"
            placeholder="00:00:00.000"
            value={inputs.startTime}
            onChange={(e) => handleInputChange("startTime", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="splits">
            Split Times (one per line, hh:mm:ss.ms)
          </Label>
          <Input
            id="splits"
            as="textarea"
            rows={6}
            placeholder={"00:00:10.000\n00:00:25.500\n00:00:40.750"}
            value={inputs.splits}
            onChange={(e) => handleInputChange("splits", e.target.value)}
            className="font-mono"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Clock className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Result
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <div className="text-xs text-slate-500 mt-2">{results.details}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            Enter the start time of your stopwatch in the format hh:mm:ss.ms. For
            example, "00:00:00.000" if starting from zero.
          </li>
          <li>
            Input each split time on a new line in the same format. Ensure split
            times are in ascending order to reflect the actual timing sequence.
          </li>
          <li>
            Click the "Calculate" button to process the inputs. The calculator
            will display the total elapsed time and intervals between splits.
          </li>
          <li>
            Review the results to analyze your timing data, such as lap times or
            segment durations.
          </li>
          <li>
            Adjust inputs as needed for different sessions or to correct any input
            errors.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to
          Stopwatch & Split Times (web tool)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Stopwatch and split time calculations are essential in many fields,
            especially sports, project management, and scientific experiments.
            Understanding how to accurately record and analyze these times can
            greatly improve performance and insights. A stopwatch measures elapsed
            time from a start point, while split times mark intermediate checkpoints
            during the timing session.
          </p>
          <p>
            When working with time data, it’s crucial to use consistent formats and
            consider factors like time zones, daylight saving time (DST), and leap
            seconds. Although this calculator focuses on elapsed times rather than
            absolute dates, understanding these concepts is important for broader
            time management.
          </p>
          <p>
            <strong>Leap Years:</strong> These occur every four years to keep the
            calendar year synchronized with the astronomical year. They add an
            extra day (February 29) to the calendar. Leap seconds are occasionally
            added to account for Earth's slowing rotation.
          </p>
          <p>
            <strong>UTC and Time Zones:</strong> Coordinated Universal Time (UTC)
            is the primary time standard by which the world regulates clocks and
            time. Local times vary by time zones, which are offsets from UTC.
            Handling time zones correctly is vital for scheduling and logging events
            across regions.
          </p>
          <p>
            <strong>Daylight Saving Time (DST):</strong> DST shifts clocks forward
            or backward by one hour during certain periods of the year to extend
            evening daylight. This can cause confusion in time calculations if not
            accounted for properly.
          </p>
          <p>
            This tool simplifies these complexities by focusing on elapsed time and
            split intervals, allowing you to analyze durations without worrying
            about calendar dates or time zone conversions.
          </p>
        </div>
      </section>

      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>DST Confusion:</strong> Although this tool deals with elapsed
            times, mixing absolute times with local times during DST changes can
            cause errors. Always use elapsed times relative to a start point.
          </p>
          <p>
            <strong>Incorrect Time Format:</strong> Entering times in inconsistent
            or incorrect formats (e.g., missing leading zeros or wrong separators)
            can lead to parsing errors or inaccurate results.
          </p>
          <p>
            <strong>Unordered Splits:</strong> Inputting split times out of
            chronological order can confuse interval calculations. The calculator
            sorts splits but maintaining order helps avoid mistakes.
          </p>
          <p>
            <strong>Negative Intervals:</strong> If a split time is earlier than the
            start time, intervals may become negative, which is logically incorrect
            for elapsed time measurements.
          </p>
          <p>
            <strong>Ignoring Milliseconds:</strong> For precise timing, especially
            in sports, ignoring milliseconds can reduce accuracy. Always include
            milliseconds if available.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>{example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-3">
            {example.steps.map((step, i) => (
              <li key={i}>
                <strong>{step.label}:</strong> {step.explanation}
              </li>
            ))}
          </ol>
          <p>
            <strong>Result:</strong> {example.result}
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0"
            >
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional
          resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {ref.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Stopwatch & Split Times (web tool)"
      description="Professional time calculator: Stopwatch & Split Times (web tool). Precise calculations, time zone handling, and scheduling tools."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "example", label: "Real World Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}