"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/calculators/shared/CalculatorLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SocialMediaEngagementRate() {
  const [interactions, setInteractions] = useState("");
  const [followers, setFollowers] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const i = parseFloat(interactions);
    const f = parseFloat(followers);
    
    if (!isNaN(i) && !isNaN(f) && f > 0) {
      const rate = (i / f) * 100;
      setResult(rate);
    }
  };

  return (
    <CalculatorLayout
      title="Social Media Engagement Rate Calculator"
      description="Calculate the engagement rate of your social media posts or profiles."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="interactions">Total Interactions</Label>
            <p className="text-xs text-muted-foreground">Likes, comments, shares, saves</p>
            <Input
              id="interactions"
              type="number"
              placeholder="e.g., 500"
              value={interactions}
              onChange={(e) => setInteractions(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="followers">Total Followers or Impressions</Label>
            <p className="text-xs text-muted-foreground">Reach or follower count</p>
            <Input
              id="followers"
              type="number"
              placeholder="e.g., 10000"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Calculate Engagement Rate
        </Button>

        {result !== null && (
          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Engagement Rate</div>
                <div className="text-4xl font-bold text-primary">
                  {result.toFixed(2)}%
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  );
}
