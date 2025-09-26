import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Zap, AlertTriangle } from "lucide-react";

const WireSizeCalculator = () => {
  const [current, setCurrent] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [voltage, setVoltage] = useState<string>('120');
  const [voltageDropPercent, setVoltageDropPercent] = useState<string>('3');
  const [wireType, setWireType] = useState<string>('copper');
  const [conduitType, setConduitType] = useState<string>('free-air');
  const [result, setResult] = useState<any>(null);

  // Wire ampacity ratings (amperes) - simplified for common wire sizes
  const wireData = {
    copper: {
      '14': { ampacity: 15, resistance: 2.525 }, // AWG 14
      '12': { ampacity: 20, resistance: 1.588 },
      '10': { ampacity: 30, resistance: 0.999 },
      '8': { ampacity: 50, resistance: 0.628 },
      '6': { ampacity: 65, resistance: 0.395 },
      '4': { ampacity: 85, resistance: 0.249 },
      '3': { ampacity: 100, resistance: 0.197 },
      '2': { ampacity: 115, resistance: 0.156 },
      '1': { ampacity: 130, resistance: 0.124 },
      '1/0': { ampacity: 150, resistance: 0.098 },
      '2/0': { ampacity: 175, resistance: 0.078 },
      '3/0': { ampacity: 200, resistance: 0.062 },
      '4/0': { ampacity: 230, resistance: 0.049 }
    },
    aluminum: {
      '12': { ampacity: 15, resistance: 2.613 },
      '10': { ampacity: 25, resistance: 1.646 },
      '8': { ampacity: 40, resistance: 1.035 },
      '6': { ampacity: 50, resistance: 0.651 },
      '4': { ampacity: 65, resistance: 0.410 },
      '3': { ampacity: 75, resistance: 0.325 },
      '2': { ampacity: 90, resistance: 0.258 },
      '1': { ampacity: 100, resistance: 0.205 },
      '1/0': { ampacity: 120, resistance: 0.162 },
      '2/0': { ampacity: 135, resistance: 0.129 },
      '3/0': { ampacity: 155, resistance: 0.102 },
      '4/0': { ampacity: 180, resistance: 0.081 }
    }
  };

  const calculateWireSize = () => {
    const currentValue = parseFloat(current);
    const lengthValue = parseFloat(length);
    const voltageValue = parseFloat(voltage);
    const dropPercent = parseFloat(voltageDropPercent) / 100;

    if (!currentValue || !lengthValue || !voltageValue) return;

    const maxVoltageDrop = voltageValue * dropPercent;
    const material = wireData[wireType as keyof typeof wireData];

    // Find minimum wire size for ampacity
    let ampacityWire = '';
    for (const [awg, data] of Object.entries(material)) {
      if (data.ampacity >= currentValue * 1.25) { // 125% safety factor
        ampacityWire = awg;
        break;
      }
    }

    // Find minimum wire size for voltage drop
    let voltageDropWire = '';
    const resistance_factor = 2; // Round trip resistance
    for (const [awg, data] of Object.entries(material)) {
      const voltageDrop = currentValue * lengthValue * data.resistance * resistance_factor / 1000;
      if (voltageDrop <= maxVoltageDrop) {
        voltageDropWire = awg;
        break;
      }
    }

    // Get wire sizes as numbers for comparison
    const getWireNumber = (awg: string) => {
      if (awg.includes('/0')) {
        return -parseInt(awg.split('/')[0]); // Negative for 0 gauges
      }
      return parseInt(awg);
    };

    const ampacityWireNum = ampacityWire ? getWireNumber(ampacityWire) : Infinity;
    const voltageDropWireNum = voltageDropWire ? getWireNumber(voltageDropWire) : Infinity;

    // Use the larger wire (smaller number, but considering negatives for 0 gauges)
    const recommendedWireNum = Math.min(ampacityWireNum, voltageDropWireNum);
    let recommendedWire = '';
    
    for (const [awg] of Object.entries(material)) {
      if (getWireNumber(awg) === recommendedWireNum) {
        recommendedWire = awg;
        break;
      }
    }

    if (!recommendedWire) {
      recommendedWire = ampacityWire || voltageDropWire || 'Size not found';
    }

    const finalWireData = material[recommendedWire as keyof typeof material];
    const actualVoltageDrop = finalWireData ? 
      (currentValue * lengthValue * finalWireData.resistance * resistance_factor / 1000) : 0;

    setResult({
      recommendedWire,
      ampacityRequired: currentValue * 1.25,
      ampacityWire,
      voltageDropWire,
      maxVoltageDrop,
      actualVoltageDrop,
      voltageDropPercentage: (actualVoltageDrop / voltageValue) * 100,
      wireAmpacity: finalWireData?.ampacity || 0
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Wire Size Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="current">Load Current (A)</Label>
              <Input
                id="current"
                type="number"
                placeholder="Enter load current in amps"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="length">Wire Length (ft)</Label>
              <Input
                id="length"
                type="number"
                placeholder="One-way wire length in feet"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                step="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voltage">System Voltage (V)</Label>
              <Select value={voltage} onValueChange={setVoltage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  <SelectItem value="12">12V DC</SelectItem>
                  <SelectItem value="24">24V DC</SelectItem>
                  <SelectItem value="120">120V AC</SelectItem>
                  <SelectItem value="240">240V AC</SelectItem>
                  <SelectItem value="480">480V AC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="voltageDrop">Max Voltage Drop (%)</Label>
              <Select value={voltageDropPercent} onValueChange={setVoltageDropPercent}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  <SelectItem value="2">2% (Recommended)</SelectItem>
                  <SelectItem value="3">3% (Acceptable)</SelectItem>
                  <SelectItem value="5">5% (Maximum)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Wire Material</Label>
              <Select value={wireType} onValueChange={setWireType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  <SelectItem value="copper">Copper</SelectItem>
                  <SelectItem value="aluminum">Aluminum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Installation Type</Label>
              <Select value={conduitType} onValueChange={setConduitType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  <SelectItem value="free-air">Free Air</SelectItem>
                  <SelectItem value="conduit">In Conduit</SelectItem>
                  <SelectItem value="buried">Direct Buried</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={calculateWireSize}
            className="w-full"
            disabled={!current || !length}
          >
            Calculate Wire Size
          </Button>

          {result && (
            <div className="space-y-4">
              <Card className="bg-muted/30 border-border/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold">Recommended Wire Size:</h3>
                    <Badge variant="secondary" className="text-2xl p-4">
                      {result.recommendedWire} AWG {wireType.toUpperCase()}
                    </Badge>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Wire Ampacity</div>
                        <div className="text-muted-foreground">{result.wireAmpacity}A</div>
                      </div>
                      <div>
                        <div className="font-medium">Actual Voltage Drop</div>
                        <div className="text-muted-foreground">
                          {result.actualVoltageDrop.toFixed(2)}V ({result.voltageDropPercentage.toFixed(1)}%)
                        </div>
                      </div>
                    </div>

                    {result.voltageDropPercentage > parseFloat(voltageDropPercent) && (
                      <div className="flex items-center gap-2 text-orange-600 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Warning: Voltage drop exceeds recommended limit</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30 border-border/30">
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-4">Calculation Details:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Load Current:</span>
                      <span>{current}A</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Required Ampacity (125% safety):</span>
                      <span>{result.ampacityRequired.toFixed(1)}A</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wire Length (one way):</span>
                      <span>{length} ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Voltage Drop:</span>
                      <span>{result.maxVoltageDrop.toFixed(1)}V ({voltageDropPercent}%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Wire for Ampacity:</span>
                      <span>{result.ampacityWire} AWG</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Wire for Voltage Drop:</span>
                      <span>{result.voltageDropWire || 'N/A'} AWG</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Important Notes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Wire size selection considers both ampacity and voltage drop</li>
              <li>• 125% safety factor applied to ampacity calculations</li>
              <li>• Voltage drop calculated for round-trip wire resistance</li>
              <li>• Consult local electrical codes for specific requirements</li>
              <li>• This calculator is for estimation only - verify with licensed electrician</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WireSizeCalculator;