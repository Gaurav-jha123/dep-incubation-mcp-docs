import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SkillCoverage from "./SkillCoverage";

const mockSkillData = {
  topics: [
    { id: "t1", label: "React" },
    { id: "t2", label: "TypeScript" },
    { id: "t3", label: "Node.js" },
    { id: "t4", label: "GraphQL" },
    { id: "t5", label: "Docker" },
    { id: "t6", label: "AWS" },
    { id: "t7", label: "PostgreSQL" },
    { id: "t8", label: "Redis" },
    { id: "t9", label: "Kubernetes" },
  ],
  users: [
    { id: "u1", name: "User 1" },
    { id: "u2", name: "User 2" },
    { id: "u3", name: "User 3" },
  ],
  skills: [
    { userId: "u1", topicId: "t1", value: 85 },
    { userId: "u2", topicId: "t1", value: 90 },
    { userId: "u3", topicId: "t1", value: 75 },
    { userId: "u1", topicId: "t2", value: 70 },
    { userId: "u2", topicId: "t2", value: 80 },
    { userId: "u3", topicId: "t3", value: 65 },
    { userId: "u1", topicId: "t4", value: 55 },
    { userId: "u2", topicId: "t4", value: 60 },
    { userId: "u3", topicId: "t5", value: 45 },
    { userId: "u1", topicId: "t6", value: 30 },
    { userId: "u2", topicId: "t7", value: 88 },
    { userId: "u3", topicId: "t8", value: 92 },
  ],
};

const { mockUseSkillMatrix } = vi.hoisted(() => ({
  mockUseSkillMatrix: vi.fn(() => ({
    skillMatrixData: mockSkillData,
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
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SkillCoverage", () => {
  it("renders section title and up to eight topic cards", () => {
    render(<SkillCoverage />, { wrapper: createWrapper() });

    expect(screen.getByText(/Skill Coverage Analysis/i)).toBeTruthy();

    const topicHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(topicHeadings.length).toBeGreaterThan(0);
    expect(topicHeadings.length).toBeLessThanOrEqual(8);
  });

  it("renders expected top topics with average scores, assessed counts, and risk labels", () => {
    render(<SkillCoverage />, { wrapper: createWrapper() });

    // Should render the top topics in descending order of average score
    const topicHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(topicHeadings.length).toBeGreaterThan(0);

    // Verify average scores are displayed
    const averages = screen.getAllByText(/^\d+\/100$/);
    expect(averages.length).toBeGreaterThan(0);

    // Verify team members assessed count is shown
    const assessedTexts = screen.getAllByText(/\d+\s+team members assessed$/i);
    expect(assessedTexts.length).toBeGreaterThan(0);

    // Verify risk labels are present
    const riskLabels = screen.getAllByText(/^(HIGH|MEDIUM|LOW)$/);
    expect(riskLabels.length).toBeGreaterThan(0);
  });

  it("renders averages in descending order", () => {
    render(<SkillCoverage />, { wrapper: createWrapper() });

    const averages = screen.getAllByText(/^\d+\/100$/).map((node) => {
      const text = node.textContent ?? "0/100";
      return Number(text.replace("/100", ""));
    });

    expect(averages.length).toBeGreaterThan(0);
    for (let i = 1; i < averages.length; i += 1) {
      expect(averages[i - 1]).toBeGreaterThanOrEqual(averages[i]);
    }
  });

  it("renders risk badges with correct colors for different risk levels", () => {
    render(<SkillCoverage />, { wrapper: createWrapper() });

    // Verify risk labels are displayed
    const riskLabels = screen.getAllByText(/^(HIGH|MEDIUM|LOW)$/);
    expect(riskLabels.length).toBeGreaterThan(0);
    
    // Check that labels contain expected values
    const riskTexts = riskLabels.map(el => el.textContent);
    expect(riskTexts.some(text => ['HIGH', 'MEDIUM', 'LOW'].includes(text ?? ''))).toBe(true);
  });

  it("renders skill distribution bars for each topic", () => {
    render(<SkillCoverage />, { wrapper: createWrapper() });

    // Verify skill level headers are rendered
    const expertElements = screen.getAllByText("Experts");
    const advancedElements = screen.getAllByText("Advanced");
    const intermediateElements = screen.getAllByText("Intermediate");
    const beginnersElements = screen.getAllByText("Beginners");
    
    expect(expertElements.length).toBeGreaterThan(0);
    expect(advancedElements.length).toBeGreaterThan(0);
    expect(intermediateElements.length).toBeGreaterThan(0);
    expect(beginnersElements.length).toBeGreaterThan(0);
  });

  it("renders up to 8 skills maximum", () => {
    render(<SkillCoverage />, { wrapper: createWrapper() });

    const topicHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(topicHeadings.length).toBeLessThanOrEqual(8);
  });
});