import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";

import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import CookieSettings from "./pages/CookieSettings";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Calculators and categories
import AutomotiveCalculators from "./pages/categories/AutomotiveCalculators";
import AutomotiveSubCategory from "./pages/categories/AutomotiveSubCategory";
import ConstructionCalculators from "./pages/categories/ConstructionCalculators";
import ConstructionSubCategory from "./pages/categories/ConstructionSubCategory";
import ConversionCalculators from "./pages/categories/ConversionCalculators";
import ConversionSubCategory from "./pages/categories/ConversionSubCategory";
import ConversionPage from "./pages/ConversionPage";
import CookingCalculators from "./pages/categories/CookingCalculators";
import CookingSubCategory from "./pages/categories/CookingSubCategory";
import CookingCalculatorPage from "./pages/calculatorPages/CookingCalculatorPage";
import ElectricalCalculators from "./pages/categories/ElectricalCalculators";
import ElectricalSubCategory from "./pages/categories/ElectricalSubCategory";
import ElectricalCalculatorPage from "./pages/calculatorPages/ElectricalCalculatorPage";
import FinancialCalculators from "./pages/categories/FinancialCalculators";
import FinancialSubCategory from "./pages/categories/FinancialSubCategory";
import FinancialCalculatorPage from "./pages/calculatorPages/FinancialCalculatorPage";
import HealthCalculators from "./pages/categories/HealthCalculators";
import HealthSubCategory from "./pages/categories/HealthSubCategory";
import HealthCalculatorPage from "./pages/calculatorPages/HealthCalculatorPage";
import MathCalculators from "./pages/categories/MathCalculators";
import MathSubCategory from "./pages/categories/MathSubCategory";
import MathCalculatorPage from "./pages/calculatorPages/MathCalculatorPage";
import PetsCalculators from "./pages/categories/PetsCalculators";
import PetsSubCategory from "./pages/categories/PetsSubCategory";
import PetsCalculatorPage from "./pages/calculatorPages/PetsCalculatorPage";
import ScienceCalculators from "./pages/categories/ScienceCalculators";
import ScienceSubCategory from "./pages/categories/ScienceSubCategory";
import ScienceCalculatorPage from "./pages/calculatorPages/ScienceCalculatorPage";
import TVCalculators from "./pages/categories/TVCalculators";
import TVSubCategory from "./pages/categories/TVSubCategory";
import TVCalculatorPage from "./pages/calculatorPages/TVCalculatorPage";
import TimeCalculators from "./pages/categories/TimeCalculators";
import TimeSubCategory from "./pages/categories/TimeSubCategory";
import TimeCalculatorPage from "./pages/calculatorPages/TimeCalculatorPage";

// Recipes
import RecipeCalculators from "./pages/RecipeCalculators";
import RecipeSubCategory from "./pages/RecipeSubCategory";
import RecipePage from "./pages/RecipePage";

// SmartTips
import SmartTips from "./pages/SmartTips";
import SmartTipsSubCategory from "./pages/SmartTipsSubCategory";
import SmartTipDetail from "./pages/SmartTipDetail";

// Lazy-loaded construction calculator example
const ConcreteSlab = lazy(() => import("@/components/calculators/construction/ConcreteSlab"));

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    // Basic pages
    { path: "/", element: <Index /> },
    { path: "/about", element: <About /> },
    { path: "/terms", element: <Terms /> },
    { path: "/privacy", element: <Privacy /> },
    { path: "/cookies", element: <Cookies /> },
    { path: "/cookie-settings", element: <CookieSettings /> },
    { path: "/contact", element: <Contact /> },

    // Automotive
    { path: "/automotive", element: <AutomotiveCalculators /> },
    { path: "/automotive/:subcategory", element: <AutomotiveSubCategory /> },
    // NOVA (hierárquica correta):
    { path: "/automotive/:subcategory/calculator/:calculator", element: <ConversionPage /> },
    // ANTIGA (compatibilidade):
    { path: "/automotive/:subcategory/:calculator", element: <ConversionPage /> },

    // Construction
    { path: "/construction", element: <ConstructionCalculators /> },
    { path: "/construction/:subcategory", element: <ConstructionSubCategory /> },
    { path: "/construction/:subcategory/concrete-slab", element: (
        <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10">Loading…</div>}>
          <ConcreteSlab />
        </Suspense>
      )
    },

    // Conversion (já ok)
    { path: "/conversion", element: <ConversionCalculators /> },
    { path: "/conversion/:subcategory", element: <ConversionSubCategory /> },
    { path: "/conversion/:subcategory/:conversionKey", element: <ConversionPage /> },

    // Cooking (adiciona /calculator/ + mantém antiga)
    { path: "/cooking", element: <CookingCalculators /> },
    { path: "/cooking/:subcategory", element: <CookingSubCategory /> },
    // NOVA:
    { path: "/cooking/:subcategory/calculator/:calculator", element: <CookingCalculatorPage /> },
    // ANTIGA:
    { path: "/cooking/:subcategory/:calculator", element: <CookingCalculatorPage /> },

    // Electrical
    { path: "/electrical", element: <ElectricalCalculators /> },
    { path: "/electrical/:subcategory", element: <ElectricalSubCategory /> },
    // NOVA:
    { path: "/electrical/:subcategory/calculator/:calculator", element: <ElectricalCalculatorPage /> },
    // ANTIGA:
    { path: "/electrical/:subcategory/:calculator", element: <ElectricalCalculatorPage /> },

    // Financial
    { path: "/financial", element: <FinancialCalculators /> },
    { path: "/financial/:subcategory", element: <FinancialSubCategory /> },
    // NOVA:
    { path: "/financial/:subcategory/calculator/:calculator", element: <FinancialCalculatorPage /> },
    // ANTIGA:
    { path: "/financial/:subcategory/:calculator", element: <FinancialCalculatorPage /> },

    // Health
    { path: "/health", element: <HealthCalculators /> },
    { path: "/health/:subcategory", element: <HealthSubCategory /> },
    // NOVA:
    { path: "/health/:subcategory/calculator/:calculator", element: <HealthCalculatorPage /> },
    // ANTIGA:
    { path: "/health/:subcategory/:calculator", element: <HealthCalculatorPage /> },

    // Math
    { path: "/math", element: <MathCalculators /> },
    { path: "/math/:subcategory", element: <MathSubCategory /> },
    // NOVA:
    { path: "/math/:subcategory/calculator/:calculator", element: <MathCalculatorPage /> },
    // ANTIGA:
    { path: "/math/:subcategory/:calculator", element: <MathCalculatorPage /> },

    // Pets
    { path: "/pets", element: <PetsCalculators /> },
    { path: "/pets/:subcategory", element: <PetsSubCategory /> },
    // NOVA:
    { path: "/pets/:subcategory/calculator/:calculator", element: <PetsCalculatorPage /> },
    // ANTIGA:
    { path: "/pets/:subcategory/:calculator", element: <PetsCalculatorPage /> },

    // Science
    { path: "/science", element: <ScienceCalculators /> },
    { path: "/science/:subcategory", element: <ScienceSubCategory /> },
    // NOVA:
    { path: "/science/:subcategory/calculator/:calculator", element: <ScienceCalculatorPage /> },
    // ANTIGA:
    { path: "/science/:subcategory/:calculator", element: <ScienceCalculatorPage /> },

    // Time
    { path: "/time", element: <TimeCalculators /> },
    { path: "/time/:subcategory", element: <TimeSubCategory /> },
    // NOVA:
    { path: "/time/:subcategory/calculator/:calculator", element: <TimeCalculatorPage /> },
    // ANTIGA:
    { path: "/time/:subcategory/:calculator", element: <TimeCalculatorPage /> },

    // TV
    { path: "/tv", element: <TVCalculators /> },
    { path: "/tv/:subcategory", element: <TVSubCategory /> },
    // NOVA:
    { path: "/tv/:subcategory/calculator/:calculator", element: <TVCalculatorPage /> },
    // ANTIGA:
    { path: "/tv/:subcategory/:calculator", element: <TVCalculatorPage /> },

    // Recipes (ajuste: usar :recipeSlug para bater com RecipePage)
    { path: "/recipes", element: <RecipeCalculators /> },
    { path: "/recipes/:subcategory", element: <RecipeSubCategory /> },
    { path: "/recipes/:subcategory/:recipeSlug", element: <RecipePage /> },

    // SmartTips (mantido como está)
    { path: "/smart-tips", element: <SmartTips /> },
    { path: "/smart-tips/:subcategory", element: <SmartTipsSubCategory /> },
    { path: "/smart-tips/:subcategory/:calculator", element: <SmartTipDetail /> },

    // Catch-all
    { path: "*", element: <NotFound /> },
  ],
  {
    future: { v7_startTransition: true } as any,
  }
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
