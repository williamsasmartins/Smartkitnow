import { useParams, Link } from "react-router-dom";
import { petsSlugs } from "@/data/slugMaps";

export default function PetsSubCategory() {
  const { subcategory } = useParams();
  const items = (subcategory && petsSlugs[subcategory]) ?? [];

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Pets · {subcategory}</h1>
        <p className="text-muted-foreground">Nada encontrado para esta subcategoria.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Pets · {subcategory}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <Link
            key={it.slug}
            className="rounded border px-4 py-3 hover:bg-muted/40"
            to={`/pets/${subcategory}/${it.slug}`}
          >
            {it.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
