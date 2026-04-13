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
  type InputsState = {
    unit: "imperial" | "metric";
    price: string;
    rate: string;
    term: string;
    leasePayment: string;
    leaseTerm: string;
    leaseResidual: string;
  };

  const resultsRef = useRef<HTMLDivElement>(null);
  const [inputs, setInputs] = useState<InputsState>({
    unit: "imperial",
    price: "",
    rate: "",
    term: "",
    leasePayment: "",
    leaseTerm: "",
    leaseResidual: "",
  });

  const handleInputChange = (field: keyof InputsState, value: string) => {
    if (field === "unit") {
      setInputs((prev) => ({ ...prev, unit: value as InputsState["unit"] }));
      return;
    }

    const normalized = value.replace(",", ".");
    if (/^\d*\.?\d*$/.test(normalized)) {
      setInputs((prev) => ({ ...prev, [field]: normalized }));
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
      question: "What is the main difference between leasing and buying a car?",
      answer: "Leasing means you rent a vehicle for a fixed period (typically 2-4 years), while buying means you own the car outright or finance it through a loan. With leasing, you make monthly payments but have no ownership equity and must return the vehicle at lease end. With buying, your monthly loan payments build equity, and you own the asset once paid off, though you're responsible for all maintenance and repairs.",
    },
    {
      question: "How does the lease vs buy calculator determine which option is cheaper?",
      answer: "The calculator compares the total cost of ownership over a set period by adding lease payments, insurance, registration, and maintenance costs against purchase price, down payment, loan interest, insurance, maintenance, and depreciation. It factors in variables like the vehicle price (typically $25,000–$50,000 for mid-range cars), lease money factor (0.0015–0.0030), residual value (typically 40%–65% after 3 years), and interest rates (currently 6%–9% for auto loans as of 2024). The option with the lower total cost is highlighted as the more economical choice.",
    },
    {
      question: "What lease money factor should I use in the calculator?",
      answer: "A lease money factor typically ranges from 0.0015 to 0.0030, with lower factors indicating better lease deals. To convert it to an APR equivalent, multiply by 2,400 (for example, 0.0020 × 2,400 = 4.8% APR). Most manufacturers' finance subsidiaries offer money factors between 0.0018–0.0025 for well-qualified lessees, while subprime lessees may see factors above 0.0028. Check your lease agreement or dealer quote to input the actual money factor for your situation.",
    },
    {
      question: "How should I estimate residual value for the buy option?",
      answer: "Residual value is what a car is worth at the end of the loan term, typically expressed as a percentage of the original price. Industry benchmarks show vehicles retain 40%–50% of value after 3 years and 25%–35% after 5 years, though luxury and high-demand vehicles may retain 50%–65%. Use resources like Kelley Blue Book or NADA Guides to research the specific make and model's historical residual values. Plugging in realistic residual values (e.g., $15,000 for a $30,000 car after 5 years) ensures accurate buy-option calculations.",
    },
    {
      question: "Should I include maintenance costs in the lease vs buy calculation?",
      answer: "Yes, maintenance is critical to the comparison. Lease agreements typically include manufacturer-covered maintenance for 2–4 years (often unlimited mileage for routine service), while ownership requires you to cover all repairs after the warranty expires. Buying a vehicle can cost $1,000–$2,500 annually in maintenance and repairs after year 3, depending on the make and model. The calculator should account for warranty coverage periods and estimated out-of-pocket maintenance to give a true total cost picture.",
    },
    {
      question: "What mileage limits should I assume for a lease?",
      answer: "Standard lease agreements include 10,000–15,000 miles annually, with most dealerships offering 12,000 miles per year as the baseline. Excess mileage typically costs $0.15–$0.30 per mile, meaning exceeding limits by just 5,000 miles could add $750–$1,500 to your lease-end bill. If you drive &gt;15,000 miles yearly, buying usually becomes more economical because there are no mileage penalties. Input your actual or expected annual mileage into the calculator, including excess mileage overage charges if applicable.",
    },
    {
      question: "How do interest rates affect the buy vs lease decision?",
      answer: "Auto loan interest rates directly increase the total cost of buying; rates in 2024 range from 4.99% for highly qualified borrowers to 9%+ for subprime buyers. A $35,000 car financed at 5% over 60 months costs approximately $9,350 in interest, versus $9,800 at 7%. Since lease money factors are typically lower than auto loan APRs (0.0020 vs. 6%–7%), leasing becomes more attractive when buy rates are high. Use current market rates in the calculator—check Bankrate or your bank's rate offerings—to reflect real financing costs.",
    },
    {
      question: "What insurance costs should I input for leased vs. owned vehicles?",
      answer: "Leased vehicles typically require higher coverage limits (usually liability of 100/300/100 or higher) and comprehensive/collision with low deductibles ($500 or less), costing $1,200–$1,800 annually depending on location and driving record. Owned vehicles may require only state minimum coverage ($15,000–$25,000 liability), costing $800–$1,200 yearly. Gap insurance for leases (typically $10–$20 monthly) is often included but may be an add-on for financed purchases. Input your insurer's actual quotes or use average rates for your state and vehicle type in the calculator.",
    },
    {
      question: "How does the calculator handle down payments and capitalized cost reductions?",
      answer: "For buying, the down payment (typically 10%–20% of vehicle price, or $3,000–$10,000) reduces the loan amount and lowers total interest paid. For leasing, a capitalized cost reduction (cap cost reduction) works similarly—paying $2,000–$5,000 upfront lowers monthly payments by roughly $40–$75 per month. However, cap cost reductions are often poor value since you don't build equity and may lose that money to wear-and-tear charges. The calculator should show how larger down payments reduce buy financing costs while cap cost reductions may not justify their expense in leasing scenarios.",
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Lease vs Buy Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Lease vs Buy Calculator helps you compare the total cost of ownership over a specific time period, accounting for all major expenses from monthly payments to maintenance and insurance. This tool is essential because lease and purchase decisions involve multiple variables that aren't immediately obvious—depreciation, excess mileage charges, warranty coverage, and interest rates all significantly impact your final cost. By inputting your specific situation, you'll see which option saves you money and aligns with your driving habits.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To get accurate results, gather these key inputs: (1) vehicle price or lease cap cost (the amount being financed or leased), (2) down payment for purchase or cap cost reduction for lease, (3) loan term and interest rate, or lease term and money factor, (4) your expected annual mileage, (5) insurance quotes for both scenarios, and (6) estimated maintenance costs. The calculator uses these figures to project total ownership cost, factoring in depreciation, residual value, excess mileage fees, and all recurring expenses. Be honest about mileage and maintenance expectations—underestimating these inputs will skew results in favor of leasing.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results by comparing the total cost of ownership line at your intended holding period (typically 3–5 years). The calculator shows a month-by-month or annual breakdown, revealing when costs favor buying versus leasing—for example, leasing may be cheaper through year 3, but buying becomes advantageous after year 4 when loan payments end. Pay special attention to the break-even point and sensitivity to mileage overage charges if you're a high-mileage driver. Use the calculator to test different scenarios (higher interest rates, more mileage, premium insurance) to see how changes affect your decision.</p>
        </div>
      </section>

      {/* TABLE: Average Monthly Costs: Lease vs. Buy (3-Year Term) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Monthly Costs: Lease vs. Buy (3-Year Term)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares typical monthly out-of-pocket costs for leasing versus buying a mid-range vehicle ($35,000 starting price) over a 3-year period.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lease (per month)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Buy (per month)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vehicle Payment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$385</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$635</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Insurance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$135</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$105</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maintenance & Repairs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0–$50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75–$150</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Registration & Taxes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fuel (estimated)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total Monthly Cost</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$695–$745</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,040–$1,115</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Lease payment assumes 0.0022 money factor and $35,000 cap cost; buy assumes 6% APR, $7,000 down payment, and $35,000 vehicle price. Actual costs vary by location, vehicle, and driving habits.</p>
      </section>

      {/* TABLE: Total Cost of Ownership: 3-Year vs. 5-Year Scenarios */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Total Cost of Ownership: 3-Year vs. 5-Year Scenarios</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Total out-of-pocket costs for lease versus purchase over different ownership periods, assuming typical annual mileage of 12,000 miles.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Scenario</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lease Total Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Buy Total Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3-Year, 36,000 Miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$35,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lease by $7,600</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5-Year, 60,000 Miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$42,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$38,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Buy by $4,300</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5-Year w/ Excess Mileage (75,000)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$46,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$38,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Buy by $7,900</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5-Year w/ Major Repairs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$42,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$42,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Equal</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Buy assumes $35,000 vehicle, 6% APR financing, $7,000 down, 50% residual value. Lease assumes $385/month with 12,000 annual miles. Excess mileage charged at $0.25/mile. Repair costs estimated at $1,500 in year 4–5.</p>
      </section>

      {/* TABLE: Auto Loan Interest Rates & Monthly Payment Impact (2024–2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Auto Loan Interest Rates & Monthly Payment Impact (2024–2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">How APR affects monthly payments and total interest on a $28,000 financed vehicle over 60 months.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">APR</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest Paid</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$517</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,041</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,041</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5.49%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$540</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,798</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,798</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$564</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,583</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$31,583</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8.49%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$588</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,384</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$32,384</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$612</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$33,200</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Based on $28,000 financed amount (typical after $7,000 down on a $35,000 vehicle). Rates reflect 2024–2025 averages; actual rates vary by credit score (excellent &lt;620, good 620–739, fair 740–799, excellent &gt;800).</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your actual annual mileage for 2–3 months before using the calculator—most drivers underestimate by 10%–20%, which can add $1,500–$3,000 in excess mileage charges on a lease. If you consistently drive &gt;15,000 miles per year, buying is almost always the better financial choice.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Negotiate the cap cost on a lease just as you would negotiate the purchase price on a car sale. A 5% reduction in cap cost ($1,750 on a $35,000 vehicle) saves approximately $30–$40 monthly on lease payments, adding up to $1,080–$1,440 over 36 months.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Input realistic insurance quotes from your actual insurer rather than using averages—rates vary dramatically by location, age, and driving record. Call your insurance agent for both lease and buy quotes to ensure the calculator reflects your true costs, not someone else's.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in the true cost of excess mileage charges ($0.15–$0.30 per mile adds up quickly—10,000 excess miles costs $1,500–$3,000) by being realistic about your driving patterns. If uncertain, add 2,000–3,000 buffer miles to your estimate to avoid underestimating lease costs.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Excess Mileage Overage Charges</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many lease calculators underestimate total cost because drivers don't account for excess mileage penalties, which typically cost $0.15–$0.30 per mile. A driver exceeding limits by just 5,000 miles pays $750–$1,500 at lease-end, a cost that dramatically shifts the lease vs. buy decision in favor of buying.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Annual Maintenance Costs for Owned Vehicles</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Buyers often assume minimal maintenance, but vehicles typically cost $1,000–$2,500 annually in repairs and maintenance after the warranty expires (usually 3–5 years). Forgetting to include these costs makes buying appear cheaper than it actually is, skewing the calculator results.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Outdated or Average Interest Rates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Auto loan rates fluctuate monthly and vary widely by credit score—using a generic 5% rate when your actual rate is 8% or 4% leads to significantly inaccurate buy-side calculations. Always input your actual pre-approved rate from your lender, not an industry average.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Excluding Registration, Taxes, and Documentation Fees</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Buyers often overlook registration renewal, sales tax, and documentation fees, which total $200–$500 annually depending on your state. These recurring costs are often omitted from quick mental math but should be included in the calculator for accurate total cost comparison.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the main difference between leasing and buying a car?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Leasing means you rent a vehicle for a fixed period (typically 2-4 years), while buying means you own the car outright or finance it through a loan. With leasing, you make monthly payments but have no ownership equity and must return the vehicle at lease end. With buying, your monthly loan payments build equity, and you own the asset once paid off, though you're responsible for all maintenance and repairs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the lease vs buy calculator determine which option is cheaper?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator compares the total cost of ownership over a set period by adding lease payments, insurance, registration, and maintenance costs against purchase price, down payment, loan interest, insurance, maintenance, and depreciation. It factors in variables like the vehicle price (typically $25,000–$50,000 for mid-range cars), lease money factor (0.0015–0.0030), residual value (typically 40%–65% after 3 years), and interest rates (currently 6%–9% for auto loans as of 2024). The option with the lower total cost is highlighted as the more economical choice.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What lease money factor should I use in the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A lease money factor typically ranges from 0.0015 to 0.0030, with lower factors indicating better lease deals. To convert it to an APR equivalent, multiply by 2,400 (for example, 0.0020 × 2,400 = 4.8% APR). Most manufacturers' finance subsidiaries offer money factors between 0.0018–0.0025 for well-qualified lessees, while subprime lessees may see factors above 0.0028. Check your lease agreement or dealer quote to input the actual money factor for your situation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I estimate residual value for the buy option?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Residual value is what a car is worth at the end of the loan term, typically expressed as a percentage of the original price. Industry benchmarks show vehicles retain 40%–50% of value after 3 years and 25%–35% after 5 years, though luxury and high-demand vehicles may retain 50%–65%. Use resources like Kelley Blue Book or NADA Guides to research the specific make and model's historical residual values. Plugging in realistic residual values (e.g., $15,000 for a $30,000 car after 5 years) ensures accurate buy-option calculations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include maintenance costs in the lease vs buy calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, maintenance is critical to the comparison. Lease agreements typically include manufacturer-covered maintenance for 2–4 years (often unlimited mileage for routine service), while ownership requires you to cover all repairs after the warranty expires. Buying a vehicle can cost $1,000–$2,500 annually in maintenance and repairs after year 3, depending on the make and model. The calculator should account for warranty coverage periods and estimated out-of-pocket maintenance to give a true total cost picture.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What mileage limits should I assume for a lease?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard lease agreements include 10,000–15,000 miles annually, with most dealerships offering 12,000 miles per year as the baseline. Excess mileage typically costs $0.15–$0.30 per mile, meaning exceeding limits by just 5,000 miles could add $750–$1,500 to your lease-end bill. If you drive &gt;15,000 miles yearly, buying usually becomes more economical because there are no mileage penalties. Input your actual or expected annual mileage into the calculator, including excess mileage overage charges if applicable.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do interest rates affect the buy vs lease decision?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Auto loan interest rates directly increase the total cost of buying; rates in 2024 range from 4.99% for highly qualified borrowers to 9%+ for subprime buyers. A $35,000 car financed at 5% over 60 months costs approximately $9,350 in interest, versus $9,800 at 7%. Since lease money factors are typically lower than auto loan APRs (0.0020 vs. 6%–7%), leasing becomes more attractive when buy rates are high. Use current market rates in the calculator—check Bankrate or your bank's rate offerings—to reflect real financing costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What insurance costs should I input for leased vs. owned vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Leased vehicles typically require higher coverage limits (usually liability of 100/300/100 or higher) and comprehensive/collision with low deductibles ($500 or less), costing $1,200–$1,800 annually depending on location and driving record. Owned vehicles may require only state minimum coverage ($15,000–$25,000 liability), costing $800–$1,200 yearly. Gap insurance for leases (typically $10–$20 monthly) is often included but may be an add-on for financed purchases. Input your insurer's actual quotes or use average rates for your state and vehicle type in the calculator.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator handle down payments and capitalized cost reductions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For buying, the down payment (typically 10%–20% of vehicle price, or $3,000–$10,000) reduces the loan amount and lowers total interest paid. For leasing, a capitalized cost reduction (cap cost reduction) works similarly—paying $2,000–$5,000 upfront lowers monthly payments by roughly $40–$75 per month. However, cap cost reductions are often poor value since you don't build equity and may lose that money to wear-and-tear charges. The calculator should show how larger down payments reduce buy financing costs while cap cost reductions may not justify their expense in leasing scenarios.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://consumer.ftc.gov/articles/how-lease-or-buy-car" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Trade Commission: Leasing vs. Buying a Car</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official FTC guidance on evaluating lease versus purchase decisions, including how to read lease agreements and understand cap cost and money factors.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/loans/auto-loans/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate: Auto Loan Rates & Calculator</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Current auto loan rates by credit score and loan term, plus tools to compare financing options and understand how APR affects total cost.</p>
          </li>
          <li>
            <a href="https://www.kbb.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Kelley Blue Book: Vehicle Residual Value & Depreciation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry-standard resource for vehicle valuations, residual percentages, and depreciation trends essential for estimating a car's worth at lease or loan end.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/cars/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports: Car Ownership Costs & Reliability</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed ownership cost data, maintenance estimates, and reliability ratings by vehicle model to inform realistic maintenance and repair projections.</p>
          </li>
        </ul>
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
