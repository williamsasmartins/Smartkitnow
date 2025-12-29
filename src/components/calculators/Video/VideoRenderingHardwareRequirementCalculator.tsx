import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function VideoRenderingHardwareRequirementCalculator() {
  const [inputs, setInputs] = useState({
    frameCount: "",
    secPerFrame: "",
    nodes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const frameCount = Number(inputs.frameCount);
    const secPerFrame = Number(inputs.secPerFrame);
    const nodes = Number(inputs.nodes);

    if (
      !frameCount ||
      frameCount <= 0 ||
      !secPerFrame ||
      secPerFrame <= 0 ||
      !nodes ||
      nodes <= 0
    ) {
      return {
        primary: "0",
        secondary: "Hours / Mins",
        details: "Please enter positive numbers for all inputs.",
        feedback: "",
      };
    }

    // Total time in seconds without nodes
    const totalTimeSeconds = frameCount * secPerFrame;

    // Divide by nodes for parallel processing
    const totalTimePerNode = totalTimeSeconds / nodes;

    // Convert seconds to hours and minutes
    const hours = Math.floor(totalTimePerNode / 3600);
    const minutes = Math.floor((totalTimePerNode % 3600) / 60);
    const seconds = Math.floor(totalTimePerNode % 60);

    // Format result string
    let timeStr = "";
    if (hours > 0) timeStr += `${hours}h `;
    if (minutes > 0 || hours > 0) timeStr += `${minutes}m `;
    timeStr += `${seconds}s`;

    return {
      primary: timeStr.trim(),
      secondary: "Estimated Total Rendering Time",
      details: `Calculated by dividing total frames (${frameCount}) × seconds per frame (${secPerFrame}) by number of nodes (${nodes}).`,
      feedback:
        "Increasing the number of nodes reduces total rendering time linearly, assuming perfect parallelization.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does 'nodes' mean in this calculator?",
      answer:
        "In video rendering, 'nodes' refer to the number of rendering machines or processors working in parallel. Increasing nodes can significantly reduce total rendering time by distributing the workload. However, actual speedup depends on network speed, software efficiency, and task distribution.",
    },
    {
      question: "Why is seconds per frame important?",
      answer:
        "Seconds per frame indicates how long it takes to render a single frame on one node. This depends on the complexity of the scene, resolution, effects, and hardware performance. Accurately estimating this value helps predict total rendering time.",
    },
    {
      question: "Can I use this calculator for GPU and CPU rendering?",
      answer:
        "Yes, this calculator is hardware-agnostic. You just need to input the average seconds per frame based on your hardware setup, whether GPU or CPU rendering. Different hardware will have different seconds per frame values.",
    },
    {
      question: "Does this calculator consider overhead or network latency?",
      answer:
        "No, this calculator assumes ideal conditions with perfect parallelization and no overhead. In real-world scenarios, network latency, data transfer, and software overhead can increase total rendering time slightly.",
    },
    {
      question: "How can I improve rendering speed besides adding nodes?",
      answer:
        "Optimizing your scene, reducing resolution or effects complexity, using faster storage, and upgrading hardware components can improve rendering speed. Efficient software settings and caching also help reduce seconds per frame.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "A post-production studio needs to estimate how long a 10,000-frame animation will take to render. Each frame takes approximately 12 seconds to render on one node. They have access to 5 rendering nodes.",
    steps: [
      {
        label: "Step 1",
        explanation: "Input the total frame count: 10,000 frames.",
      },
      {
        label: "Step 2",
        explanation: "Input the seconds per frame: 12 seconds.",
      },
      {
        label: "Step 3",
        explanation: "Input the number of nodes: 5 nodes.",
      },
      {
        label: "Step 4",
        explanation:
          "Calculate total time: (10,000 × 12) / 5 = 24,000 seconds = 6 hours 40 minutes.",
      },
    ],
    result:
      "The estimated total rendering time is 6 hours and 40 minutes using 5 nodes.",
  };

  const references = [
    {
      title: "Understanding Render Farms and Distributed Rendering",
      description:
        "An in-depth article explaining how render farms work and how parallel rendering reduces total time.",
      url: "https://www.renderinghub.com/learn/render-farms",
    },
    {
      title: "Optimizing Video Rendering Performance",
      description:
        "Tips and best practices to improve rendering speed and efficiency.",
      url: "https://www.videomaker.com/article/c10/18770-optimizing-video-rendering-performance",
    },
    {
      title: "Parallel Processing in Video Rendering",
      description:
        "Technical overview of how parallel processing accelerates rendering tasks.",
      url: "https://www.fxguide.com/fxfeatured/parallel-processing-in-visual-effects/",
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
            min="1"
            step="1"
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
            min="0.01"
            step="0.01"
            placeholder="e.g. 12"
            value={inputs.secPerFrame}
            onChange={(e) => handleInputChange("secPerFrame", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nodes">Number of Nodes</Label>
          <Input
            id="nodes"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 5"
            value={inputs.nodes}
            onChange={(e) => handleInputChange("nodes", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={
        !inputs.frameCount || !inputs.secPerFrame || !inputs.nodes
      }>
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
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-3 italic">
                {results.feedback}
              </p>
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
          <li>Enter the total number of frames in your video project.</li>
          <li>
            Enter the average time in seconds it takes to render one frame on a
            single node.
          </li>
          <li>Enter the number of rendering nodes (machines/processors) you have.</li>
          <li>
            Click the "Calculate" button to see the estimated total rendering
            time distributed across your nodes.
          </li>
          <li>
            Use the result to plan your rendering schedule and hardware
            requirements effectively.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Video Rendering Hardware Requirement Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Video rendering is a critical step in post-production workflows,
            where raw footage and effects are processed into the final output.
            The time it takes to render a video depends on multiple factors,
            including the number of frames, complexity of each frame, and the
            hardware used. This calculator helps professionals estimate the total
            rendering time based on these inputs, enabling better resource
            planning and scheduling.
          </p>
          <p>
            The core inputs are the total frame count, the average seconds it
            takes to render each frame on a single node, and the number of nodes
            available for parallel rendering. Nodes refer to individual
            computers or processors that work simultaneously to split the
            rendering workload. By dividing the total rendering time by the
            number of nodes, this calculator provides an estimate of how long
            the rendering will take when distributed across your hardware.
          </p>
          <p>
            It is important to note that this calculation assumes ideal
            conditions with perfect parallelization and no overhead. In real
            scenarios, factors such as network latency, software inefficiencies,
            and data transfer times can add to the total rendering time. Still,
            this tool offers a valuable baseline for planning.
          </p>
          <p>
            Understanding your hardware capabilities and optimizing your
            rendering pipeline can significantly reduce production time and
            costs. Use this calculator to experiment with different node counts
            and frame complexities to find the best balance for your projects.
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
            <strong>Warning:</strong> Avoid entering zero or negative values for
            any input, as this will produce invalid results.
          </p>
          <p>
            <strong>Warning:</strong> Do not assume linear scaling beyond your
            hardware’s capability; network overhead and software limitations can
            reduce efficiency.
          </p>
          <p>
            <strong>Warning:</strong> Seconds per frame should be an average
            based on actual test renders; using unrealistic values will skew
            estimates.
          </p>
          <p>
            <strong>Warning:</strong> This calculator does not account for
            rendering overhead such as scene loading or caching times.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-2">
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
      title="Video Rendering Hardware Requirement Calculator"
      description="Professional video & audio calculator: Video Rendering Hardware Requirement Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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