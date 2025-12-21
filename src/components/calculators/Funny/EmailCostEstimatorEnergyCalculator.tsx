import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Lightbulb, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EmailCostEstimatorEnergyCalculator() {
  const [inputs, setInputs] = useState({ emailsSent: "", energyPerEmail: "" });
  const handleInputChange = useCallback((n, v) => setInputs((p) => ({ ...p, [n]: v })), []);

  const results = useMemo(() => {
    const emailsSentNum = parseFloat(inputs.emailsSent);
    const energyPerEmailNum = parseFloat(inputs.energyPerEmail);

    // Initial state safety: if inputs empty or invalid, return neutral state
    if (
      !inputs.emailsSent ||
      !inputs.energyPerEmail ||
      isNaN(emailsSentNum) ||
      isNaN(energyPerEmailNum) ||
      emailsSentNum < 0 ||
      energyPerEmailNum < 0
    ) {
      return { value: null };
    }

    // Calculate total energy consumption in kWh
    // energyPerEmail input is in Wh, convert to kWh by dividing by 1000
    const totalEnergyKWh = (emailsSentNum * energyPerEmailNum) / 1000;

    // Average US electricity cost per kWh ~ $0.13 (can be adjusted or made input)
    const costPerKWh = 0.13;
    const totalCostUSD = totalEnergyKWh * costPerKWh;

    return {
      value: totalCostUSD.toLocaleString("en-US", { style: "currency", currency: "USD" }),
      label: `Estimated cost to send ${emailsSentNum.toLocaleString()} email${emailsSentNum !== 1 ? "s" : ""}`,
      subtext: `Based on ${energyPerEmailNum} Wh energy consumption per email and $${costPerKWh.toFixed(
        2
      )} per kWh electricity cost`,
      color: "text-green-600",
      icon: <Sparkles className="mx-auto h-12 w-12 text-green-600" />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How is the energy consumption per email estimated?",
      answer:
        "The energy consumption per email varies depending on factors like email size, server efficiency, and network infrastructure. Studies estimate an average email sends about 4 Wh of energy, but this calculator lets you adjust based on your assumptions.",
    },
    {
      question: "Why is the cost per kWh fixed at $0.13?",
      answer:
        "The cost per kWh is an average US residential electricity price. Actual costs vary by location and provider. You can adjust the energy per email input to reflect your local conditions or more precise data.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="emailsSent" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Number of Emails Sent
        </Label>
        <Input
          id="emailsSent"
          type="number"
          min={0}
          placeholder="e.g., 1000"
          value={inputs.emailsSent}
          onChange={(e) => handleInputChange("emailsSent", e.target.value)}
          aria-describedby="emailsSentHelp"
        />
        <p id="emailsSentHelp" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter how many emails you plan to send.
        </p>
      </div>

      <div>
        <Label htmlFor="energyPerEmail" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Energy Consumption per Email (Wh)
        </Label>
        <Input
          id="energyPerEmail"
          type="number"
          min={0}
          step={0.01}
          placeholder="e.g., 4"
          value={inputs.energyPerEmail}
          onChange={(e) => handleInputChange("energyPerEmail", e.target.value)}
          aria-describedby="energyPerEmailHelp"
        />
        <p id="energyPerEmailHelp" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Average energy used to send one email in watt-hours (Wh). Default is around 4 Wh.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ emailsSent: "", energyPerEmail: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">{results.icon}</div>
            <p className={`text-5xl font-extrabold ${results.color}`}>{results.value}</p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">{results.label}</p>
            <p className="mt-2 text-sm italic text-slate-500">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Cost to Send This Email (Energy/kWh)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Sending emails consumes energy through data centers, network infrastructure, and end-user devices. While a single email's energy use is small, the cumulative effect of billions of emails daily contributes significantly to global electricity consumption. This calculator estimates the monetary cost of the energy used to send your emails based on average energy consumption per email and typical electricity prices.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By understanding the energy footprint of digital communication, individuals and organizations can make more informed decisions about their email habits and explore ways to reduce their environmental impact. Adjust the inputs to reflect your specific context or use the default values for a general estimate.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The average email generates about 4 watt-hours (Wh) of energy consumption, which is roughly equivalent to the energy used by a 40-watt incandescent bulb in 6 minutes. Globally, emails contribute to approximately 4% of the world's total carbon emissions from digital activities.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter the number of emails you plan to send in the first input. Then, specify the average energy consumption per email in watt-hours (Wh). If unsure, use the default estimate of 4 Wh. Click "Calculate" to see the estimated cost of the electricity used to send those emails.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          You can reset the inputs anytime using the "Reset" button. This tool helps raise awareness of the environmental impact of digital communication and encourages more sustainable email practices.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{question}</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-1">{answer}</p>
          </div>
        ))}
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://www.energystar.gov/products/low_carbon_it_campaign/email_carbon_footprint"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Energy Star: Email Carbon Footprint <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed analysis of the energy consumption and carbon emissions associated with sending emails.
            </p>
          </li>
          <li>
            <a
              href="https://www.carbontrust.com/resources/white-papers/carbon-footprint-of-email"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Carbon Trust: Carbon Footprint of Email <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Research paper discussing the environmental impact of digital communication including emails.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cost to Send This Email (Energy/kWh)"
      description="Estimate the environmental cost of your emails. Calculate the energy usage and carbon footprint of sending that 'Reply All' message."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Cost = Emails Sent × Energy per Email (Wh) ÷ 1000 × Cost per kWh",
        variables: [
          { symbol: "Cost", description: "Total electricity cost in USD" },
          { symbol: "Emails Sent", description: "Number of emails sent" },
          { symbol: "Energy per Email (Wh)", description: "Energy used to send one email in watt-hours" },
          { symbol: "Cost per kWh", description: "Electricity price per kilowatt-hour in USD" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculating the cost to send 1,000 emails with an average energy consumption of 4 Wh per email.",
        steps: [
          {
            label: "Step 1",
            explanation: "Multiply the number of emails by the energy per email: 1,000 × 4 Wh = 4,000 Wh.",
          },
          {
            label: "Step 2",
            explanation: "Convert watt-hours to kilowatt-hours: 4,000 Wh ÷ 1,000 = 4 kWh.",
          },
          {
            label: "Step 3",
            explanation: "Multiply by the cost per kWh ($0.13): 4 kWh × $0.13 = $0.52.",
          },
        ],
        result: "The estimated cost to send 1,000 emails is $0.52.",
      }}
      relatedCalculators={[
        { title: "Dog Zoomies Energy Release Meter", url: "/funny/dog-zoomies-energy-meter", icon: "🐈" },
        { title: "Tab Overload Anxiety Score", url: "/funny/tab-overload-anxiety-score", icon: "💻" },
        { title: "Meme Virality Calculator", url: "/funny/meme-virality-calculator", icon: "🤪" },
        { title: "Medical Tourism Cost Saver", url: "/funny/medical-tourism-cost-saver", icon: "🤪" },
        { title: "First-Date Awkwardness Meter", url: "/funny/first-date-awkwardness-meter", icon: "❤️" },
        { title: "Life Value Estimator (Worth in Tacos)", url: "/funny/life-value-in-tacos", icon: "🍩" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}