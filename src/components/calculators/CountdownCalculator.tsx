import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function CountdownCalculator() {
  const [targetDate, setTargetDate] = useState<Date>();
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  } | null>(null);

  const calculateCountdown = useCallback(() => {
    if (!targetDate) return null;

    const now = new Date();
    const isPast = targetDate < now;
    const compareDate = isPast ? now : targetDate;
    const baseDate = isPast ? targetDate : now;

    const totalSeconds = Math.abs(differenceInSeconds(compareDate, baseDate));
    const totalMinutes = Math.abs(differenceInMinutes(compareDate, baseDate));
    const totalHours = Math.abs(differenceInHours(compareDate, baseDate));
    const totalDays = Math.abs(differenceInDays(compareDate, baseDate));

    const days = totalDays;
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, isPast };
  }, [targetDate]);

  useEffect(() => {
    if (!targetDate) return;

    const updateCountdown = () => {
      setCountdown(calculateCountdown());
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate, calculateCountdown]);

  const clearAll = () => {
    setTargetDate(undefined);
    setCountdown(null);
  };

  // Preset dates for common holidays
  const presetDates = [
    { name: "Christmas 2024", date: new Date(2024, 11, 25) },
    { name: "New Year 2025", date: new Date(2025, 0, 1) },
    { name: "Valentine's Day 2025", date: new Date(2025, 1, 14) },
    { name: "Halloween 2024", date: new Date(2024, 9, 31) },
    { name: "Thanksgiving 2024", date: new Date(2024, 10, 28) },
    { name: "July 4th 2025", date: new Date(2025, 6, 4) }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Countdown Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Count down to any date with a real-time countdown timer showing days, hours, minutes, and seconds.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Set Target Date</CardTitle>
          <CardDescription>
            Choose a date to count down to or select from common holidays
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Target Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !targetDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {targetDate ? format(targetDate, "PPP") : "Select target date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={targetDate}
                  onSelect={setTargetDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Quick Select</label>
            <div className="grid gap-2 md:grid-cols-3">
              {presetDates.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  onClick={() => setTargetDate(preset.date)}
                  className="text-sm"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={clearAll} variant="secondary">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {countdown && targetDate && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>
              {countdown.isPast ? "Time Since" : "Countdown to"} {format(targetDate, "PPP")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4 text-center">
              <div className="p-6 border rounded-lg">
                <div className="text-4xl font-bold text-primary mb-2">
                  {countdown.days}
                </div>
                <p className="text-muted-foreground">Days</p>
              </div>
              <div className="p-6 border rounded-lg">
                <div className="text-4xl font-bold text-primary mb-2">
                  {countdown.hours}
                </div>
                <p className="text-muted-foreground">Hours</p>
              </div>
              <div className="p-6 border rounded-lg">
                <div className="text-4xl font-bold text-primary mb-2">
                  {countdown.minutes}
                </div>
                <p className="text-muted-foreground">Minutes</p>
              </div>
              <div className="p-6 border rounded-lg">
                <div className="text-4xl font-bold text-primary mb-2">
                  {countdown.seconds}
                </div>
                <p className="text-muted-foreground">Seconds</p>
              </div>
            </div>

            {countdown.isPast && (
              <div className="text-center mt-6">
                <p className="text-muted-foreground">
                  This date has already passed. Showing time elapsed since then.
                </p>
              </div>
            )}

            {!countdown.isPast && countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0 && (
              <div className="text-center mt-6">
                <p className="text-2xl font-bold text-primary">🎉 Time's Up! 🎉</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Countdown Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Real-Time Updates</h3>
            <p className="text-sm text-muted-foreground">
              The countdown updates every second to show the exact time remaining until your target date.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Quick Presets</h3>
            <p className="text-sm text-muted-foreground">
              Use the quick select buttons to instantly countdown to popular holidays and events.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Past Dates</h3>
            <p className="text-sm text-muted-foreground">
              If you select a date in the past, the calculator will show how much time has elapsed since that date.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}