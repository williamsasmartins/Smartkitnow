// src/components/calculators/PlaceholderCalculator.tsx
import React from "react";

const PlaceholderCalculator: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Coming soon</h2>
        <p className="text-muted-foreground">
          We’re preparing this calculator. Check back shortly!
        </p>
      </div>
    </div>
  );
};

export default PlaceholderCalculator;
