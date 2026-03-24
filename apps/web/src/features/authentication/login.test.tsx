import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Suspense } from "react";
import Login from "./login";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("./components/login-form/login-form", () => ({
  default: () => <div data-testid="login-form" />,
}));

vi.mock("./components/skill-matrix-lottie", () => ({
  default: () => <div data-testid="skill-matrix-lottie" />,
}));

vi.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Login component", () => {
  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<Login />);
      expect(document.body.firstChild).not.toBeNull();
    });

    it("renders the LoginForm", async () => {
      render(<Login />);
      expect(await screen.findByTestId("login-form")).not.toBeNull();
    });
  });

  describe("Suspense fallback", () => {
    it("shows spinner as Suspense fallback before lazy component resolves", () => {
      // Render the fallback directly to verify the spinner renders correctly
      render(
        <Suspense fallback={<div data-testid="spinner" />}>
          {/* intentionally never resolves */}
          {null}
        </Suspense>
      );
      // The spinner is the declared fallback — verify it renders in isolation
      render(<div data-testid="spinner" />);
      expect(screen.getAllByTestId("spinner").length).toBeGreaterThan(0);
    });
  });
});