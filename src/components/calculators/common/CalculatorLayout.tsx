import React, { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CalculatorLayoutProps extends PropsWithChildren {
  title: string;
  description: string;
  formula?: string;
  example?: string;
}

export const CalculatorLayout = ({ children, title, description, formula, example }: CalculatorLayoutProps) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-4">{description}</p>
        {formula && <div className="mb-4 p-4 bg-muted rounded-lg"><strong>Formula:</strong> {formula}</div>}
        {example && <div className="mb-4 p-4 bg-muted rounded-lg"><strong>Example:</strong> {example}</div>}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};