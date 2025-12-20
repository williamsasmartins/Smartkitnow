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

const MAX_LENGTH = 72; // Conventional max length for commit subject line

// Helper to count words
function countWords(str: string) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

// Helper to detect common bad commit messages
const BAD_MESSAGES = [
  "wip",
  "fix",
  "update",
  "changes",
  "stuff",
  "temp",
  "test",
  "debug",
  "misc",
  "minor",
  "patch",
  "hotfix",
  "refactor",
  "cleanup",
  "merge",
  "revert",
];

function containsBadMessage(msg: string) {
  const lower = msg.toLowerCase();
  return BAD_MESSAGES.some(bad => lower === bad || lower.startsWith(bad + " ") || lower.includes(" " + bad + " "));
}

export default function CommitMessageQualityJudgeCalculator() {
  const [inputs, setInputs] = useState({ unit: "metric", message: "" });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  const results = useMemo(() => {
    const msg = inputs.message.trim();
    if (!msg) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }

    // Scoring criteria:
    // 1. Length of subject line (<= MAX_LENGTH is good)
    // 2. Presence of bad words (penalty)
    // 3. Presence of imperative mood (heuristic: starts with verb)
    // 4. Presence of detailed body? (Not input here, so skip)
    // 5. Use of meaningful words (length > 3 words)
    // 6. Avoid vague words like "fix", "update" alone

    let score = 100;
    let reasons: string[] = [];

    // Length penalty
    if (msg.length > MAX_LENGTH) {
      const over = msg.length - MAX_LENGTH;
      score -= Math.min(30, over); // max 30 points penalty
      reasons.push(`Your subject line is ${over} characters longer than the recommended ${MAX_LENGTH}.`);
    } else {
      reasons.push(`Great! Your subject line is within the recommended ${MAX_LENGTH} characters.`);
    }

    // Bad message penalty
    if (containsBadMessage(msg)) {
      score -= 40;
      reasons.push("Your commit message contains vague or overused words like 'fix' or 'wip'. Try to be more descriptive.");
    } else {
      reasons.push("No vague or overused words detected. Nice!");
    }

    // Word count bonus/penalty
    const wordCount = countWords(msg);
    if (wordCount < 3) {
      score -= 20;
      reasons.push("Your commit message is quite short. Aim for at least 3 words to provide clarity.");
    } else if (wordCount > 15) {
      score -= 10;
      reasons.push("Your commit message is a bit long. Keep it concise and focused.");
    } else {
      reasons.push("Your commit message length in words looks balanced.");
    }

    // Imperative mood heuristic: check if first word is verb (simple heuristic)
    // List of common verbs for commit messages (imperative)
    const verbs = [
      "add", "fix", "update", "remove", "refactor", "clean", "improve", "change", "create", "delete", "merge", "revert", "document", "test", "optimize", "handle", "implement", "adjust", "correct", "build"
    ];
    const firstWord = msg.split(/\s+/)[0].toLowerCase();
    if (verbs.includes(firstWord)) {
      score += 10;
      reasons.push("Good job starting your commit message with an imperative verb!");
    } else {
      score -= 10;
      reasons.push("Consider starting your commit message with an imperative verb like 'Add' or 'Fix' for clarity.");
    }

    // Clamp score between 0 and 100
    if (score > 100) score = 100;
    if (score < 0) score = 0;

    // Determine label and icon based on score
    let label = "";
    let color = "";
    let icon = null;
    let subtext = reasons.join(" ");

    if (score >= 85) {
      label = "Excellent Commit Message";
      color = "text-green-600";
      icon = <Smile className="mx-auto w-12 h-12" />;
    } else if (score >= 60) {
      label = "Good, But Could Improve";
      color = "text-yellow-600";
      icon = <Meh className="mx-auto w-12 h-12" />;
    } else if (score >= 30) {
      label = "Needs Improvement";
      color = "text-orange-600";
      icon = <Frown className="mx-auto w-12 h-12" />;
    } else {
      label = "Poor Commit Message";
      color = "text-red-700";
      icon = <Skull className="mx-auto w-12 h-12" />;
    }

    return { value: `${score}%`, label, subtext, color, icon };
  }, [inputs]);

  const faqs = [
    {
      question: "Why should I care about commit message quality?",
      answer:
        "Commit messages are the breadcrumbs of your project's history. A well-crafted commit message not only helps your future self understand what was done and why, but also aids your teammates in code reviews and debugging. Poor messages like 'fix' or 'wip' can turn your git log into a cryptic mess, making collaboration and maintenance a nightmare.",
    },
    {
      question: "What is the ideal length for a commit message?",
      answer:
        "The conventional wisdom is to keep the subject line under 72 characters, ideally around 50-60, to ensure readability in various git tools and terminals. This limit dates back to the days of punch cards and early terminals, but it remains relevant today for clarity and conciseness. Longer explanations belong in the commit body, which you can use to elaborate on the 'why' behind your changes.",
    },
    {
      question: "Why start commit messages with an imperative verb?",
      answer:
        "Starting with an imperative verb like 'Add', 'Fix', or 'Update' makes your commit messages sound like commands or instructions, which aligns with how git interprets them. This style is a convention popularized by the Linux kernel developers and has become a standard in many projects. It helps maintain a consistent, action-oriented history that reads like a to-do list.",
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

      {/* Commit Message Input */}
      <div>
        <Label htmlFor="commit-message" className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
          Enter Your Commit Message
        </Label>
        <Input
          id="commit-message"
          type="text"
          placeholder="e.g. Fix login bug causing crash"
          value={inputs.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          spellCheck={false}
          autoComplete="off"
          className="text-lg"
        />
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Keep it concise, descriptive, and start with an imperative verb!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ unit: "metric", message: "" })}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Commit Message Quality Judge</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Commit messages are the unsung heroes of software development, acting as a historical record of changes and intentions. This tool evaluates your commit message's quality by analyzing length, clarity, and word choice, helping you write messages that future you and your teammates will thank you for. By scoring your message, it encourages best practices like concise descriptions, avoiding vague terms, and starting with imperative verbs. Think of it as a friendly coach nudging you towards cleaner, more meaningful git logs.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The convention of writing commit messages in the imperative mood was popularized by the Linux kernel project, where messages like "Fix bug" or "Add feature" read like commands. This style helps maintain a consistent and actionable project history. Interestingly, the 72-character limit for commit messages harks back to the era of punch cards and early terminals, where space was precious and readability paramount.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply type your git commit message into the input box above and hit "Calculate." The tool will analyze your message based on length, word choice, and style, then provide a quality score with helpful feedback. Use this feedback to refine your commit messages, making them clearer and more informative. Remember, a good commit message is like a good headline: it grabs attention and conveys the essence quickly.
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
            <a href="https://chris.beams.io/posts/git-commit/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              How to Write a Git Commit Message <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Chris Beams' classic guide on writing clear and effective git commit messages, widely respected in the developer community.
            </p>
          </li>
          <li>
            <a href="https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Pro Git Book - Chapter on Contributing <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The official Git book covers best practices for commit messages and collaboration, a must-read for serious developers.
            </p>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Imperative_mood" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Imperative Mood - Wikipedia <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Learn about the grammatical mood that makes your commit messages sound like commands, enhancing clarity and consistency.
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
      formula={{
        title: "The Math",
        formula:
          "Score = 100 - LengthPenalty - VagueWordPenalty - WordCountPenalty + ImperativeVerbBonus",
        variables: [
          { name: "LengthPenalty", description: `Penalty for subject lines longer than ${MAX_LENGTH} characters.` },
          { name: "VagueWordPenalty", description: "Penalty for using vague or overused words like 'fix', 'wip', etc." },
          { name: "WordCountPenalty", description: "Penalty for too short or too long messages in word count." },
          { name: "ImperativeVerbBonus", description: "Bonus for starting with an imperative verb." },
        ],
      }}
      example={{
        title: "Example",
        scenario: "You write a commit message: 'Fix bug in login flow causing crash on invalid input'",
        steps: [
          { label: "1", explanation: "The message is 56 characters long, under the 72 character limit." },
          { label: "2", explanation: "It contains the word 'Fix' at the start, which is a good imperative verb." },
          { label: "3", explanation: "The message has 10 words, which is a balanced length." },
          { label: "4", explanation: "No vague or filler words detected." },
        ],
        result: "The tool scores this commit message at 95%, labeling it 'Excellent Commit Message' with positive feedback.",
      }}
      relatedCalculators={[
        { title: "Pokémon GO Weight Loss Calculator", url: "/funny/pokemon-go-weight-loss", icon: "🤪" },
        { title: "Donut Calculator", url: "/funny/donut-calculator", icon: "🍩" },
        { title: "Loop-the-Loop Speed Calculator", url: "/funny/loop-the-loop-speed-calculator", icon: "✈️" },
        { title: "Dog Zoomies Energy Release Meter", url: "/funny/dog-zoomies-energy-meter", icon: "🐈" },
        { title: "Plant Watering Procrastination Index", url: "/funny/plant-watering-procrastination-index", icon: "🤪" },
        { title: "Meetings Wasted-Time Counter", url: "/funny/meetings-wasted-time-counter", icon: "💻" },
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