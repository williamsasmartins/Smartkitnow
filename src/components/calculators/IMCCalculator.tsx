import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, AlertCircle, CheckCircle, Info, ExternalLink, Facebook, Twitter, Share2, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import AdSlot from "@/components/ads/AdSlot";


type IMCProps = Record<string, never>;

const IMCCalculator: React.FC<IMCProps> = () => {
  const navigate = useNavigate();
  const [weight, setWeight] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<string>("");
  const [result, setResult] = useState<{ imc: number; category: string; message: string } | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState({ name: "", email: "", suggestions: "" });

  const calculateIMC = () => {
    setLoading(true);
    setError("");
    setResult(null);

    if (!weight || Number(weight) <= 0) {
      setError("Please enter a valid weight (greater than 0).");
      setLoading(false);
      return;
    }

    if (!height || Number(height) <= 0) {
      setError("Please enter a valid height (greater than 0).");
      setLoading(false);
      return;
    }

    if (!age || Number(age) <= 0) {
      setError("Please enter a valid age (greater than 0).");
      setLoading(false);
      return;
    }

    if (!gender) {
      setError("Please select your gender.");
      setLoading(false);
      return;
    }

    try {
      const heightInMeters = Number(height) / 100;
      const imcValue = Number(weight) / (heightInMeters * heightInMeters);
      
      let category = "";
      if (imcValue < 18.5) category = "Underweight";
      else if (imcValue < 25) category = "Normal weight";
      else if (imcValue < 30) category = "Overweight";
      else category = "Obese";

      const message = `Your BMI is ${imcValue.toFixed(2)}, which falls into the ${category} category. Remember, BMI is a screening tool and doesn't account for muscle mass or body composition.`;

      setResult({
        imc: imcValue,
        category: category,
        message: message
      });
    } catch (err) {
      setError("Error calculating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetCalculator = () => {
    setWeight("");
    setHeight("");
    setAge("");
    setGender("");
    setResult(null);
    setError("");
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", feedback.name || "Anônimo");
    formData.append("email", feedback.email || "No email");
    formData.append("suggestions", feedback.suggestions);

    try {
      const response = await fetch('https://formspree.io/f/xanpypnb', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        alert("Thank you for your feedback! It has been sent successfully.");
        setFeedback({ name: "", email: "", suggestions: "" });
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      alert("Failed to send feedback. Please try again later.");
      console.error("Formspree error:", error);
    }
  };

  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-white dark:text-white text-gray-900 p-4">
      
      <div className="max-w-3xl mx-auto mb-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="dark:text-white text-gray-900 dark:border-gray-600 border-gray-300 dark:hover:bg-gray-700 hover:bg-gray-100">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>
      <div className="max-w-3xl mx-auto mt-10 sm:mt-12 lg:mt-16">
        <AdSlot
          variant="banner"
          label="Ad - Top Center (Google AdSense)"
          lazy
          adClient={import.meta.env.VITE_ADSENSE_CLIENT}
          adSlot={import.meta.env.VITE_ADSENSE_SLOT_TOP_CENTER}
        />
      </div>
      <Card className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200">
        <CardHeader className="flex flex-row items-center space-x-2">
          <Calculator className="h-6 w-6 dark:text-blue-400 text-blue-600" />
          <div>
            <CardTitle className="text-2xl dark:text-white text-gray-900">Body Mass Index (BMI) Calculator</CardTitle>
            <CardDescription className="dark:text-gray-400 text-gray-600">
              Calculate your BMI to understand your body composition and health risks
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {error && (
            <Alert variant="destructive" className="dark:border-red-800 border-red-200 dark:bg-red-900/50 bg-red-100">
              <AlertCircle className="h-4 w-4 dark:text-red-400 text-red-600" />
              <AlertDescription className="dark:text-gray-200 text-gray-800">{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-medium dark:text-gray-300 text-gray-700">
                Weight (kg)
              </label>
              <Input
                id="weight"
                type="number"
                placeholder="Ex: 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
                min="0"
                step="0.1"
                className="w-full dark:bg-gray-700 bg-white dark:border-gray-600 border-gray-300 dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-medium dark:text-gray-300 text-gray-700">
                Height (cm)
              </label>
              <Input
                id="height"
                type="number"
                placeholder="Ex: 170"
                value={height}
                onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))}
                min="0"
                step="1"
                className="w-full dark:bg-gray-700 bg-white dark:border-gray-600 border-gray-300 dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="age" className="text-sm font-medium dark:text-gray-300 text-gray-700">
                Age (years)
              </label>
              <Input
                id="age"
                type="number"
                placeholder="Ex: 30"
                value={age}
                onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                min="0"
                step="1"
                className="w-full dark:bg-gray-700 bg-white dark:border-gray-600 border-gray-300 dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gender" className="text-sm font-medium dark:text-gray-300 text-gray-700">
                Gender
              </label>
              <div className="w-full">
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender" aria-label="Gender" className="w-full dark:bg-gray-700 bg-white dark:border-gray-600 border-gray-300 dark:text-white text-gray-900">
                    <SelectValue placeholder="Select your gender..." />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 bg-white dark:border-gray-600 border-gray-300 dark:text-white text-gray-900">
                    <SelectItem value="male" className="dark:hover:bg-gray-700 hover:bg-gray-100">Male</SelectItem>
                    <SelectItem value="female" className="dark:hover:bg-gray-700 hover:bg-gray-100">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={calculateIMC}
              disabled={!weight || !height || !age || !gender || loading}
              className="flex-1 dark:bg-blue-600 bg-blue-500 dark:text-white text-white dark:hover:bg-blue-700 hover:bg-blue-600"
            >
              {loading ? <>Calculating...</> : (<><Calculator className="h-4 w-4 mr-2 dark:text-blue-400 text-blue-600" />Calculate</>)}
            </Button>
            {(weight || height || age || gender) && (
              <Button variant="outline" onClick={resetCalculator} className="flex-0 dark:text-white text-gray-900 dark:border-gray-600 border-gray-300 dark:hover:bg-gray-700 hover:bg-gray-100">
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {result && (
        <Card className="max-w-3xl mx-auto dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200">
          <CardHeader className="flex flex-row items-center space-x-2">
            <CheckCircle className="h-5 w-5 dark:text-green-500 text-green-700" />
            <CardTitle className="text-xl dark:text-white text-gray-900">BMI Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-2xl font-bold dark:text-blue-400 text-blue-600">
                <span>{result.imc.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-sm dark:text-gray-300 text-gray-700 leading-relaxed">{result.message}</p>
            <Alert className="dark:border-green-800 border-green-200 dark:bg-green-900/50 bg-green-100">
              <Info className="h-4 w-4 dark:text-green-400 text-green-700" />
              <AlertDescription className="dark:text-gray-200 text-gray-800">
                <strong>💡 Tip:</strong> BMI categories: Underweight (&lt;18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (30+). Consider consulting a doctor for accurate health assessment.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
      <Card className="max-w-3xl mx-auto dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-white text-gray-900">
            <Info className="h-5 w-5 dark:text-blue-400 text-blue-600" />
            <span>How to Use the Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: 1, title: "Enter Weight", desc: "Input your weight in kg" },
              { step: 2, title: "Enter Height", desc: "Input your height in cm" },
              { step: 3, title: "Enter Age", desc: "Input your age in years" },
              { step: 4, title: "Select Gender", desc: "Choose male or female" }
            ].map((item) => (
              <div key={item.step} className="text-center space-y-2 p-4 dark:bg-gray-700 bg-gray-100 rounded-lg">
                <div className="w-8 h-8 dark:bg-blue-900 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="dark:text-blue-400 text-blue-600 font-bold">{item.step}</span>
                </div>
                <h4 className="font-medium dark:text-white text-gray-900">{item.title}</h4>
                <p className="text-xs dark:text-gray-500 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold">How to Calculate BMI</h2>
        <p>To calculate BMI, divide weight in kilograms by height in meters squared. The formula is:</p>
        <code className="block dark:bg-gray-700 bg-gray-200 p-2 rounded mb-4 dark:text-gray-300 text-gray-900">BMI = weight (kg) / [height (m)]²</code>
        <p>Age and gender are used for more accurate category interpretation in advanced calculators, but basic BMI doesn't require them. This tool includes them for context.</p>
        <p>Learn more: <a href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">CDC BMI Guide <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></p>
      </section>

      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold">What is BMI?</h2>
        <p>Body Mass Index (BMI) is a measure that uses height and weight to estimate body fat. It helps screen for weight categories that may lead to health problems.</p>
        <p>Developed by Adolphe Quetelet in the 19th century, it's widely used by health organizations. While simple, it doesn't distinguish between fat and muscle, so athletes may have high BMI without excess fat.</p>
        <p>Global average BMI is around 23-25, varying by country and demographics.</p>
        <p>Learn more: <a href="https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">WHO BMI Information <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></p>
      </section>
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold">What is a Kilogram in BMI Context?</h2>
        <p>In BMI, kilograms measure weight. One kg equals 2.2 pounds. BMI uses metric units for standardization.</p>
        <p>Weight changes of 1 kg can significantly impact BMI, especially for shorter individuals. Maintaining healthy weight in kg helps achieve optimal BMI.</p>
        <p>Learn more: <a href="https://www.nist.gov/si-redefinition/kilogram" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">NIST Kilogram Definition <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></p>
      </section>
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold">BMI Categories Table</h2>
        <p>Standard BMI categories for adults (age 20+).</p>
        <Table className="dark:bg-gray-700 bg-gray-100 dark:border-gray-600 border-gray-300">
          <TableHeader>
            <TableRow>
              <TableHead className="dark:text-white text-gray-900">BMI Range</TableHead>
              <TableHead className="dark:text-white text-gray-900">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { range: "&lt; 18.5", category: "Underweight" },
              { range: "18.5 - 24.9", category: "Normal" },
              { range: "25.0 - 29.9", category: "Overweight" },
              { range: "30.0 - 34.9", category: "Obese Class I" },
              { range: "35.0 - 39.9", category: "Obese Class II" },
              { range: "&gt;= 40.0", category: "Obese Class III" },
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell className="dark:text-gray-300 text-gray-700">{item.range}</TableCell>
                <TableCell className="dark:text-gray-300 text-gray-700">{item.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-xs dark:text-gray-500 text-gray-600 mt-2">Categories may vary for children and teens.</p>
      </section>
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold">Practical Examples</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Average Adult Male",
              input: "Weight: 70kg, Height: 175cm, Age: 30, Male",
              result: "BMI: 22.86 (Normal)",
              desc: "This BMI indicates a healthy weight range with low health risks."
            },
            {
              title: "Athletic Female",
              input: "Weight: 60kg, Height: 165cm, Age: 28, Female",
              result: "BMI: 22.04 (Normal)",
              desc: "Even with muscle mass, BMI is in healthy range; consult body composition tests for accuracy."
            },
            {
              title: "Overweight Example",
              input: "Weight: 85kg, Height: 170cm, Age: 45, Male",
              result: "BMI: 29.41 (Overweight)",
              desc: "Suggests increased risk for health issues; consider diet and exercise changes."
            },
          ].map((example, index) => (
            <Card key={index} className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white text-gray-900">{example.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2 dark:text-gray-300 text-gray-700"><strong>Input:</strong> {example.input}</p>
                <p className="text-sm mb-2 dark:text-gray-300 text-gray-700"><strong>Result:</strong> {example.result}</p>
                <p className="text-xs dark:text-gray-500 text-gray-600">{example.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-4 rounded-lg shadow-soft dark:text-gray-300 text-gray-900 text-center">
        <h2 className="text-2xl font-semibold mb-4">Share This Calculator</h2>
        <div className="flex justify-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild className="mb-2 w-full sm:w-auto">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="dark:text-gray-300 text-gray-900 w-full text-center">
              <Facebook className="h-4 w-4 mr-2 dark:text-blue-400 text-blue-600" /> Facebook
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild className="mb-2 w-full sm:w-auto">
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=Check out this BMI Calculator!`} target="_blank" rel="noopener noreferrer" className="dark:text-gray-300 text-gray-900 w-full text-center">
              <Twitter className="h-4 w-4 mr-2 dark:text-blue-400 text-blue-600" /> Twitter/X
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild className="mb-2 w-full sm:w-auto">
            <a href={`whatsapp://send?text=Check out this BMI Calculator! ${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" data-action="share/whatsapp/share" className="dark:text-gray-300 text-gray-900 w-full text-center">
              <Share2 className="h-4 w-4 mr-2 dark:text-blue-400 text-blue-600" /> WhatsApp
            </a>
          </Button>
        </div>
      </section>
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold">References</h2>
        <ul>
          <li><a href="https://www.who.int/tools/child-growth-standards/standards/body-mass-index-for-age-bmi-for-age" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">World Health Organization - BMI Standards <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></li>
          <li><a href="https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">CDC - Adult BMI Calculator <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></li>
          <li><a href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">NHLBI - BMI Tools <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></li>
          <li><a href="https://pubmed.ncbi.nlm.nih.gov/12499370/" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">PubMed - BMI History and Use <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></li>
        </ul>
      </section>
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold">Recommended Health Tools</h2>
        <p>Enhance your health tracking with these tools. (Affiliate links - commission may be earned at no cost to you)</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white text-gray-900">Digital Scales on Amazon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2 dark:text-gray-300 text-gray-700">Accurate body weight measurement devices.</p>
              <Button variant="outline" asChild className="dark:text-white text-gray-900 dark:border-gray-600 border-gray-300 dark:hover:bg-gray-700 hover:bg-gray-100">
                <a href="https://www.amazon.com/s?k=digital+scale&tag=youraffiliateid-20" target="_blank" rel="nofollow noreferrer">
                  Shop Now <ExternalLink className="h-4 w-4 ml-2 dark:text-blue-400 text-blue-600" />
                </a>
              </Button>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white text-gray-900">Body Composition Analyzers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2 dark:text-gray-300 text-gray-700">Advanced devices for detailed body metrics.</p>
              <Button variant="outline" asChild className="dark:text-white text-gray-900 dark:border-gray-600 border-gray-300 dark:hover:bg-gray-700 hover:bg-gray-100">
                <a href="https://www.amazon.com/s?k=body+composition+analyzer&tag=youraffiliateid-20" target="_blank" rel="nofollow noreferrer">
                  Shop Now <ExternalLink className="h-4 w-4 ml-2 dark:text-blue-400 text-blue-600" />
                </a>
              </Button>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white text-gray-900">The Smoothie Diet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2 dark:text-gray-300 text-gray-700">21-day program for healthy weight management.</p>
              <Button variant="outline" asChild className="dark:text-white text-gray-900 dark:border-gray-600 border-gray-300 dark:hover:bg-gray-700 hover:bg-gray-100">
                <a href="https://45633oyw4b2o6taioi0hr3r7uc.hop.clickbank.net" target="_blank" rel="nofollow noreferrer">
                  Get Smoothie Diet <ExternalLink className="h-4 w-4 ml-2 dark:text-blue-400 text-blue-600" />
                </a>
              </Button>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white text-gray-900">Get AQUA Sculpt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2 dark:text-gray-300 text-gray-700">Program for body sculpting and fitness improvement.</p>
              <Button variant="outline" asChild className="dark:text-white text-gray-900 dark:border-gray-600 border-gray-300 dark:hover:bg-gray-700 hover:bg-gray-100">
                <a href="https://getaquasculptnow.net/extraBottle/?hop=zzzzz&hopId=6086a95d-69cf-4c81-9390-1c0a5e9ebe8d" target="_blank" rel="nofollow noreferrer">
                  Get AQUA Sculpt <ExternalLink className="h-4 w-4 ml-2 dark:text-blue-400 text-blue-600" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
      <div className="max-w-3xl mx-auto mt-8">
        <AdSlot
          variant="banner"
          label="Ad - Bottom Multiplex (Google AdSense)"
          adFormat="autorelaxed"
          fullWidthResponsive={false}
          lazy
          adClient={import.meta.env.VITE_ADSENSE_CLIENT}
          adSlot={import.meta.env.VITE_ADSENSE_SLOT_BOTTOM_MULTIPLEX}
        />
      </div>
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold mb-4">Send Us Your Feedback</h2>
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium dark:text-gray-300 text-gray-700">Name (Optional)</label>
            <Input
              id="name"
              value={feedback.name}
              onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
              className="mt-1 dark:bg-gray-700 bg-white dark:border-gray-600 border-gray-300 dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium dark:text-gray-300 text-gray-700">Email (Optional)</label>
            <Input
              id="email"
              type="email"
              value={feedback.email}
              onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
              className="mt-1 dark:bg-gray-700 bg-white dark:border-gray-600 border-gray-300 dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="suggestions" className="text-sm font-medium dark:text-gray-300 text-gray-700">Suggestions</label>
            <Input
              id="suggestions"
              value={feedback.suggestions}
              onChange={(e) => setFeedback({ ...feedback, suggestions: e.target.value })}
              className="mt-1 dark:bg-gray-700 bg-white dark:border-gray-600 border-gray-300 dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400"
            />
          </div>
          <Button type="submit" className="dark:bg-blue-600 bg-blue-500 dark:text-white text-white dark:hover:bg-blue-700 hover:bg-blue-600">Submit Feedback</Button>
        </form>
      </section>
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900 text-center">
        <p className="text-sm">
          <strong>Note:</strong> This calculator is reviewed by the Smart Kit Now Team for accuracy. For health-related decisions, consult a professional healthcare provider.
        </p>
      </section>
      {/* Top center banner */}
      <div className="max-w-3xl mx-auto mt-16">
        <AdSlot
          variant="banner"
          label="Ad - Top Center (Google AdSense)"
          lazy
          adClient={import.meta.env.VITE_ADSENSE_CLIENT}
          adSlot={import.meta.env.VITE_ADSENSE_SLOT_TOP_CENTER}
        />
      </div>
      {/* Side rails removed per request — reverted to previous layout without fixed lateral ads */}
    </div>
  );
}

export default IMCCalculator;