import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { ThemeProvider } from "@/components/ThemeProvider";

// Helper to render App with router and theme provider
function renderApp(path: string = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("Header menu navigation", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("navega para Financial ao clicar no menu", async () => {
    renderApp("/");

    // Escopo para o nav dentro do header (landmark 'banner')
    const header = screen.getByRole("banner");
    const nav = within(header).getByRole("navigation");
    const link = within(nav).getByRole("link", { name: /financial/i });
    await userEvent.click(link);

    // FinancialCategory tem o h1 "Financial Calculators"
    expect(await screen.findByRole("heading", { level: 1, name: /financial calculators/i })).toBeInTheDocument();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("navega para Conversion e carrega entries do registry", async () => {
    renderApp("/");

    const header = screen.getByRole("banner");
    const nav = within(header).getByRole("navigation");
    const link = within(nav).getByRole("link", { name: /conversion/i });
    await userEvent.click(link);

    // CategoryIndex usa meta.display => "Conversion Calculators"
    expect(await screen.findByRole("heading", { level: 1, name: /conversion calculators/i })).toBeInTheDocument();
    // Deve renderizar ao menos um card do registry (ex.: Length Converter)
    expect(await screen.findByRole('link', { name: /length converter/i })).toBeInTheDocument();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("navega para Pets e exibe título de categoria correto", async () => {
    renderApp("/");

    const header = screen.getByRole("banner");
    const nav = within(header).getByRole("navigation");
    const link = within(nav).getByRole("link", { name: /pet care/i });
    await userEvent.click(link);

    // CategoryIndex usa meta.display => "Pet Care Calculators"
    expect(await screen.findByRole("heading", { level: 1, name: /pet care calculators/i })).toBeInTheDocument();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("abre o menu More e navega para Everyday Life", async () => {
    renderApp("/");

    const header = screen.getByRole("banner");
    const nav = within(header).getByRole("navigation");
    const moreButton = within(nav).getByRole("button", { name: /more/i });
    await userEvent.click(moreButton);

    // DropdownMenu usa portal, então buscamos no documento inteiro
    const everydayLink = await screen.findByRole("menuitem", { name: /everyday life/i });
    await userEvent.click(everydayLink);

    expect(await screen.findByRole("heading", { level: 1, name: /everyday life calculators/i })).toBeInTheDocument();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("navega para Cooking a partir do menu", async () => {
    renderApp("/");

    const header = screen.getByRole("banner");
    const nav = within(header).getByRole("navigation");
    const link = within(nav).getByRole("link", { name: /cooking/i });
    await userEvent.click(link);

    expect(await screen.findByRole("heading", { level: 1, name: /cooking calculators/i })).toBeInTheDocument();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});