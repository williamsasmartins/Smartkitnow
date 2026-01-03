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
      "Tomato and Basil Bruschetta",
      "Caprese Salad",
      "Italian Bread Salad (Panzanella)",
      "Antipasto Platter (Cured Meats, Cheese, Olives)",
      "Garlic and Herb Crostini",
      "Fried Rice Balls (Arancini)",
      "Stuffed Zucchini Blossoms",
      "Marinated Artichokes",
      "Baked Stuffed Mushrooms",
      "Prosciutto and Melon",

      "Minestrone Soup",
      "Tuscan Bread and Vegetable Soup (Ribollita)",
      "Pasta and Bean Soup (Pasta e Fagioli)",
      "Italian Wedding Soup",
      "Tomato and Bread Soup",

      "Arugula and Parmesan Salad",
      "Chicory Salad with Anchovy-Garlic Dressing",

      "Spaghetti Carbonara",
      "Tagliatelle with Meat Ragù (Bolognese)",
      "Black Pepper and Pecorino Pasta (Cacio e Pepe)",
      "Pasta with Basil Pesto",
      "Garlic and Olive Oil Pasta (Aglio e Olio)",
      "Spaghetti with Tomato and Basil (Pomodoro)",
      "Spaghetti with Clams",
      "Lasagna",
      "Baked Ziti",
      "Stuffed Pasta Shells",
      "Potato Gnocchi with Tomato Sauce",
      "Ricotta Gnocchi",
      "Tortellini in Broth",

      "Saffron Risotto (Risotto alla Milanese)",
      "Mushroom Risotto",
      "Seafood Risotto",
      "Parmesan Risotto",
      "Creamy Polenta with Mushrooms",
      "Polenta with Meat Ragù",

      "Neapolitan Pizza",
      "Margherita Pizza",
      "Marinara Pizza",
      "Four Cheese Pizza",
      "Prosciutto and Arugula Pizza",
      "Calzone",
      "Focaccia",

      "Chicken Cacciatore",
      "Chicken Saltimbocca",
      "Veal Cutlet Milanese",
      "Braised Veal Shanks (Osso Buco)",
      "Italian-Style Roast Pork (Porchetta)",
      "Tuscan Steak (Florentine-Style)",
      "Italian Meatballs in Tomato Sauce",
      "Eggplant Parmesan",

      "Shrimp Scampi",
      "Mussels in White Wine and Garlic",
      "Fried Calamari",
      "Seafood Stew (Tomato and Wine Base)",

      "Roasted Potatoes",
      "Garlic Sautéed Spinach",
      "Broccoli Rabe with Garlic and Chili",
      "Sweet and Sour Eggplant Relish (Caponata)",
      "Roasted Peppers with Olive Oil",

      "Ciabatta",
      "Breadsticks (Grissini)",
      "Stuffed Flatbread (Piadina)",

      "Tiramisu",
      "Panna Cotta",
      "Cannoli",
      "Gelato",
      "Affogato",
      "Biscotti",
      "Semifreddo",
      "Italian Ice (Granita)",
      "Sfogliatella",
      "Panettone",

      "Espresso",
      "Cappuccino",
      "Negroni",
      "Limoncello",
      "Aperitif Spritz",
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
  {
    key: "mediterranean",
    name: "Mediterranean",
    countryCode: "es",
    description: "Olive oil, legumes, seafood, bright herbs, and simple home cooking.",
    recipes: R([
      "Greek Salad",
      "Grilled Fish with Lemon and Herbs",
      "Chickpea Salad with Feta",
      "Roasted Vegetables with Olive Oil",
      "Lentil Soup",
      "Hummus Bowl",
      "Mediterranean Quinoa Bowl",
      "Tomato Cucumber Salad",
      "Baked Eggplant with Tomato",
      "Yogurt with Honey and Nuts",
    ]),
  },
  {
    key: "american",
    name: "American",
    countryCode: "us",
    description: "Classic comfort food, BBQ staples, and diner-style favorites.",
    recipes: R([
      "Classic Cheeseburger",
      "Mac and Cheese",
      "Fried Chicken",
      "BBQ Ribs",
      "Pulled Pork Sandwich",
      "Buttermilk Pancakes",
      "Apple Pie",
      "Buffalo Wings",
      "Chicken Pot Pie",
      "Clam Chowder",
    ]),
  },
  {
    key: "canadian",
    name: "Canadian",
    countryCode: "ca",
    description: "Hearty classics, regional comfort dishes, and sweet treats.",
    recipes: R([
      "Poutine",
      "Butter Tarts",
      "Nanaimo Bars",
      "Tourtière",
      "Montreal-Style Bagels",
      "Peameal Bacon Sandwich",
      "Split Pea Soup",
      "Maple Glazed Salmon",
      "Bannock",
      "Caesar Cocktail",
    ]),
  },
  {
    key: "russian-eastern-european",
    name: "Russian & Eastern European",
    countryCode: "ru",
    description: "Hearty soups, dumplings, pickles, and warming baked dishes.",
    recipes: R([
      "Borscht",
      "Beef Stroganoff",
      "Pelmeni Dumplings",
      "Pierogi",
      "Cabbage Rolls (Golubtsy)",
      "Olivier Salad",
      "Chicken Kyiv",
      "Blini with Sour Cream",
      "Shashlik",
      "Honey Cake (Medovik)",
    ]),
  },
];

export function listCuisines(): Cuisine[] { return CUISINES; }
export function getCuisine(key: string): Cuisine | undefined { return CUISINES.find((c) => c.key === key); }
export function getRecipe(cuisineKey: string, recipeSlug: string): RecipeItem | undefined {
  const c = getCuisine(cuisineKey);
  return c?.recipes.find((r) => r.slug === recipeSlug);
}
