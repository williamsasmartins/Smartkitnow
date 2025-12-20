import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Smile, Frown, Meh, Ghost, Skull, Coffee, Utensils, Gamepad2, Cat, Dog, Zap, Heart, Calculator, Info, RotateCcw, AlertTriangle, BookOpen, ExternalLink, Flame, Clock, Ticket, Plane, Globe, Sparkles, Lightbulb } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MeetingsWastedTimeCounterCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    attendees: "",
    avgSalary: "",
    meetingLength: "",
    meetingsPerWeek: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Conversion constants
  const WEEKLY_WORK_HOURS_METRIC = 40; // hours per week typical full-time
  const WEEKLY_WORK_HOURS_IMPERIAL = 40; // same for imperial, just salary unit changes

  const results = useMemo(() => {
    const attendees = Number(inputs.attendees);
    const avgSalary = Number(inputs.avgSalary);
    const meetingLength = Number(inputs.meetingLength);
    const meetingsPerWeek = Number(inputs.meetingsPerWeek);

    if (
      !attendees || attendees < 1 ||
      !avgSalary || avgSalary <= 0 ||
      !meetingLength || meetingLength <= 0 ||
      !meetingsPerWeek || meetingsPerWeek <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "text-gray-500",
        icon: <Meh />,
      };
    }

    // Calculate hourly wage from annual salary
    // Assume 52 weeks/year, 40 hours/week
    const weeklyHours = inputs.unit === "metric" ? WEEKLY_WORK_HOURS_METRIC : WEEKLY_WORK_HOURS_IMPERIAL;
    const hourlyWage = avgSalary / (52 * weeklyHours);

    // Total wasted time in hours per week = meetingLength (minutes) * meetingsPerWeek * attendees / 60
    const totalHoursWasted = (meetingLength * meetingsPerWeek * attendees) / 60;

    // Total cost wasted per week
    const totalCostWasted = totalHoursWasted * hourlyWage;

    // Format results
    const formattedCost = totalCostWasted.toLocaleString("en-US", {
      style: "currency",
      currency: "$",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Fun remarks based on cost
    let remark = "";
    let color = "text-blue-600";
    let icon = <Smile />;

    if (totalCostWasted > 1000) {
      remark = "That's enough to buy a small island... or at least a fancy coffee machine!";
      color = "text-red-600";
      icon = <Flame />;
    } else if (totalCostWasted > 500) {
      remark = "Enough to fund a team pizza party. Maybe meetings should come with snacks?";
      color = "text-yellow-600";
      icon = <Utensils />;
    } else if (totalCostWasted > 100) {
      remark = "You could have bought a new video game instead. Priorities, right?";
      color = "text-green-600";
      icon = <Gamepad2 />;
    } else {
      remark = "Not too bad, but every minute counts in the race against time!";
      color = "text-blue-600";
      icon = <Clock />;
    }

    return {
      value: formattedCost,
      label: "Weekly Cost of Wasted Meeting Time",
      subtext: remark,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do so many meetings feel like a waste of time?",
      answer:
        "Meetings often become unproductive due to lack of clear agendas, poor time management, or unnecessary attendees. When meetings drag on without focus, they consume valuable work hours that could be spent on actual tasks. Interestingly, studies show that the average employee spends about 31 hours per month in unproductive meetings, which adds up to a significant loss in both time and money.",
    },
    {
      question: "How is the cost of wasted meeting time calculated?",
      answer:
        "The calculation multiplies the number of attendees by the length and frequency of meetings, then factors in the average hourly wage derived from annual salary. This approach helps quantify the financial impact of meetings that don't contribute to productivity. By understanding this cost, organizations can make informed decisions about optimizing or reducing unnecessary meetings.",
    },
    {
      question: "Can reducing meeting time really save money?",
      answer:
        "Absolutely! Even trimming meetings by 10 minutes can save hundreds or thousands of dollars weekly, depending on team size and salaries. Companies like Microsoft and Google have experimented with shorter meetings and reported increased productivity and employee satisfaction. So, less time talking can mean more time doing—and saving money in the process.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Globe className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric</SelectItem>
            <SelectItem value="imperial">Imperial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="attendees">Number of Attendees</Label>
          <Input
            id="attendees"
            type="number"
            min={1}
            placeholder="e.g. 5"
            value={inputs.attendees}
            onChange={(e) => handleInputChange("attendees", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="avgSalary">
            Average Annual Salary per Attendee {inputs.unit === "metric" ? "(in $)" : "(in $)"}
          </Label>
          <Input
            id="avgSalary"
            type="number"
            min={0}
            placeholder="e.g. 60000"
            value={inputs.avgSalary}
            onChange={(e) => handleInputChange("avgSalary", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="meetingLength">Average Meeting Length (minutes)</Label>
          <Input
            id="meetingLength"
            type="number"
            min={1}
            placeholder="e.g. 60"
            value={inputs.meetingLength}
            onChange={(e) => handleInputChange("meetingLength", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="meetingsPerWeek">Number of Meetings per Week</Label>
          <Input
            id="meetingsPerWeek"
            type="number"
            min={1}
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
            // Trigger recalculation by updating state (already done on input change)
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ unit: "metric", attendees: "", avgSalary: "", meetingLength: "", meetingsPerWeek: "" })
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Meetings Wasted-Time Counter</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Meetings are a staple of modern work culture, but not all meetings are created equal. While some foster collaboration and innovation, many end up as time sinks with little to show for the hours spent. This calculator helps you quantify the hidden cost of those unproductive meetings by estimating the total money lost based on attendees, salary, and meeting frequency.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By understanding the financial impact, teams and organizations can rethink how they schedule and conduct meetings, aiming for efficiency and purpose. After all, time is money, and wasted meeting time is like burning cash while chatting.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The concept of meetings dates back to ancient times when councils and assemblies gathered to make decisions. However, the modern meeting culture exploded with the rise of corporate offices in the 20th century. Interestingly, a 2019 study by the Harvard Business Review found that executives spend an average of 23 hours per week in meetings, yet 71% of them admit that meetings are unproductive or inefficient.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter the number of people who regularly attend your meetings, along with their average annual salary. Next, input the average length of each meeting in minutes and how many such meetings occur each week. The calculator will then estimate the weekly financial cost of the time spent in these meetings.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Use the unit selector to toggle between metric and imperial systems, although salary is always in dollars for consistency. After inputting your data, hit the calculate button to see your results. If you want to start fresh, the reset button clears all inputs.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Fun Reads</h2>
        <ul className="space-y-4">
          <li>
            <a
              href="https://hbr.org/2019/07/stop-the-meeting-madness"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Harvard Business Review: Stop the Meeting Madness <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A deep dive into how meetings consume valuable time and strategies to make them more effective.
            </p>
          </li>
          <li>
            <a
              href="https://www.inc.com/justin-bariso/why-we-hate-meetings-so-much.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Inc.com: Why We Hate Meetings So Much <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explores psychological reasons behind meeting fatigue and how to reclaim your workday.
            </p>
          </li>
          <li>
            <a
              href="https://www.atlassian.com/time-wasting-at-work-infographic"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Atlassian: Time Wasting at Work Infographic <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Visualizes how much time employees lose to unproductive meetings and distractions.
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
        formula:
          "Total Cost = (Number of Attendees) × (Meeting Length in minutes) × (Meetings per Week) ÷ 60 × (Hourly Wage)",
        variables: [
          { name: "Number of Attendees", description: "How many people attend each meeting." },
          { name: "Meeting Length in minutes", description: "Average duration of each meeting." },
          { name: "Meetings per Week", description: "How many meetings happen weekly." },
          { name: "Hourly Wage", description: "Average hourly salary of attendees." },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Imagine a team of 5 people, each earning $60,000 annually, attending 3 meetings per week, each lasting 60 minutes.",
        steps: [
          { label: "1", explanation: "Calculate hourly wage: $60,000 ÷ (52 weeks × 40 hours) ≈ $28.85/hour." },
          { label: "2", explanation: "Calculate total hours wasted: 5 × 60 minutes × 3 ÷ 60 = 15 hours/week." },
          { label: "3", explanation: "Calculate cost: 15 hours × $28.85 = $432.75 per week wasted." },
        ],
        result: "The team wastes approximately $432.75 every week on meetings.",
      }}
      relatedCalculators={[
        { title: "Pizza Size/Price Comparison Calculator", url: "/funny/pizza-size-price-comparison", icon: "🍕" },
        { title: "Ideal Egg Boiling Calculator", url: "/funny/ideal-egg-boiling-calculator", icon: "🤪" },
        { title: "Pokémon GO Weight Loss Calculator", url: "/funny/pokemon-go-weight-loss", icon: "🤪" },
        { title: "Crinkle Crankle Wall Brick Saver", url: "/funny/crinkle-crankle-wall-brick-saver", icon: "🤪" },
        { title: "Nickels to Crush Calculator", url: "/funny/nickels-to-crush-calculator", icon: "🤪" },
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