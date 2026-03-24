import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Typography, type TypographyVariant } from "./Typography";

afterEach(() => {
  cleanup();
});

describe("Typography Component", () => {
  it("should render children text", () => {
    render(<Typography>Hello</Typography>);
    const el = screen.getByText("Hello");
    expect(el).toBeDefined();
  });

  it("should render with body style by default", () => {
    render(<Typography>Text</Typography>);
    const el = screen.getByText("Text");
    expect(el.className).toContain("text-base");
  });

  const variants: Array<[TypographyVariant, string]> = [
    ["h1", "text-4xl"],
    ["h2", "text-3xl"],
    ["h3", "text-2xl"],
    ["h4", "text-xl"],
    ["h5", "text-lg"],
    ["h6", "text-base"],
    ["lead", "text-lg"],
    ["overline", "uppercase"],
    ["body", "text-base"],
    ["caption", "text-sm"],
  ];

  variants.forEach(([variant, expectedClass]) => {
    it(`should apply correct class for variant ${variant}`, () => {
      render(<Typography variant={variant}>Heading</Typography>);
      const el = screen.getByText("Heading");
      expect(el.className).toContain(expectedClass);
    });
  });

  it("should apply custom className", () => {
    render(<Typography className="custom-class">Text</Typography>);
    const el = screen.getByText("Text");
    expect(el.className).toContain("custom-class");
  });

  it("Chevron icon should rotate when panel opens", () => {
    render(<Typography collapsible>Expand</Typography>);

    const button = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent?.includes("Expand"));
    if (!button) throw new Error("Button not found");

    const icon = button.querySelector("svg");
    expect(icon?.className.baseVal).not.toContain("rotate-180");

    fireEvent.click(button);

    expect(icon?.className.baseVal).toContain("rotate-180");
  });

  it("applies pseudo state data attributes for static typography", () => {
    render(
      <Typography variant="h4" pseudoState="focus-visible">
        Preview
      </Typography>,
    );

    const el = screen.getByText("Preview");

    expect(el.getAttribute("data-pseudo-state")).toBe("focus-visible");
  });

  it("disables collapsible typography for disabled pseudo state previews", () => {
    render(
      <Typography collapsible pseudoState="disabled">
        Preview
      </Typography>,
    );

    const button = screen.getByRole("button") as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button.getAttribute("data-pseudo-state")).toBe("disabled");
  });
});
