import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "../../../hooks/useFaqJsonLd";

export default function AbsencePercentageCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    totalDays: "", 
    absentDays: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "How accurate are absence rate calculations and what limitations should I be aware of?",
      answer: "This calculator provides estimates based on the inputs you provide. For absence rate, accuracy depends on using current HR data -- rates, prices, and regulatory thresholds change frequently. The results are most reliable for planning purposes and comparative analysis. For financial decisions involving significant amounts, verify results against official sources or consult a HR professional."
    },
    {
      question: "What key factors most affect absence rate results?",
      answer: "The most impactful variables in absence rate calculations are typically the primary rate or percentage input and the time horizon. Small changes in these variables compound significantly over longer periods. For example, a 1% difference in return rate over 20 years can change outcomes by 20–30%. Always run the calculation at multiple input values to understand your sensitivity to each variable."
    },
    {
      question: "When should I recalculate absence rate?",
      answer: "Recalculate whenever HR conditions change significantly: after major HR events, when your inputs change (income, rates, holdings), or when HR regulations are updated. For time-sensitive HR metrics, recalculate monthly. For long-term planning tools, a quarterly review is typically sufficient. Set a calendar reminder to revisit projections annually at minimum."
    },
    {
      question: "How does absence rate relate to other financial planning metrics?",
      answer: "No single metric tells the complete financial picture. Absence rate should be evaluated alongside related measures like workforce. These metrics interact: improving one often affects another. Build a dashboard of 3–5 key metrics that together reflect the health of your HR situation, rather than optimizing any single number in isolation."
    },
    {
      question: "What are the most common mistakes when calculating absence rate?",
      answer: "The most frequent errors in absence rate calculations: (1) Using pre-tax instead of post-tax figures where after-tax analysis is needed, (2) Ignoring fees and transaction costs that reduce net returns, (3) Using nominal figures without inflation adjustment for long-horizon projections, (4) Assuming constant rates -- real-world HR conditions fluctuate. Double-check your inputs against current HR data before relying on results for significant financial decisions."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // HELPER FUNCTION (MANDATORY)
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    const totalDaysValue = parseFloat(inputs.totalDays) || 0;
    const absentDaysValue = parseFloat(inputs.absentDays) || 0;

    // Validate
    if (totalDaysValue <= 0 || absentDaysValue < 0 || absentDaysValue > totalDaysValue) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const mainResult = (absentDaysValue / totalDaysValue) * 100;
    const result2 = mainResult * 0.5;
    const result3 = mainResult * 1.5;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      absentDays: absentDaysValue / 12,
      attendanceRate: ((totalDaysValue - (absentDaysValue / 12)) / totalDaysValue) * 100,
      balance: totalDaysValue - ((absentDaysValue / 12) * (i + 1))
    }));

    return { 
      mainResult, 
      result2, 
      result3, 
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
    setInputs({ totalDays: "", absentDays: "" });
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
              Total Days
            </Label>
            <Input
              type="number"
              placeholder="e.g., 365"
              value={inputs.totalDays}
              onChange={(e) => setInputs({ ...inputs, totalDays: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Absent Days
            </Label>
            <Input
              type="number"
              placeholder="e.g., 20"
              value={inputs.absentDays}
              onChange={(e) => setInputs({ ...inputs, absentDays: e.target.value })}
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
                      Absence Percentage
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPercentage(results.mainResult)}
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
                      Half Absence Percentage
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatPercentage(results.result2)}
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
                      One and a Half Absence Percentage
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatPercentage(results.result3)}
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
                    Monthly Absence Schedule
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
                        <TableHead className="font-semibold">Absent Days</TableHead>
                        <TableHead className="font-semibold">Attendance Rate</TableHead>
                        <TableHead className="font-semibold">Balance Days</TableHead>
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
                            <TableCell>{row.absentDays.toFixed(2)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatPercentage(row.attendanceRate)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {row.balance.toFixed(2)}
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
          Understanding Absence Percentage Calculator
        </h2>
        
        <p className="mb-6">
          The Absence Percentage Calculator is a vital tool for businesses and HR professionals seeking to monitor and manage employee attendance effectively. By calculating the percentage of days an employee is absent relative to the total working days, organizations can gain insights into attendance patterns and identify potential issues early. This calculator is particularly useful for tracking trends over time, setting benchmarks, and implementing strategies to improve workforce productivity. Whether you are managing a small team or a large corporation, understanding absence rates is crucial for maintaining operational efficiency and employee satisfaction.
        </p>
        
        <p className="mb-6">
          Accurate calculations are essential in this domain, as they directly impact workforce management decisions and financial planning. Incorrect absence data can lead to misguided policies, affecting both employee morale and company performance. Studies have shown that absenteeism can cost businesses significantly, not just in terms of lost productivity but also in increased administrative and replacement costs. This tool helps mitigate such risks by providing precise and actionable data, enabling informed decision-making. For more on financial implications, see our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information on the total number of working days and the number of days absent for the period you are analyzing. Enter these values into the respective fields, and the calculator will compute the absence percentage. It's important to ensure that the data you input is accurate and up-to-date to obtain reliable results. For further guidance on data collection, refer to our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Regularly reviewing absence percentages can help identify patterns that may indicate underlying issues, such as workplace dissatisfaction or health concerns. Addressing these proactively can lead to improved employee engagement and reduced absenteeism.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include setting realistic absence targets and comparing them against industry standards. Consider factors such as seasonal variations and external events that might affect attendance. By understanding these dynamics, you can better manage your workforce and optimize productivity.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Absence Percentage Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this calculator is straightforward yet effective for determining absence rates. It calculates the percentage of days absent by dividing the number of absent days by the total number of working days, then multiplying by 100 to convert it into a percentage. This method is widely accepted in HR analytics for its simplicity and accuracy.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Absence Percentage = (Absent Days / Total Days) × 100
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Absent Days = Number of days the employee was absent</li>
              <li>Total Days = Total number of working days in the period</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role. The "Absent Days" variable represents the total days an employee was not present, which is crucial for identifying attendance issues. The "Total Days" variable provides the context needed to assess the absence rate relative to the full working period. Adjusting either variable will directly affect the calculated percentage, highlighting the importance of accurate data entry.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence absence percentages is essential for accurate analysis. These factors can vary widely across different industries and organizational cultures, affecting how absence data is interpreted and used.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Seasonal Variations
        </h3>
        <p className="mb-4">
          Seasonal changes can significantly impact absence rates. For instance, winter months may see higher absenteeism due to illnesses like the flu. Organizations should consider these variations when analyzing absence data to avoid misinterpretations.
        </p>
        <p className="mb-6">
          To account for seasonal effects, compare absence data across similar periods in previous years. This approach helps in setting realistic benchmarks and identifying genuine trends. For more insights, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Workplace Environment
        </h3>
        <p className="mb-4">
          The work environment plays a crucial role in employee attendance. Factors such as job satisfaction, management practices, and workplace culture can all influence absence rates. A positive environment typically results in lower absenteeism.
        </p>
        <p className="mb-6">
          Regular employee feedback and engagement surveys can provide insights into the workplace environment and its impact on attendance. Addressing issues proactively can lead to improved attendance and morale.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Health and Wellness Programs
        </h3>
        <p className="mb-4">
          Organizations that invest in health and wellness programs often see a reduction in absenteeism. These programs can include health screenings, fitness incentives, and mental health support, all contributing to a healthier workforce.
        </p>
        <p className="mb-6">
          Implementing comprehensive wellness initiatives can not only reduce absence rates but also enhance overall employee well-being and productivity. For more on financial health, check our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Conditions
        </h3>
        <p className="mb-6">
          Economic factors can influence absence rates, as financial stress may lead to increased absenteeism. During economic downturns, employees might prioritize job security over health, leading to presenteeism rather than absenteeism. Conversely, in a strong economy, employees may feel more secure taking necessary time off.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Legal and Regulatory Requirements
        </h3>
        <p className="mb-6">
          Compliance with labor laws and regulations is essential in managing absence data. These laws can dictate leave entitlements and protections, influencing how absence is recorded and managed. Understanding these regulations helps ensure that absence policies are fair and compliant.
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
              <div 
                className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 space-y-3 prose dark:prose-invert max-w-none"
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
                href="https://www.shrm.org" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Society for Human Resource Management (SHRM)
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive resources on HR practices and guidelines for managing employee attendance.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.bls.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                U.S. Bureau of Labor Statistics
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official statistics and data on employment, including absenteeism trends and analysis.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.cipd.co.uk" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Chartered Institute of Personnel and Development (CIPD)
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Insights and research on people management and development, including absence management.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.hse.gov.uk" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Health and Safety Executive (HSE)
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Guidelines and advice on workplace health and safety, impacting absence management.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.who.int" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                World Health Organization (WHO)
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Global health guidelines and statistics that can influence workplace health policies.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.oecd.org" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Organisation for Economic Co-operation and Development (OECD)
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Economic reports and data that provide context for absenteeism trends globally.
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
      title="Absence Percentage Calculator"
      description="Calculate employee absence percentage. Track attendance rates useful for HR metrics and workforce management analysis."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Absence Percentage Calculator" },
        { id: "formula", label: "Absence Percentage Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Absence Percentage = (Absent Days / Total Days) × 100",
        variables: [
          { symbol: "Absent Days", description: "Number of days the employee was absent" },
          { symbol: "Total Days", description: "Total number of working days in the period" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have an employee who was absent for 15 days out of a total of 250 working days.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "15 / 250 = 0.06", 
            explanation: "Calculate the fraction of days absent." 
          },
          { 
            label: "Step 2", 
            calculation: "0.06 × 100 = 6%", 
            explanation: "Convert the fraction to a percentage to get the absence rate." 
          }
        ],
        result: "The final result is 6%, meaning the employee was absent 6% of the total working days."
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