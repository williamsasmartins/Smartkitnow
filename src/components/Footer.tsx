import { Link } from "react-router-dom";

export function Footer() {
  const footerLinks = [
    { name: "About", path: "/about" },
    { name: "Terms", path: "/terms" },
    { name: "Privacy", path: "/privacy" },
    { name: "Cookies", path: "/cookies" },
    { name: "Cookie Settings", path: "/cookie-settings" },
  ];

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          {/* Footer Links */}
          <nav className="flex flex-wrap justify-center gap-6 md:justify-start">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm text-muted-foreground transition-colors hover:text-primary hover:underline"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2024 Smart Kit Now. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}