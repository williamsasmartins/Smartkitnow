import RecipeLayout from '@/components/templates/RecipeLayout';
import { ChefHat, BookOpen, Flame, HelpCircle, Utensils, Wine } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TomatoAndBasilBruschettaRecipeCalculator() {
  // --- 1. HEAD DATA ---
  const title = "Classic Tomato and Basil Bruschetta: Rustic Italian Delight";
  const description =
    "Discover the vibrant flavors of Tomato and Basil Bruschetta, a rustic Italian appetizer bursting with fresh tomatoes, fragrant basil, and toasted garlic bread.";
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
    { name: "Extra Virgin Olive Oil", amount: 60, unit: "ml", text: "cold-pressed" },
    { name: "Garlic Cloves", amount: 3, unit: "cloves", text: "minced" },
    { name: "Baguette or Rustic Italian Bread", amount: 1, unit: "loaf", text: "sliced into 1/2 inch pieces" },
    { name: "Sea Salt", amount: 1.5, unit: "tsp", text: "to taste" },
    { name: "Freshly Ground Black Pepper", amount: 1, unit: "tsp", text: "to taste" },
    { name: "Balsamic Vinegar", amount: 15, unit: "ml", text: "optional, for drizzle" },
    { name: "Fresh Garlic Clove", amount: 1, unit: "clove", text: "halved, for rubbing on bread" },
  ];

  // --- 4. NUTRITION (PER SERVING) ---
  const nutrition = {
    calories: "180",
    protein: "3g",
    carbs: "22g",
    fat: "9g",
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
        "Store the tomato and basil mixture in an airtight container in the refrigerator for up to 2 days. Avoid storing the bread with the topping to keep it crisp.",
    },
    {
      question: "My bread gets soggy quickly. How can I prevent this?",
      answer:
        "Toast the bread slices until golden and rub them with a fresh garlic clove immediately after to create a subtle barrier. Serve the tomato topping just before eating to maintain crunch.",
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
            Imagine biting into a crisp, golden slice of toasted bread, its surface kissed by the warmth of the grill, releasing a subtle nuttiness. On top, a vibrant medley of sun-ripened tomatoes bursts with juicy sweetness, harmonized by the fresh, aromatic embrace of basil and the gentle pungency of garlic. This is Tomato and Basil Bruschetta — a symphony of textures and flavors that awakens the senses with every bite.
          </p>
          <p>
            This iconic Italian appetizer is celebrated for its simplicity and freshness, a dish that elevates humble ingredients into an unforgettable experience. The interplay of crunchy bread, juicy tomatoes, fragrant herbs, and silky olive oil creates a perfect balance that has made bruschetta a beloved starter worldwide.
          </p>
        </div>
      </section>

      <section>
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
          <p className="lead">
            Originating from the sun-drenched regions of central Italy, particularly Tuscany and Umbria, bruschetta was traditionally a peasant food designed to use day-old bread and fresh garden produce. The word “bruschetta” derives from the Italian “bruscare,” meaning to roast over coals, reflecting the rustic method of toasting bread to bring out its nutty aroma and crunchy texture.
          </p>
          <p>
            Though born from simplicity, bruschetta has transcended its humble roots to become a staple of Italian cuisine, celebrated in trattorias and Michelin-starred restaurants alike. Its enduring appeal lies in the respect for quality ingredients and the artful balance of flavors that capture the essence of Italian culinary tradition.
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
              <strong>Dice</strong> the ripe Roma tomatoes into uniform pieces to ensure even flavor distribution. <strong>Finely chop</strong> fresh basil leaves and <strong>mince</strong> garlic cloves. In a bowl, <strong>combine</strong> tomatoes, basil, minced garlic, and 45 ml of extra virgin olive oil. <strong>Season</strong> with sea salt and freshly ground black pepper to taste. Let the mixture rest for 10 minutes to allow the flavors to meld and the tomatoes to release their natural juices.
            </p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
              <span className="text-orange-800 dark:text-orange-200 font-bold">2</span>
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Toast the Bread</h3>
            <p className="text-slate-700 dark:text-slate-400">
              <strong>Slice</strong> the baguette or rustic Italian bread into 1/2-inch thick pieces. <strong>Toast</strong> the slices on a grill pan or under a broiler until they are golden brown and crisp, about 2-3 minutes per side. The toasting process releases a warm, nutty aroma and creates a sturdy base that resists sogginess.
            </p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
              <span className="text-orange-800 dark:text-orange-200 font-bold">3</span>
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Rub with Garlic</h3>
            <p className="text-slate-700 dark:text-slate-400">
              Immediately after toasting, <strong>rub</strong> each bread slice with the cut side of a fresh garlic clove. This subtle step infuses the bread with a delicate garlic fragrance without overpowering the topping.
            </p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
              <span className="text-orange-800 dark:text-orange-200 font-bold">4</span>
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Assemble and Serve</h3>
            <p className="text-slate-700 dark:text-slate-400">
              <strong>Spoon</strong> the tomato and basil mixture generously over each garlic-rubbed toast. <strong>Drizzle</strong> with the remaining 15 ml of extra virgin olive oil and a light splash of balsamic vinegar if desired, adding a subtle tang and depth. Serve immediately to enjoy the contrast of crunchy bread and juicy topping at its peak freshness.
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
              <strong>Tomato Selection:</strong> Choose firm, ripe Roma tomatoes for their low moisture and intense flavor. Overly juicy tomatoes can make the bread soggy.
            </span>
          </li>
          <li className="flex gap-3 text-amber-900 dark:text-amber-100">
            <span className="text-amber-500 font-bold">✓</span>
            <span>
              <strong>Toast Temperature:</strong> Toast bread over medium-high heat to develop a golden crust without burning, which enhances the nutty aroma and texture.
            </span>
          </li>
          <li className="flex gap-3 text-amber-900 dark:text-amber-100">
            <span className="text-amber-500 font-bold">✓</span>
            <span>
              <strong>Garlic Rub Timing:</strong> Rub the bread immediately after toasting while still warm to maximize garlic infusion without overpowering the topping.
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
          This bruschetta pairs exquisitely with a crisp, chilled glass of Italian Pinot Grigio or a light, herbaceous Sauvignon Blanc. For a non-alcoholic option, try sparkling water infused with fresh lemon and basil to echo the dish’s vibrant freshness.
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