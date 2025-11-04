import CalculatorLink from "@/components/common/CalculatorLink";

type Item = { title: string; to: string };

export default function CalculatorList({ items }: { items: Item[] }) {
  return (
    <ul className="list-disc pl-5 space-y-2">
      {items.map((it) => (
        <li key={it.to}>
          <CalculatorLink to={it.to}>{it.title}</CalculatorLink>
        </li>
      ))}
    </ul>
  );
}