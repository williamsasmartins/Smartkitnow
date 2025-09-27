import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from '@/components/ScrollToTop'
import AppErrorBoundary from './components/AppErrorBoundary'

// Páginas principais
import Index from '@/pages/Index'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import ConversionPage from '@/pages/ConversionPage'
import Cookies from '@/pages/Cookies'
import CookieSettings from '@/pages/CookieSettings'
import Privacy from '@/pages/Privacy'
import Terms from '@/pages/Terms'
import NotFound from '@/pages/NotFound'

// Categorias (raiz)
import FinancialCalculators from '@/pages/FinancialCalculators'
import HealthCalculators from '@/pages/HealthCalculators'
import CookingCalculators from '@/pages/CookingCalculators'
import ConversionCalculators from '@/pages/ConversionCalculators'
import ElectricalCalculators from '@/pages/ElectricalCalculators'
import ScienceCalculators from '@/pages/ScienceCalculators'
import TimeCalculators from '@/pages/TimeCalculators'
import TVCalculators from '@/pages/TVCalculators'
import PetsCalculators from '@/pages/PetsCalculators'
import AutomotiveCalculators from '@/pages/AutomotiveCalculators'
import ConstructionCalculators from '@/pages/ConstructionCalculators'

// Subcategorias
import FinancialSubCategory from '@/pages/FinancialSubCategory'
import HealthSubCategory from '@/pages/HealthSubCategory'
import CookingSubCategory from '@/pages/CookingSubCategory'
import ConversionSubCategory from '@/pages/ConversionSubCategory'
import ElectricalSubCategory from '@/pages/ElectricalSubCategory'
import ScienceSubCategory from '@/pages/ScienceSubCategory'
import TimeSubCategory from '@/pages/TimeSubCategory'
import TVSubCategory from '@/pages/TVSubCategory'
import PetsSubCategory from '@/pages/PetsSubCategory'
import ConstructionSubCategory from '@/pages/ConstructionSubCategory'
import AutomotiveSubCategory from '@/pages/AutomotiveSubCategory'

// Página genérica de calculadora
import CalculatorPage from '@/pages/CalculatorPage'

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
            <Route path="/conversion" element={<ConversionPage />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/cookie-settings" element={<CookieSettings />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Categorias raiz */}
            <Route path="/financial" element={<FinancialCalculators />} />
            <Route path="/health" element={<HealthCalculators />} />
            <Route path="/cooking" element={<CookingCalculators />} />
            <Route path="/conversion-calculators" element={<ConversionCalculators />} />
            <Route path="/electrical" element={<ElectricalCalculators />} />
            <Route path="/science" element={<ScienceCalculators />} />
            <Route path="/time" element={<TimeCalculators />} />
            <Route path="/tv" element={<TVCalculators />} />
            <Route path="/pets" element={<PetsCalculators />} />
            <Route path="/automotive" element={<AutomotiveCalculators />} />
            <Route path="/construction" element={<ConstructionCalculators />} />

            {/* Subcategorias */}
            <Route path="/financial/:subcategory" element={<FinancialSubCategory />} />
            <Route path="/health/:subcategory" element={<HealthSubCategory />} />
            <Route path="/cooking/:subcategory" element={<CookingSubCategory />} />
            <Route path="/conversion/:subcategory" element={<ConversionSubCategory />} />
            <Route path="/electrical/:subcategory" element={<ElectricalSubCategory />} />
            <Route path="/science/:subcategory" element={<ScienceSubCategory />} />
            <Route path="/time/:subcategory" element={<TimeSubCategory />} />
            <Route path="/tv/:subcategory" element={<TVSubCategory />} />
            <Route path="/pets/:subcategory" element={<PetsSubCategory />} />
            <Route path="/construction/:subcategory" element={<ConstructionSubCategory />} />
            <Route path="/automotive/:subcategory" element={<AutomotiveSubCategory />} />

            {/* Página de calculadora */}
            <Route path="/:category/:subcategory/calculator/:slug" element={<CalculatorPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppErrorBoundary>
    </>
  )
}
