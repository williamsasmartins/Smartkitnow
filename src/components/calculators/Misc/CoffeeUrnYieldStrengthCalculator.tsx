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

export default function CoffeeUrnYieldStrengthCalculator() {
  // Inputs:
  // urnCapacity: in cups (standard coffee cup = 6 oz)
  // coffeeStrength: desired strength (Light, Medium, Strong)
  // coffeeGroundsUnit: grams or ounces
  // waterUnit: cups or liters (for flexibility)
  // grindSize: optional, affects extraction but not calculation here

  const [inputs, setInputs] = useState({
    urnCapacity: "",
    coffeeStrength: "Medium",
    coffeeGroundsUnit: "grams",
    waterUnit: "cups",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants for coffee strength ratios (coffee grounds to water by weight)
  // Typical coffee brewing ratios range from 1:15 (strong) to 1:18 (light)
  // We'll define:
  // Light: 1:18
  // Medium: 1:16
  // Strong: 1:15
  // Source: Specialty Coffee Association and USDA guidelines

  // Conversion constants
  const GRAMS_PER_OUNCE = 28.3495;
  const OUNCES_PER_CUP = 6; // standard coffee cup = 6 fluid oz

  const results = useMemo(() => {
    const urnCapacityNum = parseFloat(inputs.urnCapacity);
    if (!urnCapacityNum || urnCapacityNum <= 0) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter a valid urn capacity greater than zero.",
        formulaUsed: "",
      };
    }

    // Determine coffee to water ratio based on strength
    let ratio = 16; // default medium
    if (inputs.coffeeStrength === "Light") ratio = 18;
    else if (inputs.coffeeStrength === "Strong") ratio = 15;

    // Calculate total water volume in ounces
    // urnCapacity is in cups (6 oz each)
    const totalWaterOz = urnCapacityNum * OUNCES_PER_CUP;

    // Convert water volume to grams (1 fl oz water ~ 29.5735 grams)
    const waterGrams = totalWaterOz * 29.5735;

    // Calculate coffee grounds needed in grams
    // coffee grounds = water grams / ratio
    const coffeeGrams = waterGrams / ratio;

    // Convert coffee grounds to selected unit
    let coffeeGroundsDisplay = coffeeGrams;
    if (inputs.coffeeGroundsUnit === "ounces") {
      coffeeGroundsDisplay = coffeeGrams / GRAMS_PER_OUNCE;
    }

    // Convert water to selected unit
    let waterDisplay = urnCapacityNum;
    if (inputs.waterUnit === "liters") {
      // 1 cup (6 fl oz) = 0.177441 liters
      waterDisplay = urnCapacityNum * 0.177441;
    }

    // Format numbers nicely
    const coffeeRounded = coffeeGroundsDisplay.toFixed(2);
    const waterRounded = waterDisplay.toFixed(2);

    return {
      value: `${coffeeRounded} ${inputs.coffeeGroundsUnit} coffee grounds for ${waterRounded} ${inputs.waterUnit} water`,
      label: "Recommended Coffee Grounds Amount",
      subtext: `Based on a ${inputs.coffeeStrength.toLowerCase()} strength ratio of 1:${ratio}`,
      warning: null,
      formulaUsed: `Coffee Grounds (g) = Water (g) ÷ ${ratio}`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the ideal coffee-to-water ratio for large urns?",
      answer:
        "The ideal coffee-to-water ratio varies depending on desired strength, but typically ranges from 1:15 (strong) to 1:18 (light). For large urns, maintaining this ratio ensures consistent flavor and strength throughout the batch.",
    },
    {
      question: "Why do we use weight instead of volume for coffee grounds?",
      answer:
        "Weight measurement is more accurate than volume because coffee grounds vary in density and grind size. Using weight ensures consistent extraction and flavor, especially important when brewing large quantities.",
    },
    {
      question: "Can I adjust the strength after brewing?",
      answer:
        "Adjusting strength after brewing is difficult without diluting or concentrating the coffee, which can affect flavor balance. It's best to measure grounds and water accurately before brewing for optimal results.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="urnCapacity">Coffee Urn Capacity (cups)</Label>
            <Input
              id="urnCapacity"
              type="number"
              min={1}
              step={1}
              placeholder="e.g., 50"
              value={inputs.urnCapacity}
              onChange={(e) => handleInputChange("urnCapacity", e.target.value)}
            />
            <p className="text-sm text-slate-500 mt-1">
              Enter the total number of 6 oz coffee cups your urn holds.
            </p>
          </div>

          <div>
            <Label htmlFor="coffeeStrength">Desired Coffee Strength</Label>
            <Select
              value={inputs.coffeeStrength}
              onValueChange={(v) => handleInputChange("coffeeStrength", v)}
            >
              <SelectTrigger id="coffeeStrength" className="w-full">
                <SelectValue placeholder="Select strength" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Light">Light (1:18)</SelectItem>
                <SelectItem value="Medium">Medium (1:16)</SelectItem>
                <SelectItem value="Strong">Strong (1:15)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="coffeeGroundsUnit">Coffee Grounds Unit</Label>
              <Select
                value={inputs.coffeeGroundsUnit}
                onValueChange={(v) => handleInputChange("coffeeGroundsUnit", v)}
              >
                <SelectTrigger id="coffeeGroundsUnit" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grams">Grams (g)</SelectItem>
                  <SelectItem value="ounces">Ounces (oz)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="waterUnit">Water Unit</Label>
              <Select
                value={inputs.waterUnit}
                onValueChange={(v) => handleInputChange("waterUnit", v)}
              >
                <SelectTrigger id="waterUnit" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cups">Cups (6 fl oz)</SelectItem>
                  <SelectItem value="liters">Liters (L)</SelectItem>
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
            // no explicit action needed, results update automatically
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              urnCapacity: "",
              coffeeStrength: "Medium",
              coffeeGroundsUnit: "grams",
              waterUnit: "cups",
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
            {results.subtext && (
              <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">{results.subtext}</p>
            )}
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-semibold">{results.warning}</p>
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
          Understanding Coffee Urn Yield & Strength Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Brewing coffee for large groups requires precision and consistency to ensure every cup tastes just right.
          The Coffee Urn Yield & Strength Calculator helps you determine the exact amount of coffee grounds needed
          based on your urn's capacity and desired coffee strength. By using weight-based ratios, this tool accounts
          for the nuances of coffee extraction and guarantees a balanced brew, whether you prefer a light, medium,
          or strong cup. This calculator is especially valuable for event planners, cafes, and catering services aiming
          to deliver quality coffee at scale without waste or guesswork.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires just a few inputs. Start by entering the total capacity
          of your coffee urn in standard coffee cups (6 fluid ounces each). Next, select your preferred coffee strength,
          which adjusts the coffee-to-water ratio accordingly. Choose your preferred units for coffee grounds and water,
          allowing you to work in grams, ounces, cups, or liters depending on your equipment and preference. Once all inputs
          are set, click "Calculate" to see the precise amount of coffee grounds needed to achieve the desired strength.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the urn capacity in cups (6 oz each). For example, a 50-cup urn holds 300 oz of water.
          </li>
          <li>
            <strong>Step 2:</strong> Select your desired coffee strength: Light (1:18 ratio), Medium (1:16), or Strong (1:15).
          </li>
          <li>
            <strong>Step 3:</strong> Choose units for coffee grounds (grams or ounces) and water (cups or liters).
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to get the recommended coffee grounds amount for your urn.
          </li>
          <li>
            <strong>Step 5:</strong> Use the calculated coffee grounds and water volume to brew your coffee for consistent results.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When brewing coffee in large urns, precision and hygiene are paramount. Always measure coffee grounds by weight
          for accuracy, as volume measurements can vary due to grind size and bean density. Use fresh, filtered water
          heated to the optimal temperature range of 195°F to 205°F (90°C to 96°C) to extract the best flavors without bitterness.
          Regularly clean and descale your urn to prevent buildup that can affect taste and equipment longevity. Lastly,
          avoid over-extraction by not letting brewed coffee sit too long on a hot plate, as this can cause bitterness and degrade quality.
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For further reading and verification, please refer to these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://sca.coffee/research/coffee-brewing-guidelines"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Specialty Coffee Association: Brewing Guidelines <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guidelines on coffee brewing ratios, extraction, and best practices from the leading coffee authority.
            </p>
          </li>
          <li>
            <a
              href="https://www.ncausa.org/About-Coffee/How-to-Brew-Coffee"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Coffee Association USA: How to Brew Coffee <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical advice and science-backed methods for brewing coffee, including ratios and equipment tips.
            </p>
          </li>
          <li>
            <a
              href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-safety-and-coffee"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USDA Food Safety and Inspection Service: Coffee Safety <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official guidelines on safe coffee preparation and handling to prevent contamination and ensure quality.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Coffee Urn Yield & Strength Calculator"
      description="Brew coffee for a crowd. Calculate the coffee grounds-to-water ratio for large urns to ensure the perfect strength."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Coffee Grounds (g) = Water (g) ÷ Ratio",
        variables: [
          {
            symbol: "Coffee Grounds (g)",
            description: "Weight of coffee grounds needed in grams",
          },
          {
            symbol: "Water (g)",
            description: "Weight of water in grams (1 fl oz ≈ 29.5735 g)",
          },
          {
            symbol: "Ratio",
            description:
              "Coffee-to-water ratio by weight, typically 1:15 (strong), 1:16 (medium), or 1:18 (light)",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a 50-cup coffee urn and want to brew medium strength coffee using grams and cups.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Enter '50' for urn capacity (cups). Select 'Medium' strength (1:16 ratio). Choose 'grams' for coffee grounds and 'cups' for water.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate total water volume: 50 cups × 6 oz = 300 oz. Convert to grams: 300 oz × 29.5735 = 8872 g water.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate coffee grounds: 8872 g ÷ 16 = 554.5 g coffee grounds needed.",
          },
          {
            label: "Step 4",
            explanation:
              "Use approximately 554.5 grams of coffee grounds with 50 cups of water for medium strength coffee.",
          },
        ],
        result:
          "554.5 grams of coffee grounds for 50 cups of water yields medium strength coffee at a 1:16 ratio.",
      }}
      relatedCalculators={[
        { title: "Screen Time Budget / Pomodoro Planner", url: "/everyday-life/screen-time-pomodoro-planner", icon: "💡" },
        { title: "Body Fat Percentage Calculator", url: "/everyday-life/body-fat-percentage", icon: "💡" },
        { title: "Fertilizer Application Calculator", url: "/everyday-life/fertilizer-application-calculator", icon: "💡" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday-life/light-bulb-cost-per-year", icon: "🏠" },
        { title: "Grass Seed Quantity Calculator", url: "/everyday-life/grass-seed-quantity", icon: "💡" },
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday-life/room-air-changes-ach", icon: "💡" },
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