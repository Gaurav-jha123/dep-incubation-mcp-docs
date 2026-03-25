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
vi.mock("@/services/hooks/query/useSkillMatrix", () => ({
  useSkillMatrix: vi.fn(() => ({
    skillMatrixData: defaultMockData,
    entryIdMap: new Map(),
    isLoading: false,
    isError: false,
  })),
}));

afterEach(() => {
  vi.clearAllMocks();
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
});