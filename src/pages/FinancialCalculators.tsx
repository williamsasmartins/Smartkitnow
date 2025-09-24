import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowLeft } from "lucide-react";
const FinancialCalculators = () => {
  const navigate = useNavigate();
  const subCategories = [{
    title: "Personal Finance Calculators",
    icon: "fa-solid fa-wallet",
    calculators: [{
      key: "adjusted-gross-income",
      name: "Adjusted Gross Income Calculator"
    }, {
      key: "annual-income",
      name: "Annual Income Calculator"
    }, {
      key: "biweekly-pay",
      name: "Biweekly Pay Calculator"
    }, {
      key: "debt-to-income",
      name: "Debt-to-Income Ratio Calculator"
    }, {
      key: "discount",
      name: "Discount Calculator"
    }, {
      key: "hourly-to-salary",
      name: "Hourly to Salary Calculator"
    }, {
      key: "modified-adjusted-gross-income",
      name: "Modified Adjusted Gross Income Calculator"
    }, {
      key: "money-weight",
      name: "Money Weight Calculator"
    }, {
      key: "monthly-income",
      name: "Monthly Income Calculator"
    }, {
      key: "net-worth",
      name: "Net Worth Calculator"
    }, {
      key: "overtime",
      name: "Overtime Calculator"
    }, {
      key: "pay-raise",
      name: "Pay Raise Calculator"
    }, {
      key: "paypal-fee",
      name: "PayPal Fee Calculator"
    }, {
      key: "pennies-to-dollars",
      name: "Pennies to Dollars Calculator"
    }, {
      key: "percent-off",
      name: "Percent Off Calculator"
    }, {
      key: "pto",
      name: "PTO Calculator"
    }, {
      key: "salary-to-hourly",
      name: "Salary to Hourly Calculator"
    }, {
      key: "time-and-half",
      name: "Time and a Half Calculator"
    }, {
      key: "tip",
      name: "Tip Calculator"
    }, {
      key: "unit-price",
      name: "Unit Price Calculator"
    }]
  }, {
    title: "Interest and Loan Calculators",
    icon: "fa-solid fa-percent",
    calculators: [{
      key: "amortization",
      name: "Amortization Calculator"
    }, {
      key: "apr",
      name: "APR Calculator"
    }, {
      key: "apr-to-apy",
      name: "APR to APY Calculator"
    }, {
      key: "apy",
      name: "APY Calculator"
    }, {
      key: "cd",
      name: "CD Calculator"
    }, {
      key: "cd-ladder",
      name: "CD Ladder Calculator"
    }, {
      key: "compound-interest",
      name: "Compound Interest Calculator"
    }, {
      key: "credit-card-interest",
      name: "Credit Card Interest Calculator"
    }, {
      key: "credit-card-payoff",
      name: "Credit Card Payoff Calculator"
    }, {
      key: "daily-compound-interest",
      name: "Daily Compound Interest Calculator"
    }, {
      key: "ear",
      name: "EAR Calculator"
    }, {
      key: "future-value",
      name: "Future Value Calculator"
    }, {
      key: "interest",
      name: "Interest Calculator"
    }, {
      key: "interest-rate",
      name: "Interest Rate Calculator"
    }, {
      key: "loan-interest",
      name: "Loan Interest Calculator"
    }, {
      key: "loan-payment",
      name: "Loan Payment Calculator"
    }, {
      key: "loan-payoff",
      name: "Loan Payoff Calculator"
    }, {
      key: "present-value",
      name: "Present Value Calculator"
    }, {
      key: "rule-of-72",
      name: "Rule of 72 Calculator"
    }, {
      key: "simple-interest",
      name: "Simple Interest Calculator"
    }, {
      key: "student-loan",
      name: "Student Loan Calculator"
    }, {
      key: "student-loan-payoff",
      name: "Student Loan Payoff Calculator"
    }, {
      key: "time-value-money",
      name: "Time Value of Money Calculator"
    }]
  }, {
    title: "Mortgage and Home Loan Calculators",
    icon: "fa-solid fa-home",
    calculators: [{
      key: "mortgage",
      name: "Mortgage Calculator"
    }, {
      key: "mortgage-refinance",
      name: "Mortgage Refinance Calculator"
    }, {
      key: "home-equity-loan",
      name: "Home Equity Loan Calculator"
    }, {
      key: "home-equity-line-of-credit",
      name: "HELOC Calculator"
    }, {
      key: "fha-loan",
      name: "FHA Loan Calculator"
    }, {
      key: "va-loan",
      name: "VA Loan Calculator"
    }, {
      key: "usda-loan",
      name: "USDA Loan Calculator"
    }, {
      key: "jumbo-loan",
      name: "Jumbo Loan Calculator"
    }, {
      key: "reverse-mortgage",
      name: "Reverse Mortgage Calculator"
    }]
  }, {
    title: "Property and Real Estate Calculators",
    icon: "fa-solid fa-house",
    calculators: [{
      key: "cap-rate",
      name: "Cap Rate Calculator"
    }, {
      key: "cash-on-cash-return",
      name: "Cash on Cash Return Calculator"
    }, {
      key: "gross-rent-multiplier",
      name: "Gross Rent Multiplier Calculator"
    }, {
      key: "ltv",
      name: "LTV Calculator"
    }, {
      key: "mortgage-payoff",
      name: "Mortgage Payoff Calculator"
    }, {
      key: "net-effective-rent",
      name: "Net Effective Rent Calculator"
    }, {
      key: "net-operating-income",
      name: "Net Operating Income Calculator"
    }, {
      key: "price-per-square-foot",
      name: "Price Per Square Foot Calculator"
    }, {
      key: "property-management-cost",
      name: "Property Management Cost Calculator"
    }, {
      key: "prorated-rent",
      name: "Prorated Rent Calculator"
    }, {
      key: "real-estate-commission",
      name: "Real Estate Commission Calculator"
    }, {
      key: "rent",
      name: "Rent Calculator"
    }, {
      key: "rental-property",
      name: "Rental Property Calculator"
    }, {
      key: "rental-property-depreciation",
      name: "Rental Property Depreciation Calculator"
    }]
  }, {
    title: "Investment and Annuity Calculators",
    icon: "fa-solid fa-chart-line",
    calculators: [{
      key: "annuity",
      name: "Annuity Calculator"
    }, {
      key: "annuity-payout",
      name: "Annuity Payout Calculator"
    }, {
      key: "basis-point",
      name: "Basis Point Calculator"
    }, {
      key: "bond-price",
      name: "Bond Price Calculator"
    }, {
      key: "bond-yield",
      name: "Bond Yield Calculator"
    }, {
      key: "future-value-annuity",
      name: "Future Value of an Annuity Calculator"
    }, {
      key: "present-value-annuity",
      name: "Present Value of an Annuity Calculator"
    }, {
      key: "pvifa",
      name: "PVIFA Calculator"
    }, {
      key: "stock-average",
      name: "Stock Average Calculator"
    }, {
      key: "stock-profit",
      name: "Stock Profit Calculator"
    }, {
      key: "yield-to-maturity",
      name: "Yield to Maturity Calculator"
    }, {
      key: "401k",
      name: "401k Calculator"
    }, {
      key: "ira",
      name: "IRA Calculator"
    }, {
      key: "roth-ira",
      name: "Roth IRA Calculator"
    }]
  }, {
    title: "Vehicle Loan Calculators",
    icon: "fa-solid fa-car",
    calculators: [{
      key: "atv-loan",
      name: "ATV Loan Calculator"
    }, {
      key: "auto-loan",
      name: "Auto Loan Calculator"
    }, {
      key: "boat-loan",
      name: "Boat Loan Calculator"
    }, {
      key: "car-lease",
      name: "Car Lease Calculator"
    }, {
      key: "lease-vs-buy",
      name: "Lease vs. Buy Car Calculator"
    }, {
      key: "motorcycle-loan",
      name: "Motorcycle Loan Calculator"
    }, {
      key: "rv-loan",
      name: "RV Loan Calculator"
    }]
  }, {
    title: "Retirement Planning Calculators",
    icon: "fa-solid fa-user-clock",
    calculators: [{
      key: "retirement",
      name: "Retirement Calculator"
    }, {
      key: "retirement-savings",
      name: "Retirement Savings Calculator"
    }, {
      key: "social-security",
      name: "Social Security Calculator"
    }, {
      key: "pension",
      name: "Pension Calculator"
    }, {
      key: "early-retirement",
      name: "Early Retirement Calculator"
    }, {
      key: "required-minimum-distribution",
      name: "RMD Calculator"
    }]
  }, {
    title: "Tax Calculators",
    icon: "fa-solid fa-receipt",
    calculators: [{
      key: "tax",
      name: "Tax Calculator"
    }, {
      key: "tax-refund",
      name: "Tax Refund Calculator"
    }, {
      key: "payroll-tax",
      name: "Payroll Tax Calculator"
    }, {
      key: "self-employment-tax",
      name: "Self-Employment Tax Calculator"
    }, {
      key: "capital-gains-tax",
      name: "Capital Gains Tax Calculator"
    }, {
      key: "property-tax",
      name: "Property Tax Calculator"
    }, {
      key: "sales-tax",
      name: "Sales Tax Calculator"
    }]
  }, {
    title: "Savings and Budget Calculators",
    icon: "fa-solid fa-piggy-bank",
    calculators: [{
      key: "savings",
      name: "Savings Calculator"
    }, {
      key: "emergency-fund",
      name: "Emergency Fund Calculator"
    }, {
      key: "budget",
      name: "Budget Calculator"
    }, {
      key: "cost-of-living",
      name: "Cost of Living Calculator"
    }, {
      key: "vacation-savings",
      name: "Vacation Savings Calculator"
    }, {
      key: "college-savings",
      name: "College Savings Calculator"
    }]
  }, {
    title: "Credit and Debt Calculators",
    icon: "fa-solid fa-credit-card",
    calculators: [{
      key: "credit-score",
      name: "Credit Score Calculator"
    }, {
      key: "debt-consolidation",
      name: "Debt Consolidation Calculator"
    }, {
      key: "debt-snowball",
      name: "Debt Snowball Calculator"
    }, {
      key: "debt-avalanche",
      name: "Debt Avalanche Calculator"
    }, {
      key: "minimum-payment",
      name: "Minimum Payment Calculator"
    }]
  }, {
    title: "Insurance Calculators",
    icon: "fa-solid fa-shield-alt",
    calculators: [{
      key: "life-insurance",
      name: "Life Insurance Calculator"
    }, {
      key: "health-insurance",
      name: "Health Insurance Calculator"
    }, {
      key: "auto-insurance",
      name: "Auto Insurance Calculator"
    }, {
      key: "home-insurance",
      name: "Home Insurance Calculator"
    }, {
      key: "disability-insurance",
      name: "Disability Insurance Calculator"
    }]
  }, {
    title: "Currency and Exchange Calculators",
    icon: "fa-solid fa-exchange-alt",
    calculators: [{
      key: "currency-converter",
      name: "Currency Converter"
    }, {
      key: "exchange-rate",
      name: "Exchange Rate Calculator"
    }, {
      key: "inflation",
      name: "Inflation Calculator"
    }, {
      key: "purchasing-power",
      name: "Purchasing Power Calculator"
    }]
  }, {
    title: "Small Business Calculators",
    icon: "fa-solid fa-store",
    calculators: [{
      key: "business-loan",
      name: "Business Loan Calculator"
    }, {
      key: "startup-cost",
      name: "Startup Cost Calculator"
    }, {
      key: "break-even",
      name: "Break-Even Calculator"
    }, {
      key: "cash-flow",
      name: "Cash Flow Calculator"
    }, {
      key: "equipment-loan",
      name: "Equipment Loan Calculator"
    }]
  }, {
    title: "Education Finance Calculators",
    icon: "fa-solid fa-graduation-cap",
    calculators: [{
      key: "college-cost",
      name: "College Cost Calculator"
    }, {
      key: "student-budget",
      name: "Student Budget Calculator"
    }, {
      key: "education-loan",
      name: "Education Loan Calculator"
    }, {
      key: "529-plan",
      name: "529 Plan Calculator"
    }]
  }, {
    title: "Cryptocurrency Calculators",
    icon: "fa-solid fa-bitcoin-sign",
    calculators: [{
      key: "crypto-profit",
      name: "Crypto Profit Calculator"
    }, {
      key: "crypto-tax",
      name: "Crypto Tax Calculator"
    }, {
      key: "mining-profit",
      name: "Mining Profit Calculator"
    }, {
      key: "dca",
      name: "Dollar Cost Averaging Calculator"
    }]
  }, {
    title: "Banking and Financial Services",
    icon: "fa-solid fa-university",
    calculators: [{
      key: "checking-account",
      name: "Checking Account Calculator"
    }, {
      key: "savings-account",
      name: "Savings Account Calculator"
    }, {
      key: "money-market",
      name: "Money Market Calculator"
    }, {
      key: "bank-fees",
      name: "Bank Fees Calculator"
    }]
  }, {
    title: "Business Finance Calculators",
    icon: "fa-solid fa-briefcase",
    calculators: [{
      key: "appreciation",
      name: "Appreciation Calculator"
    }, {
      key: "cagr",
      name: "CAGR Calculator"
    }, {
      key: "commission",
      name: "Commission Calculator"
    }, {
      key: "cross-price-elasticity",
      name: "Cross-Price Elasticity Calculator"
    }, {
      key: "debt-to-equity-ratio",
      name: "Debt-to-Equity Ratio Calculator"
    }, {
      key: "depreciation",
      name: "Depreciation Calculator"
    }, {
      key: "discounted-cash-flow",
      name: "Discounted Cash Flow Calculator"
    }, {
      key: "irr",
      name: "IRR Calculator"
    }, {
      key: "margin",
      name: "Margin Calculator"
    }, {
      key: "markup",
      name: "Markup Calculator"
    }, {
      key: "net-present-value",
      name: "Net Present Value Calculator"
    }, {
      key: "payback-period",
      name: "Payback Period Calculator"
    }, {
      key: "price-elasticity-demand",
      name: "Price Elasticity of Demand Calculator"
    }, {
      key: "price-elasticity-supply",
      name: "Price Elasticity of Supply Calculator"
    }, {
      key: "rate-of-return",
      name: "Rate of Return Calculator"
    }, {
      key: "return-on-equity",
      name: "Return on Equity Calculator"
    }, {
      key: "roi",
      name: "ROI Calculator"
    }, {
      key: "wacc",
      name: "WACC Calculator"
    }]
  }];
  const handleSubCategoryClick = (subCategory: any) => {
    const slug = subCategory.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    navigate(`/financial/${slug}`, {
      state: {
        subCategory
      }
    });
  };
  return <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="flex items-center space-x-2 mb-6">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex flex-col items-center text-center space-y-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">Financial Calculators – Plan, Invest & Save Smarter</h1>
                <p className="text-muted-foreground mt-2 text-lg">Explore our full range of financial calculators to manage money wisely. Calculate loan payments, investment growth, interest rates, and savings goals with clear formulas and step-by-step guidance.</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subCategories.map((subCategory, index) => <Card key={index} className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 cursor-pointer" onClick={() => handleSubCategoryClick(subCategory)}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <i className={`${subCategory.icon} text-primary text-lg`}></i>
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {subCategory.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {subCategory.calculators.length} calculators available
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {subCategory.calculators.slice(0, 3).map((calc, calcIndex) => <p key={calcIndex} className="text-xs text-muted-foreground">
                        • {calc.name}
                      </p>)}
                    {subCategory.calculators.length > 3 && <p className="text-xs text-muted-foreground font-medium">
                        + {subCategory.calculators.length - 3} more calculators
                      </p>}
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default FinancialCalculators;