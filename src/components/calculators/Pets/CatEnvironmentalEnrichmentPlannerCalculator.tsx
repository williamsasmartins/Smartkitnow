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
      question:
        "Why is environmental enrichment important for indoor cats in each room?",
      answer:
        "Environmental enrichment is crucial for indoor cats to stimulate their natural behaviors, reduce stress, and prevent boredom-related issues such as aggression or obesity. Each room offers unique opportunities to provide diverse enrichment items tailored to the space and number of cats present. Properly planning enrichment per room ensures cats remain mentally and physically healthy by encouraging exploration, play, and rest.",
    },
    {
      question:
        "How does room size affect the number and type of enrichment items needed?",
      answer:
        "Larger rooms require more enrichment items to adequately stimulate cats and prevent underuse of space, while smaller rooms need fewer but carefully selected items to avoid overcrowding. The formula accounts for room size by adding enrichment items proportional to the area, ensuring cats have enough resources to engage with. This approach helps maintain a balanced environment that supports feline well-being regardless of room dimensions.",
    },
    {
      question:
        "Can the number of cats in a room change the enrichment planning recommendations?",
      answer:
        "Yes, the number of cats directly influences enrichment needs because each cat requires individual resources to reduce competition and stress. The planner increases the recommended number of items based on the number of cats, ensuring sufficient toys, resting spots, and vertical spaces for all occupants. This individualized approach promotes harmony and prevents behavioral problems stemming from resource scarcity.",
    },
    {
      question:
        "What role does room activity level or type play in environmental enrichment planning?",
      answer:
        "Room activity level affects how much stimulation cats need; high-activity rooms may require more or varied enrichment items to match feline energy levels. Conversely, quiet rooms might benefit from fewer but more calming enrichment options to support relaxation. Adjusting enrichment based on room type ensures that the environment aligns with cats’ behavioral needs, enhancing their overall quality of life.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Environmental Enrichment Planner (per room)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Environmental enrichment is a vital aspect of feline care that focuses on enhancing the living environment to promote natural behaviors, mental stimulation, and physical activity. Each room in a home presents unique opportunities and challenges for enrichment, requiring tailored planning to optimize the well-being of cats. By considering factors such as room size, number of cats, and activity level, caregivers can create spaces that reduce stress and encourage healthy behaviors.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This planner helps quantify the number and types of enrichment items needed per room, including scratch posts, perches, toys, and resting spots. It balances the spatial constraints with the social dynamics of multiple cats, ensuring that resources are sufficient to prevent competition and boredom. Proper environmental enrichment has been shown to improve feline welfare by decreasing destructive behaviors and enhancing overall happiness.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, the planner accounts for room activity levels, recognizing that high-energy areas may require more diverse enrichment to satisfy cats’ exploratory instincts. Quiet rooms, conversely, benefit from calming enrichment that supports rest and relaxation. This nuanced approach ensures that each room contributes positively to the cat’s physical and psychological health, making it an indispensable tool for veterinary professionals and cat owners alike.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To effectively use this Environmental Enrichment Planner, begin by selecting the unit system that corresponds to your measurement preference—imperial for square feet or metric for square meters. Next, input the size of the room you wish to enrich, followed by the number of cats that will occupy the space. Finally, choose the room activity level to tailor the enrichment recommendations to the environment’s energy.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the room size accurately to ensure the enrichment items recommended match the available space.
          </li>
          <li>
            <strong>Step 2:</strong> Specify the number of cats sharing the room to calculate sufficient resources and prevent competition.
          </li>
          <li>
            <strong>Step 3:</strong> Select the room activity level to adjust the quantity and type of enrichment items based on feline behavioral needs.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to receive a tailored recommendation of enrichment items needed for the room.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to plan and arrange appropriate enrichment tools that enhance your cats’ quality of life.
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.aspca.org/pet-care/cat-care/cat-enrichment"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. ASPCA: Cat Enrichment Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on environmental enrichment for cats, emphasizing the importance of tailored enrichment strategies per living space.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6313449/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Institutes of Health: Environmental Enrichment and Feline Welfare
            </a>
            <p className="text-slate-500 text-sm">
              A scientific review discussing the impact of environmental enrichment on feline behavior and health, supporting enrichment planning per room.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/environmental-enrichment-for-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. VCA Hospitals: Environmental Enrichment for Cats
            </a>
            <p className="text-slate-500 text-sm">
              Practical advice from veterinary experts on how to enrich indoor environments for cats, including room-specific recommendations.
            </p>
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