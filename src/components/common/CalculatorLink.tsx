import { Link } from "react-router-dom";

type Props = { to: string; children: React.ReactNode; className?: string };

export default function CalculatorLink({ to, children, className }: Props) {
  return (
    <Link to={to} className={["skn-link-readmore", className].filter(Boolean).join(" ")}>
      {children}
    </Link>
  );
}