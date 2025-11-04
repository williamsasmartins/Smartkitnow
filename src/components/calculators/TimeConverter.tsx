import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function TimeConverter() {
  const [inputTime, setInputTime] = useState("");
  const [inputFormat, setInputFormat] = useState("24-hour");
  const [result, setResult] = useState<{
    hour12: string;
    hour24: string;
    military: string;
    decimal: string;
  } | null>(null);

  const convertTime = () => {
    if (!inputTime.trim()) return;

    try {
      let hours24 = 0;
      let minutes = 0;

      if (inputFormat === "24-hour") {
        // Parse 24-hour format (e.g., "14:30" or "2:30")
        const parts = inputTime.split(":");
        hours24 = parseInt(parts[0]);
        minutes = parseInt(parts[1] || "0");
      } else if (inputFormat === "12-hour") {
        // Parse 12-hour format (e.g., "2:30 PM")
        const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
        const match = inputTime.match(timeRegex);
        if (!match) {
          alert("Please enter time in format HH:MM AM/PM (e.g., 2:30 PM)");
          return;
        }
        let hour = parseInt(match[1]);
        minutes = parseInt(match[2]);
        const period = match[3].toUpperCase();
        
        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;
        hours24 = hour;
      } else if (inputFormat === "decimal") {
        // Parse decimal hours (e.g., "14.5")
        const decimal = parseFloat(inputTime);
        hours24 = Math.floor(decimal);
        minutes = Math.round((decimal - hours24) * 60);
      }

      // Validate time
      if (hours24 < 0 || hours24 > 23 || minutes < 0 || minutes > 59) {
        alert("Invalid time entered");
        return;
      }

      // Convert to all formats
      const hour12Format = formatTo12Hour(hours24, minutes);
      const hour24Format = formatTo24Hour(hours24, minutes);
      const militaryFormat = formatToMilitary(hours24, minutes);
      const decimalFormat = (hours24 + minutes / 60).toFixed(2);

      setResult({
        hour12: hour12Format,
        hour24: hour24Format,
        military: militaryFormat,
        decimal: decimalFormat
      });
    } catch (error) {
      alert("Invalid time format");
    }
  };

  const formatTo12Hour = (hours: number, minutes: number): string => {
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const formatTo24Hour = (hours: number, minutes: number): string => {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const formatToMilitary = (hours: number, minutes: number): string => {
    return `${hours.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}`;
  };

  const clearAll = () => {
    setInputTime("");
    setInputFormat("24-hour");
    setResult(null);
  };

  const commonTimes = [
    { name: "Midnight", time: "00:00" },
    { name: "6 AM", time: "06:00" },
    { name: "Noon", time: "12:00" },
    { name: "6 PM", time: "18:00" },
    { name: "9 PM", time: "21:00" },
    { name: "11:59 PM", time: "23:59" }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Time Format Converter
        </h1>
        <p className="text-lg text-muted-foreground">
          Convert between 12-hour, 24-hour, military time, and decimal hour formats.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Convert Time Format</CardTitle>
          <CardDescription>
            Enter a time in any format and see it converted to all other formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="inputFormat">Input Format</Label>
              <Select value={inputFormat} onValueChange={setInputFormat}>
                <SelectTrigger id="inputFormat" aria-label="Input format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24-hour">24-Hour (HH:MM)</SelectItem>
                  <SelectItem value="12-hour">12-Hour (H:MM AM/PM)</SelectItem>
                  <SelectItem value="decimal">Decimal Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="inputTime">Time</Label>
              <Input
                id="inputTime"
                type="text"
                placeholder={
                  inputFormat === "24-hour" ? "e.g., 14:30" :
                  inputFormat === "12-hour" ? "e.g., 2:30 PM" :
                  "e.g., 14.5"
                }
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {inputFormat === "24-hour" && "Format: HH:MM (0-23 hours)"}
                {inputFormat === "12-hour" && "Format: H:MM AM/PM"}
                {inputFormat === "decimal" && "Format: Decimal hours (e.g., 14.5)"}
              </p>
            </div>
          </div>

          <div>
            <Label>Quick Examples</Label>
            <div className="grid gap-2 md:grid-cols-6 mt-2">
              {commonTimes.map((time) => (
                <Button
                  key={time.name}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputTime(time.time);
                    setInputFormat("24-hour");
                  }}
                >
                  {time.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={convertTime}>
              Convert Time
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
            <CardTitle>Converted Time Formats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">
                  {result.hour12}
                </div>
                <p className="text-muted-foreground">12-Hour Format</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">
                  {result.hour24}
                </div>
                <p className="text-muted-foreground">24-Hour Format</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">
                  {result.military}
                </div>
                <p className="text-muted-foreground">Military Time</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">
                  {result.decimal}
                </div>
                <p className="text-muted-foreground">Decimal Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Time Format Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">12-Hour Format</h3>
            <p className="text-sm text-muted-foreground">
              Standard time format with AM/PM notation. Hours range from 1-12 with AM for morning times and PM for afternoon/evening times.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">24-Hour Format</h3>
            <p className="text-sm text-muted-foreground">
              International standard time format. Hours range from 00-23, eliminating the need for AM/PM notation.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Military Time</h3>
            <p className="text-sm text-muted-foreground">
              Used by military and emergency services. Written as four digits without colon (e.g., 1430 for 2:30 PM).
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Decimal Hours</h3>
            <p className="text-sm text-muted-foreground">
              Time expressed as decimal numbers. Useful for calculations and timesheets (e.g., 2.5 hours = 2 hours 30 minutes).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}