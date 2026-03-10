import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { createRef } from "react";
import { Input } from "./Input";

afterEach(() => {
  cleanup();
});

describe("Input Component", () => {
  describe("rendering", () => {
    it("renders input element", () => {
      render(<Input />);
      const input = screen.getByRole("textbox");

      expect(input).not.toBeNull();
    });

    it("renders label when provided", () => {
      render(<Input label="Username" />);
      expect(screen.getByText("Username")).not.toBeNull();
    });

    it("does not render label when not provided", () => {
      render(<Input />);
      const label = screen.queryByText("Username");

      expect(label).toBeNull();
    });

    it("shows required asterisk when required", () => {
      render(<Input label="Email" required />);
      expect(screen.getByText("*")).not.toBeNull();
    });
  });

  describe("interaction", () => {
    it("updates value when typing", () => {
      render(<Input />);
      const input = screen.getByRole("textbox") as HTMLInputElement;

      fireEvent.change(input, { target: { value: "hello" } });

      expect(input.value).toBe("hello");
    });
  });

  describe("variants", () => {
    it("applies default variant styles", () => {
      render(<Input />);
      const input = screen.getByRole("textbox");

      expect(input.className.includes("border-gray-300")).toBe(true);
    });

    it("applies error variant when error prop is present", () => {
      render(<Input error="Invalid input" />);
      const input = screen.getByRole("textbox");

      expect(input.className.includes("border-red-500")).toBe(true);
    });

    it("applies success variant", () => {
      render(<Input variant="success" />);
      const input = screen.getByRole("textbox");

      expect(input.className.includes("border-green-500")).toBe(true);
    });
  });

  describe("sizes", () => {
    it("applies sm size classes", () => {
      render(<Input inputSize="sm" />);
      const input = screen.getByRole("textbox");

      expect(input.className.includes("text-sm")).toBe(true);
    });

    it("applies md size classes by default", () => {
      render(<Input />);
      const input = screen.getByRole("textbox");

      expect(input.className.includes("text-base")).toBe(true);
    });

    it("applies lg size classes", () => {
      render(<Input inputSize="lg" />);
      const input = screen.getByRole("textbox");

      expect(input.className.includes("text-lg")).toBe(true);
    });
  });

  describe("messages", () => {
    it("shows helper text when provided", () => {
      render(<Input helperText="Enter your username" />);
      expect(screen.getByText("Enter your username")).not.toBeNull();
    });

    it("shows error message when error prop is provided", () => {
      render(<Input error="Invalid email" />);
      expect(screen.getByText("Invalid email")).not.toBeNull();
    });

    it("does not show helper text when error exists", () => {
      render(<Input error="Invalid" helperText="Helper text" />);

      expect(screen.queryByText("Helper text")).toBeNull();
    });
  });

  describe("icons", () => {
    it("renders left icon", () => {
      render(<Input leftIcon={<span data-testid="left-icon">L</span>} />);

      expect(screen.getByTestId("left-icon")).not.toBeNull();
    });

    it("renders right icon", () => {
      render(<Input rightIcon={<span data-testid="right-icon">R</span>} />);

      expect(screen.getByTestId("right-icon")).not.toBeNull();
    });
  });

  describe("disabled state", () => {
    it("applies disabled attribute", () => {
      render(<Input disabled />);
      const input = screen.getByRole("textbox") as HTMLInputElement;

      expect(input.disabled).toBe(true);
    });
  });

  describe("customization", () => {
    it("applies custom className", () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole("textbox");

      expect(input.className.includes("custom-class")).toBe(true);
    });

    it("applies full width class when fullWidth is true", () => {
      const { container } = render(<Input fullWidth />);
      const wrapper = container.querySelector(".w-full");

      expect(wrapper).not.toBeNull();
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to input element", () => {
      const ref = createRef<HTMLInputElement>();

      render(<Input ref={ref} />);

      expect(ref.current).not.toBeNull();
      expect(ref.current instanceof HTMLInputElement).toBe(true);
    });
  });
});
