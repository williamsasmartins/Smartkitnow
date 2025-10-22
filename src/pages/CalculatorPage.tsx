import React, { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getEntry } from "@/data/calculatorRegistry";

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
  const calcSlug = (calculator ?? slug ?? "").toLowerCase();
  const entry = calcSlug ? getEntry(calcSlug) : null;

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl px-4 lg:px-6 py-10">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-[#5c82ee]">Calculator not found</h1>
        <p className="mt-2 text-muted-foreground">We couldn't find this calculator. Please use the back button or the site menu.</p>
      </div>
    );
  }

  const LazyCalc = useLazyFromLoader(entry.loader, entry.namedExport);

  return (
    <div className="w-full overflow-visible">
      {/* Top row (Back button) — match the main grid container width */}
      <div className="mx-auto max-w-[864px] px-4 pt-6 pb-2">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      {/* Calculator body — the calculator component should render its own hero + 3-col grid + sticky */}
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 lg:px-6 py-10 text-muted-foreground">Loading…</div>}>
        <LazyCalc />
      </Suspense>
    </div>
  );
}

