import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Info, Share2, Copy, Mail, Facebook, Twitter, Linkedin, Send } from "lucide-react";
import { useForm, ValidationError } from '@formspree/react';

export const TDEECalculator = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [units, setUnits] = useState('metric');
  const [result, setResult] = useState<{
    bmr: number;
    tdee: number;
    weightGoals: { goal: string; calories: number; description: string }[];
  } | null>(null);

  const [formState, handleFormSubmit] = useForm("xanpypnb");

  const handleNativeShare = async () => {
    try {
      const currentUrl = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: "TDEE Calculator",
          text: "Check out this TDEE Calculator!",
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

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // replaced by Formspree useForm hook (handleFormSubmit)
  };
  const activityLevels = [
    { value: '1.2', name: 'Sedentary', description: 'Little to no exercise' },
    { value: '1.375', name: 'Light', description: 'Light exercise 1-3 days/week' },
    { value: '1.55', name: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
    { value: '1.725', name: 'High', description: 'Heavy exercise 6-7 days/week' },
    { value: '1.9', name: 'Very High', description: 'Very heavy exercise, physical job' }
  ];

  const calculateTDEE = () => {
    const ageValue = parseInt(age);
    let heightCm = parseFloat(height);
    let weightKg = parseFloat(weight);
    const activity = parseFloat(activityLevel);

    if (units === 'imperial') {
      // Convert feet to cm and pounds to kg
      heightCm = heightCm * 30.48; // feet to cm
      weightKg = weightKg * 0.453592; // pounds to kg
    }

    if (ageValue > 0 && heightCm > 0 && weightKg > 0 && gender && activity) {
      let bmr = 0;
      
      // Mifflin-St Jeor Equation
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageValue);
      } else {
        bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageValue);
      }

      const tdee = bmr * activity;

      const weightGoals = [
        { 
          goal: 'Lose 2 lbs/week', 
          calories: Math.round(tdee - 1000), 
          description: 'Aggressive weight loss' 
        },
        { 
          goal: 'Lose 1 lb/week', 
          calories: Math.round(tdee - 500), 
          description: 'Moderate weight loss' 
        },
        { 
          goal: 'Lose 0.5 lbs/week', 
          calories: Math.round(tdee - 250), 
          description: 'Slow weight loss' 
        },
        { 
          goal: 'Maintain weight', 
          calories: Math.round(tdee), 
          description: 'Weight maintenance' 
        },
        { 
          goal: 'Gain 0.5 lbs/week', 
          calories: Math.round(tdee + 250), 
          description: 'Slow weight gain' 
        },
        { 
          goal: 'Gain 1 lb/week', 
          calories: Math.round(tdee + 500), 
          description: 'Moderate weight gain' 
        }
      ];

      setResult({
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        weightGoals
      });
    }
  };

  const handleReset = () => {
    setAge('');
    setGender('');
    setHeight('');
    setWeight('');
    setActivityLevel('');
    setUnits('metric');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>TDEE Calculator</CardTitle>
          <CardDescription>
            Calculate your Total Daily Energy Expenditure (TDEE) - the total calories you burn in a day.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="units">Unit System</Label>
            <Select value={units} onValueChange={setUnits}>
              <SelectTrigger id="units" aria-label="Unit system">
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

          <div className="space-y-2">
            <Label htmlFor="activityLevel">Activity Level</Label>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger id="activityLevel" aria-label="Activity level">
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                {activityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.name} - {level.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button variant="calculate" onClick={calculateTDEE} className="flex-1">
              Calculate TDEE
            </Button>
            <Button variant="reset" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {result && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.bmr} cal/day
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">BMR (Basal Metabolic Rate)</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {result.tdee} cal/day
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">TDEE (Total Daily Energy)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Calorie Goals by Weight Target:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.weightGoals.map((goal, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {goal.calories} cal/day
                          </div>
                          <p className="text-sm font-medium">{goal.goal}</p>
                          <p className="text-xs text-muted-foreground">{goal.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" /> How to Use This Calculator</CardTitle>
          <CardDescription>Learn how TDEE works and how to interpret the results.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>What is TDEE?</AccordionTrigger>
              <AccordionContent>
                TDEE (Total Daily Energy Expenditure) estimates the total calories you burn per day based on your basal metabolic rate (BMR) and your activity level.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How are activity levels used?</AccordionTrigger>
              <AccordionContent>
                We multiply your BMR by an activity factor (e.g., 1.2 for sedentary up to 1.9 for very high activity) to estimate your daily energy needs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What’s the difference between BMR and TDEE?</AccordionTrigger>
              <AccordionContent>
                BMR is the energy your body needs at rest. TDEE includes BMR plus calories burned through daily activities and exercise.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Share2 className="h-5 w-5" /> Share This Calculator</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleNativeShare} className="gap-2"><Share2 className="h-4 w-4" /> Share</Button>
          <Button variant="outline" asChild className="gap-2">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"><Facebook className="h-4 w-4" /> Facebook</a>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check out this TDEE Calculator!`} target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /> Twitter/X</a>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /> LinkedIn</a>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out this TDEE Calculator! ' + window.location.href)}`} target="_blank" rel="noopener noreferrer"><Share2 className="h-4 w-4" /> WhatsApp</a>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <a href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Check out this TDEE Calculator!')}`} target="_blank" rel="noopener noreferrer"><Send className="h-4 w-4" /> Telegram</a>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <a href={`mailto:?subject=${encodeURIComponent('TDEE Calculator')}&body=${encodeURIComponent('Check out this TDEE Calculator! ' + window.location.href)}`} target="_blank" rel="noopener noreferrer"><Mail className="h-4 w-4" /> Email</a>
          </Button>
          <Button variant="outline" onClick={handleCopyLink} className="gap-2"><Copy className="h-4 w-4" /> Copy Link</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
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
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="Your email (optional)" />
                <ValidationError prefix="Email" field="email" errors={formState.errors} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="message">Suggestions</Label>
                <Textarea id="message" name="message" placeholder="Tell us what we can improve" />
                <ValidationError prefix="Message" field="message" errors={formState.errors} />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" disabled={formState.submitting}>Submit</Button>
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
          This calculator provides educational estimates and does not replace professional medical advice. Consult a healthcare provider for personalized guidance.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Glossary & Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p><strong>BMR:</strong> Basal Metabolic Rate — calories needed at rest.</p>
          <p><strong>TDEE:</strong> Total Daily Energy Expenditure — BMR multiplied by activity factor.</p>
          <p><strong>Activity Multipliers:</strong> Sedentary (1.2), Light (1.375), Moderate (1.55), High (1.725), Very High (1.9).</p>
        </CardContent>
      </Card>
    </div>
  );
};