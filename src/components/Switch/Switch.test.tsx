
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Switch } from "./Switch";

afterEach(() => {
    cleanup();
});

describe("Switch Component", () => {
    it("renders the switch component", () => {
        render(<Switch checked={false} onChange={() => { }} />);
        const switchEl = screen.getByRole("switch");
        expect(switchEl).toBeDefined();
    });

    it("applies the checked state correctly", () => {
        render(<Switch checked={true} onChange={() => { }} />);
        const switchEl = screen.getByRole("switch");
        expect(switchEl.className.includes("bg-blue-500")).toBe(true);
    });

    it("applies the unchecked state correctly", () => {
        render(<Switch checked={false} onChange={() => { }} />);
        const switchEl = screen.getByRole("switch");
        expect(switchEl.className.includes("bg-gray-300")).toBe(true);
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
        render(<Switch checked={false} onChange={() => { }} className="my-class" />);
        const switchEl = screen.getByRole("switch");
        expect(switchEl.className.includes("my-class")).toBe(true);
    });
});