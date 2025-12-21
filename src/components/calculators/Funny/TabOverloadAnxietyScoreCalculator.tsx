import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Frown, Meh, Lightbulb, RotateCcw, Sparkles, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TabOverloadAnxietyScoreCalculator() {
  // Inputs: number of open tabs, number of tabs afraid to close
  const [inputs, setInputs] = useState({ openTabs: "", afraidTabs: "" });
  const handleInputChange = useCallback((name, value) => {
    // Allow only digits, empty string allowed
    if (/^\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const openTabs = Number(inputs.openTabs);
    const afraidTabs = Number(inputs.afraidTabs);

    // Initial state safety: if inputs empty or zero or invalid, return neutral
    if (
      !inputs.openTabs ||
      !inputs.afraidTabs ||
      openTabs === 0 ||
      afraidTabs === 0 ||
      afraidTabs > openTabs
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }

    // Formula:
    // Tab Overload Anxiety Score (A) = (Afraid Tabs / Open Tabs) * 100
    // Score is percentage of tabs you fear closing, max 100
    const score = Math.min(100, (afraidTabs / openTabs) * 100);

    // Determine label, color, icon based on score ranges
    let label = "";
    let color = "";
    let icon = null;
    let subtext = "";

    if (score <= 20) {
      label = "Calm and Collected";
      color = "text-green-600";
      icon = <Smile className="mx-auto" size={48} />;
      subtext = "You manage your tabs well with minimal anxiety.";
    } else if (score <= 50) {
      label = "Mildly Anxious";
      color = "text-yellow-600";
      icon = <Meh className="mx-auto" size={48} />;
      subtext = "You feel some stress about closing tabs but can manage.";
    } else if (score <= 80) {
      label = "Anxious Overload";
      color = "text-orange-600";
      icon = <Frown className="mx-auto" size={48} />;
      subtext = "Your tab anxiety is high; consider organizing your tabs.";
    } else {
      label = "Severe Tab Anxiety";
      color = "text-red-600";
      icon = <Frown className="mx-auto" size={48} />;
      subtext = "Your tab anxiety is overwhelming; time for a tab detox!";
    }

    return {
      value: `${score.toFixed(1)}%`,
      label,
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Tab Overload Anxiety?",
      answer:
        "Tab Overload Anxiety is the stress or discomfort caused by having too many browser tabs open, especially when you fear closing them due to losing important information or context.",
    },
    {
      question: "How can I reduce my Tab Overload Anxiety Score?",
      answer:
        "You can reduce your score by organizing tabs into groups, bookmarking important pages, or using tab management extensions to keep your browsing experience less cluttered and more manageable.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="openTabs" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Number of Open Tabs
        </Label>
        <Input
          id="openTabs"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="e.g. 30"
          value={inputs.openTabs}
          onChange={(e) => handleInputChange("openTabs", e.target.value)}
          aria-describedby="openTabs-desc"
        />
        <p id="openTabs-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Total tabs currently open in your browser.
        </p>
      </div>

      <div>
        <Label htmlFor="afraidTabs" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Number of Tabs You're Afraid to Close
        </Label>
        <Input
          id="afraidTabs"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="e.g. 15"
          value={inputs.afraidTabs}
          onChange={(e) => handleInputChange("afraidTabs", e.target.value)}
          aria-describedby="afraidTabs-desc"
        />
        <p id="afraidTabs-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Tabs you fear closing because you might lose important info.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit calculation needed, results update automatically
          }}
          aria-label="Calculate Tab Overload Anxiety Score"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ openTabs: "", afraidTabs: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
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
          Understanding Tab Overload Anxiety Score
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Tab Overload Anxiety Score quantifies the stress caused by having too many browser tabs open,
          especially when you hesitate to close them for fear of losing important information. This score helps
          you understand how much your tab management habits might be affecting your mental clarity and productivity.
          By measuring the proportion of tabs you are afraid to close relative to your total open tabs, you gain
          insight into your browsing anxiety level.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Studies show that the average internet user has over 20 tabs open simultaneously, which can increase
            cognitive load and reduce focus. Managing tabs effectively can improve productivity and reduce digital stress.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter the total number of tabs you currently have open in your browser and the number of those tabs
          you are afraid to close. The calculator will then provide a score representing your tab overload anxiety
          as a percentage. Use this score to reflect on your tab management habits and consider strategies to reduce
          your digital clutter and stress.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <dl className="space-y-6">
          {faqs.map(({ question, answer }, i) => (
            <div key={i}>
              <dt className="font-semibold text-lg text-slate-800 dark:text-slate-200">{question}</dt>
              <dd className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">{answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7323778/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Impact of Browser Tab Overload on Cognitive Load <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A scientific study exploring how multiple open tabs affect user attention and stress.
            </p>
          </li>
          <li>
            <a
              href="https://www.lifehack.org/articles/technology/10-tips-to-manage-your-browser-tabs-effectively.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              10 Tips to Manage Your Browser Tabs Effectively <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical advice on reducing tab overload and improving productivity.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Tab Overload Anxiety Score"
      description="Measure your browser tab anxiety. Calculate a stress score based on the number of open tabs you are too afraid to close."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "A = (Afraid Tabs ÷ Open Tabs) × 100",
        variables: [
          { symbol: "A", description: "Tab Overload Anxiety Score (percentage)" },
          { symbol: "Afraid Tabs", description: "Number of tabs you are afraid to close" },
          { symbol: "Open Tabs", description: "Total number of tabs open in your browser" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have 40 tabs open, but you are afraid to close 10 of them because they contain important information.",
        steps: [
          { label: "1", explanation: "Enter 40 as the total number of open tabs." },
          { label: "2", explanation: "Enter 10 as the number of tabs you are afraid to close." },
          { label: "3", explanation: "Calculate to get your anxiety score." },
        ],
        result: "Your Tab Overload Anxiety Score is 25%, indicating mild anxiety about closing tabs.",
      }}
      relatedCalculators={[
        { title: "Dog Zoomies Energy Release Meter", url: "/funny/dog-zoomies-energy-meter", icon: "🐈" },
        { title: "Pokémon GO Weight Loss Calculator", url: "/funny/pokemon-go-weight-loss", icon: "🤪" },
        { title: "Rocks to Flood a Country Estimator", url: "/funny/rocks-to-flood-country", icon: "✈️" },
        { title: "Commit Message Quality Judge", url: "/funny/commit-message-quality-judge", icon: "🤪" },
        { title: "Social Media Time Alternatives", url: "/funny/social-media-time-alternatives", icon: "🤪" },
        { title: "First-Date Awkwardness Meter", url: "/funny/first-date-awkwardness-meter", icon: "❤️" },
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