export type RecommendedItem = {
  title: string;
  description: string;
  link: string;
  cta: string;
  sponsored?: boolean;
};

export type RecommendedResourcesMap = Record<string, RecommendedItem[]>;

export const recommendedResources: RecommendedResourcesMap = {
  "calories-to-kilograms": [
    {
      title: "Fitness Trackers on Amazon",
      description: "Track your daily activity with Fitbit or Garmin devices.",
      link: "https://www.amazon.com/s?k=fitness+tracker",
      cta: "Shop Now",
      sponsored: true,
    },
    {
      title: "MyFitnessPal Premium",
      description: "Log meals and track calories with advanced features.",
      link: "https://www.myfitnesspal.com/premium",
      cta: "Get Premium",
      sponsored: false,
    },
    {
      title: "The Smoothie Diet",
      description: "21-day smoothie program for calorie deficit and weight loss with delicious recipes.",
      link: "#",
      cta: "Learn More",
      sponsored: true,
    },
    {
      title: "AQUA Sculpt Program",
      description: "Calorie-burning workouts and nutrition plans for a sculpted body.",
      link: "#",
      cta: "Explore Program",
      sponsored: true,
    }
  ],
  "bmi-calculator": [
    {
      title: "Smart Body Scales",
      description: "Track weight and BMI with Wi-Fi/Bluetooth smart scales.",
      link: "https://www.amazon.com/s?k=smart+body+scale",
      cta: "Shop Scales",
      sponsored: true,
    },
    {
      title: "CDC BMI Info",
      description: "Official guidance on BMI categories and health implications.",
      link: "https://www.cdc.gov/healthyweight/assessing/bmi/index.html",
      cta: "Learn More",
      sponsored: false,
    },
    {
      title: "Body Composition Guide",
      description: "Understand BMI vs. body fat and how to interpret results.",
      link: "https://examine.com/topics/body-composition/",
      cta: "Read Guide",
      sponsored: false,
    }
  ],
  "bmr-calculator": [
    {
      title: "Fitness Trackers",
      description: "Monitor activity to align with your BMR and daily burn.",
      link: "https://www.amazon.com/s?k=fitness+tracker",
      cta: "Shop Now",
      sponsored: true,
    },
    {
      title: "Meal Planning Apps",
      description: "Plan meals tailored to your BMR and goals.",
      link: "https://www.cronometer.com/",
      cta: "Try Cronometer",
      sponsored: false,
    },
    {
      title: "Sleep Optimization",
      description: "Improve recovery and metabolism for better energy balance.",
      link: "https://www.sleepfoundation.org/",
      cta: "Explore Tips",
      sponsored: false,
    }
  ],
  "tdee-calculator": [
    {
      title: "Heart Rate Monitors",
      description: "Train in zones to optimize daily energy expenditure.",
      link: "https://www.amazon.com/s?k=heart+rate+monitor",
      cta: "Shop Monitors",
      sponsored: true,
    },
    {
      title: "TDEE & Training Guide",
      description: "Use TDEE to plan sustainable fat loss and performance.",
      link: "https://www.strongerbyscience.com/energy-balance/",
      cta: "Read Guide",
      sponsored: false,
    },
    {
      title: "Activity Logging",
      description: "Track workouts and daily steps for accurate TDEE.",
      link: "https://www.myfitnesspal.com/",
      cta: "Start Logging",
      sponsored: false,
    }
  ],
  "calorie-intake-calculator": [
    {
      title: "Kitchen Food Scales",
      description: "Weigh food portions to accurately log calorie intake.",
      link: "https://www.amazon.com/s?k=kitchen+food+scale",
      cta: "Shop Scales",
      sponsored: true,
    },
    {
      title: "Meal Prep Containers",
      description: "Organize meals to meet your calorie targets.",
      link: "https://www.amazon.com/s?k=meal+prep+containers",
      cta: "Buy Containers",
      sponsored: true,
    },
    {
      title: "Healthy Recipes",
      description: "Find calorie-conscious recipes and nutrition tips.",
      link: "https://www.skinnytaste.com/",
      cta: "Browse Recipes",
      sponsored: false,
    }
  ]
};