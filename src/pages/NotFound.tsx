import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SEOHead
        title="404 • Página não encontrada"
        description="A página que você tentou acessar não existe ou foi movida."
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "404", url: location.pathname },
        ]}
      />
      <main className="text-center">
        <h1 className="mb-4 text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent" aria-live="polite">
          404
        </h1>
        <p className="mb-6 text-lg text-muted-foreground">Oops! Página não encontrada.</p>
        <Link to="/" className="inline-block rounded-md border border-border px-4 py-2 text-primary hover:bg-primary/10">
          Voltar para a Home
        </Link>
      </main>
    </div>
  );
};

export default NotFound;
