import RecipeLayout from '@/components/templates/RecipeLayout';
import { ChefHat, BookOpen, Flame, HelpCircle, Utensils, Wine } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TomatoAndBasilBruschettaCalculator() {
  // --- 1. HEAD DATA ---
  const title = "Classic Tomato and Basil Bruschetta: Rustic Italian Delight";
  const description =
    "Experience the vibrant flavors of classic Tomato and Basil Bruschetta—crisp toasted bread topped with juicy tomatoes, fragrant basil, and a drizzle of extra virgin olive oil.";
  const imagePath =
    "https://pollinations.ai/p/Tomato%20and%20Basil%20Bruschetta%20food%20photography%2C%20close-up%2C%20michelin%20star%20plating%2C%20rustic%20italian%20mood%2C%20steam%20rising%2C%208k%20resolution%2C%20cinematic%20lighting%2C%20shallow%20depth%20of%20field%2C%20highly%20detailed%20texture%2C%20garnish%20details?width=1200&height=675&nologo=true&seed=2673";

  // --- 2. RECIPE CARD ---
  const prepTime = "15 mins";
  const cookTime = "10 mins";
  const difficulty = "Intermediate";
  const servingsDefault = 4;

  // --- 3. INGREDIENTS (BASE FOR 4) ---
  const ingredients = [
    { name: "Ripe Roma Tomatoes", amount: 400, unit: "g", text: "diced" },
    { name: "Fresh Basil Leaves", amount: 15, unit: "g", text: "finely chopped" },
    { name: "Extra Virgin Olive Oil", amount: 60, unit: "ml", text: "plus extra for drizzling" },
    { name: "Garlic Cloves", amount: 2, unit: "cloves", text: "minced" },
    { name: "Salt", amount: 1, unit: "tsp", text: "fine sea salt" },
    { name: "Freshly Ground Black Pepper", amount: 0.5, unit: "tsp", text: "to taste" },
    { name: "Balsamic Vinegar", amount: 10, unit: "ml", text: "optional, aged" },
    { name: "Rustic Italian Bread", amount: 1, unit: "loaf", text: "cut into 12 slices" },
    { name: "Garlic Clove", amount: 1, unit: "clove", text: "halved, for rubbing on bread" },
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
        "Absolutely! While Roma tomatoes are preferred for their firm texture and balanced acidity, you can use cherry or heirloom tomatoes. Just ensure they are ripe and juicy for the best flavor and texture.",
    },
    {
      question: "How should I store leftover bruschetta topping?",
      answer:
        "Store the tomato and basil mixture in an airtight container in the refrigerator for up to 2 days. Avoid adding it to the toasted bread until ready to serve to prevent sogginess.",
    },
    {
      question: "Why is it important to rub garlic on the toasted bread?",
      answer:
        "Rubbing garlic on warm toasted bread infuses it with a subtle, aromatic garlic flavor without overpowering the dish, creating a perfect flavor base for the fresh tomato topping.",
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
            Imagine biting into a slice of perfectly toasted rustic bread, its edges golden and crisp, releasing a warm, nutty aroma. On top, a vibrant mosaic of juicy, sun-ripened tomatoes bursts with freshness, mingling with the sweet, herbaceous scent of freshly torn basil leaves. A delicate drizzle of peppery extra virgin olive oil ties these elements together, creating a symphony of textures and flavors that dance on your palate.
          </p>
          <p>
            Tomato and Basil Bruschetta is more than just an appetizer; it is a celebration of simplicity and quality ingredients. This legendary Italian dish captures the essence of summer in every bite, balancing acidity, sweetness, and aromatic herbs to create an unforgettable sensory experience.
          </p>
        </div>
      </section>

      <section>
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
          <p className="lead">
            Originating from the sun-drenched regions of central Italy, particularly Tuscany and Umbria, bruschetta was historically a humble peasant food. Farmers would toast stale bread over an open flame and top it with garlic and olive oil to revive it, making the most of simple pantry staples.
          </p>
          <p>
            Over centuries, this rustic tradition evolved into a beloved antipasto enjoyed across Italy and worldwide. The classic tomato and basil topping reflects the Mediterranean bounty, embodying the Italian philosophy of cucina povera — transforming modest ingredients into culinary magic through technique and passion.
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
              <strong>Dice</strong> the ripe Roma tomatoes into uniform pieces to ensure even flavor distribution. <strong>Finely chop</strong> the fresh basil leaves and <strong>mince</strong> the garlic cloves. In a bowl, <strong>combine</strong> tomatoes, basil, garlic, extra virgin olive oil, salt, freshly ground black pepper, and optional aged balsamic vinegar. <strong>Gently fold</strong> to marry the flavors without crushing the tomatoes, allowing the mixture to rest for 10 minutes to deepen the aroma.
            </p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
              <span className="text-orange-800 dark:text-orange-200 font-bold">2</span>
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Toast the Bread</h3>
            <p className="text-slate-700 dark:text-slate-400">
              <strong>Slice</strong> the rustic Italian bread into 12 even pieces, about 1 cm thick. <strong>Toast</strong> the slices on a grill pan or under a broiler until golden brown and crisp, about 2-3 minutes per side. The bread should have a crunchy exterior with a slightly chewy interior, releasing a warm, nutty aroma.
            </p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
              <span className="text-orange-800 dark:text-orange-200 font-bold">3</span>
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Infuse Bread with Garlic</h3>
            <p className="text-slate-700 dark:text-slate-400">
              While the bread is still warm, <strong>rub</strong> each slice gently with the cut side of a garlic clove. This technique imparts a subtle, fragrant garlic essence that complements the fresh tomato topping without overpowering it.
            </p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
              <span className="text-orange-800 dark:text-orange-200 font-bold">4</span>
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Assemble and Serve</h3>
            <p className="text-slate-700 dark:text-slate-400">
              <strong>Top</strong> each garlic-rubbed toast slice generously with the tomato and basil mixture. <strong>Drizzle</strong> with a little extra virgin olive oil for richness and a glossy finish. Serve immediately to enjoy the contrast of crunchy bread and juicy topping at its freshest.
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
              <strong>Tomato Selection:</strong> Choose firm, ripe Roma tomatoes for their low moisture and balanced acidity, which prevents soggy bread and ensures a vibrant flavor.
            </span>
          </li>
          <li className="flex gap-3 text-amber-900 dark:text-amber-100">
            <span className="text-amber-500 font-bold">✓</span>
            <span>
              <strong>Olive Oil Quality:</strong> Use a high-quality extra virgin olive oil with a peppery finish to elevate the dish’s complexity and add a luscious mouthfeel.
            </span>
          </li>
          <li className="flex gap-3 text-amber-900 dark:text-amber-100">
            <span className="text-amber-500 font-bold">✓</span>
            <span>
              <strong>Toasting Technique:</strong> Toast bread just until golden and crisp; over-toasting creates bitterness and a dry texture that clashes with the juicy topping.
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
          This bright and herbaceous bruschetta pairs beautifully with a crisp, chilled Vermentino or Sauvignon Blanc, whose citrus and green notes complement the fresh tomatoes and basil. For a non-alcoholic option, try sparkling water infused with lemon and fresh mint to refresh the palate.
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