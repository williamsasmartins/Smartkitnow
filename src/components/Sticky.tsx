import React from "react";

/**
 * Sticky
 * - Cola o conteúdo no topo no desktop.
 * - top ajustável.
 */
export default function Sticky({
  top = 88,
  children,
  className = "",
}: {
  top?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`hidden lg:block ${className}`}>
      <div className="lg:sticky" style={{ top }}>
        {children}
      </div>
    </div>
  );
}