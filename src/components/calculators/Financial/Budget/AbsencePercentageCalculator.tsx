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
        "description": "Calculate employee absence rate instantly with examples and HR insights.",
        "url": "https://smartkitnow.com/financial/absence-percentage-calculator"
      }}
      editorial={
        <>
          {/* Instruções */}
          <section>
            <h2 className="text-2xl font-bold mb-3">How to Use</h2>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Enter total <strong>absent days</strong> in the period</li>
              <li>Input <strong>number of employees</strong></li>
              <li>Set <strong>workdays</strong> (e.g., 20 per month)</li>
              <li>Result updates <strong>live</strong></li>
            </ol>
          </section>

          {/* Fórmula */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-3">Formula</h2>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
              Absence Rate = (Absent Days ÷ (Employees × Workdays)) × 100
            </div>
          </section>

          {/* Exemplos */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-3">Real Examples</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <p className="font-semibold">Healthy Team</p>
                <p>50 absent, 100 employees, 20 days → <strong>2.50%</strong></p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                <p className="font-semibold">High Absence</p>
                <p>200 absent, 50 employees, 22 days → <strong>18.18%</strong></p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-3">FAQ</h2>
            <div className="space-y-4">
              <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <summary className="font-semibold cursor-pointer">What is a good absence rate?</summary>
                <p className="mt-2 text-sm">Below 2% is excellent. 2–4% is average. Above 5% needs attention.</p>
              </details>
            </div>
          </section>
        </>
      }
      widget={
        <div className="space-y-4 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md border">
          <div>
            <Label>Absent Days</Label>
            <Input value={absentDays} onChange={e => setAbsentDays(e.target.value)} placeholder="50" />
          </div>
          <div>
            <Label>Employees</Label>
            <Input value={employees} onChange={e => setEmployees(e.target.value)} placeholder="100" />
          </div>
          <div>
            <Label>Workdays</Label>
            <Input value={workdays} onChange={e => setWorkdays(e.target.value)} placeholder="20" />
          </div>
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-center font-bold text-4xl">
            {rate}%
          </div>
        </div>
      }
      railRight={
        <div className="space-y-6">
          <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl h-64 flex items-center justify-center text-xs text-gray-500">
            ADSENSE 300x600
          </div>
        </div>
      }
    />
  );
}