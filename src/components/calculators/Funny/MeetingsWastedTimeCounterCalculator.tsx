import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Lightbulb, RotateCcw, ExternalLink, Sparkles } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MeetingsWastedTimeCounterCalculator() {
  const [inputs, setInputs] = useState({
    attendees: "",
    avgSalary: "",
    meetingDuration: "",
    meetingsPerWeek: "",
  });
  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const attendees = parseFloat(inputs.attendees);
    const avgSalary = parseFloat(inputs.avgSalary);
    const meetingDuration = parseFloat(inputs.meetingDuration);
    const meetingsPerWeek = parseFloat(inputs.meetingsPerWeek);

    // Initial state safety: if any input is empty or invalid, return neutral state
    if (
      !attendees ||
      !avgSalary ||
      !meetingDuration ||
      !meetingsPerWeek ||
      attendees <= 0 ||
      avgSalary <= 0 ||
      meetingDuration <= 0 ||
      meetingsPerWeek <= 0
    ) {
      return { value: null };
    }

    // Calculate wasted time in hours per week
    // Total wasted hours = attendees × meetingDuration (in hours) × meetingsPerWeek
    const meetingDurationHours = meetingDuration / 60;
    const totalWastedHours = attendees * meetingDurationHours * meetingsPerWeek;

    // Calculate hourly salary from annual salary (assuming 2080 working hours/year)
    const hourlySalary = avgSalary / 2080;

    // Total cost wasted per week
    const totalCost = totalWastedHours * hourlySalary;

    // Format cost as USD currency
    const formattedCost = totalCost.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    // Label and subtext for UI
    const label = "Weekly Cost of Wasted Meeting Time";
    const subtext = `Based on ${attendees} attendees, ${meetingDuration} minutes per meeting, and ${meetingsPerWeek} meetings per week.`;

    return {
      value: formattedCost,
      label,
      subtext,
      color: "text-blue-600",
      icon: <Smile className="mx-auto h-12 w-12 text-blue-600" />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How is the wasted meeting time cost calculated?",
      answer:
        "The calculator multiplies the number of attendees by the duration of each meeting (in hours) and the number of meetings per week to find total wasted hours. Then, it multiplies total wasted hours by the average hourly salary derived from the annual salary to estimate the weekly cost.",
    },
    {
      question: "Why do we assume 2080 working hours per year?",
      answer:
        "2080 hours is a standard estimate based on 40 hours per week times 52 weeks per year, commonly used to convert annual salary to hourly wage.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="attendees">Number of Attendees</Label>
          <Input
            id="attendees"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 5"
            value={inputs.attendees}
            onChange={(e) => handleInputChange("attendees", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="avgSalary">Average Annual Salary per Attendee (USD)</Label>
          <Input
            id="avgSalary"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 60000"
            value={inputs.avgSalary}
            onChange={(e) => handleInputChange("avgSalary", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="meetingDuration">Average Meeting Duration (minutes)</Label>
          <Input
            id="meetingDuration"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 60"
            value={inputs.meetingDuration}
            onChange={(e) => handleInputChange("meetingDuration", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="meetingsPerWeek">Number of Meetings per Week</Label>
          <Input
            id="meetingsPerWeek"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 3"
            value={inputs.meetingsPerWeek}
            onChange={(e) => handleInputChange("meetingsPerWeek", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              attendees: "",
              avgSalary: "",
              meetingDuration: "",
              meetingsPerWeek: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">{results.icon}</div>
            <p className={`text-5xl font-extrabold ${results.color}`}>{results.value}</p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">{results.label}</p>
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
          Understanding Meetings Wasted-Time Counter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Meetings are essential for collaboration, but unproductive meetings can cost companies significant time and money. This calculator helps quantify the financial impact of wasted meeting time by considering the number of attendees, their average salary, meeting duration, and frequency. By understanding these costs, organizations can make informed decisions to optimize meeting efficiency and reduce unnecessary expenses.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            According to a study by the Harvard Business Review, 71% of senior managers said meetings are unproductive and inefficient, costing companies billions annually in lost time and productivity.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter the number of attendees who typically join your meetings, their average annual salary in USD, the average duration of each meeting in minutes, and how many such meetings occur weekly. Click "Calculate" to see the estimated weekly cost of wasted meeting time. Use this insight to identify opportunities to streamline meetings and improve productivity.
        </p>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          The Real Cost of Unproductive Meetings
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          A study by MIT Sloan and Harvard Business Review found that executives spend an average of 23 hours per week in meetings, up from less than 10 hours in the 1960s. Of these meetings, 71% are considered unproductive by the attendees themselves (Harvard Business Review, 2017). The cost is not just time: interrupted deep work takes an average of 23 minutes to restart, so a 30-minute meeting inserted into a work block costs not 30 minutes but potentially 53+ minutes of lost productivity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Meeting cost calculators help organizations quantify what was previously invisible. A 60-minute status meeting with 8 employees averaging $80,000/year in salary costs approximately $192 in direct payroll (8 x $80K / 2080 hours x 1 hour). Add fully-loaded cost (benefits, overhead: typically 1.25-1.5x salary) and the true cost reaches $240-$288 per meeting. An organization running 10 such meetings per week spends $125,000-$150,000 annually on a single meeting type.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Research-backed improvements: Amazon's famous 'two-pizza rule' limits meeting size to what two pizzas can feed (5-8 people), which cuts irrelevant attendees. Jeff Bezos instituted silent 6-page memo reading periods at meeting starts instead of slide presentations, improving the quality of decision-making. Google's Project Aristotle found that psychological safety (not attendee seniority) was the primary predictor of effective team meetings. Cal Newport's 'deep work' framework recommends batching all meetings into designated blocks to protect uninterrupted focus time.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{question}</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{answer}</p>
          </div>
        ))}
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://hbr.org/2017/07/stop-the-meeting-madness"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Stop the Meeting Madness <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Harvard Business Review article discussing the cost and inefficiency of meetings.
            </p>
          </li>
          <li>
            <a
              href="https://www.bls.gov/cps/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              U.S. Bureau of Labor Statistics <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Source for average working hours and salary data used in calculations.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Meetings Wasted-Time Counter"
      description="Calculate the cost of useless meetings. Input attendees and average salary to see how much money is burning while you talk."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Cost = Attendees × (Meeting Duration ÷ 60) × Meetings per Week × (Annual Salary ÷ 2080)",
        variables: [
          { symbol: "Cost", description: "Weekly cost of wasted meeting time in USD" },
          { symbol: "Attendees", description: "Number of meeting participants" },
          { symbol: "Meeting Duration", description: "Average meeting length in minutes" },
          { symbol: "Meetings per Week", description: "Number of meetings held weekly" },
          { symbol: "Annual Salary", description: "Average annual salary per attendee in USD" },
          { symbol: "2080", description: "Estimated working hours per year (40 hours/week × 52 weeks)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A team of 5 people with an average salary of $60,000 attends 3 meetings per week, each lasting 60 minutes.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert meeting duration to hours: 60 minutes ÷ 60 = 1 hour.",
          },
          {
            label: "2",
            explanation:
              "Calculate total wasted hours per week: 5 attendees × 1 hour × 3 meetings = 15 hours.",
          },
          {
            label: "3",
            explanation:
              "Calculate hourly salary: $60,000 ÷ 2080 = $28.85/hour.",
          },
          {
            label: "4",
            explanation:
              "Calculate total cost: 15 hours × $28.85 = $432.75 per week.",
          },
        ],
        result: "$432.75 weekly cost of wasted meeting time.",
      }}
      relatedCalculators={[
        { title: "Vacation Budget Reality Check", url: "/funny/vacation-budget-reality-check", icon: "🐈" },
        { title: "Drake Equation Calculator", url: "/funny/drake-equation-calculator", icon: "🤪" },
        { title: "Pizza Size/Price Comparison Calculator", url: "/funny/pizza-size-price-comparison", icon: "🍕" },
        { title: "Loop-the-Loop Speed Calculator", url: "/funny/loop-the-loop-speed-calculator", icon: "✈️" },
        { title: "Black Hole Sun Impact Calculator", url: "/funny/black-hole-sun-impact", icon: "🧟" },
        { title: "Pizza Slices per Person & Regret Index", url: "/funny/pizza-slices-per-person-regret-index", icon: "🍕" },
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