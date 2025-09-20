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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
