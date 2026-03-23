
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Badge } from "./Badge";

afterEach(() => {
  cleanup();
});

describe("Badge Component", () => {
  it("renders badge text correctly", () => {
    render(<Badge text="Hello" />);
    const el = screen.getByText("Hello");
    expect(el).toBeDefined();
  });

  it("applies correct variant classes", () => {
    const variants: Record<string, string> = {
      default: "bg-primary-200 text-primary-900",
      success: "bg-success-200 text-success-900",
      warning: "bg-warning-200 text-warning-900",
      error: "bg-danger-200 text-danger-900",
      info: "bg-neutral-200 text-neutral-900",
    };

    Object.entries(variants).forEach(([variant, classes]) => {
      render(<Badge text="Test" variant={variant as 'default' | 'success' | 'warning' | 'error' | 'info'} />);
      const el = screen.getByText("Test");
      expect(el.className).toContain(classes.split(" ")[0]);
      cleanup();
    });
  });

  it("applies custom className", () => {
    render(<Badge text="Custom" className="my-class" />);
    const el = screen.getByText("Custom");
    expect(el.className).toContain("my-class");
  });

  it("uses default variant classes when variant is not provided", () => {
    render(<Badge text="Default variant" />);
    const el = screen.getByText("Default variant");
    expect(el.className).toContain("bg-primary-200");
    expect(el.className).toContain("text-primary-900");
  });

  it("falls back to default variant classes for an unknown variant", () => {
    render(
      <Badge text="Fallback" variant={"unknown" as unknown as "default"} />,
    );
    const el = screen.getByText("Fallback");
    expect(el.className).toContain("bg-primary-200");
    expect(el.className).toContain("text-primary-900");
  });

  it("renders span without info and button with info", () => {
    const { rerender } = render(<Badge text="Element" />);
    expect(screen.getByText("Element").tagName).toBe("SPAN");

    rerender(<Badge text="Element" info="More info" />);
    expect(screen.getByText("Element").tagName).toBe("BUTTON");
  });

  // 4️⃣ Info popover shows when info prop is provided
  it("renders popover panel when info prop is provided", async () => {
    render(<Badge text="Info" info="Popover content" />);
    const button = screen.getByText("Info");

    fireEvent.click(button);

    const panel = await screen.findByText("Popover content");
    expect(panel).toBeDefined();
  });

  it("popover panel disappears when clicking outside", async () => {
    render(
      <div>
        <Badge text="Info" info="Popover content" />
        <button>Outside</button>
      </div>,
    );

    const button = screen.getByText("Info");

    fireEvent.click(button);
    const panel = await screen.findByText("Popover content");
    expect(panel).toBeDefined();

    const outside = screen.getByText("Outside");
    fireEvent.click(outside);

    const hiddenPanel = await screen.findByText("Popover content");
    expect(hiddenPanel).toBeDefined();
  });
});
