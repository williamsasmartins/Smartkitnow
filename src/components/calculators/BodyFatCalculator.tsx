import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export const BodyFatCalculator = () => {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hip, setHip] = useState('');
  const [height, setHeight] = useState('');
  const [units, setUnits] = useState('metric');
  const [result, setResult] = useState<{
    bodyFat: number;
    category: string;
    categoryColor: string;
  } | null>(null);

  const calculateBodyFat = () => {
    let waistCm = parseFloat(waist);
    let neckCm = parseFloat(neck);
    let hipCm = parseFloat(hip);
    let heightCm = parseFloat(height);

    if (units === 'imperial') {
      waistCm = waistCm * 2.54;
      neckCm = neckCm * 2.54;
      hipCm = hipCm * 2.54;
      heightCm = heightCm * 2.54;
    }

    if (waistCm > 0 && neckCm > 0 && heightCm > 0 && gender) {
      let bodyFat = 0;

      // US Navy method
      if (gender === 'male') {
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
      } else {
        if (hipCm > 0) {
          bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
        } else {
          return; // Hip measurement required for females
        }
      }

      let category = '';
      let categoryColor = '';

      if (gender === 'male') {
        if (bodyFat < 6) {
          category = 'Essential Fat';
          categoryColor = 'text-red-600';
        } else if (bodyFat < 14) {
          category = 'Athletes';
          categoryColor = 'text-green-600';
        } else if (bodyFat < 18) {
          category = 'Fitness';
          categoryColor = 'text-blue-600';
        } else if (bodyFat < 25) {
          category = 'Average';
          categoryColor = 'text-yellow-600';
        } else {
          category = 'Obese';
          categoryColor = 'text-red-600';
        }
      } else {
        if (bodyFat < 14) {
          category = 'Essential Fat';
          categoryColor = 'text-red-600';
        } else if (bodyFat < 21) {
          category = 'Athletes';
          categoryColor = 'text-green-600';
        } else if (bodyFat < 25) {
          category = 'Fitness';
          categoryColor = 'text-blue-600';
        } else if (bodyFat < 32) {
          category = 'Average';
          categoryColor = 'text-yellow-600';
        } else {
          category = 'Obese';
          categoryColor = 'text-red-600';
        }
      }

      setResult({
        bodyFat: Math.round(bodyFat * 10) / 10,
        category,
        categoryColor
      });
    }
  };

  const handleReset = () => {
    setGender('');
    setAge('');
    setWaist('');
    setNeck('');
    setHip('');
    setHeight('');
    setUnits('metric');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Body Fat Calculator</CardTitle>
          <CardDescription>
            Calculate your body fat percentage using the US Navy method with body measurements.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="units">Unit System</Label>
              <Select value={units} onValueChange={setUnits}>
                <SelectTrigger>
                  <SelectValue placeholder="Select units" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (cm)</SelectItem>
                  <SelectItem value="imperial">Imperial (inches)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">
                Height ({units === 'metric' ? 'cm' : 'inches'})
              </Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder={units === 'metric' ? '175' : '69'}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waist">
                Waist ({units === 'metric' ? 'cm' : 'inches'})
              </Label>
              <Input
                id="waist"
                type="number"
                step="0.1"
                placeholder={units === 'metric' ? '85' : '33'}
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neck">
                Neck ({units === 'metric' ? 'cm' : 'inches'})
              </Label>
              <Input
                id="neck"
                type="number"
                step="0.1"
                placeholder={units === 'metric' ? '38' : '15'}
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
              />
            </div>
            {gender === 'female' && (
              <div className="space-y-2">
                <Label htmlFor="hip">
                  Hip ({units === 'metric' ? 'cm' : 'inches'})
                </Label>
                <Input
                  id="hip"
                  type="number"
                  step="0.1"
                  placeholder={units === 'metric' ? '95' : '37'}
                  value={hip}
                  onChange={(e) => setHip(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button onClick={calculateBodyFat} className="flex-1">
              Calculate Body Fat
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {result && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {result.bodyFat}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Body Fat Percentage</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${result.categoryColor}`}>
                        {result.category}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Category</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Body Fat Categories ({gender}):</h4>
                {gender === 'male' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="text-red-600">• Essential Fat: 2-5%</div>
                    <div className="text-green-600">• Athletes: 6-13%</div>
                    <div className="text-blue-600">• Fitness: 14-17%</div>
                    <div className="text-yellow-600">• Average: 18-24%</div>
                    <div className="text-red-600">• Obese: 25%+</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="text-red-600">• Essential Fat: 10-13%</div>
                    <div className="text-green-600">• Athletes: 14-20%</div>
                    <div className="text-blue-600">• Fitness: 21-24%</div>
                    <div className="text-yellow-600">• Average: 25-31%</div>
                    <div className="text-red-600">• Obese: 32%+</div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
