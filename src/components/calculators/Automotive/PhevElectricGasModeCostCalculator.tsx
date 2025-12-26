import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function PhevElectricGasModeCostCalculator() {
  return (
    <CalculatorVerticalLayout
      title="PHEV Electric vs Gas Mode Cost Calculator"
      description="For plug-in hybrids: Compare costs of driving in electric-only mode vs gas mode for daily commutes or trips."
      widget={
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">This calculator is currently under development. Please check back soon!</p>
          </CardContent>
        </Card>
      }
      editorial={
        <div className="prose dark:prose-invert max-w-none">
          <h2>About this calculator</h2>
          <p>For plug-in hybrids: Compare costs of driving in electric-only mode vs gas mode for daily commutes or trips.</p>
          <p>We are working hard to bring you this tool. It will help you for plug-in hybrids: compare costs of driving in electric-only mode vs gas mode for daily commutes or trips.</p>
        </div>
      }
    />
  );
}
