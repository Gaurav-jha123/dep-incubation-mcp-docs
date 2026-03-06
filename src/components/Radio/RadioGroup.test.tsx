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
        const radio = screen.getByLabelText(option.label);
        expect(radio).not.toBeNull();
        expect((radio as HTMLInputElement).value).toBe(option.value);
      });
    });
    it("applies disabled attribute correctly", () => {
      render(<RadioGroup name="group1" options={options} />);
      const disabledRadio = screen.getByLabelText(
        "Option C",
      ) as HTMLInputElement;
      expect(disabledRadio.disabled).toBe(true);
    });
    it("applies custom className to wrapper", () => {
      render(
        <RadioGroup
          name="group1"
          options={options}
          className="custom-group"
          data-testid="radio-group-wrapper"
        />,
      );
      const wrapper = screen.getByTestId("radio-group-wrapper");
      expect(wrapper.className.includes("custom-group")).toBe(true);
    });
  });

  describe("controlled behavior", () => {
    it("checks the radio matching controlled value", () => {
      render(<RadioGroup name="group1" options={options} value="b" />);
      const radioB = screen.getByLabelText("Option B") as HTMLInputElement;
      expect(radioB.checked).toBe(true);
    });

    it("calls onChange when a radio is clicked", () => {
      const handleChange = vi.fn();
      render(
        <RadioGroup name="group1" options={options} onChange={handleChange} />,
      );

      const radioA = screen.getByLabelText("Option A");
      fireEvent.click(radioA);
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith("a");
    });
  });

  describe("uncontrolled behavior (defaultValue)", () => {
    it("checks defaultValue initially", () => {
      render(<RadioGroup name="group1" options={options} defaultValue="a" />);
      const radioA = screen.getByLabelText("Option A") as HTMLInputElement;
      expect(radioA.checked).toBe(true);
    });

    it("updates selection when another radio is clicked", () => {
      render(<RadioGroup name="group1" options={options} defaultValue="a" />);
      const radioB = screen.getByLabelText("Option B") as HTMLInputElement;
      const radioA = screen.getByLabelText("Option A") as HTMLInputElement;

      fireEvent.click(radioB);

      expect(radioB.checked).toBe(true);
      expect(radioA.checked).toBe(false);
    });
  });

  describe("size prop", () => {
    it("passes size to child radios", () => {
      render(<RadioGroup name="group1" options={options} size="lg" />);
      const radioA = screen.getByLabelText("Option A");
      expect(radioA.className.includes("h-5")).toBe(true);
      expect(radioA.className.includes("w-5")).toBe(true);
    });
  });
});
