import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer", () => {
  afterEach(() => cleanup());

  it("renders without crashing", () => {
    render(<Footer />);
    expect(document.body.firstChild).not.toBeNull();
  });

  it("shows the current year and app name", () => {
    render(<Footer />);
    expect(
      screen.getByText(new RegExp(`${new Date().getFullYear()}`)),
    ).not.toBeNull();
    expect(screen.getByText(/Incubation Dashboard/)).not.toBeNull();
  });

  it("shows the version", () => {
    render(<Footer />);
    expect(screen.getByText(/Version 1.0.0/)).not.toBeNull();
  });

  it("has correct classes for layout", () => {
    const { container } = render(<Footer />);
    const footer = container.firstChild as HTMLElement;
    expect(footer.className).toContain("w-full");
    expect(footer.className).toContain("bg-white");
    expect(footer.className).toContain("flex");
    expect(footer.className).toContain("shadow-lg");
    expect(footer.className).toContain("border-t");
  });
});
