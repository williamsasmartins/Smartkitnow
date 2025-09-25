import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";

const HealthCalculators = () => {
  const navigate = useNavigate();

  const subCategories = [
    {
      title: "Body Measurement Calculators",
      icon: "fa-solid fa-user",
      calculators: [
        { key: "adjusted-body-weight", name: "Adjusted Body Weight Calculator" },
        { key: "army-body-fat", name: "Army Body Fat Calculator" },
        { key: "baby-growth-percentile", name: "Baby Growth Percentile Calculator" },
        { key: "bac", name: "Blood Alcohol Content (BAC) Calculator" },
        { key: "bmi", name: "BMI Calculator" },
        { key: "body-fat", name: "Body Fat Calculator" },
        { key: "body-shape", name: "Body Shape Calculator" },
        { key: "body-surface-area", name: "Body Surface Area Calculator" },
        { key: "child-teen-bmi", name: "Child & Teen BMI Calculator" },
        { key: "child-height-percentile", name: "Child Height Percentile Calculator" },
        { key: "child-weight-percentile", name: "Child Weight Percentile Calculator" },
        { key: "desk-height", name: "Desk Height Calculator" },
        { key: "ffmi", name: "FFMI Calculator (Fat-Free Mass Index)" },
        { key: "height", name: "Height Calculator" },
        { key: "height-converter", name: "Height Converter" },
        { key: "ideal-body-weight", name: "Ideal Body Weight Calculator" },
        { key: "iq-percentile", name: "IQ Percentile Calculator" },
        { key: "lean-body-mass", name: "Lean Body Mass Calculator" },
        { key: "navy-body-fat", name: "Navy Body Fat Calculator" },
        { key: "waist-to-height-ratio", name: "Waist-to-Height Ratio Calculator" },
        { key: "waist-to-hip-ratio", name: "Waist-to-Hip Ratio Calculator" },
        { key: "weight-loss-percentage", name: "Weight Loss Percentage Calculator" }
        { key: "imc", name: "IMC Calculator" }
      ]
    },
    {
      title: "Calories Conversion",
      icon: "fa-solid fa-fire",
      calculators: [
        { key: "calories-to-kg", name: "Convert Calories to Kilograms" },
        { key: "calories-to-pounds", name: "Convert Calories to Pounds" },
        { key: "kg-to-calories", name: "Convert Kilograms to Calories" },
        { key: "pounds-to-calories", name: "Convert Pounds to Calories" }
      ]
    },
    {
      title: "Dietary and Nutrition Calculators",
      icon: "fa-solid fa-apple-whole",
      calculators: [
        { key: "bmr", name: "BMR Calculator" },
        { key: "calorie-density", name: "Calorie Density Calculator" },
        { key: "calorie-intake", name: "Calorie Intake Calculator" },
        { key: "carb", name: "Carb Calculator" },
        { key: "fat-intake", name: "Fat Intake Calculator" },
        { key: "harris-benedict", name: "Harris-Benedict Calculator" },
        { key: "keto", name: "Keto Calculator" },
        { key: "macro", name: "Macro Calculator" },
        { key: "maintenance-calorie", name: "Maintenance Calorie Calculator" },
        { key: "mifflin-st-jeor", name: "Mifflin St. Jeor Calculator" },
        { key: "net-carb", name: "Net Carb Calculator" },
        { key: "protein-intake", name: "Protein Intake Calculator" },
        { key: "rmr", name: "RMR Calculator" },
        { key: "tdee", name: "TDEE Calculator" },
        { key: "water-intake", name: "Water Intake Calculator" },
        { key: "weight-gain", name: "Weight Gain Calculator" },
        { key: "weight-loss", name: "Weight Loss Calculator" }
      ]
    },
    {
      title: "Fitness Calculators",
      icon: "fa-solid fa-dumbbell",
      calculators: [
        { key: "acft", name: "ACFT Calculator" },
        { key: "air-force-pt-test", name: "Air Force PT Test Calculator" },
        { key: "bench-press", name: "Bench Press Calculator" },
        { key: "calories-burned-biking", name: "Calories Burned Biking Calculator" },
        { key: "calories-burned", name: "Calories Burned Calculator" },
        { key: "calories-burned-hiking", name: "Calories Burned Hiking Calculator" },
        { key: "calories-burned-jumping-rope", name: "Calories Burned Jumping Rope Calculator" },
        { key: "calories-burned-running", name: "Calories Burned Running Calculator" },
        { key: "calories-burned-swimming", name: "Calories Burned Swimming Calculator" },
        { key: "calories-burned-walking", name: "Calories Burned Walking Calculator" },
        { key: "calories-burned-weight-lifting", name: "Calories Burned Weight Lifting Calculator" },
        { key: "deadlift-max", name: "Deadlift Max Calculator" },
        { key: "golf-altitude-adjustment", name: "Golf Altitude Adjustment Calculator" },
        { key: "ice-rink-volume", name: "Ice Rink Volume and Fill Time Calculator" },
        { key: "lifting-strength", name: "Lifting Strength Calculator" },
        { key: "miles-to-steps", name: "Miles to Steps Calculator" },
        { key: "navy-prt", name: "Navy PRT Calculator" },
        { key: "one-rep-max", name: "One-Rep Max Calculator" },
        { key: "pace-distance", name: "Pace and Distance Calculator" },
        { key: "push-ups-calorie", name: "Push-Ups Calorie Calculator" },
        { key: "squat-max", name: "Squat Max Calculator" },
        { key: "steps-to-calories", name: "Steps to Calories Calculator" },
        { key: "steps-to-kilometers", name: "Steps to Kilometers Calculator" },
        { key: "steps-to-miles", name: "Steps to Miles Calculator" },
        { key: "target-heart-rate", name: "Target Heart Rate Calculator" },
        { key: "usmc-pft-cft", name: "USMC PFT/CFT Calculator" },
        { key: "zone-2-heart-rate", name: "Zone 2 Heart Rate Calculator" }
      ]
    }
  ];

  const handleSubCategoryClick = (subCategory: any) => {
    const slug = subCategory.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    navigate(`/health/${slug}`, { state: { subCategory } });
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex flex-col items-center text-center space-y-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Health & Fitness Calculators
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Use our health and fitness calculators for measurements and conversions for various exercise, fitness, nutritional, dietary, and body measurement applications.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subCategories.map((subCategory, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 cursor-pointer"
                onClick={() => handleSubCategoryClick(subCategory)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <i className={`${subCategory.icon} text-primary text-lg`}></i>
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {subCategory.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {subCategory.calculators.length} calculators available
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {subCategory.calculators.slice(0, 3).map((calc, calcIndex) => (
                      <p key={calcIndex} className="text-xs text-muted-foreground">
                        • {calc.name}
                      </p>
                    ))}
                    {subCategory.calculators.length > 3 && (
                      <p className="text-xs text-muted-foreground font-medium">
                        + {subCategory.calculators.length - 3} more calculators
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HealthCalculators;