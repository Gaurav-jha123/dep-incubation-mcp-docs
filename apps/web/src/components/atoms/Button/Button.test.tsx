import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { createRef } from "react";
import { Button } from "./Button";

afterEach(() => {
  cleanup();
});

describe("Button Component", () => {
  describe("rendering", () => {
    it("renders button", () => {
      render(<Button>Click</Button>);
      expect(screen.getByRole("button")).not.toBeNull();
    });

    it("renders children correctly", () => {
      render(<Button>Submit</Button>);
      expect(screen.getByText("Submit")).not.toBeNull();
    });
  });

  describe("variants", () => {
    it.each([
      ["primary", ["bg-primary-500", "text-neutral-900", "hover:bg-primary-700", "active:bg-primary-900", "data-[pseudo-state=hover]:shadow-lg", "data-[pseudo-state=hover]:scale-[1.02]"]],
      ["secondary", ["border-neutral-200", "bg-neutral-50", "text-neutral-700"]],
      ["danger", ["bg-danger-500", "hover:bg-danger-700", "active:bg-danger-900"]],
      ["ghost", ["text-neutral-700", "hover:bg-neutral-200"]],
      ["outline", ["border-primary-500", "text-primary-900"]],
      ["link", ["text-primary-900", "hover:underline", "data-[pseudo-state=active]:opacity-80"]],
    ] as const)("applies %s variant classes", (variant, expectedClasses) => {
      render(<Button variant={variant}>Variant</Button>);
      const button = screen.getByRole("button");

      expectedClasses.forEach((expectedClass) => {
        expect(button.className.includes(expectedClass)).toBe(true);
      });
    });
  });

  describe("sizes", () => {
    it("applies sm size classes", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");

      expect(button.className.includes("px-3")).toBe(true);
      expect(button.className.includes("text-sm")).toBe(true);
    });

    it("applies md size classes by default", () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole("button");

      expect(button.className.includes("px-4")).toBe(true);
      expect(button.className.includes("text-base")).toBe(true);
    });

    it("applies lg size classes", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button");

      expect(button.className.includes("px-6")).toBe(true);
      expect(button.className.includes("text-lg")).toBe(true);
    });
  });

  describe("interaction", () => {
    it("calls onClick when clicked", () => {
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click</Button>);
      const button = screen.getByRole("button");

      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("disabled state", () => {
    it("applies disabled attribute", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button") as HTMLButtonElement;

      expect(button.disabled).toBe(true);
    });
  });

  describe("loading state", () => {
    it("disables button when loading", () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole("button") as HTMLButtonElement;

      expect(button.disabled).toBe(true);
      expect(button.getAttribute("aria-busy")).toBe("true");
    });
    it("shows spinner and disables button when loading", () => {
      render(<Button isLoading>Submit</Button>);

      const button = screen.getByRole("button") as HTMLButtonElement;

      expect(button.disabled).toBe(true);
      expect(screen.getByText("Submit")).not.toBeNull();
      expect(screen.getByTestId("spinner")).not.toBeNull();
    });
  });

  describe("pseudo states", () => {
    it("applies a data attribute for pseudo state previews", () => {
      render(<Button pseudoState="hover">Preview</Button>);
      const button = screen.getByRole("button");

      expect(button.getAttribute("data-pseudo-state")).toBe("hover");
    });

    it("applies focus pseudo state previews", () => {
      render(<Button pseudoState="focus">Preview</Button>);
      const button = screen.getByRole("button");

      expect(button.getAttribute("data-pseudo-state")).toBe("focus");
    });

    it("applies focus-visible pseudo state previews", () => {
      render(<Button pseudoState="focus-visible">Preview</Button>);
      const button = screen.getByRole("button");

      expect(button.getAttribute("data-pseudo-state")).toBe("focus-visible");
    });

    it("disables the button for disabled pseudo state previews", () => {
      render(<Button pseudoState="disabled">Preview</Button>);
      const button = screen.getByRole("button") as HTMLButtonElement;

      expect(button.disabled).toBe(true);
      expect(button.getAttribute("data-pseudo-state")).toBe("disabled");
    });

    it("omits pseudo state data attribute by default", () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole("button");

      expect(button.hasAttribute("data-pseudo-state")).toBe(false);
    });
  });

  describe("customization", () => {
    it("applies custom className", () => {
      render(<Button className="custom-class">Styled</Button>);
      const button = screen.getByRole("button");

      expect(button.className.includes("custom-class")).toBe(true);
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to button element", () => {
      const ref = createRef<HTMLButtonElement>();

      render(<Button ref={ref}>Ref Button</Button>);

      expect(ref.current).not.toBeNull();
      expect(ref.current instanceof HTMLButtonElement).toBe(true);
    });
  });
});
