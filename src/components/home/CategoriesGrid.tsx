import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOME_CATEGORIES, PRIMARY_COUNT } from "@/data/home/homeCategories";
import CategoryTile from "./CategoryTile";

export default function CategoriesGrid(): JSX.Element {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const primary = HOME_CATEGORIES.slice(0, PRIMARY_COUNT);
  const extra = HOME_CATEGORIES.slice(PRIMARY_COUNT);

  return (
    <>
      <div id="categories" className="mb-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-foreground">Browse by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {primary.map((category) => (
            <CategoryTile key={category.key} category={category} />
          ))}
        </div>
      </div>

      {showAllCategories && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-4">
          {extra.map((category) => (
            <CategoryTile key={category.key} category={category} />
          ))}
        </div>
      )}

      <div className="text-center mb-6">
        <button
          onClick={() => setShowAllCategories((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-muted rounded-lg transition-colors border border-border"
        >
          {showAllCategories ? (
            <>
              Show Less
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </>
          ) : (
            <>
              Browse All {HOME_CATEGORIES.length} Categories
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </>
          )}
        </button>
      </div>

      <div className="text-center">
        <Button
          onClick={() =>
            document
              .getElementById("featured-calculators")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Discover More Calculators
        </Button>
      </div>
    </>
  );
}
