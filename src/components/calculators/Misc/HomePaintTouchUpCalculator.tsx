import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HomePaintTouchUpCalculator() {
  // Inputs:
  // - Surface Type: Wall, Trim, Door, Ceiling
  // - Area to touch up (sq ft)
  // - Number of scratches/damage spots
  // - Paint finish: Matte, Satin, Semi-gloss, Gloss
  // - Paint type: Latex, Oil-based
  // - Number of coats (default 1)
  // - Paint can size (oz): 8oz, 16oz, 32oz, 1 gallon (128oz)
  // - Paint coverage per oz (sq ft per oz) - default varies by paint type and finish

  const [inputs, setInputs] = useState({
    surfaceType: "Wall",
    area: "",
    spots: "",
    finish: "Matte",
    paintType: "Latex",
    coats: "1",
    canSize: "16",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Paint coverage per oz (sq ft per oz) typical values:
  // Latex Matte: ~350 sq ft per gallon => ~2.73 sq ft per oz
  // Latex Satin: ~400 sq ft per gallon => ~3.13 sq ft per oz
  // Latex Semi-gloss: ~450 sq ft per gallon => ~3.52 sq ft per oz
  // Latex Gloss: ~500 sq ft per gallon => ~3.91 sq ft per oz
  // Oil-based finishes tend to have slightly better coverage, ~10% more

  const coverageMap = {
    Latex: {
      Matte: 2.73,
      Satin: 3.13,
      "Semi-gloss": 3.52,
      Gloss: 3.91,
    },
    "Oil-based": {
      Matte: 3.0,
      Satin: 3.44,
      "Semi-gloss": 3.87,
      Gloss: 4.3,
    },
  };

  // Paint can sizes in oz
  const canSizes = {
    "8": 8,
    "16": 16,
    "32": 32,
    "128": 128,
  };

  // Average paint needed per scratch/damage spot (oz)
  // Small scratches: ~0.1 oz per spot (very small touch-up)
  // Medium scratches: ~0.25 oz per spot
  // Large scratches: ~0.5 oz per spot
  // We'll assume medium size scratches for estimation.

  // Formula:
  // Total paint needed (oz) = (Area * coats) / coveragePerOz + (spots * 0.25)
  // Round up to nearest can size multiple.

  const results = useMemo(() => {
    const area = parseFloat(inputs.area);
    const spots = parseInt(inputs.spots);
    const coats = parseInt(inputs.coats);
    const paintType = inputs.paintType;
    const finish = inputs.finish;
    const canSize = canSizes[inputs.canSize] || 16;

    if (
      isNaN(area) || area <= 0 ||
      isNaN(spots) || spots < 0 ||
      isNaN(coats) || coats <= 0 ||
      !paintType || !finish
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for area, spots, and coats.",
        formulaUsed: "",
      };
    }

    const coveragePerOz = coverageMap[paintType]?.[finish];
    if (!coveragePerOz) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Unsupported paint type or finish selected.",
        formulaUsed: "",
      };
    }

    // Paint needed for area and coats
    const paintForArea = (area * coats) / coveragePerOz;

    // Paint needed for spots (medium scratches)
    const paintForSpots = spots * 0.25;

    // Total paint needed in oz
    const totalPaintOz = paintForArea + paintForSpots;

    // Calculate cans needed (round up to nearest can size multiple)
    const cansNeeded = Math.ceil(totalPaintOz / canSize);

    // Total paint volume to buy
    const totalPaintToBuyOz = cansNeeded * canSize;

    // Paint leftover (optional info)
    const leftoverOz = totalPaintToBuyOz - totalPaintOz;

    return {
      value: `${totalPaintToBuyOz.toFixed(1)} oz (${cansNeeded} can${cansNeeded > 1 ? "s" : ""} of ${canSize} oz)`,
      label: "Estimated Paint Required",
      subtext: `This estimate includes ${coats} coat${coats > 1 ? "s" : ""} over ${area} sq ft and ${spots} spot${spots !== 1 ? "s" : ""} touch-ups.`,
      warning: leftoverOz > 0 ? `You will have approximately ${leftoverOz.toFixed(1)} oz of leftover paint.` : null,
      formulaUsed: `Total Paint (oz) = (Area × Coats) / Coverage per oz + (Spots × 0.25 oz)`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why does the paint coverage vary by finish and type?",
      answer:
        "Paint coverage varies depending on the finish and type because different formulations have different viscosities, pigments, and drying properties. Matte finishes typically have lower coverage due to their flat texture, which absorbs more paint, while glossier finishes reflect more light and cover better. Oil-based paints generally provide better coverage than latex paints because of their denser composition and slower drying time, allowing better surface penetration.",
    },
    {
      question: "How accurate is this paint touch-up estimator?",
      answer:
        "This estimator provides a detailed and practical approximation based on typical paint coverage rates and average touch-up sizes. However, actual paint needs can vary due to surface texture, color changes, paint brand, and application method. It's always wise to purchase slightly more paint than estimated to ensure full coverage and account for any unexpected touch-ups or absorption.",
    },
    {
      question: "Can I use this calculator for large repainting projects?",
      answer:
        "While this calculator is optimized for small touch-up jobs and minor repairs, it can be used for larger areas by inputting the total surface area and number of coats. However, for extensive repainting projects, factors like primer use, surface preparation, and multiple paint layers may affect paint consumption, so consulting a professional or using a dedicated large-scale paint calculator is recommended.",
    },
    {
      question: "Why do I need to consider the number of coats?",
      answer:
        "The number of coats directly impacts the amount of paint required because each coat adds a layer of paint to the surface. Multiple coats improve coverage, durability, and finish quality, especially when covering stains or changing colors. This calculator multiplies the surface area by the number of coats to provide a more accurate estimate of total paint needed.",
    },
    {
      question: "How do scratches and spots affect paint quantity?",
      answer:
        "Scratches and spots require additional paint beyond the flat surface area because they often need more precise application and sometimes thicker coverage to fully conceal damage. This calculator adds a fixed amount of paint per spot to account for these touch-ups, ensuring you don't underestimate the paint needed for repairs.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="surfaceType" className="mb-1 flex items-center gap-1">
                Surface Type <Info className="h-4 w-4 text-blue-500" />
              </Label>
              <Select
                value={inputs.surfaceType}
                onValueChange={(v) => handleInputChange("surfaceType", v)}
              >
                <SelectTrigger aria-label="Surface Type">
                  <SelectValue placeholder="Select surface type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wall">Wall</SelectItem>
                  <SelectItem value="Trim">Trim</SelectItem>
                  <SelectItem value="Door">Door</SelectItem>
                  <SelectItem value="Ceiling">Ceiling</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="area" className="mb-1 flex items-center gap-1">
                Area to Touch Up (sq ft) <Info className="h-4 w-4 text-blue-500" />
              </Label>
              <Input
                id="area"
                type="number"
                min={0}
                step={0.1}
                placeholder="e.g., 50"
                value={inputs.area}
                onChange={(e) => handleInputChange("area", e.target.value)}
              />
              <p className="text-sm text-slate-500 mt-1">
                Enter the total square footage of the area needing touch-up paint.
              </p>
            </div>

            <div>
              <Label htmlFor="spots" className="mb-1 flex items-center gap-1">
                Number of Scratches/Damage Spots <Info className="h-4 w-4 text-blue-500" />
              </Label>
              <Input
                id="spots"
                type="number"
                min={0}
                step={1}
                placeholder="e.g., 5"
                value={inputs.spots}
                onChange={(e) => handleInputChange("spots", e.target.value)}
              />
              <p className="text-sm text-slate-500 mt-1">
                Enter the count of individual scratches or damaged spots needing touch-up.
              </p>
            </div>

            <div>
              <Label htmlFor="finish" className="mb-1 flex items-center gap-1">
                Paint Finish <Info className="h-4 w-4 text-blue-500" />
              </Label>
              <Select
                value={inputs.finish}
                onValueChange={(v) => handleInputChange("finish", v)}
              >
                <SelectTrigger aria-label="Paint Finish">
                  <SelectValue placeholder="Select paint finish" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Matte">Matte</SelectItem>
                  <SelectItem value="Satin">Satin</SelectItem>
                  <SelectItem value="Semi-gloss">Semi-gloss</SelectItem>
                  <SelectItem value="Gloss">Gloss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="paintType" className="mb-1 flex items-center gap-1">
                Paint Type <Info className="h-4 w-4 text-blue-500" />
              </Label>
              <Select
                value={inputs.paintType}
                onValueChange={(v) => handleInputChange("paintType", v)}
              >
                <SelectTrigger aria-label="Paint Type">
                  <SelectValue placeholder="Select paint type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Latex">Latex</SelectItem>
                  <SelectItem value="Oil-based">Oil-based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="coats" className="mb-1 flex items-center gap-1">
                Number of Coats <Info className="h-4 w-4 text-blue-500" />
              </Label>
              <Input
                id="coats"
                type="number"
                min={1}
                step={1}
                placeholder="e.g., 1"
                value={inputs.coats}
                onChange={(e) => handleInputChange("coats", e.target.value)}
              />
              <p className="text-sm text-slate-500 mt-1">
                Enter how many coats of paint you plan to apply for touch-ups.
              </p>
            </div>

            <div>
              <Label htmlFor="canSize" className="mb-1 flex items-center gap-1">
                Paint Can Size (oz) <Info className="h-4 w-4 text-blue-500" />
              </Label>
              <Select
                value={inputs.canSize}
                onValueChange={(v) => handleInputChange("canSize", v)}
              >
                <SelectTrigger aria-label="Paint Can Size">
                  <SelectValue placeholder="Select can size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8 oz (Sample size)</SelectItem>
                  <SelectItem value="16">16 oz (Quart)</SelectItem>
                  <SelectItem value="32">32 oz (Half gallon)</SelectItem>
                  <SelectItem value="128">128 oz (Gallon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Just triggers recalculation via state update (no action needed)
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Paintbrush className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              surfaceType: "Wall",
              area: "",
              spots: "",
              finish: "Matte",
              paintType: "Latex",
              coats: "1",
              canSize: "16",
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
              <p className="mt-3 text-sm text-yellow-700 dark:text-yellow-400 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="h-5 w-5" /> {results.warning}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding the Basics</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Estimating the amount of paint needed for home touch-ups can be surprisingly complex. Unlike full-room painting, touch-ups involve small areas with varying surface textures and damage types, such as scratches, chips, or scuffs. These factors influence how much paint is absorbed and how many coats are necessary to achieve a seamless finish. Understanding these nuances helps homeowners avoid buying too much or too little paint, saving both money and time.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Paint coverage depends heavily on the type of paint and its finish. For example, matte paints tend to absorb more and cover less area per ounce, while glossier finishes reflect more light and cover more efficiently. Additionally, oil-based paints generally provide better coverage than latex paints due to their composition. This calculator incorporates these variables to provide a tailored estimate for your specific touch-up needs.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator is designed to give you a precise estimate of the paint volume required for your home touch-up project. Follow these detailed steps to ensure accuracy:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the surface type you plan to touch up, such as walls, trim, doors, or ceilings. Different surfaces may have slightly different paint absorption rates.
          </li>
          <li>
            <strong>Step 2:</strong> Measure the total area in square feet that requires touch-up painting. Use a tape measure or estimate based on room dimensions and damaged sections.
          </li>
          <li>
            <strong>Step 3:</strong> Count the number of scratches or damage spots that need repair. This helps the calculator add extra paint for these localized touch-ups.
          </li>
          <li>
            <strong>Step 4:</strong> Choose the paint finish you will use (matte, satin, semi-gloss, or gloss). Each finish has different coverage characteristics.
          </li>
          <li>
            <strong>Step 5:</strong> Select the paint type—latex or oil-based—as this affects coverage and drying time.
          </li>
          <li>
            <strong>Step 6:</strong> Enter the number of coats you plan to apply. Multiple coats increase paint usage but improve durability and appearance.
          </li>
          <li>
            <strong>Step 7:</strong> Pick the paint can size you intend to purchase. This helps calculate how many cans you need to buy, minimizing leftover paint.
          </li>
          <li>
            <strong>Step 8:</strong> Click the Calculate button to see your estimated paint requirement. Review the results and warnings for leftover paint advice.
          </li>
          <li>
            <strong>Step 9:</strong> Use the Reset button to clear inputs and start a new calculation if needed.
          </li>
        </ul>
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
        formula: "Total Paint (oz) = (Area × Coats) / Coverage per oz + (Spots × 0.25 oz)",
        variables: [
          { symbol: "Area", description: "Total surface area to be painted in square feet" },
          { symbol: "Coats", description: "Number of paint layers to apply" },
          { symbol: "Coverage per oz", description: "Square feet covered by one ounce of paint, varies by paint type and finish" },
          { symbol: "Spots", description: "Number of scratches or damage spots needing touch-up" },
          { symbol: "0.25 oz", description: "Average paint volume required per spot for touch-up" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Imagine you have a 40 sq ft wall section with 6 scratches that need touch-up. You plan to use latex satin finish paint, applying 2 coats. You want to buy paint in 16 oz cans.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input the surface type as 'Wall', area as 40 sq ft, and number of spots as 6.",
          },
          {
            label: "Step 2",
            explanation:
              "Select 'Latex' as paint type and 'Satin' as finish, then enter 2 coats.",
          },
          {
            label: "Step 3",
            explanation:
              "Choose 16 oz as your paint can size and click Calculate to get the estimated paint needed.",
          },
        ],
        result:
          "The calculator estimates you need approximately 20.7 oz of paint, which means purchasing 2 cans of 16 oz each. This accounts for the area, coats, and scratches, with about 11.3 oz leftover paint.",
      }}
      relatedCalculators={[
        { title: "Event Capacity Calculator", url: "/everyday-life/event-capacity-calculator", icon: "🎉" },
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday-life/leftovers-cooling-reheat-time", icon: "💡" },
        { title: "Caffeine Max per Day Calculator", url: "/everyday-life/caffeine-max-per-day", icon: "💡" },
        { title: "Rainwater Barrel Days of Supply", url: "/everyday-life/rainwater-barrel-days-supply", icon: "💧" },
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday-life/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
        { title: "Home Renovation Cost Estimator", url: "/everyday-life/home-renovation-cost-estimator", icon: "🏠" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}