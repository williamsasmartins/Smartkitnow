// src/components/calculators/PlaceholderCalculator.tsx
import React from "react";
import { Helmet } from "react-helmet-async";

const PlaceholderCalculator: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <Helmet>
        <meta name="robots" content="noindex,follow" />
      </Helmet>
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
