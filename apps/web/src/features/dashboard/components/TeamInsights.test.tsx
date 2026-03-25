import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import TeamInsights from "./TeamInsights";

const defaultMockData = {
    topics: [
      { id: "react", label: "React" },
      { id: "typescript", label: "TypeScript" },
      { id: "nextjs", label: "Next.js" },
    ],
    users: [],
    skills: [
      { userId: "u1", topicId: "react", value: 20 },
      { userId: "u2", topicId: "react", value: 30 },
      { userId: "u3", topicId: "typescript", value: 85 },
      { userId: "u4", topicId: "typescript", value: 90 },
      { userId: "u5", topicId: "typescript", value: 88 },
      { userId: "u6", topicId: "nextjs", value: 65 },
      { userId: "u7", topicId: "nextjs", value: 82 },
    ],
};

const mockUseSkillMatrix = vi.fn(() => ({
  skillMatrixData: defaultMockData,
  entryIdMap: new Map(),
  isLoading: false,
  isError: false,
}));

vi.mock("@/services/hooks/query/useSkillMatrix", () => ({
  useSkillMatrix: (...args: unknown[]) => mockUseSkillMatrix(...args),
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
  cleanup();
});

describe("TeamInsights", () => {

  it("renders team stats", () => {
    render(<TeamInsights />);
    const text = document.body.textContent || "";

    expect(text.includes("Expert Skills")).toBe(true);
    expect(text.includes("Team Average")).toBe(true);
    expect(text.includes("Score Range")).toBe(true);
    expect(text.includes("Need Training")).toBe(true);
  });

  it("renders insights", () => {
    render(<TeamInsights />);
    const text = document.body.textContent || "";

    expect(text.includes("Critical Skill Gap")).toBe(true);
    expect(text.includes("Team Strength")).toBe(true);
    expect(text.includes("Bus Factor Risk")).toBe(true);
  });

  it("renders priority skills", () => {
    render(<TeamInsights />);
    const text = document.body.textContent || "";

    expect(text.includes("Priority Skills to Address")).toBe(true);
    expect(text.includes("React")).toBe(true);
    expect(text.includes("TypeScript")).toBe(true);
    expect(text.includes("Next.js")).toBe(true);
  });

  it("renders scores and experts", () => {
    render(<TeamInsights />);
    const text = document.body.textContent || "";

    expect(text.includes("/100")).toBe(true);
    expect(text.includes("experts")).toBe(true);
  });

  it("handles empty data", () => {
    mockUseSkillMatrix.mockReturnValueOnce({
      skillMatrixData: { topics: [], users: [], skills: [] },
      entryIdMap: new Map(),
      isLoading: false,
      isError: false,
    });

    render(<TeamInsights />);

    const text = document.body.textContent || "";
    expect(text.includes("Team Insights & Gaps")).toBe(true);
  });

  it("covers urgency branches and impact fallback", () => {
    mockUseSkillMatrix.mockReturnValueOnce({
      skillMatrixData: {
        topics: [
          { id: "unknown_skill", label: "Unknown Skill" },
          { id: "low_many", label: "Low Many Skills" },
          { id: "mid_skill", label: "Mid Skill" },
          { id: "good_skill", label: "Good Skill" },
        ],
        users: [],
        skills: [
          { userId: "u1", topicId: "unknown_skill", value: 70 },
          ...Array.from({ length: 9 }).map((_, i) => ({
            userId: `ul${i}`,
            topicId: "low_many",
            value: 30,
          })),
          { userId: "u10", topicId: "mid_skill", value: 50 },
          { userId: "u11", topicId: "mid_skill", value: 52 },
          { userId: "u12", topicId: "good_skill", value: 70 },
          { userId: "u13", topicId: "good_skill", value: 75 },
        ],
      },
      entryIdMap: new Map(),
      isLoading: false,
      isError: false,
    });

    render(<TeamInsights />);

    const text = document.body.textContent || "";

    expect(text.includes("Professional Development")).toBe(true);
    expect(text.includes("Low Many Skills")).toBe(true);
    expect(text.includes("Mid Skill")).toBe(true);
    expect(text.includes("Good Skill")).toBe(true);
  });

  it("covers averageScore with no skills", () => {
    mockUseSkillMatrix.mockReturnValueOnce({
      skillMatrixData: {
        topics: [{ id: "empty_topic", label: "Empty Topic" }],
        users: [],
        skills: [],
      },
      entryIdMap: new Map(),
      isLoading: false,
      isError: false,
    });

    render(<TeamInsights />);

    const text = document.body.textContent || "";

    expect(text.includes("Empty Topic")).toBe(true);
    expect(text.includes("0")).toBe(true);
  });
});