import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, addDays, subDays, differenceInDays, getDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function DateCalculator() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>();
  const [operation, setOperation] = useState("add");
  const [days, setDays] = useState("");
  const [calculationType, setCalculationType] = useState("add-subtract");
  const [result, setResult] = useState<{
    resultDate?: Date;
    daysDifference?: number;
    weekday?: string;
    businessDays?: number;
  } | null>(null);

  const getDayName = (dayIndex: number): string => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return dayNames[dayIndex];
  };

  const calculateBusinessDays = (start: Date, end: Date): number => {
    let businessDays = 0;
    let currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dayOfWeek = getDay(currentDate);
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
        businessDays++;
      }
      currentDate = addDays(currentDate, 1);
    }
    
    return businessDays;
  };

  const calculate = () => {
    if (calculationType === "add-subtract") {
      const daysNum = parseInt(days);
      if (isNaN(daysNum)) return;

      const resultDate = operation === "add" 
        ? addDays(startDate, daysNum)
        : subDays(startDate, daysNum);
      
      const weekday = getDayName(getDay(resultDate));

      setResult({
        resultDate,
        weekday
      });
    } else if (calculationType === "difference" && endDate) {
      const daysDifference = Math.abs(differenceInDays(endDate, startDate));
      const businessDays = calculateBusinessDays(
        startDate <= endDate ? startDate : endDate,
        startDate <= endDate ? endDate : startDate
      );

      setResult({
        daysDifference,
        businessDays
      });
    }
  };

  const clearAll = () => {
    setStartDate(new Date());
    setEndDate(undefined);
    setOperation("add");
    setDays("");
    setCalculationType("add-subtract");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Date Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Add or subtract days from a date, or calculate the difference between two dates.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Date Calculations</CardTitle>
          <CardDescription>
            Choose your calculation type and enter the required information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="calculationType">Calculation Type</Label>
            <Select value={calculationType} onValueChange={setCalculationType}>
              <SelectTrigger id="calculationType" aria-label="Calculation type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add-subtract">Add/Subtract Days</SelectItem>
                <SelectItem value="difference">Days Between Dates</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {calculationType === "add-subtract" && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(startDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="operation">Operation</Label>
                  <Select value={operation} onValueChange={setOperation}>
                    <SelectTrigger id="operation" aria-label="Operation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">Add Days</SelectItem>
                      <SelectItem value="subtract">Subtract Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="days">Number of Days</Label>
                <Input
                  id="days"
                  type="number"
                  placeholder="Enter number of days"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  min="0"
                />
              </div>
            </>
          )}

          {calculationType === "difference" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={calculate}>
              Calculate
            </Button>
            <Button onClick={clearAll} variant="secondary">
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            {result.resultDate && (
              <div className="text-center space-y-4">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {format(result.resultDate, "PPP")}
                  </div>
                  <p className="text-muted-foreground">Calculated Date</p>
                </div>
                <div>
                  <div className="text-xl font-semibold text-primary">
                    {result.weekday}
                  </div>
                  <p className="text-muted-foreground">Day of the Week</p>
                </div>
              </div>
            )}

            {result.daysDifference !== undefined && (
              <div className="grid gap-6 md:grid-cols-2 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {result.daysDifference}
                  </div>
                  <p className="text-muted-foreground">Total Days</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {result.businessDays}
                  </div>
                  <p className="text-muted-foreground">Business Days</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (Excluding weekends)
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Date Calculator Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Add/Subtract Days</h3>
            <p className="text-sm text-muted-foreground">
              Add or subtract any number of days from a starting date to find future or past dates.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Days Between Dates</h3>
            <p className="text-sm text-muted-foreground">
              Calculate the total number of days and business days between two dates, excluding weekends for business calculations.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Business Days</h3>
            <p className="text-sm text-muted-foreground">
              Business days exclude Saturdays and Sundays. Useful for calculating work days, project timelines, and delivery dates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}