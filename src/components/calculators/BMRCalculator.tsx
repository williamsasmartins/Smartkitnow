import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Info, Share2, Copy, Mail, Facebook, Twitter, Linkedin, Send, ExternalLink } from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";

export const BMRCalculator = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [units, setUnits] = useState('metric');
  const [result, setResult] = useState<{
    bmr: number;
    activityLevels: { level: string; calories: number; description: string }[];
  } | null>(null);
  const [formState, handleFormSubmit] = useForm("xanpypnb");

  const calculateBMR = () => {
    const ageValue = parseInt(age);
    let heightCm = parseFloat(height);
    let weightKg = parseFloat(weight);

    if (units === 'imperial') {
      // Convert feet to cm and pounds to kg
      heightCm = heightCm * 30.48; // feet to cm
      weightKg = weightKg * 0.453592; // pounds to kg
    }

    if (ageValue > 0 && heightCm > 0 && weightKg > 0 && gender) {
      let bmr = 0;
      
      // Mifflin-St Jeor Equation
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageValue);
      } else {
        bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageValue);
      }

      const activityLevels = [
        { level: 'Sedentary', calories: Math.round(bmr * 1.2), description: 'Little to no exercise' },
        { level: 'Light', calories: Math.round(bmr * 1.375), description: 'Light exercise 1-3 days/week' },
        { level: 'Moderate', calories: Math.round(bmr * 1.55), description: 'Moderate exercise 3-5 days/week' },
        { level: 'High', calories: Math.round(bmr * 1.725), description: 'Heavy exercise 6-7 days/week' },
        { level: 'Very High', calories: Math.round(bmr * 1.9), description: 'Very heavy exercise, physical job' }
      ];

      setResult({
        bmr: Math.round(bmr),
        activityLevels
      });
    }
  };

  const handleReset = () => {
    setAge('');
    setGender('');
    setHeight('');
    setWeight('');
    setUnits('metric');
    setResult(null);
  };

  // Feedback is handled via Formspree's useForm hook (formState, handleFormSubmit)

  const handleNativeShare = async () => {
    try {
      const currentUrl = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: "BMR Calculator",
          text: "Check out this BMR Calculator!",
          url: currentUrl,
        });
      } else {
        await navigator.clipboard.writeText(currentUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  // Feedback submission handled by Formspree useForm hook (handleFormSubmit)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>BMR Calculator</CardTitle>
          <CardDescription>
            Calculate your Basal Metabolic Rate (BMR) - the number of calories your body needs at rest.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="units">Unit System</Label>
            <Select value={units} onValueChange={setUnits}>
              <SelectTrigger id="units" aria-label="Unit system" className="mt-2 w-[120px]">
                <SelectValue placeholder="Select units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (cm, kg)</SelectItem>
                <SelectItem value="imperial">Imperial (ft, lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                placeholder="30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender" aria-label="Gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">
                Height ({units === 'metric' ? 'cm' : 'ft'})
              </Label>
              <Input
                id="height"
                type="number"
                step={units === 'metric' ? '1' : '0.1'}
                placeholder={units === 'metric' ? '175' : '5.8'}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">
                Weight ({units === 'metric' ? 'kg' : 'lbs'})
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder={units === 'metric' ? '70' : '154'}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="calculate" onClick={calculateBMR} className="flex-1">
              Calculate BMR
            </Button>
            <Button variant="reset" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {result && (
            <>
              <Separator />
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {result.bmr} calories/day
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Basal Metabolic Rate</p>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h4 className="font-semibold mb-3">Daily Calorie Needs (Including Activity):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {result.activityLevels.map((level, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              {level.calories} cal/day
                            </div>
                            <p className="text-sm font-medium">{level.level}</p>
                            <p className="text-xs text-muted-foreground">{level.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Share2 className="h-5 w-5" /> Share This Calculator</CardTitle>
          <CardDescription>Quickly share or copy the link to this BMR calculator.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="calculate" onClick={handleNativeShare} className="gap-2"><Share2 className="h-4 w-4" /> Share</Button>
          <Button variant="calculate" onClick={handleCopyLink} className="gap-2"><Copy className="h-4 w-4" /> Copy Link</Button>
          <Button variant="calculate" asChild className="gap-2">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"><Facebook className="h-4 w-4" /> Facebook</a>
          </Button>
          <Button variant="calculate" asChild className="gap-2">
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Calculate your Basal Metabolic Rate with this free BMR calculator`} target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /> Twitter</a>
          </Button>
          <Button variant="calculate" asChild className="gap-2">
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /> LinkedIn</a>
          </Button>
          <Button variant="calculate" asChild className="gap-2">
            <a href={`mailto:?subject=BMR Calculator&body=Check out this BMR calculator: ${window.location.href}`}><Mail className="h-4 w-4" /> Email</a>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Use This Calculator</CardTitle>
          <CardDescription>Enter your age, gender, height, and weight. Choose metric or imperial units. Click Calculate to see your BMR and activity-based calorie needs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="faq-1">
              <AccordionTrigger>What is BMR?</AccordionTrigger>
              <AccordionContent>
                BMR (Basal Metabolic Rate) is the number of calories your body needs to maintain basic functions at rest, such as breathing and circulation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger>How is BMR calculated here?</AccordionTrigger>
              <AccordionContent>
                This tool uses the Mifflin-St Jeor equation, which is widely accepted for estimating BMR in adults.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger>How should I use BMR for diet planning?</AccordionTrigger>
              <AccordionContent>
                BMR is a starting point. Combine it with your activity level (TDEE) to understand daily energy needs. Consult a healthcare professional for personalized guidance.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-center">
          <CardTitle>Send Us Your Feedback</CardTitle>
          <CardDescription>Help us improve this calculator</CardDescription>
        </CardHeader>
        <CardContent>
          {formState.succeeded ? (
            <Alert>
              <AlertDescription>Thanks for your feedback!</AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleFormSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="fb-name">Name</Label>
                <Input id="fb-name" name="name" placeholder="Your name (optional)" />
              </div>
              <div>
                <Label htmlFor="fb-email">Email</Label>
                <Input id="fb-email" type="email" name="email" placeholder="Your email (optional)" />
                <ValidationError prefix="Email" field="email" errors={formState.errors} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="fb-suggestions">Suggestions</Label>
                <Textarea id="fb-suggestions" name="message" placeholder="Tell us what we can improve" />
                <ValidationError prefix="Message" field="message" errors={formState.errors} />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" variant="calculate" disabled={formState.submitting}>
                  {formState.submitting ? 'Sending...' : 'Submit'}
                </Button>
              </div>
            </form>
          )}
          <Alert className="mt-4">
            <AlertDescription className="text-sm text-muted-foreground">
              We do not collect sensitive data. Your feedback is used only to improve your experience.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This calculator provides educational estimates and does not replace professional medical advice.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example Scenario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ul className="list-disc pl-5 space-y-1">
            <li><a href="https://pubmed.ncbi.nlm.nih.gov/2239751/" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">Mifflin, M.D. et al. (1990) — A new predictive equation for resting energy expenditure in healthy individuals <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></li>
            <li><a href="https://pubmed.ncbi.nlm.nih.gov/15883556/" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">Frankenfield, D. et al. (2005) — Comparison of predictive equations for resting metabolic rate in healthy nonobese and obese adults <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></li>
            <li><a href="https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">NIDDK — Body Weight Planner (NIH dynamic weight change model) <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></li>
            <li><a href="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/metabolism/art-20046508" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">Mayo Clinic — Metabolism and weight loss basics <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Fitness Tools</CardTitle>
          <CardDescription>Enhance your metabolism tracking with these tools. (Affiliate links - commission may be earned at no cost to you)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fitness Trackers on Amazon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">Track your daily activity with Fitbit or Garmin devices.</p>
                <Button variant="calculate" asChild>
                  <a href="https://www.amazon.com/s?k=fitness+tracker&tag=youraffiliateid-20" target="_blank" rel="nofollow noreferrer">
                    Shop Now <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">MyFitnessPal Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">Log meals and track calories with advanced features.</p>
                <Button variant="calculate" asChild>
                  <a href="https://www.myfitnesspal.com/premium?affiliate=yourid" target="_blank" rel="nofollow noreferrer">
                    Get Premium <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">The Smoothie Diet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">21-day smoothie program for calorie deficit and weight loss with delicious recipes.</p>
                <Button variant="calculate" asChild>
                  <a href="https://45633oyw4b2o6taioi0hr3r7uc.hop.clickbank.net" target="_blank" rel="nofollow noreferrer">
                    Get Smoothie Diet <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Get AQUA Sculpt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">Program for sculpted body with calorie-burning workouts and nutrition plans.</p>
                <Button variant="calculate" asChild>
                  <a href="https://getaquasculptnow.net/extraBottle/?hop=zzzzz&hopId=6086a95d-69cf-4c81-9390-1c0a5e9ebe8d" target="_blank" rel="nofollow noreferrer">
                    Get AQUA Sculpt <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Glossary & Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p><strong>BMR:</strong> Basal Metabolic Rate — calories needed at rest.</p>
          <p><strong>TDEE:</strong> Total Daily Energy Expenditure — BMR multiplied by activity factor.</p>
          <p><strong>Activity Levels:</strong> Sedentary, Light, Moderate, High, Very High as shown above.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BMRCalculator;