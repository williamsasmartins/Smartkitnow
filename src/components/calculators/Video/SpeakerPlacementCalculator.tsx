import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SpeakerPlacementCalculator() {
  const [inputs, setInputs] = useState({
    roomWidth: "",
    roomDepth: "",
    speakerType: "standard",
    distanceUnit: "feet",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Speaker placement logic:
   * 
   * For a basic speaker placement in a rectangular room:
   * - Distance from front wall (behind speakers): 0.3 * room depth (to avoid boundary interference)
   * - Distance between speakers: 0.6 * room width (for stereo imaging)
   * 
   * Units: feet or meters
   * 
   * This is a simplified guideline for optimal stereo speaker placement.
   */

  const results = useMemo(() => {
    const width = parseFloat(inputs.roomWidth);
    const depth = parseFloat(inputs.roomDepth);
    if (isNaN(width) || isNaN(depth) || width <= 0 || depth <= 0) {
      return {
        primary: "Invalid input",
        secondary: "",
        details: "Please enter valid positive numbers for room dimensions.",
        feedback: "",
      };
    }

    // Calculate distances based on room dimensions
    // Distance from front wall behind speakers
    const frontWallDistance = 0.3 * depth;
    // Distance between speakers
    const speakerDistance = 0.6 * width;

    // Format results with units
    const unitLabel = inputs.distanceUnit === "meters" ? "meters" : "feet";

    return {
      primary: `${frontWallDistance.toFixed(2)} ${unitLabel}`,
      secondary: `Distance from front wall behind speakers`,
      details: `Place your speakers approximately 30% of the room depth away from the front wall to reduce boundary interference.`,
      feedback: `Maintain a speaker separation of about 60% of the room width (${speakerDistance.toFixed(
        2
      )} ${unitLabel}) for optimal stereo imaging.`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is speaker placement important in a room?",
      answer:
        "Proper speaker placement ensures accurate sound reproduction and optimal stereo imaging. Incorrect placement can cause sound reflections, phase issues, and uneven frequency response, negatively impacting audio quality. By positioning speakers correctly, you achieve a balanced and immersive listening experience.",
    },
    {
      question: "Can I use this calculator for any room shape?",
      answer:
        "This calculator is designed for rectangular rooms, which are the most common shapes in studios and home theaters. Irregularly shaped rooms may require more advanced acoustic treatment and placement strategies beyond this calculator's scope.",
    },
    {
      question: "What units should I use for room dimensions?",
      answer:
        "You can input room dimensions in either feet or meters. Make sure to select the correct unit to get accurate placement recommendations. Consistency in units is crucial for precise calculations.",
    },
    {
      question: "How far apart should my speakers be?",
      answer:
        "A good rule of thumb is to space your speakers about 60% of the room's width apart. This spacing helps create a wide and balanced stereo image, allowing you to hear distinct left and right channels clearly.",
    },
    {
      question: "What if my room is very small or very large?",
      answer:
        "In very small rooms, you may need to adjust speaker placement and consider acoustic treatment to avoid reflections and standing waves. In large rooms, additional speakers or subwoofers might be necessary to fill the space evenly. This calculator provides general guidelines but always consider your specific environment.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a rectangular control room measuring 15 feet wide by 20 feet deep, and you want to place your stereo speakers optimally for mixing.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the room width (15 feet) and room depth (20 feet) into the calculator.",
      },
      {
        label: "Step 2",
        explanation:
          "Select the distance unit as feet to match your measurements.",
      },
      {
        label: "Step 3",
        explanation:
          "Click the Calculate button to get recommended speaker placement distances.",
      },
    ],
    result:
      "The calculator suggests placing the speakers about 6.00 feet from the front wall and spacing them approximately 9.00 feet apart for optimal stereo imaging.",
  };

  const references = [
    {
      title: "Sweetwater - Speaker Placement Tips",
      description:
        "Comprehensive guide on how to position your speakers for the best sound in your room.",
      url: "https://www.sweetwater.com/insync/speaker-placement-tips/",
    },
    {
      title: "Sound on Sound - Studio Monitor Placement",
      description:
        "Detailed article explaining the principles of studio monitor placement and room acoustics.",
      url: "https://www.soundonsound.com/techniques/studio-monitor-placement",
    },
    {
      title: "Audioholics - Speaker Placement Guide",
      description:
        "Expert advice on speaker placement for home theaters and studios.",
      url: "https://www.audioholics.com/home-theater-connection/speaker-placement",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="roomWidth">Room Width</Label>
          <Input
            id="roomWidth"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 15"
            value={inputs.roomWidth}
            onChange={(e) => handleInputChange("roomWidth", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="roomDepth">Room Depth</Label>
          <Input
            id="roomDepth"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 20"
            value={inputs.roomDepth}
            onChange={(e) => handleInputChange("roomDepth", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="distanceUnit">Distance Unit</Label>
        <select
          id="distanceUnit"
          className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          value={inputs.distanceUnit}
          onChange={(e) => handleInputChange("distanceUnit", e.target.value)}
        >
          <option value="feet">Feet</option>
          <option value="meters">Meters</option>
        </select>
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
            <Separator className="my-4" />
            <p className="text-sm italic text-blue-700 dark:text-blue-400">{results.feedback}</p>
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
          <li>Measure your room's width and depth accurately in feet or meters.</li>
          <li>Enter the room width and depth values into the respective input fields.</li>
          <li>Select the unit of measurement you used (feet or meters) from the dropdown.</li>
          <li>Click the "Calculate" button to get recommended speaker placement distances.</li>
          <li>Use the results to position your speakers for optimal sound quality and stereo imaging.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Speaker Placement Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Speaker placement is a critical factor in achieving high-quality audio reproduction in any room,
            whether it's a professional studio, home theater, or broadcast environment. The way speakers are positioned
            affects how sound waves interact with the room's surfaces, influencing clarity, imaging, and frequency response.
          </p>
          <p>
            This calculator provides a straightforward method to determine optimal speaker placement based on your room's
            dimensions. It uses established acoustic principles to recommend distances that minimize boundary interference
            and maximize stereo imaging. Specifically, it suggests placing speakers about 30% of the room depth away from
            the front wall to reduce early reflections and standing waves that can muddy the sound.
          </p>
          <p>
            Additionally, the calculator advises spacing the speakers approximately 60% of the room width apart. This spacing
            helps create a balanced stereo field, allowing listeners to perceive distinct left and right audio channels,
            which is essential for mixing, monitoring, and immersive listening experiences.
          </p>
          <p>
            While this tool offers general guidelines, it's important to remember that every room has unique acoustic
            characteristics. Factors such as furniture, wall materials, and room shape can affect sound behavior. For best
            results, combine these placement recommendations with acoustic treatment and calibration tools tailored to your
            specific environment.
          </p>
          <p>
            By following the recommendations from this calculator, you can significantly improve your audio setup's
            performance, ensuring clearer sound, better imaging, and a more enjoyable listening experience.
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
            <strong>Warning:</strong> One common mistake is placing speakers too close to walls or corners, which can cause
            bass buildup and muddy sound. Avoid placing speakers directly against surfaces.
          </p>
          <p>
            Another error is inconsistent measurement units. Mixing feet and meters without conversion leads to incorrect
            placement distances. Always ensure unit consistency.
          </p>
          <p>
            Additionally, neglecting room acoustics and relying solely on placement can limit sound quality. Use this
            calculator as a starting point, but consider acoustic treatment and calibration for best results.
          </p>
          <p>
            Lastly, placing speakers too close together or too far apart can degrade stereo imaging. Follow the recommended
            spacing to maintain a balanced soundstage.
          </p>
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
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
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
      title="Speaker Placement Calculator"
      description="Professional video & audio calculator: Speaker Placement Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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