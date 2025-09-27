// /src/data/calculatorRegistry.ts
type Loader = () => Promise<any>;

export type RegistryEntry = {
  title?: string;
  description?: string;
  appCategory?: string; // "FinanceApplication" | "HealthApplication" | ...
  exportName?: string;  // named export when there is no default
  loader: Loader;
};

export type CategoryRegistry = Record<string, RegistryEntry>;
export type CalculatorRegistry = Record<string, CategoryRegistry>;

export const calculatorRegistry: CalculatorRegistry = {
  // -------- FINANCIAL --------
  financial: {
    "adjusted-gross-income-calculator": {
      title: "Adjusted Gross Income (AGI) Calculator",
      description: "Estimate your Adjusted Gross Income fast.",
      appCategory: "FinanceApplication",
      exportName: "AdjustedGrossIncomeCalculator",
      loader: () => import("@/components/calculators/financial/AdjustedGrossIncomeCalculator"),
    },
    "amortization-calculator": {
      title: "Amortization Calculator",
      description: "Build an amortization schedule and break down interest vs. principal.",
      appCategory: "FinanceApplication",
      exportName: "AmortizationCalculator",
      loader: () => import("@/components/calculators/financial/AmortizationCalculator"),
    },
    "annual-income-calculator": {
      title: "Annual Income Calculator",
      description: "Convert hourly/weekly/monthly pay into annual income.",
      appCategory: "FinanceApplication",
      exportName: "AnnualIncomeCalculator",
      loader: () => import("@/components/calculators/financial/AnnualIncomeCalculator"),
    },
    "apr-calculator": {
      title: "APR Calculator",
      description: "Compute annual percentage rate and total loan cost.",
      appCategory: "FinanceApplication",
      exportName: "APRCalculator",
      loader: () => import("@/components/calculators/financial/APRCalculator"),
    },
    "biweekly-pay-calculator": {
      title: "Biweekly Pay Calculator",
      description: "Estimate your biweekly paycheck and deductions.",
      appCategory: "FinanceApplication",
      exportName: "BiweeklyPayCalculator",
      loader: () => import("@/components/calculators/financial/BiweeklyPayCalculator"),
    },
    "compound-interest-calculator": {
      title: "Compound Interest Calculator",
      description: "Project growth of savings with compound interest.",
      appCategory: "FinanceApplication",
      exportName: "CompoundInterestCalculator",
      loader: () => import("@/components/calculators/financial/CompoundInterestCalculator"),
    },
    "debt-to-income-calculator": {
      title: "Debt-to-Income (DTI) Calculator",
      description: "Check your DTI ratio for lending decisions.",
      appCategory: "FinanceApplication",
      exportName: "DebtToIncomeCalculator",
      loader: () => import("@/components/calculators/financial/DebtToIncomeCalculator"),
    },
    "discount-calculator": {
      title: "Discount Calculator",
      description: "Find final price after discounts and taxes.",
      appCategory: "FinanceApplication",
      exportName: "DiscountCalculator",
      loader: () => import("@/components/calculators/financial/DiscountCalculator"),
    },
    "home-affordability-calculator": {
      title: "Home Affordability Calculator",
      description: "Estimate how much house you can afford.",
      appCategory: "FinanceApplication",
      exportName: "HomeAffordabilityCalculator",
      loader: () => import("@/components/calculators/financial/HomeAffordabilityCalculator"),
    },
    "hourly-to-salary-calculator": {
      title: "Hourly to Salary Calculator",
      description: "Convert hourly wage to annual salary.",
      appCategory: "FinanceApplication",
      exportName: "HourlyToSalaryCalculator",
      loader: () => import("@/components/calculators/financial/HourlyToSalaryCalculator"),
    },
    "investment-return-calculator": {
      title: "Investment Return (ROI) Calculator",
      description: "Calculate total and annualized returns.",
      appCategory: "FinanceApplication",
      exportName: "InvestmentReturnCalculator",
      loader: () => import("@/components/calculators/financial/InvestmentReturnCalculator"),
    },
    "loan-calculator": {
      title: "Loan Payment Calculator",
      description: "Compute monthly payment, interest and total cost.",
      appCategory: "FinanceApplication",
      exportName: "LoanCalculator",
      loader: () => import("@/components/calculators/financial/LoanCalculator"),
    },
    "mortgage-calculator": {
      title: "Mortgage Calculator",
      description: "Estimate mortgage payments and amortization.",
      appCategory: "FinanceApplication",
      exportName: "MortgageCalculator",
      loader: () => import("@/components/calculators/financial/MortgageCalculator"),
    },
    "mortgage-refinance-calculator": {
      title: "Mortgage Refinance Calculator",
      description: "Check savings and break-even on a refi.",
      appCategory: "FinanceApplication",
      exportName: "MortgageRefinanceCalculator",
      loader: () => import("@/components/calculators/financial/MortgageRefinanceCalculator"),
    },
    "refinance-breakeven-calculator": {
      title: "Refinance Breakeven Calculator",
      description: "Find months-to-breakeven for refinancing.",
      appCategory: "FinanceApplication",
      exportName: "RefinanceBreakevenCalculator",
      loader: () => import("@/components/calculators/financial/RefinanceBreakevenCalculator"),
    },
    "roi-calculator": {
      title: "ROI Calculator",
      description: "Compute return on investment.",
      appCategory: "FinanceApplication",
      exportName: "ROICalculator",
      loader: () => import("@/components/calculators/financial/ROICalculator"),
    },
    "simple-interest-calculator": {
      title: "Simple Interest Calculator",
      description: "Calculate simple interest for loans or savings.",
      appCategory: "FinanceApplication",
      exportName: "SimpleInterestCalculator",
      loader: () => import("@/components/calculators/financial/SimpleInterestCalculator"),
    },
    "tip-calculator": {
      title: "Tip Calculator",
      description: "Split the bill and calculate the right tip.",
      appCategory: "FinanceApplication",
      exportName: "TipCalculator",
      loader: () => import("@/components/calculators/financial/TipCalculator"),
    },
  },

  // -------- COOKING --------
  cooking: {
    "cake-calculator": {
      title: "Cake Calculator",
      description: "Scale cake recipes and pan sizes.",
      appCategory: "FoodApplication",
      exportName: "CakeCalculator",
      loader: () => import("@/components/calculators/cooking/CakeCalculator"),
    },
    "cooking-conversion-calculator": {
      title: "Cooking Conversion Calculator",
      description: "Convert cooking units and ingredients.",
      appCategory: "FoodApplication",
      exportName: "CookingConversionCalculator",
      loader: () => import("@/components/calculators/cooking/CookingConversionCalculator"),
    },
    "cooking-timer": {
      title: "Timer",
      description: "Simple cooking countdown timer.",
      appCategory: "FoodApplication",
      exportName: "CookingTimer",
      loader: () => import("@/components/calculators/cooking/CookingTimer"),
    },
    "oven-temperature-conversion": {
      title: "Oven Temperature Converter",
      description: "Convert °C, °F and gas mark easily.",
      appCategory: "FoodApplication",
      exportName: "OvenTemperatureConverter",
      loader: () => import("@/components/calculators/cooking/OvenTemperatureConverter"),
    },
    "pizza-calculator": {
      title: "Pizza Calculator",
      description: "Flour, hydration and dough yield.",
      appCategory: "FoodApplication",
      exportName: "PizzaCalculator",
      loader: () => import("@/components/calculators/cooking/PizzaCalculator"),
    },
    "recipe-scale-conversion": {
      title: "Recipe Scaling Calculator",
      description: "Scale any recipe by servings or factor.",
      appCategory: "FoodApplication",
      exportName: "RecipeScalingCalculator",
      loader: () => import("@/components/calculators/cooking/RecipeScalingCalculator"),
    },
  },

  // -------- ELECTRICAL --------
  electrical: {
    "ohms-law-calculator": {
      title: "Ohm's Law Calculator",
      description: "Compute voltage, current, resistance, and power.",
      appCategory: "EngineeringApplication",
      exportName: "OhmsLawCalculator",
      loader: () => import("@/components/calculators/electrical/OhmsLawCalculator"),
    },
    "wire-size-calculator": {
      title: "Wire Size Calculator",
      description: "Estimate AWG size by load and distance.",
      appCategory: "EngineeringApplication",
      exportName: "WireSizeCalculator",
      loader: () => import("@/components/calculators/electrical/WireSizeCalculator"),
    },
  },

  // -------- HEALTH --------
  health: {
    "adjusted-body-weight-calculator": {
      title: "Adjusted Body Weight (ABW) Calculator",
      description: "Clinical ABW estimate based on IBW and TBW.",
      appCategory: "HealthApplication",
      exportName: "AdjustedBodyWeightCalculator",
      loader: () => import("@/components/calculators/health/AdjustedBodyWeightCalculator"),
    },
    "bmi-calculator": {
      title: "BMI Calculator",
      description: "Body Mass Index for adults.",
      appCategory: "HealthApplication",
      exportName: "BMICalculator",
      loader: () => import("@/components/calculators/health/BMICalculator"),
    },
    "bmr-calculator": {
      title: "BMR Calculator",
      description: "Basal Metabolic Rate (Mifflin-St Jeor, etc.).",
      appCategory: "HealthApplication",
      exportName: "BMRCalculator",
      loader: () => import("@/components/calculators/health/BMRCalculator"),
    },
    "body-fat-calculator": {
      title: "Body Fat Calculator",
      description: "Estimate body fat via measurements.",
      appCategory: "HealthApplication",
      exportName: "BodyFatCalculator",
      loader: () => import("@/components/calculators/health/BodyFatCalculator"),
    },
    "calorie-calculator": {
      title: "Calorie Calculator",
      description: "Daily calorie needs based on activity.",
      appCategory: "HealthApplication",
      exportName: "CalorieCalculator",
      loader: () => import("@/components/calculators/health/CalorieCalculator"),
    },
    "calories-to-kilograms-calculator": {
      title: "Calories to Kilograms Calculator",
      description: "Rough weight change from calorie balance.",
      appCategory: "HealthApplication",
      exportName: "CaloriesToKilogramsCalculator",
      loader: () => import("@/components/calculators/health/CaloriesToKilogramsCalculator"),
    },
    "imc-calculator": {
      title: "BMI Calculator (IMC)",
      description: "Body Mass Index (IMC) for adults.",
      appCategory: "HealthApplication",
      exportName: "IMCCalculator",
      loader: () => import("@/components/calculators/health/IMCCalculator"),
    },
    "tdee-calculator": {
      title: "TDEE Calculator",
      description: "Total Daily Energy Expenditure.",
      appCategory: "HealthApplication",
      exportName: "TDEECalculator",
      loader: () => import("@/components/calculators/health/TDEECalculator"),
    },
  },

  // -------- MATH --------
  math: {
    "area-calculator": {
      title: "Area Calculator",
      description: "Areas for rectangles, circles and more.",
      appCategory: "EducationalApplication",
      exportName: "AreaCalculator",
      loader: () => import("@/components/calculators/math/AreaCalculator"),
    },
    "fraction-calculator": {
      title: "Fraction Calculator",
      description: "Add, subtract, multiply, divide, and simplify fractions.",
      appCategory: "EducationalApplication",
      exportName: "FractionCalculator",
      loader: () => import("@/components/calculators/math/FractionCalculator"),
    },
    "gpa-calculator": {
      title: "GPA Calculator",
      description: "Grade Point Average computation.",
      appCategory: "EducationalApplication",
      exportName: "GPACalculator",
      loader: () => import("@/components/calculators/math/GPACalculator"),
    },
    "percentage-calculator": {
      title: "Percentage Calculator",
      description: "Find % change, % of, and reverse %.",
      appCategory: "EducationalApplication",
      exportName: "PercentageCalculator",
      loader: () => import("@/components/calculators/math/PercentageCalculator"),
    },
    "slope-calculator": {
      title: "Slope Calculator",
      description: "Calculate slope, rise, run, and angle.",
      appCategory: "EducationalApplication",
      exportName: "SlopeCalculator",
      loader: () => import("@/components/calculators/math/SlopeCalculator"),
    },
  },

  // -------- PETS --------
  pets: {
    "aquarium-volume-calculator": {
      title: "Aquarium Volume Calculator",
      description: "Tank volume by dimensions and shape.",
      appCategory: "LifestyleApplication",
      exportName: "AquariumVolumeCalculator",
      loader: () => import("@/components/calculators/pets/AquariumVolumeCalculator"),
    },
    "aquarium-weight-calculator": {
      title: "Aquarium Weight Calculator",
      description: "Estimate weight of tank + water.",
      appCategory: "LifestyleApplication",
      exportName: "AquariumWeightCalculator",
      loader: () => import("@/components/calculators/pets/AquariumWeightCalculator"),
    },
    "cat-age-calculator": {
      title: "Cat Age Calculator",
      description: "Convert cat years to human years.",
      appCategory: "LifestyleApplication",
      exportName: "CatAgeCalculator",
      loader: () => import("@/components/calculators/pets/CatAgeCalculator"),
    },
    "dog-age-calculator": {
      title: "Dog Age Calculator",
      description: "Convert dog years to human years.",
      appCategory: "LifestyleApplication",
      exportName: "DogAgeCalculator",
      loader: () => import("@/components/calculators/pets/DogAgeCalculator"),
    },
    "dog-calorie-calculator": {
      title: "Dog Calorie Calculator",
      description: "Estimate daily calories for dogs.",
      appCategory: "LifestyleApplication",
      exportName: "DogCalorieCalculator",
      loader: () => import("@/components/calculators/pets/DogCalorieCalculator"),
    },
  },

  // -------- SCIENCE --------
  science: {
    "density-calculator": {
      title: "Density Calculator",
      description: "Compute density from mass and volume.",
      appCategory: "STEMApplication",
      exportName: "DensityCalculator",
      loader: () => import("@/components/calculators/science/DensityCalculator"),
    },
    "force-calculator": {
      title: "Force Calculator",
      description: "Newton's second law calculations.",
      appCategory: "STEMApplication",
      exportName: "ForceCalculator",
      loader: () => import("@/components/calculators/science/ForceCalculator"),
    },
    "molarity-calculator": {
      title: "Molarity Calculator",
      description: "Moles of solute per liter of solution.",
      appCategory: "STEMApplication",
      exportName: "MolarityCalculator",
      loader: () => import("@/components/calculators/science/MolarityCalculator"),
    },
    "molar-mass-calculator": {
      title: "Molar Mass Calculator",
      description: "Sum atomic masses by chemical formula.",
      appCategory: "STEMApplication",
      exportName: "MolarMassCalculator",
      loader: () => import("@/components/calculators/science/MolarMassCalculator"),
    },
    "physics-calculator": {
      title: "Physics Calculator",
      description: "Common physics computations.",
      appCategory: "STEMApplication",
      exportName: "PhysicsCalculator",
      loader: () => import("@/components/calculators/science/PhysicsCalculator"),
    },
    "velocity-calculator": {
      title: "Velocity Calculator",
      description: "Average velocity from distance/time.",
      appCategory: "STEMApplication",
      exportName: "VelocityCalculator",
      loader: () => import("@/components/calculators/science/VelocityCalculator"),
    },
  },

  // -------- TIME --------
  time: {
    "age-calculator": {
      title: "Age Calculator",
      description: "Compute exact age from birthdate.",
      appCategory: "UtilityApplication",
      exportName: "AgeCalculator",
      loader: () => import("@/components/calculators/time/AgeCalculator"),
    },
    "countdown-calculator": {
      title: "Countdown Calculator",
      description: "Countdown to a target date/time.",
      appCategory: "UtilityApplication",
      exportName: "CountdownCalculator",
      loader: () => import("@/components/calculators/time/CountdownCalculator"),
    },
    "date-calculator": {
      title: "Date Calculator",
      description: "Add/subtract days and business days.",
      appCategory: "UtilityApplication",
      exportName: "DateCalculator",
      loader: () => import("@/components/calculators/time/DateCalculator"),
    },
    "duration-calculator": {
      title: "Duration Calculator",
      description: "Time between two timestamps.",
      appCategory: "UtilityApplication",
      exportName: "DurationCalculator",
      loader: () => import("@/components/calculators/time/DurationCalculator"),
    },
    "time-converter": {
      title: "Time Converter",
      description: "Convert hours, minutes, seconds and more.",
      appCategory: "UtilityApplication",
      exportName: "TimeConverter",
      loader: () => import("@/components/calculators/time/TimeConverter"),
    },
  },

  // -------- TV --------
  tv: {
    "aspect-ratio-calculator": {
      title: "Aspect Ratio Calculator",
      description: "Compute aspect ratio & dimensions.",
      appCategory: "MediaApplication",
      exportName: "AspectRatioCalculator",
      loader: () => import("@/components/calculators/tv/AspectRatioCalculator"),
    },
    "ppi-calculator": {
      title: "PPI Calculator",
      description: "Pixels per inch by size & resolution.",
      appCategory: "MediaApplication",
      exportName: "PPICalculator",
      loader: () => import("@/components/calculators/tv/PPICalculator"),
    },
    "projector-calculator": {
      title: "Projector Calculator",
      description: "Throw distance and screen size.",
      appCategory: "MediaApplication",
      exportName: "ProjectorCalculator",
      loader: () => import("@/components/calculators/tv/ProjectorCalculator"),
    },
    "screen-size-calculator": {
      title: "Screen Size Calculator",
      description: "Find diagonal, width and height.",
      appCategory: "MediaApplication",
      exportName: "ScreenSizeCalculator",
      loader: () => import("@/components/calculators/tv/ScreenSizeCalculator"),
    },
    "tv-dimensions-chart": {
      title: "TV Dimensions Chart",
      description: "Common TV sizes and dimensions.",
      appCategory: "MediaApplication",
      exportName: "TVDimensionsChart",
      loader: () => import("@/components/calculators/tv/TVDimensionsChart"),
    },
    "tv-height-calculator": {
      title: "TV Height Calculator",
      description: "Ideal center height from seating distance.",
      appCategory: "MediaApplication",
      exportName: "TVHeightCalculator",
      loader: () => import("@/components/calculators/tv/TVHeightCalculator"),
    },
    "tv-mounting-cost-calculator": {
      title: "TV Mounting Cost Calculator",
      description: "Estimate labor and materials for mounting.",
      appCategory: "MediaApplication",
      exportName: "TVMountingCostCalculator",
      loader: () => import("@/components/calculators/tv/TVMountingCostCalculator"),
    },
    "tv-viewing-distance-calculator": {
      title: "TV Viewing Distance Calculator",
      description: "Recommended viewing distance by size & resolution.",
      appCategory: "MediaApplication",
      exportName: "TVViewingDistanceCalculator",
      loader: () => import("@/components/calculators/tv/TVViewingDistanceCalculator"),
    },
    "tv-viewing-ranges-guide": {
      title: "TV Viewing Ranges Guide",
      description: "Guide to viewing angles and distances.",
      appCategory: "MediaApplication",
      exportName: "TVViewingRangesGuide",
      loader: () => import("@/components/calculators/tv/TVViewingRangesGuide"),
    },
    "video-resolutions-guide": {
      title: "Video Resolutions Guide",
      description: "Common SD/HD/4K/8K resolution table.",
      appCategory: "MediaApplication",
      exportName: "VideoResolutionsGuide",
      loader: () => import("@/components/calculators/tv/VideoResolutionsGuide"),
    },
  },
};
