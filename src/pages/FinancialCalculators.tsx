import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowLeft } from "lucide-react";

const FinancialCalculators = () => {
  const navigate = useNavigate();

  const subCategories = [
    { title: "Personal Finance Calculators", icon: "fa-solid fa-user-tie", calculators: [{ key: "personal-finance", name: "Personal Finance Tools" }] },
    { title: "Interest and Loan Calculators", icon: "fa-solid fa-percentage", calculators: [{ key: "interest-loan", name: "Interest & Loan Tools" }] },
    { title: "Mortgage and Home Loan Calculators", icon: "fa-solid fa-home", calculators: [{ key: "mortgage-home", name: "Mortgage & Home Loan Tools" }] },
    { title: "Property and Real Estate Calculators", icon: "fa-solid fa-building", calculators: [{ key: "property-real-estate", name: "Property & Real Estate Tools" }] },
    { title: "Investment and Annuity Calculators", icon: "fa-solid fa-chart-line", calculators: [{ key: "investment-annuity", name: "Investment & Annuity Tools" }] },
    { title: "Vehicle Loan Calculators", icon: "fa-solid fa-car", calculators: [{ key: "vehicle-loan", name: "Vehicle Loan Tools" }] },
    { title: "Retirement Planning Calculators", icon: "fa-solid fa-calendar-alt", calculators: [{ key: "retirement-planning", name: "Retirement Planning Tools" }] },
    { title: "Tax Calculators", icon: "fa-solid fa-receipt", calculators: [{ key: "tax", name: "Tax Tools" }] },
    { title: "Savings and Budget Calculators", icon: "fa-solid fa-piggy-bank", calculators: [{ key: "savings-budget", name: "Savings & Budget Tools" }] },
    { title: "Credit and Debt Calculators", icon: "fa-solid fa-credit-card", calculators: [{ key: "credit-debt", name: "Credit & Debt Tools" }] },
    { title: "Insurance Calculators", icon: "fa-solid fa-shield-alt", calculators: [{ key: "insurance", name: "Insurance Tools" }] },
    { title: "Currency and Exchange Calculators", icon: "fa-solid fa-exchange-alt", calculators: [{ key: "currency-exchange", name: "Currency & Exchange Tools" }] },
    { title: "Small Business Calculators", icon: "fa-solid fa-building-columns", calculators: [{ key: "small-business", name: "Small Business Tools" }] },
    { title: "Education Finance Calculators", icon: "fa-solid fa-graduation-cap", calculators: [{ key: "education-finance", name: "Education Finance Tools" }] },
    { title: "Cryptocurrency Calculators", icon: "fa-solid fa-coins", calculators: [{ key: "cryptocurrency", name: "Crypto Tools" }] },
    { title: "Banking and Financial Services", icon: "fa-solid fa-university", calculators: [{ key: "banking-financial", name: "Banking & Financial Services" }] },
    { title: "Business Finance Calculators", icon: "fa-solid fa-briefcase", calculators: [{ key: "business-finance", name: "Business Finance Tools" }] },
    { title: "Financial Planning Calculators", icon: "fa-solid fa-clipboard-list", calculators: [{ key: "financial-planning", name: "Financial Planning Tools" }] },
  ];

  const handleSubCategoryClick = (subCategory: any) => {
    const slug = subCategory.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    navigate(`/financial/${slug}`, { state: { subCategory } });
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      <main className="pt-24">
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto mt-16 p-4 dark:bg-gray-800 bg-gray-200 rounded-lg">
            <p className="text-sm dark:text-gray-300 text-gray-700 text-center">Ad Space - Top Center (Google AdSense)</p>
          </div>
          <div className="fixed top-24 left-4 w-1/6 dark:bg-gray-800 bg-gray-200 p-4 rounded-lg z-10 hidden md:block">
            <p className="text-sm dark:text-gray-300 text-gray-700">Ad Space - Top Left (Google AdSense)</p>
          </div>
          <div className="fixed top-24 right-4 w-1/6 dark:bg-gray-800 bg-gray-200 p-4 rounded-lg z-10 hidden md:block">
            <p className="text-sm dark:text-gray-300 text-gray-700">Ad Space - Top Right (Google AdSense)</p>
          </div>
          <div className="max-w-3xl mx-auto mt-8">
            <div className="mb-8">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              
              <div className="flex flex-col items-center text-center space-y-3 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Financial Calculators
                  </h1>
                  <p className="text-muted-foreground mt-2 text-lg">
                    Use our financial calculators for loans, investments, and personal finance planning.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subCategories.map((subCategory, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 cursor-pointer"
                  onClick={() => handleSubCategoryClick(subCategory)}
                >
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
                      {subCategory.calculators.slice(0, 3).map((calc, calcIndex) => (
                        <p key={calcIndex} className="text-xs text-muted-foreground">
                          • {calc.name}
                        </p>
                      ))}
                      {subCategory.calculators.length > 3 && (
                        <p className="text-xs text-muted-foreground font-medium">
                          + {subCategory.calculators.length - 3} more calculators
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="max-w-3xl mx-auto mt-8 p-4 dark:bg-gray-800 bg-gray-200 rounded-lg">
            <p className="text-sm dark:text-gray-300 text-gray-700 text-center">Ad Space - Bottom (Google AdSense)</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FinancialCalculators;