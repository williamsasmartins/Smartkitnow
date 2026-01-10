import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DailyQuotesPage() {
  return (
    <CalculatorVerticalLayout
      title="Daily Quotes"
      description="Read a clean, fast daily horoscope by zodiac sign."
      showTopBanner
      showSidebar
      showBottomBanner
    >
      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle>Escolha o que você quer ver</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Clique em Horoscopo para abrir a página do horóscopo diário por signo.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="calculate">
              <Link to="/daily-quotes/horoscopo">Horoscopo</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </CalculatorVerticalLayout>
  );
}
