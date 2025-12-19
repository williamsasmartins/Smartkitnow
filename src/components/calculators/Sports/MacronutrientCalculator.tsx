import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

export default function MacronutrientCalculator() {
  const widget = (
    <div className="p-6 text-center">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Sports Macronutrient calculator will be available soon.
      </p>
    </div>
  );
  const editorial = <div className="p-4" />;
  return (
    <CalculatorVerticalLayout
      title="Macronutrient Calculator (Sports)"
      description="Plan macros for athletic performance."
      widget={widget}
      editorial={editorial}
      onThisPage={[]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
