'use client';

import CalculatorUnifiedLayout from "@/components/templates/CalculatorUnifiedLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";

export default function AbsencePercentageCalculator() {
  const [absentDays, setAbsentDays] = useState("50");
  const [employees, setEmployees] = useState("100");
  const [workdays, setWorkdays] = useState("20");

  const rate = useMemo(() => {
    const absent = Number(absentDays) || 0;
    const total = (Number(employees) || 0) * (Number(workdays) || 0);
    return total > 0 ? ((absent / total) * 100).toFixed(2) : "0.00";
  }, [absentDays, employees, workdays]);

  return (
    <CalculatorUnifiedLayout
      title="Absence Percentage Calculator"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Calculator",
        "name": "Absence Percentage Calculator",
        "url": "https://smartkitnow.com/financial/absence-percentage-calculator"
      }}
      editorial={
        <>
          <section>
            <h2 className="text-2xl font-bold mb-3">How to Use</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Enter <strong>absent days</strong></li>
              <li>Input <strong>number of employees</strong></li>
              <li>Set <strong>workdays</strong></li>
              <li>Result updates live</li>
            </ol>
          </section>
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-3">Formula</h2>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono">
              rate = (absent_days / (employees × workdays)) × 100
            </div>
          </section>
        </>
      }
      widget={
        <div className="space-y-4 p-4 bg-white dark:bg-gray-900 rounded-xl shadow">
          <div><Label>Absent Days</Label><Input value={absentDays} onChange={e => setAbsentDays(e.target.value)} /></div>
          <div><Label>Employees</Label><Input value={employees} onChange={e => setEmployees(e.target.value)} /></div>
          <div><Label>Workdays</Label><Input value={workdays} onChange={e => setWorkdays(e.target.value)} /></div>
          <div className="text-4xl font-bold text-center p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl">
            {rate}%
          </div>
        </div>
      }
    />
  );
}
