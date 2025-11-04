import CalculatorUnifiedLayout from "@/components/templates/CalculatorUnifiedLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function AbsencePercentageCalculator() {
  const [absentDays, setAbsentDays] = useState("");
  const [employees, setEmployees] = useState("");
  const [workdays, setWorkdays] = useState("");

  const absent = Number(absentDays) || 0;
  const totalEmployees = Number(employees) || 0;
  const totalWorkdays = Number(workdays) || 0;

  const rate = totalEmployees > 0 && totalWorkdays > 0 
    ? ((absent / (totalEmployees * totalWorkdays)) * 100).toFixed(2) 
    : "0.00";

  return (
    <CalculatorUnifiedLayout
      title="Absence Percentage Calculator"
      editorial={
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">How to use</h2>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Enter absent days, number of employees, and workdays</li>
              <li>Absence rate updates automatically</li>
            </ol>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Formula</h2>
            <pre className="bg-black/10 p-3 rounded text-xs">
              rate = (absent_days / (employees × workdays)) × 100
            </pre>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Examples</h2>
            <p className="text-sm">50 absent, 100 employees, 20 days → 2.50%</p>
            <p className="text-sm">200 absent, 50 employees, 22 days → 18.18%</p>
          </section>
        </div>
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
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center font-bold text-lg">
            Absence Rate: {rate}%
          </div>
        </div>
      }
    />
  );
}
