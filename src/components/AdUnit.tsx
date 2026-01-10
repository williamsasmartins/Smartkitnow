import React, { useEffect } from "react";
import { useTheme } from "next-themes";

// ================================================================
// CONFIGURAÇÃO: Trocar em .env quando for aprovado
// ================================================================
// Suporte seguro para Vite (import.meta.env) e compatibilidade com NEXT_PUBLIC_*
const ENV: any = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
const ADSENSE_ENABLED = (
  (ENV.VITE_ADSENSE_ENABLED ?? ENV.NEXT_PUBLIC_ADSENSE_ENABLED ?? 'false')
) === 'true';
const ADSENSE_CLIENT_ID = (
  ENV.VITE_ADSENSE_CLIENT_ID ?? ENV.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? ''
);

// ================================================================
// TIPOS DE ANÚNCIOS PRÉ-CONFIGURADOS
// ================================================================
type AdType = 'top-banner' | 'sidebar' | 'bottom-banner' | 'in-content';

interface AdConfig {
  desktop: { width: number; height: number };
  tablet?: { width: number; height: number };
  mobile?: { width: number; height: number };
  label: string;
}

const AD_CONFIGS: Record<AdType, AdConfig> = {
  'top-banner': {
    desktop: { width: 970, height: 90 },
    tablet: { width: 728, height: 90 },
    mobile: { width: 320, height: 100 },
    label: 'Top Banner'
  },
  'sidebar': {
    desktop: { width: 300, height: 600 },
    label: 'Sidebar'
  },
  'bottom-banner': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 100 },
    label: 'Bottom Banner'
  },
  'in-content': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 100 },
    label: 'In-Content Ad'
  }
};

// ================================================================
// COMPONENTE PRINCIPAL
// ================================================================
interface AdUnitProps {
  slot: string;           // ID do slot (obrigatório para produção)
  type: AdType;           // Tipo pré-configurado
  className?: string;     // Classes Tailwind extras
}

export default function AdUnit({ slot, type, className = '' }: AdUnitProps) {
  const config = AD_CONFIGS[type];
  const { resolvedTheme } = useTheme();
  const isDark =
    resolvedTheme === "dark" ||
    (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) ||
    (typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const placeholderStyle = {
    backgroundColor: isDark ? "#0f172a" : "#f3f4f6",
    border: `2px dashed ${isDark ? "#334155" : "#e5e7eb"}`,
    color: isDark ? "#cbd5e1" : "#9ca3af",
  } as const;
  
  // ================================================================
  // MODO DESENVOLVIMENTO (Placeholder)
  // ================================================================
  if (!ADSENSE_ENABLED) {
    return (
      <div className={`skn-ad-placeholder ${className}`}>
        {/* Desktop */}
        <div 
          className="hidden lg:flex flex-col items-center justify-center mx-auto rounded-lg"
          style={{ 
            width: config.desktop.width,
            height: config.desktop.height,
            ...placeholderStyle
          }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider mb-1">
            {config.label} Space
          </span>
          <span className="text-[10px] opacity-70">
            Desktop: {config.desktop.width}×{config.desktop.height}
          </span>
        </div>

        {/* Tablet (se configurado) */}
        {config.tablet && (
          <div 
            className="hidden md:flex lg:hidden flex-col items-center justify-center mx-auto rounded-lg"
            style={{ 
              width: config.tablet.width,
              height: config.tablet.height,
              ...placeholderStyle
            }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider mb-1">
              {config.label} Space
            </span>
            <span className="text-[10px] opacity-70">
              Tablet: {config.tablet.width}×{config.tablet.height}
            </span>
          </div>
        )}

        {/* Mobile (se configurado) */}
        {config.mobile && (
          <div 
            className="flex md:hidden flex-col items-center justify-center mx-auto rounded-lg"
            style={{ 
              width: config.mobile.width,
              height: config.mobile.height,
              ...placeholderStyle
            }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider mb-1">
              {config.label} Space
            </span>
            <span className="text-[10px] opacity-70">
              Mobile: {config.mobile.width}×{config.mobile.height}
            </span>
          </div>
        )}
      </div>
    );
  }

  // ================================================================
  // MODO PRODUÇÃO (AdSense Real)
  // ================================================================
  return <AdSenseUnit slot={slot} config={config} className={className} />;
}

// ================================================================
// COMPONENTE ADSENSE REAL (Só carrega quando habilitado)
// ================================================================
interface AdSenseUnitProps {
  slot: string;
  config: AdConfig;
  className: string;
}

function AdSenseUnit({ slot, config, className }: AdSenseUnitProps) {
  useEffect(() => {
    // Carrega o script do AdSense (só uma vez)
    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.setAttribute('data-ad-client', ADSENSE_CLIENT_ID);
      document.head.appendChild(script);
    }

    // Push do anúncio
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`skn-ad-real ${className}`}>
      {/* Desktop */}
      <div className="hidden lg:flex justify-center mx-auto">
        <ins 
          className="adsbygoogle"
          style={{ 
            display: 'block',
            width: config.desktop.width,
            height: config.desktop.height
          }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      {/* Tablet */}
      {config.tablet && (
        <div className="hidden md:flex lg:hidden justify-center mx-auto">
          <ins 
            className="adsbygoogle"
            style={{ 
              display: 'block',
              width: config.tablet.width,
              height: config.tablet.height
            }}
            data-ad-client={ADSENSE_CLIENT_ID}
            data-ad-slot={slot}
            data-ad-format="auto"
          />
        </div>
      )}

      {/* Mobile */}
      {config.mobile && (
        <div className="flex md:hidden justify-center mx-auto">
          <ins 
            className="adsbygoogle"
            style={{ 
              display: 'block',
              width: config.mobile.width,
              height: config.mobile.height
            }}
            data-ad-client={ADSENSE_CLIENT_ID}
            data-ad-slot={slot}
            data-ad-format="auto"
          />
        </div>
      )}
    </div>
  );
}

// ================================================================
// TYPE DECLARATION (para window.adsbygoogle)
// ================================================================
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
