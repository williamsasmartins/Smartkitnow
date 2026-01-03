import RecipeLayout from '@/components/templates/RecipeLayout';
import { ChefHat, BookOpen, Flame, HelpCircle, Utensils, Wine } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TomatoAndBasilBruschettaRecipeCalculator() {
  // --- 1. HEAD DATA ---
  const title = "Classic Tomato and Basil Bruschetta: A Rustic Italian Delight";
  const description =
    "Discover the vibrant flavors of Tomato and Basil Bruschetta, a classic Italian appetizer bursting with fresh tomatoes, fragrant basil, and toasted garlic bread.";
  const imagePath =
    "https://pollinations.ai/p/Tomato%20and%20Basil%20Bruschetta%20food%20photography%2C%20close-up%2C%20michelin%20star%20plating%2C%20rustic%20italian%20mood%2C%20steam%20rising%2C%208k%20resolution%2C%20cinematic%20lighting%2C%20shallow%20depth%20of%20field%2C%20highly%20detailed%20texture%2C%20garnish%20details?width=1200&height=675&nologo=true&seed=2673";

  // --- 2. RECIPE CARD ---
  const prepTime = "15 mins";
  const cookTime = "10 mins";
  const difficulty = "Intermediate";
  const servingsDefault = 4;

  // --- 3. INGREDIENTS (BASE FOR 4) ---
  const ingredients = [
    { name: "Ripe Roma Tomatoes", amount: 500, unit: "g", text: "diced" },
    { name: "Fresh Basil Leaves", amount: 15, unit: "g", text: "finely chopped" },
    { name: "Extra Virgin Olive Oil", amount: 60, unit: "ml", text: "plus extra for brushing" },
    { name: "Garlic Cloves", amount: 3, unit: "cloves", text: "minced" },
    { name: "Salt", amount: 1.5, unit: "tsp", text: "to taste" },
    { name: "Freshly Ground Black Pepper", amount: 0.5, unit: "tsp", text: "to taste" },
    { name: "Baguette or Rustic Italian Bread", amount: 1, unit: "loaf", text: "sliced about 1 cm thick" },
    { name: "Balsamic Vinegar", amount: 10, unit: "ml", text: "optional, for drizzle" },
    { name: "Fresh Garlic Clove", amount: 1, unit: "clove", text: "halved, for rubbing on bread" },
  ];

  // --- 4. NUTRITION (PER SERVING) ---
  const nutrition = {
    calories: "180",
    protein: "4g",
    carbs: "22g",
    fat: "8g",
  };

  // --- 5. FAQ ---
  const faqs = [
    {
      question: "Can I use other types of tomatoes for bruschetta?",
      answer:
        "Absolutely! While Roma tomatoes are preferred for their firm texture and low moisture, you can use cherry or heirloom tomatoes. Just be sure to remove excess juice to avoid soggy bread.",
    },
    {
      question: "How should I store leftover bruschetta topping?",
      answer:
        "Store the tomato and basil mixture in an airtight container in the refrigerator for up to 2 days. Avoid mixing it with the bread until ready to serve to keep the bread crisp.",
    },
    {
      question: "Why does my bruschetta bread get soggy quickly?",
      answer:
        "Sogginess usually happens if the tomato mixture is too watery or applied too early. Toast the bread until golden and rub with garlic immediately before topping to maintain crispness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 6. EDITORIAL CONTENT ---
  const editorial = (
    <div className="space-y-12">
      {/* Introduction & History */}
      <section>
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
          <p className="lead">
            Imagine biting into a slice of toasted rustic bread, its edges perfectly crisp and golden, releasing a warm, nutty aroma. Topped with a vibrant medley of sun-ripened tomatoes bursting with juiciness, fragrant basil leaves, and a drizzle of peppery extra virgin olive oil, Tomato and Basil Bruschetta is a sensory celebration of freshness and texture. The subtle garlic undertone lingers, inviting you to savor each mouthful with delight.
          </p>
          <p>
            This iconic Italian appetizer is legendary for its simplicity and depth of flavor. Every ingredient plays a starring role, harmonizing to create a dish that is both rustic and refined. The contrast between the crunchy bread and the juicy, herbaceous topping makes it an irresistible starter that awakens the palate and sets the tone for any meal.
          </p>
        </div>
      </section>

      {/* Origin & Culture */}
      <section>
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
          <p className="lead">
            Bruschetta traces its roots back to ancient Italy, where it was originally a humble peasant food designed to salvage stale bread by toasting it and topping it with simple, fresh ingredients. The name itself derives from the Italian verb “bruscare,” meaning “to roast over coals,” reflecting its rustic origins.
          </p>
          <p>
            Traditionally from the central regions of Italy, especially Tuscany and Umbria, bruschetta embodies the Italian ethos of cucina povera—cooking with what’s fresh and available. Over centuries, it has evolved from a modest snack to a celebrated dish featured in Michelin-starred restaurants worldwide, symbolizing the beauty of simplicity and quality ingredients.
          </p>
        </div>
      </section>

      {/* Step-by-Step Instructions */}
      <section id="instructions" className="scroll-mt-24">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
          <ChefHat className="w-8 h-8 text-orange-500" /> Instructions
        </h2>
        <ol className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-10">
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
              <span className="text-orange-800 dark:text-orange-200 font-bold">1</span>
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Prepare the Tomato Mixture</h3>
            <p className="text-slate-700 dark:text-slate-400">
              <strong>Dice</strong> the ripe Roma tomatoes into uniform pieces to ensure even texture. <strong>Finely chop</strong> fresh basil leaves and <strong>mince</strong> garlic cloves. In a bowl, <strong>combine</strong> tomatoes, basil, minced garlic, 60 ml of extra virgin olive oil, salt, and freshly ground black pepper. <strong>Gently fold</strong> to mix, allowing the flavors to meld while you prepare the bread.
            </p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
              <span className="text-orange-800 dark:text-orange-200 font-bold">2</span>
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Toast the Bread</h3>
            <p className="text-slate-700 dark:text-slate-400">
              <strong>Slice</strong> the baguette or rustic Italian bread into 1 cm thick pieces. <strong>Brush</strong> each slice lightly with extra virgin olive oil on both sides. <strong>Toast</strong> the bread on a grill pan or under a broiler until golden brown and crisp, about 2-3 minutes per side. The bread should emit a warm, nutty aroma and have a satisfying crunch.
            </p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
              <span className="text-orange-800 dark:text-orange-200 font-bold">3</span>
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Infuse Bread with Garlic</h3>
            <p className="text-slate-700 dark:text-slate-400">
              While the bread is still warm, <strong>rub</strong> one side of each slice with the cut side of a fresh garlic clove. This subtle step infuses the bread with a delicate garlic aroma without overpowering the topping.
            </p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
              <span className="text-orange-800 dark:text-orange-200 font-bold">4</span>
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Assemble and Serve</h3>
            <p className="text-slate-700 dark:text-slate-400">
              <strong>Spoon</strong> the tomato and basil mixture generously onto each garlic-rubbed toast slice just before serving to maintain crispness. Optionally, <strong>drizzle</strong> a few drops of aged balsamic vinegar over the top for a subtle tangy contrast. Serve immediately and enjoy the symphony of textures and flavors.
            </p>
          </li>
        </ol>
      </section>

      {/* Chef Secrets */}
      <section
        id="tips"
        className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-2xl border border-amber-100 dark:border-amber-900/50"
      >
        <h3 className="font-bold text-2xl mb-4 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <Flame className="w-6 h-6" /> Chef's Secrets
        </h3>
        <ul className="space-y-3">
          <li className="flex gap-3 text-amber-900 dark:text-amber-100">
            <span className="text-amber-500 font-bold">✓</span>
            <span>
              <strong>Tomato Selection:</strong> Choose firm, ripe Roma tomatoes for a perfect balance of sweetness and acidity. Their lower water content prevents sogginess in the topping.
            </span>
          </li>
          <li className="flex gap-3 text-amber-900 dark:text-amber-100">
            <span className="text-amber-500 font-bold">✓</span>
            <span>
              <strong>Garlic Infusion:</strong> Rubbing warm toast with fresh garlic releases essential oils gently, imparting aroma without overwhelming the palate.
            </span>
          </li>
          <li className="flex gap-3 text-amber-900 dark:text-amber-100">
            <span className="text-amber-500 font-bold">✓</span>
            <span>
              <strong>Timing is Key:</strong> Assemble bruschetta just before serving to keep the bread crisp and the topping fresh and vibrant.
            </span>
          </li>
        </ul>
      </section>

      {/* Pairing */}
      <section id="pairing">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <Wine className="w-6 h-6 text-purple-500" /> Perfect Pairing
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          The bright acidity and herbal notes of Tomato and Basil Bruschetta pair exquisitely with a crisp, chilled Italian Pinot Grigio or a light-bodied Sauvignon Blanc. For a non-alcoholic option, try sparkling water infused with a twist of lemon and fresh basil leaves to echo the dish’s freshness.
        </p>
      </section>

      {/* FAQ Display */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-500" /> Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800"
            >
              <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <RecipeLayout
      title={title}
      description={description}
      imagePath={imagePath}
      prepTime={prepTime}
      cookTime={cookTime}
      difficulty={difficulty}
      servingsDefault={servingsDefault}
      ingredients={ingredients}
      nutrition={nutrition}
      editorial={editorial}
      faqs={faqs}
      jsonLd={faqJsonLd}
      showSuggestionBox={true}
      showShareButtons={true}
    />
  );
}