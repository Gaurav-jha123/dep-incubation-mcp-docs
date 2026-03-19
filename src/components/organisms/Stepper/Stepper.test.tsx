import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Stepper from "./Stepper";

afterEach(() => {
  cleanup();
});

describe("Stepper", () => {
  const steps = [
    { title: "Account" },
    { title: "Profile" },
    { title: "Billing" },
    { title: "Confirm" },
  ];

  it("renders all steps as tabs", () => {
    render(<Stepper steps={steps} currentStep={1} />);

    expect(screen.getAllByRole("tab").length).toBe(4);
    expect(screen.getByText("Account")).not.toBeNull();
    expect(screen.getByText("Confirm")).not.toBeNull();
  });

  it("shows completed and active states in default variant", () => {
    render(<Stepper steps={steps} currentStep={1} variant="default" />);

    const tabs = screen.getAllByRole("tab");
    const activeTab = tabs[1];

    expect(tabs[0].getAttribute("aria-selected")).toBe("false");
    expect(activeTab.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Profile")).not.toBeNull();
    expect(screen.getByText("2")).not.toBeNull();
  });

  it("hides numeric/check text in minimal variant", () => {
    render(<Stepper steps={steps} currentStep={2} variant="minimal" />);

    expect(screen.queryByText("✓")).toBeNull();
    expect(screen.queryByText("1")).toBeNull();
    expect(screen.queryByText("2")).toBeNull();
    expect(screen.getByText("Billing")).not.toBeNull();
  });

  it("calls onChange with clicked step index", () => {
    const onChange = vi.fn();
    render(<Stepper steps={steps} currentStep={0} onChange={onChange} />);

    const tabs = screen.getAllByRole("tab");
    fireEvent.click(tabs[2]);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
