import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, Scale } from "lucide-react";

export const TurkeyCookingTimeCalculator = () => {
  const [weight, setWeight] = useState<string>('');
  const [cookingMethod, setCookingMethod] = useState<string>('roasted');
  const [stuffed, setStuffed] = useState<string>('no');
  const [result, setResult] = useState<string>('');

  const calculateCookingTime = () => {
    const turkeyWeight = parseFloat(weight);
    if (!turkeyWeight || turkeyWeight <= 0) return;

    let timePerPound = 0;
    
    // Time per pound based on cooking method and stuffing
    const cookingTimes = {
      roasted: {
        unstuffed: turkeyWeight <= 14 ? 15 : turkeyWeight <= 18 ? 13 : 12,
        stuffed: turkeyWeight <= 14 ? 17 : turkeyWeight <= 18 ? 15 : 14
      },
      deepFried: {
        unstuffed: 3.5, // 3.5 minutes per pound for deep frying
        stuffed: 3.5 // Deep fried turkeys shouldn't be stuffed
      },
      smoked: {
        unstuffed: 30, // 30 minutes per pound for smoking
        stuffed: 35
      }
    };

    const isStuffed = stuffed === 'yes';
    const method = cookingMethod as keyof typeof cookingTimes;
    timePerPound = isStuffed ? cookingTimes[method].stuffed : cookingTimes[method].unstuffed;

    const totalMinutes = turkeyWeight * timePerPound;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    let resultText = `${weight} lb turkey: ${hours}h ${minutes}m`;
    
    if (cookingMethod === 'roasted') {
      resultText += ` at 325°F`;
    } else if (cookingMethod === 'deepFried') {
      resultText += ` at 350°F`;
    } else if (cookingMethod === 'smoked') {
      resultText += ` at 225-250°F`;
    }

    setResult(resultText);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Turkey Cooking Time Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="weight">Turkey Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter turkey weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="1"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label>Cooking Method</Label>
              <Select value={cookingMethod} onValueChange={setCookingMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roasted">Roasted (Oven)</SelectItem>
                  <SelectItem value="deepFried">Deep Fried</SelectItem>
                  <SelectItem value="smoked">Smoked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Stuffed?</Label>
              <Select value={stuffed} onValueChange={setStuffed} disabled={cookingMethod === 'deepFried'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={calculateCookingTime}
            className="w-full"
            disabled={!weight}
          >
            Calculate Cooking Time
          </Button>

          {result && (
            <Card className="bg-muted/30 border-border/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Cooking Time:</h3>
                  <Badge variant="secondary" className="text-lg p-3">
                    {result}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Important Notes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Internal temperature should reach 165°F in thickest part of thigh</li>
              <li>• Let turkey rest 20-30 minutes before carving</li>
              <li>• Deep fried turkeys should NEVER be stuffed</li>
              <li>• Times may vary based on oven accuracy and turkey shape</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const TurkeySizeCalculator = () => {
  const [guests, setGuests] = useState<string>('');
  const [leftoverPreference, setLeftoverPreference] = useState<string>('normal');
  const [result, setResult] = useState<string>('');

  const calculateTurkeySize = () => {
    const numGuests = parseInt(guests);
    if (!numGuests || numGuests <= 0) return;

    // Pounds per person based on leftover preference
    const poundsPerPerson = {
      minimal: 0.75,  // Minimal leftovers
      normal: 1.0,    // Some leftovers
      generous: 1.25  // Plenty of leftovers
    };

    const multiplier = poundsPerPerson[leftoverPreference as keyof typeof poundsPerPerson];
    const totalWeight = numGuests * multiplier;
    
    // Round up to nearest 0.5 lb
    const roundedWeight = Math.ceil(totalWeight * 2) / 2;
    
    setResult(`${roundedWeight} lb turkey recommended for ${guests} guests`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Turkey Size Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Number of Guests
              </Label>
              <Input
                id="guests"
                type="number"
                placeholder="Enter number of guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Leftover Preference</Label>
              <Select value={leftoverPreference} onValueChange={setLeftoverPreference}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal Leftovers</SelectItem>
                  <SelectItem value="normal">Normal Leftovers</SelectItem>
                  <SelectItem value="generous">Generous Leftovers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={calculateTurkeySize}
            className="w-full"
            disabled={!guests}
          >
            Calculate Turkey Size
          </Button>

          {result && (
            <Card className="bg-muted/30 border-border/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Recommended Size:</h3>
                  <Badge variant="secondary" className="text-lg p-3">
                    {result}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Serving Guide:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>Minimal:</strong> 0.75 lb per person (just enough)</li>
              <li><strong>Normal:</strong> 1 lb per person (some leftovers)</li>
              <li><strong>Generous:</strong> 1.25 lb per person (plenty of leftovers)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const TurkeyThawingTimeCalculator = () => {
  const [weight, setWeight] = useState<string>('');
  const [thawingMethod, setThawingMethod] = useState<string>('refrigerator');
  const [result, setResult] = useState<string>('');

  const calculateThawingTime = () => {
    const turkeyWeight = parseFloat(weight);
    if (!turkeyWeight || turkeyWeight <= 0) return;

    let timePerPound = 0;
    let unit = '';
    let temperature = '';

    switch (thawingMethod) {
      case 'refrigerator':
        timePerPound = 24; // 24 hours per pound
        unit = 'hours';
        temperature = 'in refrigerator (40°F or below)';
        break;
      case 'coldWater':
        timePerPound = 0.5; // 30 minutes per pound
        unit = 'hours';
        temperature = 'in cold water (change water every 30 mins)';
        break;
      case 'microwave':
        timePerPound = 5; // 5 minutes per pound
        unit = 'minutes';
        temperature = 'in microwave (defrost setting)';
        break;
    }

    const totalTime = turkeyWeight * timePerPound;
    
    let resultText = '';
    if (unit === 'hours') {
      if (totalTime >= 24) {
        const days = Math.ceil(totalTime / 24);
        resultText = `${days} day${days > 1 ? 's' : ''} ${temperature}`;
      } else {
        resultText = `${Math.ceil(totalTime)} hours ${temperature}`;
      }
    } else {
      resultText = `${Math.ceil(totalTime)} minutes ${temperature}`;
    }

    setResult(resultText);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Turkey Thawing Time Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="weight">Turkey Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter turkey weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="1"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label>Thawing Method</Label>
              <Select value={thawingMethod} onValueChange={setThawingMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refrigerator">Refrigerator (Recommended)</SelectItem>
                  <SelectItem value="coldWater">Cold Water</SelectItem>
                  <SelectItem value="microwave">Microwave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={calculateThawingTime}
            className="w-full"
            disabled={!weight}
          >
            Calculate Thawing Time
          </Button>

          {result && (
            <Card className="bg-muted/30 border-border/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Thawing Time:</h3>
                  <Badge variant="secondary" className="text-lg p-3">
                    {result}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Safety Guidelines:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>Refrigerator:</strong> Safest method, plan ahead (24 hrs/lb)</li>
              <li><strong>Cold Water:</strong> Change water every 30 minutes (30 min/lb)</li>
              <li><strong>Microwave:</strong> Cook immediately after thawing (5 min/lb)</li>
              <li>• Never thaw at room temperature (unsafe bacteria growth)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};