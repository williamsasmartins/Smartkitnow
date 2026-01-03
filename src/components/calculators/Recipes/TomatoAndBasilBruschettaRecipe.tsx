import RecipeLayout from '@/components/templates/RecipeLayout';
import { ChefHat, BookOpen, Flame, HelpCircle, Utensils, Wine } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TomatoAndBasilBruschettaRecipeCalculator() {
  // --- 1. HEAD DATA ---
  const title = "Classic Tomato and Basil Bruschetta: Rustic Italian Delight";
  const description = "Discover the vibrant flavors of Tomato and Basil Bruschetta, a rustic Italian appetizer bursting with fresh tomatoes, fragrant basil, and toasted garlic bread.";
  const imagePath = "https://pollinations.ai/p/Tomato%20and%20Basil%20Bruschetta%20food%20photography%2C%20close-up%2C%20michelin%20star%20plating%2C%20rustic%20italian%20mood%2C%20steam%20rising%2C%208k%20resolution%2C%20cinematic%20lighting%2C%20shallow%20depth%20of%20field%2C%20highly%20detailed%20texture%2C%20garnish%20details?width=1200&height=675&nologo=true&seed=2673";

  // --- 2. RECIPE CARD ---
  const prepTime = "15 mins";
  const cookTime = "10 mins";
  const difficulty = "Beginner";
  const servingsDefault = 4;

  // --- 3. INGREDIENTS (BASE FOR 4) ---
  const ingredients = [
    { name: "Ripe Roma Tomatoes", amount: 400, unit: "g", text: "diced" },
    { name: "Fresh Basil Leaves", amount: 15, unit: "g", text: "finely chopped" },
    { name: "Extra Virgin Olive Oil", amount: 60, unit: "ml", text: "plus extra for drizzling" },
    { name: "Garlic Cloves", amount: 2, unit: "cloves", text: "minced" },
    { name: "Salt", amount: 1, unit: "tsp", text: "to taste" },
    { name: "Freshly Ground Black Pepper", amount: 0.5, unit: "tsp", text: "to taste" },
    { name: "Baguette or Rustic Italian Bread", amount: 1, unit: "loaf", text: "sliced about 1/2 inch thick" },
    { name: "Garlic Clove", amount: 1, unit: "clove", text: "halved for rubbing on bread" },
    { name: "Balsamic Vinegar", amount: 10, unit: "ml", text: "optional, for a subtle tang" },
  ];

  // --- 4. NUTRITION (PER SERVING) ---
  const nutrition = {
    calories: "180",
    protein: "3g",
    carbs: "22g",
    fat: "9g"
  };

  // --- 5. FAQ ---
  const faqs = [
    {
      question: "Can I use other types of tomatoes for bruschetta?",
      answer: "Absolutely! While Roma tomatoes are preferred for their firm texture and low moisture, cherry or heirloom tomatoes can add unique sweetness and color. Just be mindful of excess juice which can make the topping soggy."
    },
    {
      question: "How should I store leftover bruschetta topping?",
      answer: "Store the tomato and basil mixture in an airtight container in the refrigerator for up to 2 days. Keep the toasted bread separate to maintain its crispness and assemble just before serving."
    },
    {
      question: "Why should I rub garlic on the toasted bread?",
      answer: "Rubbing garlic on the warm toasted bread infuses it with a subtle, aromatic garlic flavor without overpowering the fresh tomato topping. It’s a classic technique that elevates the overall taste experience."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 6. EDITORIAL CONTENT ---
  const editorial = (
    <div className="space-y-12">
      {/* Introduction & History */}
      <section>
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
          <p className="lead">
            Imagine biting into a crisp, golden slice of toasted bread, its surface gently infused with the warm aroma of garlic. Atop this, a vibrant medley of sun-ripened tomatoes and freshly torn basil bursts with juicy sweetness and herbaceous freshness, creating a symphony of textures and flavors that dance on your palate. This is Tomato and Basil Bruschetta — a dish that celebrates simplicity elevated to art.
          </p>
          <p>
            The beauty of bruschetta lies in its rustic charm and sensory appeal: the crunch of the bread, the juicy pop of tomatoes, the fragrant kiss of basil, and the silky richness of olive oil all combine to create an unforgettable appetizer that awakens the senses and invites convivial sharing.
          </p>
        </div>
      </section>

      {/* Origin & Culture */}
      <section>
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
          <p className="lead">
            Originating from the sun-drenched regions of central Italy, particularly Tuscany and Umbria, bruschetta was historically a humble peasant food designed to salvage day-old bread by topping it with local, fresh ingredients. The name itself derives from the Italian verb “bruscare,” meaning “to roast over coals,” highlighting the importance of toasted bread as the foundation.
          </p>
          <p>
            Though born from simplicity, bruschetta has transcended its rustic roots to become a beloved staple in Italian cuisine worldwide. Its authentic preparation honors seasonal produce and artisanal bread, embodying the Italian philosophy of cucina povera — making the most of modest ingredients to create extraordinary flavor.
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
              <strong>Dice</strong> the ripe Roma tomatoes into uniform pieces to ensure even texture. <strong>Finely chop</strong> fresh basil leaves and <strong>mince</strong> garlic cloves. In a bowl, <strong>combine</strong> tomatoes, basil, minced garlic, extra virgin olive oil, salt, and freshly ground black pepper. Optionally, <strong>add</strong> a splash of balsamic vinegar for a subtle tang. <strong>Stir</strong> gently to marry the flavors and set aside to let the aromas meld.
            </p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
              <span className="text-orange-800 dark:text-orange-200 font-bold">2</span>
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Toast the Bread</h3>
            <p className="text-slate-700 dark:text-slate-400">
              <strong>Slice</strong> the baguette or rustic Italian bread into 1/2-inch thick pieces. <strong>Toast</strong> the slices on a grill pan or under a broiler until golden brown and crisp, about 2-3 minutes per side. The bread should have a warm, nutty aroma and a satisfying crunch that contrasts beautifully with the juicy topping.
            </p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
              <span className="text-orange-800 dark:text-orange-200 font-bold">3</span>
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Infuse Bread with Garlic</h3>
            <p className="text-slate-700 dark:text-slate-400">
              While the bread is still warm, <strong>rub</strong> the cut side of a halved garlic clove gently over each slice. This technique imparts a subtle, fragrant garlic essence without overpowering the fresh tomato topping.
            </p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
              <span className="text-orange-800 dark:text-orange-200 font-bold">4</span>
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Assemble and Serve</h3>
            <p className="text-slate-700 dark:text-slate-400">
              <strong>Top</strong> each garlic-rubbed toast slice generously with the tomato and basil mixture. <strong>Drizzle</strong> with a little extra virgin olive oil for silkiness and garnish with a small basil leaf if desired. Serve immediately to enjoy the perfect balance of crunchy, juicy, and aromatic sensations.
            </p>
          </li>
        </ol>
      </section>

      {/* Chef Secrets */}
      <section id="tips" className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-2xl border border-amber-100 dark:border-amber-900/50">
        <h3 className="font-bold text-2xl mb-4 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <Flame className="w-6 h-6" /> Chef's Secrets
        </h3>
        <ul className="space-y-3">
          <li className="flex gap-3 text-amber-900 dark:text-amber-100">
            <span className="text-amber-500 font-bold">✓</span>
            <span><strong>Use Room Temperature Tomatoes:</strong> Chilled tomatoes mute flavor and aroma. Let them sit at room temperature before dicing to maximize their natural sweetness and juiciness.</span>
          </li>
          <li className="flex gap-3 text-amber-900 dark:text-amber-100">
            <span className="text-amber-500 font-bold">✓</span>
            <span><strong>Toast Bread Just Before Serving:</strong> Toasted bread loses its crispness quickly. Prepare it last and assemble bruschetta immediately to maintain the perfect crunch.</span>
          </li>
          <li className="flex gap-3 text-amber-900 dark:text-amber-100">
            <span className="text-amber-500 font-bold">✓</span>
            <span><strong>Balance Acidity and Sweetness:</strong> If your tomatoes are too acidic, a tiny pinch of sugar or a splash of balsamic vinegar can harmonize the flavors beautifully.</span>
          </li>
        </ul>
      </section>

      {/* Pairing */}
      <section id="pairing">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <Wine className="w-6 h-6 text-purple-500" /> Perfect Pairing
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          The bright acidity and fresh herbaceous notes of Tomato and Basil Bruschetta pair exquisitely with a crisp, chilled Italian white wine such as Pinot Grigio or Verdicchio. For a non-alcoholic option, sparkling water with a twist of lemon complements the dish’s vibrant flavors and refreshes the palate.
        </p>
      </section>

      {/* FAQ Display */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-500" /> Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
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