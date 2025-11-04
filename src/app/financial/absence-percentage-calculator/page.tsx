import CalculatorUnifiedLayout from "@/components/templates/CalculatorUnifiedLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Page() {
  const [absentDays, setAbsentDays] = useState("50");
  const [employees, setEmployees] = useState("100");
  const [workdays, setWorkdays] = useState("20");

  const absent = Number(absentDays) || 0;
  const total = (Number(employees) || 0) * (Number(workdays) || 0);
  const rate = total > 0 ? ((absent / total) * 100).toFixed(2) : "0.00";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Calculator",
    "name": "Absence Percentage Calculator",
    "description": "Calculate employee absence rate with real-time results, examples, and HR insights for better workforce management.",
    "url": "https://smartkitnow.com/hr/absence-percentage-calculator",
    "inLanguage": "en-US",
    "creator": "Smart Kit Now"
  };

  return (
    <CalculatorUnifiedLayout
      title="Absence Percentage Calculator"
      jsonLd={jsonLd}
      showTopBanner={true}
      editorial={
        <>
          <section>
            <h2 className="text-2xl font-bold mb-3">How to Use This Calculator</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Tracking employee absenteeism is crucial for HR managers to maintain productivity and identify trends. This calculator helps you compute the absence rate quickly and accurately.</p>
            <ol className="list-decimal pl-6 space-y-2 text-sm">
              <li>Enter the total <strong>absent days</strong> in the selected period (e.g., a month).</li>
              <li>Input the <strong>number of employees</strong> in your team.</li>
              <li>Set the <strong>total workdays</strong> (e.g., 20 for a standard month).</li>
              <li>The <strong>absence rate</strong> updates automatically as you type.</li>
            </ol>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Tip: Use this for monthly reports to spot patterns and improve retention.</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-3">The Formula Explained</h2>
            <p className="mb-3">The absence percentage is calculated using this standard HR formula:</p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm mb-4">
              <code>Absence Rate = (Total Absent Days ÷ (Number of Employees × Total Workdays)) × 100</code>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Example: 50 absent days for 100 employees over 20 workdays = (50 ÷ (100 × 20)) × 100 = 2.50%.</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-3">Practical Examples</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h4 className="font-semibold mb-2">Low Absence (Healthy Team)</h4>
                <p className="text-sm">50 absent days, 100 employees, 20 workdays → <strong className="text-green-600">2.50%</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Excellent rate — indicates good morale.</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                <h4 className="font-semibold mb-2">High Absence (Alert)</h4>
                <p className="text-sm">200 absent days, 50 employees, 22 workdays → <strong className="text-red-600">18.18%</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Review policies — may need intervention.</p>
            </div>
          </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-3">FAQ</h2>
            <div className="space-y-4">
              <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <summary className="font-semibold cursor-pointer">What is a good absence rate?</summary>
                <p className="mt-2 text-sm">Below 2% is excellent, 2-4% average, above 5% may indicate issues. Source: SHRM guidelines.</p>
              </details>
              <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <summary className="font-semibold cursor-pointer">How to reduce absenteeism?</summary>
                <p className="mt-2 text-sm">Implement flexible hours, wellness programs, and regular feedback. Studies show 30% reduction possible.</p>
              </details>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-3">References & Resources</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><a href="https://www.shrm.org/topics-tools/tools/hr-answers/absenteeism-rate" target="_blank" className="text-blue-600 hover:underline">SHRM - Absenteeism Rate Calculation</a></li>
              <li><a href="https://www.betterworks.com/magazine/employee-absenteeism/" target="_blank" className="text-blue-600 hover:underline">BetterWorks - Reducing Absenteeism</a></li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-3">Related Calculators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="/hr/paycheck-calculator" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100">
                <h4 className="font-semibold">Paycheck Calculator</h4>
                <p className="text-sm text-gray-600">Calculate take-home pay and deductions.</p>
              </a>
              <a href="/hr/salary-converter" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100">
                <h4 className="font-semibold">Salary Converter</h4>
                <p className="text-sm text-gray-600">Hourly to annual salary conversion.</p>
              </a>
            </div>
          </section>
        </>
      }
      widget={
        <div className="space-y-4">
          <div>
            <Label>Absent Days</Label>
            <Input value={absentDays} onChange={e => setAbsentDays(e.target.value)} placeholder="e.g. 50" />
          </div>
          <div>
            <Label>Employees</Label>
            <Input value={employees} onChange={e => setEmployees(e.target.value)} placeholder="e.g. 100" />
          </div>
          <div>
            <Label>Workdays</Label>
            <Input value={workdays} onChange={e => setWorkdays(e.target.value)} placeholder="e.g. 20" />
          </div>
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-center">
            <h3 className="font-bold text-xl mb-1">Absence Rate</h3>
            <p className="text-4xl">{rate}%</p>
            <p className="text-sm opacity-90">Updated automatically</p>
          </div>
        </div>
      }
    />
  );
}
