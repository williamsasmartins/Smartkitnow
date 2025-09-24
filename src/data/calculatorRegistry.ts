export interface CalculatorInfo {
  key: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  formula?: string;
  tags: string[];
}

export const calculatorRegistry: Record<string, CalculatorInfo> = {
  // Financial Calculators - Personal Finance
  'adjusted-gross-income': {
    key: 'adjusted-gross-income',
    name: 'Adjusted Gross Income Calculator',
    description: 'Calculate your adjusted gross income for tax purposes',
    category: 'financial',
    subcategory: 'Personal Finance Calculators',
    formula: 'AGI = Gross Income - Above-the-line Deductions',
    tags: ['tax', 'income', 'deductions']
  },
  'annual-income': {
    key: 'annual-income',
    name: 'Annual Income Calculator',
    description: 'Convert hourly, weekly, or monthly pay to annual income',
    category: 'financial',
    subcategory: 'Personal Finance Calculators',
    formula: 'Annual Income = Hourly Rate × Hours per Week × 52 weeks',
    tags: ['salary', 'income', 'conversion']
  },
  'biweekly-pay': {
    key: 'biweekly-pay',
    name: 'Biweekly Pay Calculator',
    description: 'Calculate biweekly pay from annual salary or hourly rate',
    category: 'financial',
    subcategory: 'Personal Finance Calculators',
    formula: 'Biweekly Pay = Annual Salary ÷ 26',
    tags: ['payroll', 'salary', 'income']
  },
  'debt-to-income': {
    key: 'debt-to-income',
    name: 'Debt-to-Income Ratio Calculator',
    description: 'Calculate your debt-to-income ratio for lending decisions',
    category: 'financial',
    subcategory: 'Personal Finance Calculators',
    formula: 'DTI = (Total Monthly Debt Payments ÷ Gross Monthly Income) × 100',
    tags: ['debt', 'ratio', 'lending']
  },
  'discount': {
    key: 'discount',
    name: 'Discount Calculator',
    description: 'Calculate discount amount and final price',
    category: 'financial',
    subcategory: 'Personal Finance Calculators',
    formula: 'Discount Amount = Original Price × (Discount % ÷ 100)',
    tags: ['discount', 'savings', 'shopping']
  },
  // ... (This would continue for all 610+ calculators)
  // For now, I'll add key ones and we can expand systematically
  
  // Existing calculators
  'loan-payment': {
    key: 'loan-payment',
    name: 'Loan Payment Calculator',
    description: 'Calculate monthly loan payments',
    category: 'financial',
    subcategory: 'Interest and Loan Calculators',
    formula: 'PMT = P × [r(1+r)^n] / [(1+r)^n - 1]',
    tags: ['loan', 'payment', 'interest']
  },
  'compound-interest': {
    key: 'compound-interest',
    name: 'Compound Interest Calculator',
    description: 'Calculate compound interest and future value',
    category: 'financial',
    subcategory: 'Interest and Loan Calculators',
    formula: 'A = P(1 + r/n)^(nt)',
    tags: ['interest', 'investment', 'savings']
  },
  'roi': {
    key: 'roi',
    name: 'ROI Calculator',
    description: 'Calculate return on investment',
    category: 'financial',
    subcategory: 'Investment and Annuity Calculators',
    formula: 'ROI = (Gain - Cost) / Cost × 100%',
    tags: ['roi', 'investment', 'return']
  },
  'tip': {
    key: 'tip',
    name: 'Tip Calculator',
    description: 'Calculate tip amount and total bill',
    category: 'financial',
    subcategory: 'Personal Finance Calculators',
    formula: 'Tip = Bill Amount × (Tip % ÷ 100)',
    tags: ['tip', 'service', 'restaurant']
  },
  'mortgage': {
    key: 'mortgage',
    name: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments',
    category: 'financial',
    subcategory: 'Mortgage and Home Loan Calculators',
    formula: 'M = P × [r(1+r)^n] / [(1+r)^n - 1]',
    tags: ['mortgage', 'home', 'loan']
  }
};
