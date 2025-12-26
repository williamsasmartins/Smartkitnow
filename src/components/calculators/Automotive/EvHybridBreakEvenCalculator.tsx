import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function EvHybridBreakEvenCalculator() {
  return (
    <CalculatorVerticalLayout
      title="EV vs Hybrid Break-Even Point Calculator"
      description="Determine how many miles or years needed for an EV to become cheaper than a hybrid or gas car."
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
          <p>Determine how many miles or years needed for an EV to become cheaper than a hybrid or gas car.</p>
          <p>We are working hard to bring you this tool. It will help you determine how many miles or years needed for an ev to become cheaper than a hybrid or gas car.</p>
        </div>
      }
    />
  );
}
