import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { Checkbox } from "./Checkbox";

afterEach(() => {
  cleanup();
});

describe("Checkbox Component", () => {

  it("renders checkbox with label", () => {
    render(<Checkbox label="Accept Terms" />);

    const label = screen.getByText("Accept Terms");
    const checkbox = screen.getByRole("checkbox");

    expect(label).toBeTruthy();
    expect(checkbox).toBeTruthy();
  });

  it("applies updated checkbox and label color classes", () => {
    render(<Checkbox label="Accept Terms" />);

    const label = screen.getByText("Accept Terms");
    const checkbox = screen.getByRole("checkbox");

    expect(label.className.includes("text-neutral-900")).toBe(true);
    expect(checkbox.className.includes("accent-primary-500")).toBe(true);
  });

  it("checkbox should be checked when checked prop is true", () => {
  render(<Checkbox label="Accept Terms" checked />);

  const checkbox = screen.getByRole("checkbox");

  expect((checkbox as HTMLInputElement).checked).toBe(true);

 });

  it("checkbox should be disabled when disabled prop is true", () => {
    render(<Checkbox label="Accept Terms" disabled />);

    const checkbox = screen.getByRole("checkbox");

    expect((checkbox as HTMLInputElement).disabled).toBe(true);
  });

  it("calls onChange when checkbox is clicked", () => {
    const handleChange = vi.fn();

    render(<Checkbox label="Accept Terms" onChange={handleChange} />);

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalled();
  });

  it("renders checkbox without label", () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeTruthy();
  });

});