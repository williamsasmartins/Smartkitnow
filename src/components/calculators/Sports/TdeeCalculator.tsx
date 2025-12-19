import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

export default function TdeeCalculator() {
  const widget = (
    <div className="p-6 text-center">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Sports TDEE calculator will be available soon.
      </p>
    </div>
  );
  const editorial = <div className="p-4" />;
  return (
    <CalculatorVerticalLayout
      title="TDEE Calculator (Sports)"
      description="Estimate athletic daily energy needs."
      widget={widget}
      editorial={editorial}
      onThisPage={[]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
