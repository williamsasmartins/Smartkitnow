import { CategorySection } from "@/components/layouts/CategoryPageTemplate";

export const FINANCIAL_TITLE = "Financial Calculators";

export const FINANCIAL_DESCRIPTION =
  "Plan loans, investments, and personal budgets with clear, transparent math. Compare rates, project returns, estimate taxes, and make confident money decisions.";

export const FINANCIAL_SECTIONS: CategorySection[] = [
  {
    heading: "Interest & Loan Calculators",
    items: [
      { title: "Simple Interest", to: "/financial/simple-interest" },
      { title: "Compound Interest", to: "/financial/compound-interest" },
      { title: "Loan Amortization", to: "/financial/loan-amortization" },
      { title: "Loan Comparison", to: "/financial/loan-comparison" },
      { title: "Car Loan", to: "/financial/car-loan" },
      { title: "Personal Loan EMI", to: "/financial/personal-loan-emi" },
    ],
  },
  {
    heading: "Investment Calculators",
    items: [
      { title: "ROI", to: "/financial/roi" },
      { title: "Investment Growth", to: "/financial/investment-growth" },
      { title: "Retirement Savings", to: "/financial/retirement-savings" },
      { title: "Dividend Reinvestment", to: "/financial/dividend-reinvestment" },
      { title: "Stock Profit", to: "/financial/stock-profit" },
      { title: "Inflation Impact", to: "/financial/inflation-impact" },
    ],
  },
  {
    heading: "Loan Calculators",
    items: [
      { title: "Mortgage", to: "/financial/mortgage" },
      { title: "Mortgage Refinance", to: "/financial/mortgage-refinance" },
      { title: "Home Affordability", to: "/financial/home-affordability" },
      { title: "Debt-to-Income Ratio", to: "/financial/debt-to-income" },
      { title: "HELOC Payment", to: "/financial/heloc-payment" },
      { title: "Student Loan Repayment", to: "/financial/student-loan-repayment" },
    ],
  },
  {
    heading: "Tax & Income",
    items: [
      { title: "Take-Home Pay", to: "/financial/take-home-pay" },
      { title: "Income Tax Estimator", to: "/financial/income-tax" },
      { title: "Salary After-Tax", to: "/financial/salary-after-tax" },
      { title: "Freelancer Income", to: "/financial/freelancer-income" },
      { title: "Effective Tax Rate", to: "/financial/effective-tax-rate" },
    ],
  },
  {
    heading: "Business & Profit",
    items: [
      { title: "Break-Even Point", to: "/financial/break-even" },
      { title: "Markup & Margin", to: "/financial/markup-margin" },
      { title: "Operating Cost", to: "/financial/operating-cost" },
      { title: "Revenue Growth", to: "/financial/revenue-growth" },
      { title: "Employee Cost", to: "/financial/employee-cost" },
    ],
  },
  {
    heading: "Debt & Credit",
    items: [
      { title: "Debt Snowball", to: "/financial/debt-snowball" },
      { title: "Credit Score Impact", to: "/financial/credit-score-impact" },
      { title: "Loan Consolidation", to: "/financial/loan-consolidation" },
      { title: "Interest Savings", to: "/financial/interest-savings" },
    ],
  },
  {
    heading: "Currency & Inflation",
    items: [
      { title: "Currency Converter", to: "/financial/currency-converter" },
      { title: "Inflation Rate", to: "/financial/inflation-rate" },
      { title: "Purchasing Power", to: "/financial/purchasing-power" },
      { title: "Future Value", to: "/financial/future-value" },
    ],
  },
];