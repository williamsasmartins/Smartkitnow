import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Common atomic masses
const ATOMIC_MASSES: { [key: string]: number } = {
  H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.811, C: 12.011, N: 14.007, O: 15.999,
  F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.086, P: 30.974, S: 32.065,
  Cl: 35.453, Ar: 39.948, K: 39.098, Ca: 40.078, Fe: 55.845, Cu: 63.546, Zn: 65.38, Br: 79.904,
  Ag: 107.868, I: 126.904, Au: 196.967, Hg: 200.59, Pb: 207.2
};

export function MolarMassCalculator() {
  const [formula, setFormula] = useState("");
  const [result, setResult] = useState<{
    molarMass: number;
    elementBreakdown: { element: string; count: number; mass: number }[];
  } | null>(null);

  const parseFormula = (formula: string) => {
    // Simple formula parser for basic compounds
    const elements: { [key: string]: number } = {};
    const regex = /([A-Z][a-z]?)(\d*)/g;
    let match;

    while ((match = regex.exec(formula)) !== null) {
      const element = match[1];
      const count = match[2] ? parseInt(match[2]) : 1;
      elements[element] = (elements[element] || 0) + count;
    }

    return elements;
  };

  const calculateMolarMass = () => {
    if (!formula.trim()) return;

    try {
      const elements = parseFormula(formula.replace(/\s/g, ''));
      let totalMass = 0;
      const breakdown: { element: string; count: number; mass: number }[] = [];

      for (const [element, count] of Object.entries(elements)) {
        if (ATOMIC_MASSES[element]) {
          const elementMass = ATOMIC_MASSES[element] * count;
          totalMass += elementMass;
          breakdown.push({
            element,
            count,
            mass: Number(elementMass.toFixed(3))
          });
        } else {
          alert(`Unknown element: ${element}`);
          return;
        }
      }

      setResult({
        molarMass: Number(totalMass.toFixed(3)),
        elementBreakdown: breakdown
      });
    } catch (error) {
      alert("Invalid formula format");
    }
  };

  const clearAll = () => {
    setFormula("");
    setResult(null);
  };

  const commonCompounds = [
    { name: "Water", formula: "H2O" },
    { name: "Carbon Dioxide", formula: "CO2" },
    { name: "Methane", formula: "CH4" },
    { name: "Ammonia", formula: "NH3" },
    { name: "Glucose", formula: "C6H12O6" },
    { name: "Sodium Chloride", formula: "NaCl" },
    { name: "Sulfuric Acid", formula: "H2SO4" },
    { name: "Calcium Carbonate", formula: "CaCO3" }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Molar Mass Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate the molar mass of chemical compounds by entering their molecular formula.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Molar Mass</CardTitle>
          <CardDescription>
            Enter a chemical formula (e.g., H2O, C6H12O6, CaCO3) to calculate its molar mass
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="formula">Chemical Formula</Label>
            <Input
              id="formula"
              type="text"
              placeholder="Enter formula (e.g., H2O, C6H12O6)"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="text-lg font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use element symbols and numbers (H2O, not h2o). No spaces or parentheses.
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateMolarMass}>
              Calculate Molar Mass
            </Button>
            <Button onClick={clearAll} variant="secondary">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {result.molarMass} g/mol
                </div>
                <p className="text-muted-foreground">Molar Mass of {formula}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Element Breakdown</h3>
                <div className="grid gap-3">
                  {result.elementBreakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <span className="font-mono text-lg">{item.element}</span>
                        {item.count > 1 && <sub>{item.count}</sub>}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{item.mass} g/mol</div>
                        <div className="text-sm text-muted-foreground">
                          {ATOMIC_MASSES[item.element]} × {item.count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Common Compounds</CardTitle>
          <CardDescription>Click any compound to calculate its molar mass</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {commonCompounds.map((compound, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => {
                  setFormula(compound.formula);
                  const elements = parseFormula(compound.formula);
                  let totalMass = 0;
                  const breakdown: { element: string; count: number; mass: number }[] = [];

                  for (const [element, count] of Object.entries(elements)) {
                    const elementMass = ATOMIC_MASSES[element] * count;
                    totalMass += elementMass;
                    breakdown.push({
                      element,
                      count,
                      mass: Number(elementMass.toFixed(3))
                    });
                  }

                  setResult({
                    molarMass: Number(totalMass.toFixed(3)),
                    elementBreakdown: breakdown
                  });
                }}
                className="h-auto p-3 flex flex-col items-start"
              >
                <div className="font-semibold">{compound.name}</div>
                <div className="text-sm text-muted-foreground font-mono">{compound.formula}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Formula Format</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use proper element symbols (C, H, O, not c, h, o)</li>
              <li>• Write numbers after elements (H2O, not H₂O)</li>
              <li>• No spaces, parentheses, or special characters</li>
              <li>• Examples: H2O, C6H12O6, CaCO3, H2SO4</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">What is Molar Mass?</h3>
            <p className="text-sm text-muted-foreground">
              Molar mass is the mass of one mole of a substance, expressed in grams per mole (g/mol). 
              It equals the sum of atomic masses of all atoms in the molecular formula.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
