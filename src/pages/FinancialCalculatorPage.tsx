import { useMemo } from "react";
import CategoryPageTemplate from "@/components/layouts/CategoryPageTemplate";
import { buildSectionsForCategory } from "@/data/categorySections";
import CalculatorListBlue from "@/components/common/CalculatorListBlue";

const FinancialCalculatorPage = () => {
  const sections = useMemo(() => {
    const built = buildSectionsForCategory("financial", {
      shortPaths: true,
      subcategoryIconMap: {
        "personal-finance-calculators": "💰",
        "interest-and-loan-calculators": "💳",
        "mortgage-and-home-loan-calculators": "🏠",
        "investment-calculators": "📈",
        "general": "📊",
      },
    });
    // Merge "Loan Calculators" into "Interest And Loan Calculators" and remove the former
    const loanIdx = built.findIndex((s) => s.title.toLowerCase() === "loan calculators");
    const interestIdx = built.findIndex((s) => s.title.toLowerCase() === "interest and loan calculators");
    if (loanIdx !== -1) {
      const loanItems = built[loanIdx].items || [];
      if (interestIdx !== -1) {
        built[interestIdx] = { ...built[interestIdx], items: [...built[interestIdx].items, ...loanItems] };
      } else {
        built.push({ icon: "💳", title: "Interest And Loan Calculators", items: loanItems });
      }
      built.splice(loanIdx, 1);
    }
    return built;
  }, []);

  const intro = (
    <div className="space-y-3">
      <p>
        Put your finances on track with reliable calculators. Whether you’re a market professional, a small business owner, an aspiring investor or just someone who wants to balance the household budget, our financial tools help you make informed choices. Need to compare loans and mortgages? Plan for retirement? Calculate investment returns or tax impacts? Here you’ll find clear and accurate formulas — from compound interest and ROI to cash flow and profit margins.
      </p>
      <p>
        Every calculator is based on established methods and designed to simplify complex tasks: simulate different financing scenarios, project your future wealth with our retirement calculators, estimate monthly payments and total costs before buying a car or a home. By bringing numerous applications into one place, we make life easier for anyone looking to organise personal finances or optimise business management. Browse the sections below to find the right tool for you and turn numbers into smart decisions.
      </p>
    </div>
  );

  // Blue-line lists: define items and split into two columns
  const taxIncomeItems = [
    { to: "/financial/tax-income-calculators/take-home-pay", title: "Take-Home Pay Calculator" },
    { to: "/financial/tax-income-calculators/income-tax-estimator", title: "Income Tax Estimator" },
    { to: "/financial/tax-income-calculators/salary-after-tax", title: "Salary After-Tax Calculator" },
    { to: "/financial/tax-income-calculators/freelancer-income", title: "Freelancer Income Calculator" },
    { to: "/financial/tax-income-calculators/effective-tax-rate", title: "Effective Tax Rate Calculator" },
  ];
  const taxIncomeMid = Math.ceil(taxIncomeItems.length / 2);
  const taxIncomeLeft = taxIncomeItems.slice(0, taxIncomeMid);
  const taxIncomeRight = taxIncomeItems.slice(taxIncomeMid);

  const businessProfitItems = [
    { to: "/financial/business-profit-calculators/break-even-point", title: "Break-Even Point Calculator" },
    { to: "/financial/business-profit-calculators/markup-margin", title: "Markup & Margin Calculator" },
    { to: "/financial/business-profit-calculators/operating-cost", title: "Operating Cost Calculator" },
    { to: "/financial/business-profit-calculators/revenue-growth", title: "Revenue Growth Calculator" },
    { to: "/financial/business-profit-calculators/employee-cost", title: "Employee Cost Calculator" },
  ];
  const businessMid = Math.ceil(businessProfitItems.length / 2);
  const businessLeft = businessProfitItems.slice(0, businessMid);
  const businessRight = businessProfitItems.slice(businessMid);

  const debtCreditItems = [
    { to: "/financial/debt-credit-calculators/debt-snowball", title: "Debt Snowball Calculator" },
    { to: "/financial/debt-credit-calculators/credit-score-impact", title: "Credit Score Impact Calculator" },
    { to: "/financial/debt-credit-calculators/loan-consolidation", title: "Loan Consolidation Calculator" },
    { to: "/financial/debt-credit-calculators/interest-savings", title: "Interest Savings Calculator" },
  ];
  const debtMid = Math.ceil(debtCreditItems.length / 2);
  const debtLeft = debtCreditItems.slice(0, debtMid);
  const debtRight = debtCreditItems.slice(debtMid);

  const currencyInflationItems = [
    { to: "/financial/currency-inflation-calculators/currency-converter", title: "Currency Converter" },
    { to: "/financial/currency-inflation-calculators/inflation-rate", title: "Inflation Rate Calculator" },
    { to: "/financial/currency-inflation-calculators/purchasing-power", title: "Purchasing Power Calculator" },
    { to: "/financial/currency-inflation-calculators/future-value", title: "Future Value Calculator" },
  ];
  const currencyMid = Math.ceil(currencyInflationItems.length / 2);
  const currencyLeft = currencyInflationItems.slice(0, currencyMid);
  const currencyRight = currencyInflationItems.slice(currencyMid);

  const moreFinancialItems = [
    { to: "/financial/tax-income-calculators", title: "Tax & Income Calculators" },
    { to: "/financial/business-profit-calculators", title: "Business & Profit Calculators" },
    { to: "/financial/debt-credit-calculators", title: "Debt & Credit Calculators" },
  ];

  // Contagem adicional de calculadoras renderizadas nas listas extras abaixo das seções
  const additionalItemCount = taxIncomeItems.length + businessProfitItems.length + debtCreditItems.length + currencyInflationItems.length;

  return (
    <CategoryPageTemplate
      title="Financial Calculators"
      intro={intro}
      sections={sections}
      showTopBanner={true}
      showRightRail={true}
      additionalItemCount={additionalItemCount}
      recommendedFooter={(
        <div className="category-footer space-y-6">
          {/* New H2 sections after existing subcategories */}
          <div className="space-y-6 pt-2">
            {/* Tax & Income Calculators */}
            <div>
              <h2 className="text-[24px] font-semibold text-foreground mb-3">🧾 Tax & Income Calculators <span className="text-sm font-normal text-muted-foreground">(5)</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CalculatorListBlue items={taxIncomeLeft} />
                <CalculatorListBlue items={taxIncomeRight} />
              </div>
            </div>

            {/* Business & Profit Calculators */}
            <div>
              <h2 className="text-[24px] font-semibold text-foreground mb-3">💼 Business & Profit Calculators <span className="text-sm font-normal text-muted-foreground">(5)</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CalculatorListBlue items={businessLeft} />
                <CalculatorListBlue items={businessRight} />
              </div>
            </div>

            {/* Debt & Credit Calculators */}
            <div>
              <h2 className="text-[24px] font-semibold text-foreground mb-3">💳 Debt & Credit Calculators <span className="text-sm font-normal text-muted-foreground">(4)</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CalculatorListBlue items={debtLeft} />
                <CalculatorListBlue items={debtRight} />
              </div>
            </div>

            {/* Currency & Inflation Calculators */}
            <div>
              <h2 className="text-[24px] font-semibold text-foreground mb-3">💱 Currency & Inflation Calculators <span className="text-sm font-normal text-muted-foreground">(4)</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CalculatorListBlue items={currencyLeft} />
                <CalculatorListBlue items={currencyRight} />
              </div>
            </div>
          </div>

          {/* Footer inside Financial page (internal links) */}
          <div className="mt-10 pt-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">🧰 More Financial Tools <span className="text-sm font-normal text-muted-foreground">(3)</span></h2>
            <CalculatorListBlue items={moreFinancialItems} />
          </div>
        </div>
      )}
    />
  );
};

export default FinancialCalculatorPage;