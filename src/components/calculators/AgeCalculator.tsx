import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, differenceInYears, differenceInMonths, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<Date>();
  const [compareDate, setCompareDate] = useState<Date>(new Date());
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    nextBirthday: Date;
    daysToNextBirthday: number;
  } | null>(null);

  const calculateAge = () => {
    if (!birthDate) return;

    const years = differenceInYears(compareDate, birthDate);
    const months = differenceInMonths(compareDate, birthDate) % 12;
    
    // Calculate remaining days after years and months
    const yearMonthDate = new Date(birthDate);
    yearMonthDate.setFullYear(yearMonthDate.getFullYear() + years);
    yearMonthDate.setMonth(yearMonthDate.getMonth() + months);
    const days = differenceInDays(compareDate, yearMonthDate);
    
    const totalDays = differenceInDays(compareDate, birthDate);

    // Calculate next birthday
    const nextBirthday = new Date(birthDate);
    nextBirthday.setFullYear(compareDate.getFullYear());
    
    // If birthday has passed this year, set to next year
    if (nextBirthday < compareDate) {
      nextBirthday.setFullYear(compareDate.getFullYear() + 1);
    }
    
    const daysToNextBirthday = differenceInDays(nextBirthday, compareDate);

    setResult({
      years,
      months,
      days,
      totalDays,
      nextBirthday,
      daysToNextBirthday
    });
  };

  const clearAll = () => {
    setBirthDate(undefined);
    setCompareDate(new Date());
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Age Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate your exact age in years, months, and days, plus find out when your next birthday is.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Age</CardTitle>
          <CardDescription>
            Select your birth date and optionally a comparison date to calculate your age
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Birth Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !birthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? format(birthDate, "PPP") : "Select your birth date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Calculate Age As Of</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(compareDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={compareDate}
                    onSelect={(date) => date && setCompareDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground mt-1">
                Defaults to today's date
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateAge} disabled={!birthDate}>
              Calculate Age
            </Button>
            <Button onClick={clearAll} variant="secondary">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Age</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3 text-center mb-6">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {result.years}
                </div>
                <p className="text-muted-foreground">Years</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {result.months}
                </div>
                <p className="text-muted-foreground">Months</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {result.days}
                </div>
                <p className="text-muted-foreground">Days</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-6 md:grid-cols-2 text-center">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">
                  {result.totalDays.toLocaleString()}
                </div>
                <p className="text-muted-foreground">Total Days Lived</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">
                  {result.daysToNextBirthday}
                </div>
                <p className="text-muted-foreground">
                  Days Until Next Birthday ({format(result.nextBirthday, "MMM d, yyyy")})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How Age is Calculated</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Age Calculation Method</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Years: Complete years since birth</li>
              <li>• Months: Additional complete months after years</li>
              <li>• Days: Remaining days after years and months</li>
              <li>• Total days: Total number of days lived</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Fun Age Facts</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Average human lifespan: ~28,000 days (76 years)</li>
              <li>• Legal voting age in most countries: 18 years</li>
              <li>• Age of majority: Usually 18 or 21 years</li>
              <li>• Retirement age: Typically 62-67 years</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}