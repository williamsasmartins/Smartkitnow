import { lazy } from "react";

export interface ToolRoute {
    slug: string;
    category: string;
    title: string;
    component: React.LazyExoticComponent<React.ComponentType<any>>;
}

export const calculatorRoutes: ToolRoute[] = [
    {
        slug: "loan-payment",
        category: "financial",
        title: "Loan Payment Calculator (Principal, Rate, Term)",
        component: lazy(() => import("../components/calculators/Financial/LoanPaymentCalculator"))
    },
    {
        slug: "mortgage-amortization",
        category: "financial",
        title: "Mortgage Payment & Amortization Calculator",
        component: lazy(() => import("../components/calculators/Financial/MortgageAmortizationCalculator"))
    },
    {
        slug: "extra-payments-payoff",
        category: "financial",
        title: "Extra Payments & Payoff Time Calculator",
        component: lazy(() => import("../components/calculators/Financial/ExtraPaymentsPayoffCalculator"))
    },
    {
        slug: "interest-only-loan",
        category: "financial",
        title: "Interest-Only Loan Calculator",
        component: lazy(() => import("../components/calculators/Financial/InterestOnlyLoanCalculator"))
    },
    {
        slug: "refinance-savings",
        category: "financial",
        title: "Refinance Savings Calculator",
        component: lazy(() => import("../components/calculators/Financial/RefinanceSavingsCalculator"))
    },
    {
        slug: "heloc-payment-estimator",
        category: "financial",
        title: "HELOC Payment Estimator",
        component: lazy(() => import("../components/calculators/Financial/HelocPaymentEstimatorCalculator"))
    },
    {
        slug: "car-loan-affordability",
        category: "financial",
        title: "Car Loan Affordability Calculator",
        component: lazy(() => import("../components/calculators/Financial/CarLoanAffordabilityCalculator"))
    },
    {
        slug: "balloon-payment",
        category: "financial",
        title: "Balloon Payment Calculator",
        component: lazy(() => import("../components/calculators/Financial/BalloonPaymentCalculator"))
    },
    {
        slug: "house-affordability",
        category: "financial",
        title: "How Much House Can I Afford? Calculator",
        component: lazy(() => import("../components/calculators/Financial/HouseAffordabilityCalculator"))
    },
    {
        slug: "auto-loan",
        category: "financial",
        title: "Auto Loan Calculator",
        component: lazy(() => import("../components/calculators/Financial/AutoLoanCalculator"))
    },
    {
        slug: "student-loan-repayment",
        category: "financial",
        title: "Student Loan Repayment Calculator",
        component: lazy(() => import("../components/calculators/Financial/StudentLoanRepaymentCalculator"))
    },
    {
        slug: "lease-vs-buy",
        category: "financial",
        title: "Lease vs Buy Calculator",
        component: lazy(() => import("../components/calculators/Financial/LeaseVsBuyCalculator"))
    },
    {
        slug: "compound-interest",
        category: "financial",
        title: "Compound Interest Calculator",
        component: lazy(() => import("../components/calculators/Financial/CompoundInterestCalculator"))
    },
    {
        slug: "future-value-investment",
        category: "financial",
        title: "Future Value of Investment Calculator",
        component: lazy(() => import("../components/calculators/Financial/FutureValueInvestmentCalculator"))
    },
    {
        slug: "roi-return-on-investment",
        category: "financial",
        title: "Investment Return (ROI) Calculator",
        component: lazy(() => import("../components/calculators/Financial/RoiReturnOnInvestmentCalculator"))
    },
    {
        slug: "sip-monthly-investment-planner",
        category: "financial",
        title: "SIP/Monthly Investment Planner",
        component: lazy(() => import("../components/calculators/Financial/SipMonthlyInvestmentPlannerCalculator"))
    },
    {
        slug: "inflation-adjusted-value",
        category: "financial",
        title: "Inflation Adjusted Value Calculator",
        component: lazy(() => import("../components/calculators/Financial/InflationAdjustedValueCalculator"))
    },
    {
        slug: "retirement-savings-goal",
        category: "financial",
        title: "Retirement Savings Goal Calculator",
        component: lazy(() => import("../components/calculators/Financial/RetirementSavingsGoalCalculator"))
    },
    {
        slug: "emergency-fund-goal",
        category: "financial",
        title: "Emergency Fund Goal Calculator",
        component: lazy(() => import("../components/calculators/Financial/EmergencyFundGoalCalculator"))
    },
    {
        slug: "401k-retirement-savings-growth",
        category: "financial",
        title: "401(k) / Retirement Savings Growth Calculator",
        component: lazy(() => import("../components/calculators/Financial/401kRetirementSavingsGrowthCalculator"))
    },
    {
        slug: "social-security-benefit-estimator",
        category: "financial",
        title: "Social Security Benefit Estimator",
        component: lazy(() => import("../components/calculators/Financial/SocialSecurityBenefitEstimatorCalculator"))
    },
    {
        slug: "rule-of-72",
        category: "financial",
        title: "Rule of 72 Calculator",
        component: lazy(() => import("../components/calculators/Financial/RuleOf72Calculator"))
    },
    {
        slug: "bond-yield",
        category: "financial",
        title: "Bond Yield Calculator",
        component: lazy(() => import("../components/calculators/Financial/BondYieldCalculator"))
    },
    {
        slug: "roth-ira-conversion",
        category: "financial",
        title: "Roth IRA Conversion Calculator",
        component: lazy(() => import("../components/calculators/Financial/RothIraConversionCalculator"))
    },
    {
        slug: "dca-simulator",
        category: "financial",
        title: "Dollar Cost Averaging (DCA) Simulator",
        component: lazy(() => import("../components/calculators/Financial/DcaSimulatorCalculator"))
    },
    {
        slug: "crypto-dca-strategy",
        category: "financial",
        title: "Crypto DCA Strategy Calculator",
        component: lazy(() => import("../components/calculators/Financial/CryptoDcaStrategyCalculator"))
    },
    {
        slug: "stock-dca-return-estimator",
        category: "financial",
        title: "Stock DCA Return Estimator",
        component: lazy(() => import("../components/calculators/Financial/StockDcaReturnEstimatorCalculator"))
    },
    {
        slug: "monthly-budget-planner",
        category: "financial",
        title: "Monthly Budget Planner",
        component: lazy(() => import("../components/calculators/Financial/MonthlyBudgetPlannerCalculator"))
    },
    {
        slug: "net-income-after-tax",
        category: "financial",
        title: "Net Income after Tax Calculator",
        component: lazy(() => import("../components/calculators/Financial/NetIncomeAfterTaxCalculator"))
    },
    {
        slug: "hourly-to-annual-salary",
        category: "financial",
        title: "Hourly to Annual Salary Converter",
        component: lazy(() => import("../components/calculators/Financial/HourlyToAnnualSalaryCalculator"))
    },
    {
        slug: "debt-to-income-ratio",
        category: "financial",
        title: "Debt-to-Income Ratio Calculator",
        component: lazy(() => import("../components/calculators/Financial/DebtToIncomeRatioCalculator"))
    },
    {
        slug: "savings-rate-tracker",
        category: "financial",
        title: "Savings Rate Tracker",
        component: lazy(() => import("../components/calculators/Financial/SavingsRateTrackerCalculator"))
    },
    {
        slug: "expense-splitter-shared-bills",
        category: "financial",
        title: "Expense Splitter (Shared Bills) Calculator",
        component: lazy(() => import("../components/calculators/Financial/ExpenseSplitterSharedBillsCalculator"))
    },
    {
        slug: "take-home-pay",
        category: "financial",
        title: "Take-Home Pay Calculator",
        component: lazy(() => import("../components/calculators/Financial/TakeHomePayCalculator"))
    },
    {
        slug: "paycheck-calculator",
        category: "financial",
        title: "Paycheck Calculator",
        component: lazy(() => import("../components/calculators/Financial/PaycheckCalculator"))
    },
    {
        slug: "absence-percentage-calculator",
        category: "financial",
        title: "Absence Percentage Calculator",
        component: lazy(() => import("../components/calculators/Financial/AbsencePercentageCalculator"))
    },
    {
        slug: "credit-card-payoff",
        category: "financial",
        title: "Credit Card Payoff Calculator",
        component: lazy(() => import("../components/calculators/Financial/CreditCardPayoffCalculator"))
    },
    {
        slug: "debt-consolidation",
        category: "financial",
        title: "Debt Consolidation Calculator",
        component: lazy(() => import("../components/calculators/Financial/DebtConsolidationCalculator"))
    },
    {
        slug: "net-worth",
        category: "financial",
        title: "Net Worth Calculator",
        component: lazy(() => import("../components/calculators/Financial/NetWorthCalculator"))
    },
    {
        slug: "currency-converter-live",
        category: "financial",
        title: "Currency Converter (Live Rates)",
        component: lazy(() => import("../components/calculators/Financial/CurrencyConverterLiveCalculator"))
    },
    {
        slug: "sales-tax",
        category: "financial",
        title: "Sales Tax Calculator",
        component: lazy(() => import("../components/calculators/Financial/SalesTaxCalculator"))
    },
    {
        slug: "vat-gst",
        category: "financial",
        title: "VAT/GST Calculator",
        component: lazy(() => import("../components/calculators/Financial/VatGstCalculator"))
    },
    {
        slug: "debt-snowball",
        category: "financial",
        title: "Debt Snowball Calculator",
        component: lazy(() => import("../components/calculators/Financial/DebtSnowballCalculator"))
    },
    {
        slug: "apr",
        category: "financial",
        title: "APR Calculator",
        component: lazy(() => import("../components/calculators/Financial/AprCalculator"))
    },
    {
        slug: "credit-card-interest",
        category: "financial",
        title: "Credit Card Interest Calculator",
        component: lazy(() => import("../components/calculators/Financial/CreditCardInterestCalculator"))
    },
    {
        slug: "loan-comparison",
        category: "financial",
        title: "Loan Comparison Calculator",
        component: lazy(() => import("../components/calculators/Financial/LoanComparisonCalculator"))
    },
    {
        slug: "college-savings",
        category: "financial",
        title: "College Savings Calculator",
        component: lazy(() => import("../components/calculators/Financial/CollegeSavingsCalculator"))
    },
    {
        slug: "irr-npv",
        category: "financial",
        title: "IRR NPV Calculator",
        component: lazy(() => import("../components/calculators/Financial/IrrNpvCalculator"))
    },
    {
        slug: "tax-bracket",
        category: "financial",
        title: "Tax Bracket Calculator",
        component: lazy(() => import("../components/calculators/Financial/TaxBracketCalculator"))
    },
    {
        slug: "crypto-to-fiat",
        category: "financial",
        title: "Crypto to Fiat Converter",
        component: lazy(() => import("../components/calculators/Financial/CryptoToFiatCalculator"))
    },
    {
        slug: "crypto-to-crypto-exchange-rate",
        category: "financial",
        title: "Crypto to Crypto Exchange Rate Calculator",
        component: lazy(() => import("../components/calculators/Financial/CryptoToCryptoExchangeRateCalculator"))
    },
    {
        slug: "live-price-checker",
        category: "financial",
        title: "Live Price Checker (Real-Time Rates)",
        component: lazy(() => import("../components/calculators/Financial/LivePriceCheckerCalculator"))
    },
    {
        slug: "portfolio-value-tracker",
        category: "financial",
        title: "Portfolio Value Tracker",
        component: lazy(() => import("../components/calculators/Financial/PortfolioValueTrackerCalculator"))
    },
    {
        slug: "fiat-to-crypto-purchase",
        category: "financial",
        title: "Fiat to Crypto Purchase Calculator",
        component: lazy(() => import("../components/calculators/Financial/FiatToCryptoPurchaseCalculator"))
    },
    {
        slug: "multi-currency-crypto-converter",
        category: "financial",
        title: "Multi-Currency Crypto Converter",
        component: lazy(() => import("../components/calculators/Financial/MultiCurrencyCryptoConverterCalculator"))
    },
    {
        slug: "crypto-profit-loss",
        category: "financial",
        title: "Crypto Profit/Loss Calculator",
        component: lazy(() => import("../components/calculators/Financial/CryptoProfitLossCalculator"))
    },
    {
        slug: "crypto-roi",
        category: "financial",
        title: "ROI (Return on Investment) Calculator",
        component: lazy(() => import("../components/calculators/Financial/CryptoRoiCalculator"))
    },
    {
        slug: "crypto-future-value-compound-growth",
        category: "financial",
        title: "Future Value & Compound Growth Estimator",
        component: lazy(() => import("../components/calculators/Financial/CryptoFutureValueCompoundGrowthCalculator"))
    },
    {
        slug: "yield-farming-apy",
        category: "financial",
        title: "Yield Farming APY Calculator",
        component: lazy(() => import("../components/calculators/Financial/YieldFarmingApyCalculator"))
    },
    {
        slug: "staking-rewards-estimator",
        category: "financial",
        title: "Staking Rewards Estimator",
        component: lazy(() => import("../components/calculators/Financial/StakingRewardsEstimatorCalculator"))
    },
    {
        slug: "investment-break-even-point",
        category: "financial",
        title: "Investment Break-Even Point Calculator",
        component: lazy(() => import("../components/calculators/Financial/InvestmentBreakEvenPointCalculator"))
    },
    {
        slug: "dca-strategy-analyzer-crypto",
        category: "financial",
        title: "DCA Strategy Analyzer (Crypto)",
        component: lazy(() => import("../components/calculators/Financial/DcaStrategyAnalyzerCryptoCalculator"))
    },
    {
        slug: "mining-profitability",
        category: "financial",
        title: "Mining Profitability Calculator",
        component: lazy(() => import("../components/calculators/Financial/MiningProfitabilityCalculator"))
    },
    {
        slug: "hash-rate-to-earnings",
        category: "financial",
        title: "Hash Rate to Earnings Converter",
        component: lazy(() => import("../components/calculators/Financial/HashRateToEarningsCalculator"))
    },
    {
        slug: "electricity-cost-vs-mining-revenue",
        category: "financial",
        title: "Electricity Cost vs Mining Revenue",
        component: lazy(() => import("../components/calculators/Financial/ElectricityCostVsMiningRevenueCalculator"))
    },
    {
        slug: "gpu-asic-mining-roi",
        category: "financial",
        title: "GPU/ASIC Mining ROI Calculator",
        component: lazy(() => import("../components/calculators/Financial/GpuAsicMiningRoiCalculator"))
    },
    {
        slug: "pool-fee-impact",
        category: "financial",
        title: "Pool Fee Impact Estimator",
        component: lazy(() => import("../components/calculators/Financial/PoolFeeImpactCalculator"))
    },
    {
        slug: "crypto-tax-liability",
        category: "financial",
        title: "Crypto Tax Liability Calculator",
        component: lazy(() => import("../components/calculators/Financial/CryptoTaxLiabilityCalculator"))
    },
    {
        slug: "capital-gains-tax-estimator",
        category: "financial",
        title: "Capital Gains Tax Estimator",
        component: lazy(() => import("../components/calculators/Financial/CapitalGainsTaxEstimatorCalculator"))
    },
    {
        slug: "transaction-fee-deduction",
        category: "financial",
        title: "Transaction Fee Deduction Tool",
        component: lazy(() => import("../components/calculators/Financial/TransactionFeeDeductionCalculator"))
    },
    {
        slug: "cost-basis-fifo-lifo",
        category: "financial",
        title: "Cost Basis Calculator (FIFO/LIFO)",
        component: lazy(() => import("../components/calculators/Financial/CostBasisFifoLifoCalculator"))
    },
    {
        slug: "leverage-margin-profit",
        category: "financial",
        title: "Leverage & Margin Profit Calculator",
        component: lazy(() => import("../components/calculators/Financial/LeverageMarginProfitCalculator"))
    },
    {
        slug: "position-size-risk-management",
        category: "financial",
        title: "Position Size & Risk Management Tool",
        component: lazy(() => import("../components/calculators/Financial/PositionSizeRiskManagementCalculator"))
    },
    {
        slug: "volatility-risk-assessment",
        category: "financial",
        title: "Volatility & Risk Assessment Calculator",
        component: lazy(() => import("../components/calculators/Financial/VolatilityRiskAssessmentCalculator"))
    },
    {
        slug: "bmi-body-mass-index",
        category: "health",
        title: "BMI — Body Mass Index Calculator",
        component: lazy(() => import("../components/calculators/Health/BmiBodyMassIndexCalculator"))
    },
    {
        slug: "bmr-mifflin-st-jeor",
        category: "health",
        title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)",
        component: lazy(() => import("../components/calculators/Health/BmrMifflinStJeorCalculator"))
    },
    {
        slug: "tdee-daily-energy-expenditure",
        category: "health",
        title: "TDEE — Total Daily Energy Expenditure Calculator",
        component: lazy(() => import("../components/calculators/Health/TdeeDailyEnergyExpenditureCalculator"))
    },
    {
        slug: "body-fat-us-navy-3-sites",
        category: "health",
        title: "Body Fat % (US Navy / 3-sites)",
        component: lazy(() => import("../components/calculators/Health/BodyFatUsNavy3SitesCalculator"))
    },
    {
        slug: "ideal-weight-range-hamwi-devine-miller",
        category: "health",
        title: "Ideal Weight Range (Hamwi/Devine/Miller)",
        component: lazy(() => import("../components/calculators/Health/IdealWeightRangeHamwiDevineMillerCalculator"))
    },
    {
        slug: "waist-to-height-ratio",
        category: "health",
        title: "Waist-to-Height Ratio Checker",
        component: lazy(() => import("../components/calculators/Health/WaistToHeightRatioCalculator"))
    },
    {
        slug: "body-surface-area-bsa",
        category: "health",
        title: "Body Surface Area (BSA) Calculator",
        component: lazy(() => import("../components/calculators/Health/BodySurfaceAreaBsaCalculator"))
    },
    {
        slug: "daily-calorie-needs-goal",
        category: "health",
        title: "Daily Calorie Needs (Goal-based)",
        component: lazy(() => import("../components/calculators/Health/DailyCalorieNeedsGoalCalculator"))
    },
    {
        slug: "weight-loss-date-deficit-planner",
        category: "health",
        title: "Weight Loss Date & Deficit Planner",
        component: lazy(() => import("../components/calculators/Health/WeightLossDateDeficitPlannerCalculator"))
    },
    {
        slug: "macro-split-planner",
        category: "health",
        title: "Macro Split Planner (Protein/Carb/Fat)",
        component: lazy(() => import("../components/calculators/Health/MacroSplitPlannerCalculator"))
    },
    {
        slug: "protein-intake-by-goal",
        category: "health",
        title: "Protein Intake by Goal (cut/bulk/maintain)",
        component: lazy(() => import("../components/calculators/Health/ProteinIntakeByGoalCalculator"))
    },
    {
        slug: "carb-target-low-carb-keto",
        category: "health",
        title: "Carb Target (incl. low-carb/keto ranges)",
        component: lazy(() => import("../components/calculators/Health/CarbTargetLowCarbKetoCalculator"))
    },
    {
        slug: "fat-intake-range-amdr",
        category: "health",
        title: "Fat Intake Range (AMDR)",
        component: lazy(() => import("../components/calculators/Health/FatIntakeRangeAmdrCalculator"))
    },
    {
        slug: "fiber-intake-target",
        category: "health",
        title: "Fiber Intake Target (by kcal/sexo)",
        component: lazy(() => import("../components/calculators/Health/FiberIntakeTargetCalculator"))
    },
    {
        slug: "water-intake-per-day",
        category: "health",
        title: "Water Intake per Day (by weight/activity/climate)",
        component: lazy(() => import("../components/calculators/Health/WaterIntakePerDayCalculator"))
    },
    {
        slug: "meal-calories-split",
        category: "health",
        title: "Meal Calories Split (breakfast/lunch/dinner/snacks)",
        component: lazy(() => import("../components/calculators/Health/MealCaloriesSplitCalculator"))
    },
    {
        slug: "running-pace-speed-splits",
        category: "health",
        title: "Running Pace, Speed & Split Calculator",
        component: lazy(() => import("../components/calculators/Health/RunningPaceSpeedSplitsCalculator"))
    },
    {
        slug: "calories-burned-met",
        category: "health",
        title: "Calories Burned by Activity (MET-based)",
        component: lazy(() => import("../components/calculators/Health/CaloriesBurnedMetCalculator"))
    },
    {
        slug: "heart-rate-zones",
        category: "health",
        title: "Heart Rate Zones (Karvonen/percentages)",
        component: lazy(() => import("../components/calculators/Health/HeartRateZonesCalculator"))
    },
    {
        slug: "vo2max-estimator-cooper-rockport",
        category: "health",
        title: "VO2max Estimator (Cooper/Rockport)",
        component: lazy(() => import("../components/calculators/Sports/Vo2maxEstimatorCooperRockportCalculator"))
    },
    {
        slug: "one-rep-max-1rm-epley-brzycki",
        category: "health",
        title: "1RM — One-Rep Max (Epley/Brzycki)",
        component: lazy(() => import("../components/calculators/Health/OneRepMax1rmEpleyBrzyckiCalculator"))
    },
    {
        slug: "steps-distance-calories-converter",
        category: "health",
        title: "Steps ↔ Distance ↔ Calories Converter",
        component: lazy(() => import("../components/calculators/Health/StepsDistanceCaloriesConverterCalculator"))
    },
    {
        slug: "ovulation-fertile-window",
        category: "health",
        title: "Ovulation & Fertile Window Estimator",
        component: lazy(() => import("../components/calculators/Health/OvulationFertileWindowCalculator"))
    },
    {
        slug: "pregnancy-due-date-naegele",
        category: "health",
        title: "Pregnancy Due-Date (Naegele)",
        component: lazy(() => import("../components/calculators/Health/PregnancyDueDateNaegeleCalculator"))
    },
    {
        slug: "pregnancy-weight-gain-range-bmi-aware",
        category: "health",
        title: "Pregnancy Weight-Gain Range (BMI-aware)",
        component: lazy(() => import("../components/calculators/Health/PregnancyWeightGainRangeBmiAwareCalculator"))
    },
    {
        slug: "tdee-gestation-adjusted",
        category: "health",
        title: "Gestational TDEE (educational)",
        component: lazy(() => import("../components/calculators/Health/TdeeGestationAdjustedCalculator"))
    },
    {
        slug: "length-m-ft-in",
        category: "conversion",
        title: "Length: m ↔ ft ↔ in",
        component: lazy(() => import("../components/calculators/Conversion/LengthMFtInCalculator"))
    },
    {
        slug: "area-m2-ft2",
        category: "conversion",
        title: "Area: m² ↔ ft²",
        component: lazy(() => import("../components/calculators/Conversion/AreaM2Ft2Calculator"))
    },
    {
        slug: "volume-l-ml-gal-oz",
        category: "conversion",
        title: "Volume: L ↔ mL ↔ gal ↔ oz",
        component: lazy(() => import("../components/calculators/Conversion/VolumeLMlGalOzCalculator"))
    },
    {
        slug: "mass-kg-lb-oz",
        category: "conversion",
        title: "Mass: kg ↔ lb ↔ oz",
        component: lazy(() => import("../components/calculators/Conversion/MassKgLbOzCalculator"))
    },
    {
        slug: "temperature-c-f-k",
        category: "conversion",
        title: "Temperature: °C ↔ °F ↔ K",
        component: lazy(() => import("../components/calculators/Conversion/TemperatureCFKCalculator"))
    },
    {
        slug: "density-g-per-ml-kg-per-m3",
        category: "conversion",
        title: "Density: g/mL ↔ kg/m³",
        component: lazy(() => import("../components/calculators/Conversion/DensityGPerMlKgPerM3Calculator"))
    },
    {
        slug: "angle-deg-rad",
        category: "conversion",
        title: "Angle: deg ↔ rad",
        component: lazy(() => import("../components/calculators/Conversion/AngleDegRadCalculator"))
    },
    {
        slug: "speed-mps-kmph-mph",
        category: "conversion",
        title: "Speed: m/s ↔ km/h ↔ mph",
        component: lazy(() => import("../components/calculators/Conversion/SpeedMpsKmphMphCalculator"))
    },
    {
        slug: "force-n-lbf",
        category: "conversion",
        title: "Force: N ↔ lbf",
        component: lazy(() => import("../components/calculators/Conversion/ForceNLbfCalculator"))
    },
    {
        slug: "energy-j-cal-kwh",
        category: "conversion",
        title: "Energy: J ↔ cal ↔ kWh",
        component: lazy(() => import("../components/calculators/Conversion/EnergyJCalKwhCalculator"))
    },
    {
        slug: "power-w-hp",
        category: "conversion",
        title: "Power: W ↔ hp",
        component: lazy(() => import("../components/calculators/Conversion/PowerWHpCalculator"))
    },
    {
        slug: "pressure-pa-bar-psi",
        category: "conversion",
        title: "Pressure: Pa ↔ bar ↔ psi",
        component: lazy(() => import("../components/calculators/Conversion/PressurePaBarPsiCalculator"))
    },
    {
        slug: "torque-nm-lbfft",
        category: "conversion",
        title: "Torque: N·m ↔ lbf·ft",
        component: lazy(() => import("../components/calculators/Conversion/TorqueNmLbfftCalculator"))
    },
    {
        slug: "work-potential-energy",
        category: "conversion",
        title: "Work & Potential Energy",
        component: lazy(() => import("../components/calculators/Conversion/WorkPotentialEnergyCalculator"))
    },
    {
        slug: "time-ms-s-min-hr",
        category: "conversion",
        title: "Time: ms ↔ s ↔ min ↔ hr",
        component: lazy(() => import("../components/calculators/Conversion/TimeMsSMinHrCalculator"))
    },
    {
        slug: "frequency-hz-khz-mhz",
        category: "conversion",
        title: "Frequency: Hz ↔ kHz ↔ MHz",
        component: lazy(() => import("../components/calculators/Conversion/FrequencyHzKhzMhzCalculator"))
    },
    {
        slug: "period-frequency",
        category: "conversion",
        title: "Period ↔ Frequency",
        component: lazy(() => import("../components/calculators/Conversion/PeriodFrequencyCalculator"))
    },
    {
        slug: "frame-rate-fps-hz",
        category: "conversion",
        title: "Frame Rate: fps ↔ Hz",
        component: lazy(() => import("../components/calculators/Conversion/FrameRateFpsHzCalculator"))
    },
    {
        slug: "clock-time-timezone-shift",
        category: "conversion",
        title: "Clock Time & Timezone Shift",
        component: lazy(() => import("../components/calculators/Conversion/ClockTimeTimezoneShiftCalculator"))
    },
    {
        slug: "bytes-b-kb-mb-gb-tb",
        category: "conversion",
        title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
        component: lazy(() => import("../components/calculators/Conversion/BytesBKbMbGbTbCalculator"))
    },
    {
        slug: "bits-b-kb-mb-gb",
        category: "conversion",
        title: "Bits: b ↔ kb ↔ Mb ↔ Gb",
        component: lazy(() => import("../components/calculators/Conversion/BitsBKbMbGbCalculator"))
    },
    {
        slug: "binary-decimal-prefixes",
        category: "conversion",
        title: "Binary ↔ Decimal prefixes (KiB ↔ KB)",
        component: lazy(() => import("../components/calculators/Conversion/BinaryDecimalPrefixesCalculator"))
    },
    {
        slug: "transfer-speed-mbps-mbs",
        category: "conversion",
        title: "Transfer Speed: Mbps ↔ MB/s",
        component: lazy(() => import("../components/calculators/Conversion/TransferSpeedMbpsMbsCalculator"))
    },
    {
        slug: "compression-ratio-size",
        category: "conversion",
        title: "Compression Ratio & Size",
        component: lazy(() => import("../components/calculators/Conversion/CompressionRatioSizeCalculator"))
    },
    {
        slug: "checksum-hash-quick-tools",
        category: "conversion",
        title: "Checksum & Hash Quick Tools",
        component: lazy(() => import("../components/calculators/Conversion/ChecksumHashQuickToolsCalculator"))
    },
    {
        slug: "cooking-tsp-tbsp-cup-ml-conversion",
        category: "conversion",
        title: "Cooking: tsp/tbsp/cup ↔ mL",
        component: lazy(() => import("../components/calculators/Conversion/CookingTspTbspCupMlCalculator"))
    },
    {
        slug: "fuel-economy-l-per-100km-mpg",
        category: "conversion",
        title: "Fuel Economy: L/100km ↔ mpg",
        component: lazy(() => import("../components/calculators/Conversion/FuelEconomyLPer100kmMpgCalculator"))
    },
    {
        slug: "currency-fx-quick-convert",
        category: "conversion",
        title: "Currency: FX quick convert",
        component: lazy(() => import("../components/calculators/Conversion/CurrencyFxQuickConvertCalculator"))
    },
    {
        slug: "bmi-bsa-quick-estimators",
        category: "conversion",
        title: "BMI & BSA quick estimators",
        component: lazy(() => import("../components/calculators/Conversion/BmiBsaQuickEstimatorsCalculator"))
    },
    {
        slug: "paper-size-a-series-us",
        category: "conversion",
        title: "Paper Size: A-series ↔ US",
        component: lazy(() => import("../components/calculators/Conversion/PaperSizeASeriesUsCalculator"))
    },
    {
        slug: "shoe-size-eu-us-uk",
        category: "conversion",
        title: "Shoe Size: EU ↔ US ↔ UK",
        component: lazy(() => import("../components/calculators/Conversion/ShoeSizeEuUsUkCalculator"))
    },
    {
        slug: "cups-grams-ounces-by-ingredient",
        category: "cooking",
        title: "Cups ↔ Grams ↔ Ounces Converter",
        component: lazy(() => import("../components/calculators/Cooking/CupsGramsOuncesByIngredientCalculator"))
    },
    {
        slug: "volume-weight-food-density",
        category: "cooking",
        title: "Volume ↔ Weight Converter",
        component: lazy(() => import("../components/calculators/Cooking/VolumeWeightFoodDensityCalculator"))
    },
    {
        slug: "fahrenheit-celsius-oven-internal-temp",
        category: "cooking",
        title: "Fahrenheit ↔ Celsius Converter",
        component: lazy(() => import("../components/calculators/Cooking/FahrenheitCelsiusOvenInternalTempCalculator"))
    },
    {
        slug: "teaspoon-tablespoon-cup-ml-converter",
        category: "cooking",
        title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
        component: lazy(() => import("../components/calculators/Cooking/TeaspoonTablespoonCupMlConverterCalculator"))
    },
    {
        slug: "recipe-scaler",
        category: "cooking",
        title: "Recipe Scaler (x0.5, x2, x3…)",
        component: lazy(() => import("../components/calculators/Cooking/RecipeScalerCalculator"))
    },
    {
        slug: "serving-size-multiplier",
        category: "cooking",
        title: "Serving Size Multiplier",
        component: lazy(() => import("../components/calculators/Cooking/ServingSizeMultiplierCalculator"))
    },
    {
        slug: "salt-percent-brining",
        category: "cooking",
        title: "Salt % for Brining Calculator",
        component: lazy(() => import("../components/calculators/Cooking/SaltPercentBriningCalculator"))
    },
    {
        slug: "alcohol-abv-dilution",
        category: "cooking",
        title: "Alcohol by Volume (ABV) Dilution",
        component: lazy(() => import("../components/calculators/Cooking/AlcoholAbvDilutionCalculator"))
    },
    {
        slug: "cake-pan-size-volume-converter",
        category: "cooking",
        title: "Cake Pan Size & Volume Converter",
        component: lazy(() => import("../components/calculators/Cooking/CakePanSizeVolumeConverterCalculator"))
    },
    {
        slug: "bakers-percentage",
        category: "cooking",
        title: "Baker’s Percentage Calculator",
        component: lazy(() => import("../components/calculators/Cooking/BakersPercentageCalculator"))
    },
    {
        slug: "dough-hydration-percent",
        category: "cooking",
        title: "Dough Hydration % Calculator",
        component: lazy(() => import("../components/calculators/Cooking/DoughHydrationPercentCalculator"))
    },
    {
        slug: "sourdough-starter-ratio-feed-planner",
        category: "cooking",
        title: "Sourdough Starter Ratio & Feed Planner",
        component: lazy(() => import("../components/calculators/Cooking/SourdoughStarterRatioFeedPlannerCalculator"))
    },
    {
        slug: "yeast-conversion-instant-active-fresh",
        category: "cooking",
        title: "Yeast Conversion Calculator",
        component: lazy(() => import("../components/calculators/Cooking/YeastConversionInstantActiveFreshCalculator"))
    },
    {
        slug: "flour-blend-substitution",
        category: "cooking",
        title: "Flour Blend Substitution Helper",
        component: lazy(() => import("../components/calculators/Cooking/FlourBlendSubstitutionCalculator"))
    },
    {
        slug: "sugar-butter-flour-density-lookup",
        category: "cooking",
        title: "Sugar/Butter/Flour Density Lookup",
        component: lazy(() => import("../components/calculators/Cooking/SugarButterFlourDensityLookupCalculator"))
    },
    {
        slug: "chocolate-butter-tempering-temperature",
        category: "cooking",
        title: "Chocolate/Butter Tempering Temperature",
        component: lazy(() => import("../components/calculators/Cooking/ChocolateButterTemperingTemperatureCalculator"))
    },
    {
        slug: "turkey-thaw-cook-time",
        category: "cooking",
        title: "Turkey Size, Thaw & Cook Time Calculator",
        component: lazy(() => import("../components/calculators/Cooking/TurkeyThawCookTimeCalculator"))
    },
    {
        slug: "whole-chicken-roast-cook-time",
        category: "cooking",
        title: "Whole Chicken/Roast Cook Time Estimator",
        component: lazy(() => import("../components/calculators/Cooking/WholeChickenRoastCookTimeCalculator"))
    },
    {
        slug: "steak-doneness-time-resting",
        category: "cooking",
        title: "Steak Doneness Time & Resting Window",
        component: lazy(() => import("../components/calculators/Cooking/SteakDonenessTimeRestingCalculator"))
    },
    {
        slug: "pork-beef-smoking-time-per-lb",
        category: "cooking",
        title: "Pork/Beef Smoking Time per lb",
        component: lazy(() => import("../components/calculators/Cooking/PorkBeefSmokingTimePerLbCalculator"))
    },
    {
        slug: "safe-internal-temperature-checker",
        category: "cooking",
        title: "Safe Internal Temperature Checker",
        component: lazy(() => import("../components/calculators/Cooking/SafeInternalTemperatureCheckerCalculator"))
    },
    {
        slug: "defrost-time-fridge-cold-water",
        category: "cooking",
        title: "Defrost Time Estimator",
        component: lazy(() => import("../components/calculators/Cooking/DefrostTimeFridgeColdWaterCalculator"))
    },
    {
        slug: "rice-water-ratio-yield",
        category: "cooking",
        title: "Rice:Water Ratio & Yield Calculator",
        component: lazy(() => import("../components/calculators/Cooking/RiceWaterRatioYieldCalculator"))
    },
    {
        slug: "pasta-dry-cooked-yield-portions",
        category: "cooking",
        title: "Pasta Dry ↔ Cooked Yield & Portions",
        component: lazy(() => import("../components/calculators/Cooking/PastaDryCookedYieldPortionsCalculator"))
    },
    {
        slug: "stock-broth-reduction-time-yield",
        category: "cooking",
        title: "Stock/Broth Reduction Time & Yield",
        component: lazy(() => import("../components/calculators/Cooking/StockBrothReductionTimeYieldCalculator"))
    },
    {
        slug: "oil-for-frying-pan-depth-volume",
        category: "cooking",
        title: "Oil for Frying Calculator",
        component: lazy(() => import("../components/calculators/Cooking/OilForFryingPanDepthVolumeCalculator"))
    },
    {
        slug: "icing-frosting-coverage-cake-size",
        category: "cooking",
        title: "Icing/Frosting Coverage by Cake Size",
        component: lazy(() => import("../components/calculators/Cooking/IcingFrostingCoverageCakeSizeCalculator"))
    },
    {
        slug: "percent-of-total",
        category: "math",
        title: "Percent of Total Calculator",
        component: lazy(() => import("../components/calculators/Math/PercentOfTotalCalculator"))
    },
    {
        slug: "percent-increase-decrease",
        category: "math",
        title: "Percent Increase/Decrease Calculator",
        component: lazy(() => import("../components/calculators/Math/PercentIncreaseDecreaseCalculator"))
    },
    {
        slug: "percent-change",
        category: "math",
        title: "Percent Change Calculator",
        component: lazy(() => import("../components/calculators/Math/PercentChangeCalculator"))
    },
    {
        slug: "fraction-decimal-converter",
        category: "math",
        title: "Fraction ⇄ Decimal Converter",
        component: lazy(() => import("../components/calculators/Math/FractionDecimalConverterCalculator"))
    },
    {
        slug: "fraction-reducer-simplifier",
        category: "math",
        title: "Fraction Reducer / Simplifier",
        component: lazy(() => import("../components/calculators/Math/FractionReducerSimplifierCalculator"))
    },
    {
        slug: "ratio-calculator",
        category: "math",
        title: "Ratio Calculator (A:B = C:D)",
        component: lazy(() => import("../components/calculators/Math/RatioCalculator"))
    },
    {
        slug: "percent-error-calculator",
        category: "math",
        title: "Percent Error Calculator",
        component: lazy(() => import("../components/calculators/Math/PercentErrorCalculator"))
    },
    {
        slug: "proportion-solver",
        category: "math",
        title: "Proportion Solver (Cross-Multiplication)",
        component: lazy(() => import("../components/calculators/Math/ProportionSolverCalculator"))
    },
    {
        slug: "quadratic-equation-solver",
        category: "math",
        title: "Quadratic Equation Solver (ax²+bx+c)",
        component: lazy(() => import("../components/calculators/Math/QuadraticEquationSolverCalculator"))
    },
    {
        slug: "linear-equation-solver-1-2-variables",
        category: "math",
        title: "Linear Equation Solver (1–2 variables)",
        component: lazy(() => import("../components/calculators/Math/LinearEquationSolver12VariablesCalculator"))
    },
    {
        slug: "system-of-equations-substitution-elimination",
        category: "math",
        title: "System of Equations Solver (Substitution/Elimination)",
        component: lazy(() => import("../components/calculators/Math/SystemOfEquationsSubstitutionEliminationCalculator"))
    },
    {
        slug: "exponent-power-calculator",
        category: "math",
        title: "Exponent & Power Calculator",
        component: lazy(() => import("../components/calculators/Math/ExponentPowerCalculator"))
    },
    {
        slug: "log-antilog-base-10-e",
        category: "math",
        title: "Log / Antilog (base 10/e) Calculator",
        component: lazy(() => import("../components/calculators/Math/LogAntilogBase10ECalculator"))
    },
    {
        slug: "scientific-notation-standard-form",
        category: "math",
        title: "Scientific Notation ⇄ Standard Form",
        component: lazy(() => import("../components/calculators/Math/ScientificNotationStandardFormCalculator"))
    },
    {
        slug: "polynomial-factorization-helper",
        category: "math",
        title: "Polynomial Factorization Helper",
        component: lazy(() => import("../components/calculators/Math/PolynomialFactorizationHelperCalculator"))
    },
    {
        slug: "root-radical-simplifier",
        category: "math",
        title: "Root/Radical Simplifier",
        component: lazy(() => import("../components/calculators/Math/RootRadicalSimplifierCalculator"))
    },
    {
        slug: "gcf-gcd-calculator",
        category: "math",
        title: "GCF / GCD Calculator",
        component: lazy(() => import("../components/calculators/Math/GcfGcdCalculator"))
    },
    {
        slug: "lcm-calculator",
        category: "math",
        title: "LCM Calculator",
        component: lazy(() => import("../components/calculators/Math/LcmCalculator"))
    },
    {
        slug: "prime-factorization-tool",
        category: "math",
        title: "Prime Factorization Tool",
        component: lazy(() => import("../components/calculators/Math/PrimeFactorizationToolCalculator"))
    },
    {
        slug: "modulo-remainder-calculator",
        category: "math",
        title: "Modulo (Remainder) Calculator",
        component: lazy(() => import("../components/calculators/Math/ModuloRemainderCalculator"))
    },
    {
        slug: "permutations-combinations-npr-ncr",
        category: "math",
        title: "Permutations & Combinations (nPr / nCr)",
        component: lazy(() => import("../components/calculators/Math/PermutationsCombinationsNprNcrCalculator"))
    },
    {
        slug: "random-number-generator-ranges",
        category: "math",
        title: "Random Number Generator (ranges)",
        component: lazy(() => import("../components/calculators/Math/RandomNumberGeneratorRangesCalculator"))
    },
    {
        slug: "triangle-solver-sss-sas-asa",
        category: "math",
        title: "Triangle Solver (SSS/SAS/ASA)",
        component: lazy(() => import("../components/calculators/Math/TriangleSolverSssSasAsaCalculator"))
    },
    {
        slug: "circle-area-circumference",
        category: "math",
        title: "Circle Area / Circumference Calculator",
        component: lazy(() => import("../components/calculators/Math/CircleAreaCircumferenceCalculator"))
    },
    {
        slug: "rectangle-parallelogram-area",
        category: "math",
        title: "Rectangle & Parallelogram Area Calculator",
        component: lazy(() => import("../components/calculators/Math/RectangleParallelogramAreaCalculator"))
    },
    {
        slug: "pythagorean-theorem-solver",
        category: "math",
        title: "Pythagorean Theorem Solver",
        component: lazy(() => import("../components/calculators/Math/PythagoreanTheoremSolverCalculator"))
    },
    {
        slug: "trig-functions-angle-side-finder",
        category: "math",
        title: "Trig Functions (sin/cos/tan) Angle/Side Finder",
        component: lazy(() => import("../components/calculators/Math/TrigFunctionsAngleSideFinderCalculator"))
    },
    {
        slug: "shapes-area-volume-pack",
        category: "math",
        title: "2D/3D Shapes Area & Volume Pack",
        component: lazy(() => import("../components/calculators/Math/ShapesAreaVolumePackCalculator"))
    },
    {
        slug: "angle-converter-deg-rad",
        category: "math",
        title: "Angle Converter (deg ↔ rad)",
        component: lazy(() => import("../components/calculators/Math/AngleConverterDegRadCalculator"))
    },
    {
        slug: "mean-median-mode",
        category: "math",
        title: "Mean, Median, Mode Calculator",
        component: lazy(() => import("../components/calculators/Math/MeanMedianModeCalculator"))
    },
    {
        slug: "standard-deviation-variance-pop-sample",
        category: "math",
        title: "Standard Deviation & Variance (pop/sample)",
        component: lazy(() => import("../components/calculators/Math/StandardDeviationVariancePopSampleCalculator"))
    },
    {
        slug: "z-score-percentile-finder",
        category: "math",
        title: "Z-Score & Percentile Finder",
        component: lazy(() => import("../components/calculators/Math/ZScorePercentileFinderCalculator"))
    },
    {
        slug: "linear-interpolation-extrapolation",
        category: "math",
        title: "Linear Interpolation / Extrapolation",
        component: lazy(() => import("../components/calculators/Math/LinearInterpolationExtrapolationCalculator"))
    },
    {
        slug: "binomial-probability-calculator",
        category: "math",
        title: "Binomial Probability Calculator",
        component: lazy(() => import("../components/calculators/Math/BinomialProbabilityCalculator"))
    },
    {
        slug: "normal-cdf-pdf-estimator",
        category: "math",
        title: "Normal CDF / PDF Quick Estimator",
        component: lazy(() => import("../components/calculators/Math/NormalCdfPdfEstimatorCalculator"))
    },
    {
        slug: "kinematics-suvat-solver",
        category: "science",
        title: "Kinematics Equations Solver (SUVAT)",
        component: lazy(() => import("../components/calculators/Science/KinematicsSuvatSolverCalculator"))
    },
    {
        slug: "projectile-motion-calculator",
        category: "science",
        title: "Projectile Motion Calculator",
        component: lazy(() => import("../components/calculators/Science/ProjectileMotionCalculator"))
    },
    {
        slug: "force-work-energy-calculator",
        category: "science",
        title: "Force/Work/Energy Calculator",
        component: lazy(() => import("../components/calculators/Science/ForceWorkEnergyCalculator"))
    },
    {
        slug: "free-fall-time-velocity-estimator",
        category: "science",
        title: "Free Fall Time & Velocity",
        component: lazy(() => import("../components/calculators/Science/FreeFallTimeVelocityEstimatorCalculator"))
    },
    {
        slug: "gravity-on-other-planets",
        category: "science",
        title: "Gravity on other Planets",
        component: lazy(() => import("../components/calculators/Science/GravityOnOtherPlanetsCalculator"))
    },
    {
        slug: "orbital-period-kepler-estimator",
        category: "science",
        title: "Orbital Period (Kepler)",
        component: lazy(() => import("../components/calculators/Science/OrbitalPeriodKeplerEstimatorCalculator"))
    },
    {
        slug: "escape-velocity",
        category: "science",
        title: "Escape Velocity",
        component: lazy(() => import("../components/calculators/Science/EscapeVelocityCalculator"))
    },
    {
        slug: "momentum-impulse",
        category: "science",
        title: "Momentum & Impulse",
        component: lazy(() => import("../components/calculators/Science/MomentumImpulseCalculator"))
    },
    {
        slug: "uniform-circular-motion-centripetal",
        category: "science",
        title: "Uniform Circular Motion (Centripetal)",
        component: lazy(() => import("../components/calculators/Science/UniformCircularMotionCentripetalCalculator"))
    },
    {
        slug: "heat-transfer-conduction",
        category: "science",
        title: "Heat Transfer (Conduction)",
        component: lazy(() => import("../components/calculators/Science/HeatTransferConductionCalculator"))
    },
    {
        slug: "specific-heat-q-mc-delta-t",
        category: "science",
        title: "Specific Heat (Q=mcΔT)",
        component: lazy(() => import("../components/calculators/Science/SpecificHeatQMcDeltaTCalculator"))
    },
    {
        slug: "ideal-gas-law-pv-nrt",
        category: "science",
        title: "Ideal Gas Law (PV=nRT)",
        component: lazy(() => import("../components/calculators/Science/IdealGasLawPvNrtCalculator"))
    },
    {
        slug: "molar-mass",
        category: "science",
        title: "Molar Mass Calculator",
        component: lazy(() => import("../components/calculators/Science/MolarMassCalculator"))
    },
    {
        slug: "molarity-moles-volume",
        category: "science",
        title: "Molarity (Moles/Volume)",
        component: lazy(() => import("../components/calculators/Science/MolarityMolesVolumeCalculator"))
    },
    {
        slug: "molality-normality-converter",
        category: "science",
        title: "Molality/Normality Converter",
        component: lazy(() => import("../components/calculators/Science/MolalityNormalityConverterCalculator"))
    },
    {
        slug: "dilution-c1-v1-c2-v2",
        category: "science",
        title: "Dilution (C1V1=C2V2)",
        component: lazy(() => import("../components/calculators/Science/DilutionC1v1C2v2Calculator"))
    },
    {
        slug: "ph-poh-h-oh",
        category: "science",
        title: "pH/pOH/H+/OH- Calculator",
        component: lazy(() => import("../components/calculators/Science/PhPohHOhCalculator"))
    },
    {
        slug: "stoichiometry-limiting-reagent",
        category: "science",
        title: "Stoichiometry / Limiting Reagent",
        component: lazy(() => import("../components/calculators/Science/StoichiometryLimitingReagentCalculator"))
    },
    {
        slug: "percent-yield-theoretical-yield",
        category: "science",
        title: "Percent Yield & Theoretical Yield",
        component: lazy(() => import("../components/calculators/Science/PercentYieldTheoreticalYieldCalculator"))
    },
    {
        slug: "percent-composition-by-mass",
        category: "science",
        title: "Percent Composition by Mass",
        component: lazy(() => import("../components/calculators/Science/PercentCompositionByMassCalculator"))
    },
    {
        slug: "ppm-ppb-concentration-converter",
        category: "science",
        title: "ppm/ppb Concentration Converter",
        component: lazy(() => import("../components/calculators/Science/PpmPpbConcentrationConverterCalculator"))
    },
    {
        slug: "buffer-henderson-hasselbalch-helper",
        category: "science",
        title: "Buffer (Henderson-Hasselbalch) Helper",
        component: lazy(() => import("../components/calculators/Science/BufferHendersonHasselbalchHelperCalculator"))
    },
    {
        slug: "radioactive-activity-a-lambda-n",
        category: "science",
        title: "Radioactive Activity (A = λN)",
        component: lazy(() => import("../components/calculators/Science/RadioactiveActivityALambdaNCalculator"))
    },
    {
        slug: "half-life-exponential-decay",
        category: "science",
        title: "Half-Life (Exponential Decay)",
        component: lazy(() => import("../components/calculators/Science/HalfLifeExponentialDecayCalculator"))
    },
    {
        slug: "photon-energy-e-hf",
        category: "science",
        title: "Photon Energy (E=hf)",
        component: lazy(() => import("../components/calculators/Science/PhotonEnergyEHfCalculator"))
    },
    {
        slug: "blackbody-peak-wien-law-estimator",
        category: "science",
        title: "Blackbody Peak (Wien’s Law)",
        component: lazy(() => import("../components/calculators/Science/BlackbodyPeakWienLawEstimatorCalculator"))
    },
    {
        slug: "snells-law-critical-angle",
        category: "science",
        title: "Snell’s Law (Critical Angle)",
        component: lazy(() => import("../components/calculators/Science/SnellsLawCriticalAngleCalculator"))
    },
    {
        slug: "thin-lens-solver",
        category: "science",
        title: "Thin Lens Solver",
        component: lazy(() => import("../components/calculators/Science/ThinLensSolverCalculator"))
    },
    {
        slug: "wave-speed-frequency-wavelength",
        category: "science",
        title: "Wave Speed/Freq/Wavelength",
        component: lazy(() => import("../components/calculators/Science/WaveSpeedFrequencyWavelengthCalculator"))
    },
    {
        slug: "rc-time-constant-tau-rc",
        category: "science",
        title: "RC Time Constant (τ=RC)",
        component: lazy(() => import("../components/calculators/Science/RcTimeConstantTauRcCalculator"))
    },
    {
        slug: "power-efficiency",
        category: "science",
        title: "Power & Efficiency Calculator",
        component: lazy(() => import("../components/calculators/Science/PowerEfficiencyCalculator"))
    },
    {
        slug: "reactance-capacitor-inductor-educational",
        category: "science",
        title: "Reactance (Capacitor/Inductor)",
        component: lazy(() => import("../components/calculators/Science/ReactanceCapacitorInductorEducationalCalculator"))
    },
    {
        slug: "density-specific-gravity",
        category: "science",
        title: "Density & Specific Gravity",
        component: lazy(() => import("../components/calculators/Science/DensitySpecificGravityCalculator"))
    },
    {
        slug: "target-heart-rate-rpe-zones",
        category: "sports",
        title: "Target Heart Rate (RPE/zones)",
        component: lazy(() => import("../components/calculators/Sports/TargetHeartRateRpeZonesCalculator"))
    },
    {
        slug: "heart-rate-zones-karvonen",
        category: "sports",
        title: "Heart Rate Zones (Karvonen)",
        component: lazy(() => import("../components/calculators/Sports/HeartRateZonesKarvonenCalculator"))
    },
    {
        slug: "one-rep-max-1rm-sports",
        category: "sports",
        title: "One-Rep Max (1RM) Calculator",
        component: lazy(() => import("../components/calculators/Sports/OneRepMax1rmCalculator"))
    },
    {
        slug: "body-fat-percentage-sports",
        category: "sports",
        title: "Body Fat % Calculator",
        component: lazy(() => import("../components/calculators/Sports/BodyFatPercentageCalculator"))
    },
    {
        slug: "race-time-predictor-riegel",
        category: "sports",
        title: "Race Time Predictor (Riegel)",
        component: lazy(() => import("../components/calculators/Sports/RaceTimePredictorRiegelCalculator"))
    },
    {
        slug: "negative-split",
        category: "sports",
        title: "Negative Split Calculator",
        component: lazy(() => import("../components/calculators/Sports/NegativeSplitCalculator"))
    },
    {
        slug: "marathon-pace-planner",
        category: "sports",
        title: "Marathon/Half-Marathon Pace Planner",
        component: lazy(() => import("../components/calculators/Sports/RunningPaceSplitFinishTimeCalculator"))
    },
    {
        slug: "cycling-power-speed-estimator",
        category: "sports",
        title: "Cycling Power & Speed Estimator",
        component: lazy(() => import("../components/calculators/Sports/CyclingPowerSpeedEstimatorCalculator"))
    },
    {
        slug: "cycling-cadence",
        category: "sports",
        title: "Cycling Cadence Calculator",
        component: lazy(() => import("../components/calculators/Sports/CyclingCadenceCalculator"))
    },
    {
        slug: "ftp-zones-planner",
        category: "sports",
        title: "FTP Zones Planner",
        component: lazy(() => import("../components/calculators/Sports/FtpZonesPlannerCalculator"))
    },
    {
        slug: "swim-pace-css-splits",
        category: "sports",
        title: "Swim Pace (CSS) & Splits",
        component: lazy(() => import("../components/calculators/Sports/SwimPaceCssSplitsCalculator"))
    },
    {
        slug: "swim-interval-pace-calculator",
        category: "sports",
        title: "Swim Interval Pace Calculator",
        component: lazy(() => import("../components/calculators/Sports/SwimIntervalPaceCalculator"))
    },
    {
        slug: "swim-performance-level-calculator",
        category: "sports",
        title: "Swim Performance Level",
        component: lazy(() => import("../components/calculators/Sports/SwimPerformanceLevelCalculator"))
    },
    {
        slug: "fina-points-calculator",
        category: "sports",
        title: "FINA Points Calculator",
        component: lazy(() => import("../components/calculators/Sports/FinaPointsCalculator"))
    },
    {
        slug: "rowing-split-500m-pace-calculator",
        category: "sports",
        title: "Rowing Split (500m pace)",
        component: lazy(() => import("../components/calculators/Sports/RowingSplit500mPaceCalculator"))
    },
    {
        slug: "golf-handicap-calculator",
        category: "sports",
        title: "Golf Handicap Calculator",
        component: lazy(() => import("../components/calculators/Sports/GolfHandicapCalculator"))
    },
    {
        slug: "golf-handicap-differential-index",
        category: "sports",
        title: "Golf Handicap Differential & Index",
        component: lazy(() => import("../components/calculators/Sports/GolfHandicapDifferentialIndexCalculator"))
    },
    {
        slug: "golf-expected-putts-per-round",
        category: "sports",
        title: "Golf: Expected Putts per Round",
        component: lazy(() => import("../components/calculators/Sports/GolfExpectedPuttsPerRoundCalculator"))
    },
    {
        slug: "tennis-serve-speed-calculator",
        category: "sports",
        title: "Tennis Serve Speed Calculator",
        component: lazy(() => import("../components/calculators/Sports/TennisServeSpeedCalculator"))
    },
    {
        slug: "tennis-elo-rating-progress-calculator",
        category: "sports",
        title: "Tennis Elo Rating Progress",
        component: lazy(() => import("../components/calculators/Sports/TennisEloRatingProgressCalculator"))
    },
    {
        slug: "basketball-efg-ts-calculator",
        category: "sports",
        title: "Basketball: eFG% & TS%",
        component: lazy(() => import("../components/calculators/Sports/BasketballEfgTsCalculator"))
    },
    {
        slug: "basketball-pace-ortg-drtg-calculator",
        category: "sports",
        title: "Basketball: Pace, ORtg & DRtg",
        component: lazy(() => import("../components/calculators/Sports/BasketballPaceOrtgDrtgCalculator"))
    },
    {
        slug: "baseball-ops-slg-obp-calculator",
        category: "sports",
        title: "Baseball: OPS, SLG & OBP",
        component: lazy(() => import("../components/calculators/Sports/BaseballOpsSlgObpCalculator"))
    },
    {
        slug: "era-whip",
        category: "sports",
        title: "Baseball: ERA & WHIP",
        component: lazy(() => import("../components/calculators/Sports/EraWhipCalculator"))
    },
    {
        slug: "babip",
        category: "sports",
        title: "Baseball: BABIP Calculator",
        component: lazy(() => import("../components/calculators/Sports/BabipCalculator"))
    },
    {
        slug: "ground-ball-to-fly-ball-ratio-gb-fb",
        category: "sports",
        title: "Baseball: Ground Ball to Fly Ball Ratio (GB/FB)",
        component: lazy(() => import("../components/calculators/Sports/GroundBallToFlyBallRatioGbFbCalculator"))
    },
    {
        slug: "soccer-expected-goals-xg-helper",
        category: "sports",
        title: "Soccer: Expected Goals (xG) Helper",
        component: lazy(() => import("../components/calculators/Sports/ExpectedGoalsXgHelperCalculator"))
    },
    {
        slug: "soccer-league-table-points-gd",
        category: "sports",
        title: "Soccer: League Table Points & GD",
        component: lazy(() => import("../components/calculators/Sports/SoccerLeagueTablePointsGdCalculator"))
    },
    {
        slug: "betting-odds-payout",
        category: "sports",
        title: "Betting Odds & Payout",
        component: lazy(() => import("../components/calculators/Sports/BettingOddsPayoutCalculator"))
    },
    {
        slug: "win-probability-shift-wps",
        category: "sports",
        title: "Win Probability Shift (WPS)",
        component: lazy(() => import("../components/calculators/Sports/WinProbabilityShiftWpsCalculator"))
    },
    {
        slug: "tournament-bracket-seeding-helper",
        category: "sports",
        title: "Tournament Bracket & Seeding Helper",
        component: lazy(() => import("../components/calculators/Sports/TournamentBracketSeedingHelperCalculator"))
    },
    {
        slug: "fantasy-team-points-projections",
        category: "sports",
        title: "Fantasy Team Points Projections",
        component: lazy(() => import("../components/calculators/Sports/FantasyTeamPointsProjectionsCalculator"))
    },
    {
        slug: "wilks-coefficient-calculator",
        category: "sports",
        title: "Wilks Coefficient Calculator",
        component: lazy(() => import("../components/calculators/Sports/WilksCoefficientCalculator"))
    },
    {
        slug: "plate-loading-calculator",
        category: "sports",
        title: "Plate Loading Calculator",
        component: lazy(() => import("../components/calculators/Sports/PlateLoadingCalculator"))
    },
    {
        slug: "plank-hold-progression",
        category: "sports",
        title: "Plank Hold Progression Calculator",
        component: lazy(() => import("../components/calculators/Sports/PlankHoldProgressionCalculator"))
    },
    {
        slug: "060-speed-vs-gear-rpm",
        category: "automotive",
        title: "0-60 Speed vs Gear/RPM",
        component: lazy(() => import("../components/calculators/Automotive/060SpeedVsGearRpmCalculator"))
    },
    {
        slug: "used-car-value-estimator",
        category: "automotive",
        title: "Used Car Value Estimator",
        component: lazy(() => import("../components/calculators/Automotive/UsedCarValueEstimatorCalculator"))
    },
    {
        slug: "car-loan-payment-amortization-automotive",
        category: "automotive",
        title: "Car Loan Payment & Amortization",
        component: lazy(() => import("../components/calculators/Automotive/CarLoanPaymentAmortizationCalculator"))
    },
    {
        slug: "annual-fuel-cost-break-even",
        category: "automotive",
        title: "Annual Fuel Cost & Break-Even",
        component: lazy(() => import("../components/calculators/Automotive/AnnualFuelCostBreakEvenCalculator"))
    },
    {
        slug: "ev-charging-cost-time",
        category: "automotive",
        title: "EV Charging Cost & Time",
        component: lazy(() => import("../components/calculators/Automotive/EvChargingCostTimeCalculator"))
    },
    {
        slug: "ev-vs-gas-tco-comparison",
        category: "automotive",
        title: "EV vs Gas (TCO Comparison)",
        component: lazy(() => import("../components/calculators/Automotive/IceVsEvOwnershipCostCalculator"))
    },
    {
        slug: "trip-fuel-cost-calculator",
        category: "automotive",
        title: "Trip Fuel Cost Calculator",
        component: lazy(() => import("../components/calculators/Automotive/TripFuelCostCalculator"))
    },
    {
        slug: "towing-capacity-safety-margin",
        category: "automotive",
        title: "Towing Capacity Safety Margin",
        component: lazy(() => import("../components/calculators/Automotive/TowingCapacitySafetyMarginCalculator"))
    },
    {
        slug: "tire-size-comparison",
        category: "automotive",
        title: "Tire Size Comparison",
        component: lazy(() => import("../components/calculators/Automotive/TireSizeComparisonCalculator"))
    },
    {
        slug: "speedometer-error-tire-size",
        category: "automotive",
        title: "Speedometer Error (Tire Size)",
        component: lazy(() => import("../components/calculators/Automotive/SpeedometerErrorCalculator"))
    },
    {
        slug: "hp-from-quarter-mile-et",
        category: "automotive",
        title: "Horsepower from 1/4 Mile ET",
        component: lazy(() => import("../components/calculators/Automotive/HpFromQuarterMileEtCalculator"))
    },
    {
        slug: "torque-vs-horsepower",
        category: "automotive",
        title: "Torque vs Horsepower",
        component: lazy(() => import("../components/calculators/Automotive/HpToTorqueConverterCalculator"))
    },
    {
        slug: "engine-displacement-bore-stroke",
        category: "automotive",
        title: "Engine Displacement (Bore/Stroke)",
        component: lazy(() => import("../components/calculators/Automotive/EngineDisplacementCalculator"))
    },
    {
        slug: "compression-ratio-calculator",
        category: "automotive",
        title: "Compression Ratio Calculator",
        component: lazy(() => import("../components/calculators/Automotive/CompressionRatioCalculator"))
    },
    {
        slug: "dyno-correction-factor",
        category: "automotive",
        title: "Dyno Correction Factor",
        component: lazy(() => import("../components/calculators/Automotive/DynoCorrectionFactorCalculator"))
    },
    {
        slug: "carbon-emissions-per-trip",
        category: "automotive",
        title: "Carbon Emissions per Trip",
        component: lazy(() => import("../components/calculators/Automotive/CarbonEmissionsPerTripCalculator"))
    },
    {
        slug: "drywall-area-sheets",
        category: "construction",
        title: "Drywall Area & Sheets",
        component: lazy(() => import("../components/calculators/Construction/DrywallAreaSheetsCalculator"))
    },
    {
        slug: "concrete-slab-volume",
        category: "construction",
        title: "Concrete Slab Volume",
        component: lazy(() => import("../components/calculators/Construction/ConcreteSlabVolumeCalculator"))
    },
    {
        slug: "concrete-footing-foundation",
        category: "construction",
        title: "Concrete Footing & Foundation",
        component: lazy(() => import("../components/calculators/Construction/ConcreteFootingFoundationCalculator"))
    },
    {
        slug: "fence-post-material-linear-feet",
        category: "construction",
        title: "Fence Post & Material (linear feet)",
        component: lazy(() => import("../components/calculators/Construction/FencePostMaterialLinearFeetCalculator"))
    },
    {
        slug: "deck-board-joist-spacing",
        category: "construction",
        title: "Deck Board & Joist Spacing",
        component: lazy(() => import("../components/calculators/Construction/DeckBoardJoistSpacingCalculator"))
    },
    {
        slug: "stair-tread-riser-dimensions",
        category: "construction",
        title: "Stair Tread & Riser Dimensions",
        component: lazy(() => import("../components/calculators/Construction/StairTreadRiserDimensionsCalculator"))
    },
    {
        slug: "gable-roof",
        category: "construction",
        title: "Gable Roof Calculator",
        component: lazy(() => import("../components/calculators/Construction/GableRoofCalculator"))
    },
    {
        slug: "hip-roof",
        category: "construction",
        title: "Hip Roof Calculator",
        component: lazy(() => import("../components/calculators/Construction/HipRoofCalculator"))
    },
    {
        slug: "roof-pitch-slope-angle",
        category: "construction",
        title: "Roof Pitch (slope/angle)",
        component: lazy(() => import("../components/calculators/Construction/RoofPitchSlopeAngleCalculator"))
    },
    {
        slug: "paint-coverage-gallons",
        category: "construction",
        title: "Paint Coverage (gallons)",
        component: lazy(() => import("../components/calculators/Construction/PaintCoverageGallonsCalculator"))
    },
    {
        slug: "tile-area-grout",
        category: "construction",
        title: "Tile Area & Grout",
        component: lazy(() => import("../components/calculators/Construction/TileAreaGroutCalculator"))
    },
    {
        slug: "hardwood-plank-quantity",
        category: "construction",
        title: "Hardwood/Plank Quantity",
        component: lazy(() => import("../components/calculators/Construction/HardwoodPlankQuantityCalculator"))
    },
    {
        slug: "laminate-flooring-waste-allowance",
        category: "construction",
        title: "Laminate Flooring (waste allowance)",
        component: lazy(() => import("../components/calculators/Construction/LaminateFlooringWasteAllowanceCalculator"))
    },
    {
        slug: "wallpaper-roll-coverage",
        category: "construction",
        title: "Wallpaper Roll Coverage",
        component: lazy(() => import("../components/calculators/Construction/WallpaperRollCoverageCalculator"))
    },
    {
        slug: "bricks-blocks-calculator",
        category: "construction",
        title: "Bricks/Blocks Calculator",
        component: lazy(() => import("../components/calculators/Construction/BrickCalculator"))
    },
    {
        slug: "retaining-wall-calculator",
        category: "construction",
        title: "Retaining Wall Calculator",
        component: lazy(() => import("../components/calculators/Construction/RetainingWallCalculator"))
    },
    {
        slug: "ohms-law",
        category: "electrical",
        title: "Ohm’s Law (Voltage/Current/Res)",
        component: lazy(() => import("../components/calculators/Electrical/OhmsLawCalculator"))
    },
    {
        slug: "watts-law",
        category: "electrical",
        title: "Watt’s Law (Power/Current/Volt)",
        component: lazy(() => import("../components/calculators/Electrical/PowerWattsCalculator"))
    },
    {
        slug: "wire-size-gauge-selector",
        category: "electrical",
        title: "Wire Size (Gauge) Selector",
        component: lazy(() => import("../components/calculators/Electrical/WireSizeAwgKcmilCalculator"))
    },
    {
        slug: "voltage-drop-distance-material",
        category: "electrical",
        title: "Voltage Drop (distance/material)",
        component: lazy(() => import("../components/calculators/Electrical/VoltageDropWireLengthCalculator"))
    },
    {
        slug: "energy-cost-kwh-year-month",
        category: "electrical",
        title: "Energy Cost (kWh/year/month)",
        component: lazy(() => import("../components/calculators/Electrical/ElectricityCostPerHourMonthCalculator"))
    },
    {
        slug: "breaker-fuse-size-80-rule",
        category: "electrical",
        title: "Breaker/Fuse Size (80% rule)",
        component: lazy(() => import("../components/calculators/Electrical/BreakerSizeCalculator"))
    },
    {
        slug: "parallel-series-resistance",
        category: "electrical",
        title: "Parallel/Series Resistance",
        component: lazy(() => import("../components/calculators/Electrical/ParallelSeriesCircuitCalculator"))
    },
    {
        slug: "led-resistor-value-finder",
        category: "electrical",
        title: "LED Resistor Value Finder",
        component: lazy(() => import("../components/calculators/Electrical/ResistorColorCodeCalculator"))
    },
    {
        slug: "battery-run-time-estimator",
        category: "electrical",
        title: "Battery Run Time Estimator",
        component: lazy(() => import("../components/calculators/Electrical/BatteryRuntimeEstimatorCalculator"))
    },
    {
        slug: "dc-to-ac-inverter-sizing",
        category: "electrical",
        title: "DC to AC (Inverter) Sizing",
        component: lazy(() => import("../components/calculators/Electrical/InverterLoadCapacityCalculator"))
    },
    {
        slug: "dog-calorie-needs",
        category: "pets",
        title: "Dog Calorie Needs (RER/MER)",
        component: lazy(() => import("../components/calculators/Pets/DogCalorieNeedsRerMerCalculator"))
    },
    {
        slug: "cat-calorie-needs",
        category: "pets",
        title: "Cat Calorie Needs (RER/MER)",
        component: lazy(() => import("../components/calculators/Pets/CatCalorieNeedsRerMerCalculator"))
    },
    {
        slug: "dog-age-human-years",
        category: "pets",
        title: "Dog Age in Human Years",
        component: lazy(() => import("../components/calculators/Pets/DogAgeHumanYearsBreedAwareCalculator"))
    },
    {
        slug: "cat-age-human-years",
        category: "pets",
        title: "Cat Age in Human Years",
        component: lazy(() => import("../components/calculators/Pets/CatAgeHumanYearsBreedSizeAwareCalculator"))
    },
    {
        slug: "dog-chocolate-toxicity",
        category: "pets",
        title: "Dog Chocolate Toxicity",
        component: lazy(() => import("../components/calculators/Pets/DogChocolateToxicityCalculator"))
    },
    {
        slug: "cat-chocolate-toxicity",
        category: "pets",
        title: "Cat Chocolate Toxicity",
        component: lazy(() => import("../components/calculators/Pets/CatChocolateToxicityCalculator"))
    },
    {
        slug: "aquarium-volume-rectangular",
        category: "pets",
        title: "Aquarium Volume Calculator",
        component: lazy(() => import("../components/calculators/Pets/AquariumVolumeRectangularCylindricalBowfrontCalculator"))
    },
    {
        slug: "horse-weight-estimator",
        category: "pets",
        title: "Horse Weight Estimator",
        component: lazy(() => import("../components/calculators/Pets/HorseWeightEstimatorGirthLengthCalculator"))
    },
    {
        slug: "square-footage-calculator",
        category: "misc",
        title: "Square Footage Calculator",
        component: lazy(() => import("../components/calculators/Misc/SquareFootageCalculator"))
    },
    {
        slug: "appliance-energy-consumption",
        category: "misc",
        title: "Appliance Energy Consumption",
        component: lazy(() => import("../components/calculators/Misc/ApplianceEnergyConsumptionCalculator"))
    },
    {
        slug: "chicken-croquettes",
        category: "recipes",
        title: "Chicken Croquettes (Coxinha)",
        component: lazy(() => import("../components/calculators/Recipes/ChickenCroquettesCoxinhaCalculator"))
    },
    {
        slug: "brazilian-cheese-bread",
        category: "recipes",
        title: "Brazilian Cheese Bread (Pão de Queijo)",
        component: lazy(() => import("../components/calculators/Recipes/BrazilianCheeseBreadCalculator"))
    },
    {
        slug: "brazilian-picanha",
        category: "recipes",
        title: "Brazilian Picanha (Top Sirloin Cap)",
        component: lazy(() => import("../components/calculators/Recipes/BrazilianPicanhaTopSirloinCapCalculator"))
    },
    {
        slug: "caprese-salad",
        category: "recipes",
        title: "Caprese Salad",
        component: lazy(() => import("../components/calculators/Recipes/CapreseSaladCalculator"))
    },
    {
        slug: "italian-bread-salad",
        category: "recipes",
        title: "Italian Bread Salad (Panzanella)",
        component: lazy(() => import("../components/calculators/Recipes/ItalianBreadSaladPanzanellaCalculator"))
    },
    {
        slug: "pulled-pork",
        category: "recipes",
        title: "Pulled Pork (BBQ)",
        component: lazy(() => import("../components/calculators/Recipes/PulledPorkCalculator"))
    }
];
