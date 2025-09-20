import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const ROICalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [result, setResult] = useState<{
    roi: number;
    gain: number;
    roiPercentage: number;
  } | null>(null);

  const calculateROI = () => {
    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);

    if (initial > 0 && final >= 0) {
      const gain = final - initial;
      const roi = gain / initial;
      const roiPercentage = roi * 100;

      setResult({
        roi: Math.round(roi * 10000) / 10000,
        gain: Math.round(gain * 100) / 100,
        roiPercentage: Math.round(roiPercentage * 100) / 100
      });
    }
  };

  const handleReset = () => {
    setInitialInvestment('');
    setFinalValue('');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ROI (Return on Investment) Calculator</CardTitle>
          <CardDescription>
            Calculate the return on investment for any investment or business decision.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
              <Input
                id="initialInvestment"
                type="number"
                placeholder="10000"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finalValue">Final Value ($)</Label>
              <Input
                id="finalValue"
                type="number"
                placeholder="12000"
                value={finalValue}
                onChange={(e) => setFinalValue(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={calculateROI} className="flex-1">
              Calculate ROI
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {result && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${result.roiPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.roiPercentage.toFixed(2)}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">ROI Percentage</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${result.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${result.gain.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.gain >= 0 ? 'Gain' : 'Loss'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {result.roi.toFixed(4)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">ROI Ratio</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Formula Used:</h4>
                <p className="text-sm text-muted-foreground">
                  ROI = (Final Value - Initial Investment) / Initial Investment
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ROI Percentage = ROI × 100
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};