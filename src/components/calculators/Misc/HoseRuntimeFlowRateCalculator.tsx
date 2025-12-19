import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HoseRuntimeFlowRateCalculator() {
  /**
   * Inputs:
   * - Flow Rate (gallons per minute, GPM)
   * - Desired Water Volume (gallons)
   * - Optional: Hose Diameter (inches) - for advanced users (informational only)
   * 
   * Output:
   * - Runtime (minutes) = Desired Water Volume / Flow Rate
   */

  const [inputs, setInputs] = useState({
    flowRate: "",
    waterVolume: "",
    hoseDiameter: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const flowRate = parseFloat(inputs.flowRate);
    const waterVolume = parseFloat(inputs.waterVolume);
    const hoseDiameter = parseFloat(inputs.hoseDiameter);

    if (!flowRate || flowRate <= 0) {
      return {
        value: null,
        label: "Invalid Flow Rate",
        subtext: "Please enter a positive number for flow rate.",
        warning: "Flow rate must be greater than zero.",
        formulaUsed: "Runtime (min) = Desired Water Volume (gal) ÷ Flow Rate (GPM)",
      };
    }
    if (!waterVolume || waterVolume <= 0) {
      return {
        value: null,
        label: "Invalid Water Volume",
        subtext: "Please enter a positive number for desired water volume.",
        warning: "Water volume must be greater than zero.",
        formulaUsed: "Runtime (min) = Desired Water Volume (gal) ÷ Flow Rate (GPM)",
      };
    }

    // Calculate runtime in minutes
    const runtime = waterVolume / flowRate;

    // Format runtime to 2 decimal places
    const runtimeFormatted = runtime.toFixed(2);

    // Optional: Provide info about hose diameter effect (informational)
    let diameterNote = "";
    if (hoseDiameter && hoseDiameter > 0) {
      diameterNote = `Note: Hose diameter (${hoseDiameter}" nominal) affects flow resistance and pressure loss, which can impact actual flow rate and runtime. This calculator assumes steady flow rate input.`;
    }

    return {
      value: `${runtimeFormatted} minutes`,
      label: "Estimated Hose Runtime",
      subtext: diameterNote,
      warning: null,
      formulaUsed: "Runtime (min) = Desired Water Volume (gal) ÷ Flow Rate (GPM)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is flow rate and why is it important?",
      answer:
        "Flow rate refers to the volume of water that passes through the hose per unit of time, typically measured in gallons per minute (GPM). It is crucial because it determines how quickly water is delivered, affecting how long you need to run your hose to achieve a desired watering volume.",
    },
    {
      question: "How does hose diameter affect flow rate and runtime?",
      answer:
        "Hose diameter influences the resistance to water flow; larger diameters generally allow higher flow rates with less pressure loss. While this calculator assumes a constant flow rate input, in practice, a smaller diameter hose may reduce flow rate and increase runtime due to friction losses.",
    },
    {
      question: "Can I use this calculator for drip irrigation systems?",
      answer:
        "Yes, but you should input the actual flow rate of your drip system, which is often much lower than typical sprinkler systems. Knowing the flow rate and desired water volume helps you estimate how long to run your drip irrigation for efficient watering.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="flowRate" className="mb-1 flex items-center gap-1">
              Flow Rate (Gallons per Minute) <Droplets className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="flowRate"
              type="text"
              placeholder="e.g., 10"
              value={inputs.flowRate}
              onChange={(e) => handleInputChange("flowRate", e.target.value)}
              aria-describedby="flowRateHelp"
            />
            <p id="flowRateHelp" className="text-sm text-slate-500 mt-1">
              Enter the flow rate of your hose or sprinkler system in gallons per minute (GPM).
            </p>
          </div>

          <div>
            <Label htmlFor="waterVolume" className="mb-1 flex items-center gap-1">
              Desired Water Volume (Gallons) <Waves className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="waterVolume"
              type="text"
              placeholder="e.g., 50"
              value={inputs.waterVolume}
              onChange={(e) => handleInputChange("waterVolume", e.target.value)}
              aria-describedby="waterVolumeHelp"
            />
            <p id="waterVolumeHelp" className="text-sm text-slate-500 mt-1">
              Enter the total volume of water you want to apply.
            </p>
          </div>

          <div>
            <Label htmlFor="hoseDiameter" className="mb-1 flex items-center gap-1">
              Hose Diameter (Inches) <Scale className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="hoseDiameter"
              type="text"
              placeholder="Optional, e.g., 0.75"
              value={inputs.hoseDiameter}
              onChange={(e) => handleInputChange("hoseDiameter", e.target.value)}
              aria-describedby="hoseDiameterHelp"
            />
            <p id="hoseDiameterHelp" className="text-sm text-slate-500 mt-1">
              Optional: Enter your hose's nominal diameter to understand its effect on flow.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, results update automatically
          }}
          aria-label="Calculate hose runtime"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ flowRate: "", waterVolume: "", hoseDiameter: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{results.subtext}</p>
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <p className="mt-4 text-xs italic text-slate-500 dark:text-slate-400">
              Formula used: {results.formulaUsed}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Hose Runtime vs Flow Rate Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Hose Runtime vs Flow Rate Calculator is a vital tool for gardeners, landscapers, and irrigation professionals aiming to optimize water usage efficiently. By inputting the flow rate of your hose or sprinkler system and the desired volume of water to be applied, this calculator estimates the exact runtime needed to deliver that volume. This helps prevent overwatering or underwatering, saving water, energy, and money while promoting healthy plant growth. Understanding the relationship between flow rate and runtime is essential for effective irrigation management.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Flow rate, measured in gallons per minute (GPM), indicates how much water flows through your hose in a given time. The runtime is simply the duration you need to run your hose to achieve the desired water volume. This calculator assumes a steady flow rate and does not account for pressure fluctuations or hose friction losses, but it provides a reliable baseline for planning watering schedules.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires just a few inputs. First, determine the flow rate of your hose or irrigation system, which can often be found on the product specifications or measured using a container and stopwatch. Next, decide the total volume of water you want to apply to your garden or lawn. Optionally, enter your hose diameter to understand its potential impact on flow characteristics.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure or find out your hose's flow rate in gallons per minute (GPM).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the desired total water volume in gallons that you want to apply.
          </li>
          <li>
            <strong>Step 3:</strong> Optionally, input your hose diameter in inches for additional context.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see the estimated runtime in minutes.
          </li>
          <li>
            <strong>Step 5:</strong> Adjust inputs as needed to plan your watering schedule effectively.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize the efficiency of your watering system, always verify your flow rate periodically, especially if you notice changes in water pressure or hose performance. Using a hose with a larger diameter can reduce pressure loss and increase flow rate, but ensure your water source can supply the needed volume. Avoid running hoses for longer than necessary to prevent water waste and potential damage to plants from overwatering. Additionally, inspect hoses regularly for leaks or kinks that can affect flow and runtime accuracy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Safety is paramount: never leave hoses unattended while running, and avoid running hoses across walkways to prevent tripping hazards. When using automated irrigation systems, program runtimes based on calculated values and adjust seasonally to accommodate weather changes and plant needs.
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

      {/* NEW RICH REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For further reading and verification, please refer to these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.epa.gov/watersense/how-we-use-water"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              EPA WaterSense: How We Use Water <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Provides comprehensive insights on water usage, efficiency, and best practices for irrigation and household water management.
            </p>
          </li>
          <li>
            <a
              href="https://extension.umd.edu/resource/measuring-irrigation-water-application"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              University of Maryland Extension: Measuring Irrigation Water Application <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed guide on how to measure flow rates and water volumes for irrigation systems to optimize watering schedules.
            </p>
          </li>
          <li>
            <a
              href="https://www.energy.gov/energysaver/water-heating"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              U.S. Department of Energy: Water Heating <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              While focused on water heating, this resource includes valuable information on water flow rates and energy implications relevant to water use efficiency.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Hose Runtime vs Flow Rate Calculator"
      description="Calculate hose runtime for watering. Determine how long to run your sprinkler to deliver a specific amount of water."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Runtime (minutes) = Desired Water Volume (gallons) ÷ Flow Rate (gallons per minute)",
        variables: [
          { symbol: "Runtime", description: "Time to run the hose or sprinkler (minutes)" },
          { symbol: "Desired Water Volume", description: "Total water volume to apply (gallons)" },
          { symbol: "Flow Rate", description: "Water flow rate through the hose (gallons per minute)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a sprinkler system with a flow rate of 8 gallons per minute, and you want to apply 40 gallons of water to your garden bed.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Identify the flow rate of your sprinkler system: 8 GPM.",
          },
          {
            label: "Step 2",
            explanation:
              "Determine the desired water volume: 40 gallons.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate runtime: 40 gallons ÷ 8 GPM = 5 minutes.",
          },
        ],
        result: "You should run your sprinkler for approximately 5 minutes to deliver 40 gallons of water.",
      }}
      relatedCalculators={[
        { title: "Propane Tank Burn Time Estimator", url: "/everyday-life/propane-tank-burn-time", icon: "💡" },
        { title: "Rainwater Barrel Days of Supply", url: "/everyday-life/rainwater-barrel-days-supply", icon: "💧" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday-life/water-heater-recovery-time", icon: "💧" },
        { title: "Laundry Detergent Dosage by Load Size", url: "/everyday-life/laundry-detergent-dosage", icon: "💡" },
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday-life/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
        { title: "Lawn Mowing Time & Fuel Planner", url: "/everyday-life/lawn-mowing-time-fuel", icon: "💡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}