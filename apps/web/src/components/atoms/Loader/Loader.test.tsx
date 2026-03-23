import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Loader from "./Loader";

afterEach(() => {
  cleanup();
});

describe("Loader Component", () => {
  it("renders spinner when open is true", () => {
    render(<Loader open={true} />);
    const spinner = screen.getByTestId("loader-spinner");

    expect(spinner).not.toBeNull();
    expect(spinner.className.includes("animate-spin")).toBe(true);
    expect(spinner.className.includes("rounded-full")).toBe(true);
  });

  it("does not render spinner when open is false", () => {
    render(<Loader open={false} />);
    const spinner = screen.queryByTestId("loader-spinner");

    expect(spinner).toBeNull();
  });

  describe("sizes", () => {
    it("applies small size classes", () => {
      render(<Loader open={true} size="small" />);
      const spinner = screen.getByTestId("loader-spinner");
      const cls = spinner.className;

      expect(cls.includes("h-6")).toBe(true);
      expect(cls.includes("w-6")).toBe(true);
      expect(cls.includes("border-2")).toBe(true);
    });

    it("applies medium size classes (default)", () => {
      render(<Loader open={true} />);
      const spinner = screen.getByTestId("loader-spinner");
      const cls = spinner.className;

      expect(cls.includes("h-12")).toBe(true);
      expect(cls.includes("w-12")).toBe(true);
      expect(cls.includes("border-4")).toBe(true);
    });

    it("applies large size classes", () => {
      render(<Loader open={true} size="large" />);
      const spinner = screen.getByTestId("loader-spinner");
      const cls = spinner.className;

      expect(cls.includes("h-16")).toBe(true);
      expect(cls.includes("w-16")).toBe(true);
      expect(cls.includes("border-4")).toBe(true);
    });
  });

  describe("color and animation", () => {
    it("applies blue color class by default", () => {
      render(<Loader open={true} />);
      const spinner = screen.getByTestId("loader-spinner");
      const cls = spinner.className;

      expect(cls.includes("border-primary-500")).toBe(true);
    });

    it("always has spinner animation and rounded class", () => {
      render(<Loader open={true} />);
      const spinner = screen.getByTestId("loader-spinner");
      const cls = spinner.className;

      expect(cls.includes("rounded-full")).toBe(true);
      expect(cls.includes("animate-spin")).toBe(true);
      expect(cls.includes("border-t-transparent")).toBe(true);
    });
  });
});