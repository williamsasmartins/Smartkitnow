import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  BookOpen,
  AlertTriangle,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LumensToWattsCalculator() {
  /**
   * This calculator converts lighting lumens to watts and vice versa,
   * based on the efficacy (lumens per watt) of the light source.
   * 
   * Inputs:
   * - Lumens (lm)
   * - Watts (W)
   * - Efficacy (lm/W) - default typical value is 80 lm/W (LED average)
   * 
   * User can input any two values, and the calculator will compute the third.
   * 
   * Additional inputs for circuit theory (V, I, R, P) are not used here as the task
   * focuses on lighting lumens-to-watts conversion.
   */

  // State for inputs: lumens, watts, efficacy
  const [inputs, setInputs] = useState({
    lumens: "",
    watts: "",
    efficacy: "80", // default efficacy in lumens per watt (typical LED)
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Calculation logic:
  // lumens = watts * efficacy
  // watts = lumens / efficacy
  // efficacy = lumens / watts

  // We try to compute missing value if exactly two inputs are provided.
  const results = useMemo(() => {
    const lumens = parseFloat(inputs.lumens);
    const watts = parseFloat(inputs.watts);
    const efficacy = parseFloat(inputs.efficacy);

    // Count how many inputs are valid numbers
    const validLumens = !isNaN(lumens);
    const validWatts = !isNaN(watts);
    const validEfficacy = !isNaN(efficacy) && efficacy > 0;

    // Safety feedback string
    let feedback = "";

    // Validate efficacy range for safety and accuracy
    if (validEfficacy && (efficacy < 10 || efficacy > 300)) {
      feedback =
        "Warning: The efficacy value is unusually low or high. Typical lighting efficacies range from 10 lm/W (incandescent) to 300 lm/W (high-efficiency LEDs).";
    }

    // Compute missing value if possible
    if (validEfficacy) {
      if (validLumens && !validWatts) {
        // watts = lumens / efficacy
        const calcWatts = lumens / efficacy;
        if (calcWatts < 0) {
          return {
            primary: "Invalid input",
            secondary: "",
            details: "Lumens and efficacy must be positive numbers.",
            feedback,
          };
        }
        return {
          primary: calcWatts.toFixed(2),
          secondary: "Watts (W)",
          details: `Calculated watts from lumens (${lumens} lm) and efficacy (${efficacy} lm/W).`,
          feedback,
        };
      } else if (!validLumens && validWatts) {
        // lumens = watts * efficacy
        const calcLumens = watts * efficacy;
        if (calcLumens < 0) {
          return {
            primary: "Invalid input",
            secondary: "",
            details: "Watts and efficacy must be positive numbers.",
            feedback,
          };
        }
        return {
          primary: calcLumens.toFixed(2),
          secondary: "Lumens (lm)",
          details: `Calculated lumens from watts (${watts} W) and efficacy (${efficacy} lm/W).`,
          feedback,
        };
      } else if (validLumens && validWatts) {
        // efficacy = lumens / watts
        if (watts === 0) {
          return {
            primary: "Invalid input",
            secondary: "",
            details: "Watts cannot be zero when calculating efficacy.",
            feedback,
          };
        }
        const calcEfficacy = lumens / watts;
        return {
          primary: calcEfficacy.toFixed(2),
          secondary: "Efficacy (lm/W)",
          details: `Calculated efficacy from lumens (${lumens} lm) and watts (${watts} W).`,
          feedback,
        };
      } else {
        return {
          primary: "Enter at least two values",
          secondary: "",
          details:
            "Please enter any two values to calculate the third (Lumens, Watts, or Efficacy).",
          feedback,
        };
      }
    } else {
      return {
        primary: "Enter valid efficacy",
        secondary: "",
        details: "Efficacy must be a positive number greater than zero.",
        feedback,
      };
    }
  }, [inputs]);

  // FAQs with thorough technical answers
  const faqs = [
    {
      question: "What is luminous efficacy and why is it important?",
      answer:
        "Luminous efficacy is a measure of how well a light source produces visible light, expressed in lumens per watt (lm/W). It indicates the efficiency of converting electrical power (watts) into visible light (lumens). Higher efficacy means more light output for less power consumption, which is crucial for energy savings and reducing operational costs in lighting design. Different lighting technologies have varying efficacies; for example, incandescent bulbs typically have around 10-17 lm/W, while modern LEDs can exceed 100 lm/W.",
    },
    {
      question: "How accurate is the lumens-to-watts conversion?",
      answer:
        "The conversion accuracy depends primarily on the efficacy value used. Since efficacy varies by lamp type, manufacturer, and operating conditions, using a generic efficacy value provides an estimate rather than an exact conversion. For precise calculations, use the specific efficacy rating from the lamp's datasheet. Additionally, factors like ballast losses, temperature, and aging affect real-world efficacy. This calculator assumes steady-state conditions and typical efficacy values for general lighting applications.",
    },
    {
      question: "Can I use this calculator for all types of lighting?",
      answer:
        "This calculator is applicable to most electric lighting sources where luminous efficacy is known or can be estimated. It works well for LEDs, fluorescent lamps, and incandescent bulbs by adjusting the efficacy input accordingly. However, for specialized lighting such as high-intensity discharge (HID) lamps, or non-visible spectrum sources, efficacy values may differ significantly. Always refer to manufacturer specifications for accurate efficacy values when dealing with specialized or industrial lighting.",
    },
    {
      question: "Why do I need to input efficacy when converting lumens to watts?",
      answer:
        "Lumens and watts measure different physical quantities: lumens quantify visible light output, while watts measure electrical power consumption. The efficacy (lumens per watt) bridges these units by representing how efficiently electrical power is converted into visible light. Without knowing efficacy, you cannot accurately convert between lumens and watts because two lamps with the same wattage can produce vastly different lumen outputs depending on their technology and efficiency.",
    },
    {
      question: "What safety considerations should I keep in mind when working with lighting circuits?",
      answer:
        "When working with lighting circuits, always ensure the power is turned off before installation or maintenance to prevent electric shock. Use wiring and components rated for the circuit's voltage and current. Avoid overloading circuits to prevent overheating and fire hazards. Follow NEC guidelines for conductor sizing, grounding, and protection devices. Additionally, consider thermal management for high-power lighting to maintain efficacy and prolong lamp life. Proper safety equipment and adherence to local electrical codes are essential for safe operation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Real world example object
  const example = {
    title: "Real World Example",
    scenario:
      "Running 100ft of 12/2 Romex cable to power a 150W LED floodlight with an efficacy of 120 lm/W.",
    steps: [
      {
        label: "Step 1: Determine lumens output",
        explanation:
          "Using the efficacy of 120 lm/W and the wattage of 150W, calculate lumens: 150W × 120 lm/W = 18,000 lumens.",
      },
      {
        label: "Step 2: Verify circuit parameters",
        explanation:
          "Check the current draw: I = P / V = 150W / 120V = 1.25A, which is within the 20A rating of 12 AWG wire.",
      },
      {
        label: "Step 3: Confirm wire size and safety",
        explanation:
          "12 AWG wire is suitable for this load over 100ft, ensuring minimal voltage drop and compliance with NEC ampacity tables.",
      },
      {
        label: "Step 4: Use calculator",
        explanation:
          "Input watts = 150 and efficacy = 120 lm/W to confirm lumens output is 18,000 lm.",
      },
    ],
    result:
      "The LED floodlight will produce approximately 18,000 lumens while drawing 150 watts, powered safely by 12/2 Romex over 100ft.",
  };

  // References for further reading
  const references = [
    {
      title: "NEC Table 310.16",
      description: "Allowable Ampacities of Insulated Conductors.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "IES Lighting Handbook",
      description:
        "Comprehensive guide on lighting design, including efficacy and photometric data.",
      url: "https://www.ies.org/handbook/",
    },
    {
      title: "DOE Energy Saver: Lighting Choices",
      description:
        "U.S. Department of Energy guide on lighting technologies and efficiencies.",
      url: "https://www.energy.gov/energysaver/lighting-choices-save-you-money",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lumens">Lumens (lm)</Label>
          <Input
            id="lumens"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 1600"
            value={inputs.lumens}
            onChange={(e) => handleInputChange("lumens", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="watts">Watts (W)</Label>
          <Input
            id="watts"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 20"
            value={inputs.watts}
            onChange={(e) => handleInputChange("watts", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="efficacy">Efficacy (lm/W)</Label>
          <Input
            id="efficacy"
            type="number"
            min={0.1}
            step="any"
            placeholder="e.g. 80"
            value={inputs.efficacy}
            onChange={(e) => handleInputChange("efficacy", e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <p className="mt-3 text-amber-900 font-semibold text-sm">{results.feedback}</p>
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
          <li>
            Enter any two values among Lumens, Watts, and Efficacy (lumens per watt). For example,
            input lumens and efficacy to calculate watts.
          </li>
          <li>
            The calculator will compute the missing third value using the formula: lumens = watts ×
            efficacy.
          </li>
          <li>
            Adjust the efficacy value to match the specific lighting technology or manufacturer data
            for accurate results.
          </li>
          <li>
            Review the result and safety feedback to ensure inputs are within typical ranges.
          </li>
          <li>
            Use the calculated values for lighting design, energy estimation, or circuit planning.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Lighting Lumens-to-Watts Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Lighting design requires understanding the relationship between the light output (lumens)
            and the electrical power consumed (watts). This relationship is governed by the luminous
            efficacy of the light source, which varies widely depending on technology and quality.
          </p>
          <p>
            Incandescent bulbs typically have low efficacy (~10-17 lm/W), fluorescents moderate (~50-100
            lm/W), and LEDs high efficacy (80-300 lm/W). Knowing the efficacy allows engineers and
            electricians to estimate power consumption from desired brightness or vice versa.
          </p>
          <p>
            This calculator uses the fundamental formula: <em>lumens = watts × efficacy</em>. By inputting
            any two values, the third can be accurately calculated, aiding in energy budgeting,
            fixture selection, and compliance with electrical codes.
          </p>
          <p>
            Always verify efficacy values from manufacturer datasheets or trusted references to ensure
            precise calculations. Consider environmental factors and aging effects that may reduce
            efficacy over time.
          </p>
        </div>
      </section>

      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Safety & Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Electricity is dangerous and can cause serious injury or death.
            Always ensure power is disconnected before working on lighting circuits.
          </p>
          <p>
            A common mistake is using incorrect efficacy values, leading to under- or overestimating
            power consumption. Always verify efficacy from reliable sources.
          </p>
          <p>
            Overloading circuits by underestimating wattage can cause overheating and fire hazards.
            Use proper wire gauge and circuit protection devices per NEC guidelines.
          </p>
          <p>
            Avoid mixing units or using outdated efficacy values. Modern LEDs have much higher efficacy
            than older technologies, so assumptions based on incandescent bulbs are inaccurate.
          </p>
          <p>
            When in doubt, consult a licensed electrician or engineer to ensure compliance and safety.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <article className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol>
            {example.steps.map((step, i) => (
              <li key={i}>
                <strong>{step.label}:</strong> {step.explanation}
              </li>
            ))}
          </ol>
          <p>
            <strong>Result:</strong> {example.result}
          </p>
        </article>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Lighting Lumens-to-Watts Converter"
      description="Professional electrical calculator: Lighting Lumens-to-Watts Converter. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Safety & Mistakes" },
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