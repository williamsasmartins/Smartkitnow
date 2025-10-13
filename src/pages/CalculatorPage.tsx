import React, { Suspense } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getEntry } from "@/data/calculatorRegistry";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function useLazyFromLoader(loader: () => Promise<any>, namedExport?: string) {
  const Lazy = React.lazy(async () => {
    const mod = await loader();
    return { default: namedExport ? mod[namedExport] : (mod.default ?? Object.values(mod)[0]) };
  });
  return Lazy;
}

export default function CalculatorPage() {
  const navigate = useNavigate();
  const { category, subcategory, calculator, slug } = useParams();
  const calcSlug = calculator ?? slug;
  const entry = calcSlug ? getEntry(calcSlug) : null;

  if (!entry) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="rounded-2xl border border-border/60 bg-card p-8 text-center">
          <div className="text-2xl font-semibold text-foreground mb-2">Calculator not found</div>
          <p className="text-muted-foreground mb-6">Please go back and choose another one.</p>
          {category && subcategory ? (
            <Button asChild><Link to={`/${category}/${subcategory}`}>Back to {subcategory} calculators</Link></Button>
          ) : (
            <Button onClick={() => navigate("/")}>Go to Home</Button>
          )}
        </div>
      </div>
    );
  }

  const LazyCalc = useLazyFromLoader(entry.loader as any, (entry as any).namedExport);

  return (
    <div className="w-screen max-w-none mx-0 px-0 md:px-0 py-8">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
        <LazyCalc />
      </Suspense>
    </div>
  );
}

