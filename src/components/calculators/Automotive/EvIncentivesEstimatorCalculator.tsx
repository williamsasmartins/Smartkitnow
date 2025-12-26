import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function EvIncentivesEstimatorCalculator() {
  return (
    <CalculatorVerticalLayout
      title="EV Incentives & Tax Credits Estimator"
      description="Calculate available federal/state rebates, tax credits, and net purchase price for specific EV models."
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
          <p>Calculate available federal/state rebates, tax credits, and net purchase price for specific EV models.</p>
          <p>We are working hard to bring you this tool. It will help you calculate available federal/state rebates, tax credits, and net purchase price for specific ev models.</p>
        </div>
      }
    />
  );
}
