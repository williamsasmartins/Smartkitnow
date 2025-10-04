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
import { Info, Share2, Copy, Mail, Facebook, Twitter, Linkedin, Send, ExternalLink } from "lucide-react";
import { useForm, ValidationError } from '@formspree/react';

export const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [units, setUnits] = useState('metric');
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    categoryColor: string;
  } | null>(null);

  const [formState, handleFormSubmit] = useForm("xanpypnb");

  const handleNativeShare = async () => {
    try {
      const currentUrl = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: "BMI Calculator",
          text: "Check out this BMI Calculator!",
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
    // replaced by Formspree useForm hook
  };

  const calculateBMI = () => {
    let heightM = parseFloat(height);
    let weightKg = parseFloat(weight);

    if (units === 'imperial') {
      // Convert feet/inches to meters and pounds to kg
      const feet = Math.floor(heightM);
      const inches = (heightM - feet) * 12;
      heightM = (feet * 12 + inches) * 0.0254;
      weightKg = weightKg * 0.453592;
    } else {
      heightM = heightM / 100; // Convert cm to meters
    }

    if (heightM > 0 && weightKg > 0) {
      const bmi = weightKg / (heightM * heightM);
      let category = '';
      let categoryColor = '';

      if (bmi < 18.5) {
        category = 'Underweight';
        categoryColor = 'text-blue-600';
      } else if (bmi < 25) {
        category = 'Normal weight';
        categoryColor = 'text-green-600';
      } else if (bmi < 30) {
        category = 'Overweight';
        categoryColor = 'text-orange-600';
      } else {
        category = 'Obese';
        categoryColor = 'text-red-600';
      }

      setResult({
        bmi: Math.round(bmi * 10) / 10,
        category,
        categoryColor
      });
    }
  };

  const handleReset = () => {
    setHeight('');
    setWeight('');
    setUnits('metric');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
          <CardDescription>
            Calculate your Body Mass Index (BMI) to assess your weight status.
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
            <Button variant="calculate" onClick={calculateBMI} className="flex-1">
              Calculate BMI
            </Button>
            <Button variant="reset" onClick={handleReset}>
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
                        {result.bmi}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">BMI Score</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${result.categoryColor}`}>
                        {result.category}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Weight Category</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">BMI Categories:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="text-blue-600">• Underweight: &lt; 18.5</div>
                  <div className="text-green-600">• Normal: 18.5 - 24.9</div>
                  <div className="text-orange-600">• Overweight: 25 - 29.9</div>
                  <div className="text-red-600">• Obese: ≥ 30</div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Seções ricas padronizadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-blue-600" /> How to Use the Calculator</CardTitle>
          <CardDescription>Quick guide to use the BMI calculator</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: 1, title: "Enter Height & Weight", desc: "Fill in your height and weight in your preferred units." },
              { step: 2, title: "Choose Units", desc: "Select Metric (cm, kg) or Imperial (ft, lbs)." },
              { step: 3, title: "Calculate BMI", desc: "Click 'Calculate BMI' to see your score and category." }
            ].map((item) => (
              <div key={item.step} className="text-center space-y-2 p-4 bg-muted/40 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto font-semibold">
                  {item.step}
                </div>
                <div className="font-semibold">{item.title}</div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What is BMI?</CardTitle>
          <CardDescription>Understand the metric and its uses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Body Mass Index (BMI) is an estimate of nutritional status based on the relationship between weight and height. It helps categorize ranges such as underweight, normal, overweight, and obesity.
          </p>
          <div className="bg-muted/40 rounded-md p-3">
            <h4 className="font-semibold mb-2">BMI Formula</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Metric:</strong> BMI = weight(kg) / [height(m)]²</li>
              <li><strong>Imperial:</strong> BMI = 703 × weight(lbs) / [height(in)]²</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Practical Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <ul className="list-disc pl-5 space-y-1">
            <li>Person A: 70 kg and 1.75 m → BMI ≈ 22.9 (Normal)</li>
            <li>Person B: 95 kg and 1.70 m → BMI ≈ 32.9 (Obese)</li>
            <li>Person C: 150 lbs and 5'8" → BMI ≈ 22.8 (Normal)</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>Is BMI suitable for everyone?</AccordionTrigger>
              <AccordionContent>
                Not always. Athletes, pregnant individuals, and those with high muscle mass may have different interpretations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Do I need to use kg and cm?</AccordionTrigger>
              <AccordionContent>
                You can use imperial units. The calculation converts internally to maintain accuracy.
              </AccordionContent>
            </AccordionItem>
          <AccordionItem value="q3">
              <AccordionTrigger>Does BMI diagnose health?</AccordionTrigger>
              <AccordionContent>
                BMI is a general indicator. Consult a healthcare professional for comprehensive assessments.
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
          <Button variant="calculate" onClick={handleNativeShare} className="gap-2"><Share2 className="h-4 w-4" /> Share</Button>
          <Button variant="calculate" asChild className="gap-2">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"><Facebook className="h-4 w-4" /> Facebook</a>
          </Button>
          <Button variant="calculate" asChild className="gap-2">
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check out this BMI Calculator!`} target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /> Twitter/X</a>
          </Button>
          <Button variant="calculate" asChild className="gap-2">
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /> LinkedIn</a>
          </Button>
          <Button variant="calculate" asChild className="gap-2">
            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out this BMI Calculator! ' + window.location.href)}`} target="_blank" rel="noopener noreferrer"><Share2 className="h-4 w-4" /> WhatsApp</a>
          </Button>
          <Button variant="calculate" asChild className="gap-2">
            <a href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Check out this BMI Calculator!')}`} target="_blank" rel="noopener noreferrer"><Send className="h-4 w-4" /> Telegram</a>
          </Button>
          <Button variant="calculate" asChild className="gap-2">
            <a href={`mailto:?subject=${encodeURIComponent('BMI Calculator')}&body=${encodeURIComponent('Check out this BMI Calculator! ' + window.location.href)}`} target="_blank" rel="noopener noreferrer"><Mail className="h-4 w-4" /> Email</a>
          </Button>
          <Button variant="calculate" onClick={handleCopyLink} className="gap-2"><Copy className="h-4 w-4" /> Copy Link</Button>
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
                <Label htmlFor="name">Nome (opcional)</Label>
                <Input id="name" name="name" placeholder="Seu nome (opcional)" />
                <ValidationError prefix="Name" field="name" errors={formState.errors} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="Seu email (opcional)" />
                <ValidationError prefix="Email" field="email" errors={formState.errors} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="message">Suggestions</Label>
                <Textarea id="message" name="message" placeholder="Tell us what we can improve" />
                <ValidationError prefix="Message" field="message" errors={formState.errors} />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" variant="calculate" disabled={formState.submitting}>Submit</Button>
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
            <li><a href="https://pubmed.ncbi.nlm.nih.gov/13594881/" target="_blank" rel="nofollow noreferrer" className="text-primary underline">Wishnofsky, M. (1958) — Caloric equivalents of gained or lost weight (3,500 kcal/lb ≈ 7,700 kcal/kg) <ExternalLink className="h-4 w-4 inline" /></a></li>
            <li><a href="https://pubmed.ncbi.nlm.nih.gov/21483406/" target="_blank" rel="nofollow noreferrer" className="text-primary underline">Hall, K.D. et al. (2011) — Quantifying the effect of changes in energy intake on body weight (dynamic model) <ExternalLink className="h-4 w-4 inline" /></a></li>
            <li><a href="https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner" target="_blank" rel="nofollow noreferrer" className="text-primary underline">NIDDK — Body Weight Planner (NIH dynamic weight change model) <ExternalLink className="h-4 w-4 inline" /></a></li>
            <li><a href="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/calories/art-20048065" target="_blank" rel="nofollow noreferrer" className="text-primary underline">Mayo Clinic — Calories and weight loss basics <ExternalLink className="h-4 w-4 inline" /></a></li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Fitness Tools</CardTitle>
          <CardDescription>Enhance your calorie tracking with these tools. (Affiliate links - commission may be earned at no cost to you)</CardDescription>
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
          <CardTitle>Related Tools</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <a className="text-primary underline" href="/health">See more in Health & Fitness Calculators</a>
        </CardContent>
      </Card>
    </div>
  );
};