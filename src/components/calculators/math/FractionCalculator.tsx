import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function FractionCalculator() {
  const [numerator, setNumerator] = useState("");
  const [denominator, setDenominator] = useState("");
  const [decimal, setDecimal] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const simplifyFraction = (num: number, den: number): [number, number] => {
    const divisor = gcd(Math.abs(num), Math.abs(den));
    return [num / divisor, den / divisor];
  };

  const fractionToDecimal = () => {
    const num = parseFloat(numerator);
    const den = parseFloat(denominator);
    
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      const decimal = num / den;
      const [simplifiedNum, simplifiedDen] = simplifyFraction(num, den);
      
      setResult(
        `${num}/${den} = ${decimal}${decimal % 1 === 0 ? '' : ` (or ${decimal.toFixed(6)})`}\n` +
        (simplifiedNum !== num || simplifiedDen !== den ? 
          `Simplified: ${simplifiedNum}/${simplifiedDen}` : '')
      );
    }
  };

  const decimalToFraction = () => {
    const dec = parseFloat(decimal);
    
    if (!isNaN(dec)) {
      // Convert decimal to fraction
      const tolerance = 1.0E-6;
      let numerator = 1;
      let denominator = 1;
      let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
      let b = dec;
      
      do {
        const a = Math.floor(b);
        let aux = numerator;
        numerator = a * numerator + h1;
        h1 = aux;
        aux = denominator;
        denominator = a * denominator + k1;
        k1 = aux;
        b = 1 / (b - a);
      } while (Math.abs(dec - numerator / denominator) > dec * tolerance);
      
      const [simplifiedNum, simplifiedDen] = simplifyFraction(numerator, denominator);
      
      setResult(
        `${dec} = ${numerator}/${denominator}` +
        (simplifiedNum !== numerator || simplifiedDen !== denominator ? 
          `\nSimplified: ${simplifiedNum}/${simplifiedDen}` : '')
      );
    }
  };

  const clearAll = () => {
    setNumerator("");
    setDenominator("");
    setDecimal("");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Fraction to Decimal Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Convert fractions to decimals and decimals to fractions with automatic simplification.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fraction to Decimal</CardTitle>
            <CardDescription>Convert a fraction to its decimal equivalent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="numerator">Numerator</Label>
              <Input
                id="numerator"
                type="number"
                placeholder="Enter numerator"
                value={numerator}
                onChange={(e) => setNumerator(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="denominator">Denominator</Label>
              <Input
                id="denominator"
                type="number"
                placeholder="Enter denominator"
                value={denominator}
                onChange={(e) => setDenominator(e.target.value)}
              />
            </div>
            <Button onClick={fractionToDecimal} className="w-full">
              Convert to Decimal
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Decimal to Fraction</CardTitle>
            <CardDescription>Convert a decimal to its fraction equivalent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="decimal">Decimal Number</Label>
              <Input
                id="decimal"
                type="number"
                step="any"
                placeholder="Enter decimal (e.g., 0.75)"
                value={decimal}
                onChange={(e) => setDecimal(e.target.value)}
              />
            </div>
            <Button onClick={decimalToFraction} className="w-full">
              Convert to Fraction
            </Button>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <pre className="text-lg font-bold text-primary mb-4 whitespace-pre-line">
                {result}
              </pre>
              <Button variant="outline" onClick={clearAll}>
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How Fraction Conversion Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Fraction to Decimal</h3>
            <p className="text-muted-foreground">Divide the numerator by the denominator.</p>
            <p className="text-sm text-muted-foreground">Example: 3/4 = 3 ÷ 4 = 0.75</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Decimal to Fraction</h3>
            <p className="text-muted-foreground">Use continued fractions algorithm to find the exact fraction representation.</p>
            <p className="text-sm text-muted-foreground">Example: 0.75 = 3/4 (after simplification)</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Simplification</h3>
            <p className="text-muted-foreground">Find the greatest common divisor (GCD) and divide both numerator and denominator by it.</p>
            <p className="text-sm text-muted-foreground">Example: 6/8 = 3/4 (GCD = 2)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}