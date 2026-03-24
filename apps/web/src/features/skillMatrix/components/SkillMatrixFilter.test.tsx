import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SkillMatrixFilter from "./SkillMatrixFilter";

const mockUsers = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
];

const mockTopics = [
  { id: "t1", label: "React" },
  { id: "t2", label: "Node.js" },
];

// NEW mocks for score filter
const mockScoreFilters: string[] = [];
const mockOnScoreFilterChange = vi.fn();
const mockOnUserCreate = vi.fn();
const mockOnTopicCreate = vi.fn();


afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SkillMatrixFilter", () => {
  it("renders both Users and Topics filters", () => {
    render(
      <SkillMatrixFilter
        users={mockUsers}
        topics={mockTopics}
        selectedUsers={[]}
        selectedTopics={[]}
        onUsersChange={vi.fn()}
        onTopicsChange={vi.fn()}
        onUserCreate={mockOnUserCreate}
        onTopicCreate={mockOnTopicCreate}
        scoreFilters={mockScoreFilters}
        onScoreFilterChange={mockOnScoreFilterChange}
      />
    );

    // Verify both generic MultiSelectSearch components are rendered with correct labels
    expect(screen.getByText("Select Users")).toBeDefined();
    expect(screen.getByText("Select Topics")).toBeDefined();
    
    expect(screen.getByRole("button", { name: "Select Users" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Select Topics" })).toBeDefined();
    expect(screen.getAllByRole("button", { name: "Add" })).toHaveLength(2);
  });

  it("maps user data correctly and passes them to the Users filter", async () => {
    const user = userEvent.setup();

    render(
      <SkillMatrixFilter
        users={mockUsers}
        topics={mockTopics}
        selectedUsers={["u1"]} // Simulating one selected user
        selectedTopics={[]}
        onUsersChange={vi.fn()}
        onTopicsChange={vi.fn()}
        onUserCreate={mockOnUserCreate}
        onTopicCreate={mockOnTopicCreate}
        scoreFilters={mockScoreFilters}
        onScoreFilterChange={mockOnScoreFilterChange}
      />
    );

    // The button should show Users label and count badge
    expect(screen.getByText("Users")).toBeDefined();
    expect(screen.getByText("1")).toBeDefined(); // Count badge

    // Open the dropdown to verify the options were mapped correctly 
    // from { id, name } to what the dropdown displays
    await user.click(screen.getByRole("button", { name: /Users/ }));
    expect(screen.getByText("Alice")).toBeDefined();
    expect(screen.getByText("Bob")).toBeDefined();
  });

  it("maps topic data correctly and passes them to the Topics filter", async () => {
    const user = userEvent.setup();

    render(
      <SkillMatrixFilter
        users={mockUsers}
        topics={mockTopics}
        selectedUsers={[]}
        selectedTopics={["t1", "t2"]} // Simulating two selected topics
        onUsersChange={vi.fn()}
        onTopicsChange={vi.fn()}
        onUserCreate={mockOnUserCreate}
        onTopicCreate={mockOnTopicCreate}
        scoreFilters={mockScoreFilters}
        onScoreFilterChange={mockOnScoreFilterChange}
      />
    );

    // The button should show Topics label and count badge
    expect(screen.getByText("Topics")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined(); // Count badge

    // Open the dropdown to verify the options were mapped correctly
    await user.click(screen.getByRole("button", { name: /Topics/ }));
    expect(screen.getByText("React")).toBeDefined();
    expect(screen.getByText("Node.js")).toBeDefined();
  });
});