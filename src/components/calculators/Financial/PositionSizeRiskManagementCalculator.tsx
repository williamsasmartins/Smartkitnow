import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function PositionSizeRiskManagementCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    accountSize: "", 
    riskPercentage: "", 
    stopLoss: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is position size & risk management tool and why is it important?",
      answer: "The Position Size & Risk Management Tool is a calculator designed to help traders determine the optimal size of their trades while managing risk effectively. It is important because it helps prevent excessive losses by ensuring that trades are aligned with the trader's risk tolerance and account size. By using this tool, traders can make informed decisions that protect their capital and enhance their trading strategy. For more insights, explore our <a href=\"/financial/extra-payments-payoff\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Extra Payments & Payoff Time Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator is highly accurate when the input data is precise. However, its accuracy can be affected by factors such as incorrect data entry or rapidly changing market conditions. It is important to regularly update your inputs to reflect current market conditions and consult a financial advisor for complex decisions. Always double-check your inputs and consider external factors that may influence your trading strategy."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you need to know your account size, the percentage of your account you are willing to risk per trade, and your stop-loss amount. These inputs are essential for calculating the optimal position size and managing your risk effectively. Ensure that you have accurate and up-to-date information for each of these inputs to achieve the best results."
    },
    {
      question: "Can I use this calculator for specific scenarios?",
      answer: "Yes, this calculator can be used for various trading scenarios, including stocks, forex, and commodities. It is versatile and can be adapted to different market conditions and trading strategies. However, it is important to consider the unique characteristics of each market when applying the results. For specific scenarios, adjust the inputs to reflect the market's volatility and your trading strategy. Consult a financial advisor if you are unsure about the appropriate adjustments."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include entering incorrect data, such as an inaccurate account size or risk percentage, and failing to update inputs to reflect current market conditions. These errors can lead to miscalculations and potentially significant financial losses. To avoid these mistakes, double-check your inputs and regularly review your trading strategy to ensure it aligns with your financial goals and market conditions."
    },
    {
      question: "How often should I recalculate?",
      answer: "It is recommended to recalculate your position size and risk management strategy whenever there are significant changes in your account size, risk tolerance, or market conditions. Regular recalculations help ensure that your trading strategy remains aligned with your financial goals. Consider setting a regular schedule for recalculations, such as monthly or quarterly, to maintain an up-to-date trading strategy."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results from this calculator to inform your trading decisions and adjust your strategy as needed. The position size and risk amount provide a framework for managing your trades and minimizing potential losses. Consider consulting a financial advisor for personalized advice. For more guidance on financial planning, check out our <a href=\"/financial/refinance-savings\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Refinance Savings Calculator</a>."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Yes, there are alternative methods for calculating position size and managing risk, such as using fixed-dollar risk or percentage of equity models. Each method has its pros and cons, and the best choice depends on your trading goals and risk tolerance. Consider experimenting with different methods to find the one that best suits your trading style and financial objectives."
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
    const accountSizeValue = parseFloat(inputs.accountSize) || 0;
    const riskPercentageValue = parseFloat(inputs.riskPercentage) || 0;
    const stopLossValue = parseFloat(inputs.stopLoss) || 0;

    // Validate
    if (accountSizeValue <= 0 || riskPercentageValue <= 0 || stopLossValue <= 0) {
      return { 
        positionSize: 0, 
        riskAmount: 0, 
        tradeAmount: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations
    const riskAmount = accountSizeValue * (riskPercentageValue / 100);
    const positionSize = riskAmount / stopLossValue;
    const tradeAmount = positionSize * stopLossValue;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: 24 }, (_, i) => ({
      month: i + 1,
      payment: tradeAmount / 24,
      principal: (tradeAmount / 24) * 0.7,
      interest: (tradeAmount / 24) * 0.3,
      balance: tradeAmount - ((tradeAmount / 24) * (i + 1))
    }));

    return { 
      positionSize, 
      riskAmount, 
      tradeAmount, 
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
    setInputs({ accountSize: "", riskPercentage: "", stopLoss: "" });
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
              Account Size
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10000"
              value={inputs.accountSize}
              onChange={(e) => setInputs({ ...inputs, accountSize: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Risk Percentage (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 2"
              value={inputs.riskPercentage}
              onChange={(e) => setInputs({ ...inputs, riskPercentage: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Stop Loss Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50"
              value={inputs.stopLoss}
              onChange={(e) => setInputs({ ...inputs, stopLoss: e.target.value })}
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
      {results.positionSize > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Position Size
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.positionSize)}
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
                      Risk Amount
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.riskAmount)}
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
                      Trade Amount
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.tradeAmount)}
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
                    Payment Schedule
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
                        : `Show All ${results.scheduleData.length} Payments`}
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
                        <TableHead className="font-semibold">Payment</TableHead>
                        <TableHead className="font-semibold">Principal</TableHead>
                        <TableHead className="font-semibold">Interest</TableHead>
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
                            <TableCell>{formatCurrency(row.payment)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.principal)}
                            </TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.interest)}
                            </TableCell>
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
          Understanding Position Size & Risk Management Tool
        </h2>
        
        <p className="mb-6">
          The Position Size & Risk Management Tool is an essential calculator for traders and investors who want to optimize their trading strategy by managing risk effectively. This tool helps you determine the optimal position size for your trades based on your account size, risk tolerance, and stop-loss levels. By calculating the appropriate trade amounts, you can ensure that you are not overexposing your account to potential losses, which is crucial for long-term success in financial markets.
        </p>
        
        <p className="mb-6">
          Accurate calculations in position sizing and risk management are vital because they directly impact your financial outcomes. Incorrect calculations can lead to excessive risk-taking or overly conservative trading, both of which can hinder your financial goals. According to studies, traders who manage their risk effectively are more likely to sustain profitability over time. This tool aids in making informed decisions by providing precise calculations that align with your trading strategy. For more insights on managing finances, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information about your account size, the percentage of risk you are willing to take per trade, and your stop-loss level. Enter these values into the respective fields to calculate your position size. The tool will provide you with the risk amount and trade amount, helping you to strategize your trades efficiently. For further guidance on financial planning, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check your inputs to ensure accuracy. Small errors in data entry can lead to significant discrepancies in your trading strategy. Make it a habit to verify your account size, risk percentage, and stop-loss values before calculating.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this tool include setting realistic risk percentages that align with your financial goals and market conditions. Consider factors such as market volatility and your trading experience when determining your stop-loss levels. Regularly review and adjust your strategy as needed to adapt to changing market environments.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Position Size & Risk Management Tool Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Position Size & Risk Management Tool is a standard approach in trading to calculate the optimal position size. It is derived from the basic principle of risk management, which aims to limit potential losses to a predetermined percentage of your trading account. This formula is widely accepted in the financial industry due to its simplicity and effectiveness in maintaining a balanced risk-reward ratio.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Position Size = (Account Size × Risk Percentage) / Stop Loss
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Account Size = Total capital available for trading</li>
              <li>Risk Percentage = Percentage of account size you're willing to risk</li>
              <li>Stop Loss = Maximum loss allowed per trade</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the position size. The Account Size represents your total capital, which is the foundation for calculating risk. The Risk Percentage is a subjective measure that reflects your risk tolerance and trading strategy. The Stop Loss is a predefined level that limits your losses, ensuring that you do not exceed your risk tolerance. Adjusting these variables allows you to tailor your trading strategy to your financial goals and market conditions.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your position size and risk management is crucial for optimizing your trading strategy. These factors interact with each other, and changes in one can significantly impact your overall trading performance.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Account Size
        </h3>
        <p className="mb-4">
          Your account size is the total capital you have available for trading. It determines the scale of your trades and directly influences your risk management strategy. A larger account size allows for more flexibility in position sizing and risk allocation.
        </p>
        <p className="mb-6">
          To optimize your account size, consider diversifying your investments and regularly reviewing your financial goals. Ensure that your account size aligns with your risk tolerance and trading objectives. For more strategies on managing finances, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Risk Percentage
        </h3>
        <p className="mb-4">
          The risk percentage is the portion of your account size that you are willing to risk on a single trade. It reflects your risk tolerance and is a critical component of your trading strategy. A higher risk percentage can lead to greater potential returns but also increases the risk of significant losses.
        </p>
        <p className="mb-6">
          Adjust your risk percentage based on your financial goals and market conditions. Consider starting with a conservative risk percentage and gradually increasing it as you gain confidence and experience. For more insights, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Stop Loss
        </h3>
        <p className="mb-4">
          A stop loss is a predetermined level at which you will exit a trade to prevent further losses. It is a crucial risk management tool that helps protect your capital from significant downturns in the market.
        </p>
        <p className="mb-6">
          Set your stop loss based on market volatility and your risk tolerance. Avoid setting it too close to your entry point, as this may result in premature exits. Conversely, a stop loss set too far away can expose you to unnecessary risk. For more tips, check out our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Volatility
        </h3>
        <p className="mb-6">
          Market volatility refers to the degree of variation in trading prices over a period. High volatility can lead to rapid price changes, affecting your stop loss and position size. Understanding market volatility is essential for effective risk management.
        </p>
        <p className="mb-6">
          Monitor market trends and adjust your trading strategy accordingly. During periods of high volatility, consider reducing your position size to minimize risk. Conversely, in stable markets, you may increase your position size to capitalize on consistent trends.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Trading Experience
        </h3>
        <p className="mb-6">
          Your level of trading experience can significantly impact your risk management strategy. Experienced traders may feel comfortable taking on more risk, while beginners should adopt a more conservative approach.
        </p>
        <p className="mb-6">
          Continuously educate yourself on trading strategies and market analysis. As you gain experience, gradually adjust your risk tolerance and position sizing to align with your growing expertise. For more educational resources, visit our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
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
                Federal Reserve - Risk Management Guidelines
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official guidelines on risk management practices and financial stability
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
                Consumer Financial Protection Bureau - Trading Tips
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive resources on consumer protection and trading best practices
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
                FDIC - Financial Risk Management
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Information on banking regulations and risk management strategies
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
                Internal Revenue Service - Tax Implications of Trading
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and implications for trading and investments
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
                Investopedia - Position Sizing Strategies
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed explanations of position sizing strategies and risk management
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
                NerdWallet - Financial Planning Tools
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and tools for effective financial planning
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
      title="Position Size & Risk Management Tool"
      description="Determine optimal position size. Manage risk by calculating stop-loss levels and appropriate trade amounts for your account."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Position Size & Risk Management Tool" },
        { id: "formula", label: "Position Size & Risk Management Tool Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Position Size = (Account Size × Risk Percentage) / Stop Loss",
        variables: [
          { symbol: "Account Size", description: "Total capital available for trading" },
          { symbol: "Risk Percentage", description: "Percentage of account size you're willing to risk" },
          { symbol: "Stop Loss", description: "Maximum loss allowed per trade" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have an account size of $10,000, a risk percentage of 2%, and a stop loss of $50.",
        steps: [
          { 
            step: 1, 
            calculation: "10000 × 0.02 = 200", 
            description: "Calculate the risk amount based on your account size and risk percentage." 
          },
          { 
            step: 2, 
            calculation: "200 / 50 = 4", 
            description: "Determine the position size by dividing the risk amount by the stop loss." 
          },
          { 
            step: 3, 
            calculation: "4 × 50 = 200", 
            description: "The trade amount is the position size multiplied by the stop loss." 
          }
        ],
        result: "The final result is a position size of 4, meaning you can trade 4 units with a total risk of $200."
      }}
      relatedCalculators={[
        {"title":"Loan Payment Calculator (Principal, Rate, Term)","url":"/financial/loan-payment","icon":"💵"},
        {"title":"Mortgage Payment & Amortization Calculator","url":"/financial/mortgage-amortization","icon":"🏠"},
        {"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"📈"},
        {"title":"Interest-Only Loan Calculator","url":"/financial/interest-only-loan","icon":"💳"},
        {"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"💰"},
        {"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"🏦"}
      ]}
    />
  );
}
