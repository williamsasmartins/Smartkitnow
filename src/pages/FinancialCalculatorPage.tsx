import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Import financial calculator components
import { LoanCalculator } from "@/components/calculators/LoanCalculator";
import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";
import { ROICalculator } from "@/components/calculators/ROICalculator";
import { TipCalculator } from "@/components/calculators/TipCalculator";
import { MortgageCalculator } from "@/components/calculators/MortgageCalculator";

// Import new financial calculators
import { AdjustedGrossIncomeCalculator } from "@/components/calculators/financial/AdjustedGrossIncomeCalculator";
import { AnnualIncomeCalculator } from "@/components/calculators/financial/AnnualIncomeCalculator";
import { BiweeklyPayCalculator } from "@/components/calculators/financial/BiweeklyPayCalculator";
import { DebtToIncomeCalculator } from "@/components/calculators/financial/DebtToIncomeCalculator";
import { DiscountCalculator } from "@/components/calculators/financial/DiscountCalculator";
import { HourlyToSalaryCalculator } from "@/components/calculators/financial/HourlyToSalaryCalculator";
import { AmortizationCalculator } from "@/components/calculators/financial/AmortizationCalculator";
import { APRCalculator } from "@/components/calculators/financial/APRCalculator";
import { SimpleInterestCalculator } from "@/components/calculators/financial/SimpleInterestCalculator";

const FinancialCalculatorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const calculator = location.state?.calculator;
  const subCategory = location.state?.subCategory;

  if (!calculator) {
    navigate('/financial');
    return null;
  }

  const renderCalculator = () => {
    const calculatorKey = calculator.key;
    
    // Map calculator keys to components
    switch (calculatorKey) {
      // Personal Finance
      case 'adjusted-gross-income':
        return <AdjustedGrossIncomeCalculator />;
      case 'annual-income':
        return <AnnualIncomeCalculator />;
      case 'biweekly-pay':
        return <BiweeklyPayCalculator />;
      case 'debt-to-income':
        return <DebtToIncomeCalculator />;
      case 'discount':
        return <DiscountCalculator />;
      case 'hourly-to-salary':
        return <HourlyToSalaryCalculator />;
      case 'tip':
        return <TipCalculator />;
      
      // Interest and Loan
      case 'amortization':
        return <AmortizationCalculator />;
      case 'apr':
        return <APRCalculator />;
      case 'simple-interest':
        return <SimpleInterestCalculator />;
      case 'compound-interest':
      case 'future-value':
        return <CompoundInterestCalculator />;
      case 'loan-payment':
      case 'loan-interest':
      case 'auto-loan':
      case 'student-loan':
        return <LoanCalculator />;
      
      // Investment
      case 'roi':
      case 'rate-of-return':
        return <ROICalculator />;
        
      // Mortgage
      case 'mortgage':
      case 'mortgage-payoff':
        return <MortgageCalculator />;
        
      default:
        return (
          <div className="bg-card rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">{calculator.name}</h3>
            <p className="text-muted-foreground mb-6">
              This calculator is coming soon. We're working on implementing all financial calculators.
            </p>
            <div className="bg-muted/50 rounded-lg p-6">
              <p className="text-sm text-muted-foreground">
                Calculator Key: <code className="bg-muted px-2 py-1 rounded">{calculatorKey}</code>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Category: {subCategory}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <div className="mb-6 text-center">
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                {calculator.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                Category: {subCategory}
              </p>
            </div>
          </div>
          
          {renderCalculator()}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FinancialCalculatorPage;