import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  formula?: string;
  example?: string;
}

export const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({
  title,
  description,
  children,
  formula,
  example
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">{title}</CardTitle>
          <CardDescription className="text-lg">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
        </CardContent>
      </Card>
      
      {(formula || example) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formula && (
              <div>
                <h4 className="font-semibold mb-2">Formula:</h4>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">{formula}</div>
              </div>
            )}
            {example && (
              <div>
                <h4 className="font-semibold mb-2">Example:</h4>
                <p className="text-muted-foreground">{example}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};