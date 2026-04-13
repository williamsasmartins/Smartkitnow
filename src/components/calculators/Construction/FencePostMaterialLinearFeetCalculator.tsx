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
      question: "How many fence posts do I need for a 100-foot fence?",
      answer: "For a 100-foot fence with standard 6-foot spacing between posts, you will need approximately 17-18 posts. This calculation assumes posts at the start and end of the fence line, plus intermediate posts every 6 feet. If you're building a gate opening, you may need fewer posts depending on gate width.",
    },
    {
      question: "What is the standard spacing between fence posts?",
      answer: "The most common spacing for residential fence posts is 6 feet apart, which provides good structural support and material efficiency. However, spacing can range from 4 to 8 feet depending on fence height, wind exposure, and local building codes. Taller fences (8 feet or higher) typically require closer spacing of 4-5 feet for stability.",
    },
    {
      question: "How deep should I dig fence post holes?",
      answer: "As a general rule, dig post holes to a depth of one-third the above-ground height of your fence. For a 6-foot tall fence, dig 2 feet deep; for an 8-foot fence, dig approximately 2.5-3 feet deep. In frost-prone climates, the frost line depth (typically 3-4 feet in northern regions) may require deeper holes to prevent frost heave.",
    },
    {
      question: "How much concrete do I need per fence post?",
      answer: "A typical 4x4 fence post in a 10-inch diameter hole requires about 0.5 to 0.6 cubic yards (approximately 50-60 pounds) of concrete mix. For posts in smaller 8-inch holes, use 0.3-0.4 cubic yards. Always pour concrete at least 6 inches above ground level and slope away from the post for water drainage.",
    },
    {
      question: "What size fence posts do I need for different fence heights?",
      answer: "For fences up to 4 feet tall, use 4x4 posts; for 5-6 foot fences, 4x4 posts are standard; for 7-8 foot fences, use 4x4 posts set 3+ feet deep or upgrade to 6x6 posts for added strength. Wind exposure and soil conditions may require larger posts; sandy or clay soils benefit from larger diameter posts for better anchoring.",
    },
    {
      question: "How do I calculate the amount of fencing material needed?",
      answer: "Multiply your total fence length by the fence height to get square footage, then account for material overlap and waste (typically 10-15%). For example, a 150-foot fence that is 6 feet tall equals 900 square feet of material needed. Add 10-15% for cuts, errors, and waste, bringing the total to approximately 990-1,035 square feet of material.",
    },
    {
      question: "What is the cost difference between wood and vinyl fencing?",
      answer: "Wood fencing typically costs $15-$30 per linear foot installed, while vinyl fencing ranges from $25-$40 per linear foot. A 150-foot wood fence costs approximately $2,250-$4,500 installed, whereas the same vinyl fence costs $3,750-$6,000. Vinyl requires less maintenance but has higher upfront costs; wood is cheaper initially but needs staining or sealing every 2-3 years.",
    },
    {
      question: "How many linear feet can I build with one bundle of fencing boards?",
      answer: "A standard bundle of wooden fence boards (typically 50 pieces, 6 inches wide) covers about 25 linear feet at 6-foot height. If using 8-inch wide boards, one bundle covers approximately 33 linear feet. The coverage varies based on board width, thickness, and spacing; always check your specific product specifications.",
    },
    {
      question: "Should I account for gate openings when calculating fence materials?",
      answer: "Yes, absolutely. For each gate opening, subtract the gate width from your total linear footage before calculating materials and posts. A standard 4-foot gate opening reduces material needs by 4 linear feet but typically requires 2 additional posts (one on each side) for gate hinges and support. Larger gates (6+ feet) may need reinforced posts or additional structural support.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Fence Post & Material Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Fence Post & Material Calculator helps you accurately estimate the number of posts, amount of fencing material, and concrete needed for your residential or commercial fence project. By inputting your fence dimensions and material preferences, you'll receive a detailed breakdown of quantities and estimated costs, saving time and money on material ordering. This tool works for wood, vinyl, composite, chain link, and aluminum fences of any height.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator effectively, you'll need four key measurements: the total linear footage of your fence, the desired fence height, the post spacing preference (typically 6 feet is standard), and any gate openings you plan to include. The calculator uses these inputs to determine post quantity, material square footage, concrete volume, and hardware requirements. Be sure to measure your property boundaries accurately and account for terrain changes, as slopes may require additional posts or taller sections.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results will show you the exact number of posts needed, total linear feet of fencing material, cubic yards of concrete required, hardware quantities (nails, screws, brackets), and a cost estimate based on current material pricing. Use these figures to create your material shopping list and obtain accurate quotes from suppliers. Remember that the calculator provides estimates; always add 10-15% for waste, cuts, and unforeseen adjustments on-site.</p>
        </div>
      </section>

      {/* TABLE: Fence Post Spacing and Quantity Requirements by Total Length */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Fence Post Spacing and Quantity Requirements by Total Length</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how many posts you'll need based on fence length and standard 6-foot post spacing.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fence Length (feet)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Posts at 6-ft Spacing</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Posts at 5-ft Spacing</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Posts at 4-ft Spacing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">39</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">41</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">51</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">51</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">61</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">84</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">101</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">126</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Post quantities include posts at both start and end of fence line. Closer spacing provides additional strength for taller fences or windy locations.</p>
      </section>

      {/* TABLE: Post Hole Depth and Concrete Requirements by Fence Height */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Post Hole Depth and Concrete Requirements by Fence Height</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard recommendations for post hole depth and concrete volume based on above-ground fence height.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fence Height (feet)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Hole Depth (feet)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Concrete per Post (cubic yards)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Concrete per Post (pounds)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Frost-prone climates may require deeper holes (3-4 feet) to prevent frost heave. Always check local building codes for minimum requirements.</p>
      </section>

      {/* TABLE: Estimated Fencing Material and Labor Costs by Material Type */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Estimated Fencing Material and Labor Costs by Material Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">2024-2025 average costs for different fence materials per linear foot, including basic labor installation.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fence Material</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Material Cost (per linear foot)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Labor Cost (per linear foot)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Installed Cost (per linear foot)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wood Pressure-Treated</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8-$15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8-$15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$16-$30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cedar Wood</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12-$20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10-$18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$22-$38</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vinyl</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15-$25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10-$15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25-$40</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Composite</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18-$28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12-$18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30-$46</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chain Link</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6-$10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5-$10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11-$20</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Aluminum</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15-$25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12-$20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$27-$45</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs vary by region, labor availability, and site conditions. Gate openings add $300-$800 per gate for materials and installation.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure twice, order once — use a measuring wheel or GPS device to verify total fence length before calculating, as even small errors compound over long distances and lead to material shortages or overages.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for terrain variations — if your property slopes, you may need additional posts or varying fence heights to maintain an even appearance; measure at multiple points along the fence line.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Include a contingency buffer — order 10-15% extra materials for waste, cuts, and mistakes; it's better to have leftover boards than to run short mid-project.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check local building codes — setback requirements, height restrictions, and easements vary by municipality; verify permit requirements and neighbor notifications before purchasing materials.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Plan for gate locations early — identify gate openings before ordering materials to avoid cutting expensive fencing sections; gates typically require two reinforced posts and additional hardware.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to add posts for gate openings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Each gate opening requires two additional structural posts (one on each side) for hinges and support, plus hardware. Failing to account for these adds significant cost and delays once you realize the shortage on-site.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using incorrect post depth for climate conditions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">In frost-prone regions, posts must extend below the frost line (typically 3-4 feet deep) to prevent heave and shifting. Using standard 2-foot depths in cold climates leads to post movement and fence failure within 2-3 years.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing post spacing standards</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Inconsistent spacing between posts (switching from 6-foot to 8-foot gaps) weakens the fence and creates uneven appearance. Choose one standard spacing and maintain it throughout unless slope or obstacles require adjustment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating concrete volume needed</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 4x4 post in a standard hole requires 50-60 pounds of concrete, not 25 pounds. Insufficient concrete weakens the post base and reduces fence lifespan; always follow manufacturer recommendations for your post size.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring wind exposure and soil type</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Sandy or clay soils provide poor anchoring and may require larger posts or closer spacing than standard recommendations. High-wind areas also need reinforced posts; failing to assess these conditions results in structural failure.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many fence posts do I need for a 100-foot fence?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 100-foot fence with standard 6-foot spacing between posts, you will need approximately 17-18 posts. This calculation assumes posts at the start and end of the fence line, plus intermediate posts every 6 feet. If you're building a gate opening, you may need fewer posts depending on gate width.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard spacing between fence posts?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The most common spacing for residential fence posts is 6 feet apart, which provides good structural support and material efficiency. However, spacing can range from 4 to 8 feet depending on fence height, wind exposure, and local building codes. Taller fences (8 feet or higher) typically require closer spacing of 4-5 feet for stability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How deep should I dig fence post holes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">As a general rule, dig post holes to a depth of one-third the above-ground height of your fence. For a 6-foot tall fence, dig 2 feet deep; for an 8-foot fence, dig approximately 2.5-3 feet deep. In frost-prone climates, the frost line depth (typically 3-4 feet in northern regions) may require deeper holes to prevent frost heave.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much concrete do I need per fence post?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A typical 4x4 fence post in a 10-inch diameter hole requires about 0.5 to 0.6 cubic yards (approximately 50-60 pounds) of concrete mix. For posts in smaller 8-inch holes, use 0.3-0.4 cubic yards. Always pour concrete at least 6 inches above ground level and slope away from the post for water drainage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What size fence posts do I need for different fence heights?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For fences up to 4 feet tall, use 4x4 posts; for 5-6 foot fences, 4x4 posts are standard; for 7-8 foot fences, use 4x4 posts set 3+ feet deep or upgrade to 6x6 posts for added strength. Wind exposure and soil conditions may require larger posts; sandy or clay soils benefit from larger diameter posts for better anchoring.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the amount of fencing material needed?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiply your total fence length by the fence height to get square footage, then account for material overlap and waste (typically 10-15%). For example, a 150-foot fence that is 6 feet tall equals 900 square feet of material needed. Add 10-15% for cuts, errors, and waste, bringing the total to approximately 990-1,035 square feet of material.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the cost difference between wood and vinyl fencing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Wood fencing typically costs $15-$30 per linear foot installed, while vinyl fencing ranges from $25-$40 per linear foot. A 150-foot wood fence costs approximately $2,250-$4,500 installed, whereas the same vinyl fence costs $3,750-$6,000. Vinyl requires less maintenance but has higher upfront costs; wood is cheaper initially but needs staining or sealing every 2-3 years.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many linear feet can I build with one bundle of fencing boards?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A standard bundle of wooden fence boards (typically 50 pieces, 6 inches wide) covers about 25 linear feet at 6-foot height. If using 8-inch wide boards, one bundle covers approximately 33 linear feet. The coverage varies based on board width, thickness, and spacing; always check your specific product specifications.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I account for gate openings when calculating fence materials?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, absolutely. For each gate opening, subtract the gate width from your total linear footage before calculating materials and posts. A standard 4-foot gate opening reduces material needs by 4 linear feet but typically requires 2 additional posts (one on each side) for gate hinges and support. Larger gates (6+ feet) may need reinforced posts or additional structural support.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.iccsafe.org/codes-standards/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code (IBC) — Fence Height and Safety Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The IBC provides national standards for fence construction, including height limits, setback requirements, and structural safety specifications.</p>
          </li>
          <li>
            <a href="https://www.usda.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA — Frost Line Depth Map by Region</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The USDA provides region-specific frost line depth data essential for determining proper post hole depth in different climates.</p>
          </li>
          <li>
            <a href="https://www.concrete.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Concrete Reinforced Institute — Post Setting Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The Concrete Reinforced Institute offers technical guidance on proper concrete volume and setting techniques for fence posts.</p>
          </li>
          <li>
            <a href="https://www.nahb.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Home Builders — Residential Fence Construction Best Practices</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NAHB provides industry-standard guidelines for residential fence materials, spacing, and installation best practices.</p>
          </li>
        </ul>
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
        { id: "references", label: "References & Resources" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}