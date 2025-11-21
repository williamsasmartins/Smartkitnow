import { useState, useMemo, useRef } from "react";
import CalculatorUnifiedLayout from "@/components/templates/CalculatorUnifiedLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CarLoanAffordabilityCalculator() {
  const [inputs, setInputs] = useState({
    monthlyIncome: "",
    existingDebts: "",
    downPayment: "",
    loanTerm: "",
    interestRate: "",
  });

  // 🔥 REF PARA AUTO-SCROLL
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const income = parseFloat(inputs.monthlyIncome) || 0;
    const debts = parseFloat(inputs.existingDebts) || 0;
    const down = parseFloat(inputs.downPayment) || 0;
    const term = parseFloat(inputs.loanTerm) || 48;
    const rate = parseFloat(inputs.interestRate) || 0;

    if (income === 0 || rate === 0 || term === 0) {
      return {
        maxCarPrice: null,
        monthlyPayment: null,
        maxLoanAmount: null,
        totalInterest: null,
        dtiRatio: "NaN",
      };
    }

    // DTI calculation (36% max)
    const maxDebts = income * 0.36;
    const availableForCar = maxDebts - debts;

    if (availableForCar <= 0) {
      return {
        maxCarPrice: 0,
        monthlyPayment: 0,
        maxLoanAmount: 0,
        totalInterest: 0,
        dtiRatio: ((debts / income) * 100).toFixed(1),
      };
    }

    // Loan calculation
    const monthlyRate = rate / 100 / 12;
    const numPayments = term;

    // Present value factor
    const pvFactor =
      (Math.pow(1 + monthlyRate, numPayments) - 1) /
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments));

    const maxLoan = availableForCar * pvFactor;
    const maxPrice = maxLoan + down;
    const totalPaid = availableForCar * numPayments;
    const totalInterest = totalPaid - maxLoan;
    const dti = (((debts + availableForCar) / income) * 100).toFixed(1);

    return {
      maxCarPrice: maxPrice,
      monthlyPayment: availableForCar,
      maxLoanAmount: maxLoan,
      totalInterest: totalInterest > 0 ? totalInterest : 0,
      dtiRatio: dti,
    };
  }, [inputs]);

  const formatCurrency = (value: number | null) => {
    if (value === null) return "$NaN";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // 🔥 FUNÇÃO DE AUTO-SCROLL
  const handleCalculate = () => {
    setTimeout(() => {
      if (resultsRef.current) {
        const rect = resultsRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = rect.top + scrollTop - 100; // 100px offset from top
        
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    }, 100);
  };

  const handleReset = () => {
    setInputs({
      monthlyIncome: "",
      existingDebts: "",
      downPayment: "",
      loanTerm: "",
      interestRate: "",
    });
  };

  return (
    <CalculatorUnifiedLayout
      title="Car Loan Affordability Calculator"
      stickyTopPx={120}
      maxWidth={1200}
      gap={32}
      showTopBanner
      editorial={
        <div className="skn-editorial">
          {/* CONTEÚDO EDITORIAL COMPLETO AQUI */}
          <section className="mb-6">
            <p className="text-base leading-relaxed mb-4">
              Are you wondering how much car you can afford based on your income and existing debts? Understanding your car loan affordability is crucial to avoid financial strain and ensure you make a sound investment.
            </p>
          </section>
        </div>
      }
      widget={
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Gross Income</Label>
              <Input
                id="monthlyIncome"
                type="number"
                value={inputs.monthlyIncome}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, monthlyIncome: e.target.value }))
                }
                placeholder="5000"
              />
              <p className="text-xs text-muted-foreground">Your pre-tax monthly income</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="existingDebts">Existing Monthly Debts</Label>
              <Input
                id="existingDebts"
                type="number"
                value={inputs.existingDebts}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, existingDebts: e.target.value }))
                }
                placeholder="e.g., 1200"
              />
              <p className="text-xs text-muted-foreground">
                Mortgage, student loans, credit cards, etc.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment Available</Label>
              <Input
                id="downPayment"
                type="number"
                value={inputs.downPayment}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, downPayment: e.target.value }))
                }
                placeholder="e.g., 5000"
              />
              <p className="text-xs text-muted-foreground">Cash + trade-in value</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanTerm">Loan Term (months)</Label>
              <Input
                id="loanTerm"
                type="number"
                value={inputs.loanTerm}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, loanTerm: e.target.value }))
                }
                placeholder="e.g., 48"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 48 months or less
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={inputs.interestRate}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, interestRate: e.target.value }))
                }
                placeholder="e.g., 6.5"
              />
              <p className="text-xs text-muted-foreground">Based on your credit score</p>
            </div>

            <div className="flex gap-2">
              <Button variant="calculate" className="flex-1" onClick={handleCalculate}>
                Calculate
              </Button>
              <Button variant="reset" onClick={handleReset}>
                Reset
              </Button>
            </div>

            {/* 🔥 RESULTS WITH REF FOR AUTO-SCROLL */}
            <div ref={resultsRef} className="space-y-3 pt-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Maximum Affordable Car Price
                </p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(results.maxCarPrice)}
                </p>
              </div>

              <div className="p-3 bg-secondary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Recommended Monthly Payment
                </p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(results.monthlyPayment)}
                </p>
              </div>

              <div className="p-3 bg-secondary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Maximum Loan Amount</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(results.maxLoanAmount)}
                </p>
              </div>

              <div className="p-3 bg-secondary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Interest Paid</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(results.totalInterest)}
                </p>
              </div>

              <div className="p-3 bg-secondary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Debt-to-Income Ratio</p>
                <p className="text-xl font-semibold">{results.dtiRatio}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {parseFloat(results.dtiRatio) <= 36
                    ? "✓ Within recommended range"
                    : "⚠ Above recommended 36%"}
                </p>
              </div>
            </div>
          </div>
        </div>
      }
      railRight={null}
    />
  );
}
