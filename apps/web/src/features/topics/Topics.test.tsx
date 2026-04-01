import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import Topics from "./Topics";

const { mockUseTopics } = vi.hoisted(() => ({
  mockUseTopics: vi.fn(),
}));

vi.mock("@/services/hooks/query/useTopics", () => ({
  useTopics: mockUseTopics,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Topics component", () => {
  it("shows loading state when topics are loading", () => {
    mockUseTopics.mockReturnValue({
      topics: [],
      isLoading: true,
      isError: false,
    });

    render(<Topics />);
    expect(screen.getByText(/loading topics/i)).toBeTruthy();
  });

  it("shows error state when useTopics reports error", () => {
    mockUseTopics.mockReturnValue({
      topics: [],
      isLoading: false,
      isError: true,
    });

    render(<Topics />);
    expect(screen.getByText(/failed to load topics/i)).toBeTruthy();
  });

  it("shows topics in accordion and toggles content in successful scenario", () => {
    mockUseTopics.mockReturnValue({
      topics: [
        {
          id: "1",
          label: "React",
          subTopics: [
            {
              id: 9,
              label: "Components & Props",
              topicId: 13,
              createdAt: "2026-03-30T16:17:20.475Z",
              updatedAt: "2026-03-30T16:17:20.475Z",
            },
            {
              id: 10,
              label: "Context API",
              topicId: 13,
              createdAt: "2026-03-30T16:17:20.513Z",
              updatedAt: "2026-03-30T16:17:20.513Z",
            }
          ],
        },
        { id: "2", label: "TypeScript", subTopics: [] },
      ],
      isLoading: false,
      isError: false,
    });

    render(<Topics />);

    // Each topic heading should appear
    expect(screen.getByText("React")).toBeTruthy();
    expect(screen.getByText("TypeScript")).toBeTruthy();

    // Click a topic heading (Disclosure button) to reveal dummy content
    fireEvent.click(screen.getByText("React"));
    expect(screen.getByText(/Components & Props/i)).toBeTruthy();
    expect(screen.getByText(/Context API/i)).toBeTruthy();

    fireEvent.click(screen.getByText("TypeScript"));
    expect(screen.getByText(/No subtopics available./i)).toBeTruthy();
  });
});
