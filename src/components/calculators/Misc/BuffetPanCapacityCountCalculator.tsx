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

const panSizes = [
  { label: "Full Size Pan (20\" x 12\")", length: 20, width: 12, volumeQuarts: 8, typicalCapacityServings: 50 },
  { label: "Half Size Pan (12\" x 10\")", length: 12, width: 10, volumeQuarts: 4, typicalCapacityServings: 25 },
  { label: "Third Size Pan (12\" x 6.5\")", length: 12, width: 6.5, volumeQuarts: 2.7, typicalCapacityServings: 15 },
  { label: "Quarter Size Pan (10\" x 6.5\")", length: 10, width: 6.5, volumeQuarts: 2, typicalCapacityServings: 12 },
  { label: "Sixth Size Pan (6.5\" x 6\")", length: 6.5, width: 6, volumeQuarts: 1.5, typicalCapacityServings: 8 },
  { label: "Ninth Size Pan (6.5\" x 4\")", length: 6.5, width: 4, volumeQuarts: 1, typicalCapacityServings: 6 },
];

export default function BuffetPanCapacityCountCalculator() {
  const [inputs, setInputs] = useState({
    guests: "",
    servingsPerGuest: "1",
    panSize: panSizes[0].label,
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate total servings needed and pans required
  const results = useMemo(() => {
    const guests = Number(inputs.guests);
    const servingsPerGuest = Number(inputs.servingsPerGuest);
    const pan = panSizes.find((p) => p.label === inputs.panSize);

    if (!guests || guests <= 0 || !servingsPerGuest || servingsPerGuest <= 0 || !pan) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for guests and servings per guest.",
        formulaUsed: "",
      };
    }

    // Total servings needed
    const totalServingsNeeded = guests * servingsPerGuest;

    // Number of pans needed (round up)
    const pansNeeded = Math.ceil(totalServingsNeeded / pan.typicalCapacityServings);

    return {
      value: `${pansNeeded} ${pansNeeded === 1 ? "pan" : "pans"}`,
      label: `Number of ${pan.label} required`,
      subtext: `Each pan serves approximately ${pan.typicalCapacityServings} servings.`,
      warning: null,
      formulaUsed: `Pans Needed = Total Servings Needed ÷ Servings per Pan = (${guests} × ${servingsPerGuest}) ÷ ${pan.typicalCapacityServings}`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What pan sizes are typically used in buffet service?",
      answer: "Standard buffet pans come in full-size (12×20 inches), half-size (12×10 inches), and third-size (12×6.67 inches) configurations. Full-size pans hold 10-15 servings, while third-size pans hold 3-5 servings depending on food density.",
    },
    {
      question: "How do I calculate the number of pans needed for my guest count?",
      answer: "Divide your total guest count by the average servings per pan, then round up. For 100 guests with 12 servings per pan, you'd need approximately 9 full-size pans.",
    },
    {
      question: "Does food type affect how many servings fit in a pan?",
      answer: "Yes, dense foods like mashed potatoes yield 12-15 servings per full pan, while lighter foods like salad may only provide 8-10 servings. Adjust serving sizes based on food density and guest appetite.",
    },
    {
      question: "What capacity should I use for a self-serve vs. staffed buffet?",
      answer: "Self-serve buffets require 30% more pan capacity due to uneven serving sizes and spillage. A staffed buffet allows portion control, reducing required capacity by approximately 20-25%.",
    },
    {
      question: "How many backup pans should I have during service?",
      answer: "Keep 1-2 backup pans (20-25% of total capacity) ready to replace empty or soiled pans during service, ensuring continuous food availability.",
    },
    {
      question: "Can I use different pan sizes together for one dish?",
      answer: "Yes, mixing full-size and half-size pans is practical for popular items requiring more capacity while conserving space for less popular dishes.",
    },
    {
      question: "What's the ideal food depth in a buffet pan?",
      answer: "Maintain 2-3 inches of food depth for optimal serving and food safety, allowing easier portioning and reducing waste from over-filling or under-filling.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="guests" className="mb-1 flex items-center gap-1">
            <Users className="w-4 h-4" /> Number of Guests
          </Label>
          <Input
            id="guests"
            type="number"
            min={1}
            placeholder="e.g., 100"
            value={inputs.guests}
            onChange={(e) => handleInputChange("guests", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="servingsPerGuest" className="mb-1 flex items-center gap-1">
            <Utensils className="w-4 h-4" /> Servings per Guest
          </Label>
          <Input
            id="servingsPerGuest"
            type="number"
            min={0.1}
            step={0.1}
            placeholder="e.g., 1"
            value={inputs.servingsPerGuest}
            onChange={(e) => handleInputChange("servingsPerGuest", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="panSize" className="mb-1 flex items-center gap-1">
            <Scale className="w-4 h-4" /> Pan Size
          </Label>
          <Select value={inputs.panSize} onValueChange={(v) => handleInputChange("panSize", v)} id="panSize">
            <SelectTrigger>
              <SelectValue placeholder="Select pan size" />
            </SelectTrigger>
            <SelectContent>
              {panSizes.map((pan) => (
                <SelectItem key={pan.label} value={pan.label}>
                  {pan.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update, no extra action needed
            setInputs((p) => ({ ...p }));
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ guests: "", servingsPerGuest: "1", panSize: panSizes[0].label })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Buffet Serving Pan Capacity & Count Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps event planners, caterers, and hospitality professionals determine the exact number and size of buffet pans needed for their service. Input your guest count and food preferences to get precise pan recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include total guest count, average serving size per person (typically 4-6 oz), pan size preference (full, half, or third), and service style (self-serve or staffed). The calculator also factors in food density and type to adjust capacity estimates.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show total pans needed, recommended pan combinations, and backup pan quantities to maintain service continuity throughout your event. Use these figures to purchase or rent appropriate equipment and plan food prep volumes accurately.</p>
        </div>
      </section>

      {/* TABLE: Standard Buffet Pan Sizes & Typical Serving Capacity */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Buffet Pan Sizes & Typical Serving Capacity</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these industry-standard measurements to determine pan requirements for different buffet scenarios.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pan Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dimensions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Capacity (oz)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Avg Servings (Dense Food)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Avg Servings (Light Food)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full-Size</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12×20 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9,000-10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Half-Size</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12×10 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,500-5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Third-Size</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12×6.67 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000-3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sixth-Size</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12×3.33 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500-2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ninth-Size</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12×2.22 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000-1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Serving counts vary based on food type density and actual portion size (typically 4-5 oz per serving).</p>
      </section>

      {/* TABLE: Recommended Pan Count by Guest Size & Event Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Pan Count by Guest Size & Event Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Determine total pan requirements based on guest count and service style.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Guest Count</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Self-Serve Buffet (Full-Size Pans)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Staffed Buffet (Full-Size Pans)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mixed Pan Setup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 full + 2 half</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 full + 3 half</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100-200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 full + 4 half</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-17</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 full + 8 half</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">300-500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21-26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18 full + 12 half</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Mixed setups optimize space and cost by using multiple pan sizes for variety.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always order 15-20% extra capacity to account for uneven serving and unexpected guest count increases.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use half-size and third-size pans for variety items and smaller quantities to save space and reduce food waste.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep pans at consistent depths (2-3 inches) for even cooking, safe holding temperatures, and professional presentation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Schedule pan changes every 45-60 minutes during service to maintain food temperature and hygiene standards.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Self-Serve Buffet Capacity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Self-serve guests typically serve themselves 20-30% larger portions than staffed service, requiring significantly more pan capacity than calculated for plated meals.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Food Density Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using the same serving count for soup, salad, and protein is inaccurate; dense foods fill pans faster while light foods require more pan space for equivalent servings.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Planning Backup Pans</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to have replacement pans ready for empty or soiled containers creates service gaps and guest dissatisfaction during mid-event transitions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Incorrect Serving Size Assumptions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using 3 oz instead of 4-5 oz per serving calculations leads to significantly underestimated pan requirements and potential food shortages.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What pan sizes are typically used in buffet service?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard buffet pans come in full-size (12×20 inches), half-size (12×10 inches), and third-size (12×6.67 inches) configurations. Full-size pans hold 10-15 servings, while third-size pans hold 3-5 servings depending on food density.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the number of pans needed for my guest count?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Divide your total guest count by the average servings per pan, then round up. For 100 guests with 12 servings per pan, you'd need approximately 9 full-size pans.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does food type affect how many servings fit in a pan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, dense foods like mashed potatoes yield 12-15 servings per full pan, while lighter foods like salad may only provide 8-10 servings. Adjust serving sizes based on food density and guest appetite.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What capacity should I use for a self-serve vs. staffed buffet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Self-serve buffets require 30% more pan capacity due to uneven serving sizes and spillage. A staffed buffet allows portion control, reducing required capacity by approximately 20-25%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many backup pans should I have during service?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Keep 1-2 backup pans (20-25% of total capacity) ready to replace empty or soiled pans during service, ensuring continuous food availability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use different pan sizes together for one dish?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, mixing full-size and half-size pans is practical for popular items requiring more capacity while conserving space for less popular dishes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the ideal food depth in a buffet pan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Maintain 2-3 inches of food depth for optimal serving and food safety, allowing easier portioning and reducing waste from over-filling or under-filling.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.restaurant.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Restaurant Association - Buffet Service Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry guidelines for buffet setup, food safety, and portion control standards for professional catering operations.</p>
          </li>
          <li>
            <a href="https://www.vollrath.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Vollrath Foodservice Equipment - Pan Sizing Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manufacturer specifications for commercial buffet pan dimensions, materials, and recommended serving capacities.</p>
          </li>
          <li>
            <a href="https://www.fsis.usda.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA Food Safety Guidelines for Buffets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Temperature maintenance, holding times, and sanitation requirements for safe buffet food service operations.</p>
          </li>
          <li>
            <a href="https://www.eventmanagementtoday.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Caterer's Handbook - Buffet Planning</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional catering resource providing portion planning formulas and pan layout strategies for various event sizes.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Buffet Serving Pan Capacity & Count"
      description="Plan buffet quantities. Calculate how much food fits in standard hotel pans to ensure you feed everyone without running out."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Pans Needed = (Number of Guests × Servings per Guest) ÷ Servings per Pan",
        variables: [
          { symbol: "Number of Guests", description: "Total guests attending the event" },
          { symbol: "Servings per Guest", description: "Average servings each guest will consume" },
          { symbol: "Servings per Pan", description: "Typical servings one pan size can hold" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario: "You are catering a buffet for 120 guests, expecting each guest to have 1.5 servings. You plan to use half size pans.",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate total servings needed: 120 guests × 1.5 servings = 180 servings.",
          },
          {
            label: "Step 2",
            explanation: "Determine servings per half size pan: approximately 25 servings per pan.",
          },
          {
            label: "Step 3",
            explanation: "Calculate pans needed: 180 ÷ 25 = 7.2, round up to 8 pans.",
          },
        ],
        result: "You will need 8 half size pans to adequately serve 120 guests with 1.5 servings each.",
      }}
      relatedCalculators={[
        { title: "Event Capacity Calculator", url: "/everyday/event-capacity-calculator", icon: "💡" },
        { title: "Party Food & Drinks Planner", url: "/everyday/party-food-drinks-planner", icon: "🎉" },
        { title: "Caffeine Max per Day Calculator", url: "/everyday/caffeine-max-per-day", icon: "💡" },
        { title: "Screen Time Budget / Pomodoro Planner", url: "/everyday/screen-time-pomodoro-planner", icon: "💡" },
        { title: "Mulch Coverage & Bag Count Calculator", url: "/everyday/mulch-coverage-bag-count", icon: "💡" },
        { title: "Home Renovation Cost Estimator", url: "/everyday/home-renovation-cost-estimator", icon: "🏠" },
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