import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Polyfill window.matchMedia for components relying on theme or media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Polyfill IntersectionObserver used by some components (ads, menus, lazy loading)
class MockIntersectionObserver {
  constructor(callback: any, options?: any) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error Polyfill for IntersectionObserver
(globalThis as any).IntersectionObserver = (globalThis as any).IntersectionObserver || MockIntersectionObserver;

// Polyfill ResizeObserver used by UI components
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error Polyfill for ResizeObserver
(globalThis as any).ResizeObserver = (globalThis as any).ResizeObserver || MockResizeObserver;

// Ensure scrollTo and scrollIntoView exist in JSDOM
// @ts-expect-error Mocking window.scrollTo
window.scrollTo = vi.fn();
// @ts-expect-error Mocking scrollIntoView
(HTMLElement.prototype as any).scrollIntoView = (HTMLElement.prototype as any).scrollIntoView || vi.fn();

// Optional: Silence console.error noise from React Router during tests to focus on assertions
// vi.spyOn(console, 'error').mockImplementation(() => {});
// Optional: Silence console.warn noise if needed
// vi.spyOn(console, 'warn').mockImplementation(() => {});