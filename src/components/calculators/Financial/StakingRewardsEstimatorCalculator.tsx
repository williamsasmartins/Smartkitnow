import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function StakingRewardsEstimatorCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    stakedAmount: "", 
    annualInterestRate: "", 
    lockupDuration: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "How accurate are staking rewards calculations and what limitations should I be aware of?",
      answer: "This calculator provides estimates based on the inputs you provide. For staking rewards, accuracy depends on using current APY vs APR data -- rates, prices, and regulatory thresholds change frequently. The results are most reliable for planning purposes and comparative analysis. For financial decisions involving significant amounts, verify results against official sources or consult a APY vs APR professional."
    },
    {
      question: "What key factors most affect staking rewards results?",
      answer: "The most impactful variables in staking rewards calculations are typically the primary rate or percentage input and the time horizon. Small changes in these variables compound significantly over longer periods. For example, a 1% difference in return rate over 20 years can change outcomes by 20–30%. Always run the calculation at multiple input values to understand your sensitivity to each variable."
    },
    {
      question: "When should I recalculate staking rewards?",
      answer: "Recalculate whenever APY vs APR conditions change significantly: after major APY vs APR events, when your inputs change (income, rates, holdings), or when APY vs APR regulations are updated. For time-sensitive APY vs APR metrics, recalculate monthly. For long-term planning tools, a quarterly review is typically sufficient. Set a calendar reminder to revisit projections annually at minimum."
    },
    {
      question: "How does staking rewards relate to other financial planning metrics?",
      answer: "No single metric tells the complete financial picture. Staking rewards should be evaluated alongside related measures like validator risk. These metrics interact: improving one often affects another. Build a dashboard of 3–5 key metrics that together reflect the health of your APY vs APR situation, rather than optimizing any single number in isolation."
    },
    {
      question: "What are the most common mistakes when calculating staking rewards?",
      answer: "The most frequent errors in staking rewards calculations: (1) Using pre-tax instead of post-tax figures where after-tax analysis is needed, (2) Ignoring fees and transaction costs that reduce net returns, (3) Using nominal figures without inflation adjustment for long-horizon projections, (4) Assuming constant rates -- real-world APY vs APR conditions fluctuate. Double-check your inputs against current APY vs APR data before relying on results for significant financial decisions."
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
    const stakedAmountValue = parseFloat(inputs.stakedAmount) || 0;
    const annualInterestRateValue = parseFloat(inputs.annualInterestRate) || 0;
    const lockupDurationValue = parseFloat(inputs.lockupDuration) || 0;

    // Validate
    if (stakedAmountValue <= 0 || annualInterestRateValue <= 0 || lockupDurationValue <= 0) {
      return { 
        mainResult: 0, 
        monthlyReward: 0, 
        totalReward: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const monthlyInterestRate = annualInterestRateValue / 12 / 100;
    const mainResult = stakedAmountValue * Math.pow(1 + monthlyInterestRate, lockupDurationValue);
    const monthlyReward = mainResult / lockupDurationValue;
    const totalReward = mainResult - stakedAmountValue;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: lockupDurationValue }, (_, i) => ({
      month: i + 1,
      reward: monthlyReward,
      balance: stakedAmountValue * Math.pow(1 + monthlyInterestRate, i + 1)
    }));

    return { 
      mainResult, 
      monthlyReward, 
      totalReward, 
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
    setInputs({ stakedAmount: "", annualInterestRate: "", lockupDuration: "" });
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
              Staked Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={inputs.stakedAmount}
              onChange={(e) => setInputs({ ...inputs, stakedAmount: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Annual Interest Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.annualInterestRate}
              onChange={(e) => setInputs({ ...inputs, annualInterestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Lock-up Duration (Months)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 12"
              value={inputs.lockupDuration}
              onChange={(e) => setInputs({ ...inputs, lockupDuration: e.target.value })}
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
      {results.mainResult > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Total Value After Staking
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.mainResult)}
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
                      Monthly Reward
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.monthlyReward)}
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* SECONDARY RESULT 2 */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Total Reward Earned
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalReward)}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
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
                    Reward Schedule
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
                        <TableHead className="font-semibold">Reward</TableHead>
                        <TableHead className="font-semibold">Balance</TableHead>
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
                            <TableCell>{formatCurrency(row.reward)}</TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.balance)}
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
          Understanding Staking Rewards Estimator
        </h2>
        
        <p className="mb-6">
          Staking has become an increasingly popular method for cryptocurrency holders to earn passive income. By participating in the staking process, individuals can contribute to the network's security and operations while earning rewards. This calculator is designed to help you estimate the potential rewards you can earn from staking your Proof-of-Stake (PoS) coins. Whether you're a seasoned investor or new to the crypto space, understanding your potential earnings is crucial for making informed decisions.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in the world of staking. With fluctuating interest rates and varying lock-up durations, it's easy to miscalculate potential earnings. This tool provides a reliable way to project your staking rewards, helping you plan your investments more effectively. By inputting your staked amount, expected annual interest rate, and lock-up duration, you can quickly see how much you might earn. This is especially useful for those looking to diversify their investment portfolio or maximize their crypto holdings. For more insights, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator, you'll need to gather some basic information. Start by determining the amount of cryptocurrency you plan to stake. Next, research the annual interest rate offered by the staking platform or network. Finally, decide on the lock-up duration, which is the period your funds will be inaccessible. Once you have this data, enter it into the respective fields of the calculator. This will provide you with an estimate of your monthly and total rewards. For a deeper understanding, visit our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Ensure you are aware of the lock-up duration and any potential penalties for early withdrawal. Staking can be a lucrative investment, but it's important to understand the terms and conditions of your chosen platform to avoid unexpected losses.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for optimizing your staking rewards include regularly monitoring interest rates and staying informed about network updates. Some platforms offer higher rates for longer lock-up periods, while others might provide bonuses for staking larger amounts. By staying proactive and adjusting your strategy as needed, you can maximize your earnings. Always consider the risk factors and potential changes in the market that could affect your returns.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Staking Rewards Estimator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this calculator is based on the compound interest model, which is a standard approach for calculating staking rewards. This model considers the initial staked amount, the annual interest rate, and the lock-up duration to project the total value of your investment over time. The compound interest formula is widely recognized for its accuracy in financial calculations, making it a reliable choice for estimating staking rewards.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          A = P(1 + r/n)^(nt)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>P = Initial staked amount</li>
              <li>r = Annual interest rate (decimal)</li>
              <li>n = Number of times interest is compounded per year</li>
              <li>t = Time in years</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining your final earnings. The initial staked amount (P) is the principal investment, while the annual interest rate (r) reflects the percentage gain on your investment. The number of compounding periods per year (n) can vary depending on the platform, but monthly compounding is common in staking. Finally, the time (t) is the lock-up duration expressed in years. Adjusting any of these variables will impact the total value of your staked coins.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your staking rewards is essential for optimizing your investment strategy. These factors interact in complex ways, and being aware of them can help you make more informed decisions.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Staked Amount
        </h3>
        <p className="mb-4">
          The amount of cryptocurrency you choose to stake directly affects your potential rewards. Larger staked amounts typically yield higher returns due to the nature of compound interest. For example, staking $10,000 at a 5% annual interest rate will generate more rewards than staking $1,000 at the same rate.
        </p>
        <p className="mb-6">
          To maximize your earnings, consider staking as much as you can comfortably afford. However, always ensure you have enough liquidity for other investments or expenses. For more strategies, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The annual interest rate offered by the staking platform is a critical factor in determining your rewards. Higher rates lead to greater earnings, but they may also come with increased risk. It's important to research and compare rates across different platforms to find the best option for your needs.
        </p>
        <p className="mb-6">
          Keep in mind that interest rates can fluctuate based on market conditions and network performance. Regularly reviewing your staking strategy and adjusting your investments accordingly can help you take advantage of favorable rates.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Lock-up Duration
        </h3>
        <p className="mb-4">
          The lock-up duration is the period during which your staked funds are inaccessible. Longer durations often result in higher rewards due to the extended compounding period. However, they also increase the risk of market volatility affecting your investment.
        </p>
        <p className="mb-6">
          Consider your financial goals and risk tolerance when choosing a lock-up duration. If you anticipate needing access to your funds in the near future, opt for a shorter duration. For more insights, check out our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Network Performance
        </h3>
        <p className="mb-6">
          The overall performance of the blockchain network can impact your staking rewards. Factors such as network congestion, security, and governance decisions can influence interest rates and reward distribution. Staying informed about network updates and developments is crucial for managing your staking strategy effectively.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Platform Fees
        </h3>
        <p className="mb-6">
          Many staking platforms charge fees for their services, which can reduce your overall earnings. These fees may be a flat rate or a percentage of your rewards. It's important to factor in these costs when calculating your potential returns. Look for platforms with competitive fees and transparent policies to maximize your profits.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq">
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
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
                {faq.answer.split("For more financial tools, explore our Refinance Savings Calculator.")[0]}
                {faq.answer.includes("Refinance Savings Calculator") && (
                  <>
                    For more financial tools, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
                  </>
                )}
                {faq.answer.split("For further guidance, consult a financial advisor or explore our HELOC Payment Estimator for additional insights.")[0] !== faq.answer && (
                  <>
                    {faq.answer.split("For further guidance, consult a financial advisor or explore our HELOC Payment Estimator for additional insights.")[0]}
                    For further guidance, consult a financial advisor or explore our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a> for additional insights.
                  </>
                )}
              </p>
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
                Federal Reserve - Cryptocurrency Insights
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on cryptocurrency regulations and economic impacts.
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
                Consumer Financial Protection Bureau - Investment Guides
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
                FDIC - Banking and Investment Resources
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
                Internal Revenue Service - Cryptocurrency Tax Guidelines
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information for cryptocurrency.
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
                Investopedia - Staking and Investment Strategies
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
                NerdWallet - Cryptocurrency Investment Tips
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
      title="Staking Rewards Estimator"
      description="Estimate staking rewards for Proof-of-Stake coins. Calculate earnings based on staked amount and lock-up duration."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Staking Rewards Estimator" },
        { id: "formula", label: "Staking Rewards Estimator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "A = P(1 + r/n)^(nt)",
        variables: [
          { symbol: "P", description: "Initial staked amount" },
          { symbol: "r", description: "Annual interest rate (decimal)" },
          { symbol: "n", description: "Number of times interest is compounded per year" },
          { symbol: "t", description: "Time in years" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have staked $5,000 at an annual interest rate of 5% for 12 months.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "5000 × 0.05 = 250", 
            explanation: "Calculate annual interest earned." 
          },
          { 
            label: "Step 2", 
            calculation: "250 / 12 = 20.83", 
            explanation: "Determine monthly interest." 
          },
          { 
            label: "Step 3", 
            calculation: "5000 + (20.83 × 12) = 5250", 
            explanation: "Final result shows total value after staking." 
          }
        ],
        result: "The final result is $5,250, meaning you earned $250 in rewards over the staking period."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Extra Payments & Payoff Time Calculator", url: "/financial/extra-payments-payoff", icon: "📈" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "💳" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💰" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" }
      ]}
    />
  );
}
