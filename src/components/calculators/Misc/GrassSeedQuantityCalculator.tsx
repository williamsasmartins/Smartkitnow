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

export default function GrassSeedQuantityCalculator() {
  /**
   * Inputs:
   * - area: numeric, in square feet or square meters
   * - unit: "sqft" or "sqm"
   * - seedType: type of grass seed (affects seeding rate)
   * - seedingRateUnit: "lbs per 1000 sqft" or "kg per 100 sqm"
   */

  const [inputs, setInputs] = useState({
    area: "",
    unit: "sqft",
    seedType: "cool-season",
    seedingRateUnit: "lbsPer1000sqft",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Seeding rates vary by grass type and purpose (new lawn vs overseeding).
  // Typical seeding rates (approximate):
  // Cool-season grasses: 4-6 lbs per 1000 sqft for new lawns, 2-3 lbs for overseeding.
  // Warm-season grasses: 1-3 lbs per 1000 sqft for new lawns, 0.5-1.5 lbs for overseeding.
  // For simplicity, we'll use average values for new lawns.
  // Conversion: 1 lb ≈ 0.4536 kg, 1000 sqft ≈ 92.903 sqm.

  // We'll provide options for seed type:
  // - Cool-season (Kentucky bluegrass, fescue, ryegrass)
  // - Warm-season (Bermuda, zoysia, centipede)
  // - Overseeding (general)

  // Seeding rates in lbs per 1000 sqft:
  const seedingRatesLbsPer1000Sqft = {
    "cool-season": 5, // average new lawn
    "warm-season": 2, // average new lawn
    overseeding: 2.5, // average overseeding
  };

  // Conversion helpers
  const sqftToSqm = (sqft) => sqft * 0.092903;
  const sqmToSqft = (sqm) => sqm / 0.092903;
  const lbsToKg = (lbs) => lbs * 0.453592;
  const kgToLbs = (kg) => kg / 0.453592;

  const results = useMemo(() => {
    const areaNum = parseFloat(inputs.area);
    if (!areaNum || areaNum <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive area.",
        formulaUsed: "",
      };
    }

    // Determine seeding rate in lbs per 1000 sqft
    const seedType = inputs.seedType || "cool-season";
    const seedingRateLbs = seedingRatesLbsPer1000Sqft[seedType] || 5;

    // Convert area to sqft if needed
    const areaSqft = inputs.unit === "sqm" ? sqmToSqft(areaNum) : areaNum;

    // Calculate total seed needed in lbs
    // Formula: (area in sqft / 1000) * seeding rate (lbs per 1000 sqft)
    const seedNeededLbs = (areaSqft / 1000) * seedingRateLbs;

    // Provide results in lbs and kg
    const seedNeededKg = lbsToKg(seedNeededLbs);

    // Format numbers to 2 decimals
    const lbsFormatted = seedNeededLbs.toFixed(2);
    const kgFormatted = seedNeededKg.toFixed(2);

    const formulaUsed = `Seed Needed = (Area in sqft ÷ 1000) × Seeding Rate (lbs per 1000 sqft)
Where Seeding Rate for ${seedType.replace("-", " ")} grass ≈ ${seedingRateLbs} lbs/1000 sqft`;

    return {
      value: `${lbsFormatted} lbs (${kgFormatted} kg)`,
      label: "Grass Seed Required",
      subtext: `For an area of ${areaNum} ${inputs.unit === "sqm" ? "square meters" : "square feet"} using ${seedType.replace("-", " ")} grass seed.`,
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I know how much grass seed to buy?",
      answer:
        "The amount of grass seed required depends on your lawn's area and the type of grass you want to plant. This calculator estimates the seed quantity based on standard seeding rates for different grass types, ensuring you purchase the right amount without waste.",
    },
    {
      question: "Can I use this calculator for overseeding an existing lawn?",
      answer:
        "Yes, you can select the 'overseeding' seed type option to get an estimate tailored for overseeding purposes, which generally requires less seed than planting a new lawn.",
    },
    {
      question: "Why do seeding rates vary between grass types?",
      answer:
        "Different grass species have varying seed sizes, growth habits, and coverage rates. Cool-season grasses typically require more seed per area than warm-season grasses due to these biological differences.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="area" className="mb-1 inline-block font-semibold">
              Lawn Area
            </Label>
            <div className="flex gap-2">
              <Input
                id="area"
                type="number"
                min={0}
                step="any"
                placeholder="Enter area"
                value={inputs.area}
                onChange={(e) => handleInputChange("area", e.target.value)}
              />
              <Select
                value={inputs.unit}
                onValueChange={(v) => handleInputChange("unit", v)}
              >
                <SelectTrigger aria-label="Select area unit" className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sqft">sq ft</SelectItem>
                  <SelectItem value="sqm">sq m</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="seedType" className="mb-1 inline-block font-semibold">
              Grass Seed Type
            </Label>
            <Select
              id="seedType"
              value={inputs.seedType}
              onValueChange={(v) => handleInputChange("seedType", v)}
            >
              <SelectTrigger aria-label="Select grass seed type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cool-season">Cool-Season Grass</SelectItem>
                <SelectItem value="warm-season">Warm-Season Grass</SelectItem>
                <SelectItem value="overseeding">Overseeding</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate grass seed quantity"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ area: "", unit: "sqft", seedType: "cool-season", seedingRateUnit: "lbsPer1000sqft" })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
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
          Understanding Grass Seed Quantity Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calculating the correct amount of grass seed is essential for establishing a healthy, lush lawn without wasting resources or overspending. This calculator helps homeowners, landscapers, and gardening enthusiasts determine the precise quantity of grass seed needed based on the lawn's area and the type of grass seed selected. Different grass species require varying seeding rates due to differences in seed size, growth habits, and coverage density. By inputting your lawn size and grass seed type, you receive an accurate estimate in both pounds and kilograms, facilitating efficient purchasing and planting.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you are planting a new lawn or overseeding an existing one, understanding seeding rates and how they relate to your lawn's size ensures optimal germination and growth. This calculator incorporates standard seeding rates recommended by agricultural extensions and turfgrass experts to provide reliable results.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this grass seed quantity calculator is straightforward and designed to guide you through the essential inputs needed for an accurate estimate. Begin by measuring your lawn area in either square feet or square meters, then select the appropriate unit in the calculator. Next, choose the type of grass seed that matches your lawn's climate and purpose, such as cool-season, warm-season, or overseeding. Once these inputs are entered, click the calculate button to see the recommended amount of seed required.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your lawn area accurately using a tape measure or digital tools like smartphone apps or GPS devices.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the measured area into the calculator and select the correct unit (square feet or square meters).
          </li>
          <li>
            <strong>Step 3:</strong> Choose the grass seed type that corresponds to your region and lawn needs.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to receive the recommended seed quantity in pounds and kilograms.
          </li>
          <li>
            <strong>Step 5:</strong> Use the result to purchase the correct amount of seed, avoiding overbuying or under-seeding.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For best results, always prepare your soil properly before seeding by removing debris, loosening compacted soil, and ensuring adequate moisture. Applying a starter fertilizer can enhance seed germination and early growth. When overseeding, mow the existing lawn short and rake lightly to improve seed-to-soil contact. Avoid seeding during extreme heat or drought conditions to prevent seed desiccation. Always wear gloves and protective gear when handling fertilizers or seed treatments to minimize exposure to chemicals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Store unused seed in a cool, dry place to maintain viability for future use. Follow local guidelines regarding grass species to prevent invasive species introduction and promote ecological balance. Consulting with local agricultural extension services can provide region-specific advice tailored to your lawn's needs.
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
              href="https://extension.psu.edu/grass-seed-rates-and-seeding-methods"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Penn State Extension: Grass Seed Rates and Seeding Methods <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guidelines on recommended seeding rates and best practices for establishing lawns with various grass species.
            </p>
          </li>
          <li>
            <a
              href="https://www.nrcs.usda.gov/Internet/FSE_PLANTMATERIALS/publications/mipmcbr11824.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USDA NRCS: Turfgrass Seeding Rates and Establishment <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official USDA publication detailing seeding rates, establishment techniques, and maintenance recommendations for turfgrass.
            </p>
          </li>
          <li>
            <a
              href="https://www.turffiles.ncsu.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              North Carolina State University Turf Files <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Extensive research and extension resources on turfgrass management, including seeding rates and species selection.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Grass Seed Quantity Calculator"
      description="Calculate grass seed needed. Determine the pounds of seed required to overseed or plant a new lawn based on area."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Seed Needed = (Area in sqft ÷ 1000) × Seeding Rate (lbs per 1000 sqft)",
        variables: [
          { symbol: "Area", description: "Lawn area in square feet" },
          { symbol: "Seeding Rate", description: "Recommended seed amount per 1000 sqft based on grass type" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a 2,500 square foot lawn and want to plant cool-season grass seed for a new lawn.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Enter 2500 as the lawn area and select 'sq ft' as the unit.",
          },
          {
            label: "Step 2",
            explanation:
              "Select 'Cool-Season Grass' as the seed type to use the appropriate seeding rate.",
          },
          {
            label: "Step 3",
            explanation:
              "Click 'Calculate' to get the recommended seed quantity.",
          },
        ],
        result:
          "The calculator estimates approximately 12.50 lbs (5.67 kg) of grass seed needed to cover the area effectively.",
      }}
      relatedCalculators={[
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday/room-air-changes-ach", icon: "💡" },
        { title: "Sleep Debt & Ideal Bedtime Planner", url: "/everyday/sleep-debt-ideal-bedtime", icon: "💡" },
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday/water-heater-recovery-time", icon: "💧" },
        { title: "Propane Tank Burn Time Estimator", url: "/everyday/propane-tank-burn-time", icon: "💡" },
        { title: "Home Paint Touch-Up Estimator", url: "/everyday/home-paint-touch-up", icon: "🏠" },
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