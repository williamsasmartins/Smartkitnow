import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Ruler,
  Hammer,
  HardHat,
  Box,
  DollarSign,
  Info,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  Calculator,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FencePostMaterialLinearFeetCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial", // imperial or metric
    length: "", // linear feet or meters
    postSpacing: "", // feet or meters between posts
    postHeight: "", // feet or meters height of post (for material calc)
    waste: "10", // percent
    pricePerPost: "", // price per post unit
    materialSize: "standard", // standard or large post size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation Logic:
   * 1. Calculate number of posts needed based on length and post spacing:
   *    posts = (length / postSpacing) + 1 (posts at both ends)
   * 2. Add waste margin (percentage)
   * 3. Round up to nearest whole post
   * 4. Calculate total cost if price per post provided
   *
   * Material size affects post length (height) and possibly price.
   * For simplicity, we assume standard post height is input postHeight,
   * large post height is 1.5x postHeight.
   */

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const postSpacing = parseFloat(inputs.postSpacing);
    const postHeight = parseFloat(inputs.postHeight);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerPost = parseFloat(inputs.pricePerPost);
    const materialSize = inputs.materialSize;

    if (
      isNaN(length) ||
      length <= 0 ||
      isNaN(postSpacing) ||
      postSpacing <= 0 ||
      isNaN(postHeight) ||
      postHeight <= 0
    ) {
      return {
        mainQty: "0 Posts",
        cost: "$0.00",
        details: "Please enter valid positive numbers for length, spacing, and height.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Calculate base number of posts
    // Posts = floor(length / postSpacing) + 1
    const basePosts = Math.floor(length / postSpacing) + 1;

    // Add waste margin
    const totalPostsRaw = basePosts * (1 + wastePercent / 100);

    // Round up to whole posts
    const totalPosts = Math.ceil(totalPostsRaw);

    // Adjust post height for material size
    const adjustedHeight =
      materialSize === "large" ? postHeight * 1.5 : postHeight;

    // Cost calculation
    const totalCost =
      !isNaN(pricePerPost) && pricePerPost > 0
        ? totalPosts * pricePerPost
        : 0;

    return {
      mainQty: `${totalPosts} Posts`,
      cost: `$${totalCost.toFixed(2)}`,
      details: `Base posts: ${basePosts}, Waste added: ${(
        totalPostsRaw - basePosts
      ).toFixed(2)} posts, Post height: ${adjustedHeight.toFixed(
        2
      )} ${inputs.unit === "imperial" ? "ft" : "m"}`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question:
        "How do I determine the correct post spacing for my fence project?",
      answer:
        "Post spacing depends on the type of fence and materials used. Common spacing ranges from 6 to 8 feet for wood fences and 8 to 10 feet for chain link fences. Closer spacing increases stability but also material costs. Always check local building codes and manufacturer recommendations for best results.",
    },
    {
      question:
        "Why is it important to include a waste margin when ordering fence posts?",
      answer:
        "Including a waste margin accounts for posts that may be damaged, cut incorrectly, or lost during installation. Typically, a 10% waste margin is recommended to ensure you have enough materials without costly delays. This safety buffer helps avoid multiple orders and keeps your project on schedule.",
    },
    {
      question:
        "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, the calculator supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system at the top. Ensure all inputs are consistent in the chosen unit to get accurate results.",
    },
    {
      question:
        "How does the material size option affect the calculation?",
      answer:
        "The material size option adjusts the post height used in calculations. Standard size uses the height you input directly, while large size assumes posts are 1.5 times taller. This helps estimate material quantities and costs more accurately based on the post dimensions you plan to use.",
    },
    {
      question:
        "What factors can affect the price per post in the calculator?",
      answer:
        "Price per post varies based on material type (wood, metal, vinyl), post size, treatment (pressure-treated, galvanized), and local market rates. Always use current supplier pricing for the most accurate cost estimation. The calculator multiplies the total posts by your input price per post to estimate total cost.",
    },
    {
      question:
        "How do I convert my measurements if I only have partial data?",
      answer:
        "If you only know the total fence length but not the post spacing, consider typical spacing values for your fence type or consult a professional. For height, measure the tallest post needed or use standard heights (e.g., 6 feet for privacy fences). Consistent and accurate measurements ensure reliable calculations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a wooden fence 100 feet long, with posts spaced every 8 feet. You plan to use standard 6-foot posts and want to include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Fence length = 100 ft, Post spacing = 8 ft, Post height = 6 ft",
      },
      {
        label: "2. Calculate Posts",
        explanation:
          "Base posts = floor(100 / 8) + 1 = 12 + 1 = 13 posts",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Total posts with 10% waste = 13 × 1.10 = 14.3, round up to 15 posts",
      },
      {
        label: "4. Order",
        explanation:
          "Order 15 posts of 6 ft height. If price per post is $25, total cost = 15 × $25 = $375",
      },
    ],
    result: "Final Order: 15 Posts, Estimated Cost: $375.00",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Number of Posts = ⌈ (Length / Post Spacing + 1) × (1 + Waste Percentage) ⌉",
    variables: [
      { symbol: "Length", description: "Total fence length (ft or m)" },
      { symbol: "Post Spacing", description: "Distance between posts (ft or m)" },
      { symbol: "Waste Percentage", description: "Additional waste margin (%)" },
      { symbol: "⌈ ⌉", description: "Ceiling function to round up" },
    ],
  };

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
          <SelectTrigger className="w-[140px]">
            <Ruler className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (meters)</SelectItem>
            <SelectItem value="imperial">Imperial (feet)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fence Length ({inputs.unit === "imperial" ? "ft" : "m"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`Enter length in ${inputs.unit === "imperial" ? "feet" : "meters"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Post Spacing ({inputs.unit === "imperial" ? "ft" : "m"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.postSpacing}
            onChange={(e) => handleInputChange("postSpacing", e.target.value)}
            placeholder={`Distance between posts in ${inputs.unit === "imperial" ? "feet" : "meters"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Post Height ({inputs.unit === "imperial" ? "ft" : "m"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.postHeight}
            onChange={(e) => handleInputChange("postHeight", e.target.value)}
            placeholder={`Height of each post in ${inputs.unit === "imperial" ? "feet" : "meters"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Material Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Size</SelectItem>
              <SelectItem value="large">Large Size (1.5× Height)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Waste Margin (%)</Label>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <span className="font-bold text-blue-600">{inputs.waste}%</span>
            </div>
            <Slider
              value={[parseInt(inputs.waste)]}
              min={0}
              max={25}
              step={5}
              onValueChange={(v) => handleInputChange("waste", v[0].toString())}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Price per Post</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min={0}
              step="any"
              value={inputs.pricePerPost}
              onChange={(e) => handleInputChange("pricePerPost", e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Materials Needed
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty}
            </div>
            <div className="text-xl font-bold mt-2">Est. Cost: {results.cost}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="text-xs text-slate-400 mt-1 italic">{results.wasteInfo}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* 4. GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Professional Guide: Fence Post & Material Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Fence Post & Material Calculator is a specialized tool designed to help contractors,
            builders, and DIY enthusiasts accurately estimate the number of fence posts and related
            materials needed for a fencing project. By inputting key dimensions such as fence length,
            post spacing, and post height, users can quickly determine the quantity of posts required,
            including a waste margin to account for errors or damages.
          </p>
          <p>
            Precision in these calculations is crucial. Ordering too few posts can cause project delays,
            while ordering too many leads to unnecessary expenses and material waste. This calculator
            ensures you strike the right balance, optimizing both cost and efficiency.
          </p>
          <p>
            Fence posts come in various materials including wood, metal, vinyl, and composite. Each
            material type has different sizing standards, durability, and price points. This calculator
            allows you to select standard or large post sizes, adjusting the calculations accordingly
            to fit your material choice and project requirements.
          </p>
          <p>
            Additionally, the calculator supports both metric and imperial units, making it versatile
            for projects worldwide. Including a waste margin is a best practice in construction to
            accommodate unforeseen issues such as damaged posts or measurement inaccuracies.
          </p>
        </div>
      </section>

      {/* 5. TIPS / DID YOU KNOW */}
      <section
        id="tips"
        className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips & Curiosities
        </h3>
        <ul className="space-y-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>Tip:</strong> Always measure your fence line twice and consider terrain
            variations that might affect post spacing.
          </li>
          <li>
            <strong>Did You Know?</strong> Using larger posts can increase fence stability but also
            increases material costs and installation effort.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering an extra 10% of posts upfront can save you
            from costly delays caused by damaged or misplaced materials.
          </li>
          <li>
            <strong>Tip:</strong> When working in metric, converting post spacing from feet to meters
            (1 ft = 0.3048 m) helps maintain accuracy.
          </li>
          <li>
            <strong>Did You Know?</strong> Some fence types, like vinyl, require posts with specific
            dimensions and spacing for warranty compliance.
          </li>
        </ul>
      </section>

      {/* 6. MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes to Avoid
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Incorrect Post Spacing:</strong> Using inconsistent or incorrect post spacing
            leads to ordering too many or too few posts, affecting fence stability and budget.
          </p>
          <p>
            <strong>2. Forgetting Waste Margin:</strong> Not including a waste margin can cause
            project delays if posts are damaged or cut incorrectly during installation.
          </p>
          <p>
            <strong>3. Mixing Units:</strong> Mixing metric and imperial units in inputs causes
            inaccurate calculations. Always select and use one unit system consistently.
          </p>
          <p>
            <strong>4. Ignoring Material Size Differences:</strong> Assuming all posts are the same
            size can lead to ordering insufficient material or miscalculating costs.
          </p>
          <p>
            <strong>5. Not Updating Prices:</strong> Using outdated price per post values results in
            inaccurate cost estimates. Always verify current supplier pricing.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0"
            >
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fence Post & Material Calculator"
      description="The ultimate professional guide and calculator for Fence Post & Material Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula} // 8. PASSING FORMULA
      example={example} // 9. PASSING EXAMPLE
      relatedCalculators={[]}
      onThisPage={[
        // 10. FULL NAVIGATION
        { id: "guide", label: "Guide" },
        { id: "tips", label: "Pro Tips" },
        { id: "formula", label: "Formula" }, // Layout handles id="formula" automatically for the prop
        { id: "example", label: "Example" }, // Layout handles id="example" automatically for the prop
        { id: "mistakes", label: "Mistakes" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}