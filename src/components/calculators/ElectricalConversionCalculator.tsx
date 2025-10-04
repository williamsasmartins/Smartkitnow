import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, ArrowRight } from "lucide-react";

const ElectricalConversionCalculator = () => {
  const [value, setValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('watts');
  const [toUnit, setToUnit] = useState<string>('amps');
  const [voltage, setVoltage] = useState<string>('120');
  const [powerFactor, setPowerFactor] = useState<string>('1');
  const [result, setResult] = useState<string>('');

  const conversionTypes = {
    'watts': { label: 'Watts (W)', needsVoltage: true, needsPF: false },
    'amps': { label: 'Amps (A)', needsVoltage: true, needsPF: false },
    'volts': { label: 'Volts (V)', needsVoltage: false, needsPF: false },
    'kw': { label: 'Kilowatts (kW)', needsVoltage: true, needsPF: false },
    'kva': { label: 'Kilovolt-Amps (kVA)', needsVoltage: true, needsPF: true },
    'hp': { label: 'Horsepower (HP)', needsVoltage: true, needsPF: false },
    'kwh': { label: 'Kilowatt-Hours (kWh)', needsVoltage: false, needsPF: false },
    'wh': { label: 'Watt-Hours (Wh)', needsVoltage: false, needsPF: false },
    'ah': { label: 'Amp-Hours (Ah)', needsVoltage: true, needsPF: false }
  };

  const convert = () => {
    const inputValue = parseFloat(value);
    const voltageValue = parseFloat(voltage);
    const pf = parseFloat(powerFactor);

    if (!inputValue || !voltageValue) return;

    let resultValue = 0;
    let resultUnit = '';

    // Convert input to watts first (base unit)
    let watts = 0;
    switch (fromUnit) {
      case 'watts':
        watts = inputValue;
        break;
      case 'amps':
        watts = inputValue * voltageValue; // P = V × I
        break;
      case 'volts':
        // Can't convert volts alone to watts without current
        setResult('Need current (amps) to convert volts to power');
        return;
      case 'kw':
        watts = inputValue * 1000;
        break;
      case 'kva':
        watts = inputValue * 1000 * pf; // kW = kVA × PF
        break;
      case 'hp':
        watts = inputValue * 745.7; // 1 HP = 745.7 watts
        break;
      case 'kwh':
        // Need time duration for conversion
        setResult('Need time duration to convert kWh to instantaneous power');
        return;
      case 'wh':
        setResult('Need time duration to convert Wh to instantaneous power');
        return;
      case 'ah':
        watts = inputValue * voltageValue; // Wh = Ah × V, then assume 1 hour
        break;
    }

    // Convert watts to target unit
    switch (toUnit) {
      case 'watts':
        resultValue = watts;
        resultUnit = 'W';
        break;
      case 'amps':
        resultValue = watts / voltageValue; // I = P / V
        resultUnit = 'A';
        break;
      case 'volts':
        // Can't convert power alone to volts without current
        setResult('Need current (amps) to convert power to volts');
        return;
      case 'kw':
        resultValue = watts / 1000;
        resultUnit = 'kW';
        break;
      case 'kva':
        resultValue = (watts / 1000) / pf; // kVA = kW / PF
        resultUnit = 'kVA';
        break;
      case 'hp':
        resultValue = watts / 745.7;
        resultUnit = 'HP';
        break;
      case 'kwh':
        setResult('Need time duration to convert to kWh');
        return;
      case 'wh':
        setResult('Need time duration to convert to Wh');
        return;
      case 'ah':
        resultValue = watts / voltageValue; // Ah = Wh / V, assume 1 hour
        resultUnit = 'Ah';
        break;
    }

    const formattedResult = resultValue < 0.01 ? 
      resultValue.toExponential(3) : 
      resultValue.toFixed(4).replace(/\.?0+$/, '');

    setResult(`${value} ${conversionTypes[fromUnit as keyof typeof conversionTypes].label} = ${formattedResult} ${resultUnit}`);
  };

  const needsVoltage = conversionTypes[fromUnit as keyof typeof conversionTypes]?.needsVoltage || 
                      conversionTypes[toUnit as keyof typeof conversionTypes]?.needsVoltage;
  
  const needsPF = conversionTypes[fromUnit as keyof typeof conversionTypes]?.needsPF || 
                  conversionTypes[toUnit as keyof typeof conversionTypes]?.needsPF;

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Electrical Conversion Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                placeholder="Enter value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromUnit">From</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger id="fromUnit" aria-label="From unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  {Object.entries(conversionTypes).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="toUnit">To</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger id="toUnit" aria-label="To unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  {Object.entries(conversionTypes).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={convert} disabled={!value} className="w-full">
              Convert
            </Button>
          </div>

          {needsVoltage && (
            <div className="space-y-2">
              <Label htmlFor="voltage">Voltage (V)</Label>
              <Input
                id="voltage"
                type="number"
                placeholder="Enter voltage"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                step="0.1"
              />
            </div>
          )}

          {needsPF && (
            <div className="space-y-2">
              <Label htmlFor="powerFactor">Power Factor</Label>
              <Input
                id="powerFactor"
                type="number"
                placeholder="Enter power factor (0-1)"
                value={powerFactor}
                onChange={(e) => setPowerFactor(e.target.value)}
                min="0"
                max="1"
                step="0.01"
              />
            </div>
          )}

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
            <h4 className="font-medium mb-2">Common Electrical Conversions:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 1 HP = 745.7 watts</li>
              <li>• P (watts) = V (volts) × I (amps)</li>
              <li>• kVA = kW / Power Factor</li>
              <li>• kWh = kW × Hours</li>
              <li>• Typical household voltage: 120V or 240V</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElectricalConversionCalculator;