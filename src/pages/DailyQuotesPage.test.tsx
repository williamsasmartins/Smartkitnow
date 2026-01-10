import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DailyQuotesPage from "@/pages/DailyQuotesPage";
import App from "@/App";

function mockFetchOk(payload: unknown = { date: "Today" }) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      return {
        ok: true,
        json: async () => payload,
      } as unknown as Response;
    })
  );
}

describe("/daily-quotes", () => {
  beforeEach(() => {
    mockFetchOk();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the English title and description", async () => {
    render(<DailyQuotesPage />);

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());

    expect(
      screen.getByRole("heading", { level: 1, name: "Daily Quotes" })
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(/A clean, fast way to read your daily horoscope/i).length
    ).toBeGreaterThan(0);
  });

  it("renders navigation links starting with Horoscope", async () => {
    render(<DailyQuotesPage />);

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());

    const nav = screen.getByRole("navigation", {
      name: /daily quotes navigation/i,
    });

    const links = within(nav).getAllByRole("link");
    expect(links[0]).toHaveTextContent("Horoscope");
    expect(links[0]).toHaveAttribute("href", "#zodiac-grid");

    expect(within(nav).getByRole("link", { name: "How to read" })).toHaveAttribute(
      "href",
      "#how-to-read"
    );
    expect(
      within(nav).getByRole("link", { name: "Zodiac curiosities" })
    ).toHaveAttribute("href", "#zodiac-curiosities");
    expect(
      within(nav).getByRole("link", { name: "Zodiac signs guide" })
    ).toHaveAttribute("href", "#sign-guide");
  });

  it("exposes basic accessible landmarks and sections", async () => {
    render(<DailyQuotesPage />);

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());

    expect(
      screen.getByRole("heading", { level: 2, name: /Choose your sign/i })
    ).toBeInTheDocument();

    expect(document.getElementById("zodiac-grid")).toBeTruthy();
    expect(document.getElementById("how-to-read")).toBeTruthy();
    expect(document.getElementById("zodiac-curiosities")).toBeTruthy();
    expect(document.getElementById("sign-guide")).toBeTruthy();
  });

  it("is rendered when navigating to /daily-quotes in the app router", async () => {
    render(
      <MemoryRouter initialEntries={["/daily-quotes"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { level: 1, name: "Daily Quotes" })
    ).toBeInTheDocument();
  });
});
