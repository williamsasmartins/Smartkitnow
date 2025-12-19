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

export default function LaundryDetergentDosageCalculator() {
  const [inputs, setInputs] = useState({
    loadSize: "",
    detergentType: "",
    waterHardness: "",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Dosage logic:
   * Typical detergent dosage varies by load size and detergent concentration.
   * Water hardness affects detergent effectiveness, requiring dosage adjustment.
   * 
   * Load sizes:
   * - Small: 2-3 kg (4-6 lbs)
   * - Medium: 4-5 kg (8-11 lbs)
   * - Large: 6-7 kg (13-15 lbs)
   * - Extra Large: 8+ kg (17+ lbs)
   * 
   * Detergent types:
   * - Standard liquid
   * - High Efficiency (HE) liquid
   * - Powder
   * 
   * Water hardness:
   * - Soft
   * - Medium
   * - Hard
   * 
   * Base dosage (ml or grams) per load size and detergent type from manufacturer guidelines.
   * Adjust dosage by +10-20% for hard water.
   */

  const dosageTable = {
    "Standard liquid": {
      small: 30,
      medium: 45,
      large: 60,
      extraLarge: 75,
    },
    "High Efficiency (HE) liquid": {
      small: 15,
      medium: 22,
      large: 30,
      extraLarge: 38,
    },
    Powder: {
      small: 35,
      medium: 50,
      large: 65,
      extraLarge: 80,
    },
  };

  const waterHardnessMultiplier = {
    Soft: 1,
    Medium: 1.1,
    Hard: 1.2,
  };

  const results = useMemo(() => {
    const { loadSize, detergentType, waterHardness } = inputs;
    if (!loadSize || !detergentType || !waterHardness) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please select all inputs to calculate dosage.",
        formulaUsed: "",
      };
    }

    let baseDosage = 0;
    switch (loadSize) {
      case "small":
        baseDosage = dosageTable[detergentType].small;
        break;
      case "medium":
        baseDosage = dosageTable[detergentType].medium;
        break;
      case "large":
        baseDosage = dosageTable[detergentType].large;
        break;
      case "extraLarge":
        baseDosage = dosageTable[detergentType].extraLarge;
        break;
      default:
        baseDosage = 0;
    }

    const multiplier = waterHardnessMultiplier[waterHardness] || 1;
    const adjustedDosage = Math.round(baseDosage * multiplier);

    const unit = detergentType === "Powder" ? "grams" : "ml";

    return {
      value: `${adjustedDosage} ${unit}`,
      label: `Recommended Detergent Dosage for a ${loadSize.charAt(0).toUpperCase() + loadSize.slice(1)} Load`,
      subtext: `Based on ${detergentType} detergent and ${waterHardness.toLowerCase()} water hardness.`,
      warning: null,
      formulaUsed: `Dosage = Base dosage × Water hardness multiplier (${baseDosage} × ${multiplier.toFixed(2)})`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why does water hardness affect detergent dosage?",
      answer:
        "Water hardness refers to the concentration of minerals like calcium and magnesium in water. Hard water reduces detergent effectiveness by binding with detergent molecules, requiring higher detergent amounts to achieve the same cleaning power. Adjusting dosage ensures optimal cleaning without wasting detergent.",
    },
    {
      question: "Can using too much detergent harm my clothes or washing machine?",
      answer:
        "Yes, overdosing detergent can leave residues on clothes, cause skin irritation, and lead to excess suds that may damage washing machine components or reduce cleaning efficiency. It's important to follow recommended dosages for your load size and water conditions.",
    },
    {
      question: "How do I know my water hardness level?",
      answer:
        "Water hardness can be determined by checking your local water utility report or using home water hardness test kits available online or in stores. Knowing your water hardness helps optimize detergent usage and improve laundry results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="loadSize" className="mb-1 block font-semibold">
                Load Size
              </Label>
              <Select
                value={inputs.loadSize || ""}
                onValueChange={(v) => handleInputChange("loadSize", v)}
                id="loadSize"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select load size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (2-3 kg / 4-6 lbs)</SelectItem>
                  <SelectItem value="medium">Medium (4-5 kg / 8-11 lbs)</SelectItem>
                  <SelectItem value="large">Large (6-7 kg / 13-15 lbs)</SelectItem>
                  <SelectItem value="extraLarge">Extra Large (8+ kg / 17+ lbs)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="detergentType" className="mb-1 block font-semibold">
                Detergent Type
              </Label>
              <Select
                value={inputs.detergentType || ""}
                onValueChange={(v) => handleInputChange("detergentType", v)}
                id="detergentType"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select detergent type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard liquid">Standard liquid</SelectItem>
                  <SelectItem value="High Efficiency (HE) liquid">High Efficiency (HE) liquid</SelectItem>
                  <SelectItem value="Powder">Powder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="waterHardness" className="mb-1 block font-semibold">
                Water Hardness
              </Label>
              <Select
                value={inputs.waterHardness || ""}
                onValueChange={(v) => handleInputChange("waterHardness", v)}
                id="waterHardness"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select water hardness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Soft">Soft</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
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
            // No special action needed, calculation is reactive
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ loadSize: "", detergentType: "", waterHardness: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
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
          Understanding Laundry Detergent Dosage by Load Size
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Proper laundry detergent dosage is essential for achieving clean clothes while preserving fabric quality and protecting your washing machine. The amount of detergent needed varies significantly based on the size of the laundry load, the type of detergent used, and the hardness of your water supply. Overusing detergent can lead to residue buildup, skin irritation, and machine damage, while underusing it can result in poorly cleaned clothes. This calculator helps you determine the optimal detergent amount tailored to your specific laundry conditions, ensuring efficiency, cost savings, and environmental responsibility.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Load size is typically measured by the weight of dry clothes, with categories ranging from small to extra-large loads. Detergent types differ in concentration and formulation, with High Efficiency (HE) detergents requiring less volume than standard liquids or powders. Water hardness, caused by dissolved minerals, affects detergent performance by binding with cleaning agents, necessitating dosage adjustments to maintain cleaning effectiveness.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately calculate the recommended detergent dosage, select your laundry load size, the type of detergent you are using, and your water hardness level. This calculator uses established manufacturer guidelines and water chemistry principles to provide a precise dosage recommendation. Follow these steps to ensure optimal results:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Determine your laundry load size by weighing your dry clothes or estimating based on typical load weights.
          </li>
          <li>
            <strong>Step 2:</strong> Select the detergent type you use, such as standard liquid, HE liquid, or powder.
          </li>
          <li>
            <strong>Step 3:</strong> Identify your water hardness level by consulting your local water utility report or using a home test kit.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see the recommended detergent dosage tailored to your inputs.
          </li>
          <li>
            <strong>Step 5:</strong> Use the recommended amount for your laundry load to maximize cleaning efficiency and minimize waste.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Laundry professionals emphasize the importance of following detergent manufacturer instructions and adjusting dosage based on load size and water conditions. Using too much detergent not only wastes money but can also cause buildup on fabrics and inside your washing machine, leading to odors and mechanical issues. Always measure detergent carefully using dosing caps or scoops, and avoid mixing different detergent types to prevent chemical reactions. For sensitive skin, consider hypoallergenic detergents and rinse cycles with extra water. Additionally, regularly clean your washing machine to prevent residue accumulation and maintain optimal performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Environmental considerations are also important; using the correct detergent amount reduces water pollution and energy consumption. High Efficiency washers require HE detergents and lower dosages to function properly, so avoid using standard detergents in HE machines. Lastly, store detergents safely out of reach of children and pets, and dispose of empty containers responsibly.
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
              href="https://www.epa.gov/saferchoice/safer-laundry-guide"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              EPA Safer Choice: Safer Laundry Guide <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official Environmental Protection Agency guidelines on selecting and using laundry detergents safely and effectively.
            </p>
          </li>
          <li>
            <a
              href="https://extension.oregonstate.edu/gardening/techniques/water-hardness-and-its-effect-detergent-performance"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Oregon State University Extension: Water Hardness and Detergent Performance <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Research-based explanation of how water hardness impacts detergent effectiveness and laundry outcomes.
            </p>
          </li>
          <li>
            <a
              href="https://www.energy.gov/energysaver/washing-machines"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Energy.gov: Washing Machines and Detergent Use <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              U.S. Department of Energy guidance on efficient washing machine use, including detergent dosage recommendations.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Laundry Detergent Dosage by Load Size"
      description="Determine the right laundry detergent dosage. Calculate the exact amount needed per load size to save money and protect clothes."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Dosage = Base dosage × Water hardness multiplier\n" +
          "Where base dosage depends on load size and detergent type, and multiplier adjusts for water hardness.",
        variables: [
          { name: "Base dosage", description: "Manufacturer recommended detergent amount for load size and detergent type (ml or grams)" },
          { name: "Water hardness multiplier", description: "Adjustment factor based on water hardness: Soft=1, Medium=1.1, Hard=1.2" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a medium-sized laundry load (4-5 kg), use High Efficiency liquid detergent, and your water hardness is medium.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Select 'Medium' for load size, 'High Efficiency (HE) liquid' for detergent type, and 'Medium' for water hardness in the calculator.",
          },
          {
            label: "Step 2",
            explanation:
              "The base dosage for a medium load with HE liquid detergent is 22 ml. The water hardness multiplier for medium hardness is 1.1.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate dosage: 22 ml × 1.1 = 24.2 ml. The calculator rounds this to 24 ml.",
          },
          {
            label: "Step 4",
            explanation:
              "Use 24 ml of HE liquid detergent for this load to achieve optimal cleaning results.",
          },
        ],
        result: "Recommended detergent dosage: 24 ml",
      }}
      relatedCalculators={[
        { title: "Life Expectancy Calculator", url: "/everyday-life/life-expectancy", icon: "💡" },
        { title: "Wine/Beer/Soft Drink Mix Estimator", url: "/everyday-life/beverage-mix-estimator", icon: "🎉" },
        { title: "Square Footage Calculator", url: "/everyday-life/square-footage-calculator", icon: "💡" },
        { title: "Steps → Distance Converter", url: "/everyday-life/steps-to-distance-converter", icon: "💡" },
        { title: "Event Budget Calculator", url: "/everyday-life/event-budget-calculator", icon: "💡" },
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday-life/leftovers-cooling-reheat-time", icon: "💡" },
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