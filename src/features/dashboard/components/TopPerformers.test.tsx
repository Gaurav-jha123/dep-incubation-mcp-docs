import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import TopPerformers from "./TopPerformers";

vi.mock("@/mocks/skillMatrix", () => ({
  default: {
    users: [
      { id: "u1", name: "John Doe" },
      { id: "u2", name: "Jane Smith" },
      { id: "u3", name: "Bob Lee" },
      { id: "u4", name: "Alice Ray" },
      { id: "u5", name: "Tom Hardy" },
      { id: "u6", name: "Extra User" },
    ],
    topics: [
      { id: "react", label: "React" },
      { id: "ts", label: "TypeScript" },
      { id: "node", label: "Node" },
    ],
    skills: [
      { userId: "u1", topicId: "react", value: 90 },
      { userId: "u1", topicId: "ts", value: 85 },
      { userId: "u1", topicId: "node", value: 80 },

      { userId: "u2", topicId: "react", value: 70 },
      { userId: "u2", topicId: "ts", value: 75 },

      { userId: "u3", topicId: "react", value: 60 },
      { userId: "u3", topicId: "node", value: 65 },

      { userId: "u4", topicId: "ts", value: 50 },

      { userId: "u5", topicId: "node", value: 30 },

      { userId: "u6", topicId: "react", value: 95 },
    ],
  },
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
  cleanup();
});

describe("TopPerformers", () => {
  it("renders title", () => {
    render(<TopPerformers />);
    expect(screen.getByText("🏆 Top Performers")).toBeTruthy();
  });

  it("renders top 5 users based on score", () => {
  render(<TopPerformers />);
  const text = document.body.textContent || "";

  expect(text.includes("Extra User")).toBe(true);
  expect(text.includes("John Doe")).toBe(true);
  expect(text.includes("Jane Smith")).toBe(true);
  expect(text.includes("Bob Lee")).toBe(true);
  expect(text.includes("Alice Ray")).toBe(true);

  expect(text.includes("Tom Hardy")).toBe(false);
});

  it("calculates and displays average score", () => {
    render(<TopPerformers />);
    const text = document.body.textContent || "";

    expect(text.includes("/100")).toBe(true);
  });

  it("renders total skills per user", () => {
    render(<TopPerformers />);
    const text = document.body.textContent || "";

    expect(text.includes("skills assessed")).toBe(true);
  });

  it("renders top skills and labels", () => {
    render(<TopPerformers />);
    const text = document.body.textContent || "";

    expect(text.includes("Top Skills")).toBe(true);
    expect(text.includes("React")).toBe(true);
    expect(text.includes("TypeScript")).toBe(true);
    expect(text.includes("Node")).toBe(true);
  });

  it("renders rank icons", () => {
    render(<TopPerformers />);
    const text = document.body.textContent || "";

    expect(text.includes("👑")).toBe(true);
    expect(text.includes("🥈")).toBe(true);
    expect(text.includes("🥉")).toBe(true);
    expect(text.includes("⭐")).toBe(true);
  });

  it("renders initials correctly", () => {
    render(<TopPerformers />);
    const text = document.body.textContent || "";

    expect(text.includes("JD")).toBe(true);
    expect(text.includes("JS")).toBe(true);
  });

  it("covers unknown topic fallback", async () => {
    vi.doMock("@/mocks/skillMatrix", () => ({
      default: {
        users: [{ id: "u1", name: "Test User" }],
        topics: [],
        skills: [
          { userId: "u1", topicId: "unknown", value: 70 },
        ],
      },
    }));

    const { default: Comp } = await import("./TopPerformers");
    render(<Comp />);

    const text = document.body.textContent || "";

    expect(text.includes("unknown")).toBe(true);
  });

  it("covers user with no skills", async () => {
    vi.doMock("@/mocks/skillMatrix", () => ({
      default: {
        users: [{ id: "u1", name: "No Skill User" }],
        topics: [],
        skills: [],
      },
    }));

    const { default: Comp } = await import("./TopPerformers");
    render(<Comp />);

    const text = document.body.textContent || "";

    expect(text.includes("No Skill User")).toBe(true);
    expect(text.includes("0/100")).toBe(true);
  });

  it("covers all score color branches", async () => {
    vi.doMock("@/mocks/skillMatrix", () => ({
      default: {
        users: [
          { id: "u1", name: "High" },
          { id: "u2", name: "MidHigh" },
          { id: "u3", name: "Mid" },
          { id: "u4", name: "Low" },
        ],
        topics: [{ id: "t1", label: "T1" }],
        skills: [
          { userId: "u1", topicId: "t1", value: 85 },
          { userId: "u2", topicId: "t1", value: 65 },
          { userId: "u3", topicId: "t1", value: 45 },
          { userId: "u4", topicId: "t1", value: 20 },
        ],
      },
    }));

    const { default: Comp } = await import("./TopPerformers");
    render(<Comp />);

    const text = document.body.textContent || "";

    expect(text.includes("High")).toBe(true);
    expect(text.includes("MidHigh")).toBe(true);
    expect(text.includes("Mid")).toBe(true);
    expect(text.includes("Low")).toBe(true);
  });
});