import RecipeLayout from '@/components/templates/RecipeLayout';
import { ChefHat, BookOpen, Flame, HelpCircle, Wine, Utensils } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TomatoAndBasilBruschettaRecipeCalculator() {
  // 1. META DATA
  const title = "Tomato and Basil Bruschetta"; 
  const description = "Experience the perfect harmony of crunchy toasted bread, juicy San Marzano tomatoes, and fragrant fresh basil in this classic Italian bruschetta recipe.";
  const imagePath = "https://pollinations.ai/p/Tomato%20and%20Basil%20Bruschetta%20food%20photography%2C%20michelin%20star%20plating%2C%20close-up%2C%20steam%20rising%2C%20cinematic%20lighting%2C%20highly%20detailed%2C%208k%2C%20rustic%20background%2C%20delicious?width=1200&height=675&nologo=true&seed=15309";

  // 2. CARD DATA
  const prepTime = "15 mins";
  const cookTime = "10 mins";
  const difficulty = "Easy";
  const servingsDefault = 4;

  // 3. INGREDIENTS LIST (Base for 4 servings)
  const ingredients = [
    { name: "San Marzano Tomatoes", amount: 500, unit: "g", text: "ripe, diced" },
    { name: "Fresh Basil Leaves", amount: 15, unit: "g", text: "roughly chopped" },
    { name: "Extra Virgin Olive Oil", amount: 60, unit: "ml", text: "plus extra for brushing bread" },
    { name: "Garlic Cloves", amount: 2, unit: "cloves", text: "peeled and halved" },
    { name: "Rustic Italian Bread", amount: 1, unit: "loaf", text: "sliced about 1.5 cm thick" },
    { name: "Sea Salt", amount: 3, unit: "g", text: "to taste" },
    { name: "Freshly Ground Black Pepper", amount: 1, unit: "tsp", text: "to taste" },
    { name: "Balsamic Vinegar", amount: 10, unit: "ml", text: "optional, for drizzling" },
  ];

  // 4. NUTRITION ESTIMATE (Per serving)
  const nutrition = { 
    calories: "180", protein: "3g", carbs: "20g", fat: "9g" 
  };

  // 5. FAQ (3 Questions)
  const faqs = [
    { question: "Can I use other types of tomatoes?", answer: "While San Marzano tomatoes offer the best balance of sweetness and acidity, you can substitute with Roma or vine-ripened tomatoes for a similar flavor." },
    { question: "How should I store leftover bruschetta?", answer: "Store the tomato mixture separately in an airtight container in the refrigerator for up to 2 days. Toast the bread fresh before serving to maintain crunch." },
    { question: "Can I add other toppings to bruschetta?", answer: "Absolutely! Traditional variations include adding mozzarella, olives, or roasted peppers to customize your bruschetta." }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 6. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      {/* Intro & History */}
      <section>
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
           <p className="lead">
             Imagine biting into a slice of perfectly toasted rustic bread, its golden crust crackling under your teeth, releasing a warm, smoky aroma. The juicy burst of sun-ripened San Marzano tomatoes mingles with the fresh, peppery scent of basil, while a subtle hint of garlic and the richness of extra virgin olive oil dance on your palate. This bruschetta is a symphony of textures and flavors — crisp, fresh, vibrant, and utterly satisfying.
           </p>
           <p>
             Originating from the sun-drenched regions of central Italy, particularly Tuscany and Lazio, bruschetta was traditionally a way for farmers to salvage day-old bread by toasting it and topping it with simple, fresh ingredients. This humble antipasto has since become a beloved classic, showcasing the Italian philosophy of quality ingredients and straightforward preparation.
           </p>
        </div>
      </section>

      {/* Instructions */}
      <section id="instructions" className="scroll-mt-24">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
            <ChefHat className="w-8 h-8 text-orange-500"/> Instructions
        </h2>
        <ol className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-10">
            <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
                    <span className="text-orange-800 dark:text-orange-200 font-bold">1</span>
                </span>
                <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Prepare the Tomato Mixture</h3>
                <p className="text-slate-700 dark:text-slate-400">
                   <strong>Dice</strong> the San Marzano tomatoes into small, uniform pieces. <strong>Combine</strong> them in a bowl with the chopped fresh basil, 40 ml of extra virgin olive oil, sea salt, and freshly ground black pepper. <strong>Gently toss</strong> until well mixed and let it rest for 10 minutes to allow the flavors to meld.
                </p>
            </li>
            <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
                    <span className="text-orange-800 dark:text-orange-200 font-bold">2</span>
                </span>
                <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Toast the Bread</h3>
                <p className="text-slate-700 dark:text-slate-400">
                   <strong>Preheat</strong> your grill pan or oven to medium-high heat. <strong>Brush</strong> each slice of rustic Italian bread lightly with extra virgin olive oil. <strong>Toast</strong> the slices until golden brown and crisp, about 2-3 minutes per side, until you see a beautiful char and smell a warm, toasty aroma.
                </p>
            </li>
            <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
                    <span className="text-orange-800 dark:text-orange-200 font-bold">3</span>
                </span>
                <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Rub with Garlic</h3>
                <p className="text-slate-700 dark:text-slate-400">
                   <strong>Take</strong> the halved garlic cloves and gently rub the cut side over the warm toasted bread. This releases a subtle garlicky fragrance that infuses the bread without overpowering the topping.
                </p>
            </li>
            <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
                    <span className="text-orange-800 dark:text-orange-200 font-bold">4</span>
                </span>
                <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Assemble the Bruschetta</h3>
                <p className="text-slate-700 dark:text-slate-400">
                   <strong>Generously spoon</strong> the tomato and basil mixture onto each slice of garlic-rubbed bread. <strong>Drizzle</strong> with the remaining 20 ml of extra virgin olive oil and, if desired, a light splash of balsamic vinegar for a touch of acidity and sweetness.
                </p>
            </li>
            <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
                    <span className="text-orange-800 dark:text-orange-200 font-bold">5</span>
                </span>
                <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Serve Immediately</h3>
                <p className="text-slate-700 dark:text-slate-400">
                   <strong>Serve</strong> the bruschetta immediately to enjoy the contrast of crunchy bread and juicy topping at its peak freshness. Garnish with a few whole basil leaves for an elegant finish.
                </p>
            </li>
        </ol>
      </section>

      {/* Chef Tips */}
      <section id="tips" className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-2xl border border-amber-100 dark:border-amber-900/50">
         <h3 className="font-bold text-2xl mb-4 flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <Flame className="w-6 h-6"/> Chef's Secrets
         </h3>
         <ul className="space-y-3">
            <li className="flex gap-3 text-amber-900 dark:text-amber-100">
                <span className="text-amber-500 font-bold">✓</span>
                <span><strong>Use Day-Old Bread:</strong> Slightly stale rustic bread toasts better and holds the topping without becoming soggy.</span>
            </li>
            <li className="flex gap-3 text-amber-900 dark:text-amber-100">
                <span className="text-amber-500 font-bold">✓</span>
                <span><strong>Let Tomatoes Rest:</strong> Allow the diced tomatoes to macerate with salt and olive oil for at least 10 minutes to intensify their flavor.</span>
            </li>
            <li className="flex gap-3 text-amber-900 dark:text-amber-100">
                <span className="text-amber-500 font-bold">✓</span>
                <span><strong>Garlic Rub, Not Mince:</strong> Rubbing garlic on the bread imparts a subtle aroma without overpowering the delicate tomato and basil flavors.</span>
            </li>
         </ul>
      </section>

      {/* Pairing */}
      <section id="pairing">
         <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <Wine className="w-6 h-6 text-purple-500"/> Perfect Pairing
         </h2>
         <p className="text-slate-600 dark:text-slate-400">
            Pair this vibrant bruschetta with a crisp, chilled Pinot Grigio or a light, fruity Chianti to complement the fresh acidity of the tomatoes and the herbal notes of basil. For a non-alcoholic option, a sparkling water infused with lemon and mint refreshes the palate beautifully.
         </p>
      </section>

      {/* FAQ Display */}
      <section id="faq">
         <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-500"/> Frequently Asked Questions
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