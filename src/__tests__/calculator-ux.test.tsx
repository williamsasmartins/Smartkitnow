import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import LoanPaymentCalculator from "@/components/calculators/Financial/LoanPaymentCalculator";

// Helper to mock window.scrollY
function setScrollY(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
}

describe("Calculator box UX: visibility, positioning and scroll", () => {
  beforeEach(() => {
    // Reset scroll
    setScrollY(0);
  });

  it("keeps widget fully visible with opacity 1 and shadow", () => {
    render(<LoanPaymentCalculator />);
    const aside = screen.getByLabelText(/calculator widget/i) as HTMLElement;
    expect(aside).toBeInTheDocument();
    expect(aside.style.opacity).toBe("1");
    expect(aside.style.boxShadow).toMatch(/rgba|rgb|px/);
  });

  it("uses fixed positioning on scroll and honors top/left = 20px by default", () => {
    render(<LoanPaymentCalculator />);
    const aside = screen.getByLabelText(/calculator widget/i) as HTMLElement;
    const container = document.querySelector('[data-role="calc-grid"]') as HTMLElement;
    // Mock container rect to emulate a real column position (left=100, width=380, tall page)
    (container as any).getBoundingClientRect = () => ({ top: 0, bottom: 2000, left: 100, width: 380, right: 480 });

    // Scroll into the range where fixed should apply
    setScrollY(300);
    window.dispatchEvent(new Event("scroll"));

    expect(aside.style.position).toBe("fixed");
    expect(aside.style.top).toBe("20px");
    // left should be container.left + 20 offset = 120px
    expect(aside.style.left).toBe("120px");
  });

  it("renders correctly on small screens and does not pin to viewport left", () => {
    // Simulate mobile width
    Object.defineProperty(window, "innerWidth", { value: 375, configurable: true });
    render(<LoanPaymentCalculator />);
    const aside = screen.getByLabelText(/calculator widget/i) as HTMLElement;
    expect(aside.style.top).toBe("20px");
    expect(aside.style.left).not.toBe("0px");
  });
});