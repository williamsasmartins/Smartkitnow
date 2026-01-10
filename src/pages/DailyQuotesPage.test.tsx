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

  it("renders the hub title and shows categories", async () => {
    render(
      <MemoryRouter>
        <DailyQuotesPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Daily Inspiration Hub" })
    ).toBeInTheDocument();

    expect(screen.getByText("Daily Horoscope")).toBeInTheDocument();
  });

  it("does not render the horoscope widget by default", async () => {
    render(
      <MemoryRouter>
        <DailyQuotesPage />
      </MemoryRouter>
    );

    expect(
      screen.queryByRole("heading", { level: 2, name: /Choose your sign/i })
    ).not.toBeInTheDocument();
  });

  it("is rendered when navigating to /daily-quotes in the app router", async () => {
    render(
      <MemoryRouter initialEntries={["/daily-quotes"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { level: 1, name: "Daily Inspiration Hub" })
    ).toBeInTheDocument();
  });
});

describe("/daily-quotes/horoscopo", () => {
  beforeEach(() => {
    mockFetchOk();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the horoscope calculator when navigating in the app router", async () => {
    render(
      <MemoryRouter initialEntries={["/daily-quotes/horoscopo"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());

    expect(
      await screen.findByRole("heading", { level: 2, name: /Choose your sign/i })
    ).toBeInTheDocument();

    const nav = screen.getByRole("navigation", {
      name: /daily quotes navigation/i,
    });
    const links = within(nav).getAllByRole("link");
    expect(links[0]).toHaveTextContent("Horoscope");
  });
});
