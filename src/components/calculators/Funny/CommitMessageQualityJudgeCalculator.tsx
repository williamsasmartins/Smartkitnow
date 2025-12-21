import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Smile,
  Frown,
  Meh,
  Ghost,
  Skull,
  Sparkles,
  RotateCcw,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function scoreCommitMessage(message: string): {
  value: number | null;
  label: string;
  subtext: string;
  color: string;
  icon: JSX.Element;
} {
  if (!message || message.trim() === "") {
    return { value: null, label: "", subtext: "", color: "", icon: <Ghost /> };
  }

  const msg = message.trim().toLowerCase();

  // Basic checks for common low-quality commit messages
  const lowQualityPatterns = [
    /^wip$/, // work in progress only
    /^fix$/, // too vague
    /^update$/, // too vague
    /^temp$/, // temporary commit
    /^test$/, // no info
    /^debug$/, // no info
    /^misc$/, // no info
    /^stuff$/, // no info
    /^changes$/, // no info
  ];

  if (lowQualityPatterns.some((re) => re.test(msg))) {
    return {
      value: 10,
      label: "Poor Quality",
      subtext: "Your commit message is too vague or uninformative.",
      color: "text-red-600",
      icon: <Skull />,
    };
  }

  // Check length
  const length = message.trim().length;

  if (length < 10) {
    return {
      value: 30,
      label: "Below Average",
      subtext: "Commit message is short and lacks detail.",
      color: "text-orange-600",
      icon: <Frown />,
    };
  }

  // Check for presence of imperative verbs (simple heuristic)
  // List of common imperative verbs used in commit messages
  const imperativeVerbs = [
    "add",
    "fix",
    "update",
    "remove",
    "refactor",
    "improve",
    "change",
    "clean",
    "document",
    "optimize",
    "test",
    "merge",
    "create",
    "implement",
    "adjust",
    "correct",
    "handle",
    "support",
    "upgrade",
    "revert",
  ];

  const words = msg.split(/\s+/);
  const firstWord = words[0];

  const hasImperativeVerb = imperativeVerbs.includes(firstWord);

  // Check for presence of issue/ticket references (#123, ABC-456)
  const hasIssueRef = /#\d+|[A-Z]{2,}-\d+/.test(message);

  // Score calculation heuristic
  let score = 50;

  if (hasImperativeVerb) score += 20;
  if (length >= 50) score += 20;
  if (hasIssueRef) score += 10;

  if (score > 100) score = 100;

  // Label and icon based on score
  if (score >= 90) {
    return {
      value: score,
      label: "Excellent",
      subtext: "Clear, detailed, and informative commit message.",
      color: "text-green-600",
      icon: <Smile />,
    };
  } else if (score >= 70) {
    return {
      value: score,
      label: "Good",
      subtext: "Good commit message but could be more detailed.",
      color: "text-green-500",
      icon: <Meh />,
    };
  } else if (score >= 40) {
    return {
      value: score,
      label: "Fair",
      subtext: "Commit message is somewhat informative but lacks clarity.",
      color: "text-yellow-600",
      icon: <Frown />,
    };
  } else {
    return {
      value: score,
      label: "Poor",
      subtext: "Commit message needs improvement for clarity and detail.",
      color: "text-red-600",
      icon: <Skull />,
    };
  }
}

export default function CommitMessageQualityJudgeCalculator() {
  const [inputs, setInputs] = useState({ commitMessage: "" });
  const handleInputChange = useCallback(
    (n: string, v: string) => setInputs((p) => ({ ...p, [n]: v })),
    []
  );

  const results = useMemo(() => {
    const message = inputs.commitMessage ?? "";
    return scoreCommitMessage(message);
  }, [inputs]);

  const faqs = [
    {
      question: "Why is a good commit message important?",
      answer:
        "Good commit messages help your team understand the history of changes, making debugging and collaboration easier. They provide context and reasoning behind code changes, improving project maintainability.",
    },
    {
      question: "What should a commit message include?",
      answer:
        "A commit message should be concise yet descriptive, ideally starting with an imperative verb, explaining what was changed and why. Including issue references or ticket numbers can also be helpful.",
    },
    {
      question: "Can I use emojis in commit messages?",
      answer:
        "Yes, emojis can add clarity or categorize commits visually, but they should not replace clear, descriptive text. Use them sparingly and consistently if your team agrees.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="commitMessage" className="mb-2 block font-semibold">
          Enter your commit message
        </Label>
        <Input
          id="commitMessage"
          placeholder="e.g. Fix login bug by updating auth logic"
          value={inputs.commitMessage}
          onChange={(e) => handleInputChange("commitMessage", e.target.value)}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="text-lg"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            /* No special action needed, results update automatically */
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ commitMessage: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value !== null && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">{results.icon}</div>
            <p className={`text-5xl font-extrabold ${results.color}`}>
              {results.value}
            </p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              {results.label}
            </p>
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
          Understanding Commit Message Quality Judge
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Commit messages are essential for maintaining a clear project history.
          They explain the purpose of changes, making it easier for teams to
          review, debug, and collaborate effectively. This tool evaluates your
          commit message's quality based on clarity, detail, and best practices,
          helping you write better messages that improve your project's
          maintainability.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Did You Know?
            </h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The Linux kernel project requires commit messages to start with an
            imperative verb and be concise yet descriptive. This convention
            helps maintain a clean and understandable project history for
            millions of developers worldwide.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply type or paste your git commit message into the input box above
          and click "Calculate." The tool will analyze your message and provide
          a quality score along with helpful feedback. Use this feedback to
          improve your commit messages, making them clearer and more useful for
          your team.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, a good commit message typically starts with an imperative
          verb, is concise but descriptive, and references related issues or
          tickets when applicable.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          FAQ
        </h2>
        <dl className="space-y-6">
          {faqs.map(({ question, answer }, i) => (
            <div key={i}>
              <dt className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                {question}
              </dt>
              <dd className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                {answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References
        </h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://chris.beams.io/posts/git-commit/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              How to Write a Git Commit Message <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Chris Beams' widely cited guide on writing clear and effective git
              commit messages.
            </p>
          </li>
          <li>
            <a
              href="https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Pro Git Book - Contributing to a Project{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official Git documentation covering best practices for commit
              messages and collaboration.
            </p>
          </li>
          <li>
            <a
              href="https://www.kernel.org/doc/html/latest/process/submitting-patches.html#commit-message-guidelines"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Linux Kernel Commit Message Guidelines{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The Linux kernel project's official commit message style guide.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Commit Message Quality Judge"
      description="Rate your git commit messages. Are you writing useful descriptions or just 'wip' and 'fix'? Get a fun quality score."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ IMPORTANT: Use 'symbol' and 'description' keys here!
      formula={{
        title: "The Math",
        formula:
          "Score = Base + ImperativeVerbBonus + LengthBonus + IssueReferenceBonus",
        variables: [
          {
            symbol: "Score",
            description: "Overall quality score of the commit message (0-100)",
          },
          {
            symbol: "Base",
            description: "Base score starting at 50 points",
          },
          {
            symbol: "ImperativeVerbBonus",
            description:
              "Bonus points if the message starts with an imperative verb (+20)",
          },
          {
            symbol: "LengthBonus",
            description:
              "Bonus points if the message length is 50 or more characters (+20)",
          },
          {
            symbol: "IssueReferenceBonus",
            description:
              "Bonus points if the message contains issue or ticket references (+10)",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You wrote a commit message: 'Fix login bug by updating auth logic #123'",
        steps: [
          {
            label: "1",
            explanation:
              "The message starts with 'Fix', an imperative verb, so +20 points.",
          },
          {
            label: "2",
            explanation:
              "The message length is over 50 characters, so +20 points.",
          },
          {
            label: "3",
            explanation:
              "The message contains an issue reference '#123', so +10 points.",
          },
          {
            label: "4",
            explanation:
              "Base score is 50, total score = 50 + 20 + 20 + 10 = 100 (Excellent).",
          },
        ],
        result: "Final quality score: 100 (Excellent)",
      }}
      relatedCalculators={[
        {
          title: "Life Value Estimator (Worth in Tacos)",
          url: "/funny/life-value-in-tacos",
          icon: "🍩",
        },
        {
          title: "Cost to Send This Email (Energy/kWh)",
          url: "/funny/email-cost-estimator-energy",
          icon: "💻",
        },
        {
          title: "Penguin Slap Power Calculator",
          url: "/funny/penguin-slap-power",
          icon: "🐈",
        },
        {
          title: "Medical Tourism Cost Saver",
          url: "/funny/medical-tourism-cost-saver",
          icon: "🤪",
        },
        {
          title: "Donut Calculator",
          url: "/funny/donut-calculator",
          icon: "🍩",
        },
        {
          title: "Dog Zoomies Energy Release Meter",
          url: "/funny/dog-zoomies-energy-meter",
          icon: "🐈",
        },
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