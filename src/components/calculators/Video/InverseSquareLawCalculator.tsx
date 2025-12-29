import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function InverseSquareLawCalculator() {
  const [inputs, setInputs] = useState({
    initialDistance: "",
    initialIntensity: "",
    newDistance: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const d1 = parseFloat(inputs.initialDistance);
    const I1 = parseFloat(inputs.initialIntensity);
    const d2 = parseFloat(inputs.newDistance);

    if (
      isNaN(d1) ||
      isNaN(I1) ||
      isNaN(d2) ||
      d1 <= 0 ||
      I1 <= 0 ||
      d2 <= 0
    ) {
      return {
        primary: "-",
        secondary: "Invalid input",
        details:
          "Please enter positive numeric values for all fields to calculate the new intensity.",
        feedback: "",
      };
    }

    // Inverse Square Law: I2 = I1 * (d1/d2)^2
    const I2 = I1 * (d1 / d2) ** 2;

    return {
      primary: I2.toFixed(4),
      secondary: "New Intensity (units same as initial)",
      details: `Calculated using I₂ = I₁ × (d₁ / d₂)² where I₁=${I1}, d₁=${d1}, d₂=${d2}`,
      feedback:
        "Remember, intensity decreases rapidly as distance increases due to the inverse square relationship.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the inverse square law?",
      answer:
        "The inverse square law states that a specified physical quantity or intensity is inversely proportional to the square of the distance from the source. In video and audio production, it explains how light or sound intensity diminishes as you move away from the source.",
    },
    {
      question: "Why is the inverse square law important in video production?",
      answer:
        "Understanding the inverse square law helps cinematographers and lighting technicians accurately control lighting setups. It ensures proper exposure and consistent illumination by predicting how light intensity changes with distance.",
    },
    {
      question: "Can this calculator be used for sound intensity?",
      answer:
        "Yes, the inverse square law applies to any point source radiating energy uniformly in all directions, including sound. This calculator can help estimate sound intensity changes with distance in controlled environments.",
    },
    {
      question: "What units should I use for intensity and distance?",
      answer:
        "You can use any consistent units for distance (meters, feet) and intensity (lux, candela, decibels, etc.). Just ensure that the units for initial and new distances match, and the intensity unit remains consistent for input and output.",
    },
    {
      question: "What happens if the new distance is smaller than the initial distance?",
      answer:
        "If the new distance is smaller, the intensity will increase according to the inverse square law. This calculator will provide the amplified intensity value, which is useful for planning close-up lighting or sound setups.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You are lighting a scene where a light source is 2 meters away from the subject with an intensity of 100 lux. You want to know the intensity if you move the light to 4 meters away.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the initial distance (2 meters) in the 'Initial Distance' field.",
      },
      {
        label: "Step 2",
        explanation:
          "Enter the initial intensity (100 lux) in the 'Initial Intensity' field.",
      },
      {
        label: "Step 3",
        explanation:
          "Enter the new distance (4 meters) in the 'New Distance' field.",
      },
      {
        label: "Step 4",
        explanation: "Click the Calculate button to get the new intensity.",
      },
    ],
    result:
      "The calculator shows a new intensity of 25 lux, meaning the light intensity decreases to one quarter when the distance doubles.",
  };

  const references = [
    {
      title: "Inverse Square Law - Wikipedia",
      description:
        "Comprehensive explanation of the inverse square law and its applications in physics.",
      url: "https://en.wikipedia.org/wiki/Inverse-square_law",
    },
    {
      title: "Lighting Techniques for Film and Video",
      description:
        "A professional guide covering lighting principles including the inverse square law.",
      url: "https://www.videomaker.com/article/c10/18764-lighting-techniques-for-film-and-video",
    },
    {
      title: "Sound Intensity and Distance",
      description:
        "Explains how sound intensity changes with distance and how to calculate it.",
      url: "https://www.soundguys.com/understanding-sound-intensity-26333/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="initialDistance">Initial Distance (d₁)</Label>
          <Input
            id="initialDistance"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 2"
            value={inputs.initialDistance}
            onChange={(e) => handleInputChange("initialDistance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="initialIntensity">Initial Intensity (I₁)</Label>
          <Input
            id="initialIntensity"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 100"
            value={inputs.initialIntensity}
            onChange={(e) => handleInputChange("initialIntensity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newDistance">New Distance (d₂)</Label>
          <Input
            id="newDistance"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 4"
            value={inputs.newDistance}
            onChange={(e) => handleInputChange("newDistance", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" type="button">
        <Film className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <>
                <Separator className="my-4" />
                <p className="text-sm italic text-slate-700 dark:text-slate-300">{results.feedback}</p>
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
          <li>Enter the initial distance from the source (d₁) in consistent units (e.g., meters or feet).</li>
          <li>Input the initial intensity (I₁) measured at that distance, using appropriate units (e.g., lux, candela, decibels).</li>
          <li>Enter the new distance (d₂) where you want to calculate the intensity.</li>
          <li>Click the Calculate button to compute the new intensity (I₂) based on the inverse square law formula.</li>
          <li>Review the result and use it to adjust your lighting or audio setup accordingly.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Inverse Square Law Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The inverse square law is a fundamental principle in physics that describes how a physical quantity such as light or sound intensity decreases as the distance from the source increases. Specifically, the intensity is inversely proportional to the square of the distance from the source. This means that if you double the distance from a light or sound source, the intensity drops to one quarter of its original value.
          </p>
          <p>
            In video production, understanding this law is crucial for lighting design. Cinematographers use it to predict how much light will fall on a subject when the distance between the light source and the subject changes. This helps in achieving consistent exposure and mood across different shots.
          </p>
          <p>
            The formula used in this calculator is: <strong>I₂ = I₁ × (d₁ / d₂)²</strong>, where I₁ is the initial intensity at distance d₁, and I₂ is the intensity at the new distance d₂. By inputting your known values, this tool quickly computes the new intensity, saving time and reducing errors on set.
          </p>
          <p>
            This principle also applies to sound engineering, where sound intensity diminishes with distance. Whether you are setting up microphones or speakers, knowing how sound levels change helps optimize audio quality.
          </p>
          <p>
            Always ensure that the units for distance are consistent throughout your calculations. The intensity units should also remain consistent to interpret the results correctly. This calculator is designed to be flexible and can be used with any units as long as they are consistent.
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
            <strong>Warning:</strong> One common mistake is mixing units for distance, such as using meters for initial distance and feet for new distance. This will produce incorrect results. Always use consistent units.
          </p>
          <p>
            <strong>Warning:</strong> Forgetting that intensity units must be consistent can lead to misinterpretation of results. For example, mixing lux and candela without conversion is invalid.
          </p>
          <p>
            <strong>Warning:</strong> Inputting zero or negative values for distances or intensity is invalid and will cause calculation errors. Ensure all inputs are positive numbers.
          </p>
          <p>
            <strong>Warning:</strong> Assuming the inverse square law applies to non-point sources or in environments with significant reflections or absorption can lead to inaccurate predictions.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p><strong>Scenario:</strong> You are lighting a scene where a light source is 2 meters away from the subject with an intensity of 100 lux. You want to know the intensity if you move the light to 4 meters away.</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Enter the initial distance (2 meters) in the "Initial Distance" field.</li>
            <li>Enter the initial intensity (100 lux) in the "Initial Intensity" field.</li>
            <li>Enter the new distance (4 meters) in the "New Distance" field.</li>
            <li>Click the Calculate button to get the new intensity.</li>
          </ol>
          <p><strong>Result:</strong> The calculator shows a new intensity of 25 lux, meaning the light intensity decreases to one quarter when the distance doubles.</p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24">
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Inverse Square Law Calculator"
      description="Professional video & audio calculator: Inverse Square Law Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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