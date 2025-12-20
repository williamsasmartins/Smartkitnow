import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Smile, Frown, Meh, Ghost, Skull, Coffee, Utensils, Gamepad2, Cat, Dog, Zap, Heart, Calculator, Info, RotateCcw, AlertTriangle, BookOpen, ExternalLink, Flame, Clock, Ticket, Plane, Globe, Sparkles, Lightbulb } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EmailCostEstimatorEnergyCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    emailSize: 75, // in kilobytes by default
    emailsPerDay: 1,
    energyCostPerKwh: 0.13, // average US cost per kWh in $
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Energy consumption per email is estimated based on research by McAfee and others,
   * which suggests an average email of 1MB consumes about 0.3 Wh (watt-hours) of energy.
   * We scale linearly by email size in KB.
   * 1 Wh = 0.001 kWh.
   */
  const results = useMemo(() => {
    const { emailSize, emailsPerDay, energyCostPerKwh } = inputs;

    // Clamp inputs to sensible minimums
    const sizeKb = Math.max(1, Number(emailSize));
    const dailyEmails = Math.max(1, Number(emailsPerDay));
    const costPerKwh = Math.max(0.01, Number(energyCostPerKwh));

    // Energy per email in Wh (watt-hours)
    // 1MB = 1024 KB consumes ~0.3 Wh, so per KB = 0.3 / 1024 Wh
    const energyPerEmailWh = 0.3 / 1024 * sizeKb;

    // Total daily energy in Wh
    const totalEnergyWh = energyPerEmailWh * dailyEmails;

    // Convert Wh to kWh
    const totalEnergyKwh = totalEnergyWh / 1000;

    // Cost = energy (kWh) * cost per kWh ($)
    const totalCost = totalEnergyKwh * costPerKwh;

    // Format results
    const formattedEnergy = totalEnergyKwh.toFixed(6);
    const formattedCost = totalCost.toFixed(6);

    // Witty remarks based on cost
    let color = "text-green-600";
    let icon = <Smile />;
    let subtext = "Your emails are energy-efficient! Keep it up.";

    if (totalCost > 0.01) {
      color = "text-yellow-600";
      icon = <Meh />;
      subtext = "Hmm, your email habits could use some green tweaks.";
    }
    if (totalCost > 0.1) {
      color = "text-red-600";
      icon = <Frown />;
      subtext = "Whoa! That's a pricey inbox. Maybe fewer attachments?";
    }

    return {
      value: `$${formattedCost}`,
      label: `Daily Cost to Send ${dailyEmails} Email${dailyEmails > 1 ? "s" : ""}`,
      subtext: `${formattedEnergy} kWh consumed daily`,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How much energy does sending an email really consume?",
      answer:
        "You might think an email is just a few bytes zipping through cyberspace, but it actually requires energy at multiple stages: from your device, the network infrastructure, to the recipient’s device. Studies estimate that a typical 1MB email consumes about 0.3 watt-hours of energy, which might seem tiny, but multiply that by billions of emails daily, and the impact is significant. Understanding this helps us appreciate the hidden environmental cost behind our digital habits.",
    },
    {
      question: "Why does email size affect energy consumption?",
      answer:
        "The larger your email—especially with attachments like images or videos—the more data needs to be transmitted and stored, which increases energy use. Think of it like sending a postcard versus a heavy parcel: the heavier the parcel, the more fuel it takes to deliver. Similarly, bigger emails require more server processing and network bandwidth, which translates to higher electricity consumption.",
    },
    {
      question: "Can reducing the number of emails I send really help the environment?",
      answer:
        "Absolutely! While a single email's energy use is small, the cumulative effect of billions of emails adds up. By cutting down on unnecessary emails, especially those with large attachments or excessive recipients, you reduce the demand on data centers and networks. It’s a small habit that contributes to a greener digital footprint, much like turning off lights when you leave a room.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Globe className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric</SelectItem>
            <SelectItem value="imperial">Imperial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Email Size Input */}
      <div>
        <Label htmlFor="emailSize" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Email Size ({inputs.unit === "metric" ? "KB" : "KB"})
        </Label>
        <Input
          id="emailSize"
          type="number"
          min={1}
          step={1}
          value={inputs.emailSize}
          onChange={(e) => handleInputChange("emailSize", e.target.value)}
          placeholder="Enter average email size"
        />
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Typical emails range from 10 KB (text-only) to 5000 KB (heavy attachments).
        </p>
      </div>

      {/* Emails Per Day Input */}
      <div>
        <Label htmlFor="emailsPerDay" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Emails Sent Per Day
        </Label>
        <Input
          id="emailsPerDay"
          type="number"
          min={1}
          step={1}
          value={inputs.emailsPerDay}
          onChange={(e) => handleInputChange("emailsPerDay", e.target.value)}
          placeholder="How many emails do you send daily?"
        />
      </div>

      {/* Energy Cost Input */}
      <div>
        <Label htmlFor="energyCostPerKwh" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Energy Cost per kWh ($)
        </Label>
        <Input
          id="energyCostPerKwh"
          type="number"
          min={0.01}
          step={0.01}
          value={inputs.energyCostPerKwh}
          onChange={(e) => handleInputChange("energyCostPerKwh", e.target.value)}
          placeholder="Average electricity cost"
        />
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Use your local electricity rate. For example, the US average is about $0.13 per kWh.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {}}
          aria-label="Calculate cost"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ unit: "metric", emailSize: 75, emailsPerDay: 1, energyCostPerKwh: 0.13 })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
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
          Every email you send travels through a complex digital ecosystem that consumes electricity at every step. From the moment you hit “send,” your message is processed by your device, transmitted across network servers, stored in data centers, and finally downloaded by the recipient’s device. This chain of events requires energy, primarily from electricity generated by power plants, which often rely on fossil fuels. Calculating the energy cost of sending an email helps us grasp the environmental footprint of our daily digital communications.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The average office worker receives around 121 emails per day, which collectively consume roughly 136 kWh of electricity annually—enough to power a typical American household for about five days. This surprising fact highlights how even our digital habits contribute to energy consumption and carbon emissions. The first email was sent in 1971 by Ray Tomlinson, who also introduced the iconic “@” symbol, forever changing communication.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Start by entering the average size of your emails in kilobytes (KB). If you mostly send text-only emails, this number will be low, but if you frequently attach images or documents, expect a higher value. Next, input how many emails you send daily to estimate your total energy consumption and cost. Finally, enter your local electricity cost per kilowatt-hour to get a personalized estimate of your daily email energy expense. Hit “Calculate” to see the results and consider how small changes in your emailing habits can add up to big energy savings.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Fun Reads</h2>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.mcafee.com/blogs/consumer/consumer-threat-notices/the-environmental-impact-of-email/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              McAfee: The Environmental Impact of Email <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A detailed analysis of how emails contribute to energy consumption and carbon emissions worldwide.
            </p>
          </li>
          <li>
            <a
              href="https://www.energy.gov/eere/articles/how-much-energy-does-your-email-use"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              U.S. Department of Energy: How Much Energy Does Your Email Use? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explains the energy footprint of digital communication and tips to reduce your digital carbon footprint.
            </p>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Email"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Wikipedia: Email History <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explore the fascinating origin story of email and how it revolutionized communication.
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
        formula: "Cost = (Email Size in KB × 0.3 Wh / 1024 KB × Number of Emails) ÷ 1000 × Energy Cost per kWh",
        variables: [
          { symbol: "Email Size in KB", description: "Average size of one email in kilobytes" },
          { symbol: "0.3 Wh / 1024 KB", description: "Energy consumption per KB of email" },
          { symbol: "Number of Emails", description: "Emails sent per day" },
          { symbol: "Energy Cost per kWh", description: "Electricity cost in dollars per kilowatt-hour" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You send 10 emails daily, each averaging 500 KB, and your electricity cost is $0.13 per kWh.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate energy per email: 500 KB × 0.3 Wh / 1024 KB ≈ 0.146 Wh per email.",
          },
          {
            label: "2",
            explanation: "Total daily energy: 0.146 Wh × 10 emails = 1.46 Wh.",
          },
          {
            label: "3",
            explanation: "Convert to kWh: 1.46 Wh ÷ 1000 = 0.00146 kWh.",
          },
          {
            label: "4",
            explanation: "Calculate cost: 0.00146 kWh × $0.13 = $0.00019 per day.",
          },
        ],
        result: "Your daily cost to send these emails is approximately $0.00019.",
      }}
      relatedCalculators={[
        { title: "Plant Watering Procrastination Index", url: "/funny/plant-watering-procrastination-index", icon: "🤪" },
        { title: "Love Meter (Name Compatibility)", url: "/funny/love-meter", icon: "❤️" },
        { title: "Meetings Wasted-Time Counter", url: "/funny/meetings-wasted-time-counter", icon: "💻" },
        { title: "Black Hole Sun Impact Calculator", url: "/funny/black-hole-sun-impact", icon: "🧟" },
        { title: "Cat 'Ignore-o-Meter'", url: "/funny/cat-ignore-o-meter", icon: "🐈" },
        { title: "Death by Caffeine (Max Safe Intake)", url: "/funny/death-by-caffeine", icon: "☕" },
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