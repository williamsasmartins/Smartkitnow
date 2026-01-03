import RecipeLayout from '@/components/templates/RecipeLayout';
import { ChefHat, BookOpen, Flame, HelpCircle, Wine, Utensils } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TomatoAndBasilBruschettaRecipeCalculator() {
  // 1. HEAD DATA
  const title = "Tomato and Basil Bruschetta"; 
  const description = "Experience the vibrant flavors of ripe San Marzano tomatoes, fragrant basil, and toasted rustic bread in this classic Italian bruschetta recipe.";
  const imagePath = "https://pollinations.ai/p/Tomato%20and%20Basil%20Bruschetta%20food%20photography%2C%20michelin%20star%20plating%2C%20close-up%2C%20steam%20rising%2C%20cinematic%20lighting%2C%20highly%20detailed%2C%208k%2C%20rustic%20background?width=1200&height=675&nologo=true&seed=3321";

  // 2. RECIPE CARD
  const prepTime = "15 mins";
  const cookTime = "10 mins";
  const difficulty = "Intermediate";
  const servingsDefault = 4;

  // 3. INGREDIENTS (Array of Objects)
  const ingredients = [
    { name: "San Marzano Tomatoes", amount: 400, unit: "g", text: "ripe, finely diced" },
    { name: "Fresh Basil Leaves", amount: 15, unit: "g", text: "thinly sliced chiffonade" },
    { name: "Rustic Italian Bread", amount: 1, unit: "loaf", text: "cut into 1.5cm thick slices" },
    { name: "Extra Virgin Olive Oil", amount: 60, unit: "ml", text: "cold-pressed, divided" },
    { name: "Garlic Cloves", amount: 2, unit: "cloves", text: "peeled and halved" },
    { name: "Sea Salt", amount: 1, unit: "tsp", text: "preferably flaky" },
    { name: "Freshly Ground Black Pepper", amount: 0.5, unit: "tsp", text: "to taste" },
    { name: "Balsamic Vinegar", amount: 10, unit: "ml", text: "aged, optional for drizzle" },
    { name: "Parmigiano-Reggiano", amount: 20, unit: "g", text: "freshly shaved, optional garnish" },
  ];

  // 4. NUTRITION (Object)
  const nutrition = { 
    calories: "180", protein: "4g", carbs: "20g", fat: "9g" 
  };

  // 5. FAQ (Array)
  const faqs = [
    { question: "Can I use other types of tomatoes for bruschetta?", answer: "While San Marzano tomatoes are preferred for their sweetness and low acidity, you can use vine-ripened Roma or heirloom tomatoes. Just ensure they are ripe and juicy for the best flavor." },
    { question: "How should I store leftover bruschetta topping?", answer: "Store the tomato and basil mixture in an airtight container in the refrigerator for up to 2 days. Avoid mixing it with the bread until ready to serve to prevent sogginess." },
    { question: "Are there variations to traditional tomato and basil bruschetta?", answer: "Yes, some variations include adding diced mozzarella, roasted peppers, or a touch of garlic-infused olive oil. You can also experiment with different herbs like oregano or thyme for unique flavor profiles." }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 6. EDITORIAL CONTENT (The "Meat")
  const editorial = (
    <div className="space-y-12">
      {/* INTRO & HISTORY */}
      <section>
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
           <p className="lead">
             Imagine the intoxicating aroma of freshly toasted rustic bread, its crust crackling gently under your fingertips, topped with a vibrant medley of sun-kissed San Marzano tomatoes and fragrant basil leaves. The first bite offers a delightful contrast: the crisp crunch of the bread yielding to the juicy, herbaceous burst of the tomato mixture, kissed by the richness of cold-pressed olive oil and a subtle hint of garlic. This bruschetta is not just an appetizer; it’s a celebration of summer’s freshest bounty, a sensory journey to the heart of Italy.
           </p>
           <p>
             Originating in the 15th century in the rustic countryside of Tuscany and later embraced by Naples, bruschetta was traditionally a way to salvage stale bread by toasting it and topping it with local ingredients. The classic tomato and basil version, known as “Bruschetta al Pomodoro,” became a symbol of Italian simplicity and freshness, showcasing the harmony between quality produce and straightforward technique. Today, it remains a beloved antipasto, cherished worldwide for its vibrant flavors and elegant ease.
           </p>
        </div>
      </section>

      {/* INSTRUCTIONS */}
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
                   <strong>Dice</strong> the San Marzano tomatoes finely, ensuring to remove excess seeds for a less watery topping. <strong>Chiffonade</strong> the fresh basil leaves by stacking, rolling, and slicing thinly. In a bowl, <strong>combine</strong> the tomatoes, basil, half of the olive oil, sea salt, and freshly ground black pepper. <strong>Gently toss</strong> to emulsify the flavors and set aside to marinate at room temperature for 10 minutes.
                </p>
            </li>
            <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
                    <span className="text-orange-800 dark:text-orange-200 font-bold">2</span>
                </span>
                <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Toast the Bread</h3>
                <p className="text-slate-700 dark:text-slate-400">
                   <strong>Preheat</strong> a grill pan or skillet over medium-high heat. <strong>Brush</strong> each slice of rustic Italian bread with the remaining olive oil. <strong>Toast</strong> the slices until golden brown and crisp, about 2-3 minutes per side, until the crust smells nutty and the surface is slightly charred.
                </p>
            </li>
            <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
                    <span className="text-orange-800 dark:text-orange-200 font-bold">3</span>
                </span>
                <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Rub with Garlic</h3>
                <p className="text-slate-700 dark:text-slate-400">
                   Immediately after toasting, <strong>rub</strong> the warm bread slices with the cut side of the garlic cloves. This infuses a subtle, aromatic garlic flavor without overpowering the topping.
                </p>
            </li>
            <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
                    <span className="text-orange-800 dark:text-orange-200 font-bold">4</span>
                </span>
                <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Assemble the Bruschetta</h3>
                <p className="text-slate-700 dark:text-slate-400">
                   <strong>Spoon</strong> a generous amount of the tomato and basil mixture onto each slice of bread. <strong>Drizzle</strong> lightly with aged balsamic vinegar if using, to add a subtle sweet acidity that balances the freshness.
                </p>
            </li>
            <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full -left-4 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900">
                    <span className="text-orange-800 dark:text-orange-200 font-bold">5</span>
                </span>
                <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Garnish and Serve</h3>
                <p className="text-slate-700 dark:text-slate-400">
                   Optionally, <strong>shave</strong> fresh Parmigiano-Reggiano over the top for a nutty, savory finish. Serve immediately to enjoy the contrast of textures and vibrant flavors at their peak.
                </p>
            </li>
        </ol>
      </section>

      {/* CHEF SECRETS */}
      <section id="tips" className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-2xl border border-amber-100 dark:border-amber-900/50">
         <h3 className="font-bold text-2xl mb-4 flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <Flame className="w-6 h-6"/> Chef's Secrets
         </h3>
         <ul className="space-y-3">
            <li className="flex gap-3 text-amber-900 dark:text-amber-100">
                <span className="text-amber-500 font-bold">✓</span>
                <span><strong>Tomato Prep:</strong> Remove excess seeds and juice from tomatoes to prevent soggy bruschetta and concentrate flavor.</span>
            </li>
            <li className="flex gap-3 text-amber-900 dark:text-amber-100">
                <span className="text-amber-500 font-bold">✓</span>
                <span><strong>Garlic Infusion:</strong> Rub warm toasted bread with garlic immediately after grilling to impart a delicate aroma without overpowering.</span>
            </li>
            <li className="flex gap-3 text-amber-900 dark:text-amber-100">
                <span className="text-amber-500 font-bold">✓</span>
                <span><strong>Olive Oil Quality:</strong> Use a high-quality, cold-pressed extra virgin olive oil for authentic flavor and a silky mouthfeel.</span>
            </li>
         </ul>
      </section>

      {/* PAIRING */}
      <section id="pairing">
         <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <Wine className="w-6 h-6 text-purple-500"/> Perfect Pairing
         </h2>
         <p className="text-slate-600 dark:text-slate-400">
            Pair this bruschetta with a crisp, chilled Vermentino or a light-bodied Pinot Grigio to complement the fresh acidity of the tomatoes and the herbaceous notes of basil. For a non-alcoholic option, a sparkling lemon basil soda refreshes the palate beautifully.
         </p>
      </section>

      {/* FAQ RENDER */}
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