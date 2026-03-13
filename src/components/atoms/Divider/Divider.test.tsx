import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Divider } from "./Divider";

afterEach(() => {
  cleanup();
});

describe("Divider", () => {
  describe("rendering", () => {
    it("renders horizontally by default", () => {
      render(<Divider data-testid="divider" />);
      const divider = screen.getByTestId("divider");
      
      expect(divider.className).toContain("h-[1px]");
      expect(divider.className).toContain("w-full");
    });

    it("renders vertically when specified", () => {
      render(<Divider orientation="vertical" data-testid="divider" />);
      const divider = screen.getByTestId("divider");
      
      expect(divider.className).toContain("h-full");
      expect(divider.className).toContain("w-[1px]");
    });
  });

  describe("accessibility", () => {
    it("is decorative by default (hidden from screen readers)", () => {
      render(<Divider data-testid="divider" />);
      const divider = screen.getByTestId("divider");
      
      expect(divider.getAttribute("role")).toBe("none");
      expect(divider.hasAttribute("aria-orientation")).toBe(false);
    });

    it("applies separator role and orientation when not decorative", () => {
      render(
        <Divider 
          decorative={false} 
          orientation="vertical" 
          data-testid="divider" 
        />
      );
      const divider = screen.getByTestId("divider");
      
      expect(divider.getAttribute("role")).toBe("separator");
      expect(divider.getAttribute("aria-orientation")).toBe("vertical");
    });
  });

  describe("attributes and styling", () => {
    it("merges custom classNames correctly and resolves tailwind conflicts", () => {
      render(
        <Divider 
          className="bg-red-500 my-custom-class" 
          data-testid="divider" 
        />
      );
      
      const divider = screen.getByTestId("divider");
      expect(divider.className).toContain("my-custom-class");
      expect(divider.className).toContain("bg-red-500"); 
      
      // tailwind-merge should successfully remove the conflicting default bg-border
      expect(divider.className).not.toContain("bg-border"); 
    });
  });
});