// Cuisines canon + recipes por país (modelo com ISO countryCode e slugs automáticos)

export type RecipeItem = { title: string; slug: string; brief?: string };

export type Cuisine = {
  key: string; // "italian"
  name: string; // "Italian"
  countryCode: string; // ISO 3166-1 alpha-2 (e.g., "it")
  description?: string; // SEO curto
  recipes: RecipeItem[];
};

function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function R(titles: string[]): RecipeItem[] {
  return titles.map((title) => ({ title, slug: slugify(title) }));
}

export const CUISINES: Cuisine[] = [
  {
    key: "italian",
    name: "Italian",
    countryCode: "it",
    description:
      "Classic Italian cooking: regional pasta, risotto, sauces, and slow-simmered flavors.",
    recipes: R([
      "Spaghetti Carbonara",
      "Margherita Pizza",
      "Risotto alla Milanese",
      "Osso Buco",
      "Lasagna Bolognese",
      "Tiramisu",
      "Gnocchi with Pesto",
      "Saltimbocca alla Romana",
      "Caprese Salad",
      "Sicilian Cannoli",
    ]),
  },
  {
    key: "mexican",
    name: "Mexican",
    countryCode: "mx",
    description:
      "Bold salsas, slow braises, masa-based staples, and vibrant street food classics.",
    recipes: R([
      "Tacos al Pastor",
      "Green Enchiladas",
      "Mole Poblano",
      "Chiles en Nogada",
      "Guacamole",
      "Red Pozole",
      "Oaxacan Tamales",
      "Shrimp Ceviche",
      "Squash Blossom Quesadillas",
      "Neapolitan Flan",
    ]),
  },
  {
    key: "french",
    name: "French",
    countryCode: "fr",
    description: "Bistro classics, slow sauces, rustic stews, and pastry roots.",
    recipes: R([
      "Coq au Vin",
      "Crêpes Suzette",
      "Beef Bourguignon",
      "Ratatouille",
      "Escargots Bourguignonne",
      "Croissant",
      "Crème Brûlée",
      "Quiche Lorraine",
      "Bouillabaisse",
      "Macarons",
    ]),
  },
  {
    key: "japanese",
    name: "Japanese",
    countryCode: "jp",
    description: "Izakaya and home-style fare, broths, rice bowls, and tempura.",
    recipes: R([
      "Maki Sushi",
      "Tonkotsu Ramen",
      "Tempura Udon",
      "Chicken Teriyaki",
      "Onigiri",
      "Takoyaki",
      "Okonomiyaki",
      "Sashimi",
      "Mochi",
      "Yakitori",
    ]),
  },
  {
    key: "chinese",
    name: "Chinese",
    countryCode: "cn",
    description: "Wok techniques, dim sum basics, and fragrant regional stir-fries.",
    recipes: R([
      "Kung Pao Chicken",
      "Mapo Tofu",
      "Peking Duck",
      "Dumplings (Jiaozi)",
      "Chow Mein",
      "Sweet and Sour Pork",
      "Hot Pot",
      "Spring Rolls",
      "Congee",
      "Char Siu Bao",
    ]),
  },
  {
    key: "korean",
    name: "Korean",
    countryCode: "kr",
    description: "BBQ cuts, ferments, umami broths, and hot-stone rice bowls.",
    recipes: R([
      "Bibimbap",
      "Kimchi Stew",
      "Bulgogi",
      "Tteokbokki",
      "Japchae",
      "Grilled Pork Belly (Samgyeopsal)",
      "Kimbap",
      "Soft Tofu Stew (Sundubu Jjigae)",
      "Seafood Pancake (Haemul Pajeon)",
      "Shaved Ice with Red Bean (Patbingsu)",
    ]),
  },
  {
    key: "indian",
    name: "Indian",
    countryCode: "in",
    description: "Regional curries, masalas, tandoor breads, and dal staples.",
    recipes: R([
      "Butter Chicken",
      "Paneer Tikka Masala",
      "Biryani",
      "Chana Masala",
      "Palak Paneer",
      "Samosa",
      "Naan",
      "Dal Makhani",
      "Aloo Gobi",
      "Gulab Jamun",
    ]),
  },
  {
    key: "thai",
    name: "Thai",
    countryCode: "th",
    description: "Street-food curries, herb-lime aromatics, and noodle favorites.",
    recipes: R([
      "Pad Thai",
      "Tom Yum Goong",
      "Green Curry",
      "Som Tam (Papaya Salad)",
      "Massaman Curry",
      "Mango Sticky Rice",
      "Tom Kha Gai",
      "Pad See Ew",
      "Fresh Spring Rolls",
      "Fried Rice (Khao Pad)",
    ]),
  },
  {
    key: "middle-eastern",
    name: "Middle Eastern",
    countryCode: "ae", // placeholder regional flag (UAE)
    description: "Meze spreads, grills, tahini, sumac, and warm spices.",
    recipes: R([
      "Hummus with Pita",
      "Chicken Shawarma",
      "Falafel",
      "Tabouleh",
      "Baba Ganoush",
      "Koobideh Kebab",
      "Fattoush Salad",
      "Baklava",
      "Stuffed Grape Leaves (Dolma)",
      "Muhammara",
    ]),
  },
  {
    key: "greek",
    name: "Greek",
    countryCode: "gr",
    description: "Mediterranean home classics, olive oil, herbs, and grills.",
    recipes: R([
      "Moussaka",
      "Souvlaki",
      "Gyros",
      "Tzatziki",
      "Spanakopita",
      "Greek Village Salad",
      "Stuffed Grape Leaves (Dolmades)",
      "Baklava",
      "Pastitsio",
      "Loukoumades",
    ]),
  },
  {
    key: "brazilian",
    name: "Brazilian",
    countryCode: "br",
    description:
      "Regional Brazilian comfort: feijoada, moqueca, churrasco, street foods, and sweets.",
    recipes: R([
      "Feijoada",
      "Cheese Bread (Pão de Queijo)",
      "Fish Moqueca",
      "Brigadeiro",
      "Acarajé",
      "Coxinha",
      "Toasted Cassava Flour (Farofa)",
      "Vatapá",
      "Street Market Pastel",
      "Quindim",
    ]),
  },
  {
    key: "portuguese",
    name: "Portuguese",
    countryCode: "pt",
    description:
      "Sea-forward cuisine, olive oil, pork traditions, and iconic convent sweets.",
    recipes: R([
      "Codfish à Brás",
      "Pastéis de Nata",
      "Kale Soup (Caldo Verde)",
      "Francesinha",
      "Seafood Rice",
      "Pork Sandwich (Bifana)",
      "Portuguese Stew (Cozido à Portuguesa)",
      "Clams Bulhão Pato",
      "Serra da Estrela Cheese",
      "Berliner Doughnut (Bola de Berlim)",
    ]),
  },
];

export function listCuisines(): Cuisine[] { return CUISINES; }
export function getCuisine(key: string): Cuisine | undefined { return CUISINES.find((c) => c.key === key); }
export function getRecipe(cuisineKey: string, recipeSlug: string): RecipeItem | undefined {
  const c = getCuisine(cuisineKey);
  return c?.recipes.find((r) => r.slug === recipeSlug);
}