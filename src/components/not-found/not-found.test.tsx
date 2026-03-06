import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import NotFound from "./not-found";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("lottie-react", () => ({
  default: ({ className, animationData }: { className: string, animationData: string }) => (
    <div
      data-testid="lottie-animation"
      data-animation={JSON.stringify(animationData)}
      className={className}
    />
  ),
}));

vi.mock("@/assets/lottie/not-found.json", () => ({
  default: { v: "5.0", mock: true },
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("NotFound", () => {
  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<NotFound />);
      expect(document.body.firstChild).not.toBeNull();
    });

    it("renders a main element", () => {
      render(<NotFound />);
      expect(screen.getByRole("main")).not.toBeNull();
    });

    it("renders the Lottie animation", () => {
      render(<NotFound />);
      expect(screen.getByTestId("lottie-animation")).not.toBeNull();
    });
  });

  describe("layout", () => {
    it("main element has correct layout classes", () => {
      render(<NotFound />);
      const main = screen.getByRole("main");
      expect(main.className).toContain("flex");
      expect(main.className).toContain("justify-center");
      expect(main.className).toContain("items-center");
      expect(main.className).toContain("w-full");
      expect(main.className).toContain("h-full");
      expect(main.className).toContain("bg-white");
    });

    it("Lottie has max-width class", () => {
      render(<NotFound />);
      const lottie = screen.getByTestId("lottie-animation");
      expect(lottie.className).toContain("max-w-lg");
    });
  });

  describe("animation data", () => {
    it("passes animation data to Lottie", () => {
      render(<NotFound />);
      const lottie = screen.getByTestId("lottie-animation");
      const animationData = JSON.parse(lottie.getAttribute("data-animation")!);
      expect(animationData).toEqual({ v: "5.0", mock: true });
    });
  });
});