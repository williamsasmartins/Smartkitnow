// src/components/calculators/PaintCalculator.tsx
import React from "react";

export default function PaintCalculator() {
  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Paint Calculator</h1>
        <p className="text-muted-foreground">
          Estimate paint needed by area, number of coats, and coverage.
        </p>
      </header>

      <section className="rounded-2xl border p-4 shadow-sm">
        <p className="text-muted-foreground">
          Placeholder screen. Soon you’ll be able to enter room dimensions, coats, and coverage (m²/L or ft²/gal) to get an estimate.
        </p>
      </section>
    </div>
  );
}
