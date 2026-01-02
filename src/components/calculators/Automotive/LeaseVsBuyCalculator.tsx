import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Car, DollarSign, AlertTriangle, BookOpen, ExternalLink, Settings, TrendingDown, TrendingUp } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LeaseVsBuyCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [inputs, setInputs] = useState({
    unit: "imperial",
    price: "",
    rate: "",
    term: "",
    leasePayment: "",
    leaseTerm: "",
    leaseResidual: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Permite digitação livre de números e decimais
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs(prev => ({ ...prev, [field]: value }));
    }
  };

  const scrollToResults = () => {
    // Pequeno delay para garantir que o DOM atualizou
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  function calculateLoanPayment(P: number, annualRate: number, n: number) {
    if (annualRate === 0) return P / n;
    const r = annualRate / 12 / 100;
    return (P * r) / (1 - Math.pow(1 + r, -n));
  }

  const results = useMemo(() => {
    const price = parseFloat(inputs.price);
    const rate = parseFloat(inputs.rate);
    const term = parseInt(inputs.term);
    const leasePayment = parseFloat(inputs.leasePayment);
    const leaseTerm = parseInt(inputs.leaseTerm);
    const leaseResidual = parseFloat(inputs.leaseResidual);

    if (
      isNaN(price) || price <= 0 ||
      isNaN(rate) || rate < 0 ||
      isNaN(term) || term <= 0 ||
      isNaN(leasePayment) || leasePayment < 0 ||
      isNaN(leaseTerm) || leaseTerm <= 0 ||
      isNaN(leaseResidual) || leaseResidual < 0
    ) {
      return null;
    }

    const monthlyLoanPayment = calculateLoanPayment(price, rate, term);
    const totalBuyCost = monthlyLoanPayment * term;
    // Custo Total do Lease = Mensalidades + Valor Residual (se comprar no final)
    const totalLeaseCost = (leasePayment * leaseTerm) + leaseResidual;
    const diff = totalBuyCost - totalLeaseCost;

    const formatCurrency = (v: number) =>
      v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

    const isLeaseCheaper = diff > 0;

    return {
      verdict: isLeaseCheaper ? "Leasing is Cheaper" : "Buying is Cheaper",
      savings: Math.abs(diff),
      buyTotal: totalBuyCost,
      leaseTotal: totalLeaseCost,
      buyMonthly: monthlyLoanPayment,
      leaseMonthly: leasePayment,
      formattedSavings: formatCurrency(Math.abs(diff)),
      feedback: isLeaseCheaper
        ? "Leasing has a lower total cash flow over this term, assuming you buy the car at the end."
        : "Buying saves you money in the long run compared to this lease deal."
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Which is better financially: Leasing or Buying?",
      answer: "Buying is usually better financially in the long term because you own the asset once the loan is paid off. Leasing is often cheaper in the short term (monthly cash flow) but you have no equity at the end unless you pay the residual value."
    },
    {
      question: "What is the Residual Value?",
      answer: "The residual value is the pre-determined price you can buy the car for at the end of a lease. A higher residual value usually means lower monthly lease payments."
    },
    {
      question: "Does mileage matter?",
      answer: "Yes, for leasing. Leases have strict mileage limits (e.g., 10,000 miles/year). Exceeding them results in heavy penalties. When buying, high mileage only affects resale value, not your contract."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Scenario",
    scenario: "Comparing a $35,000 car purchase (60 months loan) vs. a $400/month lease (36 months) with a $20k residual buyout.",
    steps: [
      { label: "1. Buy Cost", explanation: "Loan payments total approx $39,600 over 5 years." },
      { label: "2. Lease Cost", explanation: "($400 × 36) + $20,000 buyout = $34,400 total." },
      { label: "3. Verdict", explanation: "In this specific scenario, the Lease-to-Buy path is cheaper by ~$5,200." }
    ],
    result: "Winner: Leasing (in this specific math case)."
  };

  const references = [
    { title: "Edmunds: Lease vs Buy Guide", description: "In-depth financial comparison.", url: "https://www.edmunds.com/" },
    { title: "Consumer Reports", description: "Unbiased car buying advice.", url: "https://www.consumerreports.org/" }
  ];

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector (Optional visual tweak) */}
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[130px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial ($)</SelectItem>
            <SelectItem value="metric">Metric (€/£)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BUY SECTION */}
        <div className="space-y-4 p-5 border rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-700"><DollarSign className="w-5 h-5"/></div>
            <h3 className="font-bold text-blue-800 dark:text-blue-300">Buying Option</h3>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-500 uppercase">Purchase Price</Label>
              <Input type="text" inputMode="decimal" value={inputs.price} onChange={(e) => handleInputChange("price", e.target.value)} placeholder="35000" className="bg-white dark:bg-slate-950" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Rate (%)</Label>
                <Input type="text" inputMode="decimal" value={inputs.rate} onChange={(e) => handleInputChange("rate", e.target.value)} placeholder="5.0" className="bg-white dark:bg-slate-950" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Term (Mo)</Label>
                <Input type="text" inputMode="numeric" value={inputs.term} onChange={(e) => handleInputChange("term", e.target.value)} placeholder="60" className="bg-white dark:bg-slate-950" />
              </div>
            </div>
          </div>
        </div>

        {/* LEASE SECTION */}
        <div className="space-y-4 p-5 border rounded-xl bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-700"><Car className="w-5 h-5"/></div>
            <h3 className="font-bold text-green-800 dark:text-green-300">Leasing Option</h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-500 uppercase">Monthly Payment</Label>
              <Input type="text" inputMode="decimal" value={inputs.leasePayment} onChange={(e) => handleInputChange("leasePayment", e.target.value)} placeholder="400" className="bg-white dark:bg-slate-950" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Term (Mo)</Label>
                <Input type="text" inputMode="numeric" value={inputs.leaseTerm} onChange={(e) => handleInputChange("leaseTerm", e.target.value)} placeholder="36" className="bg-white dark:bg-slate-950" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Residual</Label>
                <Input type="text" inputMode="decimal" value={inputs.leaseResidual} onChange={(e) => handleInputChange("leaseResidual", e.target.value)} placeholder="20000" className="bg-white dark:bg-slate-950" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-bold shadow-lg shadow-blue-200 dark:shadow-none" 
        onClick={scrollToResults}
      >
        Calculate Comparison
      </Button>

      {/* RESULTS ANCHOR */}
      <div ref={resultsRef} className="scroll-mt-24">
        {results && (
          <div className="space-y-4 mt-8 animate-in fade-in slide-in-from-bottom-4">
            {/* MAIN VERDICT CARD */}
            <Card className={`border-2 ${results.verdict.includes("Leasing") ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-blue-500 bg-blue-50 dark:bg-blue-950/30"}`}>
              <CardContent className="p-6 text-center">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">Financial Verdict</span>
                <div className="text-2xl md:text-4xl font-extrabold my-2 text-slate-900 dark:text-white">
                  {results.verdict}
                </div>
                <div className="flex items-center justify-center gap-2 text-lg font-medium">
                  <span>Saves</span>
                  <span className={`px-2 py-1 rounded text-white ${results.verdict.includes("Leasing") ? "bg-green-600" : "bg-blue-600"}`}>
                    {results.formattedSavings}
                  </span>
                  <span>total</span>
                </div>
              </CardContent>
            </Card>

            {/* DETAIL CARDS */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-50 dark:bg-slate-900">
                <CardContent className="p-4 text-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Buy Total Cost</div>
                  <div className="text-lg md:text-2xl font-bold text-blue-600">
                    {results.buyTotal.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Owning Asset</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 dark:bg-slate-900">
                <CardContent className="p-4 text-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Lease Total Cost</div>
                  <div className="text-lg md:text-2xl font-bold text-green-600">
                    {results.leaseTotal.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">With Buyout</div>
                </CardContent>
              </Card>
            </div>

            <p className="text-center text-sm text-slate-500 italic px-4">
              {results.feedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li><strong>Fill in the Buying Section:</strong> Enter the full vehicle price, your expected interest rate, and the loan term (e.g., 60 months).</li>
          <li><strong>Fill in the Leasing Section:</strong> Enter the monthly payment quote, the lease term, and the residual value (the price to buy the car at the end).</li>
          <li><strong>Compare:</strong> The calculator will sum up all payments for both paths and tell you which one requires less total cash outflow.</li>
        </ol>
      </section>

      {/* FIXED SAFETY BOX COLOR */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-900 dark:text-amber-100">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p><strong>Hidden Fees:</strong> Leases often have acquisition fees ($500+) and disposition fees that aren't in the monthly payment.</p>
          <p><strong>Mileage Penalties:</strong> If you drive more than 10k-12k miles/year, leasing can become extremely expensive due to over-mileage fees.</p>
          <p><strong>Ownership Equity:</strong> This calculator compares cash flow. Remember that with buying, you own an asset (the car) at the end, which has value. With leasing, you own nothing unless you pay the residual.</p>
        </div>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" /> References
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-600">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Lease vs Buy Calculator"
      description="Compare the financial difference between leasing and buying a car. Calculate monthly payments, total costs, and residual value impact."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "faq", label: "FAQ" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
