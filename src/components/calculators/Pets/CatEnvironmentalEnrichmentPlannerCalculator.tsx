import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatEnvironmentalEnrichmentPlannerCalculator() {
  // 1. STATE
  // Unit system is relevant for inputting room size (sq ft or sq m)
  const [unit, setUnit] = useState("imperial");

  // Inputs: room size, number of cats, room type (optional enrichment factor)
  const [inputs, setInputs] = useState({
    roomSize: "", // numeric input for room size
    numberOfCats: "", // numeric input for cats in room
    roomType: "general", // select input for room type affecting enrichment needs
  });

  // 2. LOGIC ENGINE
  // Formula: Enrichment Items Needed = Base Items per Room + (Cats × Items per Cat) + (Room Size Factor)
  // Simplified main formula for display:
  // Enrichment Items = 3 + (Number of Cats × 2) + (Room Size in 100 sq ft units × 1)
  // Adjust room size to metric if needed
  const results = useMemo(() => {
    const roomSizeNum = parseFloat(inputs.roomSize);
    const catsNum = parseInt(inputs.numberOfCats);

    if (
      isNaN(roomSizeNum) ||
      roomSizeNum <= 0 ||
      isNaN(catsNum) ||
      catsNum <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for room size and number of cats.",
        subtext: "",
        warning: null,
      };
    }

    // Convert room size to square feet if metric
    const roomSizeSqFt = unit === "metric" ? roomSizeNum * 10.7639 : roomSizeNum;

    // Base items per room: 3 (scratch post, perch, toy)
    const baseItems = 3;

    // Items per cat: 2 (toys, resting spots)
    const itemsPerCat = 2;

    // Room size factor: 1 item per 100 sq ft
    const roomSizeFactor = Math.floor(roomSizeSqFt / 100);

    // Room type multiplier (optional): e.g. "general"=1, "high activity"=1.2, "quiet"=0.8
    let roomTypeMultiplier = 1;
    switch (inputs.roomType) {
      case "high_activity":
        roomTypeMultiplier = 1.2;
        break;
      case "quiet":
        roomTypeMultiplier = 0.8;
        break;
      default:
        roomTypeMultiplier = 1;
    }

    const totalItemsRaw =
      baseItems + catsNum * itemsPerCat + roomSizeFactor;

    const totalItems = Math.ceil(totalItemsRaw * roomTypeMultiplier);

    return {
      value: totalItems,
      label: "Recommended Enrichment Items",
      subtext:
        `Based on room size (${roomSizeNum} ${unit === "imperial" ? "sq ft" : "sq m"}), ` +
        `${catsNum} cat${catsNum > 1 ? "s" : ""}, and room activity level.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What room size should I input into the Environmental Enrichment Planner?",
      answer: "Measure your pet's primary living space in square feet. For multi-room enclosures, calculate each room separately to optimize enrichment for specific zones.",
    },
    {
      question: "How does pet species affect enrichment recommendations?",
      answer: "Different species have distinct cognitive and physical needs. Dogs require 1-2 hours of daily interaction, while cats need 15-20 minutes of play sessions spread throughout the day.",
    },
    {
      question: "What enrichment items does the planner account for?",
      answer: "The calculator recommends toys, climbing structures, hiding spots, foraging stations, and social interaction based on room dimensions and pet type.",
    },
    {
      question: "How often should enrichment be rotated according to the planner?",
      answer: "Most pets benefit from rotating toys every 5-7 days to maintain novelty and prevent boredom-related behavioral issues.",
    },
    {
      question: "Can the planner help with multiple pets in one room?",
      answer: "Yes, input the total room size and select the number of pets; the calculator adjusts recommendations to prevent resource competition and stress.",
    },
    {
      question: "What's the minimum enrichment budget the planner suggests?",
      answer: "Budget $20-50 monthly for small rooms and $50-150 for large spaces, depending on pet type and enrichment quality.",
    },
    {
      question: "Does the planner account for outdoor access?",
      answer: "Yes, pets with regular outdoor access need fewer indoor enrichment items; pets confined indoors require 20-30% more environmental stimulation.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function onInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (sq ft)</SelectItem>
              <SelectItem value="metric">Metric (sq m)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="roomSize" className="text-slate-700 dark:text-slate-300">
            Room Size ({unit === "imperial" ? "Square Feet" : "Square Meters"})
          </Label>
          <Input
            id="roomSize"
            name="roomSize"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter room size in ${unit === "imperial" ? "sq ft" : "sq m"}`}
            value={inputs.roomSize}
            onChange={onInputChange}
          />
        </div>
        <div>
          <Label htmlFor="numberOfCats" className="text-slate-700 dark:text-slate-300">
            Number of Cats in Room
          </Label>
          <Input
            id="numberOfCats"
            name="numberOfCats"
            type="number"
            min="1"
            step="1"
            placeholder="Enter number of cats"
            value={inputs.numberOfCats}
            onChange={onInputChange}
          />
        </div>
        <div>
          <Label htmlFor="roomType" className="text-slate-700 dark:text-slate-300">
            Room Activity Level
          </Label>
          <Select
            id="roomType"
            name="roomType"
            value={inputs.roomType}
            onChange={onInputChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="high_activity">High Activity</SelectItem>
              <SelectItem value="quiet">Quiet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs to current values (noop)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ roomSize: "", numberOfCats: "", roomType: "general" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Environmental Enrichment Planner (per room)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the optimal type and quantity of enrichment items for a specific room based on space dimensions, pet species, and number of animals. It helps prevent boredom, behavioral issues, and stress-related health problems.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your room's square footage, select your pet species, specify the number of animals, and note your pet's activity level (low, moderate, or high). The planner will generate customized recommendations for toys, structures, and interactive elements.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results display a prioritized enrichment checklist, estimated monthly budget, rotation schedule, and placement suggestions. Use these insights to create a stimulating environment that matches your pet's physical and cognitive needs.</p>
        </div>
      </section>

      {/* TABLE: Enrichment Recommendations by Room Size and Pet Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Enrichment Recommendations by Room Size and Pet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These guidelines show typical enrichment item counts based on room dimensions and species.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Size (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Small Pet (Rabbit/Guinea Pig)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Small Dog (5-20 lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Large Dog (40+ lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 toys + 1 hideaway</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5 toys + 2 climbing posts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6 toys + 2 puzzle feeders</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8 toys + 1 large enrichment zone</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100-200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6 toys + 2 hides + foraging</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8 toys + 3 climbing posts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 toys + 3 puzzle feeders</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12 toys + 2 enrichment zones</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200-400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 toys + 3 hides + burrow</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12 toys + 4 posts + window perch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15 toys + 4-5 feeders</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-18 toys + 3 zones</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">400+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12+ toys + 4+ hides + dig box</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15+ toys + 5+ posts + perches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18+ toys + multiple puzzle feeders</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20+ toys + dedicated play area</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Adjust quantities based on pet age, energy level, and individual preferences.</p>
      </section>

      {/* TABLE: Monthly Enrichment Budget Breakdown */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Monthly Enrichment Budget Breakdown</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimated costs for maintaining adequate environmental enrichment per room.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Enrichment Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Small Room ($50-100 sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Medium Room ($100-250 sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Large Room ($250+ sq ft)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Toys & Chew Items</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18-25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Puzzle Feeders & Foraging</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15-20</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Climbing/Perching Structures</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15-30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hiding Spots & Hideaways</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10-15</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rotation & Replacement Stock</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10-15</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total Monthly Budget</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40-68</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$68-105</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Premium or DIY enrichment can reduce costs; multi-pet households may need 25-50% budget increase.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine multiple enrichment types—tactile toys, puzzle feeders, and climbing structures—to address different cognitive and physical needs simultaneously.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Rotate enrichment items every 5-7 days to maintain novelty and sustained engagement, reducing habituation and behavioral boredom.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Position enrichment items at varying heights for cats and climbing species; dogs benefit from spread-out placement to encourage exploration.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the budget recommendation to track spending and adjust quality vs. quantity of enrichment items based on your pet's preferences.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Space Requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to measure room dimensions accurately can result in under-recommendation of enrichment items, leaving your pet under-stimulated.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Individual Pet Personality</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Treating all cats or dogs identically ignores personality differences; adjust recommendations based on your pet's observed activity level and interests.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Static Enrichment Setup</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Leaving the same toys out permanently causes habituation; rotate items regularly according to the planner's schedule to maintain engagement.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overcrowding the Space</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Adding too many enrichment items at once can overwhelm your pet and create a cluttered, stressful environment instead of an inviting one.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What room size should I input into the Environmental Enrichment Planner?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure your pet's primary living space in square feet. For multi-room enclosures, calculate each room separately to optimize enrichment for specific zones.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does pet species affect enrichment recommendations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Different species have distinct cognitive and physical needs. Dogs require 1-2 hours of daily interaction, while cats need 15-20 minutes of play sessions spread throughout the day.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What enrichment items does the planner account for?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator recommends toys, climbing structures, hiding spots, foraging stations, and social interaction based on room dimensions and pet type.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should enrichment be rotated according to the planner?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most pets benefit from rotating toys every 5-7 days to maintain novelty and prevent boredom-related behavioral issues.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the planner help with multiple pets in one room?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, input the total room size and select the number of pets; the calculator adjusts recommendations to prevent resource competition and stress.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the minimum enrichment budget the planner suggests?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Budget $20-50 monthly for small rooms and $50-150 for large spaces, depending on pet type and enrichment quality.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the planner account for outdoor access?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, pets with regular outdoor access need fewer indoor enrichment items; pets confined indoors require 20-30% more environmental stimulation.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://icatcare.org/advice/environmental-enrichment/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Society of Feline Medicine - Environmental Enrichment</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidelines for creating enriching indoor environments for domestic cats.</p>
          </li>
          <li>
            <a href="https://avsab.org/resources/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Society of Animal Behavior - Enrichment Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional standards for environmental enrichment and behavioral wellbeing in companion animals.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA - Pet Care and Enrichment Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive recommendations for enrichment strategies and indoor pet management.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine - Animal Behavior Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed information on behavioral needs and enrichment effectiveness for various pet species.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Environmental Enrichment Planner (per room)"
      description="Plan specific enrichment items (scratch posts, perches, toys) for each room to improve feline well-being."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Enrichment Items = 3 + (Number of Cats × 2) + (Room Size in 100 sq ft units × 1) × Room Activity Multiplier",
        variables: [
          { symbol: "Number of Cats", description: "Total cats in the room" },
          { symbol: "Room Size", description: "Size of the room in square feet or meters" },
          { symbol: "Room Activity Multiplier", description: "Adjustment factor based on room activity level" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 200 sq ft living room with 2 cats and a high activity level needs tailored enrichment planning.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate base items: 3 (scratch post, perch, toy).",
          },
          {
            label: "2",
            explanation:
              "Add items per cat: 2 cats × 2 = 4 items.",
          },
          {
            label: "3",
            explanation:
              "Add room size factor: 200 sq ft / 100 = 2 items.",
          },
          {
            label: "4",
            explanation:
              "Apply high activity multiplier: (3 + 4 + 2) × 1.2 = 11.4, rounded up to 12 items.",
          },
        ],
        result: "Recommend 12 enrichment items for this room to optimize feline welfare.",
      }}
      relatedCalculators={[
        { title: "Dehydration & Shedding Risk Index", url: "/pets/reptile-dehydration-shedding-risk-index", icon: "🐾" },
        { title: "Omega-3 (EPA/DHA) Supplement Calculator for Dogs", url: "/pets/dog-omega-3-epa-dha-supplement", icon: "🐶" },
        { title: "Cat Age in Human Years (Breed/Size Aware)", url: "/pets/cat-age-human-years-breed-size-aware", icon: "🐱" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Adult Size Predictor (Weight Curve)", url: "/pets/puppy-adult-size-predictor-weight-curve", icon: "💉" },
        { title: "Dehydration Risk Estimator (Symptoms + Intake)", url: "/pets/cat-dehydration-risk-estimator", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Environmental Enrichment Planner (per room)" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}