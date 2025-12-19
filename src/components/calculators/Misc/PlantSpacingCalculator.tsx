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

export default function PlantSpacingCalculator() {
  const [inputs, setInputs] = useState({
    plantType: "",
    plantWidth: "",
    plantLength: "",
    rowSpacing: "",
    gardenWidth: "",
    gardenLength: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Calculation logic:
   * - User inputs plant width and length (in inches or cm).
   * - User inputs row spacing (distance between rows).
   * - User inputs garden bed dimensions.
   * 
   * The calculator computes:
   * - Number of plants per row = floor(gardenWidth / plantWidth)
   * - Number of rows = floor(gardenLength / rowSpacing)
   * - Total plants = plants per row * number of rows
   * 
   * This method ensures plants have enough space to grow without overcrowding,
   * optimizing yield and plant health.
   */

  const results = useMemo(() => {
    const plantWidthNum = parseFloat(inputs.plantWidth);
    const plantLengthNum = parseFloat(inputs.plantLength);
    const rowSpacingNum = parseFloat(inputs.rowSpacing);
    const gardenWidthNum = parseFloat(inputs.gardenWidth);
    const gardenLengthNum = parseFloat(inputs.gardenLength);

    if (
      !plantWidthNum || plantWidthNum <= 0 ||
      !rowSpacingNum || rowSpacingNum <= 0 ||
      !gardenWidthNum || gardenWidthNum <= 0 ||
      !gardenLengthNum || gardenLengthNum <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: "Please enter valid positive numbers for all required fields.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Calculate plants per row and number of rows
    const plantsPerRow = Math.floor(gardenWidthNum / plantWidthNum);
    const numberOfRows = Math.floor(gardenLengthNum / rowSpacingNum);
    const totalPlants = plantsPerRow * numberOfRows;

    let warning = null;
    if (plantsPerRow === 0 || numberOfRows === 0) {
      warning = "Your garden dimensions are too small for the given plant spacing.";
    }

    const formulaUsed = `Total Plants = floor(Garden Width ÷ Plant Width) × floor(Garden Length ÷ Row Spacing)
    = floor(${gardenWidthNum} ÷ ${plantWidthNum}) × floor(${gardenLengthNum} ÷ ${rowSpacingNum})
    = ${plantsPerRow} × ${numberOfRows} = ${totalPlants}`;

    return {
      value: totalPlants.toLocaleString(),
      label: "Estimated Number of Plants",
      subtext: "Based on your garden and plant spacing inputs.",
      warning,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is proper plant spacing important?",
      answer:
        "Proper plant spacing ensures each plant has enough room to grow, access sunlight, and receive nutrients without competing with neighbors. Overcrowding can lead to poor air circulation, increased disease risk, and reduced yields. Adequate spacing promotes healthier plants and maximizes garden productivity.",
    },
    {
      question: "Can I use this calculator for any type of plant?",
      answer:
        "Yes, this calculator is designed to be flexible for various plant types. Simply input the mature width of your plant and the recommended row spacing. For best results, refer to specific spacing guidelines for your plant species, which can vary significantly between vegetables, flowers, and shrubs.",
    },
    {
      question: "What units should I use for measurements?",
      answer:
        "You can use either inches or centimeters, but be consistent across all inputs. The calculator assumes all inputs are in the same unit system. If you prefer metric units, ensure you convert garden dimensions and plant spacing accordingly before entering.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plantType" className="mb-1 flex items-center gap-1">
                <Leaf className="w-4 h-4 text-green-600" /> Plant Type (optional)
              </Label>
              <Input
                id="plantType"
                placeholder="e.g., Tomato, Lettuce"
                value={inputs.plantType}
                onChange={e => handleInputChange("plantType", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="plantWidth" className="mb-1 flex items-center gap-1">
                <Scale className="w-4 h-4 text-blue-600" /> Plant Width (inches or cm)
              </Label>
              <Input
                id="plantWidth"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 18"
                value={inputs.plantWidth}
                onChange={e => handleInputChange("plantWidth", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="plantLength" className="mb-1 flex items-center gap-1">
                <Scale className="w-4 h-4 text-blue-600" /> Plant Length (optional)
              </Label>
              <Input
                id="plantLength"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 18"
                value={inputs.plantLength}
                onChange={e => handleInputChange("plantLength", e.target.value)}
              />
              <p className="text-sm text-slate-500 mt-1">
                Use if your plant is longer than wide; otherwise, width is sufficient.
              </p>
            </div>

            <div>
              <Label htmlFor="rowSpacing" className="mb-1 flex items-center gap-1">
                <Wrench className="w-4 h-4 text-purple-600" /> Row Spacing (inches or cm)
              </Label>
              <Input
                id="rowSpacing"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 24"
                value={inputs.rowSpacing}
                onChange={e => handleInputChange("rowSpacing", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="gardenWidth" className="mb-1 flex items-center gap-1">
                <Home className="w-4 h-4 text-indigo-600" /> Garden Width (same units)
              </Label>
              <Input
                id="gardenWidth"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 96"
                value={inputs.gardenWidth}
                onChange={e => handleInputChange("gardenWidth", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="gardenLength" className="mb-1 flex items-center gap-1">
                <Home className="w-4 h-4 text-indigo-600" /> Garden Length (same units)
              </Label>
              <Input
                id="gardenLength"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 120"
                value={inputs.gardenLength}
                onChange={e => handleInputChange("gardenLength", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              plantType: "",
              plantWidth: "",
              plantLength: "",
              rowSpacing: "",
              gardenWidth: "",
              gardenLength: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <details className="mt-4 text-left text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
              <summary className="font-medium">View Calculation Details</summary>
              <pre className="whitespace-pre-wrap mt-2">{results.formulaUsed}</pre>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Plant Spacing Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Plant spacing is a critical factor in successful gardening and agriculture. It refers to the distance maintained between individual plants and between rows of plants to ensure optimal growth conditions. Proper spacing allows plants to access sufficient sunlight, nutrients, and water while minimizing competition and reducing the risk of diseases caused by overcrowding. This calculator helps gardeners and farmers determine the ideal number of plants that can fit into a given garden area based on the plant's mature size and recommended spacing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By inputting your garden dimensions and plant spacing requirements, you can optimize your planting layout to maximize yield and maintain plant health. This tool is versatile for various plant types, including vegetables, herbs, flowers, and shrubs, making it an essential resource for both hobbyists and professionals.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, you need to provide accurate measurements of your garden bed and the recommended spacing for your plants. The spacing values typically come from seed packets, gardening guides, or agricultural extension services. Ensure all measurements are in the same unit system (either inches or centimeters) for consistency. The calculator will then estimate how many plants you can fit in your garden without overcrowding.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the type of plant you intend to grow (optional but helpful for your records).
          </li>
          <li>
            <strong>Step 2:</strong> Input the mature width of the plant. If your plant is longer than it is wide, also input the length; otherwise, width alone is sufficient.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the recommended row spacing, which is the distance between rows of plants.
          </li>
          <li>
            <strong>Step 4:</strong> Provide your garden bed’s width and length.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to see the estimated number of plants your garden can accommodate.
          </li>
          <li>
            <strong>Step 6:</strong> Review the calculation details and adjust inputs if necessary to optimize your layout.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When planning your garden layout, always consider the mature size of your plants rather than their seedling size. Overcrowding can stunt growth and increase susceptibility to pests and diseases. Additionally, consider companion planting principles to enhance growth and reduce pest problems. Ensure your garden bed has adequate drainage and sunlight exposure to complement your spacing strategy. Finally, regularly monitor plant health and adjust spacing in future plantings based on observed growth patterns and environmental conditions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Safety tip: When measuring and working in your garden, use appropriate tools and protective gear to avoid injury. Follow local guidelines for pesticide or fertilizer use if applicable, and always wash hands after gardening activities.
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
              href="https://extension.psu.edu/plant-spacing-and-plant-population"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Penn State Extension: Plant Spacing and Plant Population <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guidelines on plant spacing and population to optimize crop yields and health.
            </p>
          </li>
          <li>
            <a
              href="https://www.almanac.com/plant-spacing"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              The Old Farmer's Almanac: Plant Spacing Guide <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical advice on how to space vegetables and flowers for a thriving garden.
            </p>
          </li>
          <li>
            <a
              href="https://www.uaex.uada.edu/farm-ranch/crops-commercial-horticulture/horticulture/home-gardening/plant-spacing.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              University of Arkansas Extension: Plant Spacing <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Extension service resource detailing plant spacing recommendations for home gardeners.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Plant Spacing Calculator"
      description="Optimize your garden layout. Calculate the ideal spacing between plants to maximize yield and prevent overcrowding."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Total Plants = floor(Garden Width ÷ Plant Width) × floor(Garden Length ÷ Row Spacing)",
        variables: [
          { symbol: "Garden Width", description: "Width of your garden bed" },
          { symbol: "Plant Width", description: "Mature width of the plant" },
          { symbol: "Garden Length", description: "Length of your garden bed" },
          { symbol: "Row Spacing", description: "Distance between rows of plants" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a garden bed 8 feet wide and 10 feet long. You want to plant tomatoes that require 18 inches spacing between plants and 24 inches between rows.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert all measurements to the same unit (inches): 8 feet = 96 inches, 10 feet = 120 inches.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate plants per row: floor(96 ÷ 18) = floor(5.33) = 5 plants per row.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate number of rows: floor(120 ÷ 24) = floor(5) = 5 rows.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate total plants: 5 plants/row × 5 rows = 25 plants.",
          },
        ],
        result: "You can plant approximately 25 tomato plants in your garden bed with proper spacing.",
      }}
      relatedCalculators={[
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday-life/cleaning-dilution-ratio", icon: "🏠" },
        { title: "Laundry Detergent Dosage by Load Size", url: "/everyday-life/laundry-detergent-dosage", icon: "💡" },
        { title: "Home Paint Touch-Up Estimator", url: "/everyday-life/home-paint-touch-up", icon: "🏠" },
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday-life/leftovers-cooling-reheat-time", icon: "💡" },
        { title: "Steps → Distance Converter", url: "/everyday-life/steps-to-distance-converter", icon: "💡" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday-life/hydration-reminder-interval", icon: "💡" },
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