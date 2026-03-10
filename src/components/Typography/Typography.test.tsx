
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Typography } from "./Typography";

afterEach(() => {
    cleanup();
});

describe("Typography Component", () => {
    // 1️ Rendering Test
    it("should render children text", () => {
        render(<Typography>Hello</Typography>);
        const el = screen.getByText("Hello");
        expect(el).toBeDefined(); // Basic check without jest-dom
    });

    // 2️ Default Variant Test
    it("should render with body style by default", () => {
        render(<Typography>Text</Typography>);
        const el = screen.getByText("Text");
        expect(el.className).toContain("text-base");
    });

    // 3️ Variant Styling Tests
    const variants: Array<[string, string]> = [
        ["h1", "text-4xl"],
        ["h2", "text-3xl"],
        ["h3", "text-2xl"],
        ["h4", "text-xl"],
        ["h5", "text-lg"],
        ["h6", "text-base"],
        ["body", "text-base"],
        ["caption", "text-sm"],
    ];

    variants.forEach(([variant, expectedClass]) => {
        it(`should apply correct class for variant ${variant}`, () => {
            render(<Typography variant={variant as any}>Heading</Typography>);
            const el = screen.getByText("Heading");
            expect(el.className).toContain(expectedClass);
        });
    });

    // 4️ Custom ClassName Test
    it("should apply custom className", () => {
        render(<Typography className="custom-class">Text</Typography>);
        const el = screen.getByText("Text");
        expect(el.className).toContain("custom-class");
    });

    // 5️ Icon Rotation Test (for collapsible Typography)
    it("Chevron icon should rotate when panel opens", () => {
        render(<Typography collapsible>Expand</Typography>);

        const button = screen.getAllByRole("button").find((btn) =>
            btn.textContent?.includes("Expand")
        );
        if (!button) throw new Error("Button not found");

        const icon = button.querySelector("svg");
        expect(icon?.className.baseVal).not.toContain("rotate-180");

        fireEvent.click(button);

        expect(icon?.className.baseVal).toContain("rotate-180");
    });
});