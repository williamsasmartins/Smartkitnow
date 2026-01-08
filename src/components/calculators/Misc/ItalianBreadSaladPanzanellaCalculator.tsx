import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ItalianBreadSaladPanzanellaCalculator() {
  const title = "Italian Bread Salad (Panzanella)";
  const description =
    "Tuscan salad of stale bread, tomatoes, onions, cucumber, and basil in a vinaigrette.";

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>Prep time: 15 minutes</div>
          <div>Rest time: 20 minutes</div>
          <div>Best served: room temperature</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-5 space-y-1.5 text-sm">
            <li>Day-old bread, torn into bite-size pieces</li>
            <li>Ripe tomatoes</li>
            <li>Red onion</li>
            <li>Cucumber</li>
            <li>Fresh basil</li>
            <li>Olive oil, vinegar, salt, and black pepper</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  const editorial = (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold">About</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Panzanella is designed to turn sturdy, slightly stale bread into something
          vibrant. Resting the salad after dressing helps the bread absorb flavor while
          staying pleasantly chewy.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Instructions</h2>
        <ol className="mt-3 list-decimal ml-5 space-y-2 text-base leading-relaxed text-muted-foreground">
          <li>Combine tomatoes, cucumber, onion, and bread in a large bowl.</li>
          <li>Dress with olive oil and vinegar, season, and toss well.</li>
          <li>Let rest 15–30 minutes, then add basil and adjust seasoning.</li>
        </ol>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={widget}
      editorial={editorial}
      hideLegalDisclaimer={true}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}

