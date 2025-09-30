// src/App.tsx
import { Suspense } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import AppErrorBoundary from "@/components/AppErrorBoundary";

// Páginas principais
import Index from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Cookies from "@/pages/Cookies";
import CookieSettings from "@/pages/CookieSettings";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";
import MathCalculators from '@/pages/MathCalculators';
import MathSubCategory from '@/pages/MathSubCategory';
import MathComingSoon from '@/pages/MathComingSoon';
import EverydayMath from "@/pages/math/EverydayMath";
import PercentageCalculators from "@/pages/math/PercentageCalculators";
import FractionsCalculators from "@/pages/math/FractionsCalculators";




// Categorias (raiz)
import FinancialCalculators from "@/pages/FinancialCalculators";
import HealthCalculators from "@/pages/HealthCalculators";
import CookingCalculators from "@/pages/CookingCalculators";
import ConversionCalculators from "@/pages/ConversionCalculators";
import ElectricalCalculators from "@/pages/ElectricalCalculators";
import ScienceCalculators from "@/pages/ScienceCalculators";
import TimeCalculators from "@/pages/TimeCalculators";
import TVCalculators from "@/pages/TVCalculators";
import PetsCalculators from "@/pages/PetsCalculators";
import AutomotiveCalculators from "@/pages/AutomotiveCalculators";
import ConstructionCalculators from "@/pages/ConstructionCalculators";


// Subcategorias
import FinancialSubCategory from "@/pages/FinancialSubCategory";
import HealthSubCategory from "@/pages/HealthSubCategory";
import CookingSubCategory from "@/pages/CookingSubCategory";
import ConversionSubCategory from "@/pages/ConversionSubCategory";
import ElectricalSubCategory from "@/pages/ElectricalSubCategory";
import ScienceSubCategory from "@/pages/ScienceSubCategory";
import TimeSubCategory from "@/pages/TimeSubCategory";
import TVSubCategory from "@/pages/TVSubCategory";
import PetsSubCategory from "@/pages/PetsSubCategory";
import ConstructionSubCategory from "@/pages/ConstructionSubCategory";
import AutomotiveSubCategory from "@/pages/AutomotiveSubCategory";

// Páginas de hubs de conversão (se você as usa)
import PopularConvertersPage from "@/pages/PopularConvertersPage";
import CookingBakingConvertersPage from "@/pages/CookingBakingConvertersPage";
import CommonConvertersPage from "@/pages/CommonConvertersPage";

// Página genérica de calculadora
import CalculatorPage from "@/pages/CalculatorPage";

// Conversor genérico (se você usa atalhos /conversion/:group/:slug)
import ConverterPage from "@/pages/ConverterPage";

// Redireciona rotas antigas /calculator/:slug -> formato curto
function LegacyCalcRedirect() {
  const { category, subcategory, slug } = useParams();
  return <Navigate to={`/${category}/${subcategory}/${slug}`} replace />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <AppErrorBoundary>
        <Suspense fallback={null}>
          <Routes>
            {/* Home & institucionais */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/cookie-settings" element={<CookieSettings />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Categorias raiz */}
            <Route path="/construction" element={<ConstructionCalculators />} />
            <Route path="/financial" element={<FinancialCalculators />} />
            <Route path="/health" element={<HealthCalculators />} />
            <Route path="/cooking" element={<CookingCalculators />} />
            <Route path="/conversion" element={<ConversionCalculators />} />
            <Route path="/electrical" element={<ElectricalCalculators />} />
            <Route path="/science" element={<ScienceCalculators />} />
            <Route path="/time" element={<TimeCalculators />} />
            <Route path="/tv" element={<TVCalculators />} />
            <Route path="/pets" element={<PetsCalculators />} />
            <Route path="/automotive" element={<AutomotiveCalculators />} />
            <Route path="/math" element={<MathCalculators />} />


            {/* Subcategorias (todas as seções) */}
            <Route path="/construction/:subcategory" element={<ConstructionSubCategory />} />
            <Route path="/financial/:subcategory" element={<FinancialSubCategory />} />
            <Route path="/health/:subcategory" element={<HealthSubCategory />} />
            <Route path="/cooking/:subcategory" element={<CookingSubCategory />} />
            <Route path="/conversion/:subcategory" element={<ConversionSubCategory />} />
            <Route path="/electrical/:subcategory" element={<ElectricalSubCategory />} />
            <Route path="/science/:subcategory" element={<ScienceSubCategory />} />
            <Route path="/time/:subcategory" element={<TimeSubCategory />} />
            <Route path="/tv/:subcategory" element={<TVSubCategory />} />
            <Route path="/pets/:subcategory" element={<PetsSubCategory />} />
            <Route path="/automotive/:subcategory" element={<AutomotiveSubCategory />} />
            <Route path="/math/everyday-math" element={<EverydayMath />} />   
            <Route path="/math/everyday-math/percentages" element={<PercentageCalculators />} />
            <Route path="/math/:subcategory" element={<MathSubCategory />} /> 
            <Route path="/math/fractions" element={<FractionsCalculators />} />
            <Route path="/math/coming-soon" element={<MathComingSoon />} />




            {/* Hubs de conversão específicos (se estiverem criados) */}
            <Route path="/conversion/popular" element={<PopularConvertersPage />} />
            <Route path="/conversion/cooking-baking" element={<CookingBakingConvertersPage />} />
            <Route path="/conversion/common" element={<CommonConvertersPage />} />
            {/* Atalhos: /conversion/:group/:slug */}
            <Route path="/conversion/:group/:slug" element={<ConverterPage />} />

            {/* Calculadora — formato curto */}
            <Route path="/:category/:subcategory/:slug" element={<CalculatorPage />} />

            {/* Legado -> redireciona */}
            <Route
              path="/:category/:subcategory/calculator/:slug"
              element={<LegacyCalcRedirect />}
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppErrorBoundary>
    </>
  );
}
