import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
const ConcreteSlab = lazy(() => import("@/components/calculators/ConcreteSlab"));
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
import AutomotiveCalculators from "./pages/AutomotiveCalculators";
import AutomotiveSubCategory from "./pages/AutomotiveSubCategory";
import CalculatorPage from "./pages/CalculatorPage";
import ConstructionCalculators from "./pages/ConstructionCalculators";
import ConstructionSubCategory from "./pages/ConstructionSubCategory";
import ConversionCalculators from "./pages/ConversionCalculators";
import ConversionSubCategory from "./pages/ConversionSubCategory";
import ConversionPage from "./pages/ConversionPage";
import CookingCalculators from "./pages/CookingCalculators";
import CookingSubCategory from "./pages/CookingSubCategory";
import CookingCalculatorPage from "./pages/CookingCalculatorPage";
import ElectricalCalculators from "./pages/ElectricalCalculators";
import ElectricalSubCategory from "./pages/ElectricalSubCategory";
import ElectricalCalculatorPage from "./pages/ElectricalCalculatorPage";
import FinancialCalculators from "./pages/FinancialCalculators";
import FinancialSubCategory from "./pages/FinancialSubCategory";
import FinancialCalculatorPage from "./pages/FinancialCalculatorPage";
import HealthCalculators from "./pages/HealthCalculators";
import HealthSubCategory from "./pages/HealthSubCategory";
import HealthCalculatorPage from "./pages/HealthCalculatorPage";
import IMCCalculator from "@/components/calculators/IMCCalculator";
import MathCalculators from "./pages/MathCalculators";
import MathSubCategory from "./pages/MathSubCategory";
import MathCalculatorPage from "./pages/MathCalculatorPage";
import PetsCalculators from "./pages/PetsCalculators";
import PetsSubCategory from "./pages/PetsSubCategory";
import PetsCalculatorPage from "./pages/PetsCalculatorPage";
import ScienceCalculators from "./pages/ScienceCalculators";
import ScienceSubCategory from "./pages/ScienceSubCategory";
import ScienceCalculatorPage from "./pages/ScienceCalculatorPage";
import TVCalculators from "./pages/TVCalculators";
import TVSubCategory from "./pages/TVSubCategory";
import RecipeCalculators from "./pages/RecipeCalculators";
import RecipeSubCategory from "./pages/RecipeSubCategory";
import RecipePage from "./pages/RecipePage";
import SmartTips from "./pages/SmartTips";
import SmartTipsSubCategory from "./pages/SmartTipsSubCategory";
import SmartTipDetail from "./pages/SmartTipDetail";
import TVCalculatorPage from "./pages/TVCalculatorPage";
import TimeCalculators from "./pages/TimeCalculators";
import TimeSubCategory from "./pages/TimeSubCategory";
import TimeCalculatorPage from "./pages/TimeCalculatorPage";

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
            <Route path="/health/calculator/imc" element={<IMCCalculator />} />
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/cookie-settings" element={<CookieSettings />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/automotive" element={<AutomotiveCalculators />} />
            <Route path="/automotive/:subcategory" element={<AutomotiveSubCategory />} />
            <Route path="/automotive/:subcategory/:calculator" element={<CalculatorPage />} />
            <Route path="/construction" element={<ConstructionCalculators />} />
            <Route path="/construction/:subcategory" element={<ConstructionSubCategory />} />
            <Route path="/construction/:subcategory/:calculator" element={<CalculatorPage />} />
            <Route path="/construction/calculator/concrete-slab" element={
            <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10">Loading…</div>}>
            <ConcreteSlab />
            </Suspense>
             }
            />
            <Route path="/conversion" element={<ConversionCalculators />} />
            <Route path="/conversion/:subcategory" element={<ConversionSubCategory />} />
            <Route path="/conversion/:subcategory/:calculator" element={<CalculatorPage />} />
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
            <Route path="/health/calculator/imc-calculator" element={<IMCCalculator />} />
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

            {/* TV & Video Calculator routes */}
            <Route path="/tv" element={<TVCalculators />} />
            <Route path="/tv/:subcategory" element={<TVSubCategory />} />
            <Route path="/tv/calculator/:calculator" element={<TVCalculatorPage />} />
            <Route path="/recipes" element={<RecipeCalculators />} />
            <Route path="/recipes/:subcategory" element={<RecipeSubCategory />} />
            <Route path="/recipe/:recipeSlug" element={<RecipePage />} />
            <Route path="/smart-tips" element={<SmartTips />} />
            <Route path="/smart-tips/:subcategory" element={<SmartTipsSubCategory />} />
            <Route path="/smart-tip/:slug" element={<SmartTipDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
