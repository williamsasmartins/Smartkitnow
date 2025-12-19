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

export default function GardenSoilCompostVolumeCalculator() {
  /**
   * Inputs:
   * - length (ft)
   * - width (ft)
   * - depth (inches)
   * - material type (soil, compost, mix)
   * 
   * Output:
   * - volume in cubic feet and cubic yards
   * - weight estimate (optional, based on material density)
   */

  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    depth: "",
    material: "soil",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points for numeric inputs
    if (["length", "width", "depth"].includes(name)) {
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setInputs((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  /**
   * Material densities (approximate, in lbs per cubic foot):
   * - Topsoil: 75 lbs/ft³
   * - Compost: 40 lbs/ft³
   * - Mix (50/50): 57.5 lbs/ft³
   * 
   * Volume formula:
   * Volume (ft³) = length (ft) * width (ft) * depth (ft)
   * Depth input is in inches, convert to feet by dividing by 12.
   * 
   * Convert cubic feet to cubic yards:
   * 1 cubic yard = 27 cubic feet
   */

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depthInches = parseFloat(inputs.depth);
    const material = inputs.material;

    if (
      isNaN(length) ||
      length <= 0 ||
      isNaN(width) ||
      width <= 0 ||
      isNaN(depthInches) ||
      depthInches <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers for all dimensions.",
        formulaUsed: "",
      };
    }

    const depthFeet = depthInches / 12;
    const volumeCubicFeet = length * width * depthFeet;
    const volumeCubicYards = volumeCubicFeet / 27;

    // Material densities in lbs/ft³
    const densities = {
      soil: 75,
      compost: 40,
      mix: 57.5,
    };

    const density = densities[material] || densities.soil;
    const weightLbs = volumeCubicFeet * density;

    return {
      value: `${volumeCubicFeet.toFixed(2)} ft³ (${volumeCubicYards.toFixed(2)} yd³)`,
      label: `Estimated Volume of ${material === "soil" ? "Topsoil" : material === "compost" ? "Compost" : "Soil/Compost Mix"}`,
      subtext: `Approximate weight: ${weightLbs.toFixed(0)} lbs`,
      warning: null,
      formulaUsed:
        "Volume (ft³) = Length (ft) × Width (ft) × Depth (ft); Depth (ft) = Depth (in) ÷ 12",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is it important to calculate soil or compost volume accurately?",
      answer:
        "Accurately calculating soil or compost volume ensures you purchase the right amount of material, preventing waste and saving money. Overestimating leads to excess material that may degrade if unused, while underestimating can delay your project and increase costs due to multiple purchases.",
    },
    {
      question: "Can I use this calculator for raised garden beds of irregular shapes?",
      answer:
        "This calculator assumes rectangular or square beds. For irregular shapes, you can approximate by dividing the area into rectangles or use specialized calculators for circles or polygons. Accurate measurements are key for precise volume estimation.",
    },
    {
      question: "How does soil compaction affect volume calculations?",
      answer:
        "Soil and compost can compact over time, reducing their volume. This calculator estimates loose volume. If compacting is expected, consider ordering slightly more material or consulting with a soil expert to adjust quantities accordingly.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="length" className="mb-1 flex items-center gap-1">
              Length (feet) <Scale className="w-4 h-4 text-green-600" />
            </Label>
            <Input
              id="length"
              type="text"
              placeholder="e.g., 10"
              value={inputs.length}
              onChange={(e) => handleInputChange("length", e.target.value)}
              aria-describedby="length-desc"
            />
            <p id="length-desc" className="text-xs text-slate-500 mt-1">
              Enter the length of your garden bed in feet.
            </p>
          </div>

          <div>
            <Label htmlFor="width" className="mb-1 flex items-center gap-1">
              Width (feet) <Scale className="w-4 h-4 text-green-600" />
            </Label>
            <Input
              id="width"
              type="text"
              placeholder="e.g., 4"
              value={inputs.width}
              onChange={(e) => handleInputChange("width", e.target.value)}
              aria-describedby="width-desc"
            />
            <p id="width-desc" className="text-xs text-slate-500 mt-1">
              Enter the width of your garden bed in feet.
            </p>
          </div>

          <div>
            <Label htmlFor="depth" className="mb-1 flex items-center gap-1">
              Depth (inches) <Scale className="w-4 h-4 text-green-600" />
            </Label>
            <Input
              id="depth"
              type="text"
              placeholder="e.g., 6"
              value={inputs.depth}
              onChange={(e) => handleInputChange("depth", e.target.value)}
              aria-describedby="depth-desc"
            />
            <p id="depth-desc" className="text-xs text-slate-500 mt-1">
              Enter the desired depth of soil or compost in inches.
            </p>
          </div>

          <div>
            <Label htmlFor="material" className="mb-1 flex items-center gap-1">
              Material Type <Leaf className="w-4 h-4 text-green-600" />
            </Label>
            <Select
              value={inputs.material}
              onValueChange={(v) => handleInputChange("material", v)}
              id="material"
              aria-describedby="material-desc"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soil">Topsoil</SelectItem>
                <SelectItem value="compost">Compost</SelectItem>
                <SelectItem value="mix">50/50 Soil & Compost Mix</SelectItem>
              </SelectContent>
            </Select>
            <p id="material-desc" className="text-xs text-slate-500 mt-1">
              Choose the type of material you plan to use.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate volume"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ length: "", width: "", depth: "", material: "soil" })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-red-50 border-red-300 text-red-700">
          <CardContent className="p-4 text-center font-semibold">
            <AlertTriangle className="inline-block mr-2 w-5 h-5 align-text-bottom" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              {results.subtext}
            </p>
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">
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
          Understanding Garden Soil/Compost Volume Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calculating the volume of soil or compost needed for your garden beds is a
          fundamental step in successful gardening and landscaping projects. This
          calculator helps you determine the exact amount of material required to fill
          raised beds, planters, or garden plots based on your specified dimensions.
          By inputting the length, width, and depth of your garden bed, you receive an
          accurate volume estimate in both cubic feet and cubic yards, along with an
          approximate weight based on the material type. This precision prevents
          overbuying or underbuying, saving you money and reducing waste.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding the volume also aids in planning for transportation and
          storage logistics, especially when dealing with bulk materials like topsoil
          or compost. Additionally, knowing the weight helps ensure safe handling and
          application. This calculator incorporates standard densities for common
          garden materials to provide a comprehensive estimate tailored to your needs.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed for gardeners of all
          experience levels. Begin by measuring your garden bed's length and width in
          feet, then determine the desired depth of soil or compost in inches. Select
          the type of material you plan to use—topsoil, compost, or a mix of both.
          After entering these details, click the calculate button to receive your
          volume estimate.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure the length of your garden bed in feet,
            ensuring accuracy by using a tape measure.
          </li>
          <li>
            <strong>Step 2:</strong> Measure the width of your garden bed in feet.
          </li>
          <li>
            <strong>Step 3:</strong> Decide on the depth of soil or compost you want
            to apply, and enter this measurement in inches.
          </li>
          <li>
            <strong>Step 4:</strong> Select the material type from the dropdown menu.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view the volume and weight
            estimates.
          </li>
          <li>
            <strong>Step 6:</strong> Use the results to purchase the correct amount
            of material, avoiding excess or shortage.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Professional Tips & Safety
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When working with soil and compost, it is essential to consider both quality
          and safety. Always source your materials from reputable suppliers to ensure
          they are free from contaminants such as heavy metals, pathogens, or weed
          seeds. Wearing gloves and a dust mask during handling can protect you from
          potential allergens or irritants commonly found in organic materials.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, consider the moisture content of your soil or compost, as wet
          materials are heavier and may affect transportation and application. If you
          plan to mix soil and compost, blend them thoroughly to achieve uniform
          texture and nutrient distribution. Finally, store unused materials in a dry,
          covered area to maintain quality and prevent nutrient loss.
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
              href="https://extension.umn.edu/soil-management/estimating-soil-volume-and-weight"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              University of Minnesota Extension: Estimating Soil Volume and Weight{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guide on calculating soil volume and weight for gardening
              projects, including practical examples and formulas.
            </p>
          </li>
          <li>
            <a
              href="https://www.nrcs.usda.gov/wps/portal/nrcs/detail/soils/edu/?cid=nrcs142p2_054273"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USDA Natural Resources Conservation Service: Soil Quality and Volume{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official resource on soil properties, including density and volume
              considerations for agricultural and gardening applications.
            </p>
          </li>
          <li>
            <a
              href="https://www.epa.gov/soils/soil-quality"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              EPA: Soil Quality and Composting Basics{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Environmental Protection Agency's guidelines on soil quality, composting,
              and best practices for sustainable gardening.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Garden Soil/Compost Volume Calculator"
      description="Calculate soil volume for raised beds. Find out exactly how much topsoil or compost you need to fill your garden planters."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Volume (ft³) = Length (ft) × Width (ft) × Depth (ft); Depth (ft) = Depth (in) ÷ 12",
        variables: [
          { symbol: "Length", description: "Length of the garden bed in feet" },
          { symbol: "Width", description: "Width of the garden bed in feet" },
          {
            symbol: "Depth",
            description: "Depth of soil or compost in feet (converted from inches)",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a raised garden bed that measures 8 feet long, 3 feet wide, and you want to fill it with 6 inches of compost.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert depth from inches to feet: 6 inches ÷ 12 = 0.5 feet.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate volume in cubic feet: 8 ft × 3 ft × 0.5 ft = 12 cubic feet.",
          },
          {
            label: "Step 3",
            explanation:
              "Convert cubic feet to cubic yards: 12 ÷ 27 ≈ 0.44 cubic yards.",
          },
          {
            label: "Step 4",
            explanation:
              "Estimate weight using compost density (40 lbs/ft³): 12 × 40 = 480 lbs.",
          },
        ],
        result:
          "You will need approximately 12 cubic feet (0.44 cubic yards) of compost weighing about 480 pounds to fill your garden bed.",
      }}
      relatedCalculators={[
        {
          title: "Wine/Beer/Soft Drink Mix Estimator",
          url: "/everyday-life/beverage-mix-estimator",
          icon: "🎉",
        },
        {
          title: "Light Bulb Cost per Year Calculator",
          url: "/everyday-life/light-bulb-cost-per-year",
          icon: "🏠",
        },
        {
          title: "Rainwater Barrel Days of Supply",
          url: "/everyday-life/rainwater-barrel-days-supply",
          icon: "💧",
        },
        {
          title: "Cleaning Dilution Ratio Calculator",
          url: "/everyday-life/cleaning-dilution-ratio",
          icon: "🏠",
        },
        {
          title: "Basal Metabolic Rate (BMR) Calculator",
          url: "/everyday-life/bmr-calculator",
          icon: "💡",
        },
        {
          title: "Planting Calendar & Frost Date Finder",
          url: "/everyday-life/planting-calendar-frost-date",
          icon: "🌿",
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