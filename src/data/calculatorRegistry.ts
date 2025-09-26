// src/data/calculatorRegistry.ts
type CalculatorInfo = {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  formula: string;
  tags: string[];
  sources: { title: string; url: string }[]; // Referências para SEO/AdSense
};

export const calculatorRegistry: Record<string, CalculatorInfo> = {
  // Mantenha entradas existentes (ex.: health, math, etc.)
  // Adições para financial (todas as 18 calculadoras da pasta financial/):
  'adjusted-gross-income': {
    name: 'Adjusted Gross Income',
    description: 'Calculate your adjusted gross income for tax purposes',
    category: 'financial',
    subcategory: 'income',
    formula: 'AGI = Gross Income - Adjustments (e.g., student loan interest, alimony)',
    tags: ['income', 'tax', 'finance'],
    sources: [
      { title: 'IRS Adjusted Gross Income Guide', url: 'https://www.irs.gov/taxtopics/tc551' },
    ],
  },
  'amortization': {
    name: 'Amortization',
    description: 'Calculate loan amortization schedule',
    category: 'financial',
    subcategory: 'loans',
    formula: 'Monthly Payment = P * (r(1+r)^n) / ((1+r)^n - 1)',
    tags: ['loans', 'amortization', 'finance'],
    sources: [
      { title: 'Investopedia Amortization', url: 'https://www.investopedia.com/terms/a/amortization.asp' },
    ],
  },
  'annual-income': {
    name: 'Annual Income',
    description: 'Calculate annual income from hourly or monthly rates',
    category: 'financial',
    subcategory: 'income',
    formula: 'Annual Income = Hourly Rate * Hours per Week * 52',
    tags: ['income', 'salary', 'finance'],
    sources: [
      { title: 'Bureau of Labor Statistics Wage Data', url: 'https://www.bls.gov/oes/current/oes_nat.htm' },
    ],
  },
  'apr': {
    name: 'APR',
    description: 'Calculate Annual Percentage Rate for loans',
    category: 'financial',
    subcategory: 'interest',
    formula: 'APR = ((Fees + Interest) / Principal) / n * 365 * 100',
    tags: ['apr', 'loans', 'interest'],
    sources: [
      { title: 'Consumer Financial Protection Bureau APR', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-apr-en-54/' },
    ],
  },
  'biweekly-pay': {
    name: 'Biweekly Pay',
    description: 'Calculate biweekly paycheck amount',
    category: 'financial',
    subcategory: 'payroll',
    formula: 'Biweekly Pay = Annual Salary / 26',
    tags: ['payroll', 'salary', 'finance'],
    sources: [
      { title: 'DOL Wage and Hour Division', url: 'https://www.dol.gov/agencies/whd' },
    ],
  },
  'compound-interest': {
    name: 'Compound Interest',
    description: 'Calculate compound interest on investments',
    category: 'financial',
    subcategory: 'investments',
    formula: 'A = P (1 + r/n)^(nt)',
    tags: ['interest', 'investments', 'savings'],
    sources: [
      { title: 'Investopedia Compound Interest', url: 'https://www.investopedia.com/terms/c/compoundinterest.asp' },
    ],
  },
  'debt-to-income': {
    name: 'Debt to Income',
    description: 'Calculate debt-to-income ratio for loan eligibility',
    category: 'financial',
    subcategory: 'debt',
    formula: 'DTI = (Monthly Debt Payments / Gross Monthly Income) * 100',
    tags: ['debt', 'loans', 'finance'],
    sources: [
      { title: 'CFPB Debt-to-Income', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/' },
    ],
  },
  'discount': {
    name: 'Discount',
    description: 'Calculate discounts on purchases',
    category: 'financial',
    subcategory: 'shopping',
    formula: 'Discount Amount = Original Price * (Discount Rate / 100)',
    tags: ['discount', 'shopping', 'savings'],
    sources: [
      { title: 'Khan Academy Discounts', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic/cc-6th-percent-problems/e/discount_tax_and_tip_word_problems' },
    ],
  },
  'home-affordability': {
    name: 'Home Affordability',
    description: 'Calculate how much house you can afford',
    category: 'financial',
    subcategory: 'mortgage',
    formula: 'Affordable Price = (Monthly Income * 0.28 - Other Debts) / (Monthly Mortgage Rate)',
    tags: ['mortgage', 'real-estate', 'finance'],
    sources: [
      { title: 'NerdWallet Home Affordability', url: 'https://www.nerdwallet.com/mortgages/how-much-house-can-i-afford' },
    ],
  },
  'hourly-to-salary': {
    name: 'Hourly to Salary',
    description: 'Convert hourly wage to annual salary',
    category: 'financial',
    subcategory: 'income',
    formula: 'Annual Salary = Hourly Wage * Hours per Week * 52',
    tags: ['salary', 'wage', 'finance'],
    sources: [
      { title: 'PayScale Wage Converter', url: 'https://www.payscale.com/research/US/Hourly_Rate' },
    ],
  },
  'investment-return': {
    name: 'Investment Return',
    description: 'Calculate return on investment',
    category: 'financial',
    subcategory: 'investments',
    formula: 'ROI = (Net Profit / Investment Cost) * 100',
    tags: ['roi', 'investments', 'finance'],
    sources: [
      { title: 'Investopedia ROI', url: 'https://www.investopedia.com/terms/r/returnoninvestment.asp' },
    ],
  },
  'loan': {
    name: 'Loan',
    description: 'Calculate loan payments and interest',
    category: 'financial',
    subcategory: 'loans',
    formula: 'Payment = P * (r(1+r)^n) / ((1+r)^n - 1)',
    tags: ['loans', 'payments', 'finance'],
    sources: [
      { title: 'Bankrate Loan Calculator', url: 'https://www.bankrate.com/loans/loan-calculator/' },
    ],
  },
  'mortgage': {
    name: 'Mortgage',
    description: 'Calculate monthly mortgage payments',
    category: 'financial',
    subcategory: 'mortgage',
    formula: 'Monthly Payment = P * (r(1+r)^n) / ((1+r)^n - 1)',
    tags: ['mortgage', 'home-loan', 'finance'],
    sources: [
      { title: 'Zillow Mortgage Calculator', url: 'https://www.zillow.com/mortgage-calculator/' },
    ],
  },
  'mortgage-refinance': {
    name: 'Mortgage Refinance',
    description: 'Calculate savings from refinancing a mortgage',
    category: 'financial',
    subcategory: 'mortgage',
    formula: 'Savings = Old Payment * Remaining Months - New Payment * Remaining Months - Closing Costs',
    tags: ['refinance', 'mortgage', 'savings'],
    sources: [
      { title: 'Bankrate Refinance Calculator', url: 'https://www.bankrate.com/mortgages/refinance-calculator/' },
    ],
  },
  'refinance-breakeven': {
    name: 'Refinance Breakeven',
    description: 'Calculate breakeven point for mortgage refinance',
    category: 'financial',
    subcategory: 'mortgage',
    formula: 'Breakeven Months = Closing Costs / Monthly Savings',
    tags: ['refinance', 'breakeven', 'finance'],
    sources: [
      { title: 'NerdWallet Refinance Breakeven', url: 'https://www.nerdwallet.com/article/mortgages/refinance-calculator' },
    ],
  },
  'roi': {
    name: 'ROI',
    description: 'Calculate Return on Investment',
    category: 'financial',
    subcategory: 'investments',
    formula: 'ROI = (Gain from Investment - Cost of Investment) / Cost of Investment',
    tags: ['roi', 'investments', 'finance'],
    sources: [
      { title: 'Investopedia ROI', url: 'https://www.investopedia.com/terms/r/returnoninvestment.asp' },
    ],
  },
  'simple-interest': {
    name: 'Simple Interest',
    description: 'Calculate simple interest on loans or savings',
    category: 'financial',
    subcategory: 'interest',
    formula: 'Interest = Principal * Rate * Time',
    tags: ['interest', 'loans', 'savings'],
    sources: [
      { title: 'Khan Academy Simple Interest', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/interest-tutorial/simple-interest/v/simple-interest' },
    ],
  },
  'tip': {
    name: 'Tip',
    description: 'Calculate tip amount and total bill',
    category: 'financial',
    subcategory: 'shopping',
    formula: 'Tip = Bill Amount * (Tip Percentage / 100)',
    tags: ['tip', 'restaurant', 'finance'],
    sources: [
      { title: 'Emily Post Etiquette Tips', url: 'https://emilypost.com/advice/tipping-etiquette' },
    ],
  },
  // Adicione mais para outras categorias se precisar no futuro
};