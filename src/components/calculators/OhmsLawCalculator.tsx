import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Calculator } from "lucide-react";

const OhmsLawCalculator = () => {
  const [voltage, setVoltage] = useState<string>('');
  const [current, setCurrent] = useState<string>('');
  const [resistance, setResistance] = useState<string>('');
  const [power, setPower] = useState<string>('');
  const [calculate, setCalculate] = useState<string>('voltage');
  const [result, setResult] = useState<string>('');

  const calculateValues = () => {
    const v = parseFloat(voltage);
    const i = parseFloat(current);
    const r = parseFloat(resistance);
    const p = parseFloat(power);

    let resultValue = 0;
    let unit = '';

    switch (calculate) {
      case 'voltage':
        if (i && r) {
          resultValue = i * r; // V = I × R
          unit = 'V';
        } else if (p && i) {
          resultValue = p / i; // V = P / I
          unit = 'V';
        } else if (p && r) {
          resultValue = Math.sqrt(p * r); // V = √(P × R)
          unit = 'V';
        }
        break;
      case 'current':
        if (v && r) {
          resultValue = v / r; // I = V / R
          unit = 'A';
        } else if (p && v) {
          resultValue = p / v; // I = P / V
          unit = 'A';
        } else if (p && r) {
          resultValue = Math.sqrt(p / r); // I = √(P / R)
          unit = 'A';
        }
        break;
      case 'resistance':
        if (v && i) {
          resultValue = v / i; // R = V / I
          unit = 'Ω';
        } else if (v && p) {
          resultValue = (v * v) / p; // R = V² / P
          unit = 'Ω';
        } else if (p && i) {
          resultValue = p / (i * i); // R = P / I²
          unit = 'Ω';
        }
        break;
      case 'power':
        if (v && i) {
          resultValue = v * i; // P = V × I
          unit = 'W';
        } else if (v && r) {
          resultValue = (v * v) / r; // P = V² / R
          unit = 'W';
        } else if (i && r) {
          resultValue = i * i * r; // P = I² × R
          unit = 'W';
        }
        break;
    }

    if (resultValue > 0) {
      setResult(`${resultValue.toFixed(4)} ${unit}`);
    } else {
      setResult('Insufficient data for calculation');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Ohm's Law Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="calculate">Calculate</Label>
            <Select value={calculate} onValueChange={setCalculate}>
              <SelectTrigger id="calculate" aria-label="Calculate">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                <SelectItem value="voltage">Voltage (V)</SelectItem>
                <SelectItem value="current">Current (I)</SelectItem>
                <SelectItem value="resistance">Resistance (R)</SelectItem>
                <SelectItem value="power">Power (P)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {calculate !== 'voltage' && (
              <div className="space-y-2">
                <Label htmlFor="voltage">Voltage (V)</Label>
                <Input
                  id="voltage"
                  type="number"
                  placeholder="Enter voltage in volts"
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  step="0.01"
                />
              </div>
            )}

            {calculate !== 'current' && (
              <div className="space-y-2">
                <Label htmlFor="current">Current (A)</Label>
                <Input
                  id="current"
                  type="number"
                  placeholder="Enter current in amps"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  step="0.01"
                />
              </div>
            )}

            {calculate !== 'resistance' && (
              <div className="space-y-2">
                <Label htmlFor="resistance">Resistance (Ω)</Label>
                <Input
                  id="resistance"
                  type="number"
                  placeholder="Enter resistance in ohms"
                  value={resistance}
                  onChange={(e) => setResistance(e.target.value)}
                  step="0.01"
                />
              </div>
            )}

            {calculate !== 'power' && (
              <div className="space-y-2">
                <Label htmlFor="power">Power (W)</Label>
                <Input
                  id="power"
                  type="number"
                  placeholder="Enter power in watts"
                  value={power}
                  onChange={(e) => setPower(e.target.value)}
                  step="0.01"
                />
              </div>
            )}
          </div>

          <Button onClick={calculateValues} className="w-full">
            Calculate {calculate.charAt(0).toUpperCase() + calculate.slice(1)}
          </Button>

          {result && (
            <Card className="bg-muted/30 border-border/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Result:</h3>
                  <Badge variant="secondary" className="text-lg p-3">
                    {result}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Ohm's Law Formulas:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>V = I × R</strong> (Voltage = Current × Resistance)</li>
              <li><strong>I = V / R</strong> (Current = Voltage / Resistance)</li>
              <li><strong>R = V / I</strong> (Resistance = Voltage / Current)</li>
              <li><strong>P = V × I</strong> (Power = Voltage × Current)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OhmsLawCalculator;