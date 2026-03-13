import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { RadioGroup } from "./RadioGroup";

afterEach(() => {
  cleanup();
});

describe("RadioGroup Component", () => {
  const options = [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
    { label: "Option C", value: "c", disabled: true },
  ];

  describe("rendering", () => {
    it("renders all options", () => {
      render(<RadioGroup name="group1" options={options} />);
      options.forEach((option) => {
        const radio = screen.getByRole("radio", { name: option.label });
        expect(radio).not.toBeNull();
        expect(radio.getAttribute("aria-checked")).toBe("false");
      });
    });

    it("applies disabled attribute correctly", () => {
      render(<RadioGroup name="group1" options={options} />);
      const disabledRadio = screen.getByRole("radio", { name: "Option C" });
      expect(disabledRadio.getAttribute("aria-disabled")).toBe("true");
    });

    it("applies custom className to radio group", () => {
      render(
        <RadioGroup name="group1" options={options} className="custom-group" />,
      );
      const radio = screen.getByTestId("radio-group");
      expect(radio.className.includes("custom-group")).toBe(true);
    });
  });

  describe("controlled behavior", () => {
    it("checks the radio matching controlled value", () => {
      render(<RadioGroup name="group1" options={options} value="b" />);
      const radioB = screen.getByRole("radio", { name: "Option B" });
      expect(radioB.getAttribute("aria-checked")).toBe("true");
    });

    it("calls onChange when a radio is clicked", () => {
      const handleChange = vi.fn();
      render(
        <RadioGroup name="group1" options={options} onChange={handleChange} />,
      );
      const radioA = screen.getByRole("radio", { name: "Option A" });
      fireEvent.click(radioA);
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith("a");
    });
  });

  describe("uncontrolled behavior (defaultValue)", () => {
    it("checks defaultValue initially", () => {
      render(<RadioGroup name="group1" options={options} defaultValue="a" />);
      const radioA = screen.getByRole("radio", { name: "Option A" });
      expect(radioA.getAttribute("aria-checked")).toBe("true");
    });

    it("updates selection when another radio is clicked", () => {
      render(<RadioGroup name="group1" options={options} defaultValue="a" />);
      const radioB = screen.getByRole("radio", { name: "Option B" });

      fireEvent.click(radioB);

      const radioAUpdated = screen.getByRole("radio", { name: "Option A" });
      const radioBUpdated = screen.getByRole("radio", { name: "Option B" });

      expect(radioBUpdated.getAttribute("aria-checked")).toBe("true");
      expect(radioAUpdated.getAttribute("aria-checked")).toBe("false");
    });
  });

  describe("size prop", () => {
    it("applies correct size classes to radios", () => {
      render(<RadioGroup name="group1" options={options} size="lg" />);
      const radioA = screen.getByRole("radio", { name: "Option A" });
      const className = radioA.className;
      expect(className.includes("h-5")).toBe(true);
      expect(className.includes("w-5")).toBe(true);
    });
  });
});
