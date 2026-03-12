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
    expect(screen.getByText("Select Users")).toBeDefined();
    expect(screen.getByText("Select Topics")).toBeDefined();
    
    // Verify we have two buttons
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
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

    // The button should show Users label and count badge
    expect(screen.getByText("Users")).toBeDefined();
    expect(screen.getByText("1")).toBeDefined(); // Count badge

    // Open the dropdown to verify the options were mapped correctly 
    // from { id, name } to what the dropdown displays
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]); // First button is Users
    expect(screen.getByText("Alice")).toBeDefined();
    expect(screen.getByText("Bob")).toBeDefined();
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

    // The button should show Topics label and count badge
    expect(screen.getByText("Topics")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined(); // Count badge

    // Open the dropdown to verify the options were mapped correctly
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]); // Second button is Topics
    expect(screen.getByText("React")).toBeDefined();
    expect(screen.getByText("Node.js")).toBeDefined();
  });
});