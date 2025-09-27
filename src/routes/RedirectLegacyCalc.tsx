// /src/routes/RedirectLegacyCalc.tsx
import { Navigate, useParams } from "react-router-dom";

export default function RedirectLegacyCalc({ base }: { base: string }) {
  const { subcategory, calculator } = useParams();
  const to = `/${base}/${subcategory ?? ""}/${calculator ?? ""}`;
  return <Navigate to={to} replace />;
}
