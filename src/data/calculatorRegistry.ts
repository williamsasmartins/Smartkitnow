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
  // ... (mantenha as outras entradas que você tem)
  // Adicione a nova no final, sem vírgula extra
  'imc': {
    key: 'imc',
    name: 'IMC Calculator',
    description: 'Specialized calculator for precise calculations',
    category: 'health',
    subcategory: 'body-measurement',
    formula: 'IMC = peso / (altura^2)',
    tags: ['health', 'bmi', 'weight']
  }
};