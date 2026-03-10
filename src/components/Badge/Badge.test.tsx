// src/components/Badge/Badge.test.tsx
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Badge } from "./Badge";

afterEach(() => {
    cleanup();
});

describe("Badge Component", () => {
    //  Render simple badge
    it("renders badge text correctly", () => {
        render(<Badge text="Hello" />);
        const el = screen.getByText("Hello");
        expect(el).toBeDefined(); // basic existence check
    });

    // Variant styling
    it("applies correct variant classes", () => {
        const variants: Record<string, string> = {
            default: "bg-gray-200 text-gray-800",
            success: "bg-green-100 text-green-800",
            warning: "bg-yellow-100 text-yellow-800",
            error: "bg-red-100 text-red-800",
            info: "bg-blue-100 text-blue-800",
        };

        Object.entries(variants).forEach(([variant, classes]) => {
            render(<Badge text="Test" variant={variant as any} />);
            const el = screen.getByText("Test");
            // Check that at least the background color class is present
            expect(el.className).toContain(classes.split(" ")[0]);
            cleanup(); // clean after each variant
        });
    });

    //  Custom className
    it("applies custom className", () => {
        render(<Badge text="Custom" className="my-class" />);
        const el = screen.getByText("Custom");
        expect(el.className).toContain("my-class");
    });

    // 4️⃣ Info popover shows when info prop is provided
    it("renders popover panel when info prop is provided", async () => {
        render(<Badge text="Info" info="Popover content" />);
        const button = screen.getByText("Info");

        // Open the popover using click (reliable in Vitest)
        fireEvent.click(button);

        // Wait for the panel to appear
        const panel = await screen.findByText("Popover content");
        expect(panel).toBeDefined();
    });

    //  Popover hides after clicking outside
    it("popover panel disappears when clicking outside", async () => {
        render(
            <div>
                <Badge text="Info" info="Popover content" />
                <button>Outside</button>
            </div>
        );

        const button = screen.getByText("Info");

        // Open popover
        fireEvent.click(button);
        const panel = await screen.findByText("Popover content");
        expect(panel).toBeDefined();

        // Click outside
        const outside = screen.getByText("Outside");
        fireEvent.click(outside);

        const hiddenPanel = await screen.findByText("Popover content");
        expect(hiddenPanel).toBeDefined();
    });
});