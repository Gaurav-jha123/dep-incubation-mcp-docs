import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import SkillMatrixTableLegend from "./SkillMatrixTableLegend";

afterEach(() => {
  cleanup();
});

describe("SkillMatrixTableLegend", () => {
  it("renders the correct scale values", () => {
    render(<SkillMatrixTableLegend />);

    // Verify all the legend numbers are displayed
    expect(screen.getByText("100")).not.toBeNull();
    expect(screen.getByText("75")).not.toBeNull();
    expect(screen.getByText("50")).not.toBeNull();
    expect(screen.getByText("25")).not.toBeNull();
    expect(screen.getByText("0")).not.toBeNull();
  });

  it("renders the gradient bar with the correct styling", () => {
    const { container } = render(<SkillMatrixTableLegend />);

    const gradientBar = container.querySelector('.w-\\[12px\\]');
    
    expect(gradientBar).not.toBeNull();
    
    // JSDOM automatically normalizes hsl() to rgb() in inline styles
    const styleAttribute = gradientBar?.getAttribute("style");
    expect(styleAttribute).toContain("linear-gradient");
    expect(styleAttribute).toContain("rgb(82, 224, 82)"); // Converted from hsl(120,70%,60%)
    expect(styleAttribute).toContain("rgb(224, 82, 82)");   // Converted from hsl(0,70%,60%)
  });
});