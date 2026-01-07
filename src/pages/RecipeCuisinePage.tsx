import React, { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import AdBannerTop from "@/components/ads/AdBannerTop";
import AdSidebarRight from "@/components/ads/AdSidebarRight";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";
import CountryFlag from "@/components/recipes/CountryFlag";
import { getCuisine } from "@/data/recipes/cuisines";

type Section = { title: string; items: string[] };

function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export default function RecipeCuisinePage() {
  const { cuisine } = useParams<{ cuisine: string }>();
  const normalizedCuisine = cuisine === "japanise" ? "japanese" : cuisine;
  const data = normalizedCuisine ? getCuisine(normalizedCuisine) : undefined;

  const titleToSlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of data?.recipes ?? []) map.set(r.title, r.slug);
    return map;
  }, [data?.recipes]);

  const italianSections: Section[] = [
    {
      title: "Starters & Small Plates",
      items: [
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
      ],
    },
    {
      title: "Soups",
      items: [
        "Minestrone Soup",
        "Tuscan Bread and Vegetable Soup (Ribollita)",
        "Pasta and Bean Soup (Pasta e Fagioli)",
        "Italian Wedding Soup",
        "Tomato and Bread Soup",
      ],
    },
    {
      title: "Salads",
      items: [
        "Caprese Salad",
        "Italian Bread Salad (Panzanella)",
        "Arugula and Parmesan Salad",
        "Chicory Salad with Anchovy-Garlic Dressing",
      ],
    },
    {
      title: "Pasta & Gnocchi",
      items: [
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
      ],
    },
    {
      title: "Risotto & Polenta",
      items: [
        "Saffron Risotto (Risotto alla Milanese)",
        "Mushroom Risotto",
        "Seafood Risotto",
        "Parmesan Risotto",
        "Creamy Polenta with Mushrooms",
        "Polenta with Meat Ragù",
      ],
    },
    {
      title: "Pizza, Calzones & Flatbreads",
      items: [
        "Neapolitan Pizza",
        "Margherita Pizza",
        "Marinara Pizza",
        "Four Cheese Pizza",
        "Prosciutto and Arugula Pizza",
        "Calzone",
        "Focaccia",
      ],
    },
    {
      title: "Main Courses — Meat & Poultry",
      items: [
        "Chicken Cacciatore",
        "Chicken Saltimbocca",
        "Veal Cutlet Milanese",
        "Braised Veal Shanks (Osso Buco)",
        "Italian-Style Roast Pork (Porchetta)",
        "Tuscan Steak (Florentine-Style)",
        "Italian Meatballs in Tomato Sauce",
        "Eggplant Parmesan",
      ],
    },
    {
      title: "Main Courses — Seafood",
      items: [
        "Shrimp Scampi",
        "Mussels in White Wine and Garlic",
        "Fried Calamari",
        "Seafood Stew (Tomato and Wine Base)",
      ],
    },
    {
      title: "Sides & Vegetables",
      items: [
        "Roasted Potatoes",
        "Garlic Sautéed Spinach",
        "Broccoli Rabe with Garlic and Chili",
        "Sweet and Sour Eggplant Relish (Caponata)",
        "Roasted Peppers with Olive Oil",
      ],
    },
    {
      title: "Breads & Savory Baking",
      items: ["Ciabatta", "Breadsticks (Grissini)", "Stuffed Flatbread (Piadina)"],
    },
    {
      title: "Desserts & Sweet Baking",
      items: [
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
      ],
    },
    {
      title: "Drinks & Coffee",
      items: ["Espresso", "Cappuccino", "Negroni", "Limoncello", "Aperitif Spritz"],
    },
  ];

  const mexicanSections: Section[] = [
    {
      title: "Starters & Small Plates",
      items: [
        "Guacamole",
        "Pico de Gallo",
        "Salsa Roja",
        "Salsa Verde",
        "Roasted Tomato Salsa",
        "Black Bean Dip",
        "Queso Fundido",
        "Mexican Street Corn (Elote)",
        "Mexican Corn Cup (Esquites)",
        "Ceviche (Mexican-Style)",
        "Shrimp Cocktail (Mexican-Style)",
        "Nachos",
        "Taquitos",
        "Flautas",
      ],
    },
    {
      title: "Soups & Stews",
      items: [
        "Chicken Tortilla Soup",
        "Pozole (Pork or Chicken)",
        "Menudo",
        "Albondigas Soup",
        "Lime Soup (Yucatan-Style)",
      ],
    },
    {
      title: "Breakfast & Brunch",
      items: [
        "Chilaquiles",
        "Huevos Rancheros",
        "Breakfast Tacos",
        "Migas (Mexican-Style)",
        "Mexican Scrambled Eggs (with Salsa)",
      ],
    },
    {
      title: "Tacos",
      items: [
        "Tacos al Pastor",
        "Carne Asada Tacos",
        "Carnitas Tacos",
        "Barbacoa Tacos",
        "Birria Tacos",
        "Fish Tacos",
        "Shrimp Tacos",
        "Chicken Tinga Tacos",
        "Baja-Style Fish Tacos",
      ],
    },
    {
      title: "Enchiladas & Sauced Dishes",
      items: [
        "Chicken Enchiladas",
        "Cheese Enchiladas",
        "Enchiladas Verdes",
        "Enchiladas Rojas",
        "Enchiladas Suizas",
        "Chilaquiles (Green or Red)",
      ],
    },
    {
      title: "Tamales, Tortilla-Based & Street Foods",
      items: [
        "Tamales (Chicken, Pork, or Sweet)",
        "Quesadillas",
        "Gorditas",
        "Sopes",
        "Huaraches",
        "Tostadas",
        "Tlayudas",
        "Empanadas (Savory)",
      ],
    },
    {
      title: "Main Courses — Meat & Poultry",
      items: [
        "Chicken Tinga",
        "Mole Chicken (Mole Poblano)",
        "Pork Carnitas",
        "Carne Asada",
        "Barbacoa",
        "Birria (Beef or Goat)",
        "Cochinita Pibil",
        "Chile Rellenos",
        "Chiles en Nogada",
      ],
    },
    {
      title: "Main Courses — Seafood",
      items: [
        "Fish Veracruz",
        "Mexican Shrimp in Garlic Sauce",
        "Mexican-Style Ceviche",
        "Grilled Fish Tacos Filling",
      ],
    },
    {
      title: "Vegetarian Mains",
      items: [
        "Black Bean and Cheese Quesadillas",
        "Nopales Salad",
        "Vegetable Fajita-Style Filling",
        "Mushroom Tacos",
        "Bean Tostadas",
      ],
    },
    {
      title: "Sides",
      items: [
        "Mexican Rice",
        "Refried Beans",
        "Charro Beans",
        "Black Beans (Mexican-Style)",
        "Corn Tortillas",
        "Flour Tortillas",
        "Tortilla Chips",
        "Mexican Slaw",
        "Pickled Red Onions",
      ],
    },
    {
      title: "Salsas, Sauces & Condiments",
      items: [
        "Pico de Gallo",
        "Salsa Roja",
        "Salsa Verde",
        "Chipotle Salsa",
        "Avocado Salsa",
        "Tomatillo Salsa",
        "Mole Poblano Sauce",
        "Crema (Mexican-Style Sour Cream)",
      ],
    },
    {
      title: "Desserts & Sweet Baking",
      items: [
        "Churros",
        "Tres Leches Cake",
        "Flan",
        "Rice Pudding (Arroz con Leche)",
        "Sweet Corn Cake",
        "Mexican Sweet Bread (Conchas)",
        "Buñuelos",
        "Paletas (Mexican Ice Pops)",
        "Cajeta (Goat Milk Caramel)",
        "Mexican Hot Chocolate",
      ],
    },
    {
      title: "Drinks",
      items: [
        "Horchata",
        "Hibiscus Iced Tea (Agua de Jamaica)",
        "Tamarind Drink (Agua de Tamarindo)",
        "Limeade (Agua Fresca)",
        "Atole",
        "Champurrado",
        "Margarita",
        "Michelada",
      ],
    },
  ];

  const brazilianSections: Section[] = [
    {
      title: "Starters & Small Plates",
      items: [
        "Brazilian Cheese Bread",
        "Chicken Croquettes",
        "Crispy Fried Pastries",
        "Cod Fritters",
        "Black-Eyed Pea Fritters",
        "Fried Cassava",
        "Cassava Fries",
        "Beef Skewers",
        "Grilled Sausage Bites",
        "Hearts of Palm Salad",
        "Brazilian Tomato Vinaigrette",
        "Brazilian-Style Collard Greens",
        "Crispy Pork Belly Bites",
      ],
    },
    {
      title: "Soups & Stews",
      items: [
        'Brazilian Black Bean and Pork Stew "Feijoada"',
        "Brazilian Fish Stew",
        "Brazilian Seafood Stew",
        "Creamy Shrimp and Peanut Stew",
        "Brazilian Chicken and Okra Stew",
        "Brazilian Beef and Vegetable Soup",
        "Brazilian Seafood and Coconut Stew",
      ],
    },
    {
      title: "Rice, Beans & Bowls",
      items: [
        "Brazilian Rice",
        "Brazilian Black Beans",
        "Seasoned Pinto Beans",
        "Toasted Cassava Flour",
        "Rice and Beans Plate",
        "Black Beans with Sausage",
        "Bean Purée with Sausage",
        "Acai Bowl",
      ],
    },
    {
      title: "Main Courses — Meat & Poultry",
      items: [
        "Brazilian Barbecue Platter",
        "Grilled Picanha Steak",
        "Slow-Cooked Pork Ribs (Brazilian-Style)",
        "Brazilian-Style Beef Stroganoff",
        "Brazilian-Style Chicken Stroganoff",
        "Chicken and Okra Stew",
        "Chicken and Corn Stew",
        "Brazilian Chicken Pot Pie",
        "Mashed Cassava Casserole (Chicken or Beef)",
      ],
    },
    {
      title: "Main Courses — Seafood",
      items: [
        "Brazilian Fish Stew",
        "Brazilian Shrimp Stew",
        "Brazilian Seafood Stew",
        "Brazilian Cod Casserole",
        "Garlic Shrimp (Brazilian-Style)",
      ],
    },
    {
      title: "Savory Snacks & Street Food",
      items: [
        "Brazilian Cheese Bread",
        "Chicken Croquettes",
        "Crispy Fried Pastries",
        "Cod Fritters",
        "Black-Eyed Pea Fritters",
        "Fried Cassava",
        "Cassava Fries",
        "Brazilian Hot Dog (Loaded Style)",
      ],
    },
    {
      title: "Sides",
      items: [
        "Toasted Cassava Flour",
        "Brazilian Tomato Vinaigrette",
        "Brazilian-Style Collard Greens",
        "White Rice",
        "Seasoned Black Beans",
        "Garlic Rice",
        "Farofa with Bacon",
        "Farofa with Eggs",
        "Fried Plantains",
      ],
    },
    {
      title: "Desserts & Sweet Baking",
      items: [
        "Chocolate Truffles",
        "Coconut Truffles",
        "Brazilian Caramel Flan",
        "Passion Fruit Mousse",
        "Coconut Egg Custard",
        "Sweet Corn and Coconut Pudding",
        "Coconut Candy",
        "Guava and Cheese Dessert",
        "Brazilian Carrot Cake with Chocolate Frosting",
        "French Toast (Brazilian-Style)",
        "Peanut Brittle (Brazilian-Style)",
        "Sugarcane Molasses Candy",
      ],
    },
    {
      title: "Drinks",
      items: [
        "Caipirinha",
        "Brazilian Limeade",
        "National Lime Cocktail",
        "Guarana Soda",
        "Coconut Water",
        "Iced Mate Tea",
        "Passion Fruit Juice",
        "Cashew Fruit Juice",
        "Sugarcane Juice",
        "Brazilian Coffee",
        "Avocado Smoothie",
      ],
    },
  ];

  const portugueseSections: Section[] = [
    {
      title: "Starters & Small Plates",
      items: [
        "Codfish Cakes",
        "Garlic Clams",
        "Octopus Salad",
        "Tuna Pâté",
        "Chorizo Sausage Flambé",
        "Grilled Sardines (Starter Portion)",
        "Garlic Shrimp",
        "Stuffed Mushrooms (Portuguese-Style)",
        "Mixed Olives and Pickles",
        "Cheese and Cured Sausage Board",
      ],
    },
    {
      title: "Soups & Stews",
      items: [
        "Green Kale and Potato Soup",
        "Stone Soup",
        "Bread and Garlic Soup",
        "Fish Stew Soup",
        "Seafood Soup",
        "Bean Soup",
      ],
    },
    {
      title: "Sandwiches & Street Food",
      items: [
        "Porto-Style Steak Sandwich (Francesinha)",
        "Portuguese Pork Sandwich (Bifana)",
        "Portuguese Steak Sandwich (Prego)",
      ],
    },
    {
      title: "Seafood Main Courses",
      items: [
        "Shredded Cod with Eggs and Potatoes",
        "Cod with Cream",
        "Baked Cod with Onions and Potatoes",
        "Cod with Olive Oil and Garlic (Oven-Roasted)",
        "Grilled Salt Cod",
        "Seafood Stew (Cataplana-Style)",
        "Portuguese Fish Stew",
        "Seafood Rice",
        "Octopus Rice",
        "Oven-Roasted Octopus with Olive Oil and Garlic",
        "Grilled Sardines",
        "Grilled Sea Bream",
        "Monkfish Rice",
      ],
    },
    {
      title: "Meat & Poultry Main Courses",
      items: [
        "Piri-Piri Chicken",
        "Portuguese Boiled Dinner (Mixed Meats and Vegetables)",
        "Pork and Clams",
        "Roast Suckling Pig",
        "Portuguese Beef Stew",
        "Portuguese-Style Steak with Fried Egg",
        "Sausage and Greens Stew",
        "Grilled Pork Skewers",
        "Portuguese Sausage Assortment",
      ],
    },
    {
      title: "Sides",
      items: [
        "Tomato Rice",
        "Bread Crumb Migas (Alentejo-Style)",
        "Sautéed Greens with Garlic",
        "Roasted Potatoes",
        "Portuguese-Style Fries",
        "Seasoned Rice",
        "Mixed Salad (Portuguese-Style)",
      ],
    },
    {
      title: "Desserts & Sweet Baking",
      items: [
        "Portuguese Custard Tarts",
        "Belém-Style Custard Tarts",
        "Portuguese Rice Pudding",
        "Milk Custard (Brûléed Top)",
        "Portuguese Sponge Cake",
        "King Cake (Dried Fruit Sweet Bread)",
        "Sweet Coconut Bread (Portuguese-Style)",
        "Portuguese Cheesecake Tarts",
        "Almond Tart",
        "Madeira Honey Cake",
        "Orange Olive Oil Cake",
      ],
    },
    {
      title: "Drinks",
      items: [
        "Port Wine",
        "Vinho Verde",
        "Sour Cherry Liqueur (Ginjinha)",
        "Madeira Wine",
        "Poncha (Madeira Citrus Punch)",
        "Portuguese Sangria",
        "Espresso (Portuguese-Style)",
      ],
    },
  ];

  const japaneseSections: Section[] = [
    {
      title: "Starters & Small Plates",
      items: [
        "Edamame",
        "Japanese Cucumber Salad (Sunomono)",
        "Seaweed Salad (Wakame Salad)",
        "Spinach with Sesame Dressing",
        "Japanese Potato Salad",
        "Agedashi Tofu",
        "Gyoza (Pan-Fried Dumplings)",
        "Chicken Skewers (Yakitori)",
        "Japanese Fried Chicken (Karaage)",
        "Grilled Rice Balls (Yaki Onigiri)",
        "Takoyaki (Octopus Balls)",
        "Okonomiyaki (Savory Pancake)",
        "Tempura (Shrimp and Vegetables)",
        "Salmon Sashimi",
        "Tuna Sashimi",
      ],
    },
    {
      title: "Soups",
      items: [
        "Miso Soup",
        "Pork Bone Ramen Broth (Tonkotsu Broth)",
        "Clear Soup (Japanese-Style)",
        "Japanese Egg Drop Soup",
        "Udon Soup",
      ],
    },
    {
      title: "Noodles",
      items: [
        "Shoyu Ramen",
        "Miso Ramen",
        "Tonkotsu Ramen",
        "Shio Ramen",
        "Spicy Ramen",
        "Yakisoba (Stir-Fried Noodles)",
        "Udon Noodle Soup",
        "Curry Udon",
        "Zaru Soba (Cold Soba with Dipping Sauce)",
        "Kake Soba (Hot Soba Soup)",
        "Soba Salad",
        "Tsukemen (Dipping Ramen)",
      ],
    },
    {
      title: "Rice Bowls & One-Bowl Meals",
      items: [
        "Rice Balls (Onigiri)",
        "Chicken and Egg Rice Bowl (Oyakodon)",
        "Beef Rice Bowl (Gyudon)",
        "Pork Cutlet Rice Bowl (Katsudon)",
        "Tempura Rice Bowl (Tendon)",
        "Grilled Eel Rice Bowl (Unadon)",
        "Chicken Teriyaki Rice Bowl",
        "Japanese Curry Rice",
        "Fried Rice (Japanese-Style)",
        "Mixed Rice (Takikomi Gohan)",
      ],
    },
    {
      title: "Sushi & Seafood Classics",
      items: [
        "Sushi Rolls (Maki Rolls)",
        "California Roll",
        "Spicy Tuna Roll",
        "Salmon Avocado Roll",
        "Cucumber Roll",
        "Nigiri Sushi (Salmon, Tuna, Shrimp)",
        "Chirashi Sushi (Sushi Rice Bowl)",
        "Inari Sushi (Sweet Tofu Pouches)",
        "Hand Rolls (Temaki)",
        "Poke-Style Sushi Bowl (Japanese-Inspired)",
      ],
    },
    {
      title: "Main Courses — Meat & Poultry",
      items: [
        "Chicken Teriyaki",
        "Beef Teriyaki",
        "Ginger Pork (Shogayaki)",
        "Japanese Pork Cutlet (Tonkatsu)",
        "Chicken Cutlet (Chicken Katsu)",
        "Tempura (as main)",
        "Sukiyaki",
        "Shabu-Shabu",
        "Japanese Hamburger Steak (Hambagu)",
        "Miso-Glazed Eggplant (as main)",
      ],
    },
    {
      title: "Main Courses — Seafood",
      items: [
        "Miso-Glazed Black Cod",
        "Teriyaki Salmon",
        "Grilled Mackerel",
        "Grilled Eel (Kabayaki)",
        "Tempura Shrimp",
        "Seafood Hot Pot (Japanese-Style)",
      ],
    },
    {
      title: "Vegetarian & Tofu Dishes",
      items: [
        "Agedashi Tofu",
        "Miso-Glazed Eggplant",
        "Vegetable Tempura",
        "Tofu Steak (Pan-Seared Tofu)",
        "Japanese Vegetable Stir-Fry",
        "Mushroom Soba",
      ],
    },
    {
      title: "Sides & Pickles",
      items: [
        "Japanese Pickled Vegetables (Tsukemono)",
        "Pickled Ginger",
        "Sesame Green Beans",
        "Stir-Fried Cabbage (Japanese-Style)",
        "Simmered Vegetables (Japanese-Style)",
        "Sweet Soy Glazed Beans",
        "Tamagoyaki (Japanese Omelet)",
      ],
    },
    {
      title: "Sauces & Condiments",
      items: [
        "Teriyaki Sauce",
        "Ponzu Sauce",
        "Sesame Dressing",
        "Miso Glaze",
        "Japanese Curry Roux",
        "Spicy Mayo",
      ],
    },
    {
      title: "Desserts & Sweet Snacks",
      items: [
        "Mochi (Sweet Rice Cakes)",
        "Daifuku (Stuffed Mochi)",
        "Matcha Ice Cream",
        "Green Tea Cheesecake",
        "Japanese Cotton Cheesecake",
        "Dorayaki (Red Bean Pancake Sandwich)",
        "Taiyaki (Fish-Shaped Pastry)",
        "Castella Cake",
        "Anmitsu (Fruit and Jelly Dessert)",
        "Dango (Sweet Rice Dumplings)",
      ],
    },
    {
      title: "Drinks",
      items: [
        "Matcha (Green Tea)",
        "Iced Green Tea",
        "Roasted Barley Tea (Mugicha)",
        "Sweet Rice Drink (Amazake)",
        "Ramune Soda",
        "Sake",
        "Japanese Highball (Whiskey and Soda)",
      ],
    },
  ];

  const chineseSections: Section[] = [
    {
      title: "Starters & Small Plates",
      items: [
        "Spring Rolls",
        "Egg Rolls",
        "Scallion Pancakes",
        "Potstickers (Pan-Fried Dumplings)",
        "Steamed Dumplings",
        "Fried Wontons",
        "Pork Lettuce Wraps",
        "Smashed Cucumber Salad",
        "Chinese BBQ Pork (Char Siu) Slices",
        "Salt and Pepper Shrimp (Appetizer Style)",
        "Tea Eggs",
        "Cold Sesame Noodles (Starter Portion)",
      ],
    },
    {
      title: "Soups",
      items: [
        "Hot and Sour Soup",
        "Egg Drop Soup",
        "Wonton Soup",
        "Sweet Corn Soup (Chinese-Style)",
        "Chicken and Mushroom Soup",
        "Beef Noodle Soup",
      ],
    },
    {
      title: "Noodles",
      items: [
        "Chow Mein",
        "Lo Mein",
        "Dan Dan Noodles",
        "Sesame Noodles",
        "Beijing-Style Soybean Paste Noodles (Zha Jiang Noodles)",
        "Hand-Pulled Beef Noodle Soup (Lanzhou-Style)",
        "Wide Belt Noodles (Biang Biang Noodles)",
        "Stir-Fried Rice Noodles (Chow Fun)",
        "Singapore Noodles",
        "Scallion Oil Noodles",
      ],
    },
    {
      title: "Rice & Congee",
      items: [
        "Egg Fried Rice",
        "Chicken Fried Rice",
        "Shrimp Fried Rice",
        "Yangzhou Fried Rice",
        "Steamed White Rice",
        "Clay Pot Rice",
        "Congee (Rice Porridge)",
        "Congee with Pork and Century Egg",
      ],
    },
    {
      title: "Dim Sum Favorites",
      items: [
        "Shrimp Dumplings (Har Gow)",
        "Pork and Shrimp Dumplings (Siu Mai)",
        "BBQ Pork Buns (Char Siu Bao)",
        "Rice Noodle Rolls (Cheong Fun)",
        "Turnip Cake",
        "Sticky Rice in Lotus Leaf",
        "Steamed Spare Ribs (Dim Sum Style)",
        "Chinese Broccoli with Oyster Sauce",
        "Hong Kong Egg Tarts",
      ],
    },
    {
      title: "Main Courses — Chicken",
      items: [
        "Kung Pao Chicken",
        "General Tso’s Chicken",
        "Orange Chicken",
        "Sesame Chicken",
        "Sweet and Sour Chicken",
        "Cashew Chicken",
        "Chicken with Broccoli",
        "Black Pepper Chicken",
      ],
    },
    {
      title: "Main Courses — Beef",
      items: [
        "Beef and Broccoli",
        "Mongolian Beef",
        "Black Pepper Beef",
        "Stir-Fried Beef with Onions",
        "Beef with Garlic Sauce",
      ],
    },
    {
      title: "Main Courses — Pork & Duck",
      items: [
        "Sweet and Sour Pork",
        "Moo Shu Pork",
        "Twice-Cooked Pork",
        "Red-Braised Pork Belly",
        "Peking Duck",
        "Roast Duck (Cantonese-Style)",
      ],
    },
    {
      title: "Main Courses — Seafood",
      items: [
        "Kung Pao Shrimp",
        "Shrimp with Lobster Sauce",
        "Salt and Pepper Shrimp",
        "Steamed Fish with Ginger and Scallions",
        "Spicy Sichuan Boiled Fish",
        "Stir-Fried Squid with Vegetables",
      ],
    },
    {
      title: "Vegetarian & Tofu Dishes",
      items: [
        "Mapo Tofu",
        "Tofu with Black Bean Sauce",
        "Braised Tofu",
        "Chinese Eggplant with Garlic Sauce",
        "Stir-Fried Bok Choy with Garlic",
        "Sichuan Dry-Fried Green Beans",
        "Buddha’s Delight (Vegetarian Mixed Stir-Fry)",
        "Vegetable Dumplings",
      ],
    },
    {
      title: "Sides",
      items: [
        "Stir-Fried Mixed Vegetables (Chinese-Style)",
        "Garlic Chinese Broccoli",
        "Pickled Vegetables (Chinese-Style)",
      ],
    },
    {
      title: "Desserts & Sweet Snacks",
      items: [
        "Sesame Balls",
        "Mango Pudding",
        "Almond Jelly",
        "Sweet Tofu Pudding",
        "Sweet Red Bean Soup",
        "Sweet Rice Balls (Tangyuan)",
        "Mooncakes",
        "Pineapple Buns",
        "Coconut Buns",
        "Fortune Cookies",
      ],
    },
    {
      title: "Drinks & Tea",
      items: [
        "Bubble Tea",
        "Jasmine Tea",
        "Oolong Tea",
        "Chrysanthemum Tea",
        "Soy Milk",
        "Plum Juice",
      ],
    },
  ];

  const thaiSections: Section[] = [
    {
      title: "Starters & Small Plates",
      items: [
        "Fresh Spring Rolls",
        "Crispy Spring Rolls",
        "Chicken Satay with Peanut Sauce",
        "Shrimp Satay",
        "Thai Fish Cakes",
        "Shrimp Cakes",
        "Chicken Lettuce Wraps (Thai-Style)",
        "Crispy Wontons",
        "Thai Chicken Wings",
        "Papaya Salad (Som Tam)",
        "Cucumber Salad (Thai-Style)",
        "Mango Salad (Thai-Style)",
      ],
    },
    {
      title: "Soups",
      items: [
        "Tom Yum Soup",
        "Tom Kha Soup",
        "Thai Coconut Chicken Soup",
        "Thai Chicken Noodle Soup",
        "Wonton Soup (Thai-Style)",
      ],
    },
    {
      title: "Salads",
      items: [
        "Spicy Beef Salad",
        "Larb (Minced Meat Salad)",
        "Glass Noodle Salad",
        "Thai Mango Salad",
      ],
    },
    {
      title: "Noodles",
      items: [
        "Pad Thai",
        "Pad See Ew",
        "Drunken Noodles (Pad Kee Mao)",
        "Thai Boat Noodles",
        "Pad Woon Sen (Glass Noodles Stir-Fry)",
        "Thai Curry Noodles (Khao Soi)",
        "Thai Basil Noodles",
        "Spicy Thai Noodles",
      ],
    },
    {
      title: "Rice & One-Bowl Meals",
      items: [
        "Thai Fried Rice",
        "Pineapple Fried Rice",
        "Basil Fried Rice",
        "Coconut Rice",
        "Sticky Rice",
        "Thai Chicken Rice (Khao Man Gai)",
        "Thai Pork Rice Bowl (Thai-Style)",
        "Crispy Pork Belly Rice",
        "Thai Omelet over Rice",
      ],
    },
    {
      title: "Curries",
      items: [
        "Green Curry",
        "Red Curry",
        "Yellow Curry",
        "Panang Curry",
        "Massaman Curry",
        "Coconut Curry Shrimp",
        "Pumpkin Curry",
      ],
    },
    {
      title: "Stir-Fries",
      items: [
        "Thai Basil Chicken (Pad Krapow)",
        "Thai Basil Beef",
        "Thai Basil Pork",
        "Cashew Chicken (Thai-Style)",
        "Garlic Pepper Shrimp",
        "Stir-Fried Morning Glory (Water Spinach)",
        "Thai Sweet and Sour Stir-Fry",
        "Thai Vegetable Stir-Fry",
      ],
    },
    {
      title: "Main Courses — Seafood",
      items: [
        "Steamed Fish with Lime and Garlic",
        "Thai Grilled Shrimp",
        "Thai Seafood Curry",
        "Garlic Pepper Squid",
        "Thai-Style Crab Fried Rice",
      ],
    },
    {
      title: "Main Courses — Grilled & Roasted",
      items: [
        "Grilled Pork Skewers (Moo Ping)",
        "Thai Grilled Chicken",
        "Thai Beef Skewers",
        "Crispy Pork Belly",
        "Roasted Duck Curry",
      ],
    },
    {
      title: "Dips, Sauces & Condiments",
      items: [
        "Peanut Sauce",
        "Sweet Chili Sauce",
        "Tamarind Sauce",
        "Fish Sauce with Chili and Lime",
        "Green Chili Dipping Sauce",
        "Thai Chili Jam",
      ],
    },
    {
      title: "Sides",
      items: [
        "Jasmine Rice",
        "Stir-Fried Vegetables (Thai-Style)",
        "Pickled Vegetables (Thai-Style)",
      ],
    },
    {
      title: "Desserts & Sweet Snacks",
      items: [
        "Mango Sticky Rice",
        "Thai Coconut Sticky Rice with Banana",
        "Coconut Ice Cream (Thai-Style)",
        "Thai Coconut Custard",
        "Fried Bananas",
        "Thai Banana Roti",
        "Tapioca Pearls in Coconut Milk",
        "Sweet Sticky Rice Dumplings",
        "Pandan Cake",
      ],
    },
    {
      title: "Drinks",
      items: [
        "Thai Iced Tea",
        "Thai Iced Coffee",
        "Coconut Water",
        "Lime Soda (Thai-Style)",
        "Lemongrass Tea",
        "Pandan Drink",
      ],
    },
  ];

  const indianSections: Section[] = [
    {
      title: "Starters & Small Plates",
      items: [
        "Samosas",
        "Onion Bhaji",
        "Vegetable Pakoras",
        "Paneer Tikka",
        "Chicken Tikka",
        "Tandoori Chicken",
        "Seekh Kebabs",
        "Aloo Tikki",
        "Pani Puri",
        "Bhel Puri",
        "Dahi Puri",
        "Papdi Chaat",
        "Aloo Chaat",
        "Vada Pav",
        "Dhokla",
      ],
    },
    {
      title: "Soups & Light Bowls",
      items: [
        "Lentil Soup (Dal Soup)",
        "Tomato Soup (Indian-Style)",
        "Mulligatawny Soup",
      ],
    },
    {
      title: "Breads",
      items: [
        "Naan",
        "Garlic Naan",
        "Roti",
        "Chapati",
        "Paratha",
        "Aloo Paratha",
        "Poori",
        "Bhatura",
      ],
    },
    {
      title: "Rice & One-Pot Dishes",
      items: [
        "Chicken Biryani",
        "Vegetable Biryani",
        "Hyderabadi Biryani",
        "Pulao (Pilaf)",
        "Jeera Rice (Cumin Rice)",
        "Lemon Rice",
        "Coconut Rice",
        "Tamarind Rice",
        "Khichdi",
      ],
    },
    {
      title: "Curries — Chicken",
      items: [
        "Butter Chicken",
        "Chicken Tikka Masala",
        "Chicken Curry",
        "Korma (Chicken)",
        "Saag Chicken",
        "Chicken Vindaloo",
        "Chicken Chettinad",
      ],
    },
    {
      title: "Curries — Lamb, Goat & Beef",
      items: [
        "Rogan Josh",
        "Lamb Curry",
        "Goat Curry",
        "Keema (Minced Meat Curry)",
        "Beef Curry (South Indian-Style)",
      ],
    },
    {
      title: "Curries — Vegetarian & Paneer",
      items: [
        "Palak Paneer",
        "Paneer Butter Masala",
        "Chana Masala",
        "Dal Tadka",
        "Dal Makhani",
        "Rajma (Kidney Bean Curry)",
        "Aloo Gobi",
        "Baingan Bharta",
        "Malai Kofta",
        "Vegetable Korma",
        "Bhindi Masala (Okra Curry)",
        "Navratan Korma",
      ],
    },
    {
      title: "Grilled, Tandoor & Dry Dishes",
      items: ["Fish Tikka", "Chicken 65"],
    },
    {
      title: "Street Food & Snacks",
      items: [
        "Pav Bhaji",
        "Dosa (Plain)",
        "Masala Dosa",
        "Idli with Sambar",
        "Medu Vada",
        "Upma",
        "Poha",
      ],
    },
    {
      title: "Chutneys, Raita & Condiments",
      items: [
        "Mint Chutney",
        "Tamarind Chutney",
        "Coconut Chutney",
        "Tomato Chutney",
        "Cucumber Raita",
        "Boondi Raita",
        "Mango Pickle",
        "Lime Pickle",
      ],
    },
    {
      title: "Sides",
      items: [
        "Sambar",
        "Rasam",
        "Cabbage Stir-Fry (South Indian-Style)",
        "Spiced Potatoes (Aloo)",
        "Spiced Cauliflower (Gobi)",
      ],
    },
    {
      title: "Desserts & Sweet Baking",
      items: [
        "Gulab Jamun",
        "Rasgulla",
        "Jalebi",
        "Kheer (Rice Pudding)",
        "Gajar Halwa (Carrot Pudding)",
        "Ladoo (Besan or Motichoor)",
        "Barfi",
        "Kulfi",
        "Soan Papdi",
        "Shrikhand",
        "Mango Lassi (as a sweet drink)",
      ],
    },
    {
      title: "Drinks",
      items: [
        "Masala Chai",
        "Mango Lassi",
        "Salted Lassi",
        "Indian Spiced Lemonade (Shikanji)",
        "Rose Milk",
        "Filter Coffee (South Indian-Style)",
      ],
    },
  ];

  const middleEasternSections: Section[] = [
    {
      title: "Starters & Small Plates (Mezze)",
      items: [
        "Hummus",
        "Baba Ganoush",
        "Muhammara",
        "Labneh",
        "Tabbouleh",
        "Fattoush",
        "Greek-Style Cucumber Yogurt Dip (Tzatziki)",
        "Stuffed Grape Leaves (Dolmas)",
        "Falafel",
        "Kibbeh (Fried Bulgur Meat Croquettes)",
        "Spinach Pies (Fatayer)",
        "Meat Pies (Sfiha)",
        "Cheese Pies (Fatayer)",
        "Za’atar Flatbread (Manakish)",
        "Ful Medames",
        "Roasted Eggplant Salad",
        "Pickled Turnips",
        "Olives and Pickles",
      ],
    },
    {
      title: "Soups & Stews",
      items: [
        "Lentil Soup",
        "Chickpea Stew (Middle Eastern-Style)",
        "Lamb and Okra Stew",
        "Tomato and Vermicelli Soup",
      ],
    },
    {
      title: "Breads",
      items: [
        "Pita Bread",
        "Flatbread (Arabic-Style)",
        "Saj Bread",
        "Lavash",
        "Za’atar Flatbread (Manakish)",
      ],
    },
    {
      title: "Rice, Grains & One-Pot Dishes",
      items: [
        "Chicken Shawarma Rice Bowl",
        "Lamb Rice Pilaf",
        "Maqluba (Upside-Down Rice)",
        "Mansaf",
        "Kabsa",
        "Mandi Rice",
        "Mujadara (Lentils and Rice)",
        "Freekeh Pilaf",
        "Bulgur Pilaf",
        "Couscous (Middle Eastern-Style)",
      ],
    },
    {
      title: "Grilled & Roasted Mains",
      items: [
        "Chicken Shawarma",
        "Beef Shawarma",
        "Lamb Shawarma",
        "Chicken Kebabs (Shish Tawook)",
        "Kofta Kebabs",
        "Shish Kebab",
        "Lamb Chops (Middle Eastern-Style)",
        "Whole Roasted Chicken with Garlic and Lemon",
        "Grilled Halloumi",
      ],
    },
    {
      title: "Sauces & Condiments",
      items: [
        "Tahini Sauce",
        "Garlic Sauce (Toum)",
        "Zhoug (Spicy Herb Sauce)",
        "Harissa",
        "Amba (Mango Sauce)",
        "Pomegranate Molasses Dressing",
      ],
    },
    {
      title: "Vegetarian & Legume Dishes",
      items: [
        "Stuffed Eggplant (Vegetarian)",
        "Stuffed Bell Peppers (Middle Eastern-Style)",
        "Okra Stew (Vegetarian)",
      ],
    },
    {
      title: "Sides",
      items: [
        "Roasted Vegetables (Middle Eastern-Style)",
        "Lebanese Rice",
        "Sumac Onions",
        "Cucumber Yogurt Salad",
        "Pickled Vegetables",
      ],
    },
    {
      title: "Desserts & Sweet Baking",
      items: [
        "Baklava",
        "Kunafa",
        "Basbousa (Semolina Cake)",
        "Ma’amoul (Date Cookies)",
        "Halva (Sesame Sweet)",
        "Rice Pudding (Middle Eastern-Style)",
        "Pistachio Milk Pudding (Muhallebi)",
        "Sweet Cheese Pastry",
        "Date Cake",
        "Honey Sesame Cookies",
      ],
    },
    {
      title: "Drinks",
      items: [
        "Mint Tea",
        "Turkish Coffee",
        "Arabic Coffee",
        "Rose Water Lemonade",
        "Tamarind Drink",
        "Yogurt Drink (Ayran)",
        "Date Shake",
      ],
    },
  ];

  const mediterraneanSections: Section[] = [
    {
      title: "Mezze & Starters",
      items: [
        "Hummus",
        "Baba Ganoush",
        "Tzatziki",
        "Muhammara",
        "Olive Tapenade",
        "Marinated Olives",
        "Stuffed Grape Leaves (Dolmas)",
        "Grilled Halloumi",
        "Fried Zucchini (Mediterranean-Style)",
        "Roasted Red Pepper Dip",
      ],
    },
    {
      title: "Salads & Bowls",
      items: [
        "Greek Salad",
        "Tomato Cucumber Salad",
        "Chickpea Salad with Feta",
        "Lentil Salad (Mediterranean-Style)",
        "Tabbouleh",
        "Mediterranean Quinoa Bowl",
        "Farro Salad with Roasted Vegetables",
        "Orzo Salad with Feta and Herbs",
        "Watermelon Feta Salad",
        "Mediterranean Tuna Salad",
      ],
    },
    {
      title: "Soups",
      items: [
        "Lentil Soup",
        "Avgolemono Soup (Greek Lemon Chicken Soup)",
        "Spanish Gazpacho",
        "Chickpea and Spinach Soup",
        "Tomato Basil Soup",
      ],
    },
    {
      title: "Seafood",
      items: [
        "Grilled Fish with Lemon and Herbs",
        "Spanish Garlic Shrimp (Gambas al Ajillo)",
        "Shrimp Saganaki (Greek Tomato-Feta Shrimp)",
        "Baked Cod with Tomatoes and Olives",
        "Mediterranean Baked Salmon",
        "Mussels in Tomato and White Wine (Mediterranean-Style)",
        "Seafood Paella",
      ],
    },
    {
      title: "Chicken & Meat",
      items: [
        "Chicken Souvlaki",
        "Chicken Gyros",
        "Greek Lemon Chicken and Potatoes",
        "Lamb Kofta",
        "Grilled Lamb Chops with Herbs",
        "Beef Kebab Skewers (Mediterranean-Style)",
        "Turkey Meatballs (Mediterranean-Style)",
      ],
    },
    {
      title: "Vegetarian Mains",
      items: [
        "Baked Eggplant with Tomato",
        "Vegetable Moussaka",
        "Stuffed Bell Peppers (Mediterranean-Style)",
        "Ratatouille",
        "Roasted Vegetables with Olive Oil",
        "Chickpea and Spinach Stew",
        "Halloumi and Vegetable Skewers",
      ],
    },
    {
      title: "Grains, Pasta & Rice",
      items: [
        "Mediterranean Rice Pilaf",
        "Lemon Herb Couscous",
        "Orzo with Lemon and Herbs",
        "Whole Wheat Pasta with Olive Oil, Garlic, and Tomatoes",
        "Farro Bowl with Roasted Vegetables",
      ],
    },
    {
      title: "Sauces & Condiments",
      items: [
        "Lemon Tahini Sauce",
        "Garlic Yogurt Sauce",
        "Mediterranean Herb Sauce (Salsa Verde)",
        "Harissa (Mediterranean-Style)",
      ],
    },
    {
      title: "Desserts & Drinks",
      items: [
        "Yogurt with Honey and Nuts",
        "Baklava",
        "Greek Orange Cake (Portokalopita)",
        "Lemon Olive Oil Cake",
        "Fresh Fruit with Mint and Honey",
        "Mint Lemonade",
      ],
    },
  ];

  const americanSections: Section[] = [
    {
      title: "Starters & Appetizers",
      items: [
        "Buffalo Chicken Wings",
        "Deviled Eggs",
        "Spinach and Artichoke Dip",
        "Nachos",
        "Loaded Potato Skins",
        "Mozzarella Sticks",
        "Onion Rings",
        "Jalapeño Poppers",
        "Fried Pickles",
        "Crab Cakes",
        "Shrimp Cocktail",
        "Sliders (Mini Burgers)",
      ],
    },
    {
      title: "Soups & Chili",
      items: [
        "Chicken Noodle Soup",
        "Clam Chowder",
        "Tomato Soup",
        "Broccoli Cheddar Soup",
        "Beef Stew",
        "Classic Beef Chili",
        "White Chicken Chili",
        "Gumbo",
        "Jambalaya",
      ],
    },
    {
      title: "Salads",
      items: [
        "Caesar Salad",
        "Cobb Salad",
        "Coleslaw",
        "Macaroni Salad",
        "Potato Salad",
        "Chef Salad",
      ],
    },
    {
      title: "Sandwiches & Burgers",
      items: [
        "Classic Cheeseburger",
        "Smash Burger",
        "BBQ Pulled Pork Sandwich",
        "Philly Cheesesteak",
        "Reuben Sandwich",
        "Grilled Cheese Sandwich",
        "Club Sandwich",
        "BLT Sandwich",
        "Tuna Salad Sandwich",
        "Fried Chicken Sandwich",
        "Hot Dog",
        "Chicago-Style Hot Dog",
      ],
    },
    {
      title: "Barbecue & Grilling",
      items: [
        "BBQ Ribs",
        "Smoked Brisket",
        "Pulled Pork",
        "BBQ Chicken",
        "Grilled Steak",
        "Burgers on the Grill",
        "Smoked Sausage",
      ],
    },
    {
      title: "Comfort Food Mains",
      items: [
        "Fried Chicken",
        "Chicken and Waffles",
        "Meatloaf",
        "Mac and Cheese",
        "Chicken Pot Pie",
        "Pot Roast",
        "Beef Stroganoff (American-Style)",
        "Salisbury Steak",
        "Shepherd’s Pie (American-Style)",
        "Baked Meatballs (American-Style)",
      ],
    },
    {
      title: "Seafood Classics",
      items: [
        "Fish and Chips (American-Style)",
        "Lobster Roll",
        "Shrimp and Grits",
        "Crab Boil",
        "Fish Tacos (American-Style)",
      ],
    },
    {
      title: "Pasta & Casseroles",
      items: [
        "Baked Ziti",
        "Chicken Alfredo",
        "Tuna Noodle Casserole",
        "Green Bean Casserole",
        "Chicken and Rice Casserole",
        "Baked Mac and Cheese",
      ],
    },
    {
      title: "Breakfast & Brunch",
      items: [
        "Pancakes",
        "Waffles",
        "French Toast",
        "Biscuits and Gravy",
        "Breakfast Burrito",
        "Omelet",
        "Hash Browns",
        "Breakfast Sandwich",
      ],
    },
    {
      title: "Sides",
      items: [
        "French Fries",
        "Mashed Potatoes",
        "Baked Potato",
        "Cornbread",
        "Macaroni Salad",
        "Coleslaw",
        "Corn on the Cob",
        "Baked Beans",
        "Buttered Green Beans",
      ],
    },
    {
      title: "Sauces & Condiments",
      items: [
        "Classic BBQ Sauce",
        "Ranch Dressing",
        "Honey Mustard Sauce",
        "Buffalo Wing Sauce",
        "Gravy",
      ],
    },
    {
      title: "Desserts & Sweet Baking",
      items: [
        "Chocolate Chip Cookies",
        "Brownies",
        "Apple Pie",
        "Pumpkin Pie",
        "Pecan Pie",
        "Cheesecake",
        "Banana Bread",
        "Carrot Cake",
        "Red Velvet Cake",
        "Cinnamon Rolls",
        "Donuts",
        "Ice Cream Sundae",
      ],
    },
    {
      title: "Drinks",
      items: [
        "Classic Lemonade",
        "Iced Tea (Sweet Tea)",
        "Milkshake",
        "Hot Chocolate",
        "Root Beer Float",
      ],
    },
  ];

  const canadianSections: Section[] = [
    {
      title: "Starters & Appetizers",
      items: [
        "Poutine (Mini Style)",
        "Bacon-Wrapped Scallops",
        "Smoked Salmon Canapés",
        "Maple Glazed Wings",
        "Stuffed Mushrooms (Canadian-Style)",
        "Cheese Curds (Fried)",
        "Nanaimo Bar Bites",
        "Tourtière Hand Pies",
      ],
    },
    {
      title: "Soups & Stews",
      items: [
        "French Canadian Pea Soup",
        "Seafood Chowder (Atlantic-Style)",
        "Beef Barley Soup (Canadian-Style)",
        "Maple Mustard Pork Stew (Canadian-Style)",
      ],
    },
    {
      title: "Salads",
      items: [
        "Coleslaw (Canadian-Style)",
        "Beet and Goat Cheese Salad",
        "Smoked Salmon Salad",
        "Maple Dijon Salad",
      ],
    },
    {
      title: "Sandwiches & Handhelds",
      items: [
        "Montreal Smoked Meat Sandwich",
        "Canadian Bacon and Egg Sandwich",
        "Lobster Roll (Atlantic Canada Style)",
        "Peameal Bacon Sandwich",
        "Halifax Donair (Canadian-Style)",
      ],
    },
    {
      title: "Main Courses — Meat & Poultry",
      items: [
        "Tourtière (Meat Pie)",
        "Montreal Smoked Meat",
        "Butter Tarts (as a sweet main bake)",
        "Split Pea Soup with Ham (as a hearty main)",
        "Maple Glazed Salmon (as main)",
        "Alberta Beef Steak",
        "Maple Dijon Roast Chicken",
      ],
    },
    {
      title: "Main Courses — Seafood",
      items: [
        "Maple Glazed Salmon",
        "Cedar Plank Salmon",
        "Atlantic Lobster (Boiled)",
        "Fish Cakes (Atlantic-Style)",
        "Pan-Fried Pickerel (Walleye)",
        "Smoked Salmon Platter",
      ],
    },
    {
      title: "Comfort Foods & Regional Classics",
      items: [
        "Poutine",
        "Halifax Donair",
        "Montreal-Style Bagels",
        "Montreal Smoked Meat Sandwich",
        "Butter Tart Squares",
        "Kraft Dinner (Canadian-Style Mac and Cheese)",
      ],
    },
    {
      title: "Breakfast & Brunch",
      items: [
        "Montreal-Style Bagels",
        "Canadian Pancakes with Maple Syrup",
        "Eggs Benedict (Canadian-Style)",
        "Peameal Bacon and Eggs",
        "French Toast with Maple Syrup",
      ],
    },
    {
      title: "Sides",
      items: [
        "Cheese Curds",
        "Maple Roasted Vegetables",
        "Roasted Potatoes (Canadian-Style)",
        "Buttered Peas",
        "Coleslaw",
        "Gravy (for poutine and meats)",
      ],
    },
    {
      title: "Desserts & Sweet Baking",
      items: [
        "Nanaimo Bars",
        "Butter Tarts",
        "Maple Taffy on Snow",
        "Canadian Maple Fudge",
        "Saskatoon Berry Pie",
        "Blueberry Grunt",
        "Date Squares",
        "BeaverTails",
        "Maple Cream Cookies",
        "Apple Crumble (Canadian-Style)",
      ],
    },
    {
      title: "Drinks",
      items: [
        "Caesar Cocktail",
        "Ice Wine",
        "Maple Latte",
        "Hot Apple Cider",
        "Canadian Rye and Ginger",
      ],
    },
  ];

  const russianEasternEuropeanSections: Section[] = [
    {
      title: "Starters & Small Plates",
      items: [
        "Beet Salad with Garlic and Walnuts",
        "Eggplant Spread (Eastern European-Style)",
        "Pickled Vegetables",
        "Marinated Mushrooms",
        "Herring with Onions",
        "Smoked Fish Platter",
        "Rye Bread with Butter",
        "Potato Pancakes (Appetizer Size)",
      ],
    },
    {
      title: "Soups",
      items: [
        "Borscht (Beet Soup)",
        "Cabbage Soup (Shchi)",
        "Chicken Noodle Soup (Eastern European-Style)",
        "Mushroom Soup",
        "Sour Rye Soup",
        "Solyanka (Hearty Mixed Soup)",
      ],
    },
    {
      title: "Dumplings & Filled Dough",
      items: [
        "Russian Dumplings (Pelmeni)",
        "Potato Dumplings (Vareniki)",
        "Cheese Dumplings (Vareniki)",
        "Cabbage Dumplings (Vareniki)",
        "Pierogi (Potato and Cheese)",
        "Pierogi (Sauerkraut and Mushroom)",
        "Pierogi (Meat)",
        "Meat-Filled Pastries (Piroshki)",
        "Cabbage Piroshki",
      ],
    },
    {
      title: "Salads",
      items: [
        "Russian Olivier Salad",
        "Herring Under a Fur Coat Salad",
        "Vinegret Salad",
        "Cucumber and Dill Salad",
        "Tomato and Onion Salad",
      ],
    },
    {
      title: "Main Courses — Meat & Poultry",
      items: [
        "Beef Stroganoff",
        "Cabbage Rolls (Stuffed Cabbage)",
        "Chicken Kiev",
        "Meatballs in Cream Sauce",
        "Pork Cutlets",
        "Goulash (Eastern European-Style)",
        "Roast Pork with Garlic",
        "Sausage and Sauerkraut",
      ],
    },
    {
      title: "Main Courses — Fish",
      items: [
        "Baked Fish with Sour Cream and Dill",
        "Pan-Fried Fish Cutlets",
        "Herring with Potatoes",
        "Smoked Fish with Rye Bread",
      ],
    },
    {
      title: "Sides",
      items: [
        "Buckwheat Porridge (Kasha)",
        "Mashed Potatoes",
        "Roasted Potatoes with Dill",
        "Braised Cabbage",
        "Sauerkraut",
        "Pickles",
        "Rye Bread",
      ],
    },
    {
      title: "Breads & Savory Baking",
      items: [
        "Dark Rye Bread",
        "Braided Sweet Bread (Eastern European-Style)",
        "Savory Cheese Buns",
        "Stuffed Pastries (Piroshki)",
      ],
    },
    {
      title: "Desserts & Sweet Baking",
      items: [
        "Honey Cake (Medovik)",
        "Napoleon Cake (Eastern European-Style)",
        "Sweet Cheese Pancakes (Syrniki)",
        "Poppy Seed Roll",
        "Sweet Yeast Buns",
        "Cottage Cheese Cake",
        "Jam-Filled Cookies",
        "Fruit Dumplings (Sweet Vareniki)",
      ],
    },
    {
      title: "Drinks",
      items: [
        "Hot Tea with Lemon",
        "Kompot (Fruit Drink)",
        "Kvass",
        "Spiced Honey Drink (Sbiten)",
        "Vodka (Traditional)",
      ],
    },
  ];

  if (!data) return <Navigate to="/recipes" replace />;

  const isItalian = data.key === "italian";
  const isMexican = data.key === "mexican";
  const isBrazilian = data.key === "brazilian";
  const isPortuguese = data.key === "portuguese";
  const isJapanese = data.key === "japanese";
  const isChinese = data.key === "chinese";
  const isThai = data.key === "thai";
  const isIndian = data.key === "indian";
  const isMiddleEastern = data.key === "middle-eastern";
  const isMediterranean = data.key === "mediterranean";
  const isAmerican = data.key === "american";
  const isCanadian = data.key === "canadian";
  const isRussianEasternEuropean = data.key === "russian-eastern-european";
  const activeSections = isItalian
    ? italianSections
    : isMexican
      ? mexicanSections
      : isBrazilian
        ? brazilianSections
        : isPortuguese
          ? portugueseSections
          : isJapanese
            ? japaneseSections
            : isChinese
              ? chineseSections
              : isThai
                ? thaiSections
                : isIndian
                  ? indianSections
                  : isMiddleEastern
                    ? middleEasternSections
                    : isMediterranean
                      ? mediterraneanSections
                      : isAmerican
                        ? americanSections
                        : isCanadian
                          ? canadianSections
                          : isRussianEasternEuropean
                            ? russianEasternEuropeanSections
                      : null;
  const totalSectionLinks = activeSections
    ? activeSections.reduce((sum, s) => sum + s.items.length, 0)
    : data.recipes.length;

  return (
    <div className="min-h-screen">
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto max-w-7xl px-4 pb-16 lg:pr-[65px]">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Coluna principal (header + lista + boxes) */}
          <div className="lg:col-span-9 pr-[15px]">
            <header className="py-6">
              <nav aria-label="Breadcrumb" className="text-sm mb-2 text-muted-foreground">
                <Link to="/" className="hover:underline">Home</Link>
                <span> &gt; </span>
                <Link to="/recipes" className="hover:underline">Recipes</Link>
                <span> &gt; </span>
                <span>{data.name}</span>
              </nav>
              <div className="flex items-center gap-3">
                <CountryFlag code={data.countryCode} size={36} alt={`${data.name} flag`} />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">
                  {data.name} Recipes
                </h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  ({totalSectionLinks})
                </span>
              </div>
              {data.description && (
                <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-4xl">
                  {data.description}
                </p>
              )}
            </header>

            {/* Lista */}
            <section>
              {activeSections ? (
                <div className="space-y-10">
                  {activeSections.map((section) => (
                    <section key={section.title} className="space-y-3">
                      <h2 className="text-xl md:text-2xl font-semibold text-primary">{section.title}</h2>
                      <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
                        {(() => {
                          const mid = Math.ceil(section.items.length / 2);
                          const left = section.items.slice(0, mid);
                          const right = section.items.slice(mid);

                          const renderList = (items: string[]) => (
                            <ul className="list-disc ml-6 space-y-2.5">
                              {items.map((title) => {
                                const slug = titleToSlug.get(title) ?? slugify(title);
                                return (
                                  <li key={`${section.title}:${slug}`} className="leading-relaxed">
                                    <Link
                                      to={`/recipes/${data.key}/${slug}`}
                                      className="text-primary hover:underline text-[1.05rem] leading-7"
                                    >
                                      {title}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          );

                          return (
                            <>
                              {renderList(left)}
                              {renderList(right)}
                            </>
                          );
                        })()}
                      </div>
                    </section>
                  ))}
                </div>
              ) : data.recipes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  We’re curating recipes for this cuisine. Check back soon.
                </p>
              ) : (
                <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
                  {(() => {
                    const mid = Math.ceil(data.recipes.length / 2);
                    const left = data.recipes.slice(0, mid);
                    const right = data.recipes.slice(mid);

                    const renderList = (items: typeof data.recipes) => (
                      <ul className="list-disc ml-6 space-y-2.5">
                        {items.map((r) => (
                          <li key={r.slug} className="leading-relaxed">
                            <Link
                              to={`/recipes/${data.key}/${r.slug}`}
                              className="text-primary hover:underline text-[1.05rem] leading-7"
                            >
                              {r.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    );

                    return (
                      <>
                        {renderList(left)}
                        {renderList(right)}
                      </>
                    );
                  })()}
                </div>
              )}
            </section>

            {/* Boxes inferiores */}
            <div className="mt-14 space-y-6">
              <ShareThisPageBox />
              <SuggestionBox />
            </div>
          </div>

          {/* Coluna do right rail */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky pr-[65px]" style={{ top: "var(--skn-rail-top)" }}>
              <AdSidebarRight topOffset={0} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
