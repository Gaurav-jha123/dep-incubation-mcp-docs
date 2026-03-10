import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Slider } from "./Slider";

afterEach(() => {
  cleanup();
});

describe("Slider Component", () => {
  it("renders slider with initial value", () => {
    render(<Slider value={50} onChange={() => {}} />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeDefined();
    expect((slider as HTMLInputElement).value).toBe("50");
  });

  it("calls onChange when slider value changes", () => {
    let changedValue = 0;

    const handleChange = (value: number) => {
      changedValue = value;
    };

    render(<Slider value={20} onChange={handleChange} />);
    const slider = screen.getByRole("slider");

    fireEvent.change(slider, { target: { value: "40" } });

    expect(changedValue).toBe(40);
  });

  it("renders disabled slider", () => {
    render(<Slider value={30} onChange={() => {}} disabled />);
    const slider = screen.getByRole("slider");
    expect((slider as HTMLInputElement).disabled).toBe(true);
  });
});