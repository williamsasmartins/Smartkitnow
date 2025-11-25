// Registry for category: pets
import type { CalculatorEntry } from "../../calculatorRegistry";

export const registry: CalculatorEntry[] = [
  {
    slug: "cat-age-calculator-v2",
    title: "Cat Age to Human Years Calculator",
    category: "pets",
    subcategory: "cats",
    description: "Convert your cat's age to human years with breed and size awareness.",
    loader: () => import("@/components/calculators/Pets/CatAgeCalculatorV2Calculator"),
    urlStyle: "flat"
  },
];