import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
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
            <Route path="/automotive/:subcategory/:calculator" element={<CalculatorPage />} />
            <Route path="/construction" element={<ConstructionCalculators />} />
            <Route path="/construction/:subcategory" element={<ConstructionSubCategory />} />
            <Route path="/construction/:subcategory/:calculator" element={<CalculatorPage />} />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
