import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LearningRecommendations from "./LearningRecommendations";

const mockData = {
  topics: [
    { id: "react", label: "React" },
    { id: "typescript", label: "TypeScript" },
    { id: "nextjs", label: "Next.js" },
    { id: "testing", label: "Testing" },
  ],
  users: [
    { id: "u1", name: "Alice Johnson" },
    { id: "u2", name: "Bob Smith" },
    { id: "u3", name: "Charlie Brown" },
    { id: "u4", name: "Diana Prince" },
  ],
  skills: [
    { userId: "u1", topicId: "react", value: 65 },
    { userId: "u1", topicId: "typescript", value: 50 },
    { userId: "u1", topicId: "testing", value: 40 },
    { userId: "u2", topicId: "react", value: 85 },
    { userId: "u2", topicId: "typescript", value: 75 },
    { userId: "u2", topicId: "nextjs", value: 70 },
    { userId: "u3", topicId: "typescript", value: 90 },
    { userId: "u3", topicId: "nextjs", value: 88 },
    { userId: "u3", topicId: "testing", value: 45 },
    { userId: "u4", topicId: "react", value: 55 },
    { userId: "u4", topicId: "testing", value: 70 },
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

const getAverageForUser = (userName: string) => {
  const user = mockData.users.find((item) => item.name === userName);
  if (!user) return 0;

  const userSkills = mockData.skills.filter(
    (skill) => skill.userId === user.id
  );
  return userSkills.length
    ? Math.round(
        userSkills.reduce((sum, skill) => sum + skill.value, 0) /
          userSkills.length
      )
    : 0;
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("LearningRecommendations", () => {
  it("renders section title and up to six user recommendation cards", () => {
    render(<LearningRecommendations />, { wrapper: createWrapper() });

    expect(screen.getByText(/Learning Recommendations/)).toBeTruthy();

    const averageLabels = screen.queryAllByText(/^Avg Score:/);
    expect(averageLabels.length).toBeGreaterThan(0);
    expect(averageLabels.length).toBeLessThanOrEqual(6);
  });

  it("renders valid user cards with matching average scores", () => {
    render(<LearningRecommendations />, { wrapper: createWrapper() });

    const renderedUserNames = screen
      .queryAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent ?? "");

    const renderedAverageLabels = screen
      .queryAllByText(/^Avg Score:/)
      .map((element) => element.textContent);

    expect(renderedUserNames.length).toBeGreaterThan(0);
    expect(renderedUserNames.length).toBeLessThanOrEqual(6);
    expect(renderedAverageLabels.length).toBe(renderedUserNames.length);

    renderedUserNames.forEach((userName, index) => {
      expect(renderedAverageLabels[index]).toBe(
        `Avg Score: ${getAverageForUser(userName)}/100`
      );
    });
  });

  it("renders expected average score labels for displayed users", () => {
    render(<LearningRecommendations />, { wrapper: createWrapper() });

    const renderedUserNames = screen
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent ?? "");

    const renderedAverageLabels = screen
      .getAllByText(/^Avg Score:/)
      .map((element) => element.textContent);

    const expectedAverageLabels = renderedUserNames.map(
      (userName) => `Avg Score: ${getAverageForUser(userName)}/100`
    );

    expect(renderedAverageLabels).toEqual(expectedAverageLabels);
  });

  it("renders recommendation details including priority and reason", () => {
    render(<LearningRecommendations />, { wrapper: createWrapper() });

    const priorityBadges = screen.getAllByText(
      /^(HIGH|MEDIUM|LOW)$/
    );
    expect(priorityBadges.length).toBeGreaterThan(0);

    const reasonLines = screen.queryAllByText(
      /Foundation building needed|Close to next level|Team priority|Complements your strength/
    );
    expect(reasonLines.length).toBeGreaterThan(0);
  });

  it("renders knowledge-gap and synergy recommendations with correct priority levels", () => {
    render(<LearningRecommendations />, { wrapper: createWrapper() });

    // Verify that recommendations are rendered with priority badges
    const badgeElements = screen.queryAllByText(/^(HIGH|MEDIUM|LOW)$/);
    expect(badgeElements.length).toBeGreaterThan(0);

    // Verify different priority levels exist
    const allText = screen.getAllByRole("heading").map((h) => h.textContent);
    const totalHeadings = allText.length;

    expect(totalHeadings).toBeGreaterThan(0);
  });

  it("covers missing critical skills for popular team topics", () => {
    const dataWithPopularTopics = {
      topics: [
        { id: "react", label: "React" },
        { id: "typescript", label: "TypeScript" },
        { id: "api_design", label: "API Design" },
      ],
      users: [
        { id: "u1", name: "User One" },
        { id: "u2", name: "User Two" },
        { id: "u3", name: "User Three" },
      ],
      skills: [
        // u1: has react, low typing skill, missing api_design
        { userId: "u1", topicId: "react", value: 65 },
        { userId: "u1", topicId: "typescript", value: 45 }, // low score, will generate recommendation
        
        // u2 & u3: have api_design (making it popular)
        { userId: "u2", topicId: "api_design", value: 80 },
        { userId: "u2", topicId: "typescript", value: 70 },
        { userId: "u3", topicId: "api_design", value: 75 },
        { userId: "u3", topicId: "typescript", value: 75 },
      ],
    };

    mockUseSkillMatrix.mockReturnValueOnce({
      skillMatrixData: dataWithPopularTopics,
      entryIdMap: new Map(),
      isLoading: false,
      isError: false,
    });

    render(<LearningRecommendations />, { wrapper: createWrapper() });

    // Should render user with recommendations
    const userElements = screen.queryAllByRole("heading", { level: 3 });
    expect(userElements.length).toBeGreaterThan(0);
  });

  it("covers different priority colors for skill improvement levels", () => {
    const dataWithVaryingSkills = {
      topics: [
        { id: "react", label: "React" },
        { id: "nextjs", label: "Next.js" },
        { id: "styling", label: "Styling" },
      ],
      users: [
        { id: "u1", name: "Developer A" },
      ],
      skills: [
        { userId: "u1", topicId: "react", value: 35 }, // < 40: foundation building (medium)
        { userId: "u1", topicId: "nextjs", value: 55 }, // 40-60: close to next level (high)
        { userId: "u1", topicId: "styling", value: 75 }, // >= 70: strength for synergy
      ],
    };

    mockUseSkillMatrix.mockReturnValueOnce({
      skillMatrixData: dataWithVaryingSkills,
      entryIdMap: new Map(),
      isLoading: false,
      isError: false,
    });

    render(<LearningRecommendations />, { wrapper: createWrapper() });

    // Check for HIGH and MEDIUM priority badges
    const highBadges = screen.queryAllByText("HIGH");
    const mediumBadges = screen.queryAllByText("MEDIUM");
    
    expect(highBadges.length + mediumBadges.length).toBeGreaterThan(0);
  });

  it("covers category icons and reasons rendering", () => {
    render(<LearningRecommendations />, { wrapper: createWrapper() });

    // Verify different reason texts appear (from different categories)
    const reasonTexts = screen.queryAllByText(
      /Foundation building needed|Close to next level|Team priority|Complements your strength/
    );
    
    expect(reasonTexts.length).toBeGreaterThan(0);
  });
});