import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { createRef  } from "react";
import { Input } from "./Input";
import type { ChangeEvent } from "react";


afterEach(() => cleanup());

const renderInput = (props = {}) => render(<Input {...props} />);
const getInput = () => screen.getByRole("textbox");

describe("Input Component", () => {

  describe("Rendering", () => {

    it("renders input element", () => {
      renderInput();
      expect(getInput()).not.toBeNull();
    });

    it("renders label when provided", () => {
      renderInput({ label: "Username" });
      expect(screen.getByText("Username")).not.toBeNull();
    });

    it("does not render label when not provided", () => {
      renderInput();
      expect(screen.queryByText("Username")).toBeNull();
    });

    it("shows required asterisk when required", () => {
      renderInput({ label: "Email", required: true });
      expect(screen.getByText("*")).not.toBeNull();
    });

  });

  describe("Interaction", () => {
  it("calls onChange callback", () => {
    let value = "";

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      value = e.target.value;
    };

    renderInput({ onChange: handleChange });

    fireEvent.change(getInput(), { target: { value: "test" } });

    expect(value).toBe("test");
  });
});

  describe("Variants", () => {

    it("applies default styles", () => {
      renderInput();
      expect(getInput().className.includes("border-neutral-500")).toBe(true);
    });

    it("applies error styles", () => {
      renderInput({ error: "Invalid input" });
      expect(getInput().className.includes("border-danger-500")).toBe(true);
    });

    it("renders outlined variant", () => {
      renderInput({ variant: "outlined", label: "Outlined Input" });

      expect(getInput()).not.toBeNull();
      expect(screen.getByText("Outlined Input")).not.toBeNull();
    });

  });

  describe("Messages", () => {

    it("shows helper text", () => {
      renderInput({ helperText: "Enter username" });
      expect(screen.getByText("Enter username")).not.toBeNull();
    });

    it("shows error message", () => {
      renderInput({ error: "Invalid email" });
      expect(screen.getByText("Invalid email")).not.toBeNull();
    });

    it("hides helper text when error exists", () => {
      renderInput({ error: "Invalid", helperText: "Helper text" });
      expect(screen.queryByText("Helper text")).toBeNull();
    });

  });

  describe("Character Count", () => {

    it("shows character count", () => {
      renderInput({ showCharCount: true, maxLength: 10, value: "test" });
      expect(screen.getByText("4 / 10")).not.toBeNull();
    });

    it("shows exceeded limit style", () => {
      renderInput({ showCharCount: true, maxLength: 3, value: "hello" });

      const counter = screen.getByText("5 / 3");
      expect(counter.className.includes("text-danger-500")).toBe(true);
    });

  });

  describe("Icons", () => {

    it("renders left icon", () => {
      renderInput({ leftIcon: <span data-testid="left-icon">L</span> });
      expect(screen.getByTestId("left-icon")).not.toBeNull();
    });

    it("renders right icon", () => {
      renderInput({ rightIcon: <span data-testid="right-icon">R</span> });
      expect(screen.getByTestId("right-icon")).not.toBeNull();
    });

    it("adds padding when icons exist", () => {
      renderInput({
        leftIcon: <span>L</span>,
        rightIcon: <span>R</span>,
      });

      const input = getInput();

      expect(input.className.includes("pl-10")).toBe(true);
      expect(input.className.includes("pr-10")).toBe(true);
    });

  });

  describe("State", () => {
    it("applies custom className", () => {
      renderInput({ className: "custom-class" });
      expect(getInput().className.includes("custom-class")).toBe(true);
    });

    it("applies full width wrapper", () => {
      const { container } = renderInput({ fullWidth: true });
      expect(container.querySelector(".w-full")).not.toBeNull();
    });

  });

  describe("Accessibility", () => {

    it("adds aria-describedby when helper text exists", () => {
      renderInput({ helperText: "helper message" });

      expect(getInput().getAttribute("aria-describedby")).not.toBeNull();
    });

    it("adds aria-describedby when showCharCount is true", () => {
      renderInput({ showCharCount: true, maxLength: 10 });

      expect(getInput().getAttribute("aria-describedby")).not.toBeNull();
    });

  });

  describe("Ref Forwarding", () => {

    it("forwards ref to input element", () => {
      const ref = createRef<HTMLInputElement>();

      render(<Input ref={ref} />);

      expect(ref.current).not.toBeNull();
      expect(ref.current instanceof HTMLInputElement).toBe(true);
    });

  });

  describe("Remaining Branch Coverage", () => {

    it("renders right icon only", () => {
      renderInput({ rightIcon: <span data-testid="right">R</span> });
      expect(screen.getByTestId("right")).not.toBeNull();
    });

    it("shows required asterisk in outlined variant", () => {
      renderInput({ variant: "outlined", label: "Name", required: true });
      expect(screen.getByText("*")).not.toBeNull();
    });

    it("renders outlined input with icons", () => {
      renderInput({
        variant: "outlined",
        label: "Email",
        leftIcon: <span data-testid="left">L</span>,
        rightIcon: <span data-testid="right">R</span>,
      });

      expect(screen.getByTestId("left")).not.toBeNull();
      expect(screen.getByTestId("right")).not.toBeNull();
    });

    it("renders outlined input with error", () => {
      renderInput({ variant: "outlined", label: "Email", error: "Invalid" });
    });

    it("renders outlined input with helper text", () => {
      renderInput({ variant: "outlined", label: "Email", helperText: "Helper text" });

      expect(screen.getByText("Helper text")).not.toBeNull();
    });

    it("renders outlined input with character count", () => {
      renderInput({
        variant: "outlined",
        label: "Email",
        showCharCount: true,
        maxLength: 10,
        value: "test",
      });

      expect(screen.getByText("4 / 10")).not.toBeNull();
    });

  });

});