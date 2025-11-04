import React, { useState } from "react";
import CalculatorLayoutOmni from "@/components/templates/CalculatorLayoutOmni";

export default function AbsencePercentageCalculator() {
  const [employees, setEmployees] = useState<string>("");
  const [workdays, setWorkdays] = useState<string>("");
  const [absentDays, setAbsentDays] = useState<string>("");
  const [rate, setRate] = useState<number | null>(null);

  const calculate = () => {
    const e = parseFloat(employees);
    const w = parseFloat(workdays);
    const a = parseFloat(absentDays);
    if (!isFinite(e) || !isFinite(w) || !isFinite(a) || e <= 0 || w <= 0 || a < 0) {
      setRate(null);
      return;
    }
    const value = (a / (e * w)) * 100;
    setRate(value);
  };

  return (
    <CalculatorLayoutOmni
      title="Absence Percentage Calculator"
      editorial={
        <>
          <p>
            This absence percentage calculator helps companies determine the absenteeism rate of their employees.
          </p>

          <h2>How to calculate the percentage of absence</h2>
          <ol>
            <li>Choose the period.</li>
            <li>Find total employees (or average).</li>
            <li>Count workdays (exclude weekends/holidays).</li>
            <li>Sum all absent days.</li>
          </ol>

          <p>
            <strong>Formula:</strong>
          </p>
          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              padding: "1rem",
              borderRadius: "8px",
              fontFamily: "monospace",
              margin: "1rem 0",
            }}
          >
            Absence rate = (Total days absent / (Employees × Workdays)) × 100
          </div>
        </>
      }
      widget={
        <div className="space-y-4">
          <input
            placeholder="Total employees"
            className="w-full p-3 border rounded"
            value={employees}
            onChange={(e) => setEmployees(e.target.value)}
            inputMode="numeric"
          />
          <input
            placeholder="Total workdays"
            className="w-full p-3 border rounded"
            value={workdays}
            onChange={(e) => setWorkdays(e.target.value)}
            inputMode="numeric"
          />
          <input
            placeholder="Total days absent"
            className="w-full p-3 border rounded"
            value={absentDays}
            onChange={(e) => setAbsentDays(e.target.value)}
            inputMode="numeric"
          />
          <button className="w-full bg-blue-600 text-white py-3 rounded" onClick={calculate}>
            Calculate
          </button>
          <div className="text-center font-bold text-xl">
            Rate: {rate === null ? "—" : `${rate.toFixed(2)} %`}
          </div>
        </div>
      }
      adContent={
        <div>
          {/* Depois: <ins class="adsbygoogle" ...></ins> */}
          <p className="text-xs">Ad space ready</p>
        </div>
      }
    />
  );
}