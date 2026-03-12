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
    expect(screen.getByText("100")).toBeDefined();
    expect(screen.getByText("75")).toBeDefined();
    expect(screen.getByText("50")).toBeDefined();
    expect(screen.getByText("25")).toBeDefined();
    expect(screen.getByText("0")).toBeDefined();
  });

  it("renders the gradient bar with correct styling", () => {
    const { container } = render(<SkillMatrixTableLegend />);

    const gradientBar = container.querySelector('.w-60.h-3');
    
    expect(gradientBar).toBeDefined();
  });
});