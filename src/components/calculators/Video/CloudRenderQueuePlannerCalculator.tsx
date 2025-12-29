import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CloudRenderQueuePlannerCalculator() {
  const [inputs, setInputs] = useState({
    frameCount: "",
    secPerFrame: "",
    nodes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimals, empty string allowed
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const frameCountNum = Number(inputs.frameCount);
    const secPerFrameNum = Number(inputs.secPerFrame);
    const nodesNum = Number(inputs.nodes);

    if (
      !frameCountNum ||
      frameCountNum <= 0 ||
      !secPerFrameNum ||
      secPerFrameNum <= 0 ||
      !nodesNum ||
      nodesNum <= 0
    ) {
      return {
        primary: "0",
        secondary: "Hours / Mins",
        details: "Please enter positive numbers for all inputs.",
        feedback: "",
      };
    }

    // Total render time in seconds without nodes
    const totalSeconds = frameCountNum * secPerFrameNum;

    // Divide by nodes to get parallel render time
    const parallelSeconds = totalSeconds / nodesNum;

    // Convert seconds to hours and minutes
    const hours = Math.floor(parallelSeconds / 3600);
    const minutes = Math.ceil((parallelSeconds % 3600) / 60);

    // Format primary result as "Xh Ym"
    const primary =
      (hours > 0 ? `${hours}h ` : "") + (minutes > 0 ? `${minutes}m` : "");

    const secondary = "Estimated Render Time";

    const details = `Rendering ${frameCountNum.toLocaleString()} frames at ${secPerFrameNum.toFixed(
      2
    )} seconds per frame using ${nodesNum.toLocaleString()} node${
      nodesNum > 1 ? "s" : ""
    } results in approximately ${primary || "less than a minute"}.`;

    const feedback =
      nodesNum > frameCountNum
        ? "Note: More nodes than frames may not improve render time significantly."
        : "Consider increasing nodes to reduce total render time.";

    return { primary: primary || "<1m", secondary, details, feedback };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the purpose of the Cloud Render Queue Planner?",
      answer:
        "The Cloud Render Queue Planner helps video professionals estimate the total render time when using multiple cloud rendering nodes. By inputting the total frame count, seconds per frame, and number of rendering nodes, users can plan and optimize their rendering workflow efficiently.",
    },
    {
      question: "Why do I need to divide total render time by the number of nodes?",
      answer:
        "Rendering nodes work in parallel, meaning the workload is split across multiple machines. Dividing the total render time by the number of nodes estimates how much faster the render completes by parallel processing, assuming perfect distribution and no overhead.",
    },
    {
      question: "Can the calculator handle fractional seconds per frame?",
      answer:
        "Yes, the calculator accepts decimal values for seconds per frame to provide accurate estimates for renders that take less than a full second per frame. This allows for precise planning even with fast rendering tasks.",
    },
    {
      question: "What factors can affect the accuracy of this estimate?",
      answer:
        "This calculator assumes ideal conditions with no overhead or queue delays. In reality, factors like node availability, network latency, data transfer times, and render job overhead can increase total render time beyond the estimate.",
    },
    {
      question: "How can I optimize my cloud rendering workflow using this planner?",
      answer:
        "Use this planner to balance the number of nodes against cost and time. Increasing nodes reduces render time but may increase cost. Understanding the trade-offs helps you allocate resources efficiently and meet project deadlines.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "A post-production studio needs to render a 10,000-frame animation where each frame takes 12 seconds to render. They have access to 20 cloud rendering nodes.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the total frame count: 10,000 frames into the calculator.",
      },
      {
        label: "Step 2",
        explanation:
          "Enter the average seconds per frame: 12 seconds per frame.",
      },
      {
        label: "Step 3",
        explanation:
          "Specify the number of rendering nodes available: 20 nodes.",
      },
      {
        label: "Step 4",
        explanation: "Calculate to find the estimated total render time.",
      },
    ],
    result:
      "The calculator estimates approximately 10 hours of total render time, helping the studio plan their schedule and cloud resource usage effectively.",
  };

  const references = [
    {
      title: "AWS ThinkBox Deadline Documentation",
      description:
        "Comprehensive guide on managing render queues and nodes in cloud rendering environments.",
      url: "https://docs.aws.amazon.com/deadline/latest/userguide/overview.html",
    },
    {
      title: "Google Cloud Rendering Solutions",
      description:
        "Overview of cloud rendering options and best practices for optimizing render farms.",
      url: "https://cloud.google.com/solutions/media-entertainment/rendering",
    },
    {
      title: "Autodesk Cloud Rendering",
      description:
        "Official Autodesk cloud rendering service details and optimization tips.",
      url: "https://www.autodesk.com/cloud-rendering",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="frameCount">Frame Count</Label>
          <Input
            id="frameCount"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 10000"
            value={inputs.frameCount}
            onChange={(e) => handleInputChange("frameCount", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secPerFrame">Seconds per Frame</Label>
          <Input
            id="secPerFrame"
            type="number"
            min={0.01}
            step={0.01}
            placeholder="e.g. 12.5"
            value={inputs.secPerFrame}
            onChange={(e) => handleInputChange("secPerFrame", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nodes">Number of Nodes</Label>
          <Input
            id="nodes"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 20"
            value={inputs.nodes}
            onChange={(e) => handleInputChange("nodes", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" type="button">
        <Film className="mr-2 h-5 w-5" /> Calculate
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
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <>
                <Separator className="my-3" />
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                  {results.feedback}
                </p>
              </>
            )}
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
          <li>Enter the total number of frames you need to render.</li>
          <li>Input the average seconds it takes to render one frame.</li>
          <li>Specify how many rendering nodes you have available.</li>
          <li>Click the Calculate button to see the estimated total render time.</li>
          <li>
            Use the result to plan your cloud rendering resources and schedule.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Cloud Render Queue Planner
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            In modern video production and post-production workflows, rendering
            is often the most time-consuming step. Cloud rendering offers a
            scalable solution by distributing the workload across multiple
            rendering nodes, significantly reducing the total render time.
          </p>
          <p>
            The Cloud Render Queue Planner calculator is designed to help
            professionals estimate how long a render job will take when using
            cloud-based render nodes. By inputting the total number of frames,
            the average time it takes to render each frame, and the number of
            nodes available, users can get a realistic estimate of the total
            render duration.
          </p>
          <p>
            This estimate assumes an ideal scenario where the workload is evenly
            distributed and there is no overhead or queue delay. In practice,
            factors such as network latency, node startup time, and data
            transfer can add to the total time. However, this tool provides a
            valuable baseline for planning and resource allocation.
          </p>
          <p>
            Understanding the relationship between frames, seconds per frame,
            and nodes helps studios optimize their cloud rendering costs and
            timelines. For example, increasing nodes reduces render time but
            may increase expenses. Conversely, fewer nodes mean longer render
            times but lower costs. This calculator empowers users to find the
            right balance for their projects.
          </p>
          <p>
            Whether you are a VFX artist, animator, or post-production
            supervisor, using this planner can improve your workflow efficiency
            and help meet tight delivery deadlines.
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
            <strong>Warning:</strong> One common mistake is entering zero or
            negative values for any input, which results in invalid or zero
            render time estimates. Always ensure all inputs are positive
            numbers.
          </p>
          <p>
            Another pitfall is assuming the render time scales perfectly with
            nodes. In reality, overhead and uneven workload distribution can
            cause diminishing returns when adding more nodes.
          </p>
          <p>
            Avoid ignoring the seconds per frame input precision. Using whole
            numbers only may underestimate or overestimate render times,
            especially for fast renders.
          </p>
          <p>
            Lastly, do not forget to consider other factors like data upload
            and download times, which are not included in this calculation but
            can impact total project duration.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300 max-w-none">
          <p>
            <strong>Scenario:</strong> A post-production studio needs to render
            a 10,000-frame animation where each frame takes 12 seconds to
            render. They have access to 20 cloud rendering nodes.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Input the total frame count: <strong>10,000</strong> frames into
              the calculator.
            </li>
            <li>
              Enter the average seconds per frame: <strong>12</strong> seconds.
            </li>
            <li>
              Specify the number of rendering nodes available:{" "}
              <strong>20</strong> nodes.
            </li>
            <li>Click Calculate to find the estimated total render time.</li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator estimates approximately{" "}
            <strong>10 hours</strong> of total render time, helping the studio
            plan their schedule and cloud resource usage effectively.
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
          <BookOpen className="w-5 h-5 text-blue-500" />
          References & additional resources
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
      title="Cloud Render Queue Planner"
      description="Professional video & audio calculator: Cloud Render Queue Planner. Accurate technical formulas for production, post-production, and broadcasting."
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