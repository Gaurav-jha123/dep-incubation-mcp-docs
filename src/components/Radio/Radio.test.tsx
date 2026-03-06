import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { createRef } from "react";
import { Radio } from "./Radio";

afterEach(() => {
  cleanup();
});

describe("Radio Component", () => {
  describe("rendering", () => {
    it("renders radio input", () => {
      render(<Radio />);
      const radio = screen.getByRole("radio");
      expect(radio).not.toBeNull();
    });

    it("renders label when provided", () => {
      render(<Radio label="Option 1" />);
      expect(screen.getByText("Option 1")).not.toBeNull();
    });

    it("does not render label when label is not provided", () => {
      render(<Radio />);
      const label = screen.queryByText("Option 1");
      expect(label).toBeNull();
    });
  });

  describe("interaction", () => {
    it("becomes checked when clicked", () => {
      render(<Radio />);
      const radio = screen.getByRole("radio") as HTMLInputElement;

      fireEvent.click(radio);

      expect(radio.checked).toBe(true);
    });

    it("calls onChange when clicked", () => {
      const handleChange = vi.fn();

      render(<Radio onChange={handleChange} />);
      const radio = screen.getByRole("radio");

      fireEvent.click(radio);

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("allows clicking the label to check the radio", () => {
      render(<Radio label="Option A" />);
      const label = screen.getByText("Option A");
      const radio = screen.getByRole("radio") as HTMLInputElement;

      fireEvent.click(label);

      expect(radio.checked).toBe(true);
    });
  });

  describe("disabled state", () => {
    it("applies disabled attribute", () => {
      render(<Radio disabled = {true}/>);
      const radio = screen.getByRole("radio") as HTMLInputElement;

      expect(radio.disabled).toBe(true);
    });
  });

  describe("sizes", () => {
    it("applies sm size classes", () => {
      render(<Radio size="sm" />);
      const radio = screen.getByRole("radio");

      expect(radio.className.includes("h-3")).toBe(true);
      expect(radio.className.includes("w-3")).toBe(true);
    });

    it("applies md size classes by default", () => {
      render(<Radio />);
      const radio = screen.getByRole("radio");

      expect(radio.className.includes("h-4")).toBe(true);
      expect(radio.className.includes("w-4")).toBe(true);
    });

    it("applies lg size classes", () => {
      render(<Radio size="lg" />);
      const radio = screen.getByRole("radio");

      expect(radio.className.includes("h-5")).toBe(true);
      expect(radio.className.includes("w-5")).toBe(true);
    });
  });

  describe("customization", () => {
    it("applies custom className", () => {
      render(<Radio className="custom-class" />);
      const radio = screen.getByRole("radio");

      expect(radio.className.includes("custom-class")).toBe(true);
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to input element", () => {
      const ref = createRef<HTMLInputElement>();

      render(<Radio ref={ref} />);

      expect(ref.current).not.toBeNull();
      expect(ref.current instanceof HTMLInputElement).toBe(true);
    });
  });
});