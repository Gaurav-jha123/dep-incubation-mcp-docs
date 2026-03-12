import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import SkillMatrixFilter from "./SkillMatrixFilter";

const mockUsers = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
];

const mockTopics = [
  { id: "t1", label: "React" },
  { id: "t2", label: "Node.js" },
];

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
      />
    );

    // Verify both generic MultiSelectSearch components are rendered with correct labels
    expect(screen.getByRole("button", { name: "Select Users" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Select Topics" })).not.toBeNull();
  });

  it("maps user data correctly and passes them to the Users filter", () => {
    render(
      <SkillMatrixFilter
        users={mockUsers}
        topics={mockTopics}
        selectedUsers={["u1"]} // Simulating one selected user
        selectedTopics={[]}
        onUsersChange={vi.fn()}
        onTopicsChange={vi.fn()}
      />
    );

    // The button should reflect the selected count
    const usersButton = screen.getByRole("button", { name: "Users ( 1 )" });
    expect(usersButton).not.toBeNull();

    // Open the dropdown to verify the options were mapped correctly 
    // from { id, name } to what the dropdown displays
    fireEvent.click(usersButton);
    expect(screen.getByText("Alice")).not.toBeNull();
    expect(screen.getByText("Bob")).not.toBeNull();
  });

  it("maps topic data correctly and passes them to the Topics filter", () => {
    render(
      <SkillMatrixFilter
        users={mockUsers}
        topics={mockTopics}
        selectedUsers={[]}
        selectedTopics={["t1", "t2"]} // Simulating two selected topics
        onUsersChange={vi.fn()}
        onTopicsChange={vi.fn()}
      />
    );

    // The button should reflect the selected count
    const topicsButton = screen.getByRole("button", { name: "Topics ( 2 )" });
    expect(topicsButton).not.toBeNull();

    // Open the dropdown to verify the options were mapped correctly
    fireEvent.click(topicsButton);
    expect(screen.getByText("React")).not.toBeNull();
    expect(screen.getByText("Node.js")).not.toBeNull();
  });
});