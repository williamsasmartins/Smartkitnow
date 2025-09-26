import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/cookie-settings" element={<CookieSettings />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/automotive" element={<AutomotiveCalculators />} />
            <Route path="/automotive/:subcategory" element={<AutomotiveSubCategory />} />
            <Route path="/construction" element={<ConstructionCalculators />} />
            <Route path="/construction/:subcategory" element={<ConstructionSubCategory />} />
            <Route path="/construction/calculator/concrete-slab" element={
              <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10">Loading…</div>}>
                <ConcreteSlab />
              </Suspense>
            } />
            <Route path="/conversion" element={<ConversionCalculators />} />
            <Route path="/conversion/:subcategory" element={<ConversionSubCategory />} />
            <Route path="/calculator/:conversionKey" element={<ConversionPage />} />
            <Route path="/cooking" element={<CookingCalculators />} />
            <Route path="/cooking/:subcategory" element={<CookingSubCategory />} />
            <Route path="/cooking/:subcategory/:calculator" element={<CookingCalculatorPage />} />
            <Route path="/electrical" element={<ElectricalCalculators />} />
            <Route path="/electrical/:subcategory" element={<ElectricalSubCategory />} />
            <Route path="/electrical/:subcategory/:calculator" element={<ElectricalCalculatorPage />} />
            <Route path="/financial" element={<FinancialCalculators />} />
            <Route path="/financial/:subcategory" element={<FinancialSubCategory />} />
            <Route path="/financial/calculator/:calculator" element={<FinancialCalculatorPage />} />
            <Route path="/health" element={<HealthCalculators />} />
            <Route path="/health/:subcategory" element={<HealthSubCategory />} />
            <Route path="/health/calculator/:calculator" element={<HealthCalculatorPage />} />
            <Route path="/math" element={<MathCalculators />} />
            <Route path="/math/:subcategory" element={<MathSubCategory />} />
            <Route path="/math/calculator/:calculator" element={<MathCalculatorPage />} />
            <Route path="/pets" element={<PetsCalculators />} />
            <Route path="/pets/:subcategory" element={<PetsSubCategory />} />
            <Route path="/pets/calculator/:calculator" element={<PetsCalculatorPage />} />
            <Route path="/science" element={<ScienceCalculators />} />
            <Route path="/science/:subcategory" element={<ScienceSubCategory />} />
            <Route path="/science/calculator/:calculator" element={<ScienceCalculatorPage />} />
            <Route path="/time" element={<TimeCalculators />} />
            <Route path="/time/:subcategory" element={<TimeSubCategory />} />
            <Route path="/time/calculator/:calculator" element={<TimeCalculatorPage />} />
            <Route path="/tv" element={<TVCalculators />} />
            <Route path="/tv/:subcategory" element={<TVSubCategory />} />
            <Route path="/tv/calculator/:calculator" element={<TVCalculatorPage />} />
            <Route path="/recipes" element={<RecipeCalculators />} />
            <Route path="/recipes/:subcategory" element={<RecipeSubCategory />} />
            <Route path="/recipe/:recipeSlug" element={<RecipePage />} />
            <Route path="/smart-tips" element={<SmartTips />} />
            <Route path="/smart-tips/:subcategory" element={<SmartTipsSubCategory />} />
            <Route path="/smart-tip/:slug" element={<SmartTipDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;