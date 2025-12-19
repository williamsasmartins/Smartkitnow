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

export default function MulchCoverageBagCountCalculator() {
  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    depth: "",
    bagSize: "2",
    unitLength: "feet",
    unitWidth: "feet",
    unitDepth: "inches",
    unitBagSize: "cubicFeet",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Calculation Logic:
   * 1. Convert length and width to feet if needed.
   * 2. Convert depth to feet (since mulch depth is often in inches).
   * 3. Calculate volume in cubic feet: length * width * depth (in feet).
   * 4. Convert volume to cubic yards (1 cubic yard = 27 cubic feet).
   * 5. Calculate number of bags needed based on bag size in cubic feet.
   */

  const results = useMemo(() => {
    const {
      length,
      width,
      depth,
      bagSize,
      unitLength,
      unitWidth,
      unitDepth,
      unitBagSize,
    } = inputs;

    // Validate inputs
    if (
      !length ||
      !width ||
      !depth ||
      Number(length) <= 0 ||
      Number(width) <= 0 ||
      Number(depth) <= 0 ||
      Number(bagSize) <= 0
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter positive numeric values for all fields.",
        formulaUsed: null,
      };
    }

    // Convert length to feet
    let lengthInFeet = Number(length);
    if (unitLength === "meters") {
      lengthInFeet = Number(length) * 3.28084;
    }

    // Convert width to feet
    let widthInFeet = Number(width);
    if (unitWidth === "meters") {
      widthInFeet = Number(width) * 3.28084;
    }

    // Convert depth to feet
    let depthInFeet = Number(depth);
    if (unitDepth === "inches") {
      depthInFeet = Number(depth) / 12;
    } else if (unitDepth === "cm") {
      depthInFeet = Number(depth) * 0.0328084;
    }

    // Calculate volume in cubic feet
    const volumeCubicFeet = lengthInFeet * widthInFeet * depthInFeet;

    // Convert volume to cubic yards
    const volumeCubicYards = volumeCubicFeet / 27;

    // Convert bag size to cubic feet if needed
    let bagSizeCubicFeet = Number(bagSize);
    if (unitBagSize === "cubicYards") {
      bagSizeCubicFeet = Number(bagSize) * 27;
    }

    // Calculate bags needed (round up)
    const bagsNeeded = Math.ceil(volumeCubicFeet / bagSizeCubicFeet);

    return {
      value: `${bagsNeeded} bag${bagsNeeded > 1 ? "s" : ""}`,
      label: "Estimated Mulch Bags Needed",
      subtext: `Based on a coverage volume of ${volumeCubicYards.toFixed(
        2
      )} cubic yards (${volumeCubicFeet.toFixed(2)} cubic feet).`,
      warning: null,
      formulaUsed:
        "Volume (ft³) = Length (ft) × Width (ft) × Depth (ft); Bags = Volume ÷ Bag Size (ft³)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the ideal depth for mulch coverage?",
      answer:
        "The ideal mulch depth typically ranges between 2 to 4 inches. This depth helps retain soil moisture, suppress weeds, and regulate soil temperature without suffocating plant roots. Applying mulch too thickly can cause issues such as mold growth or root rot.",
    },
    {
      question: "How do I convert mulch volume to bags?",
      answer:
        "Mulch bags are usually sold by volume, commonly in cubic feet or cubic yards. To convert volume to bags, divide the total mulch volume needed by the volume per bag. Always round up to ensure you have enough mulch to cover your area adequately.",
    },
    {
      question: "Can I use this calculator for irregularly shaped garden beds?",
      answer:
        "For irregular shapes, approximate the area by dividing the bed into simpler shapes (rectangles, circles, triangles), calculate each area separately, and sum them. Then input the total area into the calculator for an accurate mulch estimate.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="length" className="flex items-center gap-1">
                <Leaf className="w-4 h-4 text-green-600" /> Length
              </Label>
              <div className="flex gap-2">
                <Input
                  id="length"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g., 10"
                  value={inputs.length}
                  onChange={(e) => handleInputChange("length", e.target.value)}
                />
                <Select
                  value={inputs.unitLength}
                  onValueChange={(v) => handleInputChange("unitLength", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feet">Feet</SelectItem>
                    <SelectItem value="meters">Meters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="width" className="flex items-center gap-1">
                <Leaf className="w-4 h-4 text-green-600" /> Width
              </Label>
              <div className="flex gap-2">
                <Input
                  id="width"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g., 5"
                  value={inputs.width}
                  onChange={(e) => handleInputChange("width", e.target.value)}
                />
                <Select
                  value={inputs.unitWidth}
                  onValueChange={(v) => handleInputChange("unitWidth", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feet">Feet</SelectItem>
                    <SelectItem value="meters">Meters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="depth" className="flex items-center gap-1">
                <Leaf className="w-4 h-4 text-green-600" /> Depth
              </Label>
              <div className="flex gap-2">
                <Input
                  id="depth"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g., 3"
                  value={inputs.depth}
                  onChange={(e) => handleInputChange("depth", e.target.value)}
                />
                <Select
                  value={inputs.unitDepth}
                  onValueChange={(v) => handleInputChange("unitDepth", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inches">Inches</SelectItem>
                    <SelectItem value="feet">Feet</SelectItem>
                    <SelectItem value="cm">Centimeters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="bagSize" className="flex items-center gap-1">
                <Leaf className="w-4 h-4 text-green-600" /> Bag Size
              </Label>
              <div className="flex gap-2">
                <Input
                  id="bagSize"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g., 2"
                  value={inputs.bagSize}
                  onChange={(e) => handleInputChange("bagSize", e.target.value)}
                />
                <Select
                  value={inputs.unitBagSize}
                  onValueChange={(v) => handleInputChange("unitBagSize", v)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cubicFeet">Cubic Feet</SelectItem>
                    <SelectItem value="cubicYards">Cubic Yards</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              depth: "",
              bagSize: "2",
              unitLength: "feet",
              unitWidth: "feet",
              unitDepth: "inches",
              unitBagSize: "cubicFeet",
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
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              {results.subtext}
            </p>
            {results.warning && (
              <p className="mt-3 text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> {results.warning}
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
          Understanding Mulch Coverage & Bag Count Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Mulch is a vital component in sustainable gardening and landscaping,
          serving multiple functions such as moisture retention, weed
          suppression, and soil temperature regulation. Calculating the correct
          amount of mulch needed for your garden beds ensures efficient use of
          resources, prevents waste, and maintains the health of your plants.
          This calculator estimates both the volume of mulch required and the
          number of bags you need to purchase based on your garden bed
          dimensions and preferred mulch depth. By inputting your bed’s length,
          width, and desired mulch depth, along with the size of the mulch bags
          you plan to buy, you can obtain an accurate estimate tailored to your
          project.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get the most accurate results, carefully measure your garden bed’s
          length and width using a tape measure or measuring wheel. Decide on
          the depth of mulch you want to apply, typically between 2 to 4 inches,
          depending on your landscaping goals. Select the units you prefer for
          each measurement to ensure consistency. Finally, input the size of the
          mulch bags you intend to purchase, which is usually indicated on the
          packaging in cubic feet or cubic yards.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure the length and width of your garden
            bed in feet or meters.
          </li>
          <li>
            <strong>Step 2:</strong> Choose the mulch depth in inches, feet, or
            centimeters.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the size of the mulch bags you plan to
            buy, selecting cubic feet or cubic yards.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to see the estimated bags
            needed and volume coverage.
          </li>
          <li>
            <strong>Step 5:</strong> Round up your purchase to ensure full
            coverage and account for settling.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Professional Tips & Safety
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When applying mulch, always wear gloves and a dust mask to protect
          yourself from allergens and dust particles. Avoid piling mulch directly
          against tree trunks or plant stems to prevent rot and pest infestations.
          For best results, water the mulch after application to help it settle
          and start retaining moisture. Remember that mulch decomposes over time,
          so plan to replenish it annually or as needed. Using this calculator
          helps you buy the right amount, reducing waste and environmental impact.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* NEW RICH REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For further reading and verification, please refer to these authoritative
          sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://extension.umn.edu/planting-and-growing-guides/mulching"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              University of Minnesota Extension: Mulching <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guide on mulch types, benefits, application depths,
              and best practices for sustainable gardening.
            </p>
          </li>
          <li>
            <a
              href="https://www.epa.gov/soakuptherain/soak-rain-mulch"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              EPA Soak Up The Rain: Mulch <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official environmental guidelines on using mulch to reduce stormwater
              runoff and improve soil health.
            </p>
          </li>
          <li>
            <a
              href="https://www.energy.gov/energysaver/water-mulching"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Energy.gov: Water Conservation with Mulching <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Insights on how mulch conserves water in landscaping, reducing irrigation
              needs and energy consumption.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Mulch Coverage & Bag Count Calculator"
      description="Calculate mulch coverage and bags needed. Determine the cubic yards or bags of mulch required for your garden beds."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Volume (ft³) = Length (ft) × Width (ft) × Depth (ft); Bags Needed = Volume ÷ Bag Size (ft³)",
        variables: [
          { name: "Length", description: "Length of the garden bed" },
          { name: "Width", description: "Width of the garden bed" },
          { name: "Depth", description: "Desired mulch depth" },
          { name: "Bag Size", description: "Volume of mulch per bag" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a rectangular garden bed measuring 12 feet long by 6 feet wide, and you want to apply mulch at a depth of 3 inches. The mulch bags you plan to buy contain 2 cubic feet each.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert the depth from inches to feet: 3 inches ÷ 12 = 0.25 feet.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate the volume in cubic feet: 12 ft × 6 ft × 0.25 ft = 18 cubic feet.",
          },
          {
            label: "Step 3",
            explanation:
              "Determine the number of bags needed: 18 cubic feet ÷ 2 cubic feet per bag = 9 bags.",
          },
          {
            label: "Step 4",
            explanation:
              "Purchase 9 bags of mulch to cover your garden bed at the desired depth.",
          },
        ],
        result: "You will need approximately 9 bags of mulch to cover your garden bed.",
      }}
      relatedCalculators={[
        {
          title: "Screen Time Budget / Pomodoro Planner",
          url: "/everyday-life/screen-time-pomodoro-planner",
          icon: "💡",
        },
        {
          title: "Coffee Urn Yield & Strength Calculator",
          url: "/everyday-life/coffee-urn-yield-strength",
          icon: "💡",
        },
        {
          title: "Cleaning Dilution Ratio Calculator",
          url: "/everyday-life/cleaning-dilution-ratio",
          icon: "🏠",
        },
        {
          title: "Rainwater Barrel Days of Supply",
          url: "/everyday-life/rainwater-barrel-days-supply",
          icon: "💧",
        },
        {
          title: "Laundry Detergent Dosage by Load Size",
          url: "/everyday-life/laundry-detergent-dosage",
          icon: "💡",
        },
        {
          title: "Basal Metabolic Rate (BMR) Calculator",
          url: "/everyday-life/bmr-calculator",
          icon: "💡",
        },
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