import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function AreaCalculator() {
  const [shape, setShape] = useState("");
  const [dimensions, setDimensions] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<string | null>(null);

  const shapes = {
    rectangle: { name: "Rectangle", fields: ["length", "width"] },
    square: { name: "Square", fields: ["side"] },
    circle: { name: "Circle", fields: ["radius"] },
    triangle: { name: "Triangle", fields: ["base", "height"] },
    trapezoid: { name: "Trapezoid", fields: ["base1", "base2", "height"] },
    parallelogram: { name: "Parallelogram", fields: ["base", "height"] },
    ellipse: { name: "Ellipse", fields: ["majorAxis", "minorAxis"] }
  };

  const updateDimension = (field: string, value: string) => {
    setDimensions(prev => ({ ...prev, [field]: value }));
  };

  const calculateArea = () => {
    if (!shape) return;

    const shapeData = shapes[shape as keyof typeof shapes];
    const values: { [key: string]: number } = {};
    
    // Convert all dimensions to numbers
    for (const field of shapeData.fields) {
      const value = parseFloat(dimensions[field] || "0");
      if (isNaN(value) || value <= 0) {
        setResult("Please enter valid positive numbers for all dimensions.");
        return;
      }
      values[field] = value;
    }

    let area = 0;
    let formula = "";

    switch (shape) {
      case "rectangle":
        area = values.length * values.width;
        formula = "Area = length × width";
        break;
      case "square":
        area = values.side * values.side;
        formula = "Area = side²";
        break;
      case "circle":
        area = Math.PI * values.radius * values.radius;
        formula = "Area = π × radius²";
        break;
      case "triangle":
        area = 0.5 * values.base * values.height;
        formula = "Area = ½ × base × height";
        break;
      case "trapezoid":
        area = 0.5 * (values.base1 + values.base2) * values.height;
        formula = "Area = ½ × (base₁ + base₂) × height";
        break;
      case "parallelogram":
        area = values.base * values.height;
        formula = "Area = base × height";
        break;
      case "ellipse":
        area = Math.PI * (values.majorAxis / 2) * (values.minorAxis / 2);
        formula = "Area = π × (major axis / 2) × (minor axis / 2)";
        break;
    }

    setResult(`${formula}\nArea = ${area.toFixed(4)} square units`);
  };

  const clearAll = () => {
    setShape("");
    setDimensions({});
    setResult(null);
  };

  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      length: "Length",
      width: "Width",
      side: "Side Length",
      radius: "Radius",
      base: "Base",
      height: "Height",
      base1: "Base 1",
      base2: "Base 2",
      majorAxis: "Major Axis",
      minorAxis: "Minor Axis"
    };
    return labels[field] || field;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Area Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate the area of various geometric shapes including rectangles, circles, triangles, and more.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Area</CardTitle>
          <CardDescription>
            Select a shape and enter its dimensions to calculate the area
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="shape">Shape</Label>
            <Select value={shape} onValueChange={setShape}>
              <SelectTrigger id="shape" aria-label="Shape">
                <SelectValue placeholder="Select a shape" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(shapes).map(([key, shape]) => (
                  <SelectItem key={key} value={key}>
                    {shape.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {shape && (
            <div className="space-y-4">
              <h3 className="font-semibold">Dimensions</h3>
              {shapes[shape as keyof typeof shapes].fields.map((field) => (
                <div key={field}>
                  <Label htmlFor={field}>{getFieldLabel(field)}</Label>
                  <Input
                    id={field}
                    type="number"
                    placeholder={`Enter ${getFieldLabel(field).toLowerCase()}`}
                    value={dimensions[field] || ""}
                    onChange={(e) => updateDimension(field, e.target.value)}
                    min="0"
                    step="any"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={calculateArea} disabled={!shape}>
              Calculate Area
            </Button>
            <Button onClick={clearAll} variant="secondary">
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

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
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Area Formulas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold">Rectangle</h4>
              <p className="text-sm text-muted-foreground">Area = length × width</p>
            </div>
            <div>
              <h4 className="font-semibold">Square</h4>
              <p className="text-sm text-muted-foreground">Area = side²</p>
            </div>
            <div>
              <h4 className="font-semibold">Circle</h4>
              <p className="text-sm text-muted-foreground">Area = π × radius²</p>
            </div>
            <div>
              <h4 className="font-semibold">Triangle</h4>
              <p className="text-sm text-muted-foreground">Area = ½ × base × height</p>
            </div>
            <div>
              <h4 className="font-semibold">Trapezoid</h4>
              <p className="text-sm text-muted-foreground">Area = ½ × (base₁ + base₂) × height</p>
            </div>
            <div>
              <h4 className="font-semibold">Parallelogram</h4>
              <p className="text-sm text-muted-foreground">Area = base × height</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}