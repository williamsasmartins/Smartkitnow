import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TvSizeViewingDistancePlannerCalculator() {
  const [inputs, setInputs] = useState({
    tvSize: "", // diagonal in inches
    viewingDistance: "", // distance in feet or meters (unit selectable)
    unit: "feet", // feet or meters
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 
   * 1. If user inputs TV size and wants recommended viewing distance:
   *    Viewing distance (in inches) = TV size (in inches) * 1.5 to 2.5 (range)
   * 
   * 2. If user inputs viewing distance and wants recommended TV size:
   *    TV size (in inches) = Viewing distance (in inches) / 1.5 to 2.5 (range)
   * 
   * We'll calculate both ranges and display recommended viewing distance range for given TV size,
   * and recommended TV size range for given viewing distance.
   * 
   * The user can input either or both. If both inputs are given, we show if they match recommended range.
   */

  const results = useMemo(() => {
    const tvSizeNum = parseFloat(inputs.tvSize);
    const viewingDistanceNum = parseFloat(inputs.viewingDistance);
    const unit = inputs.unit;

    // Convert viewing distance to inches for calculation if in feet or meters
    // 1 foot = 12 inches
    // 1 meter = 39.3701 inches
    let viewingDistanceInches = 0;
    if (!isNaN(viewingDistanceNum) && viewingDistanceNum > 0) {
      if (unit === "feet") {
        viewingDistanceInches = viewingDistanceNum * 12;
      } else if (unit === "meters") {
        viewingDistanceInches = viewingDistanceNum * 39.3701;
      }
    }

    // Recommended multipliers for viewing distance to TV size ratio
    // SMPTE recommends ~1.5x TV size, THX recommends ~3x, but 1.5-2.5 is a good range
    const minMultiplier = 1.5;
    const maxMultiplier = 2.5;

    // If TV size is given, calculate recommended viewing distance range
    let recommendedViewingDistanceMin = 0;
    let recommendedViewingDistanceMax = 0;
    if (!isNaN(tvSizeNum) && tvSizeNum > 0) {
      recommendedViewingDistanceMin = tvSizeNum * minMultiplier; // inches
      recommendedViewingDistanceMax = tvSizeNum * maxMultiplier; // inches
    }

    // If viewing distance is given, calculate recommended TV size range
    let recommendedTvSizeMin = 0;
    let recommendedTvSizeMax = 0;
    if (viewingDistanceInches > 0) {
      recommendedTvSizeMax = viewingDistanceInches / minMultiplier;
      recommendedTvSizeMin = viewingDistanceInches / maxMultiplier;
    }

    // Format inches to feet/meters if needed
    const formatDistance = (inches: number) => {
      if (unit === "feet") {
        return (inches / 12).toFixed(1) + " ft";
      } else if (unit === "meters") {
        return (inches / 39.3701).toFixed(2) + " m";
      }
      return inches.toFixed(1) + " in";
    };

    // Format TV size in inches with inch symbol
    const formatTvSize = (size: number) => {
      return size.toFixed(1) + " in";
    };

    // Feedback message if both inputs are given
    let feedback = "";
    if (
      !isNaN(tvSizeNum) &&
      tvSizeNum > 0 &&
      viewingDistanceInches > 0
    ) {
      if (
        viewingDistanceInches >= recommendedViewingDistanceMin &&
        viewingDistanceInches <= recommendedViewingDistanceMax
      ) {
        feedback =
          "Your viewing distance is within the recommended range for your TV size. Enjoy optimal viewing experience!";
      } else if (viewingDistanceInches < recommendedViewingDistanceMin) {
        feedback =
          "Your viewing distance is closer than recommended. Consider increasing distance or using a smaller TV for comfortable viewing.";
      } else {
        feedback =
          "Your viewing distance is farther than recommended. Consider a larger TV or moving closer for better immersion.";
      }
    }

    // If no inputs, prompt user
    if (
      (isNaN(tvSizeNum) || tvSizeNum <= 0) &&
      (isNaN(viewingDistanceNum) || viewingDistanceNum <= 0)
    ) {
      return {
        primary: "—",
        secondary: "",
        details: "Please enter your TV size or viewing distance to get recommendations.",
        feedback: "",
      };
    }

    // Build result string depending on inputs
    let primary = "";
    let secondary = "";
    let details = "";

    if (!isNaN(tvSizeNum) && tvSizeNum > 0 && (isNaN(viewingDistanceNum) || viewingDistanceNum <= 0)) {
      // Only TV size given: show recommended viewing distance range
      primary = `${formatDistance(recommendedViewingDistanceMin)} – ${formatDistance(recommendedViewingDistanceMax)}`;
      secondary = "Recommended Viewing Distance";
      details = `For a ${formatTvSize(tvSizeNum)} TV, the ideal viewing distance is between ${formatDistance(
        recommendedViewingDistanceMin
      )} and ${formatDistance(recommendedViewingDistanceMax)}.`;
    } else if (
      (isNaN(tvSizeNum) || tvSizeNum <= 0) &&
      viewingDistanceInches > 0
    ) {
      // Only viewing distance given: show recommended TV size range
      primary = `${formatTvSize(recommendedTvSizeMin)} – ${formatTvSize(recommendedTvSizeMax)}`;
      secondary = "Recommended TV Size";
      details = `For a viewing distance of ${formatDistance(
        viewingDistanceInches
      )}, the ideal TV size is between ${formatTvSize(
        recommendedTvSizeMin
      )} and ${formatTvSize(recommendedTvSizeMax)}.`;
    } else if (
      !isNaN(tvSizeNum) &&
      tvSizeNum > 0 &&
      viewingDistanceInches > 0
    ) {
      // Both given: show recommended ranges and feedback
      primary = `${formatDistance(recommendedViewingDistanceMin)} – ${formatDistance(recommendedViewingDistanceMax)}`;
      secondary = "Recommended Viewing Distance";
      details = `Your TV size is ${formatTvSize(tvSizeNum)}. The recommended viewing distance range is ${formatDistance(
        recommendedViewingDistanceMin
      )} to ${formatDistance(recommendedViewingDistanceMax)}. Your current viewing distance is ${formatDistance(
        viewingDistanceInches
      )}.`;
    }

    return {
      primary,
      secondary,
      details,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the ideal viewing distance for a TV?",
      answer:
        "The ideal viewing distance depends on the size of your TV. Generally, it is recommended to sit between 1.5 to 2.5 times the diagonal size of your TV. Sitting too close can cause eye strain, while sitting too far may reduce the immersive experience.",
    },
    {
      question: "Why does unit selection matter in this calculator?",
      answer:
        "Different regions use different measurement units such as feet or meters. Selecting the correct unit ensures that the viewing distance you input and the results you receive are accurate and meaningful for your setup.",
    },
    {
      question: "Can I use this calculator for projector screens?",
      answer:
        "Yes, the principles of viewing distance relative to screen size apply to projector screens as well. However, projector setups may have additional considerations like screen gain and ambient light that are not covered by this calculator.",
    },
    {
      question: "What happens if my viewing distance is outside the recommended range?",
      answer:
        "If your viewing distance is closer than recommended, you might notice pixelation or discomfort. If it's farther, you may lose detail and immersion. Adjusting your seating or TV size can help optimize your viewing experience.",
    },
    {
      question: "Does screen resolution affect viewing distance recommendations?",
      answer:
        "Higher resolution screens (like 4K) allow you to sit closer without noticing pixelation compared to lower resolution screens. This calculator provides general recommendations, but you can adjust based on your screen resolution and personal preference.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a 55-inch TV and want to find the ideal viewing distance for your living room setup.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter your TV size as 55 inches in the TV Size input field.",
      },
      {
        label: "Step 2",
        explanation: "Select your preferred unit for viewing distance (feet or meters).",
      },
      {
        label: "Step 3",
        explanation:
          "Leave the viewing distance field empty to get the recommended viewing distance range.",
      },
      {
        label: "Step 4",
        explanation:
          "Click Calculate to see the recommended viewing distance range between 6.9 ft and 11.5 ft.",
      },
    ],
    result:
      "The calculator recommends sitting between approximately 6.9 feet and 11.5 feet away from your 55-inch TV for optimal viewing comfort and image quality.",
  };

  const references = [
    {
      title: "SMPTE Recommended Viewing Distance",
      description:
        "Society of Motion Picture and Television Engineers guidelines on optimal viewing distances for home theaters.",
      url: "https://www.smpte.org/",
    },
    {
      title: "THX Viewing Distance Recommendations",
      description:
        "THX provides standards for home theater setups including recommended viewing distances based on screen size.",
      url: "https://www.thx.com/",
    },
    {
      title: "RTINGS.com TV Viewing Distance Guide",
      description:
        "Comprehensive guide on how to choose the right TV size and viewing distance for your room.",
      url: "https://www.rtings.com/tv/learn/viewing-distance",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tvSize">TV Size (Diagonal in inches)</Label>
          <Input
            id="tvSize"
            type="number"
            min={1}
            step={0.1}
            placeholder="e.g. 55"
            value={inputs.tvSize}
            onChange={(e) => handleInputChange("tvSize", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="viewingDistance">Viewing Distance</Label>
          <Input
            id="viewingDistance"
            type="number"
            min={0.1}
            step={0.1}
            placeholder={`e.g. 8 (${inputs.unit})`}
            value={inputs.viewingDistance}
            onChange={(e) => handleInputChange("viewingDistance", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Distance Unit</Label>
          <select
            id="unit"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
            value={inputs.unit}
            onChange={(e) => handleInputChange("unit", e.target.value)}
          >
            <option value="feet">Feet (ft)</option>
            <option value="meters">Meters (m)</option>
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
            {results.feedback && (
              <p className="mt-4 text-sm font-medium text-green-700 dark:text-green-400">{results.feedback}</p>
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
          <li>Enter your TV size (diagonal in inches) if known.</li>
          <li>Enter your current or planned viewing distance in feet or meters.</li>
          <li>Select the unit of measurement for viewing distance (feet or meters).</li>
          <li>
            Click the Calculate button to see recommended viewing distances or TV sizes based on your inputs.
          </li>
          <li>
            Review the results and feedback to optimize your home theater or viewing setup.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to TV Size & Viewing Distance Planner
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Choosing the right TV size and viewing distance is crucial for an optimal viewing experience,
            whether for professional video work or home entertainment. The diagonal size of your TV screen
            directly influences how far you should sit to enjoy clear images without eye strain or discomfort.
          </p>
          <p>
            Industry standards such as those from SMPTE and THX recommend sitting between 1.5 to 2.5 times the
            diagonal screen size away from the TV. Sitting too close can cause pixelation and fatigue, while
            sitting too far reduces immersion and detail perception.
          </p>
          <p>
            This calculator helps you find the ideal viewing distance for your TV size or the recommended TV size
            for your viewing distance. Simply input either your TV size or your viewing distance, select your
            preferred unit of measurement, and get a range of recommended values.
          </p>
          <p>
            Keep in mind that higher resolution TVs (like 4K) allow you to sit closer than lower resolution models
            without noticing pixels. Additionally, room layout, seating comfort, and personal preference also play
            important roles in your final setup.
          </p>
          <p>
            By following these guidelines, you can ensure a comfortable, immersive, and visually pleasing viewing
            experience whether you are watching movies, editing video, or broadcasting content.
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
            <strong>Warning:</strong> One common mistake is ignoring the unit of measurement for viewing distance.
            Always ensure you select the correct unit (feet or meters) to avoid incorrect recommendations.
          </p>
          <p>
            Another frequent error is sitting too close to a large TV, which can cause eye strain and reduce image
            quality perception. Conversely, sitting too far from a small TV diminishes immersion and detail.
          </p>
          <p>
            Some users assume that bigger TVs are always better regardless of room size or seating arrangement.
            This can lead to discomfort and poor viewing angles. Always consider your room layout and seating
            comfort alongside the recommended distances.
          </p>
          <p>
            Lastly, neglecting screen resolution can affect your experience. Higher resolution screens allow for
            closer viewing distances without pixelation, so adjust your setup accordingly.
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