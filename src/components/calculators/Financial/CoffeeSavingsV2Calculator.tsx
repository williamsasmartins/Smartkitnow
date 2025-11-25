import { useState, useMemo } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CoffeeSavingsCalculatorProps {
  coffeeCostPerCup: number;
  cupsPerDay: number;
  daysPerWeek: number;
  weeksPerYear: number;
  homeBrewCostPerCup: number;
}

const CoffeeSavingsCalculator: React.FC = () => {
  const [coffeeCostPerCup, setCoffeeCostPerCup] = useState<number>(4);
  const [cupsPerDay, setCupsPerDay] = useState<number>(2);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
  const [weeksPerYear, setWeeksPerYear] = useState<number>(50);
  const [homeBrewCostPerCup, setHomeBrewCostPerCup] = useState<number>(0.5);

  const totalCostFromStore = useMemo(() => {
    return coffeeCostPerCup * cupsPerDay * daysPerWeek * weeksPerYear;
  }, [coffeeCostPerCup, cupsPerDay, daysPerWeek, weeksPerYear]);

  const totalCostFromHome = useMemo(() => {
    return homeBrewCostPerCup * cupsPerDay * daysPerWeek * weeksPerYear;
  }, [homeBrewCostPerCup, cupsPerDay, daysPerWeek, weeksPerYear]);

  const totalSavings = useMemo(() => {
    return totalCostFromStore - totalCostFromHome;
  }, [totalCostFromStore, totalCostFromHome]);

  return (
    <CalculatorVerticalLayout
      title="Coffee Savings Calculator V2"
      slug="coffee-savings-v2"
      category="financial"
      description="Calculate how much you save by making coffee at home."
      editorial={`
        <h2>Coffee Savings Calculator</h2>
        <p>Welcome to the Coffee Savings Calculator V2! This tool is designed to help you understand the financial benefits of brewing coffee at home versus buying it from your favorite café. With the rising costs of coffee, many individuals are looking for ways to save money without sacrificing their daily caffeine fix. This calculator will guide you through the process of determining how much you can save by making coffee at home.</p>
        
        <h3>Understanding the Costs</h3>
        <p>When considering the cost of coffee, it’s essential to factor in both the price of coffee purchased from a café and the cost of making coffee at home. The average price of a cup of coffee can vary significantly depending on the location, the type of coffee, and the establishment. For this calculator, we will use a standard price of $4 per cup for store-bought coffee.</p>
        
        <h3>Calculating Your Daily Coffee Consumption</h3>
        <p>To get started, you will need to input your daily coffee consumption habits. How many cups of coffee do you drink per day? For this example, let’s assume you drink two cups of coffee each day. Next, consider how many days a week you typically purchase coffee. If you buy coffee five days a week, that’s a good starting point.</p>
        
        <h3>Annual Savings Calculation</h3>
        <p>Now, let’s look at the annual savings. The calculator will multiply your daily coffee consumption by the cost per cup, the number of days per week, and the number of weeks you typically purchase coffee in a year. For instance, if you buy coffee for 50 weeks a year, the total cost of store-bought coffee will be calculated as follows:</p>
        <p><strong>Total Cost = Cost Per Cup x Cups Per Day x Days Per Week x Weeks Per Year</strong></p>
        
        <h3>Home Brewing Costs</h3>
        <p>Next, you will need to input the cost of brewing coffee at home. This cost is generally much lower than purchasing coffee from a café. For example, if you spend $0.50 per cup when brewing at home, the calculator will compute your total home brewing costs in the same manner as the store-bought coffee.</p>
        
        <h3>Final Savings</h3>
        <p>Finally, the calculator will subtract the total home brewing costs from the total store-bought coffee costs to give you your annual savings. This figure will help you understand how much money you can save by making coffee at home.</p>
        
        <h3>Conclusion</h3>
        <p>By using this Coffee Savings Calculator V2, you can make informed decisions about your coffee consumption habits. Not only will you save money, but you may also find that brewing coffee at home allows for greater customization and enjoyment of your favorite beverages. Start calculating your savings today!</p>
      `}
    >
      <Card>
        <CardHeader>
          <CardTitle>Calculate Your Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="coffeeCostPerCup">Cost of Coffee per Cup ($):</Label>
          <Input
            id="coffeeCostPerCup"
            type="number"
            value={coffeeCostPerCup}
            onChange={(e) => setCoffeeCostPerCup(Number(e.target.value))}
          />
          <Label htmlFor="cupsPerDay">Cups of Coffee per Day:</Label>
          <Input
            id="cupsPerDay"
            type="number"
            value={cupsPerDay}
            onChange={(e) => setCupsPerDay(Number(e.target.value))}
          />
          <Label htmlFor="daysPerWeek">Days per Week:</Label>
          <Input
            id="daysPerWeek"
            type="number"
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(Number(e.target.value))}
          />
          <Label htmlFor="weeksPerYear">Weeks per Year:</Label>
          <Input
            id="weeksPerYear"
            type="number"
            value={weeksPerYear}
            onChange={(e) => setWeeksPerYear(Number(e.target.value))}
          />
          <Label htmlFor="homeBrewCostPerCup">Home Brew Cost per Cup ($):</Label>
          <Input
            id="homeBrewCostPerCup"
            type="number"
            value={homeBrewCostPerCup}
            onChange={(e) => setHomeBrewCostPerCup(Number(e.target.value))}
          />
          <Button onClick={() => alert(`Your annual savings: $${totalSavings.toFixed(2)}`)}>
            Calculate Savings
          </Button>
          <h3>Your Annual Savings: ${totalSavings.toFixed(2)}</h3>
        </CardContent>
      </Card>
    </CalculatorVerticalLayout>
  );
};

export default CoffeeSavingsCalculator;