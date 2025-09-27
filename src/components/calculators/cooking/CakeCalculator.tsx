import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Cake, Users } from "lucide-react";

const CakeCalculator = () => {
  const [guests, setGuests] = useState<string>('');
  const [portionSize, setPortionSize] = useState<string>('standard');
  const [cakeType, setCakeType] = useState<string>('round');
  const [tiers, setTiers] = useState<string>('1');
  const [result, setResult] = useState<string>('');

  const calculateCake = () => {
    const numGuests = parseInt(guests);
    if (!numGuests || numGuests <= 0) return;

    // Serving sizes based on portion type
    const servingSize = {
      small: 1.5, // 1.5 oz per person
      standard: 2.5, // 2.5 oz per person  
      large: 4 // 4 oz per person
    };

    // Cake sizes and their serving capacity
    const cakeSizes = {
      round: {
        '6': 8,   // 6" round serves 8
        '8': 16,  // 8" round serves 16
        '10': 24, // 10" round serves 24
        '12': 36  // 12" round serves 36
      },
      square: {
        '6': 12,  // 6" square serves 12
        '8': 20,  // 8" square serves 20
        '10': 30, // 10" square serves 30
        '12': 40  // 12" square serves 40
      },
      sheet: {
        'quarter': 24,  // Quarter sheet serves 24
        'half': 48,     // Half sheet serves 48
        'full': 96      // Full sheet serves 96
      }
    };

    const portionMultiplier = servingSize[portionSize as keyof typeof servingSize] / 2.5; // normalize to standard
    const adjustedGuests = numGuests * portionMultiplier;

    let cakesNeeded = 1;
    let recommendations = [];

    if (cakeType === 'sheet') {
      if (adjustedGuests <= 24) {
        recommendations.push('1 Quarter Sheet Cake');
        cakesNeeded = 1;
      } else if (adjustedGuests <= 48) {
        recommendations.push('1 Half Sheet Cake');
        cakesNeeded = 1;
      } else if (adjustedGuests <= 96) {
        recommendations.push('1 Full Sheet Cake');
        cakesNeeded = 1;
      } else {
        const fullSheets = Math.floor(adjustedGuests / 96);
        const remaining = adjustedGuests % 96;
        recommendations.push(`${fullSheets} Full Sheet Cake${fullSheets > 1 ? 's' : ''}`);
        if (remaining > 0) {
          if (remaining <= 24) recommendations.push('1 Quarter Sheet Cake');
          else if (remaining <= 48) recommendations.push('1 Half Sheet Cake');
          else recommendations.push('1 Full Sheet Cake');
        }
        cakesNeeded = fullSheets + (remaining > 0 ? 1 : 0);
      }
    } else {
      // Round or square cakes
      const sizes = cakeSizes[cakeType as keyof typeof cakeSizes];
      
      if (adjustedGuests <= Object.values(sizes)[0]) {
        recommendations.push(`1 ${Object.keys(sizes)[0]}" ${cakeType} cake`);
        cakesNeeded = 1;
      } else if (adjustedGuests <= Object.values(sizes)[1]) {
        recommendations.push(`1 ${Object.keys(sizes)[1]}" ${cakeType} cake`);
        cakesNeeded = 1;
      } else if (adjustedGuests <= Object.values(sizes)[2]) {
        recommendations.push(`1 ${Object.keys(sizes)[2]}" ${cakeType} cake`);
        cakesNeeded = 1;
      } else if (adjustedGuests <= Object.values(sizes)[3]) {
        recommendations.push(`1 ${Object.keys(sizes)[3]}" ${cakeType} cake`);
        cakesNeeded = 1;
      } else {
        // Multiple cakes needed
        const largeCakes = Math.floor(adjustedGuests / Object.values(sizes)[3]);
        const remaining = adjustedGuests % Object.values(sizes)[3];
        
        recommendations.push(`${largeCakes} ${Object.keys(sizes)[3]}" ${cakeType} cake${largeCakes > 1 ? 's' : ''}`);
        
        if (remaining > 0) {
          const sizeEntries = Object.entries(sizes);
          for (let i = sizeEntries.length - 1; i >= 0; i--) {
            const [size, capacity] = sizeEntries[i];
            if (remaining <= capacity) {
              recommendations.push(`1 ${size}" ${cakeType} cake`);
              break;
            }
          }
        }
        
        cakesNeeded = largeCakes + (remaining > 0 ? 1 : 0);
      }
    }

    setResult(`${cakesNeeded} cake${cakesNeeded > 1 ? 's' : ''} needed: ${recommendations.join(' + ')}`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cake className="h-5 w-5 text-primary" />
            Cake Calculator
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
              <Label>Portion Size</Label>
              <Select value={portionSize} onValueChange={setPortionSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small Portions</SelectItem>
                  <SelectItem value="standard">Standard Portions</SelectItem>
                  <SelectItem value="large">Large Portions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cake Type</Label>
              <Select value={cakeType} onValueChange={setCakeType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round">Round</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="sheet">Sheet Cake</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Number of Tiers</Label>
              <Select value={tiers} onValueChange={setTiers}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={calculateCake}
            className="w-full"
            disabled={!guests}
          >
            Calculate Cake Needed
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
            <h4 className="font-medium mb-2">Portion Size Guide:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>Small:</strong> 1.5 oz per person (dessert course)</li>
              <li><strong>Standard:</strong> 2.5 oz per person (typical serving)</li>
              <li><strong>Large:</strong> 4 oz per person (main dessert)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CakeCalculator;
