// src/components/BackButton.tsx
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  /** Caminho preferido quando não dá para usar history.back() dentro do app */
  fallback?: string;
  className?: string;
  children?: React.ReactNode;
};

function computeAutoFallback(pathname: string, fallback?: string) {
  if (fallback) return fallback;

  // Regra especial: qualquer rota /math/... volta para /math
  if (pathname.startsWith("/math/")) return "/math";

  // Regra geral: volta para a categoria raiz (ex.: /financial, /health, etc.)
  // Ex.: /financial/interest-and-loan-calculators/loan-calculator -> /financial
  const segs = pathname.split("/").filter(Boolean);
  if (segs.length >= 1) return `/${segs[0]}`;

  return "/";
}

/**
 * Botão Back padronizado (azul pela classe .skn-back).
 * - Se houver histórico navegável dentro do mesmo domínio, usa navigate(-1)
 * - Caso contrário, cai no fallback automático:
 *   - /math/... -> /math
 *   - Demais rotas -> /{categoria}
 */
export default function BackButton({
  fallback,
  className = "",
  children = "Back",
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const autoFallback = React.useMemo(
    () => computeAutoFallback(location.pathname, fallback),
    [location.pathname, fallback]
  );

  const handleClick = React.useCallback(() => {
    const inAppHistory =
      typeof document !== "undefined" &&
      document.referrer &&
      (() => {
        try {
          const ref = new URL(document.referrer);
          return ref.origin === window.location.origin;
        } catch {
          return false;
        }
      })();

    if (window.history.length > 1 && inAppHistory) {
      navigate(-1);
    } else {
      navigate(autoFallback, { replace: true });
    }
  }, [navigate, autoFallback]);

  return (
    <Button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 skn-back ${className}`}
    >
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      <span>{children}</span>
    </Button>
  );
}
