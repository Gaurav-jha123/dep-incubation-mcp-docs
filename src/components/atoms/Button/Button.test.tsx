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
    });
    it("shows spinner and disables button when loading", () => {
      render(<Button isLoading>Submit</Button>);

      const button = screen.getByRole("button") as HTMLButtonElement;

      expect(button.disabled).toBe(true);
      expect(screen.getByText("Submit")).not.toBeNull();
      expect(screen.getByTestId("spinner")).not.toBeNull();
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
