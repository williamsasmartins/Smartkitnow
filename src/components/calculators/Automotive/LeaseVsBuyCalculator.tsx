import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Car, DollarSign, AlertTriangle, BookOpen, ExternalLink, Settings } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LeaseVsBuyCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null); // Referência para scroll
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
    // Validação simples para permitir digitação
    if (/^\d*\.?\d*$/.test(value)) {
        setInputs(prev => ({ ...prev, [field]: value }));
    }
  };

  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
      return null; // Retorna null se incompleto para não mostrar card vazio
    }

    const monthlyLoanPayment = calculateLoanPayment(price, rate, term);
    const totalBuyCost = monthlyLoanPayment * term;
    const totalLeaseCost = leasePayment * leaseTerm + leaseResidual;
    const diff = totalBuyCost - totalLeaseCost;

    const formatCurrency = (v: number) =>
      v.toLocaleString("en-US", { style: "currency", currency: "USD" });

    return {
      primary: diff > 0 ? "Leasing is Cheaper" : diff < 0 ? "Buying is Cheaper" : "Costs Are Equal",
      secondary: `Buy: ${formatCurrency(totalBuyCost)} vs Lease: ${formatCurrency(totalLeaseCost)}`,
      details: `Savings: ${formatCurrency(Math.abs(diff))} over the term.`,
      buyMonthly: formatCurrency(monthlyLoanPayment),
      feedback: diff > 0
        ? "Leasing costs less total cash, but you own nothing at the end unless you pay the residual."
        : "Buying costs less total cash and you own the asset at the end."
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What factors should I consider when deciding to lease or buy a car?",
      answer: "Consider your driving habits (mileage), monthly budget, and desire for ownership. Leasing offers lower monthly payments and new cars more often but has mileage limits. Buying leads to ownership and freedom from mileage restrictions but has higher initial monthly costs."
    },
    {
      question: "What is the 'Residual Value'?",
      answer: "The residual value is the estimated value of the car at the end of the lease term. It is set by the leasing company. If you decide to buy the car when the lease is over, this is the price you will pay."
    },
    {
      question: "Does buying always save money in the long run?",
      answer: "Generally, yes. Once the loan is paid off, you own the car and have no monthly payments, reducing long-term costs significantly compared to perpetual leasing."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario: "Comparing a $35,000 car purchase (5% rate, 60 months) vs. a $400/month lease (36 months, $20k residual).",
    steps: [
      { label: "1. Buy Cost", explanation: "$660/mo for 60 months = $39,600 total." },
      { label: "2. Lease Cost", explanation: "($400 x 36 months) + $20,000 residual = $34,400 total." },
      { label: "3. Verdict", explanation: "Leasing is cheaper by $5,200 if you just look at cash flow over this specific period." }
    ],
    result: "Lease saves $5,200 (but zero equity)."
  };

  const references = [
    { title: "Edmunds Lease vs Buy Guide", description: "In-depth comparison of financing options.", url: "https://www.edmunds.com/" },
    { title: "Consumer Reports", description: "Unbiased car buying advice.", url: "https://www.consumerreports.org/" }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (US)</SelectItem>
            <SelectItem value="metric">Metric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BUY SECTION */}
        <div className="space-y-4 p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
            <h3 className="font-bold text-blue-700 flex items-center gap-2"><DollarSign className="w-4 h-4"/> Buying Details</h3>
            <div className="space-y-2">
            <Label>Purchase Price ($)</Label>
            <Input type="text" inputMode="decimal" value={inputs.price} onChange={(e) => handleInputChange("price", e.target.value)} placeholder="35000" />
            </div>
            <div className="space-y-2">
            <Label>Interest Rate (%)</Label>
            <Input type="text" inputMode="decimal" value={inputs.rate} onChange={(e) => handleInputChange("rate", e.target.value)} placeholder="5.0" />
            </div>
            <div className="space-y-2">
            <Label>Loan Term (Months)</Label>
            <Input type="text" inputMode="numeric" value={inputs.term} onChange={(e) => handleInputChange("term", e.target.value)} placeholder="60" />
            </div>
        </div>

        {/* LEASE SECTION */}
        <div className="space-y-4 p-4 border rounded-lg bg-green-50/50 dark:bg-green-900/10">
            <h3 className="font-bold text-green-700 flex items-center gap-2"><Car className="w-4 h-4"/> Leasing Details</h3>
            <div className="space-y-2">
            <Label>Monthly Payment ($)</Label>
            <Input type="text" inputMode="decimal" value={inputs.leasePayment} onChange={(e) => handleInputChange("leasePayment", e.target.value)} placeholder="400" />
            </div>
            <div className="space-y-2">
            <Label>Lease Term (Months)</Label>
            <Input type="text" inputMode="numeric" value={inputs.leaseTerm} onChange={(e) => handleInputChange("leaseTerm", e.target.value)} placeholder="36" />
            </div>
            <div className="space-y-2">
            <Label>Residual Value ($)</Label>
            <Input type="text" inputMode="decimal" value={inputs.leaseResidual} onChange={(e) => handleInputChange("leaseResidual", e.target.value)} placeholder="20000" />
            </div>
        </div>
      </div>

      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" 
        onClick={scrollToResults} // <--- AÇÃO DE SCROLL ADICIONADA
      >
        <Car className="mr-2 h-5 w-5" /> Calculate Comparison
      </Button>

      {/* Âncora para o scroll */}
      <div ref={resultsRef}>
        {results && (
            <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md animate-in fade-in slide-in-from-bottom-4">
            <CardContent className="p-6 text-center">
                <span className="text-sm font-semibold text-slate-500 uppercase">Verdict</span>
                <div className="text-3xl md:text-4xl font-extrabold text-blue-600 my-3">{results.primary}</div>
                <div className="text-lg font-bold mt-2 text-slate-700 dark:text-slate-300">{results.secondary}</div>
                <p className="text-sm text-slate-500 mt-2">{results.details}</p>
                <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded border text-sm text-left">
                    <p className="mb-1"><strong>Buy Monthly:</strong> {results.buyMonthly}</p>
                    <p className="italic text-slate-600 dark:text-slate-400">{results.feedback}</p>
                </div>
            </CardContent>
            </Card>
        )}
      </div>
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>Enter the full <strong>Purchase Price</strong> and financing details (Rate/Term) for the buying option.</li>
          <li>Enter the quoted <strong>Lease Payment</strong>, term, and the residual value (buyout price) for the leasing option.</li>
          <li>Click <strong>Calculate Comparison</strong> to see which method costs less out-of-pocket over the specified timeframe.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" /> Guide to Leasing vs Buying
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>Leasing is like renting: lower monthly payments, but you own nothing at the end. Buying builds equity, but payments are higher and you are responsible for long-term repairs.</p>
        </div>
      </section>

      {/* CORREÇÃO DO CSS DA CAIXA AMARELA */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-900 dark:text-amber-100">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100"> {/* Texto escuro forçado */}
          <p><strong>1. Ignoring Mileage Limits:</strong> Leases have strict mileage caps (e.g., 10k miles/year). Going over is expensive.</p>
          <p><strong>2. Focusing Only on Monthly Payment:</strong> A lower lease payment might cost you more in the long run if you have no asset to trade in later.</p>
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
              <a href={ref.url} className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
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
      description="Compare the true cost of leasing versus buying a car with this financial tool."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Guide" },
        { id: "mistakes", label: "Mistakes" },
        { id: "faq", label: "FAQ" }
      ]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}
