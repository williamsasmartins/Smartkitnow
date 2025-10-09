import { Link } from "react-router-dom";

type Item = { title: string; to: string };

export default function CalculatorList({ items }: { items: Item[] }) {
  return (
    <ul className="skn-calc-list">
      {items.map((it) => (
        <li key={it.to}>
          <Link to={it.to} className="skn-calc-link">{it.title}</Link>
        </li>
      ))}
    </ul>
  );
}