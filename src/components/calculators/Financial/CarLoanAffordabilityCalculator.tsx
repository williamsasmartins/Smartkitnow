import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalculatorInputs {
  monthlyIncome: number;
  monthlyDebt: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  tradeInValue: number;
  salesTax: number;
}

const CarLoanAffordabilityCalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyIncome: 5000,
    monthlyDebt: 500,
    downPayment: 5000,
    interestRate: 6.5,
    loanTerm: 60,
    tradeInValue: 0,
    salesTax: 7,
  });

  const results = useMemo(() => {
    const { monthlyIncome, monthlyDebt, downPayment, interestRate, loanTerm, tradeInValue, salesTax } = inputs;
    const maxMonthlyPayment = Math.max(0, monthlyIncome * 0.2 - monthlyDebt);
    const monthlyRate = interestRate / 100 / 12;
    let maxLoanAmount = 0;
    if (monthlyRate > 0) {
      maxLoanAmount = (maxMonthlyPayment * (1 - Math.pow(1 + monthlyRate, -loanTerm))) / monthlyRate;
    } else {
      maxLoanAmount = maxMonthlyPayment * loanTerm;
    }
    const maxCarPriceBeforeTax = maxLoanAmount + downPayment + tradeInValue;
    const maxCarPrice = maxCarPriceBeforeTax / (1 + salesTax / 100);
    const totalAmountPaid = maxMonthlyPayment * loanTerm;
    const totalInterestPaid = totalAmountPaid - maxLoanAmount;
    const debtToIncomeRatio = ((monthlyDebt + maxMonthlyPayment) / monthlyIncome) * 100;
    let affordabilityStatus = "Excellent";
    let affordabilityColor = "text-green-600";
    if (debtToIncomeRatio > 43) {
      affordabilityStatus = "High Risk";
      affordabilityColor = "text-red-600";
    } else if (debtToIncomeRatio > 36) {
      affordabilityStatus = "Moderate Risk";
      affordabilityColor = "text-yellow-600";
    } else if (debtToIncomeRatio > 28) {
      affordabilityStatus = "Good";
      affordabilityColor = "text-blue-600";
    }
    const downPaymentPercent = (downPayment / maxCarPrice) * 100;
    const loanTermYears = loanTerm / 12;
    const monthlyPaymentPercent = (maxMonthlyPayment / monthlyIncome) * 100;
    const rule20 = downPaymentPercent >= 20;
    const rule4 = loanTermYears <= 4;
    const rule10 = monthlyPaymentPercent <= 10;
    return {
      maxCarPrice, maxMonthlyPayment, maxLoanAmount, totalAmountPaid, totalInterestPaid,
      debtToIncomeRatio, affordabilityStatus, affordabilityColor, downPaymentPercent,
      loanTermYears, monthlyPaymentPercent, rule20, rule4, rule10,
    };
  }, [inputs]);

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs((prev) => ({ ...prev, [field]: numValue }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Car Loan Affordability Calculator</h1>
        <p className="text-lg text-muted-foreground">
          Calculate how much car you can afford based on your budget, income, and loan terms.
        </p>
      </header>
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Your Financial Information</CardTitle>
            <CardDescription>Enter your details below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Gross Income</Label>
              <Input id="monthlyIncome" type="number" value={inputs.monthlyIncome}
                onChange={(e) => handleInputChange("monthlyIncome", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyDebt">Existing Monthly Debt</Label>
              <Input id="monthlyDebt" type="number" value={inputs.monthlyDebt}
                onChange={(e) => handleInputChange("monthlyDebt", e.target.value)} />
              <p className="text-xs text-muted-foreground">Include credit cards, loans, rent/mortgage</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment</Label>
              <Input id="downPayment" type="number" value={inputs.downPayment}
                onChange={(e) => handleInputChange("downPayment", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tradeInValue">Trade-In Value (Optional)</Label>
              <Input id="tradeInValue" type="number" value={inputs.tradeInValue}
                onChange={(e) => handleInputChange("tradeInValue", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input id="interestRate" type="number" step="0.1" value={inputs.interestRate}
                onChange={(e) => handleInputChange("interestRate", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loanTerm">Loan Term (months)</Label>
              <Input id="loanTerm" type="number" value={inputs.loanTerm}
                onChange={(e) => handleInputChange("loanTerm", e.target.value)} />
              <p className="text-xs text-muted-foreground">Common terms: 36, 48, 60, or 72 months</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salesTax">Sales Tax (%)</Label>
              <Input id="salesTax" type="number" step="0.1" value={inputs.salesTax}
                onChange={(e) => handleInputChange("salesTax", e.target.value)} />
            </div>
          </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Car Affordability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Maximum Car Price</p>
                  <p className="text-3xl font-bold text-primary">{formatCurrency(results.maxCarPrice)}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(results.maxMonthlyPayment)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Maximum Loan Amount</p>
                  <p className="text-2xl font-semibold">{formatCurrency(results.maxLoanAmount)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Amount Paid</p>
                  <p className="text-2xl font-semibold">{formatCurrency(results.totalAmountPaid)}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Interest Paid</p>
                  <p className="text-2xl font-semibold text-orange-600">{formatCurrency(results.totalInterestPaid)}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Debt-to-Income Ratio</p>
                  <p className={`text-2xl font-semibold ${results.affordabilityColor}`}>
                    {formatPercent(results.debtToIncomeRatio)}
                  </p>
                  <p className="text-xs mt-1">{results.affordabilityStatus}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">20/4/10 Rule Compliance</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">20% down ({formatPercent(results.downPaymentPercent)})</span>
                    <span className={results.rule20 ? "text-green-600" : "text-red-600"}>
                      {results.rule20 ? "✓ Pass" : "✗ Fail"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">≤4 year term ({results.loanTermYears.toFixed(1)} years)</span>
                    <span className={results.rule4 ? "text-green-600" : "text-red-600"}>
                      {results.rule4 ? "✓ Pass" : "✗ Fail"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">≤10% of income ({formatPercent(results.monthlyPaymentPercent)})</span>
                    <span className={results.rule10 ? "text-green-600" : "text-red-600"}>
                      {results.rule10 ? "✓ Pass" : "✗ Fail"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Tabs defaultValue="guide"><TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="guide">Guide</TabsTrigger>
              <TabsTrigger value="formula">Formula</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList><TabsContent value="guide"><Card><CardContent className="prose prose-sm max-w-none pt-6">
                  <p>Determining how much car you can afford is crucial. This calculator uses industry standards to show a safe purchase price based on income, debts, and loan terms.</p>
                  <h3>The 20/4/10 Rule</h3><p>Put down 20%, finance for 4 years max, keep payments under 10% of income.</p>
                  <h3>Hidden Costs</h3><p>Factor in insurance ($100-200/mo), fuel ($100-300/mo), maintenance ($50-100/mo).</p>
                </CardContent></Card></TabsContent><TabsContent value="formula"><Card><CardContent className="space-y-4 pt-6">
                  <div><h3 className="font-semibold">Max Payment</h3>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      (Income × 0.20) - Existing Debt
                    </div></div>
                  <div><h3 className="font-semibold">Max Loan</h3>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      Payment × [(1 - (1+r)^-n) / r]
                    </div></div>
                </CardContent></Card></TabsContent><TabsContent value="examples"><Card><CardHeader><CardTitle>Entry-Level ($3,500/mo income)</CardTitle></CardHeader>
                <CardContent><p className="text-sm">$400 debt, $3k down, 7.5% rate = ~$15k car affordable</p></CardContent>
              </Card></TabsContent><TabsContent value="faq"><Card><CardHeader><CardTitle>What is 20/4/10?</CardTitle></CardHeader>
                <CardContent><p className="text-sm">20% down, 4-year term max, 10% of income for all car costs.</p></CardContent>
              </Card></TabsContent></Tabs>
        </div>
      </div>
    </div>
  );
};

export default CarLoanAffordabilityCalculator;
