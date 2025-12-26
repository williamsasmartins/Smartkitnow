import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function EvPreconditioningCostCalculator() {
  return (
    <CalculatorVerticalLayout
      title="EV Preconditioning Energy & Cost Estimator"
      description="Estimate battery energy used and cost for preconditioning (heating/cooling) the cabin while plugged in, vs doing it while driving."
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
          <p>Estimate battery energy used and cost for preconditioning (heating/cooling) the cabin while plugged in, vs doing it while driving.</p>
          <p>We are working hard to bring you this tool. It will help you estimate battery energy used and cost for preconditioning (heating/cooling) the cabin while plugged in, vs doing it while driving.</p>
        </div>
      }
    />
  );
}
