// /src/App.tsx
import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import RedirectLegacyCalc from "@/routes/RedirectLegacyCalc";

// Pages básicas
import Index from "./pages/Index";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import CookieSettings from "./pages/CookieSettings";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Categorias e Subcategorias (as suas atuais)
import AutomotiveCalculators from "./pages/categories/AutomotiveCalculators";
import AutomotiveSubCategory from "./pages/categories/AutomotiveSubCategory";
import ConstructionCalculators from "./pages/categories/ConstructionCalculators";
import ConstructionSubCategory from "./pages/categories/ConstructionSubCategory";
import ConversionCalculators from "./pages/categories/ConversionCalculators";
import ConversionSubCategory from "./pages/categories/ConversionSubCategory";
import CookingCalculators from "./pages/categories/CookingCalculators";
import CookingSubCategory from "./pages/categories/CookingSubCategory";
import ElectricalCalculators from "./pages/categories/ElectricalCalculators";
import ElectricalSubCategory from "./pages/categories/ElectricalSubCategory";
import FinancialCalculators from "./pages/categories/FinancialCalculators";
import FinancialSubCategory from "./pages/categories/FinancialSubCategory";
import HealthCalculators from "./pages/categories/HealthCalculators";
import HealthSubCategory from "./pages/categories/HealthSubCategory";
import MathCalculators from "./pages/categories/MathCalculators";
import MathSubCategory from "./pages/categories/MathSubCategory";
import PetsCalculators from "./pages/categories/PetsCalculators";
import PetsSubCategory from "./pages/categories/PetsSubCategory";
import ScienceCalculators from "./pages/categories/ScienceCalculators";
import ScienceSubCategory from "./pages/categories/ScienceSubCategory";
import TVCalculators from "./pages/categories/TVCalculators";
import TVSubCategory from "./pages/categories/TVSubCategory";
import TimeCalculators from "./pages/categories/TimeCalculators";
import TimeSubCategory from "./pages/categories/TimeSubCategory";

// Conversion page genérica que você já usa
import ConversionPage from "./pages/ConversionPage";

// Página genérica para TODAS as calculadoras
import GenericCalculatorPage from "./pages/calculatorPages/GenericCalculatorPage";

// Exemplo lazy (concrete slab)
const ConcreteSlab = lazy(() => import("@/components/calculators/construction/ConcreteSlab"));

const queryClient = new QueryClient();

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        // Básicas
        { index: true, element: <Index /> },
        { path: "about", element: <About /> },
        { path: "terms", element: <Terms /> },
        { path: "privacy", element: <Privacy /> },
        { path: "cookies", element: <Cookies /> },
        { path: "cookie-settings", element: <CookieSettings /> },
        { path: "contact", element: <Contact /> },

        // Automotive
        { path: "automotive", element: <AutomotiveCalculators /> },
        { path: "automotive/:subcategory", element: <AutomotiveSubCategory /> },
        { path: "automotive/:subcategory/:calculator", element: <GenericCalculatorPage /> },
        { path: "automotive/:subcategory/calculator/:calculator", element: <RedirectLegacyCalc base="automotive" /> },

        // Construction
        { path: "construction", element: <ConstructionCalculators /> },
        { path: "construction/:subcategory", element: <ConstructionSubCategory /> },
        {
          path: "construction/:subcategory/concrete-slab",
          element: (
            <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10">Loading…</div>}>
              <ConcreteSlab />
            </Suspense>
          ),
        },

        // Conversion
        { path: "conversion", element: <ConversionCalculators /> },
        { path: "conversion/:subcategory", element: <ConversionSubCategory /> },
        { path: "conversion/:subcategory/:conversionKey", element: <ConversionPage /> },

        // Cooking
        { path: "cooking", element: <CookingCalculators /> },
        { path: "cooking/:subcategory", element: <CookingSubCategory /> },
        { path: "cooking/:subcategory/:calculator", element: <GenericCalculatorPage /> },
        { path: "cooking/:subcategory/calculator/:calculator", element: <RedirectLegacyCalc base="cooking" /> },

        // Electrical
        { path: "electrical", element: <ElectricalCalculators /> },
        { path: "electrical/:subcategory", element: <ElectricalSubCategory /> },
        { path: "electrical/:subcategory/:calculator", element: <GenericCalculatorPage /> },
        { path: "electrical/:subcategory/calculator/:calculator", element: <RedirectLegacyCalc base="electrical" /> },

        // Financial
        { path: "financial", element: <FinancialCalculators /> },
        { path: "financial/:subcategory", element: <FinancialSubCategory /> },
        { path: "financial/:subcategory/:calculator", element: <GenericCalculatorPage /> },
        { path: "financial/:subcategory/calculator/:calculator", element: <RedirectLegacyCalc base="financial" /> },

        // Health
        { path: "health", element: <HealthCalculators /> },
        { path: "health/:subcategory", element: <HealthSubCategory /> },
        { path: "health/:subcategory/:calculator", element: <GenericCalculatorPage /> },
        { path: "health/:subcategory/calculator/:calculator", element: <RedirectLegacyCalc base="health" /> },

        // Math
        { path: "math", element: <MathCalculators /> },
        { path: "math/:subcategory", element: <MathSubCategory /> },
        { path: "math/:subcategory/:calculator", element: <GenericCalculatorPage /> },
        { path: "math/:subcategory/calculator/:calculator", element: <RedirectLegacyCalc base="math" /> },

        // Pets
        { path: "pets", element: <PetsCalculators /> },
        { path: "pets/:subcategory", element: <PetsSubCategory /> },
        { path: "pets/:subcategory/:calculator", element: <GenericCalculatorPage /> },
        { path: "pets/:subcategory/calculator/:calculator", element: <RedirectLegacyCalc base="pets" /> },

        // Science
        { path: "science", element: <ScienceCalculators /> },
        { path: "science/:subcategory", element: <ScienceSubCategory /> },
        { path: "science/:subcategory/:calculator", element: <GenericCalculatorPage /> },
        { path: "science/:subcategory/calculator/:calculator", element: <RedirectLegacyCalc base="science" /> },

        // Time
        { path: "time", element: <TimeCalculators /> },
        { path: "time/:subcategory", element: <TimeSubCategory /> },
        { path: "time/:subcategory/:calculator", element: <GenericCalculatorPage /> },
        { path: "time/:subcategory/calculator/:calculator", element: <RedirectLegacyCalc base="time" /> },

        // TV
        { path: "tv", element: <TVCalculators /> },
        { path: "tv/:subcategory", element: <TVSubCategory /> },
        { path: "tv/:subcategory/:calculator", element: <GenericCalculatorPage /> },
        { path: "tv/:subcategory/calculator/:calculator", element: <RedirectLegacyCalc base="tv" /> },

        // 404
        { path: "*", element: <NotFound /> },
      ],
      errorElement: <RouteErrorBoundary />,
    },
  ],
  { future: { v7_startTransition: true } as any }
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouteErrorBoundary>
          <RouterProvider router={router} />
        </RouteErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
