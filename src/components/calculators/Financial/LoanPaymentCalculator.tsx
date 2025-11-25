import { useState, useMemo } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoanCalculatorProps {
  principal: number;
  interestRate: number;
  term: number;
}

const LoanPaymentCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [term, setTerm] = useState<number>(0);

  const monthlyPayment = useMemo(() => {
    if (principal <= 0 || interestRate <= 0 || term <= 0) return 0;

    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = term * 12;
    const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    
    return payment.toFixed(2);
  }, [principal, interestRate, term]);

  return (
    <CalculatorVerticalLayout
      title="Loan Payment Calculator"
      slug="loan-payment"
      category="financial"
      description="Calculate your monthly loan payments instantly. Enter principal, interest rate, and term to see your exact payment schedule."
      editorial={`
        ## Loan Payment Calculator

        A loan payment calculator is a vital tool for anyone considering taking out a loan. It allows you to estimate your monthly payments based on the principal amount, interest rate, and loan term. Understanding how these factors interact can help you make informed financial decisions.

        ### How to Use the Loan Payment Calculator

        1. **Principal**: This is the total amount of money you are borrowing. Enter the amount in the input field provided.
        2. **Interest Rate**: This is the annual interest rate charged by the lender. Input the percentage rate (e.g., 5 for 5%).
        3. **Term**: This refers to the duration of the loan in years. Enter the number of years you plan to take to repay the loan.

        Once you have entered these values, the calculator will provide you with your estimated monthly payment. 

        ### Understanding Loan Payments

        Loan payments consist of two main components: principal and interest. The principal is the original sum of money borrowed, while interest is the cost of borrowing that money. 

        The formula used to calculate monthly payments is derived from the amortization process, which spreads the loan payments over the term of the loan. 

        ### Example Calculation

        For example, if you borrow $200,000 at an interest rate of 4% for 30 years, your monthly payment would be calculated as follows:

        - Principal: $200,000
        - Interest Rate: 4%
        - Term: 30 years

        Using the formula, your monthly payment would be approximately $954.83. 

        ### Importance of Knowing Your Payments

        Knowing your monthly payment is crucial for budgeting and financial planning. It helps you understand how much you can afford to borrow without overextending yourself financially. 

        ### Additional Considerations

        - **Taxes and Insurance**: Remember that your monthly payment may not include property taxes and insurance, which can significantly increase your total monthly outlay.
        - **Prepayment Options**: Some loans allow for prepayment without penalties, which can save you money on interest over the life of the loan.
        - **Loan Types**: Different types of loans (fixed-rate vs. adjustable-rate) can affect your monthly payment and overall cost. 

        ### Conclusion

        The Loan Payment Calculator is an essential tool for anyone looking to borrow money. By understanding how to use it and what factors influence your payments, you can make better financial decisions and plan for your future.
      `}
    >
      <Card>
        <CardHeader>
          <CardTitle>Calculate Your Monthly Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="principal">Principal Amount ($)</Label>
            <Input
              id="principal"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="term">Loan Term (Years)</Label>
            <Input
              id="term"
              type="number"
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
            />
          </div>
          <div>
            <Button onClick={() => alert(`Your monthly payment is $${monthlyPayment}`)}>
              Calculate Payment
            </Button>
          </div>
          <div>
            <h3>Your Estimated Monthly Payment: ${monthlyPayment}</h3>
          </div>
        </CardContent>
      </Card>
    </CalculatorVerticalLayout>
  );
};

export default LoanPaymentCalculator;