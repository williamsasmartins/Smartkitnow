import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TvSizeViewingDistancePlannerCalculator() {
  const [inputs, setInputs] = useState({
    tvSize: "", // diagonal in inches
    viewingDistance: "", // distance in feet or meters
    unit: "feet", // feet or meters
    option: "recommended" // recommended or max
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Logic:
   * - If user inputs TV Size and wants to find Viewing Distance:
   *    Viewing Distance = TV Size * factor (depends on option)
   * - If user inputs Viewing Distance and wants to find TV Size:
   *    TV Size = Viewing Distance / factor
   * 
   * Factors based on SMPTE and THX recommendations:
   * - Recommended viewing distance factor: 1.5 to 2.5 times the TV diagonal
   * - Max viewing distance factor: up to 3 times the TV diagonal
   * 
   * We'll use:
   * - Recommended: 1.6 (close to SMPTE)
   * - Max: 2.5
   * 
   * User can input either TV Size or Viewing Distance, and leave the other blank.
   * Calculator will compute the missing value.
   */

  const results = useMemo(() => {
    const tvSize = parseFloat(inputs.tvSize);
    const viewingDistance = parseFloat(inputs.viewingDistance);
    const unit = inputs.unit;
    const option = inputs.option;

    if ((!tvSize && !viewingDistance) || (tvSize && viewingDistance)) {
      return {
        primary: "—",
        secondary: "",
        details:
          "Please enter either TV Size or Viewing Distance, but not both, to calculate the missing value.",
        feedback: "",
      };
    }

    // Factors for calculation
    const recommendedFactor = 1.6;
    const maxFactor = 2.5;
    const factor = option === "recommended" ? recommendedFactor : maxFactor;

    // Conversion between feet and meters
    // 1 foot = 0.3048 meters
    const feetToMeters = 0.3048;

    if (tvSize && !viewingDistance) {
      // Calculate viewing distance from TV size
      // Viewing Distance = TV Size * factor (in inches)
      // Convert inches to feet or meters
      // 1 foot = 12 inches
      let distanceInFeet = (tvSize * factor) / 12;
      let distance = distanceInFeet;
      if (unit === "meters") {
        distance = distanceInFeet * feetToMeters;
      }
      return {
        primary: distance.toFixed(2),
        secondary: unit === "feet" ? "feet" : "meters",
        details: `For a ${tvSize}" TV, the ${option} viewing distance is approximately ${distance.toFixed(
          2
        )} ${unit}.`,
        feedback:
          "Sitting at this distance ensures optimal viewing comfort and image clarity without eye strain.",
      };
    }

    if (!tvSize && viewingDistance) {
      // Calculate TV size from viewing distance
      // TV Size = Viewing Distance * 12 / factor (in inches)
      let distanceInFeet = viewingDistance;
      if (unit === "meters") {
        distanceInFeet = viewingDistance / feetToMeters;
      }
      const sizeInInches = (distanceInFeet * 12) / factor;
      return {
        primary: sizeInInches.toFixed(1),
        secondary: 'inches',
        details: `For a viewing distance of ${viewingDistance} ${unit}, the ${option} TV size is approximately ${sizeInInches.toFixed(
          1
        )} inches diagonal.`,
        feedback:
          "Choosing this TV size will provide an immersive viewing experience without pixelation or discomfort.",
      };
    }

    return {
      primary: "—",
      secondary: "",
      details: "Invalid input values.",
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the ideal viewing distance for a 55-inch TV?",
      answer:
        "The ideal viewing distance for a 55-inch TV depends on the recommended factor, typically around 1.6 times the TV diagonal. This means sitting approximately 7.3 feet (2.2 meters) away provides optimal picture clarity and comfort. Sitting too close can cause eye strain, while sitting too far reduces immersion.",
    },
    {
      question: "Why does the calculator use different factors for recommended and max viewing distances?",
      answer:
        "Recommended viewing distances prioritize eye comfort and optimal image quality, usually between 1.5 to 2 times the TV diagonal. Max viewing distances extend up to 2.5 or 3 times the diagonal, allowing flexibility in room layout but may reduce perceived image sharpness. This calculator lets you choose based on your preference.",
    },
    {
      question: "Can I use this calculator for projector screens?",
      answer:
        "While the calculator is designed for TVs, the principles apply to projector screens as well. However, projector image quality and ambient light conditions can affect optimal viewing distance, so additional factors should be considered for projectors.",
    },
    {
      question: "Does screen resolution affect the recommended viewing distance?",
      answer:
        "Yes, higher resolution screens (like 4K) allow viewers to sit closer without noticing pixelation, effectively reducing the recommended viewing distance. This calculator uses general factors suitable for HD and 4K TVs but for ultra-high resolutions, sitting closer can be comfortable.",
    },
    {
      question: "Why is it important to consider units (feet or meters) in the calculator?",
      answer:
        "Using consistent units ensures accurate calculations and avoids confusion. This calculator supports both feet and meters, converting values internally to maintain precision. Always verify your inputs match the selected unit system for correct results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a living room where you can sit about 9 feet away from the TV. You want to find the ideal TV size for this viewing distance using the recommended setting.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the viewing distance as 9 feet and leave the TV size blank.",
      },
      {
        label: "Step 2",
        explanation:
          "Select 'feet' as the unit and 'recommended' as the viewing distance option.",
      },
      {
        label: "Step 3",
        explanation:
          "The calculator uses the formula: TV Size = (Viewing Distance in inches) / factor.",
      },
      {
        label: "Step 4",
        explanation:
          "Convert 9 feet to inches: 9 ft × 12 = 108 inches. Using factor 1.6, TV Size = 108 / 1.6 = 67.5 inches.",
      },
    ],
    result:
      "The ideal TV size for a 9-foot viewing distance is approximately 67.5 inches diagonal, providing an immersive and comfortable viewing experience.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for TV and video viewing distances.",
      url: "https://www.smpte.org/",
    },
    {
      title: "THX Viewing Distance Recommendations",
      description:
        "Guidelines for optimal home theater viewing distances and screen sizes.",
      url: "https://www.thx.com/consumer/home-theater-setup/viewing-distance/",
    },
    {
      title: "RTINGS TV Size & Viewing Distance Guide",
      description:
        "Comprehensive guide on choosing TV size based on viewing distance and resolution.",
      url: "https://www.rtings.com/tv/learn/what-size-tv-should-i-buy",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tvSize">TV Size (Diagonal)</Label>
          <Input
            id="tvSize"
            type="number"
            min={1}
            placeholder="e.g. 55"
            value={inputs.tvSize}
            onChange={(e) => handleInputChange("tvSize", e.target.value)}
            disabled={!!inputs.viewingDistance}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter TV size in inches. Leave blank if calculating TV size.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="viewingDistance">Viewing Distance</Label>
          <Input
            id="viewingDistance"
            type="number"
            min={0.1}
            step={0.1}
            placeholder="e.g. 8"
            value={inputs.viewingDistance}
            onChange={(e) => handleInputChange("viewingDistance", e.target.value)}
            disabled={!!inputs.tvSize}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter distance from screen. Leave blank if calculating distance.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Units</Label>
          <select
            id="unit"
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
            value={inputs.unit}
            onChange={(e) => handleInputChange("unit", e.target.value)}
          >
            <option value="feet">Feet</option>
            <option value="meters">Meters</option>
          </select>

          <Label htmlFor="option" className="mt-4 block">
            Calculation Type
          </Label>
          <select
            id="option"
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
            value={inputs.option}
            onChange={(e) => handleInputChange("option", e.target.value)}
          >
            <option value="recommended">Recommended Viewing Distance</option>
            <option value="max">Maximum Viewing Distance</option>
          </select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Film className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 text-sm italic text-blue-700">{results.feedback}</p>
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
          <li>Enter either the TV size (diagonal in inches) or your viewing distance (in feet or meters). Leave the other field blank.</li>
          <li>Select the unit system you prefer: feet or meters. Ensure your input matches the selected unit.</li>
          <li>Choose the calculation type: "Recommended Viewing Distance" for optimal comfort or "Maximum Viewing Distance" for the furthest acceptable distance.</li>
          <li>Click the "Calculate" button to see the recommended viewing distance or TV size based on your inputs.</li>
          <li>Review the result and use the feedback to optimize your viewing setup for comfort and image quality.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to TV Size & Viewing Distance Planner
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Choosing the right TV size and viewing distance is crucial for an immersive and comfortable home viewing experience. The diagonal size of a TV, measured in inches, combined with the distance you sit from the screen, determines how sharp and enjoyable the picture will be. Sitting too close to a large TV can cause eye strain and make pixels visible, while sitting too far reduces immersion and detail perception.
          </p>
          <p>
            Industry standards such as SMPTE (Society of Motion Picture and Television Engineers) and THX provide guidelines for optimal viewing distances. Typically, the recommended viewing distance is between 1.5 to 2.5 times the diagonal size of the TV. This calculator uses a factor of 1.6 for recommended viewing distance and 2.5 for maximum viewing distance, allowing you to tailor your setup based on room size and personal preference.
          </p>
          <p>
            The calculator supports both feet and meters to accommodate different measurement systems. It also allows you to input either the TV size or your available viewing distance, calculating the missing value accordingly. This flexibility helps you make informed decisions whether you are buying a new TV or arranging your living space.
          </p>
          <p>
            Additionally, screen resolution plays a role in viewing distance. Higher resolution TVs (4K and above) allow closer viewing without visible pixels, enhancing detail and immersion. While this calculator provides general recommendations, consider your TV’s resolution and room lighting for the best experience.
          </p>
          <p>
            By following these guidelines and using this planner, you can optimize your home theater setup for maximum enjoyment, reducing eye fatigue and ensuring the best picture quality.
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
            <strong>Warning:</strong> Entering both TV size and viewing distance simultaneously will prevent the calculator from working correctly. Always leave one field blank to calculate the other.
          </p>
          <p>
            <strong>Warning:</strong> Mixing units (e.g., entering feet but selecting meters) will yield incorrect results. Ensure your input matches the selected unit system.
          </p>
          <p>
            <strong>Warning:</strong> Ignoring screen resolution can lead to suboptimal viewing distances. Higher resolution TVs allow closer seating, so adjust your expectations accordingly.
          </p>
          <p>
            <strong>Warning:</strong> Using maximum viewing distance as a default may result in less immersive experiences. Recommended distances are designed for optimal comfort and image quality.
          </p>
          <p>
            <strong>Warning:</strong> Not accounting for room layout and seating arrangements can affect practical viewing distance. Use this calculator as a guide, but consider your actual environment.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-2">
            {example.steps.map((step, i) => (
              <li key={i}>
                <strong>{step.label}:</strong> {step.explanation}
              </li>
            ))}
          </ol>
          <p><strong>Result:</strong> {example.result}</p>
        </div>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
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
      title="TV Size & Viewing Distance Planner"
      description="Professional video & audio calculator: TV Size & Viewing Distance Planner. Accurate technical formulas for production, post-production, and broadcasting."
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