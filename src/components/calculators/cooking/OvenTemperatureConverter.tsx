import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Thermometer, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const OvenTemperatureConverter = () => {
  const [fahrenheit, setFahrenheit] = useState<string>('');
  const [celsius, setCelsius] = useState<string>('');
  const [resultF, setResultF] = useState<string>('');
  const [resultC, setResultC] = useState<string>('');

  const convertFahrenheitToCelsius = () => {
    const f = parseFloat(fahrenheit);
    if (!isNaN(f)) {
      const c = (f - 32) * 5 / 9;
      setResultF(`${f} °F = ${c.toFixed(2)} °C`);
    }
  };

  const convertCelsiusToFahrenheit = () => {
    const c = parseFloat(celsius);
    if (!isNaN(c)) {
      const f = (c * 9 / 5) + 32;
      setResultC(`${c} °C = ${f.toFixed(2)} °F`);
    }
  };

  // Common oven temperatures
  const commonTemperatures = [
    { fahrenheit: 200, celsius: 93, description: "Very Low" },
    { fahrenheit: 225, celsius: 107, description: "Very Low" },
    { fahrenheit: 250, celsius: 121, description: "Low" },
    { fahrenheit: 275, celsius: 135, description: "Low" },
    { fahrenheit: 300, celsius: 149, description: "Low" },
    { fahrenheit: 325, celsius: 163, description: "Moderate" },
    { fahrenheit: 350, celsius: 177, description: "Moderate" },
    { fahrenheit: 375, celsius: 191, description: "Moderately High" },
    { fahrenheit: 400, celsius: 204, description: "High" },
    { fahrenheit: 425, celsius: 218, description: "High" },
    { fahrenheit: 450, celsius: 232, description: "Very High" },
    { fahrenheit: 475, celsius: 246, description: "Very High" },
    { fahrenheit: 500, celsius: 260, description: "Extremely High" }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            Oven Temperature Conversion Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="f-to-c" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="f-to-c">Fahrenheit to Celsius</TabsTrigger>
              <TabsTrigger value="c-to-f">Celsius to Fahrenheit</TabsTrigger>
            </TabsList>

            <TabsContent value="f-to-c" className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="fahrenheit">Degrees Fahrenheit</Label>
                  <Input
                    id="fahrenheit"
                    type="number"
                    placeholder="Enter temperature in °F"
                    value={fahrenheit}
                    onChange={(e) => setFahrenheit(e.target.value)}
                  />
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground mb-2" />
                <Button 
                  onClick={convertFahrenheitToCelsius}
                  disabled={!fahrenheit}
                >
                  Convert to °C
                </Button>
              </div>

              {resultF && (
                <Card className="bg-muted/30 border-border/30">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Badge variant="secondary" className="text-lg p-3">
                        {resultF}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="c-to-f" className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="celsius">Degrees Celsius</Label>
                  <Input
                    id="celsius"
                    type="number"
                    placeholder="Enter temperature in °C"
                    value={celsius}
                    onChange={(e) => setCelsius(e.target.value)}
                  />
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground mb-2" />
                <Button 
                  onClick={convertCelsiusToFahrenheit}
                  disabled={!celsius}
                >
                  Convert to °F
                </Button>
              </div>

              {resultC && (
                <Card className="bg-muted/30 border-border/30">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Badge variant="secondary" className="text-lg p-3">
                        {resultC}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>Oven Temperature Conversion Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fahrenheit (°F)</TableHead>
                  <TableHead>Celsius (°C)</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commonTemperatures.map((temp, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{temp.fahrenheit}°F</TableCell>
                    <TableCell>{temp.celsius}°C</TableCell>
                    <TableCell>{temp.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 bg-muted/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Conversion Formulas:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>°C to °F:</strong> (°C × 9/5) + 32</li>
              <li><strong>°F to °C:</strong> (°F - 32) × 5/9</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OvenTemperatureConverter;