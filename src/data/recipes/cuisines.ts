// Cuisines canon + recipes por país (stubs iniciais)

export type RecipeItem = { title: string; slug: string; brief?: string };

export type Cuisine = {
  key: string; // "italian"
  name: string; // "Italian"
  flag: string; // "🇮🇹"
  description?: string; // SEO curto
  recipes: RecipeItem[];
};

export const CUISINES: Cuisine[] = [
  {
    key: "italian",
    name: "Italian",
    flag: "🇮🇹",
    description:
      "Classic Italian cooking: regional pasta, risotto, sauces, and slow-simmered flavors.",
    recipes: [
      { title: "Risotto", slug: "risotto", brief: "Creamy Arborio rice basics & timing." },
      { title: "Pasta al Pomodoro", slug: "pasta-al-pomodoro", brief: "A bright, simple tomato sauce." },
    ],
  },
  {
    key: "mexican",
    name: "Mexican",
    flag: "🇲🇽",
    description:
      "Bold salsas, slow braises, masa-based staples, and vibrant street food classics.",
    recipes: [
      { title: "Tacos al Pastor", slug: "tacos-al-pastor", brief: "Marinated pork + pineapple." },
      { title: "Guacamole", slug: "guacamole", brief: "Ripe avocados, lime, cilantro, onion." },
    ],
  },

  // Adicione suas demais 10 cozinhas aqui:
  // "french", "japanese", "indian", "thai", "chinese", "korean", "spanish", "greek", "turkish", "brazilian"
];

export function listCuisines(): Cuisine[] {
  return CUISINES;
}

export function getCuisine(key: string): Cuisine | undefined {
  return CUISINES.find((c) => c.key === key);
}

export function getRecipe(cuisineKey: string, recipeSlug: string): RecipeItem | undefined {
  const c = getCuisine(cuisineKey);
  return c?.recipes.find((r) => r.slug === recipeSlug);
}