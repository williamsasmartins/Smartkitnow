import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Monitor, DollarSign, Clock, AlertTriangle, BookOpen, ExternalLink, Settings } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RenderFarmCostEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    frameCount: "",
    timePerFrame: "",
    timeUnit: "minutes", // seconds, minutes, hours
    nodes: "1",
    costPerNodeHour: "0", // Opcional: Custo por hora por node (ex: AWS, RebusFarm)
  });

  const handleInputChange = (field: string, value: string) => {
    // Permite apenas números e ponto decimal
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const frames = parseFloat(inputs.frameCount);
    const timeVal = parseFloat(inputs.timePerFrame);
    const nodes = parseFloat(inputs.nodes);
    const costRate = parseFloat(inputs.costPerNodeHour);

    if (!frames || !timeVal || !nodes || nodes <= 0) {
      return {
        primary: "0h 0m",
        secondary: "Estimated Duration",
        cost: "$0.00",
        details: "Enter frame count and render time per frame.",
        feedback: "",
      };
    }

    // 1. Normalizar tempo por frame para Minutos
    let minutesPerFrame = timeVal;
    if (inputs.timeUnit === "seconds") minutesPerFrame = timeVal / 60;
    if (inputs.timeUnit === "hours") minutesPerFrame = timeVal * 60;

    // 2. Calcular Trabalho Total (Machine Hours)
    const totalWorkMinutes = frames * minutesPerFrame;
    const totalMachineHours = totalWorkMinutes / 60;

    // 3. Calcular Tempo Real (Wall Clock Time) com N nodes
    // Assumindo eficiência linear perfeita (sem overhead de rede)
    const farmTimeMinutes = totalWorkMinutes / nodes;
    
    const days = Math.floor(farmTimeMinutes / 1440);
    const hours = Math.floor((farmTimeMinutes % 1440) / 60);
    const mins = Math.round(farmTimeMinutes % 60);

    let timeString = `${hours}h ${mins}m`;
    if (days > 0) timeString = `${days}d ${hours}h ${mins}m`;
    if (days === 0 && hours === 0) timeString = `${mins} minutes`;

    // 4. Calcular Custo (Se houver taxa)
    // Custo = Total Machine Hours * Rate
    let costString = "—";
    if (costRate > 0) {
      const totalCost = totalMachineHours * costRate;
      costString = `$${totalCost.toFixed(2)}`;
    }

    return {
      primary: timeString,
      secondary: `Duration (${nodes} Nodes)`,
      cost: costString,
      details: `Total Workload: ${totalMachineHours.toFixed(1)} machine hours.`,
      feedback: costRate > 0 
        ? `Estimated cost based on $${costRate}/node/hr.` 
        : "Enter a cost rate to estimate price.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How is render time calculated?",
      answer: "We calculate the 'Total Machine Hours' needed by multiplying the number of frames by the average render time per frame. We then divide this total work by the number of nodes (computers) you have available to find the actual duration."
    },
    {
      question: "Does this calculator account for network upload time?",
      answer: "No, this calculator strictly estimates the processing time. If you are using a cloud render farm, remember to factor in the time it takes to upload your project files and download the final frames, which depends on your internet speed."
    },
    {
      question: "Why calculate cost per node hour?",
      answer: "Commercial render farms typically charge based on GHz-hours or Node-hours. By inputting the hourly cost of a node, you can estimate the total budget required for your project."
    },
    {
      question: "What affects render time the most?",
      answer: "Resolution (4K vs 1080p), sampling quality (noise levels), global illumination settings, and scene complexity (poly count, textures) are the biggest factors. Doubling resolution essentially quadruples the pixel count, significantly increasing time."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario: "Rendering a 300-frame animation where each frame takes 20 minutes on a single machine. You plan to rent 50 cloud nodes at $0.50/hour each.",
    steps: [
      { label: "1. Calculate Total Work", explanation: "300 frames * 20 min = 6,000 minutes (or 100 hours) of total computing work." },
      { label: "2. Apply Nodes", explanation: "6,000 minutes / 50 nodes = 120 minutes (2 hours) actual wait time." },
      { label: "3. Calculate Cost", explanation: "100 total machine hours * $0.50 = $50.00 estimated cost." }
    ],
    result: "Result: Job finishes in 2 hours and costs $50.00."
  };

  const references = [
    { title: "Chaos Group: Distributed Rendering", description: "Understanding how V-Ray distributes tasks.", url: "https://www.chaos.com/" },
    { title: "AWS Thinkbox Deadline", description: "Scalable compute management for render farms.", url: "https://www.aws.amazon.com/thinkbox-deadline/" }
  ];

  const widget = (
    <div className="space-y-6">
      {/* TIME INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Total Frames</Label>
          <Input 
            type="number" 
            placeholder="e.g. 300" 
            value={inputs.frameCount} 
            onChange={(e) => handleInputChange("frameCount", e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label>Avg Time per Frame</Label>
          <div className="flex gap-2">
            <Input 
              type="number" 
              placeholder="e.g. 15" 
              value={inputs.timePerFrame} 
              onChange={(e) => handleInputChange("timePerFrame", e.target.value)} 
            />
            <Select value={inputs.timeUnit} onValueChange={(v) => setInputs(p => ({...p, timeUnit: v}))}>
              <SelectTrigger className="w-[110px]"><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="seconds">Secs</SelectItem>
                <SelectItem value="minutes">Mins</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* FARM INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Number of Nodes (PCs)</Label>
          <Input 
            type="number" 
            placeholder="e.g. 10" 
            value={inputs.nodes} 
            onChange={(e) => handleInputChange("nodes", e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label>Cost per Node/Hour ($)</Label>
          <div className="relative">
            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-8" 
              type="number" 
              placeholder="0.00 (Optional)" 
              value={inputs.costPerNodeHour} 
              onChange={(e) => handleInputChange("costPerNodeHour", e.target.value)} 
            />
          </div>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Monitor className="mr-2 h-5 w-5" /> Calculate Estimates
      </Button>

      {results.primary !== "0h 0m" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2 text-blue-600 font-semibold">
                <Clock className="h-5 w-5" /> Est. Time
              </div>
              <div className="text-4xl font-extrabold text-blue-700 dark:text-blue-300">
                {results.primary}
              </div>
              <p className="text-xs text-blue-600/80 mt-1">{results.secondary}</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2 text-green-600 font-semibold">
                <DollarSign className="h-5 w-5" /> Est. Cost
              </div>
              <div className="text-4xl font-extrabold text-green-700 dark:text-green-300">
                {results.cost}
              </div>
              <p className="text-xs text-green-600/80 mt-1">{results.feedback}</p>
            </CardContent>
          </Card>
          
          <div className="md:col-span-2 text-center text-xs text-muted-foreground">
            {results.details}
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li><strong>Step 1:</strong> Enter the total <strong>Frame Count</strong> of your animation sequence.</li>
          <li><strong>Step 2:</strong> Input the average <strong>Time per Frame</strong>. It is recommended to render a few test frames to get an accurate average.</li>
          <li><strong>Step 3:</strong> Enter the number of <strong>Nodes</strong> (computers) you will be using. Use "1" for a single local machine.</li>
          <li><strong>Step 4:</strong> (Optional) Enter the <strong>Cost per Node/Hour</strong> if you are using a cloud service or renting equipment.</li>
          <li><strong>Step 5:</strong> Click Calculate to see the total duration and estimated budget.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Render Estimation
        </h2>
        <div className="prose prose-slate dark:prose-invert text-slate-600 dark:text-slate-300">
          <p>
            Rendering is often the biggest bottleneck in 3D production pipelines. Whether you are using CPU-based engines like V-Ray and Arnold, or GPU-based engines like Redshift and Octane, knowing your "render budget" is crucial for meeting deadlines.
          </p>
          <p>
            <strong>The Math Behind the Magic:</strong><br/>
            Render farms work on the principle of distributed computing. If a project takes 100 hours on one computer (total machine hours), adding 9 more identical computers (10 total) reduces the wall-clock time to 10 hours. However, the <em>total cost</em> remains based on the 100 machine hours consumed.
          </p>
          <p>
            <strong>Cloud vs. Local:</strong><br/>
            Building a local farm gives you control but requires maintenance and electricity costs. Cloud farms offer instant scalability (access to thousands of nodes) but charge per node-hour or GHz-hour. This calculator helps you compare the feasibility of both options.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-900 dark:text-amber-100">
          <AlertTriangle className="w-5 h-5"/> Common Mistakes
        </h3>
        <div className="space-y-3 text-sm text-amber-900 dark:text-amber-100">
          <p><strong>1. Relying on a Single Test Frame:</strong> Frames can vary wildly in complexity. An empty background frame might take 10 seconds, while a close-up of character hair might take 20 minutes. Always average out 5-10 random frames from your sequence.</p>
          <p><strong>2. Ignoring Queue Times:</strong> On public cloud farms, your job might sit in a queue before it starts rendering. This calculator only measures processing time.</p>
          <p><strong>3. Underestimating Upload/Download:</strong> For large 4K EXR sequences, transferring terabytes of data to the cloud can take longer than the render itself depending on your internet speed.</p>
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
          <BookOpen className="w-5 h-5 text-blue-500"/> References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a href={ref.url} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1">
                {ref.title} <ExternalLink className="w-3 h-3"/>
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
      title="3D Render Farm Time & Cost Estimator"
      description="Estimate total render time and costs for 3D animation projects using local or cloud render farms."
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
         { id: "references", label: "References" }
      ]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}
