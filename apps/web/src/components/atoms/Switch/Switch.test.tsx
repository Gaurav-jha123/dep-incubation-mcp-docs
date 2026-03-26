import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Switch } from "./Switch";

afterEach(() => {
  cleanup();
});

describe("Switch Component", () => {
  it("renders the switch component", () => {
    render(<Switch checked={false} onChange={() => {}} />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toBeDefined();
  });

  it("applies the checked state correctly", () => {
    render(<Switch checked={true} onChange={() => {}} />);
    const switchEl = screen.getByRole("switch");

    expect(switchEl.getAttribute("aria-checked")).toBe("true");
  });

  it("applies the unchecked state correctly", () => {
    render(<Switch checked={false} onChange={() => {}} />);
    const switchEl = screen.getByRole("switch");

    expect(switchEl.getAttribute("aria-checked")).toBe("false");
  });

  it("calls onChange when clicked", () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} />);
    const switchEl = screen.getByRole("switch");
    fireEvent.click(switchEl);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("does not call onChange when disabled", () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} disabled />);
    const switchEl = screen.getByRole("switch");
    fireEvent.click(switchEl);
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it("applies custom className", () => {
    render(<Switch checked={false} onChange={() => {}} className="my-class" />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl.className.includes("my-class")).toBe(true);
  });

  it("applies data-pseudo-state when pseudoState is set", () => {
    render(
      <Switch checked={false} onChange={() => {}} pseudoState="hover" />
    );
    const switchEl = screen.getByRole("switch");
    expect(switchEl.getAttribute("data-pseudo-state")).toBe("hover");
  });

  it("does not apply data-pseudo-state when pseudoState is none", () => {
    render(
      <Switch checked={false} onChange={() => {}} pseudoState="none" />
    );
    const switchEl = screen.getByRole("switch");
    expect(switchEl.getAttribute("data-pseudo-state")).toBeNull();
  });

  it("applies all pseudo-state variants correctly", () => {
    const pseudoStates = ["hover", "active", "focus", "focus-visible"] as const;

    pseudoStates.forEach((state) => {
      const { unmount } = render(
        <Switch checked={false} onChange={() => {}} pseudoState={state} />
      );
      const switchEl = screen.getByRole("switch");
      expect(switchEl.getAttribute("data-pseudo-state")).toBe(state);
      unmount();
    });
  });

  it("disables the switch when pseudoState is disabled", () => {
    const onChange = vi.fn();
    render(
      <Switch
        checked={false}
        onChange={onChange}
        pseudoState="disabled"
      />
    );
    const switchEl = screen.getByRole("switch") as HTMLButtonElement;
    expect(switchEl.disabled).toBe(true);
    expect(switchEl.getAttribute("data-pseudo-state")).toBe("disabled");

    fireEvent.click(switchEl);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies correct aria-label", () => {
    render(
      <Switch checked={false} onChange={() => {}} label="Dark mode toggle" />
    );
    const switchEl = screen.getByRole("switch");
    expect(switchEl.getAttribute("aria-label")).toBe("Dark mode toggle");
  });

  it("applies default aria-label when not provided", () => {
    render(<Switch checked={false} onChange={() => {}} />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl.getAttribute("aria-label")).toBe("toggle switch");
  });

  it("applies primary color when checked", () => {
    render(<Switch checked={true} onChange={() => {}} />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl.className).toContain("bg-primary-500");
  });

  it("applies neutral color when unchecked", () => {
    render(<Switch checked={false} onChange={() => {}} />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl.className).toContain("bg-neutral-500");
  });

  it("applies opacity when disabled", () => {
    render(<Switch checked={false} onChange={() => {}} disabled />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl.className).toContain("opacity-50");
    expect(switchEl.className).toContain("cursor-not-allowed");
  });

  it("applies opacity when pseudoState is disabled", () => {
    render(
      <Switch checked={false} onChange={() => {}} pseudoState="disabled" />
    );
    const switchEl = screen.getByRole("switch");
    expect(switchEl.className).toContain("opacity-50");
    expect(switchEl.className).toContain("cursor-not-allowed");
  });

  it("applies cursor-pointer when enabled", () => {
    render(<Switch checked={false} onChange={() => {}} />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl.className).toContain("cursor-pointer");
  });

  it("does not apply cursor-pointer when disabled", () => {
    render(<Switch checked={false} onChange={() => {}} disabled />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl.className).not.toContain("cursor-pointer");
  });

  it("applies focus ring styling for focus pseudo-state", () => {
    render(
      <Switch checked={false} onChange={() => {}} pseudoState="focus" />
    );
    const switchEl = screen.getByRole("switch");
    expect(switchEl.className).toContain("focus:ring-2");
    expect(switchEl.className).toContain("focus:ring-primary-500");
  });

  it("does not call onChange when clicking while pseudoState is disabled", () => {
    const onChange = vi.fn();
    render(
      <Switch
        checked={false}
        onChange={onChange}
        pseudoState="disabled"
      />
    );
    const switchEl = screen.getByRole("switch");
    fireEvent.click(switchEl);
    expect(onChange).not.toHaveBeenCalled();
  });
});
