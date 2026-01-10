import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DailyQuotesPage() {
  return (
    <CalculatorVerticalLayout
      title="Horoscope"
      description="Pick your zodiac sign and read a clear daily horoscope."
      showTopBanner
      showSidebar
      showBottomBanner
    >
      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle>Start here</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Use this page as your entry point. Click the button below to open the full
            horoscope view, then choose your zodiac sign to see today’s message.
          </p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            You’ll get quick, readable insights focused on general energy, love, career, and a
            couple of “lucky” cues. It’s designed to be fast to scan, easy to understand, and
            friendly on mobile.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="calculate">
              <Link to="/daily-quotes/horoscopo">Read Horoscope</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </CalculatorVerticalLayout>
  );
}
