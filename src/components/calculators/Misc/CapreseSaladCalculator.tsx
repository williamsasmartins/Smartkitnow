import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CapreseSaladCalculator() {
  const title = "Caprese Salad";
  const description =
    "Layers of fresh mozzarella, ripe tomatoes, and basil drizzled with olive oil and balsamic.";

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>Prep time: 10 minutes</div>
          <div>Cook time: 0 minutes</div>
          <div>Best served: immediately</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-5 space-y-1.5 text-sm">
            <li>Ripe tomatoes</li>
            <li>Fresh mozzarella</li>
            <li>Fresh basil leaves</li>
            <li>Extra virgin olive oil</li>
            <li>Balsamic vinegar or balsamic glaze</li>
            <li>Salt and black pepper</li>
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
          Caprese salad is a classic Italian starter built around high-quality ingredients.
          Use the best tomatoes and mozzarella you can find, and season right before
          serving for the cleanest flavors.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Instructions</h2>
        <ol className="mt-3 list-decimal ml-5 space-y-2 text-base leading-relaxed text-muted-foreground">
          <li>Slice tomatoes and mozzarella into even rounds.</li>
          <li>Layer tomato, mozzarella, and basil on a plate.</li>
          <li>Drizzle with olive oil and balsamic, then season to taste.</li>
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

