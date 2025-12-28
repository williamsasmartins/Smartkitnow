import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Calendar as CalendarIcon,
  Globe,
  Info,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Timer,
  Sun,
  Moon,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDaysInMonth(year: number, month: number): number {
  // month: 0-based (0=Jan, 11=Dec)
  if (month === 1) {
    // February
    return isLeapYear(year) ? 29 : 28;
  }
  const daysInMonth = [31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonth[month];
}

function generateCalendar(year: number, month: number) {
  // month: 0-based
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun, 6=Sat

  // Create a matrix of weeks (each week is array of 7 days)
  // Fill empty days before first day with null
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = new Array(7).fill(null);

  let dayCounter = 1;
  // Fill first week
  for (let i = firstDay; i < 7; i++) {
    week[i] = dayCounter++;
  }
  weeks.push(week);

  // Fill subsequent weeks
  while (dayCounter <= daysInMonth) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
      week[i] = dayCounter++;
    }
    weeks.push(week);
  }

  return weeks;
}

function formatMonthYear(year: number, month: number) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${monthNames[month]} ${year}`;
}

function exportCalendarToPDF(year: number, month: number) {
  // Since no external libs allowed, we mock this function.
  // In real app, use jsPDF or pdf-lib to generate PDF.
  alert(`PDF export for ${formatMonthYear(year, month)} is not implemented in this demo.`);
}

const example = {
  title: "Real World Example",
  scenario:
    "Planning a quarterly marketing campaign starting in February 2024. You want to generate a calendar for February 2024 to visualize key dates and export it as a PDF to share with your team.",
  steps: [
    {
      label: "Step 1",
      explanation: "Select the year 2024 and the month February from the dropdown menus.",
    },
    {
      label: "Step 2",
      explanation: "Click the 'Generate Calendar' button to view the calendar for February 2024.",
    },
    {
      label: "Step 3",
      explanation:
        "Use the 'Export PDF' button to download the calendar as a PDF file for distribution.",
    },
  ],
  result:
    "You get a clear, printable calendar for February 2024 that helps coordinate your campaign timeline effectively.",
};

export default function CalendarGeneratorPdfCalculator() {
  const [inputs, setInputs] = useState({
    year: "",
    month: "",
  });

  const [calendar, setCalendar] = useState<(number | null)[][] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    setError(null);
    const yearNum = parseInt(inputs.year, 10);
    const monthNum = parseInt(inputs.month, 10);

    if (
      isNaN(yearNum) ||
      yearNum < 1900 ||
      yearNum > 2100 ||
      isNaN(monthNum) ||
      monthNum < 1 ||
      monthNum > 12
    ) {
      setError("Please enter a valid year (1900-2100) and month (1-12).");
      setCalendar(null);
      return;
    }

    const cal = generateCalendar(yearNum, monthNum - 1);
    setCalendar(cal);
  };

  const handleExportPDF = () => {
    const yearNum = parseInt(inputs.year, 10);
    const monthNum = parseInt(inputs.month, 10);
    if (calendar && !isNaN(yearNum) && !isNaN(monthNum)) {
      exportCalendarToPDF(yearNum, monthNum - 1);
    }
  };

  const faqs = [
    {
      question: "How does the calendar handle leap years?",
      answer:
        "The calendar generator automatically detects leap years using the standard Gregorian calendar rules. If the selected year is a leap year, February will have 29 days instead of 28. This ensures the calendar is accurate for all years, including leap years occurring every 4 years, except centuries not divisible by 400.",
    },
    {
      question: "Can I generate calendars for any year and month?",
      answer:
        "Yes, you can generate calendars for any year between 1900 and 2100 and any month from January to December. This wide range covers most practical use cases for planning and scheduling. Input validation ensures that invalid dates are not processed.",
    },
    {
      question: "Does the calendar consider time zones or daylight saving time?",
      answer:
        "This calendar generator focuses on month and year layout and does not incorporate time zones or daylight saving time adjustments. It provides a static calendar view for the selected month and year, suitable for general scheduling and planning purposes.",
    },
    {
      question: "How can I export the generated calendar as a PDF?",
      answer:
        "Currently, the export to PDF feature is a placeholder that alerts the user. In a full implementation, this would generate a PDF file of the calendar layout for easy printing and sharing. Integration with libraries like jsPDF or pdf-lib would be required for actual PDF generation.",
    },
    {
      question: "What if I enter an invalid month or year?",
      answer:
        "The calculator validates your inputs and will display an error message if the year is outside the range 1900-2100 or if the month is not between 1 and 12. This prevents generating incorrect or nonsensical calendars and helps maintain accuracy.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description: "International standard for date and time representation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "MDN Web Docs: Date",
      description:
        "Comprehensive documentation on JavaScript Date object and its methods.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
    },
    {
      title: "Leap Year - Wikipedia",
      description:
        "Detailed explanation of leap year rules and history in the Gregorian calendar.",
      url: "https://en.wikipedia.org/wiki/Leap_year",
    },
    {
      title: "jsPDF Library",
      description:
        "Popular JavaScript library for generating PDF documents in the browser.",
      url: "https://github.com/parallax/jsPDF",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year-input">Year</Label>
          <Input
            id="year-input"
            type="number"
            min={1900}
            max={2100}
            placeholder="e.g. 2024"
            value={inputs.year}
            onChange={(e) => handleInputChange("year", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="month-select">Month</Label>
          <Select
            value={inputs.month}
            onValueChange={(value) => handleInputChange("month", value)}
          >
            <SelectTrigger id="month-select" aria-label="Select month">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((monthName, idx) => (
                <SelectItem key={idx} value={(idx + 1).toString()}>
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={handleGenerate}
        aria-label="Generate calendar"
      >
        <CalendarIcon className="mr-2 h-5 w-5" /> Generate Calendar
      </Button>

      {error && (
        <div className="text-red-600 font-semibold text-center">{error}</div>
      )}

      {calendar && (
        <>
          <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
            <CardContent className="p-6 text-center">
              <span className="text-sm font-semibold text-slate-500 uppercase">
                Calendar for {formatMonthYear(parseInt(inputs.year), parseInt(inputs.month) - 1)}
              </span>
              <table className="w-full mt-4 border-collapse text-sm">
                <thead>
                  <tr>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                      <th
                        key={d}
                        className="border border-slate-300 dark:border-slate-700 p-1 text-blue-600"
                      >
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calendar.map((week, i) => (
                    <tr key={i}>
                      {week.map((day, idx) => (
                        <td
                          key={idx}
                          className={`border border-slate-300 dark:border-slate-700 p-2 text-center ${
                            idx === 0 || idx === 6
                              ? "text-red-600 dark:text-red-400 font-semibold"
                              : ""
                          }`}
                        >
                          {day ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Button
            className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg mt-4"
            onClick={handleExportPDF}
            aria-label="Export calendar as PDF"
          >
            <Timer className="mr-2 h-5 w-5" /> Export PDF
          </Button>
        </>
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
          <li>Enter the year you want to generate the calendar for (between 1900 and 2100).</li>
          <li>Select the month from the dropdown menu.</li>
          <li>Click the "Generate Calendar" button to display the calendar for the selected month and year.</li>
          <li>Review the generated calendar displayed below the inputs.</li>
          <li>Click the "Export PDF" button to download a PDF version of the calendar (feature mocked in this demo).</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Calendar Generator (month/year, export PDF)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Calendars are essential tools for organizing time and planning activities. This calendar generator creates a monthly calendar based on the year and month you select. It uses the Gregorian calendar system, which is the most widely used civil calendar worldwide. The generator accounts for leap years, which add an extra day to February every four years, except for years divisible by 100 but not by 400. This ensures accurate day counts for each month.
          </p>
          <p>
            The JavaScript <code>Date</code> object is used internally to determine the first day of the month and the number of days in the month. This allows the calendar to correctly align days of the week and display the correct dates. Although time zones and daylight saving time (DST) affect clock times, they do not impact the static layout of monthly calendars, so this generator does not adjust for them.
          </p>
          <p>
            Exporting the calendar as a PDF is a common requirement for sharing and printing. While this demo includes a placeholder for PDF export, real implementations typically use libraries like jsPDF or pdf-lib to create downloadable PDF files. These libraries can render the calendar layout, including styling and dates, into a PDF document that users can save or print.
          </p>
          <p>
            Understanding leap years, the structure of weeks, and month lengths is crucial for accurate calendar generation. This tool simplifies the process by automating these calculations and providing a clean, easy-to-read calendar for any valid month and year.
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
            <strong>Invalid Input Ranges:</strong> Entering years outside the supported range (1900-2100) or months outside 1-12 will cause errors or invalid calendars. Always verify your inputs before generating.
          </p>
          <p>
            <strong>Confusing Month Indexing:</strong> JavaScript Date months are zero-based (0=January), but user inputs are one-based (1=January). This mismatch can cause off-by-one errors if not handled carefully.
          </p>
          <p>
            <strong>DST and Time Zones:</strong> This calendar does not adjust for daylight saving time or time zones because it is a static monthly view. Attempting to use it for hourly scheduling across zones may cause confusion.
          </p>
          <p>
            <strong>PDF Export Placeholder:</strong> The export PDF button currently does not generate a real PDF. Attempting to use it as-is will only show an alert.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
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

      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href={ref.url}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
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
      title="Calendar Generator (month/year, export PDF)"
      description="Professional time calculator: Calendar Generator (month/year, export PDF). Precise calculations, time zone handling, and scheduling tools."
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