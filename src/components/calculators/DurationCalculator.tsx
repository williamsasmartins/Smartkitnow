import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function DurationCalculator() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [hours1, setHours1] = useState("");
  const [minutes1, setMinutes1] = useState("");
  const [seconds1, setSeconds1] = useState("");
  const [hours2, setHours2] = useState("");
  const [minutes2, setMinutes2] = useState("");
  const [seconds2, setSeconds2] = useState("");
  const [operation, setOperation] = useState("add");
  const [calculationType, setCalculationType] = useState("duration");
  const [result, setResult] = useState<{
    hours?: number;
    minutes?: number;
    seconds?: number;
    totalMinutes?: number;
    totalSeconds?: number;
    decimal?: number;
  } | null>(null);

  const parseTime = (timeStr: string): { hours: number; minutes: number; seconds: number } | null => {
    const parts = timeStr.split(":");
    if (parts.length < 2) return null;

    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parseInt(parts[2]) || 0;

    return { hours, minutes, seconds };
  };

  const timeToSeconds = (hours: number, minutes: number, seconds: number): number => {
    return hours * 3600 + minutes * 60 + seconds;
  };

  const secondsToTime = (totalSeconds: number): { hours: number; minutes: number; seconds: number } => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  const calculateDuration = () => {
    if (calculationType === "duration") {
      // Calculate duration between two times
      const start = parseTime(startTime);
      const end = parseTime(endTime);
      
      if (!start || !end) {
        alert("Please enter valid time format (HH:MM or HH:MM:SS)");
        return;
      }

      const startSeconds = timeToSeconds(start.hours, start.minutes, start.seconds);
      let endSeconds = timeToSeconds(end.hours, end.minutes, end.seconds);

      // Handle overnight duration
      if (endSeconds < startSeconds) {
        endSeconds += 24 * 3600; // Add 24 hours
      }

      const durationSeconds = endSeconds - startSeconds;
      const duration = secondsToTime(durationSeconds);

      setResult({
        hours: duration.hours,
        minutes: duration.minutes,
        seconds: duration.seconds,
        totalMinutes: Math.floor(durationSeconds / 60),
        totalSeconds: durationSeconds,
        decimal: durationSeconds / 3600
      });
    } else if (calculationType === "arithmetic") {
      // Add or subtract time values
      const h1 = parseInt(hours1) || 0;
      const m1 = parseInt(minutes1) || 0;
      const s1 = parseInt(seconds1) || 0;
      const h2 = parseInt(hours2) || 0;
      const m2 = parseInt(minutes2) || 0;
      const s2 = parseInt(seconds2) || 0;

      const time1Seconds = timeToSeconds(h1, m1, s1);
      const time2Seconds = timeToSeconds(h2, m2, s2);

      const resultSeconds = operation === "add" 
        ? time1Seconds + time2Seconds
        : time1Seconds - time2Seconds;

      if (resultSeconds < 0) {
        alert("Result cannot be negative");
        return;
      }

      const result = secondsToTime(resultSeconds);

      setResult({
        hours: result.hours,
        minutes: result.minutes,
        seconds: result.seconds,
        totalMinutes: Math.floor(resultSeconds / 60),
        totalSeconds: resultSeconds,
        decimal: resultSeconds / 3600
      });
    }
  };

  const clearAll = () => {
    setStartTime("");
    setEndTime("");
    setHours1("");
    setMinutes1("");
    setSeconds1("");
    setHours2("");
    setMinutes2("");
    setSeconds2("");
    setOperation("add");
    setCalculationType("duration");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Time Duration Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate time duration between two times or perform arithmetic operations on time values.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Calculations</CardTitle>
          <CardDescription>
            Choose your calculation type and enter the time values
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
                <SelectItem value="duration">Duration Between Times</SelectItem>
                <SelectItem value="arithmetic">Add/Subtract Times</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {calculationType === "duration" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="text"
                  placeholder="HH:MM or HH:MM:SS"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format: 09:30 or 09:30:45
                </p>
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="text"
                  placeholder="HH:MM or HH:MM:SS"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Handles overnight durations automatically
                </p>
              </div>
            </div>
          )}

          {calculationType === "arithmetic" && (
            <>
              <div>
                <Label>First Time</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Input
                      type="number"
                      placeholder="Hours"
                      value={hours1}
                      onChange={(e) => setHours1(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Minutes"
                      value={minutes1}
                      onChange={(e) => setMinutes1(e.target.value)}
                      min="0"
                      max="59"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Seconds"
                      value={seconds1}
                      onChange={(e) => setSeconds1(e.target.value)}
                      min="0"
                      max="59"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="operation">Operation</Label>
                <Select value={operation} onValueChange={setOperation}>
                  <SelectTrigger id="operation" aria-label="Operation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add (+)</SelectItem>
                    <SelectItem value="subtract">Subtract (-)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Second Time</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Input
                      type="number"
                      placeholder="Hours"
                      value={hours2}
                      onChange={(e) => setHours2(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Minutes"
                      value={minutes2}
                      onChange={(e) => setMinutes2(e.target.value)}
                      min="0"
                      max="59"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Seconds"
                      value={seconds2}
                      onChange={(e) => setSeconds2(e.target.value)}
                      min="0"
                      max="59"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-2">
            <Button onClick={calculateDuration}>
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
            <div className="grid gap-6 text-center">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {result.hours}
                  </div>
                  <p className="text-muted-foreground">Hours</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {result.minutes}
                  </div>
                  <p className="text-muted-foreground">Minutes</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {result.seconds}
                  </div>
                  <p className="text-muted-foreground">Seconds</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-xl font-bold text-primary mb-2">
                    {result.totalMinutes}
                  </div>
                  <p className="text-muted-foreground">Total Minutes</p>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary mb-2">
                    {result.totalSeconds}
                  </div>
                  <p className="text-muted-foreground">Total Seconds</p>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary mb-2">
                    {result.decimal?.toFixed(2)}
                  </div>
                  <p className="text-muted-foreground">Decimal Hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Time Duration Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Duration Between Times</h3>
            <p className="text-sm text-muted-foreground">
              Calculate the exact duration between two times. Automatically handles overnight periods (e.g., 11:00 PM to 2:00 AM = 3 hours).
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Time Arithmetic</h3>
            <p className="text-sm text-muted-foreground">
              Add or subtract time values for project planning, scheduling, and time tracking calculations.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Multiple Formats</h3>
            <p className="text-sm text-muted-foreground">
              Results are displayed in multiple formats including standard time format, total minutes/seconds, and decimal hours for easy use in timesheets.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}