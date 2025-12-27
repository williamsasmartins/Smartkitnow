import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Car, Fuel, DollarSign, Info, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, Settings, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TcoCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    purchasePrice: "",
    annualMileage: "",
    fuelEfficiency: "",
    fuelPrice: "",
    maintenanceCost: "",
    insuranceCost: "",
    yearsOwned: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const purchasePrice = parseFloat(inputs.purchasePrice);
    const annualMileage = parseFloat(inputs.annualMileage);
    const fuelEfficiency = parseFloat(inputs.fuelEfficiency);
    const fuelPrice = parseFloat(inputs.fuelPrice);
    const maintenanceCost = parseFloat(inputs.maintenanceCost);
    const insuranceCost = parseFloat(inputs.insuranceCost);
    const yearsOwned = parseInt(inputs.yearsOwned);

    if (
      isNaN(purchasePrice) || purchasePrice <= 0 ||
      isNaN(annualMileage) || annualMileage <= 0 ||
      isNaN(fuelEfficiency) || fuelEfficiency <= 0 ||
      isNaN(fuelPrice) || fuelPrice <= 0 ||
      isNaN(maintenanceCost) || maintenanceCost < 0 ||
      isNaN(insuranceCost) || insuranceCost < 0 ||
      isNaN(yearsOwned) || yearsOwned <= 0
    ) {
      return {
        primary: "N/A",
        secondary: "$0.00",
        details: "Please enter valid positive numbers in all fields.",
        feedback: "Incomplete or invalid input"
      };
    }

    // Calculate total fuel cost over ownership period
    // fuel consumed = annualMileage / fuelEfficiency
    // total fuel cost = fuel consumed * fuelPrice * yearsOwned
    const totalFuelCost = (annualMileage / fuelEfficiency) * fuelPrice * yearsOwned;

    // Total maintenance cost over ownership period
    const totalMaintenanceCost = maintenanceCost * yearsOwned;

    // Total insurance cost over ownership period
    const totalInsuranceCost = insuranceCost * yearsOwned;

    // Total cost of ownership
    const totalCost = purchasePrice + totalFuelCost + totalMaintenanceCost + totalInsuranceCost;

    // Average annual cost
    const annualCost = totalCost / yearsOwned;

    // Format results
    const primary = `$${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const secondary = `Annual Cost: $${annualCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const details = `Includes purchase price, fuel, maintenance, and insurance over ${yearsOwned} years.`;

    // Feedback based on total cost
    let feedback = "Cost is within typical range.";
    if (totalCost > 100000) feedback = "High total cost of ownership.";
    else if (totalCost < 20000) feedback = "Low total cost of ownership.";

    return {
      primary,
      secondary,
      details,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is Total Cost of Ownership (TCO) in automotive terms?",
      answer:
        "Total Cost of Ownership (TCO) refers to the comprehensive cost of owning a vehicle over a specified period, including the purchase price, fuel expenses, maintenance, insurance, and other related costs. It helps buyers understand the true financial impact beyond just the initial purchase price. Calculating TCO allows for better budgeting and comparison between different vehicles or ownership options."
    },
    {
      question: "How does fuel efficiency affect the TCO?",
      answer:
        "Fuel efficiency directly impacts the amount of money spent on fuel over the ownership period. A vehicle with higher miles per gallon (MPG) or kilometers per liter (km/L) consumes less fuel for the same distance, reducing fuel expenses. Therefore, better fuel efficiency lowers the total cost of ownership, especially for drivers with high annual mileage."
    },
    {
      question: "Why should I include maintenance and insurance costs in TCO?",
      answer:
        "Maintenance and insurance are recurring expenses that can significantly add to the overall cost of owning a vehicle. Regular maintenance ensures vehicle reliability and safety but comes with costs that accumulate over time. Insurance premiums vary based on vehicle type, location, and driver profile, and including them provides a realistic estimate of ongoing financial commitments."
    },
    {
      question: "Can TCO help me decide between buying new or used cars?",
      answer:
        "Yes, TCO is a valuable tool for comparing new versus used vehicles. While used cars typically have a lower purchase price, they may incur higher maintenance costs. New cars might have higher upfront costs but lower maintenance and better fuel efficiency. Evaluating TCO helps balance these factors to make an informed decision."
    },
    {
      question: "How often should I recalculate my TCO?",
      answer:
        "It is advisable to recalculate your TCO whenever there are significant changes in any cost components, such as fuel price fluctuations, changes in insurance premiums, or updated maintenance estimates. Additionally, recalculating before purchasing a new vehicle or when your driving habits change ensures your financial planning remains accurate."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $35,000 SUV with an expected ownership period of 5 years, driving 12,000 miles annually, with a fuel efficiency of 25 MPG, fuel price at $3.50 per gallon, annual maintenance cost of $800, and insurance cost of $1,200 per year.",
    steps: [
      {
        label: "Step 1: Calculate total fuel cost",
        explanation:
          "Annual fuel consumption = 12,000 miles / 25 MPG = 480 gallons. Total fuel cost over 5 years = 480 gallons * $3.50 * 5 = $8,400."
      },
      {
        label: "Step 2: Calculate total maintenance and insurance costs",
        explanation:
          "Maintenance cost over 5 years = $800 * 5 = $4,000. Insurance cost over 5 years = $1,200 * 5 = $6,000."
      },
      {
        label: "Step 3: Calculate total cost of ownership",
        explanation:
          "Total cost = Purchase price + Fuel cost + Maintenance cost + Insurance cost = $35,000 + $8,400 + $4,000 + $6,000 = $53,400."
      },
      {
        label: "Step 4: Calculate average annual cost",
        explanation:
          "Average annual cost = Total cost / Years owned = $53,400 / 5 = $10,680 per year."
      }
    ],
    result: "Final Result: The total cost of ownership for the SUV over 5 years is $53,400, averaging $10,680 annually."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and fuel economy information for vehicles."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource for new and used cars."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, buying advice, and ownership cost estimates."
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (US)</SelectItem>
            <SelectItem value="metric">Metric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Purchase Price ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.purchasePrice}
            onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
            placeholder="e.g. 35000"
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Mileage (miles)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.annualMileage}
            onChange={(e) => handleInputChange("annualMileage", e.target.value)}
            placeholder="e.g. 12000"
          />
        </div>
        <div className="space-y-2">
          <Label>Fuel Efficiency (MPG)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.fuelEfficiency}
            onChange={(e) => handleInputChange("fuelEfficiency", e.target.value)}
            placeholder="e.g. 25"
          />
        </div>
        <div className="space-y-2">
          <Label>Fuel Price ($/gallon)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.fuelPrice}
            onChange={(e) => handleInputChange("fuelPrice", e.target.value)}
            placeholder="e.g. 3.50"
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Maintenance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.maintenanceCost}
            onChange={(e) => handleInputChange("maintenanceCost", e.target.value)}
            placeholder="e.g. 800"
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Insurance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.insuranceCost}
            onChange={(e) => handleInputChange("insuranceCost", e.target.value)}
            placeholder="e.g. 1200"
          />
        </div>
        <div className="space-y-2">
          <Label>Years Owned</Label>
          <Input
            type="number"
            min="1"
            value={inputs.yearsOwned}
            onChange={(e) => handleInputChange("yearsOwned", e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 font-medium text-blue-700 dark:text-blue-400">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Enter the purchase price of the vehicle you plan to buy or currently own.
          </li>
          <li>
            <strong>Step 2:</strong> Input your expected annual mileage to estimate fuel and maintenance usage.
          </li>
          <li>
            <strong>Step 3:</strong> Provide your vehicle's fuel efficiency (miles per gallon or km per liter) and current fuel price.
          </li>
          <li>
            <strong>Step 4:</strong> Enter your average annual maintenance and insurance costs.
          </li>
          <li>
            <strong>Step 5:</strong> Specify the number of years you expect to own the vehicle.
          </li>
          <li>
            <strong>Step 6:</strong> Click "Calculate" to see your estimated total cost of ownership and average annual cost.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Total Cost of Ownership (TCO) Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The Total Cost of Ownership (TCO) calculator is an essential tool for anyone considering purchasing or owning a vehicle. Unlike simply looking at the sticker price, TCO accounts for all the expenses you will incur throughout the ownership period. This includes the initial purchase price, fuel costs based on your driving habits and fuel efficiency, routine maintenance expenses, and insurance premiums. By aggregating these costs, the calculator provides a realistic estimate of what owning a vehicle will truly cost you over time.
          </p>
          <p>
            To use this calculator effectively, you need to gather accurate data about your vehicle and driving patterns. The purchase price is straightforward, but fuel efficiency and fuel price can vary depending on the vehicle model and local market conditions. Maintenance costs include regular servicing, repairs, and parts replacement, which can fluctuate based on vehicle age and usage. Insurance costs depend on your location, driving record, and coverage options. Finally, the expected years of ownership help spread these costs over time to give you an annualized perspective.
          </p>
          <p>
            Understanding TCO helps you make smarter financial decisions, whether comparing different vehicles, deciding between new or used cars, or budgeting for future expenses. It highlights the importance of fuel efficiency and maintenance in long-term affordability and can guide you toward vehicles that offer the best value for your lifestyle and budget. Always remember to update your inputs as conditions change, such as fuel prices or insurance rates, to keep your estimates accurate.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Ignoring maintenance and insurance costs:</strong> Many users focus only on purchase price and fuel costs, overlooking maintenance and insurance, which can significantly affect total ownership costs.
          </p>
          <p>
            <strong>2. Using outdated or estimated fuel prices:</strong> Fuel prices fluctuate frequently; using outdated data can lead to inaccurate TCO estimates.
          </p>
          <p>
            <strong>3. Not adjusting for actual driving habits:</strong> Overestimating or underestimating annual mileage or fuel efficiency skews results, so use realistic values based on your driving patterns.
          </p>
          <p>
            <strong>4. Forgetting to update insurance costs:</strong> Insurance premiums can change yearly; failing to update these values reduces accuracy.
          </p>
          <p>
            <strong>5. Assuming ownership period incorrectly:</strong> Estimating too short or too long ownership periods without considering resale value or vehicle lifespan can mislead cost projections.
          </p>
        </div>
      </section>

      {/* 4. FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. REFERENCES */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Total Cost of Ownership (TCO) Calculator"
      description="Professional automotive calculator: Total Cost of Ownership (TCO) Calculator. Get accurate estimates, expert advice, and financial insights."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "example", label: "Real World Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}