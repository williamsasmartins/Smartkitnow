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
      question: "What is absence percentage and how is it calculated?",
      answer: "Absence percentage measures the proportion of scheduled work time an employee misses due to absences. It is calculated by dividing total absent hours by total scheduled work hours, then multiplying by 100. For example, if an employee is absent 8 hours out of 160 scheduled hours in a month, the absence percentage is 5%. This metric helps organizations track attendance patterns and identify potential productivity or engagement issues.",
    },
    {
      question: "What is considered a normal or acceptable absence percentage?",
      answer: "Industry benchmarks suggest an acceptable absence rate is typically between 2-4% annually for most organizations. The Society for Human Resource Management (SHRM) reports that the average absence rate across U.S. companies is approximately 2.8%. However, acceptable rates vary by industry—healthcare and manufacturing often experience 4-5% rates due to shift work and physical demands, while professional services may maintain 1.5-2.5%.",
    },
    {
      question: "How do I account for paid time off (PTO) in absence calculations?",
      answer: "Paid time off such as vacation days, sick leave, and personal days should typically be excluded from absence percentage calculations unless your organization specifically tracks them as absences. The calculator should focus on unscheduled or unauthorized absences only. If you want to include PTO, clearly document this methodology to ensure consistency and fair comparison across your organization.",
    },
    {
      question: "What time period should I use when calculating absence percentage?",
      answer: "Most organizations calculate absence percentage on a monthly, quarterly, or annual basis. Annual calculations (typically 260 working days or 2,080 hours) provide the most reliable benchmark for identifying chronic absenteeism patterns. Monthly calculations are useful for identifying seasonal trends, while quarterly reviews help balance short-term fluctuations and provide actionable intervention points.",
    },
    {
      question: "How does absence percentage impact productivity and costs?",
      answer: "Research from the Society for Human Resource Management indicates that unplanned absences cost employers an average of $2,650 per employee annually in lost productivity. A 5% absence rate means losing approximately 10 work days per employee per year, which can significantly impact project timelines, team morale, and operational efficiency. Even reducing absence rates by 1-2% can result in substantial cost savings and improved organizational performance.",
    },
    {
      question: "Should I include remote workers differently when calculating absence percentage?",
      answer: "Remote workers should be calculated using the same methodology as in-office employees based on scheduled work hours. However, organizations should establish clear definitions of what constitutes an absence for remote workers, such as unscheduled unavailability during core working hours. The total scheduled hours should reflect the agreed-upon work schedule regardless of location.",
    },
    {
      question: "What is the difference between excused and unexcused absences in percentage calculations?",
      answer: "Excused absences include pre-approved leave such as scheduled time off, medical appointments, and emergency situations, while unexcused absences are unauthorized or unscheduled missing time. Many organizations calculate absence percentage using both metrics separately—unexcused absences typically represent a smaller percentage (0.5-1%) and are weighted more heavily in performance evaluations. Some calculators include only unexcused absences for a more accurate assessment of attendance problems.",
    },
    {
      question: "How can I use absence percentage to identify problematic attendance patterns?",
      answer: "Monitor trends over time—employees with consistently increasing absence rates (rising from 2% to 5% over several months) warrant intervention. Calculate absence percentages for specific days (Mondays/Fridays suggest longer weekends) or seasons to identify patterns. Flag any employee exceeding 5% annual absence rate or taking frequent single-day absences, as these often correlate with disengagement or underlying issues requiring management attention.",
    },
    {
      question: "What legal considerations should I know about tracking and using absence percentage?",
      answer: "Employers must comply with the Family and Medical Leave Act (FMLA), which protects up to 12 weeks of unpaid leave annually and cannot count against attendance records. Similarly, absences related to disability accommodations under the ADA must be handled separately and not penalized. Document all absence tracking consistently and ensure policies comply with state employment laws, which vary regarding sick leave requirements and religious accommodation absences.",
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
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Absence Percentage Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Absence Percentage Calculator helps HR professionals and managers quickly determine what percentage of scheduled work time employees have missed due to absences. This metric is essential for tracking attendance patterns, identifying problematic trends, and benchmarking your organization against industry standards. By converting raw absence hours into a percentage, you can easily compare employee attendance records and make data-driven decisions about attendance management.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need two key inputs: the total number of hours an employee was scheduled to work during your measurement period (typically monthly or annually), and the total number of hours they were absent due to unscheduled or unauthorized time off. For annual calculations, use 2,080 hours for full-time employees working 40 hours per week over 52 weeks. Be consistent about whether you're including or excluding paid time off, as this affects your final percentage and comparability.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The resulting absence percentage should be interpreted against your industry benchmark and internal policies. An absence rate of 2-3% is generally considered acceptable for most professional organizations, while rates above 5% warrant management intervention. Track these percentages over multiple periods to identify trends—an employee whose rate rises from 2% to 5% over six months requires different attention than someone consistently at 5%. Use the percentage as a starting point for conversations about underlying barriers, workload issues, or engagement concerns.</p>
        </div>
      </section>

      {/* TABLE: Annual Absence Percentage Benchmarks by Industry (2024) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Absence Percentage Benchmarks by Industry (2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows average absence rates across major U.S. industries based on SHRM and Bureau of Labor Statistics data.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Industry</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Absence %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Absence %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low Absence %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Professional Services</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Technology</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Finance & Insurance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Manufacturing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.8%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Healthcare</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.2%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Retail & Hospitality</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.8%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Government</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.9%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Education</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.8%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data represents industry averages; actual rates vary by organization size, region, and employee demographics.</p>
      </section>

      {/* TABLE: Absence Calculation Examples (40-hour work week, 52 weeks annually) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Absence Calculation Examples (40-hour work week, 52 weeks annually)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These examples demonstrate how to calculate absence percentages across different scenarios and time periods.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Scenario</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Hours Absent</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Scheduled Hours</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Absence %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1 week absence (vacation)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2080</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.9%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2 days per month absence</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">96</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2080</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.6%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1 day per week absence</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">208</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2080</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.0%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5 days quarterly absence</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">520 (quarterly)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.7%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Monday absence every 2 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">104</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2080</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.0%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3 hours per week absence</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">156</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2080</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 days annually unexcused</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2080</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.8%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Based on standard 40-hour work weeks; adjust scheduled hours if your organization uses different schedules.</p>
      </section>

      {/* TABLE: Absence Percentage Action Thresholds */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Absence Percentage Action Thresholds</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table outlines recommended management actions based on employee absence percentage levels.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Absence % Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0-2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Recognition and positive reinforcement</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2-4%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Acceptable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Routine monitoring; align with benchmarks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4-6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Concerning</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Informal meeting to discuss patterns and barriers</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6-8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Problematic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Formal attendance discussion; develop action plan</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8%+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Documented warning; potential disciplinary action</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Thresholds should be adjusted based on industry norms, company policies, and individual circumstances such as disability accommodations.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Calculate absence percentages monthly in addition to annually to catch emerging patterns early—employees who miss one day every other Friday show different risks than those with sporadic absences, and monthly tracking reveals this trend faster.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Establish clear definitions of what counts as an absence before you start calculating, and communicate these definitions to your team to ensure consistency and fairness across your organization.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare individual absence percentages to department and company averages rather than arbitrary thresholds—a 4% absence rate might be acceptable in healthcare but concerning in professional services.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Separate excused and unexcused absences in your calculations to get a more nuanced picture—an employee with 5% unexcused absence warrants different intervention than one with 5% total absence that includes approved medical leave.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Including paid time off in absence calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Counting vacation days, sick leave, and personal days as absences inflates your absence percentage and doesn't reflect true attendance issues. Unless your organization specifically tracks PTO as a separate metric, exclude it from absence percentage calculations to maintain accurate benchmarks.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using inconsistent work hour calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Switching between 2,080 hours annually, 160 hours monthly, and other calculations without adjusting for part-time schedules creates misleading comparisons. Always use the actual scheduled hours for each employee based on their specific work arrangement.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Failing to account for protected absences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">FMLA-protected leave, disability accommodations under the ADA, and other legal protections cannot be counted against attendance records. Ignoring these protections exposes your organization to legal liability and undermines fair HR practices.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Making decisions based on single-month data</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Monthly absence percentages fluctuate due to seasonal factors, illness seasons, and random events; one high month doesn't indicate a pattern requiring intervention. Always review at least 3-6 months of data before taking action on attendance concerns.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is absence percentage and how is it calculated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Absence percentage measures the proportion of scheduled work time an employee misses due to absences. It is calculated by dividing total absent hours by total scheduled work hours, then multiplying by 100. For example, if an employee is absent 8 hours out of 160 scheduled hours in a month, the absence percentage is 5%. This metric helps organizations track attendance patterns and identify potential productivity or engagement issues.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is considered a normal or acceptable absence percentage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Industry benchmarks suggest an acceptable absence rate is typically between 2-4% annually for most organizations. The Society for Human Resource Management (SHRM) reports that the average absence rate across U.S. companies is approximately 2.8%. However, acceptable rates vary by industry—healthcare and manufacturing often experience 4-5% rates due to shift work and physical demands, while professional services may maintain 1.5-2.5%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for paid time off (PTO) in absence calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Paid time off such as vacation days, sick leave, and personal days should typically be excluded from absence percentage calculations unless your organization specifically tracks them as absences. The calculator should focus on unscheduled or unauthorized absences only. If you want to include PTO, clearly document this methodology to ensure consistency and fair comparison across your organization.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What time period should I use when calculating absence percentage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most organizations calculate absence percentage on a monthly, quarterly, or annual basis. Annual calculations (typically 260 working days or 2,080 hours) provide the most reliable benchmark for identifying chronic absenteeism patterns. Monthly calculations are useful for identifying seasonal trends, while quarterly reviews help balance short-term fluctuations and provide actionable intervention points.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does absence percentage impact productivity and costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Research from the Society for Human Resource Management indicates that unplanned absences cost employers an average of $2,650 per employee annually in lost productivity. A 5% absence rate means losing approximately 10 work days per employee per year, which can significantly impact project timelines, team morale, and operational efficiency. Even reducing absence rates by 1-2% can result in substantial cost savings and improved organizational performance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include remote workers differently when calculating absence percentage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Remote workers should be calculated using the same methodology as in-office employees based on scheduled work hours. However, organizations should establish clear definitions of what constitutes an absence for remote workers, such as unscheduled unavailability during core working hours. The total scheduled hours should reflect the agreed-upon work schedule regardless of location.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between excused and unexcused absences in percentage calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excused absences include pre-approved leave such as scheduled time off, medical appointments, and emergency situations, while unexcused absences are unauthorized or unscheduled missing time. Many organizations calculate absence percentage using both metrics separately—unexcused absences typically represent a smaller percentage (0.5-1%) and are weighted more heavily in performance evaluations. Some calculators include only unexcused absences for a more accurate assessment of attendance problems.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How can I use absence percentage to identify problematic attendance patterns?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Monitor trends over time—employees with consistently increasing absence rates (rising from 2% to 5% over several months) warrant intervention. Calculate absence percentages for specific days (Mondays/Fridays suggest longer weekends) or seasons to identify patterns. Flag any employee exceeding 5% annual absence rate or taking frequent single-day absences, as these often correlate with disengagement or underlying issues requiring management attention.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What legal considerations should I know about tracking and using absence percentage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Employers must comply with the Family and Medical Leave Act (FMLA), which protects up to 12 weeks of unpaid leave annually and cannot count against attendance records. Similarly, absences related to disability accommodations under the ADA must be handled separately and not penalized. Document all absence tracking consistently and ensure policies comply with state employment laws, which vary regarding sick leave requirements and religious accommodation absences.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.shrm.org/research" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SHRM 2024 Absence in the Workplace Study</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative data on absence rates, costs, and trends across U.S. industries from the Society for Human Resource Management.</p>
          </li>
          <li>
            <a href="https://www.dol.gov/agencies/whd/fmla" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Labor - FMLA Overview</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidance on Family and Medical Leave Act requirements and how protected leave must be tracked separately from attendance records.</p>
          </li>
          <li>
            <a href="https://www.eeoc.gov/disabilities" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EEOC - Disability Accommodations and Absences</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Information on ADA compliance and accommodations related to absences, including rules on tracking disability-related leave.</p>
          </li>
          <li>
            <a href="https://www.bls.gov/news.release/empsit.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bureau of Labor Statistics - Job Absences Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Current employment statistics including data on worker absences and labor force participation trends.</p>
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