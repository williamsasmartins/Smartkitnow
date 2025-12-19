import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

export default function CalorieDeficitSurplusCalculator() {
  const widget = (
    <div className="p-6 text-center">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Sports Calorie Deficit/Surplus calculator will be available soon.
      </p>
    </div>
  );
  const editorial = <div className="p-4" />;
  return (
    <CalculatorVerticalLayout
      title="Calorie Deficit / Surplus Calculator"
      description="Plan calorie adjustments for training cycles."
      widget={widget}
      editorial={editorial}
      onThisPage={[]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
