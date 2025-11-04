import * as React from "react";
import { Link, type LinkProps } from "react-router-dom";
import clsx from "clsx";

/**
 * Link padrão para nomes de calculadoras:
 * - Azul #3c83f6
 * - Sem underline por padrão
 * - Underline no hover, bem próximo do texto (offset 1px) e fino (1px)
 * - Acessível no foco
 * - Cor consistente em visited
 */
export default function CalculatorLink({
  className,
  children,
  ...props
}: LinkProps & { className?: string; children: React.ReactNode }) {
  return (
    <Link
      {...props}
      className={clsx(
        // cor
        "text-[#3c83f6] visited:text-[#3c83f6]",
        // underline só no hover, bem próximo e fino
        "hover:underline hover:decoration-[#3c83f6] hover:underline-offset-[1px] decoration-1",
        // acessibilidade
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3c83f6]/60",
        // transição suave
        "transition-colors",
        className
      )}
    >
      {children}
    </Link>
  );
}