import { useParams, useNavigate } from 'react-router-dom'
import React, { Suspense, useMemo } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CalculatorFooter } from '@/components/CalculatorFooter'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calculator } from 'lucide-react'
import { getEntry, FRIENDLY_TITLES } from '@/data/calculatorRegistry'

function lazyFrom(entry?: { loader: () => Promise<any>; namedExport?: string }) {
  if (!entry) return null
  return React.lazy(async () => {
    const mod = await entry.loader()
    const Comp =
      (entry.namedExport ? (mod as any)[entry.namedExport] : (mod as any).default) as
        | React.ComponentType<any>
        | undefined
    if (!Comp) {
      const first = mod && Object.values(mod)[0]
      if (!first || typeof first !== 'function') throw new Error('Component not found')
      return { default: first as React.ComponentType<any> }
    }
    return { default: Comp }
  })
}

function titleCaseFromSlug(slug?: string) {
  if (!slug) return ''
  return slug.split('-').map(w => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ')
}

export default function CalculatorPage() {
  const navigate = useNavigate()
  const { category = '', subcategory = '', slug = '' } =
    useParams<{ category: string; subcategory: string; slug: string }>()

  const entry = getEntry(slug)
  const LazyComp = useMemo(() => lazyFrom(entry), [entry])

  const goBack = () => navigate(`/${category}/${subcategory}`)

  const NotFoundCalc = (
    <Card className="bg-card border-border/50">
      <CardContent className="p-8">
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <Calculator className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Calculator not found</h3>
          <p className="text-muted-foreground">Please go back and choose another one.</p>
          <div className="mt-6">
            <Button onClick={goBack}>
              Back to {FRIENDLY_TITLES[category] || titleCaseFromSlug(subcategory)}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button variant="ghost" size="sm" onClick={goBack} className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex flex-col items-center text-center space-y-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {entry?.name ?? 'Calculator'}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Category: {FRIENDLY_TITLES[category] || titleCaseFromSlug(category)}
                  {subcategory ? ` · ${titleCaseFromSlug(subcategory)}` : ''}
                </p>
              </div>
            </div>
          </div>

          {entry && LazyComp ? (
            <Suspense fallback={<div className="text-center py-10">Loading…</div>}>
              <LazyComp />
            </Suspense>
          ) : (
            NotFoundCalc
          )}

          <CalculatorFooter
            calculatorName={entry?.name ?? 'Calculator'}
            description={
              entry
                ? `This tool estimates key values for ${entry.name.toLowerCase()}.`
                : 'This tool estimates key values.'
            }
            formula={
              entry?.name?.toLowerCase().includes('concrete')
                ? 'Volume = Length × Width × Thickness.'
                : 'Result = (Variable1 × Variable2) / Constant'
            }
            sources={[
              { title: 'ASTM / ACI', url: 'https://www.astm.org' },
              { title: 'NIST Engineering Handbook', url: 'https://www.nist.gov' },
            ]}
          />
        </section>
      </main>
      <Footer />
    </div>
  )
}
