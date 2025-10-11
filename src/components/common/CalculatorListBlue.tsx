import { Link } from "react-router-dom";

type Item = { title: string; to: string };
export default function CalculatorListBlue({ items }: { items: Item[] }) {
  return (
    <ul className="list-disc pl-5 space-y-2">
      {items.map((item) => (
        <li key={item.to} className="marker:text-[var(--skn-brand)]">
          <Link
            to={item.to}
            className="inline-block text-[var(--skn-brand)] underline decoration-[var(--skn-brand)] underline-offset-2 hover:decoration-2"
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}