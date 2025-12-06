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
  const isPetsCategory = (category ?? "").toLowerCase() === "pets";
  const isFinancialCategory = (category ?? "").toLowerCase() === "financial";
  const isDogCalorie = calcSlug === "dog-calorie-needs-rer-mer";
  
  // "Pets" layout (special header offset) applies if it's a pets category AND NOT the dog calorie calculator
  const isPets = isPetsCategory && !isDogCalorie;
  
  // "Wide" layout (max-w-none) applies if it's the dog calorie calculator or any financial calculator
  const isWide = isDogCalorie || isFinancialCategory;
  
  const entry = calcSlug ? getEntry(calcSlug) : null;

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl px-4 lg:px-6 py-10">
        {/* Removed Back button */}
        <h1 className="text-2xl font-bold text-[#5c82ee]">Calculator not found</h1>
        <p className="mt-2 text-muted-foreground">We couldn't find this calculator. Please use the site menu.</p>
      </div>
    );
  }

  const LazyCalc = useLazyFromLoader(entry.loader, entry.namedExport);

  // For the wide layout (Dog Calorie), we want symmetric padding to ensure centering.
  // For others, we keep the existing asymmetric padding.
  const containerClasses = isWide 
    ? "w-full px-4 md:px-8 lg:px-10" 
    : (isPets ? "w-full pl-4 pr-4 md:pl-8 lg:pl-10 xl:pl-14 mt-[156px] md:mt-[176px]" : "w-full pl-4 pr-4 md:pl-8 lg:pl-10 xl:pl-14");

  return (
    <div className={containerClasses}>
      <div className={isPets || isWide ? "max-w-none" : "max-w-[864px]"}>
        {/* Removed Back button */}
        <Suspense fallback={<div className="py-10 text-muted-foreground">Loading…</div>}>
          {isPets ? (
            <main className="min-w-0">
              <LazyCalc />
            </main>
          ) : (
            <main className="min-w-0 sticky self-start" style={{ top: 88 }}>
              <LazyCalc />
            </main>
          )}
        </Suspense>
      </div>
    </div>
  );
}




