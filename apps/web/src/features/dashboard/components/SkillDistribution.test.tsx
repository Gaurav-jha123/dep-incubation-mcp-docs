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

/* ---------------- MOCK useSkillMatrix ---------------- */
vi.mock("@/services/hooks/query/useSkillMatrix", () => ({
  useSkillMatrix: () => ({
    skillMatrixData: {
      users: [],
      topics: [],
      skills: [
        { userId: "u1", topicId: "t1", value: 20 },
        { userId: "u2", topicId: "t2", value: 50 },
        { userId: "u3", topicId: "t3", value: 70 },
        { userId: "u4", topicId: "t4", value: 90 },
        { userId: "u5", topicId: "t5", value: 35 },
        { userId: "u6", topicId: "t6", value: 60 },
      ],
    },
    entryIdMap: new Map(),
    isLoading: false,
    isError: false,
  }),
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