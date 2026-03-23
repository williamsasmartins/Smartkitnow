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

const paintCoveragePerGallon = 350; // square feet per gallon, typical coverage for wall paint

const paintTypes = [
  { label: "Latex (Water-Based)", value: "latex", coverage: 350 },
  { label: "Oil-Based", value: "oil", coverage: 400 },
  { label: "Enamel", value: "enamel", coverage: 375 },
];

const surfaceTypes = [
  { label: "Drywall / Wall", value: "drywall", multiplier: 1 },
  { label: "Wood Trim / Molding", value: "wood", multiplier: 0.8 },
  { label: "Metal Surface", value: "metal", multiplier: 0.9 },
];

export default function HomePaintTouchUpCalculator() {
  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    height: "",
    numberOfSpots: "",
    averageSpotSize: "",
    paintType: "latex",
    surfaceType: "drywall",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate total touch-up area and paint needed
  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const height = parseFloat(inputs.height);
    const numberOfSpots = parseInt(inputs.numberOfSpots);
    const averageSpotSize = parseFloat(inputs.averageSpotSize);
    const paintTypeObj = paintTypes.find((p) => p.value === inputs.paintType);
    const surfaceTypeObj = surfaceTypes.find((s) => s.value === inputs.surfaceType);

    if (
      isNaN(length) || length <= 0 ||
      isNaN(width) || width <= 0 ||
      isNaN(height) || height <= 0 ||
      isNaN(numberOfSpots) || numberOfSpots < 0 ||
      isNaN(averageSpotSize) || averageSpotSize <= 0 ||
      !paintTypeObj || !surfaceTypeObj
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid positive numbers for all fields.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Total wall area (4 walls assumed rectangular room)
    const totalWallArea = 2 * height * (length + width);

    // Total touch-up area = number of spots * average spot size (in sq ft)
    const totalTouchUpArea = numberOfSpots * averageSpotSize;

    // Adjusted coverage based on paint type and surface
    const adjustedCoverage = paintTypeObj.coverage * surfaceTypeObj.multiplier;

    // Paint needed in gallons = total touch-up area / adjusted coverage
    // Add 10% extra for wastage and multiple coats
    const paintNeededGallonsRaw = totalTouchUpArea / adjustedCoverage;
    const paintNeededGallons = paintNeededGallonsRaw * 1.1;

    // Convert gallons to ounces (1 gallon = 128 ounces)
    const paintNeededOunces = paintNeededGallons * 128;

    // Format results
    const paintGallonsRounded = paintNeededGallons < 0.01 ? 0 : Math.max(0.01, parseFloat(paintNeededGallons.toFixed(3)));
    const paintOuncesRounded = paintNeededOunces < 1 ? 0 : Math.max(0, Math.ceil(paintNeededOunces));

    return {
      value: `${paintGallonsRounded} gallons (${paintOuncesRounded} ounces)`,
      label: "Estimated Paint Needed for Touch-Ups",
      subtext: `Based on ${totalTouchUpArea.toFixed(2)} sq ft of touch-up area using ${paintTypeObj.label} paint on ${surfaceTypeObj.label}.`,
      warning: totalTouchUpArea > totalWallArea * 0.1 ? "Warning: Touch-up area exceeds 10% of total wall area, consider full repaint." : null,
      formulaUsed: `Paint Needed (gallons) = (Number of Spots × Average Spot Size) ÷ (Coverage × Surface Multiplier) × 1.1 (wastage)`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is this paint touch-up estimator?",
      answer:
        "This estimator provides a close approximation based on average paint coverage rates and typical spot sizes. Actual paint usage may vary depending on surface texture, paint brand, and application method. Always consider buying a little extra paint to account for these variables.",
    },
    {
      question: "Can I use this calculator for outdoor surfaces?",
      answer:
        "While this calculator is primarily designed for interior surfaces, it can be used for outdoor touch-ups by selecting the appropriate surface type. Keep in mind that outdoor paints may have different coverage rates, so verify the paint specifications for best results.",
    },
    {
      question: "Why is there a 10% extra paint added in the calculation?",
      answer:
        "The 10% extra accounts for paint wastage, absorption by the surface, and multiple coats that may be necessary for proper coverage. This buffer helps ensure you have enough paint to complete your touch-up project without running short.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="length">Room Length (ft)</Label>
              <Input
                id="length"
                type="number"
                min={0}
                step="0.1"
                value={inputs.length}
                onChange={(e) => handleInputChange("length", e.target.value)}
                placeholder="e.g., 15"
              />
            </div>
            <div>
              <Label htmlFor="width">Room Width (ft)</Label>
              <Input
                id="width"
                type="number"
                min={0}
                step="0.1"
                value={inputs.width}
                onChange={(e) => handleInputChange("width", e.target.value)}
                placeholder="e.g., 12"
              />
            </div>
            <div>
              <Label htmlFor="height">Room Height (ft)</Label>
              <Input
                id="height"
                type="number"
                min={0}
                step="0.1"
                value={inputs.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                placeholder="e.g., 8"
              />
            </div>
            <div>
              <Label htmlFor="numberOfSpots">Number of Touch-Up Spots</Label>
              <Input
                id="numberOfSpots"
                type="number"
                min={0}
                step="1"
                value={inputs.numberOfSpots}
                onChange={(e) => handleInputChange("numberOfSpots", e.target.value)}
                placeholder="e.g., 10"
              />
            </div>
            <div>
              <Label htmlFor="averageSpotSize">Average Spot Size (sq ft)</Label>
              <Input
                id="averageSpotSize"
                type="number"
                min={0}
                step="0.01"
                value={inputs.averageSpotSize}
                onChange={(e) => handleInputChange("averageSpotSize", e.target.value)}
                placeholder="e.g., 0.5"
              />
            </div>
            <div>
              <Label htmlFor="paintType">Paint Type</Label>
              <Select
                value={inputs.paintType}
                onValueChange={(v) => handleInputChange("paintType", v)}
              >
                <SelectTrigger id="paintType" className="w-full">
                  <SelectValue placeholder="Select paint type" />
                </SelectTrigger>
                <SelectContent>
                  {paintTypes.map((pt) => (
                    <SelectItem key={pt.value} value={pt.value}>
                      {pt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="surfaceType">Surface Type</Label>
              <Select
                value={inputs.surfaceType}
                onValueChange={(v) => handleInputChange("surfaceType", v)}
              >
                <SelectTrigger id="surfaceType" className="w-full">
                  <SelectValue placeholder="Select surface type" />
                </SelectTrigger>
                <SelectContent>
                  {surfaceTypes.map((st) => (
                    <SelectItem key={st.value} value={st.value}>
                      {st.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              length: "",
              width: "",
              height: "",
              numberOfSpots: "",
              averageSpotSize: "",
              paintType: "latex",
              surfaceType: "drywall",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Home Paint Touch-Up Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Home Paint Touch-Up Estimator is a specialized calculator designed to help homeowners and professionals accurately estimate the amount of paint required for small repairs and touch-ups on interior surfaces. Unlike full-room painting calculators, this tool focuses on the cumulative area of minor spots such as scratches, chips, or small patches that need repainting. By considering factors such as the number of spots, their average size, paint type, and surface material, the estimator provides a precise paint quantity recommendation, minimizing waste and saving costs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This estimator accounts for typical paint coverage rates and adjusts for surface absorption and paint type differences. It also includes a buffer for wastage and multiple coats, ensuring you have enough paint to complete your touch-up project without unnecessary excess.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get an accurate estimate, you need to provide some basic information about your room and the touch-up areas. Start by entering the dimensions of the room to help contextualize the size of the touch-up spots relative to the total wall area. Then, input the number of spots that require touch-up and their average size in square feet. Select the type of paint you plan to use and the surface material to adjust coverage accordingly.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Step 1: Measure and enter the length, width, and height of the room to understand the total wall area.</li>
          <li>Step 2: Count the number of touch-up spots and estimate their average size in square feet.</li>
          <li>Step 3: Choose the paint type you will use (latex, oil-based, enamel) as coverage varies.</li>
          <li>Step 4: Select the surface type (drywall, wood trim, metal) to adjust for absorption and texture.</li>
          <li>Step 5: Click "Calculate" to see the estimated paint quantity needed for your touch-ups.</li>
          <li>Step 6: Use the result to purchase the appropriate amount of paint, considering the recommended buffer.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When performing paint touch-ups, preparation is key to achieving a seamless finish. Clean the surface thoroughly to remove dust, grease, or loose paint, and lightly sand the edges of the damaged area to ensure proper adhesion. Use a primer if the spot exposes bare material or stains to prevent bleeding through the new paint. Always apply paint in thin, even coats, allowing sufficient drying time between layers to avoid drips and uneven texture.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          For safety, ensure proper ventilation when using oil-based or enamel paints, as their fumes can be harmful. Wear protective gloves and masks to minimize skin contact and inhalation of volatile organic compounds (VOCs). Dispose of paint and cleaning materials responsibly according to local regulations to protect the environment.
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
              href="https://www.epa.gov/indoor-air-quality-iaq/volatile-organic-compounds-impact-indoor-air-quality"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              EPA - Volatile Organic Compounds' Impact on Indoor Air Quality <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Provides detailed information on paint-related VOCs and safety recommendations for indoor painting projects.
            </p>
          </li>
          <li>
            <a
              href="https://extension.oregonstate.edu/gardening/techniques/painting-preparation-and-techniques"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Oregon State University Extension - Painting Preparation and Techniques <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Offers expert guidance on surface preparation and painting best practices for home improvement projects.
            </p>
          </li>
          <li>
            <a
              href="https://www.energy.gov/energysaver/weatherize/painting-and-staining"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Energy.gov - Painting and Staining Tips for Energy Efficiency <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explains how paint types and application affect home energy efficiency and durability.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Home Paint Touch-Up Estimator"
      description="Estimate paint needed for touch-ups. Calculate exactly how much paint covers scratches and small repairs on walls and trim."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Paint Needed (gallons) = (Number of Spots × Average Spot Size) ÷ (Coverage × Surface Multiplier) × 1.1 (wastage buffer)",
        variables: [
          { variable: "Number of Spots", description: "Total count of touch-up areas" },
          { variable: "Average Spot Size", description: "Average size of each spot in square feet" },
          { variable: "Coverage", description: "Paint coverage in square feet per gallon (varies by paint type)" },
          { variable: "Surface Multiplier", description: "Adjustment factor based on surface type" },
          { variable: "1.1", description: "10% extra paint added for wastage and multiple coats" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a living room measuring 15 ft by 12 ft with 8 ft ceilings. There are 12 scratches on the drywall walls, each averaging 0.4 square feet. You plan to use latex paint on drywall surfaces.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate total touch-up area: 12 spots × 0.4 sq ft = 4.8 sq ft.",
          },
          {
            label: "Step 2",
            explanation:
              "Use latex paint coverage of 350 sq ft/gallon and surface multiplier of 1 for drywall.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate paint needed: (4.8 ÷ (350 × 1)) × 1.1 = 0.015 gallons (~1.92 ounces).",
          },
          {
            label: "Step 4",
            explanation:
              "Purchase a small sample or quart container as this amount is minimal, ensuring enough paint for multiple coats.",
          },
        ],
        result: "Estimated paint needed is approximately 0.015 gallons or about 2 ounces.",
      }}
      relatedCalculators={[
        { title: "Grass Seed Quantity Calculator", url: "/everyday/grass-seed-quantity", icon: "💡" },
        { title: "Party Food & Drinks Planner", url: "/everyday/party-food-drinks-planner", icon: "🎉" },
        { title: "Fertilizer Application Calculator", url: "/everyday/fertilizer-application-calculator", icon: "💡" },
        { title: "Propane Tank Burn Time Estimator", url: "/everyday/propane-tank-burn-time", icon: "💡" },
        { title: "Body Mass Index (BMI) Calculator", url: "/everyday/bmi-calculator", icon: "❤️" },
        { title: "Caffeine Max per Day Calculator", url: "/everyday/caffeine-max-per-day", icon: "💡" },
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