import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Flame, ChefHat, BookOpen } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TomatoAndBasilBruschettaCalculator() {
  const [servings, setServings] = useState(4); // Default servings

  // --- INGREDIENTS DATA (Scaleable) ---
  // Base quantities for 4 servings
  const baseIngredients = [
    { name: "San Marzano tomatoes (key)", amount: 400, unit: "g", text: "San Marzano tomatoes, peeled and diced (14 oz)" },
    { name: "Fresh basil leaves (key)", amount: 15, unit: "g", text: "Fresh basil leaves, finely chopped (about 0.5 oz)" },
    { name: "Extra virgin olive oil (key)", amount: 60, unit: "ml", text: "Extra virgin olive oil (1/4 cup)" },
    { name: "Garlic cloves", amount: 2, unit: "cloves", text: "Garlic cloves, finely minced" },
    { name: "Salt", amount: 1, unit: "tsp", text: "Fine sea salt" },
    { name: "Freshly ground black pepper", amount: 0.5, unit: "tsp", text: "Freshly ground black pepper" },
    { name: "Baguette or rustic Italian bread", amount: 1, unit: "loaf", text: "One medium baguette or rustic Italian bread, sliced (about 12 slices)" },
    { name: "Balsamic vinegar (optional)", amount: 10, unit: "ml", text: "Balsamic vinegar (2 tsp), optional for drizzling" },
  ];

  const nutrition = {
    calories: "180",
    protein: "3g",
    carbs: "20g",
    fat: "9g",
  };

  // Helper to format amount based on servings
  const getAmount = (base: number) => {
    const val = base * (servings / 4);
    return Number.isInteger(val) ? val : val.toFixed(1);
  };

  const faqs = [
    {
      question: "Can I use other types of tomatoes instead of San Marzano?",
      answer:
        "Yes, while San Marzano tomatoes are prized for their sweetness and low acidity, you can substitute with ripe plum tomatoes or cherry tomatoes for a fresh, vibrant flavor.",
    },
    {
      question: "How do I keep the bread from getting soggy?",
      answer:
        "Toast the bread slices until golden and crisp before topping. Also, avoid adding too much tomato mixture at once; serve immediately after assembling.",
    },
    {
      question: "Can I prepare the tomato topping in advance?",
      answer:
        "Absolutely. The tomato and basil mixture can be prepared a few hours ahead and refrigerated to allow flavors to meld. Add olive oil and seasoning just before serving for freshness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- CONTENT SECTIONS ---
  const widget = (
    <div className="space-y-6">
      {/* SERVINGS ADJUSTER */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" /> Adjust Servings
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setServings((s) => Math.max(1, s - 1))}>
              -
            </Button>
            <span className="font-bold w-8 text-center">{servings}</span>
            <Button variant="outline" size="icon" onClick={() => setServings((s) => s + 1)}>
              +
            </Button>
          </div>
        </div>

        {/* DYNAMIC INGREDIENTS LIST */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold uppercase text-slate-500 mb-2">Ingredients</h4>
          <ul className="space-y-2 text-sm">
            {baseIngredients.map((ing, i) => (
              <li key={i} className="flex justify-between border-b border-dashed pb-1 last:border-0">
                <span>{ing.text || ing.name}</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {ing.unit === "loaf" || ing.unit === "cloves"
                    ? `${Math.round(getAmount(ing.amount))} ${ing.unit}`
                    : ing.unit === "tsp"
                    ? `${getAmount(ing.amount)} tsp`
                    : ing.unit === "ml"
                    ? `${getAmount(ing.amount)} ml (${(getAmount(ing.amount) / 240).toFixed(2)} cups)`
                    : ing.unit === "g"
                    ? `${getAmount(ing.amount)} g (${(getAmount(ing.amount) / 28.35).toFixed(1)} oz)`
                    : `${getAmount(ing.amount)} ${ing.unit}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* NUTRITION CARD */}
      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
        <CardContent className="p-4 text-center">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">Nutrition per Serving</h4>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div>
              <div className="font-bold">{nutrition.calories}</div>Kcal
            </div>
            <div>
              <div className="font-bold">{nutrition.protein}</div>Prot
            </div>
            <div>
              <div className="font-bold">{nutrition.carbs}</div>Carb
            </div>
            <div>
              <div className="font-bold">{nutrition.fat}</div>Fat
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* HERO IMAGE - POLLINATIONS.AI */}
      <div className="rounded-xl overflow-hidden aspect-video relative shadow-md mb-8">
        <img
          src="https://pollinations.ai/p/Tomato%20and%20Basil%20Bruschetta%20food%20photography%2C%20delicious%2C%20michelin%20star%20plating%2C%20photorealistic%2C%204k%2C%20cinematic%20lighting%2C%20rustic%20table?width=1200&height=675&nologo=true&seed=1134"
          alt="Tomato and Basil Bruschetta authentic recipe"
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
          loading="eager"
        />
      </div>

      {/* INTRO & HISTORY */}
      <section id="story">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-orange-500" /> The Story Behind Tomato and Basil Bruschetta
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Tomato and Basil Bruschetta is a timeless Italian antipasto that perfectly balances the vibrant acidity of ripe tomatoes with the aromatic freshness of basil. The crisp, toasted bread provides a satisfying crunch that contrasts beautifully with the juicy, herbaceous topping. This dish is iconic for its simplicity and the way it celebrates the essence of fresh, high-quality ingredients, making it a beloved starter in Italian cuisine and a symbol of Mediterranean summer flavors.
          </p>
          <p>
            Originating from the rustic kitchens of central Italy, particularly the regions of Tuscany and Lazio, bruschetta was traditionally a way for farmers to salvage day-old bread by toasting it and topping it with local produce. The classic tomato and basil version emerged as tomatoes became widely available in Europe, evolving into a dish that embodies the Italian philosophy of cucina povera — simple, humble ingredients prepared with care and respect.
          </p>
          <p>
            Today, Tomato and Basil Bruschetta remains a staple at Italian tables worldwide, celebrated for its fresh, vibrant flavors and its ability to evoke the warmth of Italian hospitality.
          </p>
        </div>
      </section>

      {/* INSTRUCTIONS */}
      <section id="instructions" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ChefHat className="w-6 h-6 text-orange-500" /> Step-by-Step Instructions
        </h2>
        <ol className="list-decimal pl-5 space-y-4 text-slate-700 dark:text-slate-300">
          <li className="pl-2">
            <strong>Prepare the tomatoes:</strong> Drain the canned San Marzano tomatoes if using canned, then dice them finely. If using fresh tomatoes, blanch them in boiling water for 30 seconds, peel, and dice. Place the diced tomatoes in a mixing bowl.
          </li>
          <li className="pl-2">
            <strong>Mix the topping:</strong> Add the finely minced garlic, chopped fresh basil leaves, extra virgin olive oil, salt, and freshly ground black pepper to the tomatoes. Gently fold the ingredients together to combine without breaking down the tomatoes. Optionally, add a splash of balsamic vinegar for subtle sweetness and acidity.
          </li>
          <li className="pl-2">
            <strong>Toast the bread:</strong> Slice the baguette or rustic Italian bread into 1/2-inch thick slices. Toast the slices on a grill pan or under a broiler until golden brown and crisp on both sides. Immediately rub one side of each toast with a cut garlic clove to infuse subtle garlic aroma.
          </li>
          <li className="pl-2">
            <strong>Assemble bruschetta:</strong> Spoon the tomato and basil mixture generously onto each toasted bread slice. Arrange on a serving platter.
          </li>
          <li className="pl-2">
            <strong>Serve immediately:</strong> Serve the bruschetta fresh to preserve the contrast between the crunchy bread and juicy topping. Garnish with extra basil leaves if desired.
          </li>
        </ol>
      </section>

      {/* CHEF TIPS */}
      <section id="tips" className="bg-yellow-50 dark:bg-yellow-950/30 p-6 rounded-xl border border-yellow-200">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          <Flame className="w-5 h-5" /> Chef's Secrets
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-yellow-900 dark:text-yellow-100">
          <li>Use ripe, high-quality San Marzano tomatoes for authentic sweetness and low acidity that balances the dish perfectly.</li>
          <li>Toast the bread slices until just golden and crisp to avoid sogginess when topped with the tomato mixture.</li>
          <li>Rub the toasted bread with fresh garlic immediately after toasting to impart a subtle, fragrant garlic flavor without overpowering.</li>
          <li>Let the tomato and basil mixture rest for 10-15 minutes before assembling to allow flavors to meld beautifully.</li>
        </ul>
      </section>

      {/* STORAGE */}
      <section id="storage">
        <h2 className="text-xl font-bold mb-3">Storage & Reheating</h2>
        <p className="text-slate-600 dark:text-slate-400">
          The tomato and basil topping can be stored in an airtight container in the refrigerator for up to 2 days. For best flavor, prepare the bread fresh and toast just before serving to maintain crispness. Avoid assembling bruschetta in advance as the bread will become soggy. If needed, re-toast bread slices briefly in a hot oven before serving. Bruschetta is best enjoyed fresh and is not recommended for freezing.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b pb-4">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Tomato and Basil Bruschetta"
      description="Authentic recipe for Tomato and Basil Bruschetta. Comprehensive guide including history, step-by-step instructions, nutrition, and chef tips."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={{
        title: "Serving Suggestion",
        scenario: "Best served with a chilled glass of crisp white wine or a light Italian rosé. Pair with antipasti such as prosciutto, olives, and fresh mozzarella for a complete Mediterranean experience.",
        steps: [],
        result: "Perfect Pairings: The bright acidity and herbal notes of the bruschetta complement fresh cheeses and cured meats beautifully, making it an ideal starter for any Italian-inspired meal.",
      }}
      relatedCalculators={[]}
      onThisPage={[
        { id: "story", label: "Story" },
        { id: "instructions", label: "Instructions" },
        { id: "tips", label: "Chef Tips" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}