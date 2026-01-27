import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

import { getRecipeSchema } from "@/components/RecipeSchema";

export default function FeijoadaBlackBeanPorkStewCalculator() {
    const [servings, setServings] = useState(6);
    const [imgSrc, setImgSrc] = useState(
        "https://image.pollinations.ai/prompt/Brazilian%20Feijoada%2C%20black%20bean%20stew%20with%20pork%20and%20sausage%20in%20a%20clay%20pot%2C%20served%20with%20rice%20and%20orange%20slices%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8822"
    );

    // --- DATA ---
    const title = "Brazilian Black Bean and Pork Stew (Feijoada)";
    const description = "A hearty Brazilian stew of black beans and various smoked pork and beef products.";

    // INGREDIENTS
    const ingredients = [
        { name: "Black Beans", baseAmount: 500, unit: "g" },
        { name: "Dried Beef (Carne Seca)", baseAmount: 200, unit: "g" },
        { name: "Smoked Pork Sausage (Paio)", baseAmount: 200, unit: "g" },
        { name: "Smoked Pork Sausage (Calabresa)", baseAmount: 200, unit: "g" },
        { name: "Smoked Pork Ribs", baseAmount: 300, unit: "g" },
        { name: "Bacon", baseAmount: 100, unit: "g" },
        { name: "Onion (finely chopped)", baseAmount: 1, unit: "large" },
        { name: "Garlic Cloves (minced)", baseAmount: 4, unit: "cloves" },
        { name: "Bay Leaves", baseAmount: 3, unit: "leaves" },
        { name: "Oranges (peeled and sliced)", baseAmount: 2, unit: "units" },
        { name: "Vegetable Oil", baseAmount: 30, unit: "ml" },
        { name: "Salt and Black Pepper", baseAmount: 1, unit: "to taste" },
    ];

    // Nutrition per serving (approximate)
    const nutrition = {
        calories: "550",
        protein: "42g",
        carbs: "38g",
        fat: "25g",
    };

    // --- LOGIC ---
    const getAmount = (base: any) => {
        if (typeof base !== 'number') return base;
        return (base * (servings / 6)).toFixed(1).replace(/\.0$/, "");
    };

    // --- FAQ ---
    const faqs = [
        {
            question: "What is Feijoada?",
            answer:
                "Feijoada is widely regarded as Brazil's national dish. It is a rich, hearty stew of black beans cooked with various cuts of pork and beef, traditionally served with white rice, farofa (toasted cassava flour), sautéed collard greens, and orange slices.",
        },
        {
            question: "How long does it take to cook Feijoada?",
            answer:
                "Traditional Feijoada is a slow-cooked meal. It typically takes 2 to 3 hours of simmering for the beans and meats to become tender and the flavors to fully meld. Some specialized versions can take even longer.",
        },
        {
            question: "Can I make it vegetarian?",
            answer:
                "Yes, while traditionally meat-heavy, you can make a 'Feijoada Vegetariana' using smoked tofu, tempeh, mushrooms, and hearty vegetables like sweet potatoes and carrots to mimic the depth of flavor.",
        },
    ];
    const faqJsonLd = useFaqJsonLd(faqs);

    const recipeJsonLd = getRecipeSchema({
        name: title,
        description: description,
        image: imgSrc,
        prepTime: "PT40M",
        cookTime: "PT3H",
        totalTime: "PT3H40M",
        recipeYield: "6 servings",
        recipeCategory: "Main Course",
        recipeCuisine: "Brazilian",
        keywords: "feijoada, brazilian black bean stew, national dish of brazil, pork stew, comfort food",
        recipeIngredient: ingredients.map(ing => `${ing.baseAmount}${ing.unit} ${ing.name}`),
        recipeInstructions: [
            "If using carne seca or salt pork, soak them in water for 24 hours in the refrigerator, changing the water several times to remove excess salt. Cut all meats into bite-sized chunks.",
            "In a large heavy pot, add the black beans and cover with water. Bring to a boil, then add the tougher meats like ribs and carne seca. Simmer for about 1.5 hours until the beans start to soften.",
            "Add the sliced sausages and bacon. Continue to simmer for another 45 minutes to 1 hour. If the stew gets too thick, add a little more water.",
            "In a separate small pan, sauté onion and garlic in a little oil. Ladle two spoons of beans from the main pot into this pan and mash them with a fork to form a paste. Pour this paste back into the main pot to thicken and season the stew.",
            "Adjust salt and pepper. Serve hot with white rice, collard greens, and orange slices."
        ]
    });

    // --- WIDGET CONTENT ---
    const widget = (
        <div className="space-y-6">
            <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
                <img
                    src={imgSrc}
                    alt="Feijoada"
                    width="1280"
                    height="720"
                    className="w-full h-auto object-cover aspect-video transition-transform duration-700 group-hover:scale-105"
                    onError={() =>
                        setImgSrc(
                            "https://images.unsplash.com/photo-1594970719597-8e06f5a9f81d?q=80&w=1280&auto=format&fit=crop"
                        )
                    }
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <span className="text-white font-bold text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-400" /> Prep: 40m | Cook: 3h
                    </span>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3 bg-slate-50 dark:bg-slate-900/50">
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-lg">
                            <Utensils className="h-5 w-5 text-orange-500" /> Ingredients
                        </span>
                        <div className="flex items-center gap-2 text-sm bg-white dark:bg-slate-800 border p-1 rounded-lg">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setServings((s) => Math.max(1, s - 1))}
                            >
                                -
                            </Button>
                            <span className="w-6 text-center font-bold text-lg">{servings}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setServings((s) => s + 1)}
                            >
                                +
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableBody>
                            {ingredients.map((ing, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium text-base">{ing.name}</TableCell>
                                    <TableCell className="text-right font-bold text-base text-slate-700 dark:text-slate-200">
                                        {getAmount(ing.baseAmount)} {ing.unit}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="bg-slate-50 dark:bg-slate-900/50">
                <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-sm">
                    <div>
                        <div className="font-bold text-lg">{nutrition.calories}</div>
                        <span className="text-xs font-bold uppercase text-slate-500">Kcal</span>
                    </div>
                    <div>
                        <div className="font-bold text-lg">{nutrition.protein}</div>
                        <span className="text-xs font-bold uppercase text-slate-500">Prot</span>
                    </div>
                    <div>
                        <div className="font-bold text-lg">{nutrition.carbs}</div>
                        <span className="text-xs font-bold uppercase text-slate-500">Carb</span>
                    </div>
                    <div>
                        <div className="font-bold text-lg">{nutrition.fat}</div>
                        <span className="text-xs font-bold uppercase text-slate-500">Fat</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    // --- EDITORIAL CONTENT ---
    const editorial = (
        <div className="space-y-12">
            <section>
                <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                    The Soul of Brazil
                </h2>
                <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
                    <p className="mb-4">
                        Feijoada is much more than just a stew; it is a culinary tradition that represents the heart and soul of Brazilian culture. Originally brought to Brazil by the Portuguese and later influenced by African traditions, it has evolved into a sophisticated dish enjoyed by all levels of society.
                    </p>
                    <p>
                        The characteristic black bean base is slow-cooked with a variety of meats—traditionally including "lesser" cuts of pork which give the stew its incredible depth and silky texture. Served as a weekend ritual, especially on Saturdays, a Feijoada meal is meant to be lingered over with family and friends.
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <ChefHat className="h-8 w-8 text-orange-500" /> Instructions
                </h2>
                <ol className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-10">
                    <li className="ml-8 relative">
                        <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
                            1
                        </span>
                        <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prep the Meats</h3>
                        <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                            If using carne seca or salt pork, soak them in water for 24 hours in the refrigerator, changing the water several times to remove excess salt. Cut all meats into bite-sized chunks.
                        </p>
                    </li>
                    <li className="ml-8 relative">
                        <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
                            2
                        </span>
                        <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Beans</h3>
                        <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                            In a large heavy pot, add the black beans and cover with water. Bring to a boil, then add the tougher meats like ribs and carne seca. Simmer for about 1.5 hours until the beans start to soften.
                        </p>
                    </li>
                    <li className="ml-8 relative">
                        <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
                            3
                        </span>
                        <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add the Smoked Meats</h3>
                        <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                            Add the sliced sausages and bacon. Continue to simmer for another 45 minutes to 1 hour. If the stew gets too thick, add a little more water.
                        </p>
                    </li>
                    <li className="ml-8 relative">
                        <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
                            4
                        </span>
                        <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">The Seasoning (Refogado)</h3>
                        <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                            In a separate small pan, sauté onion and garlic in a little oil. Ladle two spoons of beans from the main pot into this pan and mash them with a fork to form a paste. Pour this paste back into the main pot to thicken and season the stew.
                        </p>
                    </li>
                </ol>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">FAQ</h2>
                <div className="space-y-6">
                    {faqs.map((f, i) => (
                        <div key={i} className="border-b pb-4 last:border-0">
                            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">{f.question}</h3>
                            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">{f.answer}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );

    return (
        <CalculatorVerticalLayout
            title={title}
            description={description}
            widget={widget}
            editorial={editorial}
            jsonLd={[faqJsonLd, recipeJsonLd]}
            hideLegalDisclaimer={true}
            showTopBanner
            showSidebar
            showBottomBanner
        />
    );
}
