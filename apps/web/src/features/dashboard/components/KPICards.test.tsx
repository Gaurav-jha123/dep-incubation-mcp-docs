import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import KPICards from "./KPICards";

const mockData = {
  topics: [
    { id: "react", label: "React" },
    { id: "typescript", label: "TypeScript" },
    { id: "nextjs", label: "Next.js" },
  ],
  users: [
    { id: "u1", name: "User 1" },
    { id: "u2", name: "User 2" },
    { id: "u3", name: "User 3" },
  ],
  skills: [
    { userId: "u1", topicId: "react", value: 75 },
    { userId: "u2", topicId: "react", value: 80 },
    { userId: "u3", topicId: "typescript", value: 85 },
    { userId: "u1", topicId: "typescript", value: 90 },
    { userId: "u2", topicId: "nextjs", value: 70 },
    { userId: "u3", topicId: "nextjs", value: 88 },
  ],
};

const { mockUseSkillMatrix } = vi.hoisted(() => ({
  mockUseSkillMatrix: vi.fn(() => ({
    skillMatrixData: mockData,
    entryIdMap: new Map(),
    isLoading: false,
    isError: false,
  })),
}));

vi.mock("@/services/hooks/query/useSkillMatrix", () => ({
  useSkillMatrix: mockUseSkillMatrix,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const expectCardValue = (label: string, expectedValue: string) => {
  const labelNode = screen.getAllByText(label)[0];
  const card = labelNode.closest("div");

  expect(card).toBeTruthy();
  expect(within(card as HTMLElement).getByText(expectedValue)).toBeTruthy();
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("KPICards", () => {
  it("renders all KPI card labels", () => {
    render(<KPICards />, { wrapper: createWrapper() });

    expect(screen.getByText("Total Users")).toBeTruthy();
    expect(screen.getByText("Topics")).toBeTruthy();
    expect(screen.getByText("Total Skills")).toBeTruthy();
    expect(screen.getByText("Skills per User")).toBeTruthy();
    expect(screen.getByText("Topics Covered")).toBeTruthy();
  });

  it("renders KPI values based on skillMatrix data", () => {
    const totalUsers = mockData.users.length;
    const totalTopics = mockData.topics.length;
    const totalSkills = mockData.skills.length;
    const avgSkillsPerUser = (totalSkills / totalUsers).toFixed(1);

    render(<KPICards />, { wrapper: createWrapper() });

    expectCardValue("Total Users", String(totalUsers));
    expectCardValue("Topics", String(totalTopics));
    expectCardValue("Total Skills", String(totalSkills));
    expectCardValue("Skills per User", avgSkillsPerUser);
    expectCardValue("Topics Covered", String(totalTopics));
  });
});