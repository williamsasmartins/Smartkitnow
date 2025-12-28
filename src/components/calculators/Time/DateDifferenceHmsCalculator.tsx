import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DateDifferenceHmsCalculator() {
  // State for inputs: startDate, endDate, and option to add/subtract days/hours
  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
    value: "",
    option: "addDays", // addDays, subDays, addHours, subHours
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    try {
      if (!inputs.startDate) return null;

      const start = new Date(inputs.startDate);
      if (isNaN(start.getTime())) return { primary: "Invalid start date", secondary: "", details: "", feedback: "" };

      // If endDate is provided, calculate difference between start and end
      if (inputs.endDate) {
        const end = new Date(inputs.endDate);
        if (isNaN(end.getTime())) return { primary: "Invalid end date", secondary: "", details: "", feedback: "" };

        const diffMs = Math.abs(end.getTime() - start.getTime());
        const diffH = Math.floor(diffMs / (1000 * 60 * 60));
        const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffS = Math.floor((diffMs % (1000 * 60)) / 1000);

        return {
          primary: `${diffH}h ${diffM}m ${diffS}s`,
          secondary: "Difference between dates",
          details: `From ${start.toLocaleString()} to ${end.toLocaleString()}`,
          feedback: "Exact difference in hours, minutes, and seconds.",
        };
      }

      // Otherwise, use value and option to add/subtract time from startDate
      if (!inputs.value) return null;
      const valNum = Number(inputs.value);
      if (isNaN(valNum)) return { primary: "Invalid value", secondary: "", details: "", feedback: "" };

      let resultDate = new Date(start.getTime());
      switch (inputs.option) {
        case "addDays":
          resultDate.setDate(resultDate.getDate() + valNum);
          break;
        case "subDays":
          resultDate.setDate(resultDate.getDate() - valNum);
          break;
        case "addHours":
          resultDate.setHours(resultDate.getHours() + valNum);
          break;
        case "subHours":
          resultDate.setHours(resultDate.getHours() - valNum);
          break;
        default:
          return { primary: "Invalid option", secondary: "", details: "", feedback: "" };
      }

      // Calculate difference between start and resultDate
      const diffMs = resultDate.getTime() - start.getTime();
      const sign = diffMs < 0 ? "-" : "";
      const absDiffMs = Math.abs(diffMs);
      const diffH = Math.floor(absDiffMs / (1000 * 60 * 60));
      const diffM = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffS = Math.floor((absDiffMs % (1000 * 60)) / 1000);

      return {
        primary: `${sign}${diffH}h ${diffM}m ${diffS}s`,
        secondary: `Resulting date/time: ${resultDate.toLocaleString()}`,
        details: `Base date/time: ${start.toLocaleString()}`,
        feedback: `Operation: ${inputs.option.replace(/([A-Z])/g, " $1").toLowerCase()} ${valNum}`,
      };
    } catch (error) {
      return { primary: "Error in calculation", secondary: "", details: "", feedback: "" };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "How does this calculator handle Daylight Saving Time changes?",
      answer:
        "This calculator uses the JavaScript Date object, which automatically accounts for Daylight Saving Time (DST) changes based on the local time zone of the input date. However, when adding or subtracting days or hours, DST transitions may cause the actual elapsed time to differ by an hour. Always verify results around DST boundaries for critical applications.",
    },
    {
      question: "Can I calculate the difference between two dates in hours, minutes, and seconds?",
      answer:
        "Yes, by entering both a start date/time and an end date/time, the calculator computes the absolute difference between them and displays the result in hours, minutes, and seconds for precise time interval measurement.",
    },
    {
      question: "What date/time formats are supported for input?",
      answer:
        "The calculator accepts ISO 8601 date/time strings compatible with the HTML datetime-local input type, such as 'YYYY-MM-DDTHH:mm'. Ensure your input matches this format to avoid parsing errors.",
    },
    {
      question: "Does the calculator consider time zones?",
      answer:
        "The calculator uses the local time zone of the user's browser environment. It does not currently support explicit time zone conversions but formats dates according to the local time zone settings.",
    },
    {
      question: "How do I add or subtract days or hours from a base date?",
      answer:
        "Select the desired operation (add or subtract days/hours), enter the numeric value, and the base date/time. The calculator will compute the resulting date/time and show the exact difference in hours, minutes, and seconds.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a software deployment scheduled to start on July 1, 2024, at 10:00 AM. You want to know the exact date and time after adding 3 days and 5 hours to the base date/time to estimate the deployment completion.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter the base date/time as 2024-07-01T10:00.",
      },
      {
        label: "Step 2",
        explanation: "Select 'Add Days' and enter 3 to add three days.",
      },
      {
        label: "Step 3",
        explanation: "Calculate to get the intermediate date/time: July 4, 2024, 10:00 AM.",
      },
      {
        label: "Step 4",
        explanation: "Change the option to 'Add Hours' and enter 5 to add five hours.",
      },
      {
        label: "Step 5",
        explanation: "Calculate again to get the final date/time: July 4, 2024, 3:00 PM.",
      },
    ],
    result: "The deployment will complete on July 4, 2024, at 3:00 PM, exactly 3 days and 5 hours after the start.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description: "International standard for date and time representation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "MDN Web Docs: Date",
      description: "Comprehensive guide to JavaScript Date object and methods.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
    },
    {
      title: "Understanding Daylight Saving Time",
      description: "Explanation of DST and its impact on time calculations.",
      url: "https://www.timeanddate.com/time/dst/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Base Date and Time</Label>
          <Input
            type="datetime-local"
            value={inputs.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            placeholder="YYYY-MM-DDTHH:mm"
          />
        </div>
        <div className="space-y-2">
          <Label>End Date and Time (optional)</Label>
          <Input
            type="datetime-local"
            value={inputs.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            placeholder="YYYY-MM-DDTHH:mm"
          />
        </div>
      </div>

      {!inputs.endDate && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant={inputs.option === "addDays" ? "default" : "outline"}
              onClick={() => handleInputChange("option", "addDays")}
            >
              Add Days
            </Button>
            <Button
              variant={inputs.option === "subDays" ? "default" : "outline"}
              onClick={() => handleInputChange("option", "subDays")}
            >
              Subtract Days
            </Button>
            <Button
              variant={inputs.option === "addHours" ? "default" : "outline"}
              onClick={() => handleInputChange("option", "addHours")}
            >
              Add Hours
            </Button>
            <Button
              variant={inputs.option === "subHours" ? "default" : "outline"}
              onClick={() => handleInputChange("option", "subHours")}
            >
              Subtract Hours
            </Button>
          </div>
          <div className="space-y-2 mt-4">
            <Label>Value (number)</Label>
            <Input
              type="number"
              min="0"
              value={inputs.value}
              onChange={(e) => handleInputChange("value", e.target.value)}
              placeholder="Enter number of days or hours"
            />
          </div>
        </>
      )}

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg mt-4" onClick={() => {}}>
        <Clock className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>Enter the base date and time in the first input field using the format YYYY-MM-DDTHH:mm.</li>
          <li>
            Optionally, enter an end date and time to calculate the difference between two specific dates in hours,
            minutes, and seconds.
          </li>
          <li>
            If no end date is provided, select an operation (add or subtract days or hours) and enter the numeric value
            to adjust the base date/time.
          </li>
          <li>Click the Calculate button to see the resulting time difference or the new calculated date/time.</li>
          <li>Review the result displayed below for precise hours, minutes, and seconds difference or the adjusted date/time.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Date Difference in Hours/Minutes/Seconds
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Calculating the difference between dates or adjusting dates by adding or subtracting days and hours is a
            common requirement in software development, project management, and scheduling. The JavaScript Date object
            provides powerful methods to handle these calculations accurately. When working with dates, it is important
            to consider factors such as leap years, time zones, and Daylight Saving Time (DST) changes.
          </p>
          <p>
            Leap years add an extra day (February 29) every four years to keep the calendar year synchronized with the
            astronomical year. This affects date calculations spanning multiple years. Time zones determine the local
            time offset from Coordinated Universal Time (UTC), and JavaScript Date objects use the local time zone of the
            environment by default.
          </p>
          <p>
            Daylight Saving Time shifts clocks forward or backward by one hour during certain periods of the year to
            extend evening daylight. This can cause apparent anomalies in time calculations, such as a day being 23 or
            25 hours long. The JavaScript Date object automatically adjusts for DST transitions, but developers should
            be cautious when adding or subtracting time intervals around these boundaries.
          </p>
          <p>
            For precise time interval calculations, always use UTC-based methods or libraries designed for time zone
            handling if working across multiple time zones. This calculator simplifies these complexities by using local
            time and standard JavaScript methods, suitable for most common use cases.
          </p>
        </div>
      </section>

      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>DST Confusion:</strong> Daylight Saving Time often causes 1-hour errors when adding or subtracting
            days/hours near DST transitions. Always verify results around these dates.
          </p>
          <p>
            <strong>Incorrect Date Formats:</strong> Using unsupported or ambiguous date/time formats can lead to parsing
            errors or incorrect calculations. Use ISO 8601 format (YYYY-MM-DDTHH:mm) for best results.
          </p>
          <p>
            <strong>Ignoring Time Zones:</strong> Calculations assume local time zone. For cross-time zone calculations,
            consider using libraries like Luxon or date-fns-tz.
          </p>
          <p>
            <strong>Negative Values:</strong> Subtracting more days or hours than the base date/time can result in dates
            before the Unix epoch or unexpected results if not handled properly.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol>
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

      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Date Difference in Hours/Minutes/Seconds"
      description="Professional time calculator: Date Difference in Hours/Minutes/Seconds. Precise calculations, time zone handling, and scheduling tools."
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