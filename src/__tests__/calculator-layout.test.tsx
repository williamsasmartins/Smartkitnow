import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoanPaymentCalculator from "@/components/calculators/Financial/LoanPaymentCalculator";
import CreditCardInterestCalculator from "@/components/calculators/Financial/CreditCardInterestCalculator";

describe("Unified calculator layout", () => {
  it("applies layout to LoanPaymentCalculator (title, widget, disclaimer)", () => {
    render(<LoanPaymentCalculator />);

    // H1 title rendered
    const h1 = screen.getByRole("heading", { level: 1, name: /loan payment calculator/i });
    expect(h1).toBeInTheDocument();

    // Widget aside exists
    const widgetAside = screen.getByLabelText(/calculator widget/i);
    expect(widgetAside).toBeInTheDocument();

    // Disclaimer rendered by layout
    expect(screen.getByRole("note", { name: /important notice/i })).toBeInTheDocument();
  });

  it("preserves functionality in CreditCardInterestCalculator and uses unified layout", async () => {
    const user = userEvent.setup();
    render(<CreditCardInterestCalculator />);

    // Title and sticky widget present
    const h1 = screen.getByRole("heading", { level: 1, name: /credit card interest calculator/i });
    expect(h1).toBeInTheDocument();
    const widgetAside = screen.getByLabelText(/calculator widget/i);
    expect(widgetAside).toBeInTheDocument();

    // Enter values and calculate (inputs are numeric without htmlFor; use role)
    const inputs = screen.getAllByRole("spinbutton");
    await user.type(inputs[0], "1000"); // Balance
    await user.type(inputs[1], "20");   // APR
    await user.type(inputs[2], "30");   // Days
    await user.click(screen.getByRole("button", { name: /calculate/i }));

    // Result should be a number formatted (≈ $16.44)
    const resultSection = await screen.findByRole("heading", { level: 3, name: /result/i });
    const container = resultSection.parentElement as HTMLElement;
    const resultText = container.querySelector("p");
    expect(resultText).toBeTruthy();
    expect(resultText!.textContent || "").toMatch(/\$\d+\.\d{2}/);

    // Right rail sponsored block exists
    expect(screen.getByText(/sponsored/i)).toBeInTheDocument();
  });

  it("sets sticky top style for widget aside", () => {
    render(<LoanPaymentCalculator />);
    const aside = screen.getByLabelText(/calculator widget/i) as HTMLElement;
    // Inline top style should reflect default 20px
    expect(aside.style.top).toMatch(/20px/);
  });
});