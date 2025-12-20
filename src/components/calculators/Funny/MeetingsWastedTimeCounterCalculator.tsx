import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Utensils, Gamepad2, Sparkles, Clock, Flame, Lightbulb, RotateCcw, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MeetingsWastedTimeCounterCalculator() {
  const [inputs, setInputs] = useState({
    attendees: "",
    avgSalary: "",
    meetingLength: "",
    meetingsPerWeek: "",
  });
  const handleInputChange = useCallback((n: string, v: string) => setInputs(p => ({ ...p, [n]: v })), []);

  const results = useMemo(() => {
    const attendees = parseFloat(inputs.attendees);
    const avgSalary = parseFloat(inputs.avgSalary);
    const meetingLength = parseFloat(inputs.meetingLength);
    const meetingsPerWeek = parseFloat(inputs.meetingsPerWeek);

    if (!attendees || !avgSalary || !meetingLength || !meetingsPerWeek) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "text-gray-500",
        icon: <Meh />,
      };
    }

    // 1. Calculate hourly rate (assuming 40h/week, 52 weeks)
    // hourly = salary / 2080
    const hourlyRate = avgSalary / 2080;

    // 2. Cost per meeting = hourly * attendees * (minutes / 60)
    const costPerMeeting = hourlyRate * attendees * (meetingLength / 60);

    // 3. Weekly Cost
    const weeklyCost = costPerMeeting * meetingsPerWeek;

    // Format as Currency (USD renders as $)
    const formattedCost = weeklyCost.toLocaleString("en-US", {
      style: "currency",
      currency: "USD", // Correct ISO code that renders "$"
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Fun remarks
    let remark = "";
    let color = "text-blue-600";
    let icon = <Clock />;

    if (weeklyCost > 5000) {
      remark = "That's enough to hire another full-time employee just to sit in these meetings.";
      color = "text-red-600";
      icon = <Flame />;
    } else if (weeklyCost > 1000) {
      remark = "You could fund a pretty epic office party every week with this money.";
      color = "text-orange-600";
      icon = <Gamepad2 />;
    } else if (weeklyCost > 200) {
      remark = "That's a lot of fancy lattes down the drain.";
      color = "text-yellow-600";
      icon = <Utensils />;
    } else {
      remark = "Not too painful, but time is money!";
      color = "text-green-600";
      icon = <Smile />;
    }

    return {
      value: formattedCost,
      label: "Weekly Cost of Meetings",
      subtext: remark,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do meetings cost so much money?",
      answer: "We often forget that 'time is money'. When you have 5 people in a room for an hour, you aren't spending 1 hour of company time; you are spending 5 hours. If those employees earn a high hourly wage, a simple status update can cost hundreds of dollars in lost productivity."
    },
    {
      question: "How is the hourly rate calculated?",
      answer: "This calculator assumes a standard work year of 2,080 hours (40 hours a week for 52 weeks). It divides the annual salary by 2,080 to get the estimated hourly cost of that employee to the company."
    },
    {
      question: "Does this include overhead costs?",
      answer: "No, this is a conservative estimate based purely on salary. Real costs are often 1.25x to 1.4x higher when you factor in benefits, taxes, office space, and the 'switch cost' of interrupting deep work."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block">Number of Attendees</Label>
          <Input 
            type="number" 
            placeholder="e.g. 8" 
            value={inputs.attendees} 
            onChange={(e) => handleInputChange("attendees", e.target.value)} 
          />
        </div>
        <div>
          <Label className="mb-2 block">Avg Annual Salary ($)</Label>
          <Input 
            type="number" 
            placeholder="e.g. 75000" 
            value={inputs.avgSalary} 
            onChange={(e) => handleInputChange("avgSalary", e.target.value)} 
          />
        </div>
        <div>
          <Label className="mb-2 block">Meeting Length (minutes)</Label>
          <Input 
            type="number" 
            placeholder="e.g. 60" 
            value={inputs.meetingLength} 
            onChange={(e) => handleInputChange("meetingLength", e.target.value)} 
          />
        </div>
        <div>
          <Label className="mb-2 block">Meetings Per Week</Label>
          <Input 
            type="number" 
            placeholder="e.g. 2" 
            value={inputs.meetingsPerWeek} 
            onChange={(e) => handleInputChange("meetingsPerWeek", e.target.value)} 
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
          <Sparkles className="mr-2 h-4 w-4" /> Calculate Cost
        </Button>
        <Button variant="outline" onClick={() => setInputs({ attendees: "", avgSalary: "", meetingLength: "", meetingsPerWeek: "" })} className="flex-1 h-11">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4 text-blue-600 dark:text-blue-400">{results.icon}</div>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">The High Cost of Talking</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          We've all been there: staring at a slide deck for the 100th time, wondering why this email couldn't have been an email. But have you ever calculated the actual price tag of that boredom? The Meetings Wasted-Time Calculator puts a dollar figure on productivity loss.
        </p>
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
            <div className="flex items-center gap-2 mb-3">
               <Lightbulb className="w-5 h-5 text-yellow-500" />
               <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
               Unproductive meetings cost US businesses an estimated $37 billion annually. Executives spend nearly 23 hours a week in meetings, and almost 71% of them consider those meetings unproductive and inefficient.
            </p>
         </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Tool</h2>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            Just enter the number of people in the room, their average estimated salary (don't worry, it stays private in your browser), and the meeting details. The tool calculates the "burn rate" of that meeting instantly.
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
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
         <ul className="space-y-4">
            <li>
               <a href="https://hbr.org/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">Harvard Business Review <ExternalLink className="w-3 h-3" /></a>
               <p className="text-sm text-slate-500 mt-1">Research on organizational efficiency and meeting psychology.</p>
            </li>
         </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Meetings Wasted-Time Counter"
      description="Find out exactly how much money your company is burning in meetings. A wake-up call for efficiency."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{ title: "The Burn Rate", formula: "Cost = (Salary ÷ 2080) × People × Hours", variables: [] }}
      example={{ title: "The Weekly Standup", scenario: "10 people earning $80k meet for 1 hour.", steps: [{label:"1", explanation:"$80k salary ≈ $38.46/hr"}, {label:"2", explanation:"$38.46 × 10 people = $384.60 per hour"}], result: "$384.60 per meeting" }}
      relatedCalculators={[
        { title: "Email Energy Cost", url: "/funny/email-energy-cost", icon: "💻" },
        { title: "Coffee Strength vs Productivity", url: "/funny/coffee-strength-vs-productivity-score", icon: "☕" },
        { title: "Commit Message Judge", url: "/funny/commit-message-quality-judge", icon: "💻" },
        { title: "Keyboard Clicks per Day", url: "/funny/keyboard-clicks-per-day-estimator", icon: "💻" },
        { title: "Pizza Size Comparison", url: "/funny/pizza-size-price-comparison", icon: "🍕" },
        { title: "Tab Overload Anxiety", url: "/funny/tab-overload-anxiety-score", icon: "💻" },
      ]}
      onThisPage={[
        {id: "what-is", label: "The High Cost"},
        {id: "how-to", label: "How to Use"},
        {id: "faq", label: "FAQ"},
        {id: "references", label: "References"}
      ]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}
