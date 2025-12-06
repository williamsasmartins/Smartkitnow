import { Link } from "react-router-dom";

import { siX, siInstagram, siWhatsapp, siFacebook } from "simple-icons";
import logoImage from "@/assets/logo-skn.png";

const year = new Date().getFullYear();


const COLS: Array<{ title: string; links: { label: string; to: string }[] }> = [
  {
    title: "Calculators",
    links: [
      { label: "Cooking", to: "/cooking" },
      { label: "Conversion", to: "/conversion" },
      { label: "Math & Algebra", to: "/math" },
      { label: "Health & Fitness", to: "/health" },
      { label: "Financial", to: "/financial" },
      { label: "Pet Care", to: "/pets" },
      { label: "Science", to: "/science" },
      { label: "Time & Date", to: "/time" },
      { label: "Video", to: "/video" },
      { label: "Construction", to: "/construction" },
      { label: "Electrical", to: "/electrical" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Construction", to: "/construction" },
      { label: "Electrical", to: "/electrical" },
      { label: "Automotive", to: "/automotive" },
      { label: "Everyday Life", to: "/everyday-life" },
      { label: "Sports", to: "/sports" },
      { label: "Funny Calculators", to: "/funny" },
      { label: "TV Tools", to: "/tv" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Use", to: "/terms" },
      { label: "Cookie Settings", to: "/cookie-settings" },
    ],
  },
];

type BrandIcon = { hex: string; path: string };

export function Footer() {
  const icons = {
    x: siX,
    instagram: siInstagram,
    whatsapp: siWhatsapp,
    facebook: siFacebook,
  };

  return (
    <footer className="mt-0 border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <form action="https://formspree.io/f/xanpypnb" method="POST" className="flex items-center gap-2">
              <input type="email" name="email" required placeholder="Your email" className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-background px-3 py-2 text-sm" />
              <button type="submit" className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-3 py-2">Subscribe</button>
              <input type="hidden" name="_subject" value="Newsletter signup" />
              <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
            </form>
          <div className="pt-3">
            <Link to="/" className="inline-flex items-center gap-3">
              <picture>
                <source srcSet="/logo-smartkitnow.webp" type="image/webp" />
                <img
                  src={logoImage}
                  alt="Smart Kit Now"
                  width={1000}
                  height={300}
                  loading="lazy"
                  decoding="async"
                  className="h-8 w-auto"
                  style={{ height: "2rem", width: "auto", aspectRatio: "1000/300" }}
                />
              </picture>
            </Link>
            <div className="mt-3 flex items-center gap-3">
              <a href="https://x.com" aria-label="X / Twitter" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white hover:opacity-85 transition" style={{ backgroundColor: icons?.x ? `#${icons.x.hex}` : '#111827' }}>
                {icons?.x?.path ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d={icons.x.path} /></svg>
                ) : (
                  <span className="text-xs font-bold" aria-hidden>X</span>
                )}
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white hover:opacity-85 transition" style={{ backgroundColor: icons?.instagram ? `#${icons.instagram.hex}` : '#1f2937' }}>
                {icons?.instagram?.path ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d={icons.instagram.path} /></svg>
                ) : (
                  <span className="text-[11px] font-bold" aria-hidden>IG</span>
                )}
              </a>
              <a href="https://wa.me/" aria-label="WhatsApp" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white hover:opacity-85 transition" style={{ backgroundColor: icons?.whatsapp ? `#${icons.whatsapp.hex}` : '#374151' }}>
                {icons?.whatsapp?.path ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d={icons.whatsapp.path} /></svg>
                ) : (
                  <span className="text-xs font-bold" aria-hidden>WA</span>
                )}
              </a>
              <a href="https://facebook.com" aria-label="Facebook" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white hover:opacity-85 transition" style={{ backgroundColor: icons?.facebook ? `#${icons.facebook.hex}` : '#4b5563' }}>
                {icons?.facebook?.path ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d={icons.facebook.path} /></svg>
                ) : (
                  <span className="text-xs font-bold" aria-hidden>f</span>
                )}
              </a>
            </div>
          </div>
          </div>

          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wide text-foreground">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="inline text-primary hover:text-primary underline-offset-2 hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-4">
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-muted-foreground">© {year} Smart Kit Now. All rights reserved.</p>
            <a href="#top" className="text-primary hover:underline text-sm">Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;







