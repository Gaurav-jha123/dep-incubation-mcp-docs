import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import SkillDistribution from "./SkillDistribution";
import type { ReactNode } from "react";

/* ---------------- MOCK recharts ---------------- */
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: (props: { data: { name: string; value: number }[] }) => {
    return (
      <div data-testid="pie">
        {props.data.map((item, index) => (
          <div key={index}>
            <span>{item.name}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    );
  },
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

/* ---------------- MOCK skillMatrix  ---------------- */
vi.mock("@/mocks/skillMatrix", () => ({
  default: {
    skills: [
      { value: 20 },
      { value: 50 },
      { value: 70 },
      { value: 90 },
      { value: 35 },
      { value: 60 },
    ],
  },
}));

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe("SkillDistribution", () => {

  it("renders chart components", () => {
    render(<SkillDistribution />);

    expect(screen.getAllByTestId("responsive-container")[0]).toBeTruthy();
    expect(screen.getAllByTestId("pie-chart")[0]).toBeTruthy();
    expect(screen.getAllByTestId("pie")[0]).toBeTruthy();
    expect(screen.getAllByTestId("tooltip")[0]).toBeTruthy();
    expect(screen.getAllByTestId("legend")[0]).toBeTruthy();
  });

  it("validates distribution counts", () => {
    render(<SkillDistribution />);

    const pie = screen.getAllByTestId("pie")[0];
    const text = pie.textContent || "";

    expect(text.includes("Beginner (0-40)")).toBe(true);
    expect(text.includes("Intermediate (41-60)")).toBe(true);
    expect(text.includes("Advanced (61-80)")).toBe(true);
    expect(text.includes("Expert (81-100)")).toBe(true);

    expect(text.includes("2")).toBe(true);
    expect(text.includes("1")).toBe(true);
  });

  it("renders all labels", () => {
    render(<SkillDistribution />);

    expect(screen.getByText(/Beginner \(0-40\)/)).toBeTruthy();
    expect(screen.getByText(/Intermediate \(41-60\)/)).toBeTruthy();
    expect(screen.getByText(/Advanced \(61-80\)/)).toBeTruthy();
    expect(screen.getByText(/Expert \(81-100\)/)).toBeTruthy();
  });
});