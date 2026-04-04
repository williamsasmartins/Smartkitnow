import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function NetWorthCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    assets: "", 
    liabilities: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "How accurate are net worth calculation calculations and what limitations should I be aware of?",
      answer: "This calculator provides estimates based on the inputs you provide. For net worth calculation, accuracy depends on using current assets vs liabilities data -- rates, prices, and regulatory thresholds change frequently. The results are most reliable for planning purposes and comparative analysis. For financial decisions involving significant amounts, verify results against official sources or consult a assets vs liabilities professional."
    },
    {
      question: "What key factors most affect net worth calculation results?",
      answer: "The most impactful variables in net worth calculation calculations are typically the primary rate or percentage input and the time horizon. Small changes in these variables compound significantly over longer periods. For example, a 1% difference in return rate over 20 years can change outcomes by 20–30%. Always run the calculation at multiple input values to understand your sensitivity to each variable."
    },
    {
      question: "When should I recalculate net worth calculation?",
      answer: "Recalculate whenever assets vs liabilities conditions change significantly: after major assets vs liabilities events, when your inputs change (income, rates, holdings), or when assets vs liabilities regulations are updated. For time-sensitive assets vs liabilities metrics, recalculate monthly. For long-term planning tools, a quarterly review is typically sufficient. Set a calendar reminder to revisit projections annually at minimum."
    },
    {
      question: "How does net worth calculation relate to other financial planning metrics?",
      answer: "No single metric tells the complete financial picture. Net worth calculation should be evaluated alongside related measures like wealth tracking. These metrics interact: improving one often affects another. Build a dashboard of 3–5 key metrics that together reflect the health of your assets vs liabilities situation, rather than optimizing any single number in isolation."
    },
    {
      question: "What are the most common mistakes when calculating net worth calculation?",
      answer: "The most frequent errors in net worth calculation calculations: (1) Using pre-tax instead of post-tax figures where after-tax analysis is needed, (2) Ignoring fees and transaction costs that reduce net returns, (3) Using nominal figures without inflation adjustment for long-horizon projections, (4) Assuming constant rates -- real-world assets vs liabilities conditions fluctuate. Double-check your inputs against current assets vs liabilities data before relying on results for significant financial decisions."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // HELPER FUNCTION (MANDATORY)
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    const assetsValue = parseFloat(inputs.assets) || 0;
    const liabilitiesValue = parseFloat(inputs.liabilities) || 0;

    // Validate
    if (assetsValue < 0 || liabilitiesValue < 0) {
      return { 
        netWorth: 0, 
        assetToLiabilityRatio: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const netWorth = assetsValue - liabilitiesValue;
    const assetToLiabilityRatio = liabilitiesValue > 0 ? assetsValue / liabilitiesValue : 0;

    // Generate schedule data if applicable (e.g., asset growth over time)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      projectedAssets: assetsValue * Math.pow(1.02, i + 1),
      projectedLiabilities: liabilitiesValue * Math.pow(1.01, i + 1),
      projectedNetWorth: (assetsValue * Math.pow(1.02, i + 1)) - (liabilitiesValue * Math.pow(1.01, i + 1))
    }));

    return { 
      netWorth, 
      assetToLiabilityRatio, 
      scheduleData 
    };
  }, [inputs]);

  // HANDLERS
  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    }, 100);
  };

  const handleReset = () => {
    setInputs({ assets: "", liabilities: "" });
  };

  // WIDGET JSX (200-250 LINES)
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* INPUT SECTION */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-blue-600"/>
              Total Assets
            </Label>
            <Input
              type="number"
              placeholder="e.g., 500000"
              value={inputs.assets}
              onChange={(e) => setInputs({ ...inputs, assets: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Total Liabilities
            </Label>
            <Input
              type="number"
              placeholder="e.g., 200000"
              value={inputs.liabilities}
              onChange={(e) => setInputs({ ...inputs, liabilities: e.target.value })}
              className="text-lg"
            />
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 mt-6">
        <Button 
          onClick={handleCalculate} 
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
        >
          <Calculator className="mr-2 h-4 w-4"/> 
          Calculate
        </Button>
        <Button 
          onClick={handleReset} 
          variant="outline"
          className="border-gray-300 dark:border-gray-600"
        >
          Reset
        </Button>
      </div>

      {/* RESULTS SECTION - GRID 2x2 (MANDATORY) */}
      {results.netWorth !== 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Net Worth
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.netWorth)}
                    </p>
                  </div>
                  <DollarSign className="w-16 h-16 text-blue-600 dark:text-blue-400 opacity-20" />
                </div>
              </CardContent>
            </Card>

            {/* SECONDARY RESULT 1 */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Asset to Liability Ratio
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {results.assetToLiabilityRatio.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AMORTIZATION/SCHEDULE TABLE (if applicable) */}
          {results.scheduleData && results.scheduleData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Projected Net Worth Schedule
                  </span>
                  {results.scheduleData.length > 12 && (
                    <Button 
                      onClick={() => setShowFullTable(!showFullTable)} 
                      variant="outline"
                      size="sm"
                      className="border-gray-300 dark:border-gray-600"
                    >
                      {showFullTable 
                        ? 'Show Less' 
                        : `Show All ${results.scheduleData.length} Months`}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900">
                        <TableHead className="font-semibold">Month</TableHead>
                        <TableHead className="font-semibold">Projected Assets</TableHead>
                        <TableHead className="font-semibold">Projected Liabilities</TableHead>
                        <TableHead className="font-semibold">Projected Net Worth</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.scheduleData
                        .slice(0, showFullTable ? undefined : 12)
                        .map((row, idx) => (
                          <TableRow 
                            key={idx} 
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <TableCell className="font-medium">{row.month}</TableCell>
                            <TableCell>{formatCurrency(row.projectedAssets)}</TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.projectedLiabilities)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.projectedNetWorth)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </Card>
  );

  // EDITORIAL JSX (350-400 LINES, 2500-3000 WORDS)
  const editorial = (
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      
      {/* SECTION 1: INTRODUCTION (400-500 words) */}
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Understanding Net Worth Calculator
        </h2>
        
        <p className="mb-6">
          Calculating your net worth is a fundamental step in understanding your financial health. This calculator helps you determine your total net worth by subtracting your liabilities from your assets. Knowing your net worth can provide a clear picture of your financial standing, allowing you to make informed decisions about savings, investments, and debt management. Whether you're planning for retirement, considering a major purchase, or simply want to track your financial progress, understanding your net worth is crucial.
        </p>
        
        <p className="mb-6">
          Accurate calculations are essential in financial planning. Inaccurate assessments can lead to misguided decisions, potentially affecting your financial future. For instance, overestimating your net worth might lead to overspending, while underestimating it could result in missed investment opportunities. This tool ensures you have a reliable measure of your wealth, helping you to strategize effectively. For more on financial planning, see our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator, gather all relevant financial information, including your assets and liabilities. Assets include cash, investments, real estate, and personal property, while liabilities encompass debts like mortgages, loans, and credit card balances. Enter these values into the calculator to get an accurate net worth estimation. For a deeper dive into managing liabilities, check out our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Regularly updating your net worth calculation can help you track financial progress and adjust your strategies accordingly. Ensure you include all assets and liabilities for the most accurate picture.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices include reviewing your net worth quarterly or annually, especially after significant financial changes. Consider factors such as market fluctuations, which can impact asset values, and changes in debt levels. Understanding these dynamics helps in maintaining a realistic view of your financial position.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Net Worth Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula for calculating net worth is straightforward: subtract your total liabilities from your total assets. This calculation provides a snapshot of your financial health, indicating whether you have more wealth than debt. The simplicity of the formula makes it accessible, yet its implications are profound, offering insights into financial stability and growth potential.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Net Worth = Total Assets - Total Liabilities
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Total Assets = Sum of all owned assets</li>
              <li>Total Liabilities = Sum of all debts and obligations</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each component of the formula is critical. Assets can include cash, investments, real estate, and personal property, while liabilities cover debts such as mortgages, loans, and credit card balances. The difference between these figures reveals your net worth, a key indicator of financial health. A positive net worth suggests financial stability, whereas a negative net worth may indicate a need for financial restructuring.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your net worth is crucial for accurate calculations and effective financial planning. These factors interact in complex ways, affecting your overall financial picture.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Asset Valuation
        </h3>
        <p className="mb-4">
          Asset valuation is a critical factor. The value of your assets can fluctuate due to market conditions, economic trends, and personal circumstances. For instance, real estate values can rise or fall based on market demand, while stock investments are subject to market volatility.
        </p>
        <p className="mb-6">
          To optimize asset valuation, regularly reassess the market value of your assets. This includes getting appraisals for real estate and keeping track of investment performance. For more on managing investments, see our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Debt Management
        </h3>
        <p className="mb-4">
          Effective debt management is essential. High levels of debt can significantly reduce your net worth. Understanding the terms of your debts, such as interest rates and repayment schedules, can help you manage them more effectively.
        </p>
        <p className="mb-6">
          Consider strategies like consolidating high-interest debts or negotiating better terms with creditors. This can reduce your liabilities and improve your net worth over time. For strategies on managing loans, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Income Stability
        </h3>
        <p className="mb-4">
          A stable income source supports asset accumulation and debt repayment. Fluctuations in income can impact your ability to save and invest, affecting your net worth.
        </p>
        <p className="mb-6">
          Diversifying income streams and building an emergency fund can provide financial security. This stability allows you to maintain or grow your net worth even during economic downturns.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Conditions
        </h3>
        <p className="mb-6">
          Economic conditions play a significant role in asset and liability values. Inflation, interest rates, and economic growth can all impact your financial situation. For example, rising interest rates can increase the cost of borrowing, while inflation can erode the purchasing power of cash assets.
        </p>
        <p className="mb-6">
          Staying informed about economic trends and adjusting your financial strategies accordingly can help mitigate these impacts. Consider consulting financial experts to navigate complex economic environments.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Life Events
        </h3>
        <p className="mb-6">
          Major life events such as marriage, divorce, or retirement can significantly alter your financial landscape. These events can affect both assets and liabilities, requiring adjustments in financial planning.
        </p>
        <p className="mb-6">
          Planning for these events in advance can help you maintain financial stability. Consider the potential financial impacts of each event and adjust your strategies to accommodate these changes.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
                <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
                {faq.question}
              </h3>
              <p 
                className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: REFERENCES WITH DESCRIPTIONS (MANDATORY) */}
      <section id="references" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Official References & Resources
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.federalreserve.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Federal Reserve - Economic Data
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on economic indicators and financial conditions.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.consumerfinance.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Consumer Financial Protection Bureau - Financial Guides
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.fdic.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                FDIC - Banking Regulations
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and deposit insurance information.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.irs.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Internal Revenue Service - Tax Information
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.investopedia.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Investopedia - Financial Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.nerdwallet.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                NerdWallet - Personal Finance
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Net Worth Calculator"
      description="Calculate your total net worth. Subtract liabilities from assets to understand your overall financial position and track wealth."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Net Worth Calculator" },
        { id: "formula", label: "Net Worth Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Net Worth = Total Assets - Total Liabilities",
        variables: [
          { symbol: "Total Assets", description: "Sum of all owned assets" },
          { symbol: "Total Liabilities", description: "Sum of all debts and obligations" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have $500,000 in assets and $200,000 in liabilities.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Assets = $500,000", 
            explanation: "Determine the total value of all assets." 
          },
          { 
            label: "Step 2", 
            calculation: "Liabilities = $200,000", 
            explanation: "Determine the total value of all liabilities." 
          },
          { 
            label: "Step 3", 
            calculation: "Net Worth = $500,000 - $200,000 = $300,000", 
            explanation: "Subtract liabilities from assets to find net worth." 
          }
        ],
        result: "The final result is $300,000, indicating your net worth."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "💳" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "💰" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏦" }
      ]}
    />
  );
}
