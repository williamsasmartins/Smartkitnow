import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
const ConcreteSlab = lazy(() => import("@/components/calculators/construction/ConcreteSlab"));
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import CookieSettings from "./pages/CookieSettings";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
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
import RecipeCalculators from "./pages/RecipeCalculators";
import RecipeSubCategory from "./pages/RecipeSubCategory";
import RecipePage from "./pages/RecipePage";
import SmartTips from "./pages/SmartTips";
import SmartTipsSubCategory from "./pages/SmartTipsSubCategory";
import SmartTipDetail from "./pages/SmartTipDetail";
import TVCalculators from "./pages/categories/TVCalculators";
import TVSubCategory from "./pages/categories/TVSubCategory";
import TVCalculatorPage from "./pages/calculatorPages/TVCalculatorPage";
import TimeCalculators from "./pages/categories/TimeCalculators";
import TimeSubCategory from "./pages/categories/TimeSubCategory";
import TimeCalculatorPage from "./pages/calculatorPages/TimeCalculatorPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/about", element: <About /> },
  { path: "/terms", element: <Terms /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/cookies", element: <Cookies /> },
  { path: "/cookie-settings", element: <CookieSettings /> },
  { path: "/contact", element: <Contact /> },
  { path: "/automotive", element: <AutomotiveCalculators /> },
  { path: "/automotive/:subcategory", element: <AutomotiveSubCategory /> },
  { path: "/construction", element: <ConstructionCalculators /> },
  { path: "/construction/:subcategory", element: <ConstructionSubCategory /> },
  { path: "/construction/calculator/concrete-slab", element: (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10">Loading…</div>}>
      <ConcreteSlab />
    </Suspense>
  ) },
  { path: "/conversion", element: <ConversionCalculators /> },
  { path: "/conversion/:subcategory", element: <ConversionSubCategory /> },
  { path: "/calculator/:conversionKey", element: <ConversionPage /> },
  { path: "/cooking", element: <CookingCalculators /> },
  { path: "/cooking/:subcategory", element: <CookingSubCategory /> },
  { path: "/cooking/:subcategory/:calculator", element: <CookingCalculatorPage /> },
  { path: "/electrical", element: <ElectricalCalculators /> },
  { path: "/electrical/:subcategory", element: <ElectricalSubCategory /> },
  { path: "/electrical/:subcategory/:calculator", element: <ElectricalCalculatorPage /> },
  { path: "/financial", element: <FinancialCalculators /> },
  { path: "/financial/:subcategory", element: <FinancialSubCategory /> },
  { path: "/financial/calculator/:calculator", element: <FinancialCalculatorPage /> },
  { path: "/health", element: <HealthCalculators /> },
  { path: "/health/:subcategory", element: <HealthSubCategory /> },
  { path: "/health/calculator/:calculator", element: <HealthCalculatorPage /> },
  { path: "/math", element: <MathCalculators /> },
  { path: "/math/:subcategory", element: <MathSubCategory /> },
  { path: "/math/calculator/:calculator", element: <MathCalculatorPage /> },
  { path: "/pets", element: <PetsCalculators /> },
  { path: "/pets/:subcategory", element: <PetsSubCategory /> },
  { path: "/pets/calculator/:calculator", element: <PetsCalculatorPage /> },
  { path: "/science", element: <ScienceCalculators /> },
  { path: "/science/:subcategory", element: <ScienceSubCategory /> },
  { path: "/science/calculator/:calculator", element: <ScienceCalculatorPage /> },
  { path: "/time", element: <TimeCalculators /> },
  { path: "/time/:subcategory", element: <TimeSubCategory /> },
  { path: "/time/calculator/:calculator", element: <TimeCalculatorPage /> },
  { path: "/tv", element: <TVCalculators /> },
  { path: "/tv/:subcategory", element: <TVSubCategory /> },
  { path: "/tv/calculator/:calculator", element: <TVCalculatorPage /> },
  { path: "/recipes", element: <RecipeCalculators /> },
  { path: "/recipes/:subcategory", element: <RecipeSubCategory /> },
  { path: "/recipe/:recipeSlug", element: <RecipePage /> },
  { path: "/smart-tips", element: <SmartTips /> },
  { path: "/smart-tips/:subcategory", element: <SmartTipsSubCategory /> },
  { path: "/smart-tip/:slug", element: <SmartTipDetail /> },
  { path: "*", element: <NotFound /> },
], {
  // @ts-ignore - Ignora o erro de tipo temporariamente (flag válida no runtime)
  future: { v7_startTransition: true },
});

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
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;